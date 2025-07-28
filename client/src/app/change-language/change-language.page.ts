import { Component, Inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgFor } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MyEvent } from 'src/app/core/services/myevent.services';
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

    constructor(private myEvent: MyEvent) {
        this.languages = [{ code: 'hr', name: 'Hrvatski'}, { code: 'en', name: 'English' }, { code: 'de', name: 'Deutsch' }, { code: 'fr', name: 'Français' }, { code: 'es', name: 'Español' } ];
        this.defaultLanguageCode = 'en';
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
