import { Component, viewChild, ɵgenerateStandaloneInDeclarationsError } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QrCodeModalComponent } from '../qr-code-modal/qr-code-modal.component';
import { ModalController, NavController, IonHeader, IonItem, IonContent, IonList, IonIcon, IonToolbar, IonButtons, IonTitle, IonButton } from '@ionic/angular/standalone';
import { ContinueFooterComponent } from '../shared/continue-footer/continue-footer.component';
import { PocketbaseService } from '../core/services/pocketbase.service';
import { AccountService } from '../core/services/account.service';
import { AITrainer } from '../core/models/enums/ai-trainer';
import { DateTimePipe } from '../core/pipes/datetime.pipe';
import { PB } from '../core/constants/pb-constants';
import { MESSAGEROLE } from '../core/models/enums/message-role';

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
    imports: [IonButton, DateTimePipe, IonTitle, IonButtons, IonToolbar, IonIcon, IonList, IonContent, IonItem, IonHeader, TranslateModule, CommonModule, FormsModule, ContinueFooterComponent],
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
        private translate: TranslateService
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
            lastMessage: this.aiTrainer == this.aiTrainers.RYPED ? this.translate.instant('Hi, I’m Ryp Ed - your AI strength coach. Let’s lock in your goals, fine-tune your training, and make every rep count. Ready to start?')
                : this.translate.instant('Hey, I’m Ryp Em - your AI performance coach. I’m here to guide, adapt, and push you toward your goals with precision. Shall we begin?'),
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

        return await modal.present();
    }

    conversation(chatId) {
        // TODO
        this.navCtrl.navigateForward(['/conversation/' + chatId]);
    }

    aiConversation(chatId) {
        this.navCtrl.navigateForward(['/conversation/ai/' + chatId]);
    }

    openSearchUser() {
        this.navCtrl.navigateForward(['/search-user']);
    }

    myTrainers() {
        this.navCtrl.navigateForward(['/my-trainers']);
    }

}
