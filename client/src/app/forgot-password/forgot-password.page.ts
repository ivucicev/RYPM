import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AccountService } from '../core/services/account.service';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonItem, IonList, IonContent, IonBackButton, IonToolbar, IonTitle, IonButtons, IonButton, IonInput, IonFooter, IonIcon } from "@ionic/angular/standalone";
import { Location } from '@angular/common';

@Component({
    selector: 'app-forgot-password',
    templateUrl: 'forgot-password.page.html',
    styleUrls: ['./forgot-password.page.scss'],
    standalone: true,
    imports: [IonIcon, IonButton, IonButtons, IonInput, IonFooter, IonToolbar, IonBackButton, IonContent, IonList, IonItem, IonHeader, TranslateModule, FormsModule],
})
export class ForgotPasswordPage {

    // TODO: form, email validator
    email: string;

    constructor(
        private accountService: AccountService,
        private location: Location
    ) { }

    goBack() {
        this.location.back();
    }

    submit() {
        this.accountService.requestPasswordReset(this.email);
    }
}
