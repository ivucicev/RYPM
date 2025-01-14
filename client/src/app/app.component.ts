import { Component, Inject } from '@angular/core';
import { Platform, NavController, ModalController, IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { APP_CONFIG, AppConfig } from './app.config';
import { VtPopupPage } from './vt-popup/vt-popup.page';
import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { chevronBackOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { IonicModule } from '@ionic/angular';
import { Constants } from './core/models/contants.models';
import { MyEvent } from './core/services/myevent.services';

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
    private myEvent: MyEvent
  ) {
    this.initializeApp();
    this.myEvent.getLanguageObservable().subscribe(value => {
      this.navCtrl.navigateRoot(['./']);
      this.globalize(value);
    });
  }
  public component = AppComponent;

  initializeApp() {
    if (this.config.demoMode && this.platform.is('cordova') && !window.localStorage.getItem(Constants.KEY_IS_DEMO_MODE)) {
      window.localStorage.setItem(Constants.KEY_IS_DEMO_MODE, "true");
      this.language();
      setTimeout(() => this.presentModal(), 30000);
    } else {
      this.navCtrl.navigateRoot(['./']);
    }
    this.platform.ready().then(() => {
      //StatusBar.styleDefault(); // TODO: fix splash
      // SplashScreen.show();
      // StatusBar.setOverlaysWebView({ overlay: false });
      // StatusBar.setBackgroundColor({ color: '#000000' });
      let defaultLang = window.localStorage.getItem(Constants.KEY_DEFAULT_LANGUAGE);
      this.globalize(defaultLang);
      //setTimeout(() => SplashScreen.hide(), 3000);
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
