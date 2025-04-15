import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FormType } from '../core/helpers/form-helpers';
import { RepType } from '../core/models/rep-type';
import { WeightType } from '../core/models/weight-type';
import { ProgramFormsService, ExerciseFormGroup } from '../core/services/program-forms.service';
import { ExerciseFormComponent } from '../form/exercise-form/exercise-form.component';
import { Workout } from '../core/models/workout';

@Component({
    selector: 'app-workout',
    templateUrl: './workout.component.html',
    styleUrls: ['./workout.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        TranslateModule,
        ReactiveFormsModule,
        FormsModule,
        ExerciseFormComponent
    ],
    providers: [ProgramFormsService]
})
export class WorkoutComponent implements OnInit {

    workoutForm: FormGroup<FormType<Workout>>;
    RepType = RepType;
    WeightType = WeightType;
    durationOptions = Array.from({ length: 60 }, (_, i) => ({ value: (i + 1) * 5 }));

    constructor(
        private formBuilder: FormBuilder,
        private programFormService: ProgramFormsService
    ) { }

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        this.workoutForm = this.formBuilder.group({
            id: [''],
            createdById: [''],
            end: [null],
            start: [null],
            userId: [''],
            exercises: this.formBuilder.array<ExerciseFormGroup>([])
        });
    }

    get exercisesArray() {
        return this.workoutForm.get('exercises') as FormArray<ExerciseFormGroup>;
    }

    async addExercises() {
        const exercises = await this.programFormService.getExercises();
        if (!exercises || !exercises.length) return;

        exercises.map(e => {
            const fg = this.programFormService.createExerciseFormGroup(e);
            this.exercisesArray.push(fg);
        })
    }

    removeExercise(index: number) {
        this.exercisesArray.removeAt(index);
    }

    saveChanges() {
        if (this.workoutForm.valid) {
            const workoutData = this.workoutForm.value;
            // TODO
            console.log('Saving & starting workout:', workoutData);
        }
    }

}
