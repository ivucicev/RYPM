import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonItem, IonButton, IonFooter, IonList, IonIcon, IonTitle, IonToolbar, IonHeader, IonContent, IonBackButton, IonButtons } from "@ionic/angular/standalone";

@Component({
    selector: 'app-get-pro',
    templateUrl: 'get-pro.page.html',
    styleUrls: ['./get-pro.page.scss'],
    standalone: true,
    imports: [IonButtons, IonBackButton, IonContent, IonHeader, IonToolbar, IonTitle, IonIcon, IonList, IonFooter, IonButton, IonItem, TranslateModule],
})
export class GetProPage implements OnInit {

    constructor() { }

    ngOnInit() {
    }

}
