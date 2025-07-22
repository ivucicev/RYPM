import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FormType } from '../core/helpers/form-helpers';
import { RepType } from '../core/models/enums/rep-type';
import { WeightType } from '../core/models/enums/weight-type';
import { FormsService, ExerciseFormGroup } from '../core/services/forms.service';
import { ExerciseFormComponent } from '../form/exercise-form/exercise-form.component';
import { PocketbaseService } from '../core/services/pocketbase.service';
import { WorkoutBM } from '../core/models/bm/workout-bm';
import { WorkoutState } from '../core/models/enums/workout-state';

@Component({
    selector: 'app-workout',
    templateUrl: 'workout.component.html',
    styleUrls: ['./workout.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
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
            state: [WorkoutState.InProgress],
            exercises: this.formBuilder.array<ExerciseFormGroup>([])
        });
    }

    get exercisesArray() {
        return this.workoutForm.get('exercises') as FormArray<ExerciseFormGroup>;
    }

    async addExercises() {
        const exercises = await this.programFormService.getExerciseTemplates();
        if (!exercises || !exercises.length) return;

        exercises.map(e => {
            const fg = this.programFormService.createExerciseFormGroup(e);
            this.exercisesArray.push(fg);
        })
    }

    removeExercise(index: number) {
        this.exercisesArray.removeAt(index);
    }

    async saveChanges() {
        if (this.workoutForm.valid) {
            const workout = this.workoutForm.value;
            workout.start = new Date();
            this.pocketbaseService.upsertRecord('workouts', workout, false).then(res => {
                this.navCtrl.navigateForward([`./workout-wizard/${res.id}`], { replaceUrl: true });
            });
        }
    }
}
