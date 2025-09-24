import { Component, input, Input, OnChanges, output, signal, SimpleChanges, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormArray } from '@angular/forms';
import { ModalController, IonModal, ItemReorderEventDetail, IonButton, IonIcon, IonList, IonItem, IonLabel, IonToolbar, IonSegmentButton, IonSegment, IonPicker, IonPickerColumn, IonPickerColumnOption, IonButtons, IonHeader, IonTitle, IonReorderGroup, IonItemOptions, IonReorder, IonItemOption, IonCheckbox, IonNote, IonBadge } from '@ionic/angular/standalone';
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
import { PocketbaseService } from 'src/app/core/services/pocketbase.service';
import { listCircleOutline } from 'ionicons/icons';
import { WEIGHTS } from 'src/app/core/constants/weights';
import { Workout } from 'src/app/core/models/collections/workout';
import { WorkoutState } from 'src/app/core/models/enums/workout-state';

@Component({
    selector: 'app-exercise-form',
    templateUrl: 'exercise-form.component.html',
    styleUrls: ['./exercise-form.component.scss'],
    standalone: true,
    imports: [IonItemOption, IonNote, IonReorder, IonItemOptions, IonReorderGroup, IonTitle, IonHeader, IonButtons, IonPicker, IonSegment, IonSegmentButton, IonToolbar, IonLabel, IonItem, IonList, IonIcon, IonButton,
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
        NgTemplateOutlet, IonBadge],
    providers: [FormsService]
})
export class ExerciseFormComponent implements OnChanges {

    private supersetExercise;

    listCircleIcon = listCircleOutline;
    durationOptions: { value: number }[] = [
        { value: 15 },
        { value: 20 },
        { value: 25 }
    ];

    public editMode = false;

    RepType = RepType;
    WeightType = WeightType;
    ReserveType = ReserveType;

    reserveTypes = Object.values(ReserveType).filter((value) => typeof value === 'number') as ReserveType[];
    weightTypes = Object.values(WeightType).filter((value) => typeof value === 'number') as WeightType[];
    repTypes = Object.values(RepType).filter((value) => typeof value === 'number') as RepType[];

    selectedSetIndex: number = 0;

    setReorderActive = signal<boolean>(false);

    selectedRestValue: any = 0;
    selectedReserveType: any = null;
    numSets: any = 1;
    selectedWeightType: any = WeightType.KG;
    selectedWeight: any = 60;
    selectedRepType: any = RepType.Reps;
    selectedValue: any = 10;
    selectedMinValue: any = 8;
    selectedMaxValue: any = 12;
    rpes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    rirs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    supersets = ['A', 'B', 'C', 'D', 'E', 'F'];
    selectedRPE;
    selectedRIR;
    selectedDropset;
    selectedSuperset;

    weightOptions = WEIGHTS;
    setsOptions = Array.from({ length: 20 }, (_, i) => i + 1);
    repsOptions = Array.from({ length: 30 }, (_, i) => i + 1);
    repsOptionsMin = this.repsOptions;

    @Input() workoutMode: boolean = false;
    @Input() exercise: ExerciseFormGroup;
    @Input() workout: Workout;

    onCompletedEvent = output<number>();
    onUncompletedEvent = output<number>();
    onAllCompletedEvent = output<void>();
    onRemoveExerciseEvent = output<void>();

    moveExerciseUpEvent = output<void>();
    moveExerciseDownEvent = output<void>();
    onSupersetCompletedEvent = output<string>();

    canMoveExerciseUp = input<boolean>(true);
    canMoveExerciseDown = input<boolean>(true);

    disabled = input<boolean>(false);

    onDirtyEvent = output<void>();

    @ViewChild('setPickerModal') setPickerModal: IonModal;
    @ViewChild('restPickerModal') restPickerModal: IonModal;
    @ViewChild('exercisePopover') exercisePopover: IonPopover;
    @ViewChild('supersetPickerModal') supersetModal: IonModal;

    constructor(
        private modalCtrl: ModalController,
        private programFormService: FormsService,
        private pocketbaseService: PocketbaseService
    ) {
        for (let seconds = 30; seconds <= 600; seconds += 15) {
            this.durationOptions.push({ value: seconds });
        }

        const weightType = this.pocketbaseService.currentUser.defaultWeightType;
        const weightIncrement = this.pocketbaseService.currentUser.weightIncrement;

        if (weightType && weightType == WeightType.KG) {
            this.weightTypes = Object.values(WeightType).filter((value) => typeof value === 'number' && value != WeightType.LB) as WeightType[];
        } else if (weightType && weightType == WeightType.LB) {
            this.weightTypes = Object.values(WeightType).filter((value) => typeof value === 'number' && value != WeightType.KG) as WeightType[];
        }

        /*if (weightIncrement) {
            this.weightOptions.length = 0;
            for(let i = weightIncrement; i <= 400; i += weightIncrement)
                this.weightOptions.push(i);
        }*/
    }

