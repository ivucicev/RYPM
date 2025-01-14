import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-get-pro',
    templateUrl: './get-pro.page.html',
    styleUrls: ['./get-pro.page.scss'],
    standalone: true,
    imports: [IonicModule, TranslateModule],
})
export class GetProPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
