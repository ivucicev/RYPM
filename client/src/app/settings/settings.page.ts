import { Component, Inject, Signal } from '@angular/core';
import { BuyappalertPage } from '../buyappalert/buyappalert.page';
import { ModalController } from '@ionic/angular/standalone';
import { AppConfig, APP_CONFIG } from '../app.config';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf } from '@angular/common';
import { IonicModule, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AccountSwitchPopoverComponent } from './account-switch-popover/account-switch-popover.component';
import { AccountService } from '../core/services/account.service';
import { User } from '../core/models/collections/user';
import { ThemeService } from '../core/services/theme.service';
import { PocketbaseService } from '../core/services/pocketbase.service';
import { accessibilityOutline, bookOutline, globeOutline, helpCircleOutline, logOutOutline, moonOutline, personCircleOutline, personOutline, sunnyOutline } from 'ionicons/icons';
import packageJson from '../../../package.json';

@Component({
    selector: 'app-settings',
    templateUrl: 'settings.page.html',
    styleUrls: ['./settings.page.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NgIf,
        TranslateModule
    ],
})
export class SettingsPage {

    showToolbar = false;
    user: User;

    accountIcon = personOutline;
    darkIcon = moonOutline;
    lightIcon = sunnyOutline;
    measurementsIcon = accessibilityOutline;
    accountSettingsIcon = personCircleOutline;
    langIcon = globeOutline;
    helpIcon = helpCircleOutline;
    termsIcon = bookOutline;
    logoutIcon = logOutOutline;

    isDark: Signal<boolean> = this.themeService.isDark;
    version: any = packageJson.version;

    constructor(
        private popoverCtrl: PopoverController,
        @Inject(APP_CONFIG) public config: AppConfig,
        private route: Router,
        private modalController: ModalController,
        private accountService: AccountService,
        private themeService: ThemeService,
        private pocketbaseService: PocketbaseService
    ) {
    }

    ionViewWillEnter() {
        this.accountService.getCurrentUser().then(u => {
            this.user = u;
        });
    }

    async openAccountSwitchOptions() {
        const popover = await this.popoverCtrl.create({
            component: AccountSwitchPopoverComponent,
            translucent: true
        });

        await popover.present();
    }

    onScroll($event) {
        if ($event && $event.detail && $event.detail.scrollTop) {
            const scrollTop = $event.detail.scrollTop;
            this.showToolbar = scrollTop >= 300;
        }
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    my_profile() {
        this.route.navigate(['./my-profile']);
    }

    my_trainers() {
        this.route.navigate(['./my-trainers']);
    }

    change_language() {
        this.route.navigate(['./change-language']);
    }

    help() {
        this.route.navigate(['./help']);
    }

    terms_condition() {
        this.route.navigate(['./terms-condition']);
    }

    get_pro() {
        this.route.navigate(['./get-pro']);
    }

    account_settings() {
        this.route.navigate(['./account']);
    }

    measurements() {
        this.route.navigate(['./measurements']);
    }

    // TODO
    developed_by() {
        window.open("https://opuslab.works/", '_system', 'location=no');
    }

    // TODO
    buyappalert() {
        this.modalController.create({ component: BuyappalertPage }).then((modalElement) => modalElement.present());
    }

    async logout() {
        this.accountService.logout();
        this.route.navigate(['./sign-in']);
    }
}
