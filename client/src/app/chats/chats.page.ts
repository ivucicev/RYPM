import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-chats',
    templateUrl: './chats.page.html',
    styleUrls: ['./chats.page.scss'],
    standalone: true,
    imports: [IonicModule, TranslateModule],
})
export class ChatsPage implements OnInit {

  constructor(private route: Router) { }

  ngOnInit() {
  }
 conversation() {
    this.route.navigate(['./conversation']);
  } 
}
