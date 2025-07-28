import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CircleProgressComponent, NgCircleProgressModule } from 'ng-circle-progress';
import { IonContent, IonButton, IonHeader, IonIcon, IonTitle, IonToolbar, IonButtons, IonBackButton } from "@ionic/angular/standalone";

@Component({
    selector: 'app-rest',
    templateUrl: 'rest.page.html',
    styleUrls: ['./rest.page.scss'],
    standalone: true,
    imports: [IonBackButton, IonButtons, IonToolbar, IonTitle, IonIcon, IonHeader, IonButton, IonContent, NgCircleProgressModule, TranslateModule]
})
export class RestPage implements OnInit {

    constructor() { }

    ngOnInit() {
    }

}
