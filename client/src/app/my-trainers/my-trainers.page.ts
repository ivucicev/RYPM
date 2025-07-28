import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IonItem, IonBackButton, IonToolbar, IonHeader, IonTitle, IonList, IonButtons, IonContent } from "@ionic/angular/standalone";

@Component({
    selector: 'app-my-trainers',
    templateUrl: 'my-trainers.page.html',
    styleUrls: ['./my-trainers.page.scss'],
    standalone: true,
    imports: [IonContent, IonButtons, IonList, IonTitle, IonHeader, IonToolbar, IonBackButton, IonItem, TranslateModule],
})
export class MyTrainersPage implements OnInit {

    constructor(private route: Router) { }

    ngOnInit() {
    }

    trainer_profile() {
        this.route.navigate(['./trainer-profile']);
    }
}
