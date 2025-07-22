import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { Keyboard } from '@capacitor/keyboard';

@Component({
    selector: 'app-conversation',
    templateUrl: 'conversation.page.html',
    styleUrls: ['./conversation.page.scss'],
    standalone: true,
    imports: [IonicModule, TranslateModule],
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
