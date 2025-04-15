import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActionSheetController, IonicModule } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { DateTimePipe } from '../core/pipes/datetime.pipe';

@Component({
    selector: 'app-my-activity',
    templateUrl: './my-activity.page.html',
    styleUrls: ['./my-activity.page.scss'],
    standalone: true,
    imports: [IonicModule, TranslateModule, DateTimePipe],
})
export class MyActivityPage {

    // TODO
    currentWorkout: any = {
        id: 'workout-001',
        createdBy: {
            id: 'trainer-123',
            name: 'Sarah Trainer',
            isCurrentUser: false
        },
        program: {

        },
        start: new Date('2025-04-10T09:45:00'),
        isActive: true,
        exercises: [
            {
                id: 'ex-1',
                name: 'Bench Press',
                tags: ['chest', 'strength'],
                restDuration: 90,
                sets: [
                    { id: 's1', reps: 10, weight: 60 },
                    { id: 's2', reps: 8, weight: 65 },
                    { id: 's3', reps: 6, weight: 70 }
                ]
            },
            {
                id: 'ex-2',
                name: 'Pull-ups',
                tags: ['back', 'upper-body'],
                restDuration: 60,
                sets: [
                    { id: 's4', reps: 8, weight: 0 },
                    { id: 's5', reps: 8, weight: 0 },
                    { id: 's6', reps: 8, weight: 0 }
                ]
            },
            {
                id: 'ex-3',
                name: 'Squats',
                tags: ['legs', 'lower-body'],
                restDuration: 120,
                sets: [
                    { id: 's7', reps: 12, weight: 100 },
                    { id: 's8', reps: 10, weight: 110 },
                    { id: 's9', reps: 8, weight: 120 }
                ]
            },
            {
                id: 'ex-4',
                name: 'Shoulder Press',
                tags: ['shoulders', 'upper-body'],
                restDuration: 90,
                sets: [
                    { id: 's10', reps: 10, weight: 40 },
                    { id: 's11', reps: 8, weight: 45 },
                ]
            },
            {
                id: 'ex-5',
                name: 'Deadlift',
                tags: ['back', 'legs', 'compound'],
                restDuration: 120,
                sets: [
                    { id: 's12', reps: 8, weight: 140 },
                    { id: 's13', reps: 6, weight: 150 },
                    { id: 's14', reps: 5, weight: 160 }
                ]
            }
        ]
    };

    constructor(
        private actionSheetCtrl: ActionSheetController,
        private translateService: TranslateService
    ) { }

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
                        console.log('Edit workout clicked');
                    }
                },
                {
                    text: translations.chat_w_trainer,
                    icon: 'chatbubble-outline',
                    handler: () => {
                        this.chatWithTrainer();
                    }
                },
                {
                    text: translations.end,
                    icon: 'stop-circle-outline',
                    handler: () => {
                        console.log('End workout clicked');
                        this.currentWorkout.isActive = false;
                        this.currentWorkout.end = new Date();
                    }
                },
                {
                    text: translations.delete,
                    icon: 'trash-outline',
                    role: 'destructive',
                    handler: () => {
                        console.log('Delete workout clicked');
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

    continueWorkout() {
        // TODO
        console.log('Continue workout clicked');
    }

    chatWithTrainer() {
        console.log('Chat with trainer clicked');
        // Logic to open chat interface with the trainer
    }
}
