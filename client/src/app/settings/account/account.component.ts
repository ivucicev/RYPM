import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountBM } from 'src/app/core/models/bm/account-bm';
import { PB } from 'src/app/core/constants/pb-constants';
import { ErrorMessageDirective } from 'src/app/core/directives/error-message.directive';
import { FormType } from 'src/app/core/helpers/form-helpers';
import { AccountService } from 'src/app/core/services/account.service';
import { PocketbaseService } from 'src/app/core/services/pocketbase.service';
import { ToastService } from 'src/app/core/services/toast-service';
import { IonFooter, IonToolbar, IonButton, IonItem, IonList, IonContent, IonBackButton, IonHeader, IonTitle, IonButtons, IonInput, AlertController } from "@ionic/angular/standalone";

@Component({
    selector: 'app-account',
    templateUrl: 'account.component.html',
    styleUrls: ['./account.component.scss'],
    standalone: true,
    imports: [IonButtons, IonTitle, IonHeader, IonInput, IonBackButton, IonContent, IonList, IonItem, IonButton, IonToolbar, IonFooter, TranslateModule, ReactiveFormsModule, FormsModule, ErrorMessageDirective],
})
export class AccountComponent implements OnInit {

    accountForm: FormGroup<FormType<AccountBM>>;
    imageSrc: string | ArrayBuffer | null = null;
    OTPId;
    activatingMFA = false;
    isEditing = false;
    MFAActive = false;
    resetingPWD = false;

    constructor(
        private formBuilder: FormBuilder,
        private pocketbaseService: PocketbaseService,
        private accountService: AccountService,
        private toastService: ToastService,
        private translate: TranslateService,
        private alertCtrl: AlertController
    ) {
    }

    ngOnInit() {
        this.init();
    }

    async init(reload = false) {
        this.accountForm = this.formBuilder.group({
            email: ['']
        });

        const user = await this.accountService.getCurrentUser(reload)

        this.MFAActive = user.mfaActive;

        this.accountForm = this.formBuilder.group({
            email: [user.email, [Validators.required, Validators.email]],
        });

        this.accountForm.disable();
        this.accountForm.markAsPristine();
        this.accountForm.disable();

        this.isEditing = false;
    }

    enterEditMode() {
        this.isEditing = true;
        this.accountForm.enable();

        this.accountForm.markAsPristine();
    }

    cancelEditMode() {
        this.isEditing = false;
        this.accountForm.disable();

        if (this.accountForm.dirty || this.accountForm.touched) {
            this.init(true);
        }
    }

    async requestPWDReset() {
        this.resetingPWD = true;
        const user = await this.accountService.getCurrentUser();
        const res = await this.pocketbaseService.users.requestPasswordReset(user.email, { headers: PB.HEADER.NO_TOAST });
        this.toastService.info('Password reset email sent. Please check your inbox.');
    }

    async activateMFA() {
        const user = await this.accountService.getCurrentUser();
        const otpResult = await this.pocketbaseService.users.requestOTP(user.email);
        if (!otpResult?.otpId) return;
        this.OTPId = otpResult?.otpId;
        this.activatingMFA = true;
        const alert = await this.alertCtrl.create({
            message: this.translate.instant('Activate MFA'),
            inputs: [
                { placeholder: 'OTP Code', type: "number", attributes: { min: 100000, max: 999999 } }
            ],
            buttons: [
                {
                    text: this.translate.instant('OK'),
                    role: 'destructive',
                    handler: async () => {

                    }
                },
                {
                    text: this.translate.instant('Cancel'),
                    role: 'cancel',
                    handler: () => {
                        return false;
                    }
                },
            ],
        });
        await alert.present();
        const d = await alert.onDidDismiss();
        if (d && d.role === 'destructive') {
            let otp = d.data.values['0'];
            await this.verifyMFA(otp, user)
        }
        this.activatingMFA = false;
    }

    async disableMFA() {
        const user = await this.accountService.getCurrentUser();
        await this.pocketbaseService.users.update(user.id, { mfaActive: false });
        user.mfaActive = false;
        this.MFAActive = false;
    }

    public async verifyMFA(otpCode: string, user: any) {
        const result = await this.pocketbaseService.users.authWithOTP(this.OTPId, otpCode);
        if (result) {
            this.activatingMFA = false;
            if (user) {
                await this.pocketbaseService.users.update(user.id, { mfaActive: true });
                user.mfaActive = true;
                this.MFAActive = true;
                this.init();
            }
        } else {
            this.toastService.error("Invalid or expired code.")
        }
        
    }

    getModel() {
        const model = this.accountForm.getRawValue();
        return model;
    }

    async saveChanges() {
        const user = await this.accountService.getCurrentUser();

        const model = this.getModel();

        const newEmail = model.email;
        const currentEmail = user.email;

        model.email = currentEmail;

        const res = await this.pocketbaseService.users.update(
            user.id,
            model, { headers: PB.HEADER.NO_TOAST }
        )

        if (!res) return;

        if (newEmail != currentEmail) {
            this.accountService.requestEmailChange(newEmail);
        } else {
            this.toastService.success();
        }

        this.cancelEditMode();
    }
}
