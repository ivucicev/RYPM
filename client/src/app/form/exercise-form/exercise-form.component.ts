import { Component, Input, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormArray } from '@angular/forms';
import { IonicModule, ModalController, IonModal } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { RepType } from 'src/app/core/models/rep-type';
import { WeightType } from 'src/app/core/models/weight-type';
import { DurationPipe } from 'src/app/core/pipes/duration.pipe';
import { ExerciseNotesModalComponent } from 'src/app/exercise-notes-modal/exercise-notes-modal.component';
import { ExerciseFormGroup, ProgramFormsService, ExerciseSetFormGroup } from 'src/app/core/services/program-forms.service';
import { ExerciseSet } from 'src/app/core/models/set';
import { WeightTypePipe } from 'src/app/core/pipes/weight-type.pipe';
import { RepTypePipe } from 'src/app/core/pipes/rep-type.pipe';

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
        WeightTypePipe,
        RepTypePipe
    ],
    providers: [ProgramFormsService]
})
export class ExerciseFormComponent {

    durationOptions: { value: number }[] = [
        { value: 0 }
    ];

    RepType = RepType;
    WeightType = WeightType;

    weightTypes = Object.values(WeightType).filter((value) => typeof value === 'number') as WeightType[];
    repTypes = Object.values(RepType).filter((value) => typeof value === 'number') as RepType[];

    selectedSetIndex: number = 0;
    numSets: any = 1;
    selectedWeightType: any = WeightType.KG;
    selectedWeight: any = 5;
    selectedRepType: any = RepType.Reps;
    selectedValue: any = 10;
    selectedMinValue: any = 8;
    selectedMaxValue: any = 12;

    weightOptions = Array.from({ length: 60 }, (_, i) => (i + 1) * 0.5);
    setsOptions = Array.from({ length: 10 }, (_, i) => i + 1);
    repsOptions = Array.from({ length: 30 }, (_, i) => i + 1);

    @Input() exercise: ExerciseFormGroup;

    @ViewChild('pickerModal') pickerModal: IonModal;

    constructor(
        private modalCtrl: ModalController,
        private programFormService: ProgramFormsService,
    ) {
        for (let seconds = 5; seconds <= 600; seconds += 5) {
            this.durationOptions.push({ value: seconds });
        }
    }

    get setsArray() {
        return this.exercise.get('sets') as FormArray;
    }

    addSet() {
        const sets = this.setsArray;
        const lastSet = sets.at(sets.length - 1)?.value as ExerciseSet;
        const sfg = this.programFormService.createSetFormGroup(lastSet);
        sets.push(sfg);
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

    openSetPickerModal(setIndex: number) {
        this.selectedSetIndex = setIndex;
        const currentSet = this.setsArray.at(setIndex).value;

        this.numSets = 1;
        this.selectedWeightType = currentSet.weightType;
        this.selectedWeight = currentSet.weight || 1;
        this.selectedRepType = currentSet.type;
        this.selectedValue = currentSet.value || 1;
        this.selectedMinValue = currentSet.minValue || 1;
        this.selectedMaxValue = currentSet.maxValue || 1;

        this.pickerModal.present();
    }

    setWeightType(type) {
        this.selectedWeightType = type;
    }

    setRepType(type) {
        this.selectedRepType = type;
    }

    cancelPicker() {
        this.pickerModal.dismiss();
    }

    confirmPicker() {
        const setControl = this.setsArray.at(this.selectedSetIndex) as ExerciseSetFormGroup;

        setControl.patchValue({
            weightType: this.selectedWeightType,
            weight: this.selectedWeight,
            type: this.selectedRepType
        });

        if (this.selectedRepType === RepType.Reps || this.selectedRepType === RepType.Duration) {
            setControl.patchValue({ value: this.selectedValue });
        } else if (this.selectedRepType === RepType.Range) {
            setControl.patchValue({
                minValue: this.selectedMinValue,
                maxValue: this.selectedMaxValue
            });
        } else {
            setControl.patchValue({
                value: null,
                minValue: null,
                maxValue: null
            });
        }

        if (this.numSets > 1) {
            const additionalSets = this.numSets - 1;
            for (let i = 0; i < additionalSets; i++) {
                const newSet = this.programFormService.createSetFormGroup(setControl.value as ExerciseSet);
                this.setsArray.push(newSet);
            }
        }

        this.pickerModal.dismiss();
    }
}
