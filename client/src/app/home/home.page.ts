import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgSwitch, NgSwitchCase, NgTemplateOutlet } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActionSheetController, IonicModule, ModalController, NavController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { AssignModalComponent } from '../assign-program-modal/assign-modal.component';
import { Exercise } from '../core/models/exercise';
import { Program } from '../core/models/program';
import { User } from '../core/models/user';
import { Template } from '../core/models/template';
import { Workout } from '../core/models/workout';
import { TimeBadgeComponent } from '../shared/time-badge/time-badge.component';
import { DateTimePipe } from '../core/pipes/datetime.pipe';
import { RepType } from '../core/models/rep-type';
import { WeightType } from '../core/models/weight-type';
import { Set } from '../core/models/exercise-set';
import { WeightTypePipe } from '../core/pipes/weight-type.pipe';
import { PocketbaseService } from '../core/services/pocketbase.service';
import { NoDataComponent } from '../shared/no-data/no-data.component';
import { WorkoutState } from '../core/models/workout-state';
import { LoadingController } from '@ionic/angular/standalone';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
    standalone: true,
    imports: [
        IonicModule,
        FormsModule,
        NgSwitch,
        NgSwitchCase,
        TranslateModule,
        ReactiveFormsModule,
        TimeBadgeComponent,
        DateTimePipe,
        NgTemplateOutlet,
        WeightTypePipe,
        NoDataComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage {
    tab: string = "programs";

    WeightType = WeightType;
    RepType = RepType;

    workouts: (Workout & { nextExercise?: (Exercise & { nextSet?: Set }) })[] = [];
    programs: (Program & { tags: string[] })[] = [];
    templates: Template[] = [];

    constructor(
        private modalCtrl: ModalController,
        private navCtrl: NavController,
        private translateService: TranslateService,
        private actionSheetCtrl: ActionSheetController,
        private pocketbaseService: PocketbaseService,
        private loadingCtrl: LoadingController
    ) { }

    //#region Init
    ionViewWillEnter() {
        this.refresh();
    }

    async refresh() {
        this.pocketbaseService.workouts.getFullList({
            sort: '-start',
            filter: `state = ${WorkoutState.InProgress}`,
            expand: 'exercises,exercises.sets',
        }).then((workouts) => {
            this.workouts = workouts.map(w => {
                const nextExercise = this.getNextIncompleteExercise(w.exercises);
                const nextSet = this.getNextIncompleteSet(nextExercise?.sets);

                return {
                    ...w,
                    nextExercise: nextExercise && nextSet
                        ? { ...nextExercise, nextSet }
                        : undefined,
                };
            });
        });

        this.pocketbaseService.templates.getFullList({
            sort: '-created'
        }).then((templates) => {
            this.templates = templates;
        });

        this.pocketbaseService.programs.getFullList({
            sort: '-created',
            expand: 'weeks,weeks.days'
        }).then((programs) => {
            this.programs = programs.map(p => {
                const tagsToTake = 3;

                const tags = [...new Set(p.weeks.flatMap(w => w.days ?? []).flatMap(d => d.exercises ?? []).flatMap(e => e?.tags))];
                const tagsToShow = tags.splice(0, tagsToTake);

                if (tags.length > tagsToTake) {
                    tagsToShow.push(`+${tags.length - 3}`);
                }

                return {
                    ...p,
                    tags: tagsToShow
                }
            });
        });
    }

    getNextIncompleteExercise(exercises: Exercise[]): Exercise | undefined {
        return exercises.find(ex => !ex.completed);
    }

    getNextIncompleteSet(sets: Set[] | undefined): Set | undefined {
        return sets?.find(s => !s.completed);
    }
    //#endregion

    //#region Workout
    openNewWorkout() {
        this.navCtrl.navigateForward(['./workout']);
    }

    openWorkout(id: string) {
        this.navCtrl.navigateForward(['./workout-wizard', id]);
    }

    completeWorkout(id: string) {
        this.pocketbaseService.workouts.update(id, { completed: true }).then((workout) => {
            this.workouts = this.workouts.filter(w => w.id !== workout.id);
        });
    }
    //#endregion

    //#region Program
    newProgram() {
        this.navCtrl.navigateForward(['./program']);
    }

    editProgram(programId: string) {
        this.navCtrl.navigateForward([`./program/${programId}`]);
    }

    async presentProgramActionSheet(program: Program) {
        const programId = program.id;

        const translations = await lastValueFrom(this.translateService.get([
            'start', 'edit', 'close', 'delete', 'assign'
        ]));
        const actionSheet = await this.actionSheetCtrl.create({
            header: program.name,
            buttons: [
                {
                    text: translations.start,
                    icon: 'play-outline',
                    handler: () => {
                        this.startWorkoutFromProgram(programId);
                    },
                },
                {
                    text: translations.edit,
                    icon: 'create-outline',
                    handler: () => {
                        this.editProgram(programId);
                    },
                },
                // TODO: Trainer
                // {
                //     text: translations.assign,
                //     icon: 'person-add-outline',
                //     handler: () => {
                //         this.presentAssignProgramPopover(program);
                //     },
                // },
                {
                    text: translations.delete,
                    icon: 'trash-outline',
                    role: 'destructive',
                    handler: () => {
                        this.deleteProgram(programId);
                    },
                },
                {
                    text: translations.close,
                    icon: 'close-outline',
                    role: 'cancel',
                },
            ],
        });

        await actionSheet.present();
    }

    async startWorkoutFromProgram(programId: string) {
        return;

        const program = this.programs.find(p => p.id == programId);

        const workout: Workout = {
            end: null,
            start: new Date(),
            // TODO: TBD: pick exercises from next upcoming day/week NOW, complete 'week'/'day' as workout is completed)
            // New prop: week.completed, day.completed; link workout to day; if workout is completed complete day; if all days are completed, complete week: after all weeks completed: go from beggining
            exercises: [],
            state: WorkoutState.InProgress
        };

        const loading = await this.loadingCtrl.create({});
        loading.present();

        this.pocketbaseService.upsertRecord('workouts', workout).then((workout) => {
            loading.dismiss();
            this.navCtrl.navigateForward([`./workout-wizard/${workout.id}`]);
        });

        this.navCtrl.navigateForward([`./workout-wizard`]);
    }

    async presentAssignProgramPopover(program: Program) {
        const assign = (users) => {
            // TODO: Trainer
        }
        this.presentAssignPopover(program.name, assign);
    }

    deleteProgram(id: string): void {
        this.pocketbaseService.programs.delete(id).then(_ => {
            this.programs = this.programs.filter(exercise => exercise.id !== id);
        });
    }
    //#endregion

    //#region Template
    newTemplate() {
        this.navCtrl.navigateForward(['./template']);
    }

    async presentTemplateActionSheet(template: Template) {
        const templateId = template.id;

        const translations = await lastValueFrom(this.translateService.get([
            'start', 'edit', 'close', 'delete', 'template', 'assign'
        ]));
        const actionSheet = await this.actionSheetCtrl.create({
            header: template.name ?? translations.template,
            buttons: [
                {
                    text: translations.start,
                    icon: 'play-outline',
                    handler: () => {
                        this.startWorkoutFromTemplate(templateId);
                    },
                },
                {
                    text: translations.edit,
                    icon: 'create-outline',
                    handler: () => {
                        this.editTemplate(templateId);
                    },
                },
                // TODO: Trainer
                // {
                //     text: translations.assign,
                //     icon: 'person-add-outline',
                //     handler: () => {
                //         this.presentAssignTemplatePopover(template);
                //     },
                // },
                {
                    text: translations.delete,
                    icon: 'trash-outline',
                    role: 'destructive',
                    handler: () => {
                        this.deleteTemplate(templateId);
                    },
                },
                {
                    text: translations.close,
                    icon: 'close-outline',
                    role: 'cancel',
                },
            ],
        });

        await actionSheet.present();
    }

    async startWorkoutFromTemplate(templateId: string) {
        const template = this.templates.find(template => template.id == templateId);

        const workout: Workout = {
            end: null,
            start: new Date(),
            exercises: template?.exercises,
            state: WorkoutState.InProgress
        };

        const loading = await this.loadingCtrl.create({});
        loading.present();

        this.pocketbaseService.upsertRecord('workouts', workout, false).then((workout) => {
            loading.dismiss();
            this.navCtrl.navigateForward([`./workout-wizard/${workout.id}`]);
        });
    }

    editTemplate(templateId: string) {
        this.navCtrl.navigateForward([`./template/${templateId}`]);
    }

    presentAssignTemplatePopover(template: Template): void {
        const assign = (users) => {
            // TODO: Trainer
        }
        this.presentAssignPopover(template.name, assign);
    }

    deleteTemplate(id: string): void {
        this.pocketbaseService.templates.delete(id).then(_ => {
            this.templates = this.templates.filter(template => template.id !== id);
        })
    }
    //#endregion

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
    }
}
