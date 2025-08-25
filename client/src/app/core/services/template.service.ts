import { Injectable } from '@angular/core';
import { PocketbaseService } from './pocketbase.service';
import { ActionSheetController, AlertController, LoadingController, ModalController, NavController } from '@ionic/angular/standalone';
import { lastValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Template } from '../models/collections/template';
import { WorkoutState } from '../models/enums/workout-state';
import { User } from '../models/collections/user';
import { AssignModalComponent } from 'src/app/assign-modal/assign-modal.component';
import { Workout } from '../models/collections/workout';

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
        private alertController: AlertController,
        private loadingController: LoadingController,
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
                        return await this.deleteTemplate(templateId);
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
        const alert = await this.alertController.create({
            message: this.translateService.instant('Are you sure? This action cannot be undone.'),
            buttons: [
                {
                    text: this.translateService.instant('Yes'),
                    role: 'destructive',
                    handler: async () => {
                        await this.pocketbaseService.templates.delete(id);
                        return true;
                    }

                },
                {
                    text: this.translateService.instant('No'),
                    role: 'cancel',
                    handler: () => {
                        return false;
                    }
                },
            ],
        });
        await alert.present();
        const d = await alert.onDidDismiss();
        if (d && d.role === 'destructive')
            return true;
        return false;
    }

    async startWorkoutFromTemplate(template: Template) {
        const load = await this.loadingController.create({})
        const workout: Workout = {
            end: null,
            start: new Date(),
            exercises: template?.exercises,
            effort: 5,
            state: WorkoutState.InProgress
        };
        await load.present();
        await this.createAndNavToWorkout(workout);
        await load.dismiss();

    }

    async createAndNavToWorkout(workout: Workout) {

        const exerciseNames = workout.exercises.map(e => e.name);

        const filter = exerciseNames.map(name => `exercise.name = '${name}'`).join(' || ');
        const sets = await this.pocketbaseService.sets.getList(0, 20,
            {
                expand: 'exercise',
                filter,
                sort: '-completedAt, -index'
            }
        );

        const groupedSets = sets.items.reduce((acc, set: any) => {
            const name = set.exercise?.name;
            if (!name) return acc;
            if (!acc[name]) acc[name] = [];
            acc[name].push(set);
            return acc;
        }, {} as Record<string, typeof sets.items>);

        workout.exercises.forEach(ex => {
            const setsForExercise: any = groupedSets[ex.name];
            if (!setsForExercise || setsForExercise?.length === 0) return;
            ex.notes = setsForExercise[0]?.exercise?.notes || '';
            if (!setsForExercise) return;
            // Sort by completedAt desc, then by index asc
            setsForExercise.sort((a, b) => {
                if (b.completedAt !== a.completedAt) {
                    return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
                }
                return a.index - b.index;
            });

            // Keep only the latest set for each index
            const uniqueSetsByIndex = new Map<number, any>();
            for (const set of setsForExercise) {
                if (!uniqueSetsByIndex.has(set.index)) {
                    uniqueSetsByIndex.set(set.index, set);
                }
            }
            const filteredSetsForExercise = Array.from(uniqueSetsByIndex.values()).sort((a, b) => a.index - b.index);
            ex.sets.forEach((set, index) => {
                const previousSet = filteredSetsForExercise.find((s, i) => s.index === index || (s.index == 0 && i == index));
                if (previousSet) {
                    set.previousValue = previousSet.currentValue;
                    set.previousWeight = previousSet.currentWeight;
                }
            });
        });

        const wo = await this.pocketbaseService.upsertRecord('workouts', workout);
        return await this.navCtrl.navigateForward([`./workout-wizard/${wo.id}`]);
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
