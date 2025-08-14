import { Component, OnInit, OnDestroy, ViewChild, signal, computed, ElementRef } from '@angular/core';
import { ActionSheetController, AnimationController, ModalController, NavController, IonHeader, IonButton, IonLabel, IonToolbar, IonTitle, IonIcon, IonContent, IonChip, IonBackButton, IonButtons, IonSpinner, IonFooter, IonNote, IonCheckbox, AlertController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormArray, FormsModule } from '@angular/forms';
import { Exercise } from 'src/app/core/models/collections/exercise';
import { RepType } from 'src/app/core/models/enums/rep-type';
import { WeightType } from 'src/app/core/models/enums/weight-type';
import { ExerciseFormComponent } from '../form/exercise-form/exercise-form.component';
import { ExerciseFormGroup, ExerciseSetFormGroup, FormsService } from '../core/services/forms.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Constants } from '../core/constants/constants';
import { TimeBadgeComponent } from '../shared/time-badge/time-badge.component';
import { PocketbaseService } from '../core/services/pocketbase.service';
import { lastValueFrom, of, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Workout } from '../core/models/collections/workout';
import { WorkoutState } from '../core/models/enums/workout-state';
import { AutosaveService } from '../core/services/autosave.service';
import { ExerciseBM } from '../core/models/bm/exercise-bm';
import { Set } from '../core/models/collections/exercise-set';
import { PB } from '../core/constants/pb-constants';
import { NoDataComponent } from "../shared/no-data/no-data.component";
import { RestBadgeComponent } from "../shared/rest-badge/rest-badge.component";
import { ExerciseTemplateDetailComponent } from '../exercise-template/exercise-template-detail/exercise-template-detail.component';
import { ExerciseEffortModalComponent } from '../exercise-effort-modal/exercise-effort-modal.component';
import { ToastService } from '../core/services/toast-service';
import { WakeLockService } from '../core/services/WakeLockService';

@Component({
    selector: 'app-workout-wizard',
    templateUrl: 'workout-wizard.component.html',
    styleUrls: ['./workout-wizard.component.scss'],
    standalone: true,
    imports: [IonNote, IonFooter, IonSpinner, IonButtons,
        IonBackButton, IonChip, IonContent,
        IonIcon, IonTitle, IonToolbar, IonLabel,
        IonButton, IonHeader, CommonModule, FormsModule,
        ExerciseFormComponent, TranslateModule, TimeBadgeComponent,
        NoDataComponent, RestBadgeComponent],
    providers: [FormsService, AutosaveService]
})
export class WorkoutWizardComponent implements OnInit, OnDestroy {

    private unsubscribeAll = new Subject<void>();

    workoutId: string;
    workout: Workout;

    updateTimeout: any;
    exercises: ExerciseFormGroup[] = [];

    lastCompletedSet: ExerciseSetFormGroup = null;
    lastCompletedSetExercise: ExerciseFormGroup = null;

    currentExerciseIndex = signal(null);

    animationDirection = null;

    isDayCompleted = false;

    currentExercise = computed(() => {
        const currentExercise = this.exercises[this.currentExerciseIndex()];

        if (currentExercise) {
            this.autosaveService.register<ExerciseBM>(currentExercise, 'exercises', false)
                .pipe(takeUntil(this.unsubscribeAll))
                .subscribe();
        }

        return currentExercise;
    });

    nextExercise = computed(() => {
        const currentIndex = this.currentExerciseIndex();
        if (currentIndex < this.exercises.length - 1) {
            return this.exercises[currentIndex + 1];
        }
        return null;
    });

    RepType = RepType;
    WeightType = WeightType;

    animationDuration = Constants.ANIMATION_DURATION_MS;

    @ViewChild('exerciseForm') exerciseFormComponent: ExerciseFormComponent;
    @ViewChild('exerciseContent', { read: ElementRef }) exerciseContent: ElementRef;

    constructor(
        private programFormsService: FormsService,
        private animationCtrl: AnimationController,
        private pocketbaseService: PocketbaseService,
        private activatedRoute: ActivatedRoute,
        private modalCtrl: ModalController,
        private navCtrl: NavController,
        private translateService: TranslateService,
        private autosaveService: AutosaveService,
        private actionSheetCtrl: ActionSheetController,
        private toast: ToastService,
        private alertController: AlertController,
        private wake: WakeLockService
    ) { }

    ngOnInit() {
        this.activatedRoute.params
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(params => {
                const id = params['id'];
                this.refresh(id);
            });
    }

    ngOnDestroy() {
        this.unsubscribeAll.next(null);
        this.unsubscribeAll.complete();
    }

