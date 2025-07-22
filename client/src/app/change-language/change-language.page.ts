import { Component, Inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgFor } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MyEvent } from 'src/app/core/services/myevent.services';
import { APP_CONFIG, AppConfig } from 'src/app/app.config';
import { Constants } from 'src/app/core/constants/constants';


@Component({
    selector: 'app-change-language',
    templateUrl: 'change-language.page.html',
    styleUrls: ['change-language.page.scss'],
    standalone: true,
    imports: [
        IonicModule,
        FormsModule,
        NgFor,
        TranslateModule,
    ],
})
export class ChangeLanguagePage {
    defaultLanguageCode;
    languages: Array<{ code: string, name: string }>;

    constructor(@Inject(APP_CONFIG) private config: AppConfig, private myEvent: MyEvent) {
        this.languages = this.config.availableLanguages;
        this.defaultLanguageCode = config.availableLanguages[0].code;
        let defaultLang = window.localStorage.getItem(Constants.KEY_DEFAULT_LANGUAGE);
        if (defaultLang) this.defaultLanguageCode = defaultLang;
    }

    onLanguageClick(language) {
        this.defaultLanguageCode = language.code;
    }

    // TODO: fix, not working
    languageConfirm() {
        this.myEvent.setLanguageData(this.defaultLanguageCode);
        window.localStorage.setItem(Constants.KEY_DEFAULT_LANGUAGE, this.defaultLanguageCode);
    }
}
