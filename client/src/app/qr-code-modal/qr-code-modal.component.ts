import { Component } from '@angular/core';
import { ModalController, IonButton, IonIcon, IonToolbar, IonFooter, IonContent, IonHeader, IonButtons, IonTitle } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-qr-code-modal',
    templateUrl: 'qr-code-modal.component.html',
    styleUrls: ['./qr-code-modal.component.scss'],
    standalone: true,
    imports: [IonTitle, IonButtons, IonHeader, IonContent, IonFooter, IonToolbar, IonIcon, IonButton, TranslateModule, CommonModule],
})
export class QrCodeModalComponent {
    constructor(private modalCtrl: ModalController) { }

    dismissModal() {
        this.modalCtrl.dismiss();
    }
}
