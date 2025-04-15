import { Injectable, OnDestroy } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Exercise } from "../models/exercise";
import { RepType } from "../models/rep-type";
import { WeightType } from "../models/weight-type";
import { FormType } from "../helpers/form-helpers";
import { ExerciseSet } from "../models/set";
import { Week } from "../models/week";
import { Day } from "../models/day";
import { Program } from "../models/program";
import { distinctUntilChanged, Subject, takeUntil } from "rxjs";
import { ExerciseSelectorComponent } from "src/app/exercise-selector/exercise-selector.component";
import { ModalController } from "@ionic/angular/standalone";
import { ProgramUser } from "../models/program-user";
import { User } from "../models/user";

@Injectable()
export class ProgramFormsService implements OnDestroy {

    private subject = new Subject();

    constructor(
        private formBuilder: FormBuilder,
        private modalCtrl: ModalController) { }

    ngOnDestroy() {
        this.subject.next(null);
        this.subject.unsubscribe();
    }

    //#region Init
    createProgramFormGroup() {
        const programForm: ProgramFormGroup = this.formBuilder.group({
            id: [''],
            name: ['', Validators.required],
            description: [''],
            duration: [0, Validators.required],
            weeks: this.formBuilder.array<WeekFormGroup>([]),
            users: this.formBuilder.array<ProgramUserGroup>([])
        });

        programForm.get('duration').valueChanges
            .pipe(distinctUntilChanged(), takeUntil(this.subject))
            .subscribe(durationWeeks => {
                const weeksArray = this.getWeeksArray(programForm);

                if (durationWeeks < weeksArray.length) {
                    while (weeksArray.length > durationWeeks) {
                        weeksArray.removeAt(weeksArray.length - 1);
                    }
                }
                else if (durationWeeks > weeksArray.length) {
                    for (let i = weeksArray.length; i < durationWeeks; i++) {
                        const weekForm = this.createWeekFormGroup();
                        weeksArray.push(weekForm);

                        this.addDay(programForm, i);
                    }
                }
            });
        programForm.controls.duration.setValue(4);

        return programForm;
    }


    createExerciseFormGroup(exercise?: Exercise): ExerciseFormGroup {
        const exerciseGroup: ExerciseFormGroup = this.formBuilder.group({
            id: new FormControl(exercise?.id),
            name: new FormControl(exercise?.name),
            tags: new FormControl(exercise?.tags || []),
            restDuration: new FormControl(exercise?.restDuration || 0),
            notes: new FormControl(exercise?.notes || ''),
            sets: this.formBuilder.array<ExerciseSetFormGroup>([])
        });

        const setsArray = exerciseGroup.get('sets') as FormArray<ExerciseSetFormGroup>;

        if (exercise?.sets && exercise?.sets?.length > 0) {
            exercise.sets.forEach(set => {
                setsArray.push(this.createSetFormGroup(set));
            });
        } else {
            setsArray.push(this.createSetFormGroup());
        }

        return exerciseGroup;
    }

    createSetFormGroup(set?: ExerciseSet): ExerciseSetFormGroup {
        const fg: ExerciseSetFormGroup = this.formBuilder.group({
            id: [''],
            completed: [set?.completed || false],
            previousValue: new FormControl(set?.previousValue || 0),
            previousWeight: new FormControl(set?.previousWeight || 0),
            currentValue: new FormControl(set?.currentValue || 0),
            currentWeight: new FormControl(set?.currentWeight || 0),
            weight: new FormControl(set?.weight || 0),
            weightType: new FormControl<WeightType>(set?.weightType || WeightType.KG),
            type: new FormControl(set?.type || RepType.Reps),
            value: new FormControl(set?.value || 0),
            minValue: new FormControl(set?.minValue || 0),
            maxValue: new FormControl(set?.maxValue || 0)
        });

        fg.controls.type.valueChanges
            .pipe(distinctUntilChanged(), takeUntil(this.subject))
            .subscribe(type => {
                if (type == RepType.Duration) {
                    fg.controls.weight.setValue(0, { emitEvent: false });
                    fg.controls.weightType.setValue(WeightType.NA, { emitEvent: false });
                }
            });
        fg.controls.weightType.valueChanges
            .pipe(distinctUntilChanged(), takeUntil(this.subject))
            .subscribe(type => {
                if (type != WeightType.NA && fg.controls.type.value == RepType.Duration) {
                    fg.controls.type.setValue(RepType.Reps, { emitEvent: false });
                }
            });

        return fg;
    }

    createWeekFormGroup(): WeekFormGroup {
        const fg: WeekFormGroup = this.formBuilder.group({
            days: this.formBuilder.array<DayFormGroup>([])
        });
        return fg;
    }

    createDayFormGroup(): DayFormGroup {
        const fg = this.formBuilder.group({
            exercises: this.formBuilder.array<ExerciseFormGroup>([])
        });
        return fg;
    }
    //#endregion

