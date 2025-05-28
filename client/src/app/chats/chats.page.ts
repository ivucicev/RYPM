import { Component, viewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QrCodeModalComponent } from '../qr-code-modal/qr-code-modal.component';
import { ModalController, NavController } from '@ionic/angular/standalone';
import { ContinueFooterComponent } from '../shared/continue-footer/continue-footer.component';

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
    templateUrl: './chats.page.html',
    styleUrls: ['./chats.page.scss'],
    standalone: true,
    imports: [IonicModule, TranslateModule, CommonModule, FormsModule, ContinueFooterComponent],
})
export class ChatsPage {
    showSearchBar = false;
    searchTerm = '';

    // TODO
    chatsList: ChatItem[] = [
        {
            id: '1',
            name: 'Amenda Johnson',
            avatar: '',
            time: '11:40 am',
            lastMessage: 'Yes, You can repeat same exercise today.',
            messageType: 'user'
        },
        {
            id: '2',
            name: 'Russeil Taylor',
            avatar: '',
            time: '11:40 am',
            lastMessage: 'No Worries. Believe in yourself.',
            messageType: 'user'
        },
        {
            id: '3',
            name: 'Lliana George',
            avatar: 'assets/images/gym_trainer_3.png',
            time: '11:40 am',
            lastMessage: 'Yes, You can repeat same exercise today.',
            messageType: 'user'
        },
        {
            id: '4',
            name: 'Suzein Smith',
            avatar: 'assets/images/gym_trainer_4.png',
            time: '11:40 am',
            lastMessage: 'Wants to connect',
            messageType: 'system'
        },
        {
            id: '5',
            name: 'Peter Johnson',
            avatar: 'assets/images/gym_trainer_5.png',
            time: '11:40 am',
            lastMessage: 'It will help you in anyway. Trust me.',
            messageType: 'user'
        },
        {
            id: '6',
            name: 'Olivier Haydon',
            avatar: 'assets/images/gym_trainer_6.png',
            time: '10:42 pm', // Current time from the date provided
            lastMessage: 'Wants to connect.',
            messageType: 'system'
        }
    ];

    continueFooter = viewChild(ContinueFooterComponent);

    constructor(
        private modalCtrl: ModalController,
        private navCtrl: NavController
    ) { }

    ionViewWillEnter() {
        this.refresh();
    }

    async refresh() {
        this.continueFooter()?.refresh();
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

    conversation(chat: ChatItem) {
        // TODO
        this.navCtrl.navigateForward(['/conversation']);
    }

    openSearchUser() {
        this.navCtrl.navigateForward(['/search-user']);
    }

}
