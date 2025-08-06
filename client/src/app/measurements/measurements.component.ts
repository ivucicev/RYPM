import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { WeightType } from 'src/app/core/models/enums/weight-type';
import { WeightTypePipe } from 'src/app/core/pipes/weight-type.pipe';
import { AccountService } from 'src/app/core/services/account.service';
import { PocketbaseService } from '../core/services/pocketbase.service';
import { User } from '../core/models/collections/user';
import { PB } from '../core/constants/pb-constants';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonSegment, IonContent, IonLabel, IonSegmentButton, IonTitle } from "@ionic/angular/standalone";

@Component({
    selector: 'app-measurements',
    templateUrl: 'measurements.component.html',
    styleUrls: ['./measurements.component.scss'],
    standalone: true,
    imports: [IonTitle, IonSegmentButton, IonLabel, IonContent, IonSegment, IonBackButton, IonButtons, IonToolbar, IonHeader, TranslateModule, WeightTypePipe]
})
export class MeasurementsComponent implements OnInit {

    selectedWeightType: any = WeightType.KG;
    selectedIncrement: any = 1.25;
    weightType = WeightType;

    weightTypes = [WeightType.KG, WeightType.LB]
    weightIncrementsKG = [1.25, 2.5, 5, 10, 15, 20, 25];
    weightIncrementsLB = [1.25, 2.5, 5, 10, 25, 35, 45];

    constructor(
        private accountService: AccountService,
        private pocketbaseService: PocketbaseService
    ) { }

    setIncrement(increment) {
        this.selectedIncrement = increment;
        this.accountService.getCurrentUser().then(user => {

            this.pocketbaseService.users.update(
                user.id,
                { weightIncrement: this.selectedIncrement } as User,
                { headers: PB.HEADER.NO_TOAST }
            );
            user.weightIncrement = this.selectedIncrement;
        });
    }

    ngOnInit() {
        this.accountService.getCurrentUser().then(user => {
            this.selectedWeightType = user.defaultWeightType;
            this.selectedIncrement = user.weightIncrement;
        });
    }

    setWeightType(type) {
        this.selectedWeightType = type;
        this.accountService.getCurrentUser().then(user => {
            this.pocketbaseService.users.update(
                user.id,
                { defaultWeightType: this.selectedWeightType } as User,
                { headers: PB.HEADER.NO_TOAST }
            );
            user.defaultWeightType = this.selectedWeightType;
        });
    }
}
