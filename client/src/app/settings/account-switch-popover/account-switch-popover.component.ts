import { Component } from '@angular/core';
import { IonicModule, NavController, PopoverController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { User } from '../../core/models/user';
import { AccountService, UserMap } from '../../core/services/account.service';

@Component({
    selector: 'app-account-switch-popover',
    templateUrl: './account-switch-popover.component.html',
    styleUrls: ['./account-switch-popover.component.scss'],
    imports: [IonicModule, TranslateModule],
    standalone: true
})
export class AccountSwitchPopoverComponent {

    user: User;

    accounts: UserMap[] = [];

    constructor(
        private popoverCtrl: PopoverController,
        private navCtrl: NavController,
        private accountService: AccountService
    ) {
        this.accountService.getCurrentUser().then(u => {
            this.user = u;
        });
        this.accountService.getAvailableAccounts().then(acc => {
            this.accounts = acc;
        })
    }

    addNewAccount() {
        this.navCtrl.navigateForward(['./sign-in']);
        this.dismiss();
    }

    dismiss() {
        this.popoverCtrl.dismiss();
    }

    switchAccount(auth: UserMap) {
        this.accountService.switchAccount(auth);
        this.dismiss();
    }
}
