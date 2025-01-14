import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgSwitch, NgSwitchCase } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
    standalone: true,
    imports: [
        IonicModule,
        FormsModule,
        NgSwitch,
        NgSwitchCase,
        TranslateModule,
    ],
})
export class HomePage implements OnInit {
  tab: string = "trainer";
  constructor(private route: Router) { }

  ngOnInit() {
  }

 chest_workouts() {
    this.route.navigate(['./chest-workouts']);
  }  
 weight_programs() {
    this.route.navigate(['./weight-programs']);
  } 
}
