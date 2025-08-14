import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NavController, IonButton, IonCol, IonRow, IonIcon, IonList, IonContent, IonToolbar, IonHeader, IonButtons, IonBackButton, IonItem, IonInput, IonInputPasswordToggle, IonInputOtp } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { AccountService } from '../core/services/account.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginBM } from '../core/models/bm/login-bm';
import { FormType } from '../core/helpers/form-helpers';
import { filter, Subject, takeUntil } from 'rxjs';
import { logoApple, logoFacebook, logoGithub, logoGoogle, logoMicrosoft } from 'ionicons/icons';

// @ts-ignore
import packageJson from '../../../package.json';

@Component({      
    selector: 'app-sign-in',
    templateUrl: 'sign-in.page.html',
    styleUrls: ['./sign-in.page.scss'],
    standalone: true,
    imports: [IonItem, IonInputOtp, IonBackButton, IonButtons, IonHeader, IonToolbar, IonContent, IonList, IonIcon, IonRow, IonCol, IonButton, TranslateModule, ReactiveFormsModule, IonInput, IonInputPasswordToggle],
})
export class SignInPage implements OnInit {

    private unsubscribeAll = new Subject();

    loginForm: FormGroup<FormType<LoginBM>>;
    navigatedTo = false;
    logoFacebook = logoFacebook;
    logoGoogle = logoGoogle;
    logoApple = logoApple;
    logoGH = logoGithub;
    logoMS = logoMicrosoft;
    version = packageJson.version;
    otpActive = false;
    otpId;

 
    constructor(
        private router: Router,
        private accountService: AccountService,
        private formBuilder: FormBuilder,
        private navCtrl: NavController
    ) { }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]]
        });
    }

    ionViewWillEnter() {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).pipe(takeUntil(this.unsubscribeAll))
            .subscribe((event: NavigationEnd) => {
                this.navigatedTo = event.url !== '/sign-in' && event.urlAfterRedirects === '/sign-in';
            });
    }

    ionViewWillLeave() {
        this.unsubscribeAll.next(null);
        this.unsubscribeAll.complete()
    }

    close() {
        this.navCtrl.back();
    }

    register() {
        this.router.navigate(['./register']);
    }

    forgot_password() {
        this.router.navigate(['./forgot-password']);
    }

    async signIn() {
        if (this.loginForm.invalid) {
            this.loginForm.markAsDirty();
            return;
        }

        const model = this.loginForm.getRawValue();
        const data = await this.accountService.login(model);
        if (data.mfa) {
            this.otpActive = true;
            this.otpId = data.otpId;
        }
    }

    async signInFacebook() {
        await this.accountService.loginWithFacebook();
    }

    async resendOTP() {
        this.accountService.resendOTP(this.loginForm.controls.email.value);
    }

    async completeOTPLogin(e) {
        const val = e.detaihomel.value;
        await this.accountService.verifyOTP(val, this.otpId, this.loginForm.controls.email.value)
    }

    async signInGoogle() {
        await this.accountService.loginWithGoogle();
    }

}
