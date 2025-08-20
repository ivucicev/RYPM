import { Component, HostListener } from '@angular/core';
import { Platform, NavController, ModalController, IonApp, IonRouterOutlet, IonButton, IonIcon } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { VtPopupPage } from './vt-popup/vt-popup.page';
import { SplashScreen } from '@capacitor/splash-screen';
import { MyEvent } from './core/services/myevent.services';
import { AccountService } from './core/services/account.service';
import { Constants } from './core/constants/constants';
import { ThemeService } from './core/services/theme.service';
import { registerIcons } from './core/constants/icons';
import { register } from 'swiper/element/bundle';
import { chevronBackOutline, chevronForwardOutline, downloadOutline, shareOutline } from 'ionicons/icons';
import { NavigationExtras, NavigationStart, Router } from '@angular/router';
import { skipLocationChange } from './core/helpers/platform-helpers';
import { environment } from 'src/environments/environment';

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
        this.accountService.attemptAutoLogin().then(res => res ? this.navCtrl.navigateRoot(['./tabs']) : this.navCtrl.navigateRoot(['./sign-in']));

        this.initializeApp();
        this.themeService.initializeTheme();

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

    b64urlToU8(b64u) {
        const pad = "=".repeat((4 - b64u.length % 4) % 4);
        const b64 = (b64u + pad).replace(/-/g, "+").replace(/_/g, "/");
        return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    }

    async push() {

        let token = localStorage.getItem("pst");

        if (!token) {
            if (!('Notification' in window)) 
                throw new Error('Notifications unsupported')
            
            const perm = await Notification.requestPermission();
            if (perm !== 'granted') 
                throw new Error('User denied');

            const sub = await (
                "pushManager" in window
                    ? (window as any).pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: this.b64urlToU8("BEaY_oTCzI5fYJqxhZX27r63lv7Q0kF_oZiQ24c-vPu9zL4867WOEEKvkdTTKciEFJjIpcc0SPuJmtRSmocklzU") })
                    : (await navigator.serviceWorker.register("/sw.js")).pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: this.b64urlToU8("BEaY_oTCzI5fYJqxhZX27r63lv7Q0kF_oZiQ24c-vPu9zL4867WOEEKvkdTTKciEFJjIpcc0SPuJmtRSmocklzU") })
            );
            token = await this.getToken(sub);
        }

        await fetch(environment.api + "api/push-send?token=" + token, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                token,
                title: "Timer Expired",
                body: "Next workout: Dumbbell Press",
                navigate: "https://app.rypm.app/"
            })
        });
    }

    async getToken(sub?) {
        const res = await fetch(environment.api + "api/push-subscribe", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ subscription: sub })
        });
        const { token } = await res.json();
        localStorage.setItem("pst", token);
        return token;
    }

    async ngOnInit() {
    }

    initializeApp() {
        if (skipLocationChange(this.platform)) {
            this.fixPWARouting();
        }

        this.platform.ready().then(() => {
            // swiper
            register();
            // TODO: fix splash, styling
            // StatusBar.styleDefault();

            SplashScreen.show();

            // StatusBar.setOverlaysWebView({ overlay: false });
            // StatusBar.setBackgroundColor({ color: '#000000' });
            let defaultLang = window.localStorage.getItem(Constants.KEY_DEFAULT_LANGUAGE);
            this.globalize(defaultLang);

            SplashScreen.hide();

            if (!this.isInstalled)
                setTimeout(() => {
                    this.showInstallButton = true;
                }, 2000)
        })
    }

    /**
     * Overrides `navigateByUrl` and `navigate` routing to skip internal browser location change in order to fix PWA (mainly iOS) (touch) navigation gestures.
     *
     * More info:
     * - {@link https://github.com/vercel/next.js/issues/10465#issuecomment-2368843165}
     * - {@link https://github.com/ionic-team/ionic-framework/issues/22299}
     * - {@link https://github.com/ionic-team/ionic-framework/issues/29733}
     * - {@link https://forum.ionicframework.com/t/swipe-back-nav-flicker-ios-pwa/214388}
     */
    private fixPWARouting() {
        const originalNavigate = this.router.navigate.bind(this.router);
        this.router.navigate = (commands: any[], extras?: NavigationExtras) => {
            const enhancedExtras = {
                ...extras,
                skipLocationChange: true
            };
            return originalNavigate(commands, enhancedExtras);
        };

        const originalNavigateByUrl = this.router.navigateByUrl.bind(this.router);
        this.router.navigateByUrl = (url: string, extras?: NavigationExtras) => {
            const enhancedExtras = {
                ...extras,
                skipLocationChange: true
            };
            return originalNavigateByUrl(url, enhancedExtras);
        };
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
        const ua = navigator.userAgent;
        const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
        if (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone') || isSafari) {
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
