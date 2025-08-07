import { Component, OnInit } from '@angular/core';
import { ScrollDetail } from '@ionic/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IonButton, IonFooter, IonRow, IonCol, IonContent, IonTitle, IonButtons, IonToolbar, IonHeader, IonBackButton } from "@ionic/angular/standalone";

@Component({
    selector: 'app-trainer-profile',
    templateUrl: 'trainer-profile.page.html',
    styleUrls: ['./trainer-profile.page.scss'],
    standalone: true,
    imports: [IonBackButton, IonHeader, IonToolbar, IonButtons, IonTitle, IonContent, IonCol, IonRow, IonFooter, IonButton, TranslateModule],
})
export class TrainerProfilePage implements OnInit {

    constructor(private route: Router, private activatedRoute: ActivatedRoute) { 
        activatedRoute.fragment.subscribe(res => {
            console.log(res)
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
