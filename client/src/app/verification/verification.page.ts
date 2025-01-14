import { Component, OnInit } from '@angular/core';
import { NavController, IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-verification',
    templateUrl: './verification.page.html',
    styleUrls: ['./verification.page.scss'],
    standalone: true,
    imports: [IonicModule, TranslateModule],
})
export class VerificationPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

 tabs() {
    this.navCtrl.navigateRoot(['./tabs']);
  }  
}
