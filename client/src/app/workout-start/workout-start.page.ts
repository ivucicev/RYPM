import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { IonButton, IonHeader, IonToolbar, IonBackButton, IonTitle, IonButtons, IonContent, IonIcon } from "@ionic/angular/standalone";

@Component({
    selector: 'app-workout-start',
    templateUrl: 'workout-start.page.html',
    styleUrls: ['./workout-start.page.scss'],
    standalone: true,
    imports: [IonIcon, IonContent, IonButtons, IonTitle, IonBackButton, IonToolbar, IonHeader, IonButton,
        CommonModule,
        FormsModule,
        TranslateModule,
        NgCircleProgressModule
    ],
})
export class WorkoutStartPage implements OnInit {

    constructor(private route: Router) { }

    ngOnInit() {
    }
    rest() {
        this.route.navigate(['./rest']);
    }
}
