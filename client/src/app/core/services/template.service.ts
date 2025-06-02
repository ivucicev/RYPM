import { Injectable } from '@angular/core';
import { PocketbaseService } from './pocketbase.service';
import { ActionSheetController, ModalController, NavController } from '@ionic/angular/standalone';
import { lastValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Template } from '../models/collections/template';
import { Workout } from '../models/workout';
import { WorkoutState } from '../models/enums/workout-state';
import { User } from '../models/collections/user';
import { AssignModalComponent } from 'src/app/assign-modal/assign-modal.component';

export type TemplateActionKey = { [key in keyof typeof TEMPLATE_ACTIONS]?: boolean };

export const TEMPLATE_ACTIONS = {
    create_workout: 'create_workout',
    edit: 'edit',
    close: 'close',
    delete: 'delete',
    assign: 'assign',
    copy: 'copy'
};


@Injectable({
    providedIn: 'root'
})
export class TemplateService {

    constructor(
        private pocketbaseService: PocketbaseService,
        private actionSheetCtrl: ActionSheetController,
        private translateService: TranslateService,
        private modalCtrl: ModalController,
        private navCtrl: NavController
    ) {
    }

    async presentTemplateActionSheet(template: Template, excludeActions?: TemplateActionKey) {
        const templateId = template.id;

        if (!excludeActions) {
            excludeActions = {};
        };

        const translations = await lastValueFrom(this.translateService.get(Object.values(TEMPLATE_ACTIONS)));
        const actionSheet = await this.actionSheetCtrl.create({
            header: template.name ?? translations.template,
            buttons: [
                !excludeActions[TEMPLATE_ACTIONS.create_workout] ? {
                    text: translations.create_workout,
                    icon: 'play-outline',
                    handler: () => {
                        return this.startWorkoutFromTemplate(template);
                    },
                } : null,
                !excludeActions[TEMPLATE_ACTIONS.edit] ? {
                    text: translations.edit,
                    icon: 'create-outline',
                    handler: () => {
                        return this.editTemplate(templateId);
                    },
                } : null,
                // TODO: Trainer
                // {
                //     text: translations.assign,
                //     icon: 'person-add-outline',
                //     handler: () => {
                //         return this.presentAssignTemplatePopover(template);
                //     },
                // },
                !excludeActions[TEMPLATE_ACTIONS.copy] ? {
                    text: translations.copy,
                    icon: 'copy-outline',
                    data: {
                        reload: true,
                        constructive: true
                    },
                    handler: () => {
                        return this.copyTemplate(template);
                    },
                } : null,
                !excludeActions[TEMPLATE_ACTIONS.delete] ? {
                    text: translations.delete,
                    icon: 'trash-outline',
                    role: 'destructive',
                    data: {
                        reload: true,
                        destructive: true
                    },
                    handler: () => {
                        return this.deleteTemplate(templateId);
                    },
                } : null,
                {
                    text: translations.close,
                    icon: 'close-outline',
                    role: 'cancel',
                },
            ].filter(Boolean),
        });

        await actionSheet.present();

        return actionSheet;
    }

    //#region Actions
    newTemplate() {
        this.navCtrl.navigateForward(['./template']);
    }

    editTemplate(templateId: string) {
        this.navCtrl.navigateForward([`./template/${templateId}`]);
    }

    async copyTemplate(template: Template) {
        const newTemplate = {
            ...template,
            id: null
        }
        await this.pocketbaseService.upsertRecord('templates', newTemplate);

        return true;
    }

    async deleteTemplate(id: string) {
        await this.pocketbaseService.templates.delete(id);
        return true;
    }

    async startWorkoutFromTemplate(template: Template) {
        const workout: Workout = {
            end: null,
            start: new Date(),
            exercises: template?.exercises,
            state: WorkoutState.InProgress
        };

        this.createAndNavToWorkout(workout);
    }

    async createAndNavToWorkout(workout: Workout) {
        this.pocketbaseService.upsertRecord('workouts', workout).then((workout) => {
            this.navCtrl.navigateForward([`./workout-wizard/${workout.id}`]);
        });
    }
    //#endregion

    async presentAssignTemplatePopover(template: Template) {
        const assign = (users) => {
            // TODO: Trainer
        }
        const modal = await this.presentAssignPopover(template.name, assign);

        return modal;
    }

    async presentAssignPopover(title: string, func: (users: User) => void) {
        const modal = await this.modalCtrl.create({
            component: AssignModalComponent,
            componentProps: {
                title: title,
                onAssign: (users) => {
                    // TODO: Trainer
                    func(users)
                }
            }
        });

        await modal.present();

        return modal;
    }
}
