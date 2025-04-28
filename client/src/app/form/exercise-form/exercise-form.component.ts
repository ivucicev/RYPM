import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormArray } from '@angular/forms';
import { IonicModule, ModalController, IonModal, ItemReorderEventDetail } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { RepType } from 'src/app/core/models/rep-type';
import { WeightType } from 'src/app/core/models/weight-type';
import { DurationPipe } from 'src/app/core/pipes/duration.pipe';
import { ExerciseNotesModalComponent } from 'src/app/exercise-notes-modal/exercise-notes-modal.component';
import { ExerciseFormGroup, FormsService, ExerciseSetFormGroup } from 'src/app/core/services/forms.service';
import { Set } from 'src/app/core/models/exercise-set';
import { WeightTypePipe } from 'src/app/core/pipes/weight-type.pipe';
import { RepTypePipe } from 'src/app/core/pipes/rep-type.pipe';
import { NgTemplateOutlet } from '@angular/common';

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
        RepTypePipe,
        NgTemplateOutlet
    ],
    providers: [FormsService]
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

    selectedRestValue: any = 0;
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
    repsOptionsMin = this.repsOptions;

    @Input() workoutMode: boolean = false;

    @Input() exercise: ExerciseFormGroup;

    @Output() restStartedEvent = new EventEmitter<number>();
    @Output() allCompletedEvent = new EventEmitter<number>();

    @ViewChild('setPickerModal') setPickerModal: IonModal;
    @ViewChild('restPickerModal') restPickerModal: IonModal;

    constructor(
        private modalCtrl: ModalController,
        private programFormService: FormsService,
    ) {
        for (let seconds = 5; seconds <= 600; seconds += 5) {
            this.durationOptions.push({ value: seconds });
        }
    }

    updateCompletion(setIndex: number) {
        const form = this.setsArray.at(setIndex);

        if (form.controls.completed.value) {
            form.controls.completed.setValue(true);
            this.handleRest();

            var allCompleted = true;
            for (let i = 0; i < this.setsArray.length; i++) {
                const formTmp = this.setsArray.at(i);
                if (!formTmp.controls.completed.value && i != setIndex) {
                    allCompleted = false;
                }
            }

            if (allCompleted) {
                setTimeout(() => {
                    this.allCompletedEvent.emit();
                })
            }
        }
    }

    handleRest() {
        const restDuration = this.exercise.get('restDuration')?.value;
        if (restDuration) {
            this.restStartedEvent.emit(restDuration);
        }
    }

    get setsArray() {
        return this.exercise.get('sets') as FormArray<ExerciseSetFormGroup>;
    }

    addSet() {
        const sets = this.setsArray;
        const lastSet = sets.at(sets.length - 1)?.value as Set;
        const sfg = this.programFormService.createSetFormGroup(lastSet);
        sets.push(sfg);
    }

    removeSet() {
        const setsArray = this.setsArray;
        if (setsArray.length > 1) {
            setsArray.removeAt(setsArray.length - 1);
        }
    }

    reorderSets(event: CustomEvent<ItemReorderEventDetail>) {
        const items = this.setsArray.controls.map((item) => item.value);
        const itemsOrdered: Set[] = event.detail.complete(items);

        this.setsArray.clear();
        itemsOrdered.map((item) => this.setsArray.push(this.programFormService.createSetFormGroup(item)));
    }

    removeSetAt(index: number) {
        if (this.setsArray.length > 1) {
            this.setsArray.removeAt(index);
        }
    }

    async onOpenNotes() {
        const modal = await this.modalCtrl.create({
            component: ExerciseNotesModalComponent,
            breakpoints: [0, 0.75, 1],
            initialBreakpoint: 0.75,
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

    openRestPickerModal() {
        this.selectedRestValue = this.exercise.controls.restDuration.value;
        this.restPickerModal.present();
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

        this.setPickerModal.present();
    }

    setWeightType(type) {
        this.selectedWeightType = type;
    }

    setMinValue(value) {
        this.selectedMinValue = value;
        if (this.selectedMaxValue < value) {
            this.selectedMaxValue = value;
        }
    }

    setMaxValue(value) {
        this.selectedMaxValue = value;
        if (this.selectedMinValue > value) {
            this.selectedMinValue = value;
        }
    }

    setRepType(type) {
        this.selectedRepType = type;
        if (type == RepType.Duration) {
            this.selectedWeightType = WeightType.NA;
        }
    }

    cancelPicker() {
        this.setPickerModal.dismiss();
        this.restPickerModal.dismiss();
    }

    confirmRestPicker() {
        this.exercise.controls.restDuration.setValue(this.selectedRestValue);

        this.cancelPicker();
    }

    confirmSetPicker() {
        const setControl = this.setsArray.at(this.selectedSetIndex) as ExerciseSetFormGroup;

        const valuesToPatch = this.workoutMode ?
            // workout mode: can only update values
            {
                currentWeight: this.selectedWeight,
                currentValue: this.selectedValue,
            } :
            // edit mode: can change type/expected values
            {
                weightType: this.selectedWeightType,
                weight: this.selectedWeight,
                type: this.selectedRepType
            }

        setControl.patchValue(valuesToPatch);

        if (!this.workoutMode) {
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
                    const newSet = this.programFormService.createSetFormGroup(setControl.value as Set);
                    this.setsArray.push(newSet);
                }
            }
        } else {
            if (!setControl.controls.completed.value) {
                setControl.controls.completed.setValue(true);
                this.updateCompletion(this.selectedSetIndex);
            }
        }

        this.cancelPicker();
    }
}
