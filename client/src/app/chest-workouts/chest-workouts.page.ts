import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgSwitch, NgSwitchCase } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonFabButton, IonFab, IonItem, IonIcon, IonSegmentButton, IonTitle, IonButtons, IonToolbar, IonLabel, IonContent, IonList, IonBackButton, IonHeader } from "@ionic/angular/standalone";

@Component({
    selector: 'app-chest-workouts',
    templateUrl: 'chest-workouts.page.html',
    styleUrls: ['./chest-workouts.page.scss'],
    standalone: true,
    imports: [IonHeader, IonBackButton, IonList, IonContent, IonLabel, IonToolbar, IonButtons, IonTitle, IonSegmentButton, IonIcon, IonItem, IonFab, IonFabButton,
        FormsModule,
        NgSwitch,
        NgSwitchCase,
        TranslateModule,
    ],
})
export class ChestWorkoutsPage implements OnInit {

    tab: string = "beginers";
    constructor(private route: Router) { }

    ngOnInit() {
    }

    workout_info() {
        this.route.navigate(['./workout-info']);
    }
    workout_start() {
        this.route.navigate(['./workout-start']);
    }
}
