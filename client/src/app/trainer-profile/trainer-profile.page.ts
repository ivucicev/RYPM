import { Component, OnInit } from '@angular/core';
import { ScrollDetail } from '@ionic/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-trainer-profile',
    templateUrl: './trainer-profile.page.html',
    styleUrls: ['./trainer-profile.page.scss'],
    standalone: true,
    imports: [IonicModule, TranslateModule],
})
export class TrainerProfilePage implements OnInit {

  constructor(private route: Router) { }

  ngOnInit() {
  }
 showToolbar = false;     
 onScroll($event) {
    if ($event && $event.detail && $event.detail.scrollTop) {
     const scrollTop = $event.detail.scrollTop;
      this.showToolbar = scrollTop >=300;
     }
  }

 conversation() {
    this.route.navigate(['./conversation']);
  }      
}
