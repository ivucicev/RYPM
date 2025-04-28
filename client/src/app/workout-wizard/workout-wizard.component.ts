import { Component, OnInit, OnDestroy, ViewChild, signal, computed, ElementRef } from '@angular/core';
import { IonicModule, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Exercise } from 'src/app/core/models/exercise';
import { RepType } from 'src/app/core/models/rep-type';
import { WeightType } from 'src/app/core/models/weight-type';
import { ExerciseFormComponent } from '../form/exercise-form/exercise-form.component';
import { ExerciseFormGroup, FormsService } from '../core/services/forms.service';
import { TranslateModule } from '@ngx-translate/core';
import { DurationPipe } from '../core/pipes/duration.pipe';
import { AnimationController, NavController } from '@ionic/angular/standalone';
import { Constants } from '../core/constants/constants';
import { TimeBadgeComponent } from '../shared/time-badge/time-badge.component';
import { PocketbaseService } from '../core/services/pocketbase.service';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Workout } from '../core/models/workout';
import { WorkoutState } from '../core/models/workout-state';
import { AutosaveService } from '../core/services/autosave.service';
import { ExerciseBM } from '../core/models/bm/exercise-bm';

@Component({
    selector: 'app-workout-wizard',
    templateUrl: './workout-wizard.component.html',
    styleUrls: ['./workout-wizard.component.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, ExerciseFormComponent, TranslateModule, DurationPipe, TimeBadgeComponent],
    providers: [FormsService, AutosaveService]
})
export class WorkoutWizardComponent implements OnInit, OnDestroy {

    private unsubscribeAll = new Subject<void>();

    workout: Workout;

    updateTimeout: any;
    exercises: ExerciseFormGroup[] = [];
    currentExerciseIndex = signal(null);

    animationDirection = null;

    currentExercise = computed(() => {
        const currentExercise = this.exercises[this.currentExerciseIndex()];

        if (currentExercise) {
            this.autosaveService.register<ExerciseBM>(currentExercise, 'exercises', false)
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

    isResting = false;
    restTimeRemaining = 0;
    restTimerId: any;

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
        private navCtrl: NavController,
        private autosaveService: AutosaveService,
        private loadingCtrl: LoadingController
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
        this.stopRest();

        this.unsubscribeAll.next(null);
        this.unsubscribeAll.complete();
    }

    async refresh(id: string) {
        if (!id) return;

        this.pocketbaseService.workouts.getOne(id, { expand: 'exercises,exercises.sets' }).then((res) => {
            this.workout = res;
            this.exercises = res.exercises.map(exercise =>
                this.programFormsService.createExerciseFormGroup(exercise)
            );
            const nextIncompleteExercise = this.getNextIncompleteExercise(res.exercises);
            this.currentExerciseIndex.set(nextIncompleteExercise
                ? res.exercises.findIndex(ex => ex.id === nextIncompleteExercise.id)
                : 0
            );
        });
    }

    getNextIncompleteExercise(exercises: Exercise[]): Exercise | undefined {
        return exercises?.find(ex => !ex.completed);
    }

    goToNextExercise() {
        if (this.currentExerciseIndex() < this.exercises.length - 1) {
            // TODO: this is a quick fix; find alt
            const leavingAnimation = this.animationCtrl.create()
                .addElement(this.exerciseContent.nativeElement)
                .duration(this.animationDuration)
                .easing('ease-out')
                .fromTo('opacity', '1', '0')
                .fromTo('transform', 'translateX(0)', 'translateX(-30px)');

            leavingAnimation.play();

            leavingAnimation.onFinish(() => {
                this.selectExercise(this.currentExerciseIndex() + 1);

                const enteringAnimation = this.animationCtrl.create()
                    .addElement(this.exerciseContent.nativeElement)
                    .duration(this.animationDuration)
                    .easing('ease-out')
                    .fromTo('opacity', '0', '1')
                    .fromTo('transform', 'translateX(30px)', 'translateX(0)');

                enteringAnimation.play();
            });
        }
    }

    goToPreviousExercise() {
        if (this.currentExerciseIndex() > 0) {
            // TODO: this is a quick fix; find alt
            const leavingAnimation = this.animationCtrl.create()
                .addElement(this.exerciseContent.nativeElement)
                .duration(this.animationDuration)
                .easing('ease-out')
                .fromTo('opacity', '1', '0')
                .fromTo('transform', 'translateX(0)', 'translateX(30px)');

            leavingAnimation.play();

            leavingAnimation.onFinish(() => {
                this.selectExercise(this.currentExerciseIndex() - 1);

                const enteringAnimation = this.animationCtrl.create()
                    .addElement(this.exerciseContent.nativeElement)
                    .duration(this.animationDuration)
                    .easing('ease-out')
                    .fromTo('opacity', '0', '1')
                    .fromTo('transform', 'translateX(-30px)', 'translateX(0)');

                enteringAnimation.play();
            });
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

        this.pocketbaseService.upsertRecord('exercises', currentExercise.value, false, true);
        this.pocketbaseService.upsertRecord('exercises', nextExercise.value, false, true);

        this.currentExerciseIndex.set(index);
    }

    startRest(duration: number) {
        this.stopRest();

        this.isResting = true;
        this.restTimeRemaining = duration;

        this.restTimerId = setInterval(() => {
            this.restTimeRemaining--;
            if (this.restTimeRemaining <= 0) {
                this.stopRest();
            }
        }, 1000);
    }

    stopRest() {
        if (this.restTimerId) {
            clearInterval(this.restTimerId);
            this.restTimerId = null;
        }
        this.isResting = false;
    }

    async completeWorkout() {
        const model = {
            id: this.workout.id,
            state: WorkoutState.Completed,
            end: new Date()
        } as Workout;

        const loading = await this.loadingCtrl.create({});
        loading.present();
        this.pocketbaseService.upsertRecord('workouts', model).then((_) => {
            loading.dismiss();
            this.navCtrl.navigateBack(['./tabs']);
        })
    }
}
