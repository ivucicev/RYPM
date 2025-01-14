import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-terms-condition',
    templateUrl: './terms-condition.page.html',
    styleUrls: ['./terms-condition.page.scss'],
    standalone: true,
    imports: [IonicModule, TranslateModule],
})
export class TermsConditionPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
