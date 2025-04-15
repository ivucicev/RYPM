import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ExerciseFormComponent } from '../form/exercise-form/exercise-form.component';
import { RepType } from '../core/models/rep-type';
import { WeightType } from '../core/models/weight-type';
import { ExerciseFormGroup, ProgramFormsService } from '../core/services/program-forms.service';
import { FormType } from '../core/helpers/form-helpers';
import { Template } from '../core/models/Template';

@Component({
    selector: 'app-template',
    templateUrl: './template.component.html',
    styleUrls: ['./template.component.scss'],
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
export class TemplateComponent implements OnInit {
    templateForm: FormGroup<FormType<Template>>;
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
        this.templateForm = this.formBuilder.group({
            id: [''],
            name: [''],
            exercises: this.formBuilder.array<ExerciseFormGroup>([])
        });
    }

    get exercisesArray() {
        return this.templateForm.get('exercises') as FormArray<ExerciseFormGroup>;
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
        if (this.templateForm.valid) {
            const templateData = this.templateForm.value;
            // TODO
            console.log('Saving template:', templateData);
        }
    }
}
