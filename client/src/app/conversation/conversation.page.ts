import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Keyboard } from '@capacitor/keyboard';
import { IonFooter, IonList, IonInput, IonIcon, IonItem, IonContent, IonTitle, IonButtons, IonToolbar, IonHeader, IonBackButton, IonButton } from "@ionic/angular/standalone";
import { AccountService } from '../core/services/account.service';
import { AITrainer } from '../core/models/enums/ai-trainer';
import { PocketbaseService } from '../core/services/pocketbase.service';
import { DateTimePipe } from "../core/pipes/datetime.pipe";
import { create, readerOutline, sendOutline } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import { MESSAGEROLE } from '../core/models/enums/message-role';
import { PB } from '../core/constants/pb-constants';

@Component({
    selector: 'app-conversation',
    templateUrl: 'conversation.page.html',
    styleUrls: ['./conversation.page.scss'],
    standalone: true,
    imports: [IonBackButton, FormsModule, IonHeader, IonToolbar, IonButtons, IonTitle, IonContent, IonItem, IonIcon, IonInput, IonList, IonFooter, TranslateModule, DateTimePipe, IonButton],
})
export class ConversationPage implements OnInit {
    showToolbar = false;
    isAIConversation = false;
    aiTrainer: AITrainer;
    aiTrainers = AITrainer;
    user;
    messages = []
    conversationId;
    sendIcon = sendOutline;
    newMessage = '';
    readerIcon = readerOutline;

    @ViewChild(IonContent) content!: IonContent;

    constructor(private route: Router, private pb: PocketbaseService, private activatedRoute: ActivatedRoute, private accountService: AccountService) {
        this.activatedRoute.data.subscribe((data: any) => {
            if (data.aiConversation) {
                this.isAIConversation = true;
            }
        })
        this.activatedRoute.params.subscribe((param: any) => {
            if (param.id) this.conversationId = param.id;
            this.getMessagesByConversationId(this.conversationId);
        });

    }

    async ngOnInit() {
        this.user = await this.accountService.getCurrentUser();
        if (this.user && this.user.aiTrainer) {
            this.aiTrainer = this.user.aiTrainer;
        }
    }

    async getMessagesByConversationId(conversationId: string) {
        const messages = await this.pb.messages.getFullList({
            filter: `conversation = '${conversationId}'`,
            sort: 'created'
        });

        this.messages = [...messages].sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());
        this.scrollToBottom(false);

        await this.pb.pb.realtime.subscribe(conversationId, (e) => {
            this.messages.push(e);
            this.scrollToBottom();
        })
    }

    onScroll($event) {
        if ($event && $event.detail && $event.detail.scrollTop) {
            const scrollTop = $event.detail.scrollTop;
            this.showToolbar = scrollTop >= 300;
        }
    }

    async sendMessage() {
        const message = {
            conversation: this.conversationId,
            message: this.newMessage,
            from: this.user.id,
            to: null,
            created: new Date(),
            role: MESSAGEROLE.User,
        };

        this.messages.push(message);
        this.newMessage = '';
        this.scrollToBottom();
        const msg = await this.pb.messages.create(message,
            { headers: PB.HEADER.NO_TOAST });

    }

    trainerProfile() {
        if (this.isAIConversation) {
            this.route.navigate(['./trainer-profile/ai/' + this.aiTrainer]);
        } else {
            this.route.navigate(['./trainer-profile']);
        }
    }

    async ngOnDestroy() {
        if (this.conversationId)
            await this.pb.pb.realtime.unsubscribe(this.conversationId);
    }

    scrollToBottom(smooth: boolean = true) {
        setTimeout(() => this.content.scrollToBottom(smooth ? 300 : 0), 100);
    }
}
