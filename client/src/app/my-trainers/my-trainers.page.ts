import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-my-trainers',
    templateUrl: './my-trainers.page.html',
    styleUrls: ['./my-trainers.page.scss'],
    standalone: true,
    imports: [IonicModule, TranslateModule],
})
export class MyTrainersPage implements OnInit {

  constructor(private route: Router) { }

  ngOnInit() {
  }

 trainer_profile() {
    this.route.navigate(['./trainer-profile']);
  } 
}
