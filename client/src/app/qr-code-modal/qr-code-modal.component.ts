import { Component } from '@angular/core';
import { ModalController, IonButton, IonIcon, IonToolbar, IonFooter, IonContent, IonHeader, IonButtons, IonTitle } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { PocketbaseService } from '../core/services/pocketbase.service';
import { QRCodeComponent } from 'angularx-qrcode';
import { AccountService } from '../core/services/account.service';

@Component({
    selector: 'app-qr-code-modal',
    templateUrl: 'qr-code-modal.component.html',
    styleUrls: ['./qr-code-modal.component.scss'],
    standalone: true,
    imports: [IonTitle, QRCodeComponent, IonButtons, IonHeader, IonContent, IonFooter, IonToolbar, IonIcon, IonButton, TranslateModule, CommonModule],
})
export class QrCodeModalComponent {

    code;

    constructor(private modalCtrl: ModalController, private account: AccountService, private translate: TranslateService, private pocketbase: PocketbaseService) {
        this.generateInvite();

    }

    async generateInvite() {
        const invite =
        {
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            from: this.pocketbase.pb.authStore.record.id,
            to: '',
            code: null
        }

        const newInvite = await this.pocketbase.invites.create(invite) as any;

        this.code = newInvite.code;
    }

    async share() {
        if (navigator.canShare) {
            const user = await this.account.getCurrentUser();
            await navigator.share({
                title: `${user.name} ${await this.translate.instant('has invited you to RYPM.')}`,
                text: `${await this.translate.instant('Use the following code to connect')}: ${this.code} https://app.rypm.app`
            });
        }
    }

    dismissModal() {
        this.modalCtrl.dismiss();
    }
}
