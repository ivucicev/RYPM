import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonTabs, IonIcon, IonTabBar, IonTabButton, IonLabel } from '@ionic/angular/standalone';
import { chatbubblesOutline, settingsOutline } from 'ionicons/icons';

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

    constructor() { }

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
