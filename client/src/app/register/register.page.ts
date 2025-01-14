import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
    standalone: true,
    imports: [IonicModule, TranslateModule],
})
export class RegisterPage implements OnInit {

  constructor(private route: Router,) { }

  ngOnInit() {
  }

 verification() {
    this.route.navigate(['./verification']);
  } 
    
}
