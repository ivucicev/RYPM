import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { WeightType } from 'src/app/core/models/enums/weight-type';
import { WeightTypePipe } from 'src/app/core/pipes/weight-type.pipe';
import { AccountService } from 'src/app/core/services/account.service';
import { PocketbaseService } from '../core/services/pocketbase.service';
import { User } from '../core/models/collections/user';
import { PB } from '../core/constants/pb-constants';

@Component({
    selector: 'app-measurements',
    templateUrl: 'measurements.component.html',
    styleUrls: ['./measurements.component.scss'],
    standalone: true,
    imports: [IonicModule, TranslateModule, WeightTypePipe]
})
export class MeasurementsComponent implements OnInit {

    selectedWeightType: any = WeightType.KG;

    weightTypes = [WeightType.KG, WeightType.LB]

    constructor(
        private accountService: AccountService,
        private pocketbaseService: PocketbaseService
    ) { }

    ngOnInit() {
        this.accountService.getCurrentUser().then(user => {
            this.selectedWeightType = user.defaultWeightType;
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
        });
    }
}
