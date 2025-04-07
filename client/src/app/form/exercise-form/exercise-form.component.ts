import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormArray } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { RepType } from 'src/app/core/models/rep-type';
import { WeightType } from 'src/app/core/models/weight-type';
import { DurationPipe } from 'src/app/core/pipes/duration.pipe';
import { ExerciseNotesModalComponent } from 'src/app/exercise-notes-modal/exercise-notes-modal.component';
import { ExerciseFormGroup, ProgramFormsService, ExerciseSetFormGroup } from 'src/app/core/services/program-forms.service';
import { ExerciseSet } from 'src/app/core/models/set';
import { SelectOnFocusDirective } from 'src/app/core/directives/select-on-focus.directive';

@Component({
    selector: 'app-exercise-form',
    templateUrl: './exercise-form.component.html',
    styleUrls: ['./exercise-form.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        TranslateModule,
        ReactiveFormsModule,
        FormsModule,
        DurationPipe,
        SelectOnFocusDirective
    ],
    providers: [ProgramFormsService]
})
export class ExerciseFormComponent {

    durationOptions: { value: number }[] = [
        { value: 0 }
    ];

    RepType = RepType;
    WeightType = WeightType;

    @Input() exercise: ExerciseFormGroup;

    constructor(
        private modalCtrl: ModalController,
        private programFormService: ProgramFormsService,
    ) {
        for (let seconds = 5; seconds <= 600; seconds += 5) {
            this.durationOptions.push({ value: seconds });
        }
    }

    get setsArray() {
        return this.exercise.get('sets') as FormArray<ExerciseSetFormGroup>;
    }

    addSet() {
        const sets = this.setsArray;
        const lastSet = sets.at(sets.length - 1)?.value as ExerciseSet;

        const sfg = this.programFormService.createSetFormGroup(lastSet);
        sets.push(
            sfg
        );
    }

    removeSet() {
        const setsArray = this.setsArray;

        if (setsArray.length > 1) {
            setsArray.removeAt(setsArray.length - 1);
        }
    }

    async onOpenNotes() {
        const modal = await this.modalCtrl.create({
            component: ExerciseNotesModalComponent,
            breakpoints: [0, 0.5, 0.75],
            initialBreakpoint: 0.5,
            componentProps: {
                notes: this.exercise.get('notes').value,
                exerciseName: this.exercise.get('name').value
            }
        });

        await modal.present();

        const { data } = await modal.onWillDismiss();
        if (data && data.notes !== undefined) {
            this.exercise.get('notes').setValue(data.notes);
        }
    }
}
