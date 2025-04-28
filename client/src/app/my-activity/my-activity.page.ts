import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActionSheetController, IonicModule } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { DateTimePipe } from '../core/pipes/datetime.pipe';
import { PocketbaseService } from '../core/services/pocketbase.service';
import { Workout } from '../core/models/workout';
import { WorkoutState } from '../core/models/workout-state';

@Component({
    selector: 'app-my-activity',
    templateUrl: './my-activity.page.html',
    styleUrls: ['./my-activity.page.scss'],
    standalone: true,
    imports: [IonicModule, TranslateModule, DateTimePipe],
})
export class MyActivityPage {

    workouts: Workout[];

    WorkoutState = WorkoutState;

    constructor(
        private actionSheetCtrl: ActionSheetController,
        private translateService: TranslateService,
        private pocketbaseService: PocketbaseService
    ) { }

    // TODO: fetch
    async refresh() {
    }

    ionViewWillEnter() {
        this.refresh();
    }

    // TODO: change/implement
    async openSettings() {
        const translations = await lastValueFrom(this.translateService.get([
            'chat_w_trainer', 'edit', 'end', 'delete', 'cancel', 'workout'
        ]));

        const actionSheet = await this.actionSheetCtrl.create({
            header: translations.workout,
            buttons: [
                {
                    text: translations.edit,
                    icon: 'create-outline',
                    handler: () => {
                    }
                },
                {
                    text: translations.chat_w_trainer,
                    icon: 'chatbubble-outline',
                    handler: () => {
                    }
                },
                {
                    text: translations.end,
                    icon: 'stop-circle-outline',
                    handler: () => {
                    }
                },
                {
                    text: translations.delete,
                    icon: 'trash-outline',
                    role: 'destructive',
                    handler: () => {
                    }
                },
                {
                    text: translations.cancel,
                    icon: 'close-outline',
                    role: 'cancel'
                }
            ]
        });

        await actionSheet.present();
    }
}
