import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { NgCircleProgressModule } from 'ng-circle-progress';

@Component({
  selector: 'app-workout-start',
  templateUrl: 'workout-start.page.html',
  styleUrls: ['./workout-start.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
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
