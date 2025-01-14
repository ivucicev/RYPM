import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-my-profile',
    templateUrl: './my-profile.page.html',
    styleUrls: ['./my-profile.page.scss'],
    standalone: true,
    imports: [IonicModule, TranslateModule],
})
export class MyProfilePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