    get setsArray() {
        return this.exercise.get('sets') as FormArray<ExerciseSetFormGroup>;
    }

    /**
     * Automatically fills the current values and weights of each set based on the expected values.
     */
    autoFillDefaults() {
        if (!this.workoutMode || this.workout?.state == WorkoutState.Completed) {
            return;
        }

        const sets = this.exercise.get('sets') as FormArray<ExerciseSetFormGroup>;
        for (let i = 0; i < sets.length; i++) {
            const set = sets.at(i);
            set.controls.currentValue.setValue(set.controls.currentValue.value || set.controls.previousValue.value || set.controls.value.value || 0);
            set.controls.currentWeight.setValue(set.controls.currentWeight.value || set.controls.previousWeight.value || set.controls.weight.value || 0);
        }
    }

    updateCompletion(setIndex: number) {
        const form = this.setsArray.at(setIndex);

        if (form.controls.completed.value) {
            form.controls.completedAt.setValue(new Date());
            form.controls.restSkipped.setValue(false);

            this.onCompleted(setIndex);
        } else {
            form.controls.completedAt.setValue(null);
            this.onUnCompleted(setIndex);
        }

        var allCompleted = true;
        for (let i = 0; i < this.setsArray.length; i++) {
            const formTmp = this.setsArray.at(i);
            if (formTmp.controls.completed.value != true && i != setIndex) {
                allCompleted = false;
            }
        }

        this.exercise.markAsPristine({ onlySelf: true }); // prevent set dirty from propagating to main form (triggers update)
        form.markAsDirty({ onlySelf: true });

        if (allCompleted && form.controls.completed.value == true)
            this.onAllCompletedEvent.emit();

        if (form.controls.completed.value == true && this.exercise?.controls?.superset?.value != null && this.exercise?.controls?.superset?.value != "") {
            // set completed check if there is superset mark
            this.onSupersetCompletedEvent.emit(this.exercise?.controls?.superset?.value);
        }
    }

    onCompleted(setIndex: number) {
        this.onCompletedEvent.emit(setIndex);
    }

    onUnCompleted(setIndex: number) {
        this.onUncompletedEvent.emit(setIndex);
    }

    addSet() {
        const sets = this.setsArray;

        const lastSet = sets.at(sets.length - 1)?.value as Set;
        lastSet.id = null;

        const sfg = this.programFormService.createSetFormGroup(lastSet);
        sets.push(sfg);

        sets.markAsDirty({ onlySelf: true });
        this.onDirtyEvent.emit();
    }

    removeSet() {
        const setsArray = this.setsArray;
        if (setsArray.length > 1) {
            setsArray.removeAt(setsArray.length - 1);

            this.setsArray.markAsDirty({ onlySelf: true });
            this.onDirtyEvent.emit();
        }
    }

    reorderSets(event: CustomEvent<ItemReorderEventDetail>) {
        this.setReorderActive.set(true);

        const items = this.setsArray.controls.map((item) => item.value);
        const itemsOrdered: Set[] = event.detail.complete(items);

        this.setsArray.clear();
        itemsOrdered.map((item) => this.setsArray.push(this.programFormService.createSetFormGroup(item)));

        this.onDirtyEvent.emit();

        requestAnimationFrame(() => {
            this.setReorderActive.set(false);
        })
    }

