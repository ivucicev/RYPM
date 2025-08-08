import { Component, HostListener, Inject } from '@angular/core';
import { Platform, NavController, ModalController, IonApp, IonRouterOutlet, IonButton, IonIcon } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
import { chevronBackCircleOutline, chevronBackOutline, chevronForwardCircleOutline, chevronForwardOutline, downloadOutline, shareOutline } from 'ionicons/icons';
import { ActivatedRoute, NavigationStart, Route, Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    standalone: true,
    imports: [IonApp, IonRouterOutlet, IonButton, IonIcon, TranslateModule],
})
export class AppComponent {
    selectedIndex: any;
    appPages: any;
    shareIcon = shareOutline;
    forwardIcon = chevronForwardOutline;
    backwardIcon = chevronBackOutline;
    downloadIcon = downloadOutline;
    isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    canShowInstallButton = true;

    constructor(
        private platform: Platform,
        private navCtrl: NavController,
        private modalController: ModalController,
        private translate: TranslateService,
        private myEvent: MyEvent,
        private router: Router,
        private accountService: AccountService,
        private themeService: ThemeService
    ) {
        this.themeService.initializeTheme();
        this.initializeApp();

        this.myEvent.getLanguageObservable().subscribe(value => {
            this.navCtrl.navigateRoot(['./']);
            this.globalize(value);
        });

        this.router.events.subscribe(e => {
            if (e instanceof NavigationStart) {
                if (!e?.url?.includes('sign-in')) {
                    this.showInstallButton = false;
                    this.canShowInstallButton = false;
                }
            }
        })

        registerIcons();
    }

    public component = AppComponent;

    async initializeApp() {
        await this.platform.ready()

        // swiper
        register();

        // TODO: fix splash, styling
        // StatusBar.styleDefault();
        // SplashScreen.show();
        // StatusBar.setOverlaysWebView({ overlay: false });
        // StatusBar.setBackgroundColor({ color: '#000000' });
        let defaultLang = window.localStorage.getItem(Constants.KEY_DEFAULT_LANGUAGE);
        this.globalize(defaultLang);

        const res = await this.accountService.attemptAutoLogin();
        // TODO: remove, used for testing + add AUTH GUARD
        // this.navCtrl.navigateRoot(['./tabs']);
        // return;
        if (!res) {
            this.navCtrl.navigateRoot(['./sign-in']);
        } else {
            this.navCtrl.navigateRoot(['./tabs']);
        }
        // SplashScreen.hide();

        if (!this.isInstalled)
            setTimeout(() => {
                this.showInstallButton = true;
            }, 1500)
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

    deferredPrompt: any = null;
    showInstallButton = false;
    showInstallDialog = false;

    @HostListener('window:beforeinstallprompt', ['$event'])
    onBeforeInstallPrompt(event: any) {
        event.preventDefault();
        this.deferredPrompt = event;
    }

    async triggerInstall() {
        if (this.platform.is('ios')) {
            this.showInstallDialog = true;
            return;
        }
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            const choiceResult = await this.deferredPrompt.userChoice;
            this.deferredPrompt = null;
        }
    }
}
