import { Component, effect, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { NavController, IonButton, IonToolbar, IonFooter, IonIcon, IonLabel, IonContent, IonHeader, IonTitle, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { FormType } from '../core/helpers/form-helpers';
import { RepType } from '../core/models/enums/rep-type';
import { WeightType } from '../core/models/enums/weight-type';
import { FormsService, ExerciseFormGroup } from '../core/services/forms.service';
import { ExerciseFormComponent } from '../form/exercise-form/exercise-form.component';
import { PocketbaseService } from '../core/services/pocketbase.service';
import { WorkoutBM } from '../core/models/bm/workout-bm';
import { WorkoutState } from '../core/models/enums/workout-state';
import { Exercise } from '../core/models/collections/exercise';

@Component({
    selector: 'app-workout',
    templateUrl: 'workout.component.html',
    styleUrls: ['./workout.component.scss'],
    standalone: true,
    imports: [IonBackButton, IonButtons, IonTitle, IonHeader, IonContent, IonLabel, IonIcon, IonFooter, IonToolbar, IonButton,
        TranslateModule,
        ReactiveFormsModule,
        FormsModule,
        ExerciseFormComponent
    ],
    providers: [FormsService]
})
export class WorkoutComponent implements OnInit {

    workoutForm: FormGroup<FormType<WorkoutBM>>;
    RepType = RepType;
    WeightType = WeightType;
    durationOptions = Array.from({ length: 60 }, (_, i) => ({ value: (i + 1) * 5 }));

    constructor(
        private formBuilder: FormBuilder,
        private programFormService: FormsService,
        private pocketbaseService: PocketbaseService,
        private navCtrl: NavController
    ) { }

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        this.workoutForm = this.formBuilder.group({
            id: [''],
            end: [null],
            start: [null],
            effort: [5],
            comment: [''],
            state: [WorkoutState.InProgress],
            exercises: this.formBuilder.array<ExerciseFormGroup>([]),
            day: [null]
        });
    }

    get exercisesArray() {
        return this.workoutForm.get('exercises') as FormArray<ExerciseFormGroup>;
    }

    async addExercises() {
        const exercises = await this.programFormService.getExerciseTemplates();
        if (!exercises || !exercises.length) return;

        exercises.map(e => {
            const exercise: Exercise = {
                ...e,
                workout: null
            }
            const fg = this.programFormService.createExerciseFormGroup(exercise);
            this.exercisesArray.push(fg);
        })
    }

    removeExercise(index: number) {
        this.exercisesArray.removeAt(index);
    }

    moveExerciseDown(index) {
        const exercisesArray = this.exercisesArray;
        if (index < 0 || index >= exercisesArray.length - 1) return;

        const currentExercise = exercisesArray.at(index);
        const nextExercise = exercisesArray.at(index + 1);

        exercisesArray.setControl(index, nextExercise);
        exercisesArray.setControl(index + 1, currentExercise);
    }

    moveExerciseUp(index) {
        const exercisesArray = this.exercisesArray;
        if (index <= 0 || index >= exercisesArray.length) return;

        const currentExercise = exercisesArray.at(index);
        const previousExercise = exercisesArray.at(index - 1);

        exercisesArray.setControl(index, previousExercise);
        exercisesArray.setControl(index - 1, currentExercise);
    }


    async saveChanges() {
        if (this.workoutForm.invalid) return;
        const workout = this.workoutForm.value;
        workout.start = new Date();
        const res = await this.pocketbaseService.upsertRecord('workouts', workout, false);
        this.navCtrl.navigateForward([`./workout-wizard/${res.id}`], { replaceUrl: true });
    }
}
