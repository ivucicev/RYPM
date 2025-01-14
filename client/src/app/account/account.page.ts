import { Component, OnInit, Inject } from '@angular/core';
import { BuyappalertPage } from '../buyappalert/buyappalert.page';
import { ModalController, NavController, IonFooter, IonHeader } from '@ionic/angular/standalone';
import { AppConfig, APP_CONFIG } from '../app.config';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgIf,
    TranslateModule,
  ],
})
export class AccountPage implements OnInit {

  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private navCtrl: NavController,
    private route: Router,
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  showToolbar = false;
  onScroll($event) {
    if ($event && $event.detail && $event.detail.scrollTop) {
      const scrollTop = $event.detail.scrollTop;
      this.showToolbar = scrollTop >= 300;
    }
  }

  my_profile() {
    this.route.navigate(['./my-profile']);
  }
  my_trainers() {
    this.route.navigate(['./my-trainers']);
  }
  change_language() {
    this.route.navigate(['./change-language']);
  }
  help() {
    this.route.navigate(['./help']);
  }
  terms_condition() {
    this.route.navigate(['./terms-condition']);
  }
  get_pro() {
    this.route.navigate(['./get-pro']);
  }
  developed_by() {
    window.open("https://opuslab.works/", '_system', 'location=no');
  }
  buyappalert() {
    this.modalController.create({ component: BuyappalertPage }).then((modalElement) => modalElement.present());
  }
}
