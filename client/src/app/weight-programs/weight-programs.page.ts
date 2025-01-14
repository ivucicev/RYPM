import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgSwitch, NgSwitchCase } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-weight-programs',
    templateUrl: './weight-programs.page.html',
    styleUrls: ['./weight-programs.page.scss'],
    standalone: true,
    imports: [
        IonicModule,
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
