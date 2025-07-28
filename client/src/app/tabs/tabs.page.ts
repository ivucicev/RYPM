import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule, IonTabs } from '@ionic/angular';
import { settingsOutline } from 'ionicons/icons';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss'],
    standalone: true,
    imports: [IonicModule, TranslateModule]
})
export class TabsPage {
    private activeTab?: HTMLElement;

    settingsIcon = settingsOutline
    
    constructor() { }

    tabChange(tabsRef: IonTabs) {
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
