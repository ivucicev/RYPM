import { Injectable } from '@angular/core';
import { PocketbaseService } from './pocketbase.service';
import { ActionSheetController, AlertController, ModalController, NavController } from '@ionic/angular/standalone';
import { lastValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Template } from '../models/collections/template';
import { Workout } from '../models/workout';
import { WorkoutState } from '../models/enums/workout-state';
import { User } from '../models/collections/user';
import { AssignModalComponent } from 'src/app/assign-modal/assign-modal.component';

export type TemplateActionKey = { [key in keyof typeof TEMPLATE_ACTIONS]?: boolean };

export const TEMPLATE_ACTIONS = {
    start: 'Start',
    edit: 'Edit',
    close: 'Close',
    delete: 'Delete',
    assign: 'Assign',
    copy: 'Copy'
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
        private navCtrl: NavController,
        private alertController: AlertController
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
                !excludeActions[TEMPLATE_ACTIONS.start] ? {
                    text: translations['Start'],
                    icon: 'play-outline',
                    handler: () => {
                        return this.startWorkoutFromTemplate(template);
                    },
                } : null,
                !excludeActions[TEMPLATE_ACTIONS.edit] ? {
                    text: translations.Edit,
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
                    text: translations.Copy,
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
                    text: translations.Delete,
                    icon: 'trash-outline',
                    role: 'destructive',
                    data: {
                        reload: true,
                        destructive: true
                    },
                    handler: async () => {
                        const alert = await this.alertController.create({
                            message: 'Are you sure? This action cannot be undone.',
                            buttons: [
                                {
                                    text: 'Yes',
                                    role: 'destructive',
                                    handler: async (e) => {
                                        return await this.deleteTemplate(templateId);
                                    }

                                },
                                {
                                    text: 'No',
                                    role: 'cancel'
                                },
                            ],
                        });
                        alert.present();
                    },
                } : null,
                {
                    text: translations.Close,
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
            effort: 5,
            state: WorkoutState.InProgress
        };

        this.createAndNavToWorkout(workout);
    }

    async createAndNavToWorkout(workout: Workout) {
        const wo = await this.pocketbaseService.upsertRecord('workouts', workout);
        this.navCtrl.navigateForward([`./workout-wizard/${wo.id}`]);
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
