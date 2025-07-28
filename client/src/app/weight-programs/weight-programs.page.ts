import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgSwitch, NgSwitchCase } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonItem, IonContent, IonList, IonSegmentButton, IonTitle, IonBackButton, IonButtons, IonHeader, IonLabel, IonToolbar, IonIcon } from "@ionic/angular/standalone";

@Component({
    selector: 'app-weight-programs',
    templateUrl: 'weight-programs.page.html',
    styleUrls: ['./weight-programs.page.scss'],
    standalone: true,
    imports: [IonIcon, IonToolbar, IonLabel, IonHeader, IonButtons, IonBackButton, IonTitle, IonSegmentButton, IonList, IonContent, IonItem,
        FormsModule,
        NgSwitch,
        NgSwitchCase,
        TranslateModule,
    ],
})
export class WeightProgramsPage implements OnInit {
    tab: string = "beginers";
    constructor(private route: Router) { }

    ngOnInit() {
    }

    stretch_workouts() {
        this.route.navigate(['./stretch-workouts']);
    }
}
