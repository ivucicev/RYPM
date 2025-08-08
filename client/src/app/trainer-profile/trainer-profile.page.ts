import { Component, OnInit } from '@angular/core';
import { ScrollDetail } from '@ionic/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IonButton, IonFooter, IonRow, IonCol, IonContent, IonTitle, IonButtons, IonToolbar, IonHeader, IonBackButton } from "@ionic/angular/standalone";
import { AccountService } from '../core/services/account.service';
import { AITrainer } from '../core/models/enums/ai-trainer';

@Component({
    selector: 'app-trainer-profile',
    templateUrl: 'trainer-profile.page.html',
    styleUrls: ['./trainer-profile.page.scss'],
    standalone: true,
    imports: [IonBackButton, IonHeader, IonToolbar, IonButtons, IonTitle, IonContent, TranslateModule],
})
export class TrainerProfilePage implements OnInit {

    public aiTrainer: AITrainer = AITrainer.RYPED;
    public aiTrainers = AITrainer;

    constructor(private route: Router, private account: AccountService, private activatedRoute: ActivatedRoute) { 
        this.activatedRoute.params.subscribe((params: any) => {
            if (params.id) {
                this.aiTrainer = +params.id;
            }
        })

    }

    ngOnInit() {
    }
    showToolbar = false;
    onScroll($event) {
        if ($event && $event.detail && $event.detail.scrollTop) {
            const scrollTop = $event.detail.scrollTop;
            this.showToolbar = scrollTop >= 300;
        }
    }

    conversation() {
        this.route.navigate(['./conversation']);
    }
}
