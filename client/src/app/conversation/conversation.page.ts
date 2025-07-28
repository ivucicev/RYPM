import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Keyboard } from '@capacitor/keyboard';
import { IonFooter, IonList, IonInput, IonIcon, IonItem, IonContent, IonTitle, IonButtons, IonToolbar, IonHeader, IonBackButton } from "@ionic/angular/standalone";

@Component({
    selector: 'app-conversation',
    templateUrl: 'conversation.page.html',
    styleUrls: ['./conversation.page.scss'],
    standalone: true,
    imports: [IonBackButton, IonHeader, IonToolbar, IonButtons, IonTitle, IonContent, IonItem, IonIcon, IonInput, IonList, IonFooter, TranslateModule],
})
export class ConversationPage implements OnInit {
    showToolbar = false;
    constructor(private route: Router) { }

    ngOnInit() {
    }

    onScroll($event) {
        if ($event && $event.detail && $event.detail.scrollTop) {
            const scrollTop = $event.detail.scrollTop;
            this.showToolbar = scrollTop >= 300;
        }
    }

    trainer_profile() {
        this.route.navigate(['./trainer-profile']);
    }
}
