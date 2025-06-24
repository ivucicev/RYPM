import { Component, Inject } from '@angular/core';
import { Platform, NavController, ModalController, IonApp } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { APP_CONFIG, AppConfig } from './app.config';
import { VtPopupPage } from './vt-popup/vt-popup.page';
import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { addIcons } from 'ionicons';
import { IonicModule } from '@ionic/angular';
import { MyEvent } from './core/services/myevent.services';
import { AccountService } from './core/services/account.service';
import { Constants } from './core/constants/constants';
import { ThemeService } from './core/services/theme.service';
import { registerIcons } from './core/constants/icons';
import { register } from 'swiper/element/bundle';

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
        private accountService: AccountService,
        private themeService: ThemeService
    ) {
        this.themeService.initializeTheme();
        this.initializeApp();

        this.myEvent.getLanguageObservable().subscribe(value => {
            this.navCtrl.navigateRoot(['./']);
            this.globalize(value);
        });

        registerIcons();
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

            // swiper
            register();

            // TODO: fix splash, styling
            // StatusBar.styleDefault();
            // SplashScreen.show();
            // StatusBar.setOverlaysWebView({ overlay: false });
            // StatusBar.setBackgroundColor({ color: '#000000' });

            let defaultLang = window.localStorage.getItem(Constants.KEY_DEFAULT_LANGUAGE);
            this.globalize(defaultLang);

            this.accountService.attemptAutoLogin().then(res => {
                // TODO: remove, used for testing + add AUTH GUARD
                // this.navCtrl.navigateRoot(['./tabs']);
                // return;
                //console.log("Autologin y/n", res)
                if (!res) {
                    this.navCtrl.navigateRoot(['./sign-in']);
                } else {
                    this.navCtrl.navigateRoot(['./tabs']);
                }
                // SplashScreen.hide();
            });
        });
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
