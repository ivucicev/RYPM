import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonTabs, IonIcon, IonTabBar, IonTabButton, IonLabel } from '@ionic/angular/standalone';
import { chatbubblesOutline, peopleOutline, settingsOutline } from 'ionicons/icons';
import { AccountService } from '../core/services/account.service';
import { UserType } from '../core/models/enums/user-type';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss'],
    standalone: true,
    imports: [IonLabel, IonTabButton, IonTabBar, IonIcon, TranslateModule, IonTabs]
})
export class TabsPage {
    private activeTab?: HTMLElement;

    settingsIcon = settingsOutline;
    bubblesIcon = chatbubblesOutline;
    peopleIcon = peopleOutline;

    currentUserType = UserType.User
    trainer = UserType.Trainer;

    constructor(private account: AccountService) { 
        this.account.getCurrentUser().then(u => {
            if (u) {
                this.currentUserType = u.type;
            }
        })
    }

    tabChange(tabsRef: IonTabs) {
        if (tabsRef?.outlet?.activatedView?.element)
            this.activeTab = tabsRef.outlet.activatedView.element;
    }

    ionViewWillLeave() {
        this.propagateToActiveTab('ionViewWillLeave');
    }

    ionViewDidLeave() {
        this.propagateToActiveTab('ionViewDidLeave');
    }

    ionViewWillEnter() {
        this.propagateToActiveTab('ionViewWillEnter');
    }

    ionViewDidEnter() {
        this.propagateToActiveTab('ionViewDidEnter');
    }

    /**
     * Ion lifecyle events do not trigger under active tab components but only on this enclosing component.
     *
     * Recommeded approach from the Ionic team is to dispatch those events back if they are needed inside active tabs.
     *
     * Reference: {@link https://stackoverflow.com/a/63038965}
     * @param eventName
     */
    private propagateToActiveTab(eventName: string) {
        if (this.activeTab) {
            this.activeTab.dispatchEvent(new CustomEvent(eventName));
        }
    }
}