    removeSetAt(index: number) {
        const setsArray = this.setsArray;
        if (this.setsArray.length > 1) {
            setsArray.removeAt(index);

            setsArray.markAsDirty({ onlySelf: true });
            this.onDirtyEvent.emit();
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

            this.exercise.markAsDirty({ onlySelf: true });
            this.onDirtyEvent.emit();
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
        this.selectedRepType = currentSet.type;
        this.selectedMinValue = currentSet.minValue || 1;
        this.selectedMaxValue = currentSet.maxValue || 1;
        
        this.selectedWeight = currentSet.currentWeight || currentSet.previousWeight || currentSet.weight || 0;
        this.selectedValue = currentSet.currentValue || currentSet.previousValue || currentSet.value || 0;
        
        this.setPickerModal.present();
    }

    setWeightType(type) {
        this.selectedWeightType = type;
    }

    setMinValue(value) {
        this.selectedMinValue = value;
        if (this.selectedMaxValue <= value) {
            this.selectedMaxValue = value + 1;
        }
    }

    setMaxValue(value) {
        this.selectedMaxValue = value;
        if (this.selectedMinValue >= value && value > 0) {
            this.selectedMinValue = value - 1;
        }
    }

    setRepType(type: any | RepType) {
        this.selectedRepType = type;
        if (type == RepType.Duration) {
            this.selectedWeightType = WeightType.NA;
            this.selectedReserveType = null;
        }
        if (type == RepType.Max) {
            this.selectedRIR = null;
            this.selectedRPE = null;
            this.selectedDropset = null;
            this.selectedReserveType = null;
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

        this.exercise.markAsDirty({ onlySelf: true });
        this.onDirtyEvent.emit();

        this.cancelPicker();
    }

    confirmSetPicker() {
        const setControl = this.setsArray.at(this.selectedSetIndex) as ExerciseSetFormGroup;

        const valuesToPatch = (this.workoutMode && !this.editMode) ?
            // workout mode: can only update values
            {
                currentWeight: this.selectedWeight,
                currentValue: this.selectedValue,
            } as any :
            // edit mode: can change type/target values
            {
                weightType: this.selectedWeightType,
                weight: this.selectedWeight,
                type: this.selectedRepType,
                rir: this.selectedRIR,
                rpe: this.selectedRPE,
                dropset: this.selectedDropset
            } as any

        // should update next values according to this value
        this.setsArray.controls.forEach((c, i) => {
            if (i > this.selectedSetIndex && c.controls?.completed?.value != true) {
                //valuesToPatch.currentValue = this.selectedValue;
                //valuesToPatch.currentWeight = this.selectedWeight;
                c.patchValue({
                    currentValue: this.selectedValue,
                    currentWeight: this.selectedWeight
                });
            }
        })


        if (!this.workoutMode || this.editMode) {
            if (this.selectedRepType === RepType.Reps || this.selectedRepType === RepType.Duration) {
                valuesToPatch.value = this.selectedValue;
                //setControl.patchValue({ value: this.selectedValue });
            } else if (this.selectedRepType === RepType.Range) {
                valuesToPatch.minValue = this.selectedMinValue;
                valuesToPatch.maxValue = this.selectedMaxValue;
                /*setControl.patchValue({
                    minValue: this.selectedMinValue,
                    maxValue: this.selectedMaxValue
                });*/
            } else {
                valuesToPatch.value = null;
                valuesToPatch.minValue = null;
                valuesToPatch.maxValue = null;
                /*setControl.patchValue({
                    value: null,
                    minValue: null,
                    maxValue: null
                });*/
            }

            if (this.selectedRIR > 0) {
                //setControl.patchValue({ rir: this.selectedRIR });
                valuesToPatch.rir = this.selectedRIR;
            } else if (this.selectedRPE > 0) {
                //setControl.patchValue({ rpe: this.selectedRPE });
                valuesToPatch.rpe = this.selectedRPE;
            } else if (this.selectedDropset > 0) {
                //setControl.patchValue({ dropset: this.selectedDropset });
                valuesToPatch.dropset = this.selectedDropset;
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

        setControl.patchValue(valuesToPatch);
        setControl.markAsDirty({ onlySelf: true });

        this.onDirtyEvent.emit();

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

    confirmSuperset() {
        this.supersetExercise.patchValue({ superset: this.selectedSuperset });
        this.cancelSuperset();

        this.supersetExercise.markAsDirty({ onlySelf: true });
        this.onDirtyEvent.emit();
    }

    cancelSuperset() {
        this.supersetExercise = null;
        this.supersetModal.dismiss();
    }

    toggleEdit() {
        this.editMode = !this.editMode;
    }

    saveEditWhileInWorkout() {
        this.confirmSetPicker();
        this.toggleEdit();
    }

    async openSupersetModal(exercise) {
        if (this.workoutMode) return;
        this.supersetExercise = exercise;
        this.selectedSuperset = exercise.get('superset').value;
        await this.supersetModal.present();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.disabled()) {
            this.exercise.disable();
        }
        if ((changes['exercise'] || changes['workoutMode']) && this.workoutMode) {
            this.autoFillDefaults();
        }
    }
}
