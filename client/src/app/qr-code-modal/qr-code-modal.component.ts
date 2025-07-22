import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-qr-code-modal',
    templateUrl: 'qr-code-modal.component.html',
    styleUrls: ['./qr-code-modal.component.scss'],
    standalone: true,
    imports: [IonicModule, TranslateModule, CommonModule],
})
export class QrCodeModalComponent {
    constructor(private modalCtrl: ModalController) { }

    dismissModal() {
        this.modalCtrl.dismiss();
    }
}
