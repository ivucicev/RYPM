import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonTabs, IonIcon, IonTabBar, IonTabButton, IonLabel } from '@ionic/angular/standalone';
import { barChartOutline, chatbubblesOutline, peopleOutline, settingsOutline, statsChartOutline } from 'ionicons/icons';
import { AccountService } from '../core/services/account.service';
import { UserType } from '../core/models/enums/user-type';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss'],
    standalone: true,
    imports: [IonLabel, IonTabButton, IonTabBar, IonIcon, TranslateModule, IonTabs]
})
export class TabsPage implements AfterViewInit {
    @ViewChild('tabBar', { read: ElementRef }) tabBar?: ElementRef;
    @ViewChild('tabs', { read: IonTabs }) ionTabs?: IonTabs;
    private activeTab?: HTMLElement;

    settingsIcon = settingsOutline;
    bubblesIcon = chatbubblesOutline;
    peopleIcon = peopleOutline;
    barChart = statsChartOutline;

    currentUserType = UserType.User
    trainer = UserType.Trainer;

    indicatorPosition = 0;
    isAnimating = false;

    constructor(private account: AccountService) {
        this.account.getCurrentUser().then(u => {
            if (u) {
                this.currentUserType = u.type;
            }
        })
    }

    ngAfterViewInit() {
        // Set initial position after view is ready
        setTimeout(() => {
            const selectedTab = this.ionTabs?.getSelected();
            if (selectedTab) {
                this.updateIndicatorPosition(selectedTab);
            } else {
                // Fallback to home if no tab is selected
                this.updateIndicatorPosition('home');
            }
        }, 100);
    }

    tabChange(tabsRef: IonTabs) {
        if (tabsRef?.outlet?.activatedView?.element)
            this.activeTab = tabsRef.outlet.activatedView.element;

        const selectedTab = tabsRef.getSelected();
        if (selectedTab) {
            // Use setTimeout to ensure DOM is updated
            setTimeout(() => {
                this.updateIndicatorPosition(selectedTab);
            }, 0);
        }
    }

    private updateIndicatorPosition(tabName: string) {
        if (!this.tabBar) {
            return;
        }

        // Query using ion-tab-button selector with tab attribute
        const tabButton = this.tabBar.nativeElement.querySelector(`ion-tab-button[tab="${tabName}"]`) as HTMLElement;
        if (tabButton) {
            // Use offsetLeft to get position relative to parent
            const newPosition = tabButton.offsetLeft;
            this.indicatorPosition = newPosition;

            // Trigger wobble animation
            this.isAnimating = true;
            setTimeout(() => {
                this.isAnimating = false;
            }, 500);
        } else {
            // Fallback: try with ID selector
            const tabButtonById = this.tabBar.nativeElement.querySelector(`#${tabName}`) as HTMLElement;
            if (tabButtonById) {
                const newPosition = tabButtonById.offsetLeft;
                this.indicatorPosition = newPosition;

                // Trigger wobble animation
                this.isAnimating = true;
                setTimeout(() => {
                    this.isAnimating = false;
                }, 500);
            }
        }
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
