import { Component, OnInit, OnDestroy, ViewChild, signal, computed, ElementRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Exercise } from 'src/app/core/models/exercise';
import { RepType } from 'src/app/core/models/rep-type';
import { WeightType } from 'src/app/core/models/weight-type';
import { ExerciseFormComponent } from '../form/exercise-form/exercise-form.component';
import { ExerciseFormGroup, ProgramFormsService } from '../core/services/program-forms.service';
import { TranslateModule } from '@ngx-translate/core';
import { DurationPipe } from '../core/pipes/duration.pipe';
import { AnimationController } from '@ionic/angular/standalone';
import { Constants } from '../core/constants/constants';

@Component({
    selector: 'app-exercise-wizard',
    templateUrl: './exercise-wizard.component.html',
    styleUrls: ['./exercise-wizard.component.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, ExerciseFormComponent, TranslateModule, DurationPipe],
    providers: [ProgramFormsService]
})
export class ExerciseWizardComponent implements OnInit, OnDestroy {

    exercises: ExerciseFormGroup[] = [];
    currentExerciseIndex = signal(0);

    animationDirection = null;

    currentExercise = computed(() => {
        const currentExercise = this.exercises[this.currentExerciseIndex()];

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
        private programFormsService: ProgramFormsService,
        private animationCtrl: AnimationController) {
    }

    ngOnInit() {
        this.initMockExercises();
        this.exercises.forEach(exerciseForm => {
            const id = exerciseForm.get('id')?.value;
        });
    }

    ngOnDestroy() {
        this.stopRest();
    }

    initMockExercises() {
        // TODO: fetch
        const mockExercises: Exercise[] = [
            {
                id: 'exercise1',
                name: 'Push Ups',
                tags: ['strength', 'upper body'],
                notes: 'Keep your back straight.',
                restDuration: 60,
                sets: [
                    {
                        type: RepType.Reps,
                        weightType: WeightType.BW,
                        value: 15,
                        currentValue: 15
                    },
                    {
                        type: RepType.Range,
                        weightType: WeightType.KG,
                        weight: 15,
                        previousWeight: 20,
                        previousValue: 5,
                        minValue: 4,
                        maxValue: 9,

                        // take from config
                        currentValue: 9,
                        currentWeight: 15
                    },
                    {
                        type: RepType.Max,
                        weightType: WeightType.BW,
                        value: 10,
                        previousValue: 50,
                        currentValue: 10,
                    },
                    {
                        type: RepType.Duration,
                        weightType: WeightType.NA,
                        value: 15,
                        previousValue: 25,
                        currentValue: 15
                    }
                ]
            },
            {
                id: 'exercise2',
                name: 'Squats',
                tags: ['strength', 'lower body'],
                notes: 'Keep your knees behind your toes.',
                restDuration: 60,
                sets: [
                    {
                        type: RepType.Reps,
                        weightType: WeightType.KG,
                        weight: 60,
                        value: 10
                    },
                    {
                        type: RepType.Reps,
                        weightType: WeightType.KG,
                        weight: 60,
                        value: 8
                    }
                ]
            },
            {
                id: 'exercise3',
                name: 'Bench Press',
                tags: ['strength', 'chest'],
                notes: 'Keep elbows at 45 degrees.',
                restDuration: 90,
                sets: [
                    {
                        type: RepType.Reps,
                        weightType: WeightType.LB,
                        weight: 135,
                        value: 8,
                        previousValue: 12,
                        previousWeight: 5
                    },
                    {
                        type: RepType.Reps,
                        weightType: WeightType.LB,
                        weight: 135,
                        value: 8,
                        previousValue: 5, // TODO: picked from last set at that index if its the same type (e.g. kg/reps)
                        previousWeight: 2
                    }
                ]
            }
        ];

        this.exercises = mockExercises.map(exercise =>
            this.programFormsService.createExerciseFormGroup(exercise)
        );
    }

    goToNextExercise() {
        if (this.currentExerciseIndex() < this.exercises.length - 1) {
            const leavingAnimation = this.animationCtrl.create()
                .addElement(this.exerciseContent.nativeElement)
                .duration(this.animationDuration)
                .easing('ease-out')
                .fromTo('opacity', '1', '0')
                .fromTo('transform', 'translateX(0)', 'translateX(-30px)');

            // Play the leaving animation
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
        // this.stopRest();
        // this.exerciseFormComponent.disabled.set(false);
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

    completeExercise() {
        // TODO
    }

    // Utility methods
    // getNextExercise(): ExerciseFormGroup | null {
    //     if (this.currentExerciseIndex < this.exercises.length - 1) {
    //         return this.exercises[this.currentExerciseIndex + 1];
    //     }
    //     return null;
    // }

    // getCurrentExerciseName(): string {
    //     return this.exercises[this.currentExerciseIndex]?.get('name')?.value || '';
    // }

    // getCurrentExerciseTags(): string[] {
    //     return this.exercises[this.currentExerciseIndex]?.get('tags')?.value || [];
    // }

    // getCurrentExerciseNotes(): string {
    //     return this.exercises[this.currentExerciseIndex]?.get('notes')?.value || '';
    // }
}
