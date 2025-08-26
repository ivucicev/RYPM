import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { WeightType } from 'src/app/core/models/enums/weight-type';
import { WeightTypePipe } from 'src/app/core/pipes/weight-type.pipe';
import { AccountService } from 'src/app/core/services/account.service';
import { PocketbaseService } from '../core/services/pocketbase.service';
import { User } from '../core/models/collections/user';
import { PB } from '../core/constants/pb-constants';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonSegment, IonContent, IonLabel, IonSegmentButton, IonTitle, IonRow, IonCol, IonAvatar, IonCard, IonCardHeader, IonCardContent, IonCardSubtitle, IonCardTitle, IonIcon, IonToggle, IonItem, IonSelect, IonSelectOption, ToggleChangeEventDetail, IonNote } from "@ionic/angular/standalone";
import { AITrainer } from '../core/models/enums/ai-trainer';
import { FormsModule } from '@angular/forms';
import { IonToggleCustomEvent } from '@ionic/core';
import { PushService } from '../core/services/push.service';
import { StorageService } from '../core/services/storage.service';
import { StorageKeys } from '../core/constants/storage-keys';

@Component({
    selector: 'app-measurements',
    templateUrl: 'measurements.component.html',
    styleUrls: ['./measurements.component.scss'],
    standalone: true,
    imports: [IonTitle, IonSegmentButton, IonItem, FormsModule, IonToggle, IonIcon, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonRow, IonCol, IonLabel, IonContent, IonSegment, IonBackButton, IonButtons, IonToolbar, IonHeader, TranslateModule, WeightTypePipe, IonNote]
})
export class MeasurementsComponent implements OnInit {

    notificationsEnabled: boolean = false;
    selectedWeightType: any = WeightType.KG;
    selectedIncrement: any = 1.25;
    weightType = WeightType;

    weightTypes = [WeightType.KG, WeightType.LB]
    weightIncrementsKG = [1.25, 2.5, 5, 10, 15, 20, 25];
    weightIncrementsLB = [1.25, 2.5, 5, 10, 25, 35, 45];
    aiTrainer = AITrainer;
    public selectedTrainer = AITrainer.RYPED;
    aiTrainerToggle = true;
    currentUser: User;

    constructor(
        private accountService: AccountService,
        private pocketbaseService: PocketbaseService,
        private push: PushService,
        private storage: StorageService
    ) { }

    setIncrement(increment) {
        this.selectedIncrement = increment;
        this.pocketbaseService.users.update(
            this.currentUser.id,
            { weightIncrement: this.selectedIncrement } as User,
            { headers: PB.HEADER.NO_TOAST }
        );
        this.currentUser.weightIncrement = this.selectedIncrement;
    }

    changeTrainer(trainer: AITrainer) {
        
        if (this.selectedTrainer == trainer) {
            this.selectedTrainer = null;
            this.aiTrainerToggle = false;
        } else {
            this.selectedTrainer = trainer;
            this.aiTrainerToggle = true;
        }
        this.pocketbaseService.users.update(
            this.currentUser.id,
            { aiTrainer: this.selectedTrainer } as User,
            { headers: PB.HEADER.NO_TOAST }
        );
        this.currentUser.aiTrainer = this.selectedTrainer;
    }

    async toggleNotifications($event: IonToggleCustomEvent<ToggleChangeEventDetail<any>>) {
        this.currentUser.notificationsEnabled = this.notificationsEnabled;
        const update = { notificationsEnabled: this.notificationsEnabled, token: "" } as any
        await this.storage.removeItem(StorageKeys.PORTABLE_SUBSCRIPTION_TOKEN);
        if (this.notificationsEnabled) {
            const token = await this.push.requestNotifications();
            update.token = token;
        }

        this.pocketbaseService.users.update(
            this.currentUser.id,
            update as User,
            { headers: PB.HEADER.NO_TOAST }
        );
    
    }

    toggle(e) {
        if (e.detail.checked) {
            this.changeTrainer(AITrainer.RYPED);
        } else {
            this.changeTrainer(AITrainer.OFF);
        }
    }

    async ngOnInit() {
        const user = await this.accountService.getCurrentUser();
        this.currentUser = user;
        this.selectedWeightType = user.defaultWeightType;
        this.selectedIncrement = user.weightIncrement;
        this.selectedTrainer = user.aiTrainer || AITrainer.RYPED;
        if (this.selectedTrainer) {
            this.aiTrainerToggle = true;
        }
        this.notificationsEnabled = this.currentUser.notificationsEnabled;
    }

    setWeightType(type) {
        this.selectedWeightType = type;
        this.pocketbaseService.users.update(
            this.currentUser.id,
            { defaultWeightType: this.selectedWeightType } as User,
            { headers: PB.HEADER.NO_TOAST }
        );
        this.currentUser.defaultWeightType = this.selectedWeightType;
    }
}
