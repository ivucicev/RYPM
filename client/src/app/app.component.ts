import { Component, Inject } from '@angular/core';
import { Platform, NavController, ModalController, IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { VtPopupPage } from './vt-popup/vt-popup.page';
import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { addIcons } from 'ionicons';
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
    imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
    selectedIndex: any;
    appPages: any;

    constructor(
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
        this.translate.use(languagePriority && languagePriority.length ? languagePriority : 'en');
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
