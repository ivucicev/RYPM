import { Component } from '@angular/core';
import { ModalController, IonButton, IonIcon, IonToolbar, IonFooter, IonContent, IonHeader, IonButtons, IonTitle, IonInputOtp } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { PocketbaseService } from '../core/services/pocketbase.service';
import { QRCodeComponent } from 'angularx-qrcode';
import { AccountService } from '../core/services/account.service';
import { UserType } from '../core/models/enums/user-type';
import { ToastService } from '../core/services/toast-service';
import { MESSAGEROLE } from '../core/models/enums/message-role';

@Component({
    selector: 'app-qr-code-modal',
    templateUrl: 'qr-code-modal.component.html',
    styleUrls: ['./qr-code-modal.component.scss'],
    standalone: true,
    imports: [IonTitle, IonButtons, IonInputOtp, IonHeader, IonContent, IonFooter, IonToolbar, IonIcon, IonButton, TranslateModule, CommonModule, IonInputOtp],
})
export class QrCodeModalComponent {

    code;
    currentUser;
    trainerType = UserType.Trainer;

    constructor(private modalCtrl: ModalController, private toast: ToastService, private account: AccountService, private translate: TranslateService, private pocketbase: PocketbaseService) {
        this.account.getCurrentUser().then(user => {
            this.currentUser = user;
            if (this.currentUser.type == this.trainerType)
                this.generateInvite();
        })
    }

    async connect($event) {
        const invite = await this.pocketbase.invites.getFirstListItem(
            `code = "${$event.target.value}" && accepted=0 && expiresAt > "${new Date().toISOString()}"`,
            {
                fields: 'from,accepted,acceptedAt,id,to'
            }
        ) as any;


        if (invite) {
            invite.to = this.pocketbase.pb.authStore.record.id;
            invite.accepted = true;
            invite.acceptedAt = new Date().toISOString();
            await this.pocketbase.invites.update(invite.id, invite);

            const conversation = {
                participants: [invite.to, invite.from],
                lastMessage: this.translate.instant("You are now connected."),
                lastMessageDate: new Date(),
            }

            const initialConversation = await this.pocketbase.conversations.create(conversation);

            const message = {
                conversation: initialConversation.id,
                message: initialConversation.lastMessage,
                from: invite.from,
                to: invite.to,
                role: MESSAGEROLE.User,
            };

            await this.pocketbase.messages.create(message);
            this.toast.success();
            this.dismissModal(initialConversation);
        } else {
            this.toast.error(this.translate.instant('Invalid or expired invite code.'));
            this.dismissModal();
        }

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

    dismissModal(conversation = null) {
        this.modalCtrl.dismiss({ conversation });
    }
}
