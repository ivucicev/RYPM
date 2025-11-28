import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, viewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { JsonPipe, NgSwitch, NgSwitchCase, NgTemplateOutlet, UpperCasePipe } from '@angular/common';
import { Animation, AnimationController, IonButton, IonContent, IonSegment, IonSegmentButton, LoadingController, NavController } from '@ionic/angular/standalone';
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
import { WakeLockService } from '../core/services/WakeLockService';
import { StorageService } from '../core/services/storage.service';
import { StorageKeys } from '../core/constants/storage-keys';
import { ActivatedRoute } from '@angular/router';
import { flash, flashOutline } from 'ionicons/icons';

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
        ContinueFooterComponent,
        UpperCasePipe
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
    activeProgramIds = [];

    continueFooter = viewChild(ContinueFooterComponent);
    isInital = false;
    flashIcon = flash;

    constructor(
        private navCtrl: NavController,
        private pocketbaseService: PocketbaseService,
        private programService: ProgramService,
        private templateService: TemplateService,
        private wake: WakeLockService,
        private animationCtrl: AnimationController,
        private storage: StorageService,
        private route: ActivatedRoute

    ) {
        this.isInital = true;
        this.route.queryParams.subscribe((r: any) => {
            if (r.tab && r.tab == 'templates') {
                this.getTemplates();
            }
        })
    }

    //#region Init
    async ionViewWillEnter() {
        const active = await this.storage.getItem<Workout>(StorageKeys.WORKOUT_WIZARD_LAST_WORKOUT)
        if (active?.id && this.isInital) {
            await this.navCtrl.navigateForward([`./workout-wizard/${active.id}`]);
            this.isInital = false;
            return;
        } else {
            await this.refresh();
            this.isInital = false;
        }
    }

    getTemplates = async () => {
        const templates = await this.pocketbaseService.templates.getFullList({
            sort: '-created'
        });

        this.templates = templates;
    }

    refresh = async () => {

        await this.continueFooter()?.refresh();

        const workouts = await this.pocketbaseService.workouts.getFullList({
            sort: '-start',
            filter: `state = ${WorkoutState.InProgress}`,
            expand: 'exercises_via_workout,exercises_via_workout.sets_via_exercise',
        })

        this.workouts = workouts.map(w => {

            const nextExercise = this.getNextIncompleteExercise(w.exercises);
            const nextSet = this.getNextIncompleteSet(nextExercise?.sets);

            return {
                ...w,
                nextExercise: { ...nextExercise, nextSet },
            };
        });

        this.lastWorkout = this.workouts[0];

        this.activeProgramIds.length = 0;

        const programs = await this.pocketbaseService.programs.getFullList({
            sort: '-updated',
            expand: 'weeks_via_program,weeks_via_program.days_via_week.workouts_via_day'
        })

        this.programs = programs.map(p => {
            const tagsToTake = 3;
            // Check if any workout in any day of any week has state == 1
            const hasInProgress = p.weeks?.some(week =>
                week?.days?.some(day => {
                    // TODO: map better
                    day.workout = day.workouts?.length ? day.workouts[0] : null;
                    if (day?.workout?.state === WorkoutState.InProgress) {
                        p['workoutId'] = day.workout.id;
                        return true;
                    }
                    return false;
                })
            );

            if (hasInProgress) {
                this.activeProgramIds.push(p.id);
                p['active'] = true;
                this.wake.enable();
                this.animate()
            }

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

            const tagsToShow: string[] = tags;

            const mapped =
            {
                ...ProgramService.mapProgram(p),
                tags: tagsToShow
            }

            return mapped;
        });
        this.programs = this.programs.sort((a: any, b: any) => (b['active'] === true) as any - ((a['active'] === true) as any));

    }

    getNextIncompleteExercise(exercises: Exercise[]): Exercise | undefined {
        return exercises.find(ex => ex.sets?.some(set => !set.completed));
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

    async completeWorkout(id: string) {
        const workout = await this.pocketbaseService.workouts.update(id, { completed: true });
        this.workouts = this.workouts.filter(w => w.id !== workout.id);
    }
    //#endregion

    //#region Program
    newProgram() {
        this.programService.newProgram();
    }

    editProgram(programId: string) {
        this.programService.editProgram(programId);
    }

    async presentProgramActionSheet(program: ProgramInfo) {
        if (program['active'] == true && program['workoutId']) {
            this.navCtrl.navigateForward([`./workout-wizard/${program['workoutId']}`]);
            return;
        }
        const actionSheet = await this.programService.presentProgramActionSheet(program.id, program);
        const e = await actionSheet.onDidDismiss();
        if (e.data?.reload) {
            this.refresh();
        }
    }

    async presentAssignProgramPopover(program: ProgramInfo) {
        const actionSheet = await this.programService.presentAssignProgramPopover(program);
        const e = await actionSheet.onDidDismiss();
        if (e.data?.reload) {
            this.refresh();
        }
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
        const e = await actionSheet.onDidDismiss();
        if (e.data?.reload) {
            await this.getTemplates();
        }
    }

    async presentTemplateActionSheet(template: Template) {
        const actionSheet = await this.templateService.presentTemplateActionSheet(template);
        const e = await actionSheet.onDidDismiss();
        if (e.data?.reload) {
            await this.getTemplates();
        }
    }

    async deleteTemplate(id: string) {
        await this.templateService.deleteTemplate(id);
        await this.getTemplates();
    }
    //#endregion

    async onTabChange(e) {
        if (e == 'templates') {
           await this.getTemplates(); 
        } else if (e == 'programs') {
            await this.refresh();
        }
    }

    private animation!: Animation;

    private animate() {
        setTimeout(() => {
            this.animation = this.animationCtrl
                .create()
                .addElement(document.getElementById('active-animation'))
                .duration(1000)
                .iterations(Infinity)
                .fromTo('transform', 'scale(1)', 'scale(1.2)')
                .fromTo('opacity', '1', '0.8');
            this.animation.play()
        }, 500)
    }
}
