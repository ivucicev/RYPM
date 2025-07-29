import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MyEvent } from 'src/app/core/services/myevent.services';
import { Constants } from 'src/app/core/constants/constants';
import { IonHeader, IonContent, IonRadio, IonFooter, IonButton, IonButtons, IonToolbar, IonTitle, IonItem, IonList, IonBackButton, IonRadioGroup } from "@ionic/angular/standalone";

@Component({
    selector: 'app-change-language',
    templateUrl: 'change-language.page.html',
    styleUrls: ['change-language.page.scss'],
    standalone: true,
    imports: [IonBackButton, IonList, IonItem, IonTitle, IonToolbar, IonButtons, IonButton, IonFooter, IonRadio, IonRadioGroup, IonContent, IonHeader,
        FormsModule,
        NgFor,
        TranslateModule,
    ],
})
export class ChangeLanguagePage {
    defaultLanguageCode;
    languages: Array<{ code: string, name: string }>;

    constructor(private myEvent: MyEvent) {
        this.languages = [
            { code: 'en', name: 'English' }, 
            { code: 'de', name: 'Deutsch' }, 
            { code: 'fr', name: 'Français' }, 
            { code: 'es', name: 'Español' },
            { code: 'it', name: 'Italiano' }, 
            { code: 'nl', name: 'Nederlands' }, 
            { code: 'pt', name: 'Português' }, 
            { code: 'ru', name: 'Русский' }, 
            { code: 'zh', name: '中文' },
            { code: 'si', name: 'Slovenščina' },
            { code: 'tr', name: 'Türkçe' },
            { code: 'cz', name: 'Čeština' },
            { code: 'hr', name: 'Hrvatski'},
            { code: 'sr', name: 'Српски'}, 
            { code: 'ma', name: 'Magyar' },
            { code: 'ch', name: 'Switzerland'},
            { code: 'pl', name: 'Polski' }
         ];
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
