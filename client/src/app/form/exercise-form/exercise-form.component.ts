import { Component, EventEmitter, input, Input, OnChanges, output, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormArray } from '@angular/forms';
import { ModalController, IonModal, ItemReorderEventDetail, IonButton, IonIcon, IonList, IonItem, IonLabel, IonToolbar, IonSegmentButton, IonSegment, IonPicker, IonPickerColumn, IonPickerColumnOption, IonButtons, IonHeader, IonTitle, IonReorderGroup, IonItemOptions, IonReorder, IonItemOption, IonCheckbox } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { RepType } from 'src/app/core/models/enums/rep-type';
import { WeightType } from 'src/app/core/models/enums/weight-type';
import { DurationPipe } from 'src/app/core/pipes/duration.pipe';
import { ExerciseNotesModalComponent } from 'src/app/exercise-notes-modal/exercise-notes-modal.component';
import { ExerciseFormGroup, FormsService, ExerciseSetFormGroup } from 'src/app/core/services/forms.service';
import { Set } from 'src/app/core/models/collections/exercise-set';
import { WeightTypePipe } from 'src/app/core/pipes/weight-type.pipe';
import { RepTypePipe } from 'src/app/core/pipes/rep-type.pipe';
import { NgTemplateOutlet } from '@angular/common';
import { IonPopover } from '@ionic/angular/standalone';
import { ReserveType } from 'src/app/core/models/enums/reserve-type';

@Component({
    selector: 'app-exercise-form',
    templateUrl: 'exercise-form.component.html',
    styleUrls: ['./exercise-form.component.scss'],
    standalone: true,
    imports: [IonItemOption, IonReorder, IonItemOptions, IonReorderGroup, IonTitle, IonHeader, IonButtons, IonPicker, IonSegment, IonSegmentButton, IonToolbar, IonLabel, IonItem, IonList, IonIcon, IonButton,
        TranslateModule,
        ReactiveFormsModule,
        DurationPipe,
        WeightTypePipe,
        RepTypePipe,
        IonPopover,
        IonModal,
        IonPickerColumn,
        IonCheckbox,
        IonPickerColumnOption,
        NgTemplateOutlet
    ],
    providers: [FormsService]
})
export class ExerciseFormComponent implements OnChanges {

    durationOptions: { value: number }[] = [
        { value: 0 }
    ];

    RepType = RepType;
    WeightType = WeightType;
    ReserveType = ReserveType;

    reserveTypes = Object.values(ReserveType).filter((value) => typeof value === 'number') as ReserveType[];
    weightTypes = Object.values(WeightType).filter((value) => typeof value === 'number') as WeightType[];
    repTypes = Object.values(RepType).filter((value) => typeof value === 'number') as RepType[];

    selectedSetIndex: number = 0;

    selectedRestValue: any = 0;
    selectedReserveType: any = null;
    numSets: any = 1;
    selectedWeightType: any = WeightType.KG;
    selectedWeight: any = 60;
    selectedRepType: any = RepType.Reps;
    selectedValue: any = 10;
    selectedMinValue: any = 8;
    selectedMaxValue: any = 12;
    rpes = [1,2,3,4,5,6,7,8,9,10];
    rirs = [10,9,8,7,6,5,4,3,2,1];
    selectedRPE;
    selectedRIR;

    weightOptions = Array.from({ length: 240 }, (_, i) => (i + 1) * 0.5);
    setsOptions = Array.from({ length: 10 }, (_, i) => i + 1);
    repsOptions = Array.from({ length: 30 }, (_, i) => i + 1);
    repsOptionsMin = this.repsOptions;

    @Input() workoutMode: boolean = false;

    @Input() exercise: ExerciseFormGroup;

    onCompletedEvent = output<number>();
    onAllCompletedEvent = output<void>();
    onRemoveExerciseEvent = output<void>();

    moveExerciseUpEvent = output<void>();
    moveExerciseDownEvent = output<void>();

    canMoveExerciseUp = input<boolean>(true);
    canMoveExerciseDown = input<boolean>(true);

    @ViewChild('setPickerModal') setPickerModal: IonModal;
    @ViewChild('restPickerModal') restPickerModal: IonModal;
    @ViewChild('exercisePopover') exercisePopover: IonPopover;

    constructor(
        private modalCtrl: ModalController,
        private programFormService: FormsService,
    ) {
        for (let seconds = 15; seconds <= 600; seconds += 15) {
            this.durationOptions.push({ value: seconds });
        }
    }

    get setsArray() {
        return this.exercise.get('sets') as FormArray<ExerciseSetFormGroup>;
    }

    /**
     * Automatically fills the current values and weights of each set based on the expected values.
     */
    autoFillDefaults() {
        if (!this.workoutMode || this.exercise.controls.completed.value) {
            return;
        }

        const sets = this.exercise.get('sets') as FormArray<ExerciseSetFormGroup>;

        for (let i = 0; i < sets.length; i++) {
            const set = sets.at(i);
            if (set.controls.completed.value) continue;

            set.controls.currentValue.setValue(set.controls.previousValue.value || set.controls.value.value || 0);
            set.controls.currentWeight.setValue(set.controls.previousWeight.value || set.controls.weight.value || 0);
        }
    }

    updateCompletion(setIndex: number) {
        const form = this.setsArray.at(setIndex);

        if (form.controls.completed.value) {
            form.controls.completedAt.setValue(new Date());
            form.controls.restSkipped.setValue(false);

            this.onCompleted(setIndex);

            var allCompleted = true;
            for (let i = 0; i < this.setsArray.length; i++) {
                const formTmp = this.setsArray.at(i);
                if (!formTmp.controls.completed.value && i != setIndex) {
                    allCompleted = false;
                }
            }

            if (allCompleted) {
                setTimeout(() => {
                    this.exercise.controls.completed.setValue(true);
                    this.exercise.controls.completedAt.setValue(new Date());
                    this.onAllCompletedEvent.emit();
                })
            } else {
                this.exercise.controls.completed.setValue(false);
                this.exercise.controls.completedAt.setValue(null);
            }
        } else {
            form.controls.completedAt.setValue(null);
        }
    }

    onCompleted(setIndex: number) {
        this.onCompletedEvent.emit(setIndex);
    }

    addSet() {
        const sets = this.setsArray;

        const lastSet = sets.at(sets.length - 1)?.value as Set;
        lastSet.id = null;

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
        const setsArray = this.setsArray;
        if (this.setsArray.length > 1) {
            setsArray.removeAt(index);
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
        this.selectedWeight = currentSet.currentWeight == currentSet.weight ? currentSet.previousWeight : currentSet.currentWeight || currentSet.weight || 1;
        this.selectedRepType = currentSet.type;
        this.selectedValue = currentSet.currentValue == currentSet.value ? currentSet.previousValue : currentSet.currentValue || currentSet.value || 1;
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

    setReserveType(type) {
        this.selectedReserveType = type;
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
            // edit mode: can change type/target values
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

    togglePopover(event: Event) {
        if (this.exercisePopover.isOpen) {
            this.exercisePopover.dismiss();
        } else {
            this.exercisePopover.event = event;
            this.exercisePopover.present();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if ((changes['exercise'] || changes['workoutMode']) && this.workoutMode) {
            this.autoFillDefaults();
        }
    }
}
