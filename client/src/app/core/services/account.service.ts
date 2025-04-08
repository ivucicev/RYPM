import { Injectable, signal } from '@angular/core';
import { PocketbaseService } from './pocketbase.service';
import { StorageService } from './storage.service';
import { ClientResponseError, OAuth2AuthConfig, RecordAuthResponse, RecordModel } from 'pocketbase';
import { RegisterBM } from '../models/bm/register-bm';
import { LoginBM } from '../models/bm/login-bm';
import { NavController } from '@ionic/angular';
import { VerificationStateService } from './verification-state-service';
import { ToastService } from './toast-service';
import { StorageKeys } from '../constants/storage-keys';
import { PB } from '../constants/pb-constants';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    private readonly pocketbase = this.pocketbaseService.pb;

    private _currentUser = signal(null);

    private oauthParams = {
        provider: null,
        query: { 'prompt': 'select_account' },
        urlCallback: (url) => {
            const modifiedUrl = new URL(url);
            modifiedUrl.searchParams.set('prompt', 'select_account');
            window.open(modifiedUrl.toString(), '_blank');
        }
    } as OAuth2AuthConfig;

    constructor(
        private pocketbaseService: PocketbaseService,
        private storageService: StorageService,
        private navCtrl: NavController,
        private verificationStateService: VerificationStateService,
        private toastService: ToastService
    ) {
        if (this.pocketbase.authStore.isValid) {
            this.getCurrentUser();
        }
    }

    async register(model: RegisterBM): Promise<any> {
        const data = {
            email: model.email,
            password: model.password,
            passwordConfirm: model.password,
            ...model
        };

        const record = await this.pocketbase.collection('users').create(data);
        if (!record) return;

        this.verificationStateService.setCredentials(model.email, model.password);

        // TODO: remove verification comp.: all is done on PB backend?
        // await this.navCtrl.navigateForward(['/verification']);
        this.pocketbase.collection('users').requestVerification(model.email);
        this.toastService.info('info.confirm_account');

        return record;
    }

    async login(model: LoginBM) {
        try {
            const authData = await this.pocketbase.collection('users').authWithPassword(model.email, model.password, { headers: PB.HEADER.NO_TOAST });
            await this.saveAuthToStorage(authData);

            this.navCtrl.navigateRoot(['./tabs']);
            this.toastService.success('welcome_back');

            return authData;
        } catch (error) {
            if (error instanceof ClientResponseError && error.status === 403) {
                this.verificationStateService.setCredentials(model.email, model.password);

                // await this.navCtrl.navigateForward(['/verification']);
                this.pocketbase.collection('users').requestVerification(model.email);
                this.toastService.info('info.confirm_account');

                this.verificationStateService.clearCredentials();
            } else {
                this.toastService.error('errors.invalid_email_password');
            }
            throw error;
        }
    }

    async logout() {
        this.pocketbase.authStore.clear();
        await this.storageService.removeItem(StorageKeys.TOKEN);
    }

    async loginWithFacebook() {
        const authData = await this.pocketbase.collection('users').authWithOAuth2({ ...this.oauthParams, provider: 'facebook' });
        if (!authData) return new Promise((resolve, _) => resolve(null));

        await this.saveAuthToStorage(authData);

        this.navCtrl.navigateRoot(['./tabs']);

        return authData;
    }

    async loginWithGoogle() {
        const authData = await this.pocketbase.collection('users').authWithOAuth2({ ...this.oauthParams, provider: 'google' });
        if (!authData) return new Promise((resolve, _) => resolve(null));

        await this.saveAuthToStorage(authData);

        this.navCtrl.navigateRoot(['./tabs']);

        return authData;
    }

    async confirmEmail(code: string, model: LoginBM): Promise<void> {
        const res = await this.pocketbase.collection('users').confirmVerification(code);
        if (!res) return;

        const authData = await this.pocketbase.collection('users').authWithPassword(model.email, model.password);
        if (!authData) return;

        await this.saveAuthToStorage(authData);

        this.verificationStateService.clearCredentials();

        this.navCtrl.navigateRoot(['./tabs']);
    }

    async requestPasswordReset(email: string): Promise<void> {
        this.pocketbase.collection('users').requestPasswordReset(email);

        this.toastService.info('info.password_reset');

        this.navCtrl.navigateBack('/sign-in');
    }

    async requestEmailChange(newEmail: string): Promise<void> {
        this.pocketbase.collection('users').requestEmailChange(newEmail);
        this.toastService.info('info.email_change');
    }

    isAuthenticated(): boolean {
        return this.pocketbase.authStore.isValid;
    }

    private async saveAuthToStorage(authData: RecordAuthResponse<RecordModel>): Promise<void> {
        const userMap = {
            token: authData.token,
            email: authData.record['email'],
            name: authData.record['name']
        }
        const map = await this.getAccountsMap();
        map[userMap.email] = userMap;

        await this.storageService.setItem(StorageKeys.TOKEN_MAP, map);

        await this.storageService.setItem(StorageKeys.TOKEN, userMap);
    }


    private async getAccountsMap() {
        const map = (await this.storageService.getItem<{ [key: string]: UserMap }>(StorageKeys.TOKEN_MAP)) ?? {}
        return map;
    }

    async getAvailableAccounts() {
        const map = await this.getAccountsMap();

        const user = await this.getCurrentUser();
        delete map[user.email];

        return Object.values(map);
    }

    async switchAccount(authData: UserMap) {
        await this.storageService.setItem(StorageKeys.TOKEN, authData);

        await this.attemptAutoLogin();

        this.navCtrl.navigateRoot(['./tabs']);
    }

    async updateAccountMap(user: User) {
        const map = await this.getAccountsMap();

        map[user.email].name = user.name;

        await this.storageService.setItem(StorageKeys.TOKEN_MAP, map);
    }

    async attemptAutoLogin(): Promise<boolean> {
        const authData = await this.storageService.getItem<UserMap>(StorageKeys.TOKEN);
        if (authData) {
            try {
                this.pocketbase.authStore.save(authData.token);
                await this.pocketbase.collection('users').authRefresh({ headers: PB.HEADER.NO_TOAST });

                await this.getCurrentUser(true);

                return true;
            } catch (error) {
                await this.logout();
                return false;
            }
        }
        return false;
    }

    public async getCurrentUser(reload: boolean = false): Promise<User> {
        if (this._currentUser() && !reload) return this._currentUser();

        const user = await this.pocketbase.collection('users').getOne<User>(this.pocketbase.authStore.record?.id);

        const avatarUrl = user.avatar ? (environment.apiURL + `/api/files/users/${user.id}/${user.avatar}`) : null;
        user.avatar = avatarUrl;

        this.updateAccountMap(user);

        this._currentUser.set(user);

        return user;
    }
}

export type UserMap = {
    email: string,
    token: string,
    name: string
}
