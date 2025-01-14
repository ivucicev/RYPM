import { Component, OnInit, Inject } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../app.config';
import { TranslateModule } from '@ngx-translate/core';
import { NgFor } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Constants } from '../core/models/contants.models';
import { MyEvent } from '../core/services/myevent.services';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-change-language',
  templateUrl: './change-language.page.html',
  styleUrls: ['./change-language.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    NgFor,
    TranslateModule,
  ],
})
export class ChangeLanguagePage implements OnInit {
  defaultLanguageCode;
  languages: Array<{ code: string, name: string }>;

  constructor(@Inject(APP_CONFIG) private config: AppConfig, private myEvent: MyEvent) {
    this.languages = this.config.availableLanguages;
    this.defaultLanguageCode = config.availableLanguages[0].code;
    let defaultLang = window.localStorage.getItem(Constants.KEY_DEFAULT_LANGUAGE);
    if (defaultLang) this.defaultLanguageCode = defaultLang;
  }

  ngOnInit() {
  }

  onLanguageClick(language) {
    this.defaultLanguageCode = language.code;
  }

  languageConfirm() {
    this.myEvent.setLanguageData(this.defaultLanguageCode);
    window.localStorage.setItem(Constants.KEY_DEFAULT_LANGUAGE, this.defaultLanguageCode);
  }
}
