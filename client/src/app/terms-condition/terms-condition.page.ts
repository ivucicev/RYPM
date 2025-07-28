import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonContent, IonTitle, IonToolbar, IonHeader, IonBackButton, IonButtons } from "@ionic/angular/standalone";

@Component({
    selector: 'app-terms-condition',
    templateUrl: 'terms-condition.page.html',
    styleUrls: ['./terms-condition.page.scss'],
    standalone: true,
    imports: [IonButtons, IonBackButton, IonHeader, IonToolbar, IonTitle, IonContent, TranslateModule],
})
export class TermsConditionPage implements OnInit {

    constructor() { }

    ngOnInit() {
    }

}
