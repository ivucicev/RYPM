import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { CircleProgressComponent, NgCircleProgressModule } from 'ng-circle-progress';

@Component({
  selector: 'app-rest',
  templateUrl: './rest.page.html',
  styleUrls: ['./rest.page.scss'],
  standalone: true,
  imports: [IonicModule, NgCircleProgressModule, TranslateModule]
})
export class RestPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
