import { Component, viewChild, ɵgenerateStandaloneInDeclarationsError } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QrCodeModalComponent } from '../qr-code-modal/qr-code-modal.component';
import { ModalController, NavController, IonHeader, IonItem, IonContent, IonList, IonIcon, IonToolbar, IonButtons, IonTitle, IonButton, IonItemSliding, IonItemOption, IonItemOptions, IonRefresher, IonRefresherContent, AlertController, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { ContinueFooterComponent } from '../shared/continue-footer/continue-footer.component';
import { PocketbaseService } from '../core/services/pocketbase.service';
import { AccountService } from '../core/services/account.service';
import { AITrainer } from '../core/models/enums/ai-trainer';
import { DateTimePipe } from '../core/pipes/datetime.pipe';
import { PB } from '../core/constants/pb-constants';
import { MESSAGEROLE } from '../core/models/enums/message-role';
import { NoDataComponent } from '../shared/no-data/no-data.component';

interface ChatItem {
    id: string;
    name: string;
    avatar: string;
    time: string;
    lastMessage: string;
    messageType: 'user' | 'system';
}

@Component({
    selector: 'app-chats',
    templateUrl: 'chats.page.html',
    styleUrls: ['chats.page.scss'],
    standalone: true,
    imports: [IonButton, NoDataComponent, IonItemSliding, IonRefresher, IonRefresherContent, IonItemOptions, IonItemOption, DateTimePipe, IonTitle, IonButtons, IonToolbar, IonIcon, IonList, IonContent, IonItem, IonHeader, TranslateModule, CommonModule, FormsModule, ContinueFooterComponent, IonFab, IonFabButton],
})
export class ChatsPage {
    showSearchBar = false;
    searchTerm = '';
    aiTrainer;
    aiTrainers = AITrainer;

    conversations: any[] = [];
    user;

    continueFooter = viewChild(ContinueFooterComponent);

    constructor(
        private modalCtrl: ModalController,
        private navCtrl: NavController,
        private pb: PocketbaseService,
        private accountService: AccountService,
        private translate: TranslateService,
        private alertController: AlertController
    ) {
    }

    async ionViewWillEnter() {
        this.user = await this.accountService.getCurrentUser();
        this.aiTrainer = this.user.aiTrainer || AITrainer.RYPED;
        this.init();
        this.refresh();
    }

    async refresh() {
        this.continueFooter()?.refresh();
    }

    pullToRefresh(event) {
        setTimeout(() => {
            this.init();
            event.target.complete();
        }, 500);
    }

    async init() {
        const conversations = await this.pb.conversations.getFullList({
            sort: '-updated',
            expand: 'participants',
        });

        this.conversations = [...conversations];

        if (conversations.length === 0) {
            await this.initAIConversations();
        }

    }

    async initAIConversations() {
        const conversation = {
            participants: [this.user.id],
            isAI: true,
            lastMessage: this.aiTrainer == this.aiTrainers.RYPED ? this.translate.instant('Hi, I’m Ed Ryp - your AI strength coach. Let’s lock in your goals, fine-tune your training, and make every rep count. Ready to start?')
                : this.translate.instant('Hey, I’m Em Ryp - your AI performance coach. I’m here to guide, adapt, and push you toward your goals with precision. Shall we begin?'),
            lastMessageDate: new Date(),
        }

        const initialConversation = await this.pb.conversations.create(conversation,
            { headers: PB.HEADER.NO_TOAST });

        const message = {
            conversation: initialConversation.id,
            message: initialConversation.lastMessage,
            from: null,
            to: this.user.id,
            role: MESSAGEROLE.Assistant,
        };

        await this.pb.messages.create(message,
            { headers: PB.HEADER.NO_TOAST });

        this.conversations.push(initialConversation);
    }

    toggleSearch() {
        this.showSearchBar = !this.showSearchBar;
        if (!this.showSearchBar) {
            this.searchTerm = '';
        }
    }

    async openLinkScreen() {
        const modal = await this.modalCtrl.create({
            component: QrCodeModalComponent
        });

        await modal.present();

        const data: any = await modal.onDidDismiss();
        if (data && data.conversation)
            this.conversations.unshift(data.conversation);
    }

    conversation(chatId) {
        // TODO
        const currentConversation = this.conversations.find(c => c.id == chatId);
        const toUser = currentConversation.participants.filter(f => f != this.user.id);
        this.navCtrl.navigateForward(['/conversation/' + chatId + '/' + toUser[0].id]);
    }

    aiConversation(chatId) {
        this.navCtrl.navigateForward(['/conversation/ai/' + chatId]);
    }

    openSearchUser() {
        this.navCtrl.navigateForward(['/search-user']);
    }

    async deleteConversation(id: string) {
        const alert = await this.alertController.create({
            message: this.translate.instant('Are you sure? This action cannot be undone.'),
            buttons: [
                {
                    text: this.translate.instant('Yes'),
                    role: 'destructive',
                    handler: async () => {
                        await this.pb.conversations.delete(id);
                        this.conversations = this.conversations.filter(c => c.id != id);
                    }
                },
                {
                    text: this.translate.instant('No'),
                    role: 'cancel',
                    handler: () => {
                        return false;
                    }
                },
            ],
        });
        await alert.present();
    }

    myTrainers() {
        this.navCtrl.navigateForward(['/my-trainers']);
    }

}
