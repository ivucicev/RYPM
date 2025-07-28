import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { VerificationStateService } from '../core/services/verification-state-service';
import { AccountService } from '../core/services/account.service';
import { PocketbaseService } from '../core/services/pocketbase.service';
import { IonButton, IonToolbar, IonBackButton, IonList, IonContent, IonTitle, IonInput, IonHeader, IonButtons, IonItem } from "@ionic/angular/standalone";

@Component({
    selector: 'app-verification',
    templateUrl: 'verification.page.html',
    styleUrls: ['./verification.page.scss'],
    standalone: true,
    imports: [IonItem, IonButtons, IonHeader, IonInput, IonTitle, IonContent, IonList, IonBackButton, IonToolbar, IonButton, TranslateModule],
})
export class VerificationPage implements OnInit {

    private readonly pocketbase = this.pocketbaseService.pb;

    private readonly loginBM = this.verificationStateService.popLoginBM();

    constructor(
        private accountService: AccountService,
        private verificationStateService: VerificationStateService,
        private pocketbaseService: PocketbaseService
    ) {
    }

    async submit(code) {
        await this.accountService.confirmEmail(code, this.loginBM);
    }

    ngOnInit() {
        this.pocketbase.collection('users').requestVerification(this.loginBM.email);
    }
}
