import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Keyboard } from '@capacitor/keyboard';
import { IonFooter, IonList, IonInput, IonIcon, IonItem, IonContent, IonTitle, IonButtons, IonToolbar, IonHeader, IonBackButton } from "@ionic/angular/standalone";
import { AccountService } from '../core/services/account.service';
import { AITrainer } from '../core/models/enums/ai-trainer';

@Component({
    selector: 'app-conversation',
    templateUrl: 'conversation.page.html',
    styleUrls: ['./conversation.page.scss'],
    standalone: true,
    imports: [IonBackButton, IonHeader, IonToolbar, IonButtons, IonTitle, IonContent, IonItem, IonIcon, IonInput, IonList, IonFooter, TranslateModule],
})
export class ConversationPage implements OnInit {
    showToolbar = false;
    isAIConversation = false;
    aiTrainer: AITrainer;
    aiTrainers = AITrainer;

    constructor(private route: Router, private activatedRoute: ActivatedRoute, private accountService: AccountService) {
        this.activatedRoute.data.subscribe((data: any) => {
            if (data.aiConversation) {
                this.isAIConversation = true;
            }
        })


    }

    async ngOnInit() {
        const user = await this.accountService.getCurrentUser();
        if (user && user.aiTrainer) {
            this.aiTrainer = user.aiTrainer;
        }
    }

    onScroll($event) {
        if ($event && $event.detail && $event.detail.scrollTop) {
            const scrollTop = $event.detail.scrollTop;
            this.showToolbar = scrollTop >= 300;
        }
    }

    trainerProfile() {
        if (this.isAIConversation) {
            this.route.navigate(['./trainer-profile/ai/' + this.aiTrainer]);
        } else {
            this.route.navigate(['./trainer-profile']);
        }
    }
}