    //#region Getters
    getExercisesArray(programForm: ProgramFormGroup, weekIndex: number, dayIndex: number) {
        console.log(this.getDaysArray(programForm, weekIndex).at(dayIndex), weekIndex, dayIndex)
        return this.getDaysArray(programForm, weekIndex).at(dayIndex).get('exercises') as FormArray<ExerciseFormGroup>;
    }

    getDaysArray(programForm: ProgramFormGroup, weekIndex: number) {
        const weeksArray = this.getWeeksArray(programForm);
        return weeksArray.at(weekIndex).get('days') as FormArray<DayFormGroup>;
    }

    getWeeksArray(programForm: ProgramFormGroup) {
        return programForm.get('weeks') as FormArray<WeekFormGroup>;
    }

    getSetsArray(programForm: ProgramFormGroup, weekIndex: number, dayIndex: number, exerciseIndex: number) {
        return this.getExercisesArray(programForm, weekIndex, dayIndex).at(exerciseIndex).get('sets') as FormArray<ExerciseSetFormGroup>;
    }

    getAssignedUsers(form: ProgramFormGroup) {
        return form.get('users') as FormArray<ProgramUserGroup>;
    }
    //#endregion

    //#region Setters
    addUser(form: ProgramFormGroup, user: User) {
        const usersArray = this.getAssignedUsers(form);
        const userExists = usersArray.controls.some(control =>
            control.get('id').value === user.id
        );

        if (!userExists) {
            usersArray.push(this.formBuilder.group({
                id: [user.id],
                name: [user.name],
                email: [user.email],
                avatar: [user.avatar]
            }));
        }
    }

    removeUser(form: ProgramFormGroup, userId: string) {
        const usersArray = this.getAssignedUsers(form);
        const index = usersArray.controls.findIndex(control =>
            control.get('id').value === userId
        );

        if (index >= 0) {
            usersArray.removeAt(index);
        }
    }

    addDay(programForm: ProgramFormGroup, weekIndex: number) {
        const daysArray = this.getDaysArray(programForm, weekIndex);
        daysArray.push(this.createDayFormGroup());
    }

    removeDay(programForm: ProgramFormGroup, weekIndex: number, dayIndex: number) {
        const daysArray = this.getDaysArray(programForm, weekIndex);
        daysArray.removeAt(dayIndex);
    }


    removeExercise(programForm: ProgramFormGroup, weekIndex: number, dayIndex: number, exerciseIndex: number) {
        const exercisesArray = this.getExercisesArray(programForm, weekIndex, dayIndex);
        exercisesArray.removeAt(exerciseIndex);
    }

    async addExercisesToDay(programForm: ProgramFormGroup, weekIndex: number, dayIndex: number) {
        const exercises = await this.getExercises();
        if (!exercises || !exercises.length) return;

        const exercisesArray = this.getExercisesArray(programForm, weekIndex, dayIndex);
        exercises.map(e => {
            const fg = this.createExerciseFormGroup(e);
            exercisesArray.push(fg);
        })
    }

    async getExercises(): Promise<Exercise[]> {
        const modal = await this.modalCtrl.create({
            component: ExerciseSelectorComponent,
            breakpoints: [0, 0.5, 0.75, 1],
            initialBreakpoint: 1,
            componentProps: {
                history: []
            }
        });

        await modal.present();
        const { data } = await modal.onDidDismiss();

        return data?.exercises;
    }

    removeSet(programForm: ProgramFormGroup, weekIndex: number, dayIndex: number, exerciseIndex: number) {
        const setsArray = this.getSetsArray(programForm, weekIndex, dayIndex, exerciseIndex);

        if (setsArray.length > 1) {
            setsArray.removeAt(setsArray.length - 1);
        }
    }
    //#endregion

    //#region Misc
    moveDay(programForm: ProgramFormGroup, weekIndex: number, dayIndex: number, direction: 'up' | 'down') {
        const daysArray = this.getDaysArray(programForm, weekIndex);

        if (direction === 'up' && dayIndex > 0) {
            this.swapFormArrayItems(daysArray, dayIndex, dayIndex - 1);
        } else if (direction === 'down' && dayIndex < daysArray.length - 1) {
            this.swapFormArrayItems(daysArray, dayIndex, dayIndex + 1);
        }
    }

    private swapFormArrayItems(formArray: FormArray, index1: number, index2: number) {
        const control1 = formArray.at(index1);
        const control2 = formArray.at(index2);

        formArray.setControl(index1, control2);
        formArray.setControl(index2, control1);
    }
    //#endregion
}

export type ProgramFormGroup = FormGroup<FormType<Program>>;
export type ExerciseFormGroup = FormGroup<FormType<Exercise>>;
export type DayFormGroup = FormGroup<FormType<Day>>;
export type WeekFormGroup = FormGroup<FormType<Week>>;
export type ExerciseSetFormGroup = FormGroup<FormType<ExerciseSet>>;
export type ProgramUserGroup = FormGroup<FormType<ProgramUser>>;
