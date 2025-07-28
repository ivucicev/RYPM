import { Component } from '@angular/core';
import { NavController, PopoverController, IonIcon, IonItem, IonLabel, IonList } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { User } from '../../core/models/collections/user';
import { AccountService, UserMap } from '../../core/services/account.service';
import { personAddOutline } from 'ionicons/icons';

@Component({
    selector: 'app-account-switch-popover',
    templateUrl: 'account-switch-popover.component.html',
    styleUrls: ['./account-switch-popover.component.scss'],
    imports: [IonList, IonLabel, IonItem, IonIcon, TranslateModule],
    standalone: true
})
export class AccountSwitchPopoverComponent {

    user: User;
    addPlusIcon = personAddOutline;

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
