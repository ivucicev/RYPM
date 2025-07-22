import { Component, OnInit } from '@angular/core';
import { ScrollDetail } from '@ionic/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
@Component({
    selector: 'app-workout-info',
    templateUrl: 'workout-info.page.html',
    styleUrls: ['./workout-info.page.scss'],
    standalone: true,
    imports: [IonicModule, TranslateModule],
})
export class WorkoutInfoPage implements OnInit {

  constructor(private route: Router) { }

  ngOnInit() {
  }
  showToolbar = false;
  onScroll($event) {
    if ($event && $event.detail && $event.detail.scrollTop) {
      const scrollTop = $event.detail.scrollTop;
      this.showToolbar = scrollTop >= 300;
    }
  }

  workout_start() {
    this.route.navigate(['./workout-start']);
  }
}
