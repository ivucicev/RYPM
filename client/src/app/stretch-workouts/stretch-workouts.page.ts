import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgSwitch, NgSwitchCase } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonItem, IonSegmentButton, IonLabel, IonContent, IonList, IonToolbar, IonHeader, IonBackButton, IonButtons, IonTitle, IonIcon, IonFab, IonFabButton } from "@ionic/angular/standalone";

@Component({
    selector: 'app-stretch-workouts',
    templateUrl: 'stretch-workouts.page.html',
    styleUrls: ['./stretch-workouts.page.scss'],
    standalone: true,
    imports: [IonFabButton, IonFab, IonIcon, IonTitle, IonButtons, IonBackButton, IonHeader, IonToolbar, IonList, IonContent, IonLabel, IonSegmentButton, IonItem,
        FormsModule,
        NgSwitch,
        NgSwitchCase,
        TranslateModule,
    ],
})
export class StretchWorkoutsPage implements OnInit {
    tab: string = "workouts";
    constructor(private route: Router) { }

    ngOnInit() {
    }


    workout_info() {
        this.route.navigate(['./workout-info']);
    }
    workout_start() {
        this.route.navigate(['./workout-start']);
    }
    trainer_profile() {
        this.route.navigate(['./trainer-profile']);
    }
}