    async getPreviousOfWorkoutType() {
        // get previous weights and values for the current workout type
    }

    async refresh(id: string) {
        if (!id) return;

        this.workoutId = id;

        const res = await this.pocketbaseService.workouts.getOne(id, { expand: 'exercises,exercises.sets' });
        this.workout = res;

        // get oprevious weights and values
        await this.getPreviousOfWorkoutType();

        this.isDayCompleted = this.workout.state === WorkoutState.Completed;

        this.exercises = res.exercises.map(exercise =>
            this.programFormsService.createExerciseFormGroup(exercise)
        );

        // rest set
        const lastCompletedSet = this.workout.exercises.flatMap(e => e.sets)
            .filter(s => s.completed && s.completedAt)
            .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt)?.getTime())[0];
        if (lastCompletedSet && !lastCompletedSet.restSkipped) {
            const lastCompletedSetExercise = this.workout.exercises.find(e => e.sets.includes(lastCompletedSet));

            this.lastCompletedSet = this.exercises.flatMap(e => e.controls.sets.controls).find(s => s.controls.id.value == lastCompletedSet.id);
            this.lastCompletedSetExercise = this.exercises.find(e => e.controls.id.value == lastCompletedSetExercise.id);
        } else {
            this.lastCompletedSet = null;
            this.lastCompletedSetExercise = null;
        }

        const nextIncompleteExercise = this.getNextIncompleteExercise(res.exercises);
        const lastExerciseIndex = (this.exercises?.length ?? 0) - 1;

        this.currentExerciseIndex.set(nextIncompleteExercise
            ? res.exercises.findIndex(ex => ex.id === nextIncompleteExercise.id)
            : lastExerciseIndex
        );
    }

    goToNextExerciseSuperSet(superset) {
        let nextSuperset = null;
        let nextName = ""
        if (superset != null && superset != "") {
            this.workout.exercises.forEach((ex, i) => {
                if (ex.superset == superset && i != this.currentExerciseIndex()) {
                    nextSuperset = i;
                    nextName = ex.name;
                }
            })
        }
        if (nextSuperset >= 0) {
            this.toast.info(`Superset - ${nextName}`, "top")
            this.transitionToExercise(nextSuperset, this.currentExerciseIndex() > nextSuperset)
        }
    }

    getNextIncompleteExercise(exercises: Exercise[]): Exercise | undefined {
        return exercises?.find(ex => !ex.completed);
    }

    goToNextExercise() {
        if (this.currentExerciseIndex() < this.exercises.length - 1) {
            this.transitionToExercise(this.currentExerciseIndex() + 1);
        }
    }

    goToPreviousExercise() {
        if (this.currentExerciseIndex() > 0) {
            this.transitionToExercise(this.currentExerciseIndex() - 1, true);
        }
    }

    private async transitionToExercise(index: number, reverse = false) {
        const element = this.exerciseContent.nativeElement;
        const direction = reverse ? 1 : -1;

        try {
            await this.animationCtrl.create()
                .addElement(element)
                .duration(this.animationDuration)
                .easing('ease-out')
                .fromTo('opacity', 1, 0)
                .fromTo('transform', 'translateX(0)', `translateX(${direction * 60}px)`)
                .play();

            this.selectExercise(index);

            await this.animationCtrl.create()
                .addElement(element)
                .duration(this.animationDuration)
                .easing('ease-out')
                .fromTo('opacity', 0, 1)
                .fromTo('transform', `translateX(${direction * -60}px)`, 'translateX(0)')
                .play();

        } catch {
            this.selectExercise(index);
        }
    }

    selectExercise(index: number) {
        if (!this.exercises[index]) return;

        const currentExerciseIndex = this.currentExerciseIndex();

        const currentExercise = this.exercises[currentExerciseIndex];
        const nextExercise = this.exercises[index];

        if (index > currentExerciseIndex) {
            currentExercise.controls.completed.setValue(true);
            nextExercise.controls.completed.setValue(false);
        } else if (nextExercise.controls.completed.value) {
            currentExercise.controls.completed.setValue(false);
            nextExercise.controls.completed.setValue(false);
        }

        // TODO: UNDEVBUGGABLE -> why do we call here upsertRecord?
        if (currentExercise.dirty) {
            this.pocketbaseService.upsertRecord('exercises', currentExercise.value, false, true);
        }
        if (nextExercise.dirty) {
            this.pocketbaseService.upsertRecord('exercises', nextExercise.value, false, true);
        }

        this.currentExerciseIndex.set(index);
    }

    startRest(setIndex: number) {
        const setForms = this.currentExercise().controls.sets as FormArray<ExerciseSetFormGroup>;
        const setForm = setForms.at(setIndex);

        this.lastCompletedSet = setForm;
        this.lastCompletedSetExercise = this.exercises.find(e => e.controls.sets.controls.find(s => s.controls.id.value == setForm.controls.id.value) != null)
    }

    onRestSkipped() {
        this.lastCompletedSet.controls.restSkipped.setValue(true);
    }

    async handleUncompletedSets() {
        await this.workout.exercises.forEach(async exercise => {
            await exercise.sets.forEach(async set => {
                await this.pocketbaseService.sets.update(
                    set.id,
                    {
                        completed: true
                    } as Set,
                    {
                        headers: { ...PB.HEADER.NO_TOAST }
                    }
                );
            });
        });

        return lastValueFrom(of(true));
    }

    async openEffortModal() {
        const modal = await this.modalCtrl.create({
            component: ExerciseEffortModalComponent,
            breakpoints: [0, 0.75, 1],
            initialBreakpoint: 0.75,
            componentProps: {
                effort: this.workout.effort,
                comment: this.workout.comment,
                start: this.workout.start ? new Date(this.workout.start).toISOString() : new Date().toISOString(),
                end: this.workout.end ? new Date(this.workout.end).toISOString() : new Date().toISOString()
            }
        });

        await modal.present();

        const { data } = await modal.onWillDismiss();


        if (data && data.comment !== undefined) {
            this.workout.comment = data.comment;
        }

        if (data && data.effort !== undefined) {
            this.workout.effort = data.effort;
        }

        if (data && data.start) {
            this.workout.start = new Date(data.start);
        }

        if (data && data.end) {
            this.workout.end = new Date(data.end);
        }

        if (data) {
            await this.completeWorkout();
            this.wake.disable();
        }
        

    }

    async completeWorkout() {

        const model = {
            id: this.workout.id,
            state: WorkoutState.Completed,
            start: this.workout.start ?? new Date(),
            end: this.workout.end ?? new Date(),
            effort: this.workout.effort,
            comment: this.workout.comment,
        } as Workout;

        await this.handleUncompletedSets(); // TF is this??

        await this.pocketbaseService.workouts.update(model.id, model);
        this.navCtrl.navigateBack(['./tabs']);

    }

    async openExerciseInfo() {
        const modal = await this.modalCtrl.create({
            component: ExerciseTemplateDetailComponent,
            componentProps: { exercise: this.currentExercise().getRawValue() },
            presentingElement: await this.modalCtrl.getTop()
        });

        await modal.present();
    }



    async openSettings() {
        const translations = await lastValueFrom(this.translateService.get([
            'Add Exercise', 'Delete', 'Cancel'
        ]));

        const actionSheet = await this.actionSheetCtrl.create({
            header: translations.workout,
            buttons: [
                {
                    text: translations['Add Exercise'],
                    icon: 'add-circle-outline',
                    handler: async () => {
                        const exercises = await this.programFormsService.getExerciseTemplates();
                        if (!exercises || !exercises.length) return;
                        const exercisesArray = [];
                        const exercisesIdsArray = [];
                        for (const e of exercises as any) {
                            e.workout = this.workout.id;
                            const exercisesCreated = await this.pocketbaseService.exercises.create(e, { $autoCancel: false });
                            const fg = this.programFormsService.createExerciseFormGroup(exercisesCreated)
                            exercisesArray.push(fg);
                            exercisesIdsArray.push(exercisesCreated.id);
                        }
                        const currentIndex = this.currentExerciseIndex();
                        const oldEx = this.workout.exercises.map(e => e.id);
                        oldEx.splice(currentIndex + 1, 0, ...exercisesIdsArray);
                        const newExercises = oldEx;
                        const data = await this.pocketbaseService.workouts.update(this.workoutId, { exercises: newExercises })
                        this.exercises.splice(currentIndex + 1, 0, ...exercisesArray);
                        this.goToNextExercise();
                    }
                },
                {
                    text: translations.Delete,
                    icon: 'trash-outline',
                    role: 'destructive',
                    handler: async () => {
                        const alert = await this.alertController.create({
                            message: this.translateService.instant('Are you sure? This action cannot be undone.'),
                            buttons: [
                                {
                                    text: this.translateService.instant('Yes'),
                                    role: 'destructive',
                                    handler: async () => {
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
                        if (d && d.role === 'destructive') {
                            await this.pocketbaseService.workouts.delete(this.workout.id);
                            this.navCtrl.navigateBack(['./tabs']);
                        }
                    }
                },
                {
                    text: translations.Cancel,
                    icon: 'close-outline',
                    role: 'cancel'
                }
            ]
        });

        await actionSheet.present();
    }
}
