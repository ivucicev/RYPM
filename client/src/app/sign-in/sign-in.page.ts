import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.page.html',
    styleUrls: ['./sign-in.page.scss'],
    standalone: true,
    imports: [IonicModule, TranslateModule],
})
export class SignInPage implements OnInit {

  constructor(private route: Router, private navCtrl: NavController) { }

  ngOnInit() {
  }
 register() {
    this.route.navigate(['./register']);
  }  
 forgot_password() {
    this.route.navigate(['./forgot-password']);
  } 
 tabs() {
    this.navCtrl.navigateRoot(['./tabs']);
  }     
}
