import { Component, CUSTOM_ELEMENTS_SCHEMA, viewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgSwitch, NgSwitchCase, NgTemplateOutlet } from '@angular/common';
import { IonButton, IonContent, IonSegment, IonSegmentButton, NavController } from '@ionic/angular/standalone';
import { Exercise } from '../core/models/collections/exercise';
import { Program } from '../core/models/collections/program';
import { Template } from '../core/models/collections/template';
import { Workout } from '../core/models/collections/workout';
import { TimeBadgeComponent } from '../shared/time-badge/time-badge.component';
import { DateTimePipe } from '../core/pipes/datetime.pipe';
import { RepType } from '../core/models/enums/rep-type';
import { WeightType } from '../core/models/enums/weight-type';
import { Set } from '../core/models/collections/exercise-set';
import { WeightTypePipe } from '../core/pipes/weight-type.pipe';
import { PocketbaseService } from '../core/services/pocketbase.service';
import { NoDataComponent } from '../shared/no-data/no-data.component';
import { WorkoutState } from '../core/models/enums/workout-state';
import { ContinueFooterComponent } from '../shared/continue-footer/continue-footer.component';
import { ProgramInfo, ProgramService } from '../core/services/program.service';
import { TemplateService } from '../core/services/template.service';
import { FormsModule } from '@angular/forms';

type WorkoutInfo = (Workout & { nextExercise?: (Exercise & { nextSet?: Set }) });

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['./home.page.scss'],
    standalone: true,
    imports: [
        NgSwitch,
        NgSwitchCase,
        TranslateModule,
        TimeBadgeComponent,
        IonSegment,
        IonSegmentButton,
        IonContent,
        IonButton,
        DateTimePipe,
        NgTemplateOutlet,
        FormsModule,
        WeightTypePipe,
        NoDataComponent,
        ContinueFooterComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage {
    tab: string = "programs";

    WeightType = WeightType;
    RepType = RepType;

    workouts: WorkoutInfo[] = [];
    programs: (ProgramInfo & { tags: string[] })[] = [];
    templates: Template[] = [];
    lastWorkout: Workout;

    continueFooter = viewChild(ContinueFooterComponent);

    constructor(
        private navCtrl: NavController,
        private pocketbaseService: PocketbaseService,
        private programService: ProgramService,
        private templateService: TemplateService
    ) { }

    //#region Init
    ionViewWillEnter() {
        this.refresh();
    }

    async refresh() {
        this.continueFooter()?.refresh();

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
            this.lastWorkout = this.workouts[0];
        });

        this.pocketbaseService.templates.getFullList({
            sort: '-created'
        }).then((templates) => {
            this.templates = templates;
        });

        this.pocketbaseService.programs.getFullList({
            sort: '-updated',
            expand: 'weeks,weeks.days,weeks.days.workout'
        }).then((programs) => {
            this.programs = programs.map(p => {
                const tagsToTake = 3;

                const tags = [
                    ...new Set(
                        p.weeks?.flatMap(w => w?.days ?? [])
                            ?.flatMap(d => d?.exercises ?? [])
                            ?.flatMap(e => [
                                ...(e?.primaryMuscles ?? []),
                                ...(e?.secondaryMuscles ?? [])
                            ])
                    )
                ];

                const tagsToShow: string[] = tags.splice(0, tagsToTake);

                if (tags.length > tagsToTake) {
                    tagsToShow.push(`+${tags.length - 3}`);
                }

                return {
                    ...ProgramService.mapProgram(p),
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
        this.programService.newProgram();
    }

    editProgram(programId: string) {
        this.programService.editProgram(programId);
    }

    async presentProgramActionSheet(program: Program) {
        const actionSheet = await this.programService.presentProgramActionSheet(program.id);
        actionSheet.onDidDismiss().then(e => {
            if (e.data?.reload) {
                this.refresh();
            }
        })
    }

    async presentAssignProgramPopover(program: Program) {
        const actionSheet = await this.programService.presentAssignProgramPopover(program);
        actionSheet.onDidDismiss().then(e => {
            if (e.data?.reload) {
                this.refresh();
            }
        })
    }

    async deleteProgram(id: string) {
        await this.programService.deleteProgram(id);
        this.refresh();
    }
    //#endregion

    //#region Template
    newTemplate() {
        this.templateService.newTemplate();
    }

    editTemplate(templateId: string) {
        this.templateService.editTemplate(templateId);
    }

    async presentAssignTemplatePopover(template: Template) {
        const actionSheet = await this.templateService.presentTemplateActionSheet(template);
        actionSheet.onDidDismiss().then(e => {
            if (e.data?.reload) {
                this.refresh();
            }
        })
    }

    async presentTemplateActionSheet(template: Template) {
        const actionSheet = await this.templateService.presentTemplateActionSheet(template);
        actionSheet.onDidDismiss().then(e => {
            if (e.data?.reload) {
                this.refresh();
            }
        })
    }

    async deleteTemplate(id: string) {
        await this.templateService.deleteTemplate(id);
        this.refresh();
    }
    //#endregion
}
