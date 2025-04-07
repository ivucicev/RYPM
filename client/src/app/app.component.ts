import { Component, Inject } from '@angular/core';
import { Platform, NavController, ModalController, IonApp } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { APP_CONFIG, AppConfig } from './app.config';
import { VtPopupPage } from './vt-popup/vt-popup.page';
import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { add, addCircle, addCircleOutline, addOutline, alertCircleOutline, barbellOutline, checkmark, checkmarkCircleOutline, chevronBackOutline, chevronDown, chevronUp, close, closeCircle, closeOutline, createOutline, documentTextOutline, ellipsisHorizontalCircle, ellipsisVertical, ellipsisVerticalCircleOutline, filterOutline, hourglassOutline, informationCircleOutline, pencil, personAdd, personAddOutline, personOutline, playOutline, refreshOutline, remove, save, settingsOutline, timeOutline, timerOutline, trash, trashBin, trashOutline, warningOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { IonicModule } from '@ionic/angular';
import { MyEvent } from './core/services/myevent.services';
import { AccountService } from './core/services/account.service';
import { Constants } from './core/constants/constants';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    standalone: true,
    imports: [IonApp, IonicModule],
})
export class AppComponent {
    rtlSide = "left";
    selectedIndex: any;
    appPages: any;

    constructor(
        @Inject(APP_CONFIG) public config: AppConfig,
        private platform: Platform,
        private navCtrl: NavController,
        private modalController: ModalController,
        private translate: TranslateService,
        private myEvent: MyEvent,
        private accountService: AccountService
    ) {
        this.initializeApp();

        this.myEvent.getLanguageObservable().subscribe(value => {
            this.navCtrl.navigateRoot(['./']);
            this.globalize(value);
        });

        addIcons({
            warningOutline, alertCircleOutline, checkmarkCircleOutline, informationCircleOutline, closeOutline,
            ellipsisVerticalCircleOutline, personAddOutline, addOutline, remove, chevronUp, chevronDown, timerOutline,
            close, checkmark, createOutline, personOutline, barbellOutline, hourglassOutline, timeOutline, ellipsisVertical,
            ellipsisHorizontalCircle, add, filterOutline, refreshOutline, closeCircle, addCircle, trash, addCircleOutline,
            documentTextOutline, personAdd, trashOutline, playOutline
        })
    }

    public component = AppComponent;

    async initializeApp() {
        if (this.config.demoMode && this.platform.is('cordova') && !window.localStorage.getItem(Constants.KEY_IS_DEMO_MODE)) {
            window.localStorage.setItem(Constants.KEY_IS_DEMO_MODE, "true");
            this.language();
            setTimeout(() => this.presentModal(), 30000);
        } else {
            this.navCtrl.navigateRoot(['./']);
        }
        this.platform.ready().then(async () => {
            // TODO: fix splash, styling
            // StatusBar.styleDefault();
            // SplashScreen.show();
            // StatusBar.setOverlaysWebView({ overlay: false });
            // StatusBar.setBackgroundColor({ color: '#000000' });

            let defaultLang = window.localStorage.getItem(Constants.KEY_DEFAULT_LANGUAGE);
            this.globalize(defaultLang);

            this.accountService.attemptAutoLogin().then(res => {
                if (!res) {
                    this.navCtrl.navigateRoot(['./sign-in']);
                } else {
                    this.navCtrl.navigateRoot(['./tabs']);
                }
                // SplashScreen.hide();
            });
        });

        addIcons({ chevronBackOutline });
    }

    globalize(languagePriority: any) {
        this.translate.setDefaultLang("en");
        let defaultLangCode = this.config.availableLanguages[0].code;
        this.translate.use(languagePriority && languagePriority.length ? languagePriority : defaultLangCode);
        this.setDirectionAccordingly(languagePriority && languagePriority.length ? languagePriority : defaultLangCode);
    }

    setDirectionAccordingly(lang: string) {
        switch (lang) {
            case 'ar': {
                this.rtlSide = "rtl";
                break;
            }
            default: {
                this.rtlSide = "ltr";
                break;
            }
        }
    }

    async presentModal() {
        const modal = await this.modalController.create({
            component: VtPopupPage,
        });
        return await modal.present();
    }

    language(): void {
        this.navCtrl.navigateRoot(['./change-language']);
    }
}
