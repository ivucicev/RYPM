import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgSwitch, NgSwitchCase } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
@Component({
    selector: 'app-chest-workouts',
    templateUrl: 'chest-workouts.page.html',
    styleUrls: ['./chest-workouts.page.scss'],
    standalone: true,
    imports: [
        IonicModule,
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
