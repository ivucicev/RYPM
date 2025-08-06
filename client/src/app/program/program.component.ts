import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorMessageDirective } from '../core/directives/error-message.directive';
import { NavController, PopoverController, IonLabel, IonItem, IonButton, IonIcon, IonPopover, IonList, IonChip, IonContent, IonSegmentButton, IonRow, IonHeader, IonToolbar, IonTitle, IonBackButton, IonInput, IonButtons, IonTextarea, IonSelect, IonSelectOption, IonSegment } from '@ionic/angular/standalone';
import { RepType } from '../core/models/enums/rep-type';
import { WeightType } from '../core/models/enums/weight-type';
import { ExerciseFormComponent } from '../form/exercise-form/exercise-form.component';
import { ProgramFormGroup, FormsService } from '../core/services/forms.service';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ProgramBM } from '../core/models/bm/program-bm';
import { AutosaveService } from '../core/services/autosave.service';
import { WorkoutState } from '../core/models/enums/workout-state';
import { Day } from '../core/models/collections/day';
import { WorkoutStateColorPipe } from '../core/pipes/workout-state-color.pipe';
import { ProgramInfo, ProgramService, ProgramActionKey } from '../core/services/program.service';
import { ToastService } from '../core/services/toast-service';

@Component({
    selector: 'app-program',
    templateUrl: 'program.component.html',
    styleUrls: ['./program.component.scss'],
    standalone: true,
    imports: [IonButtons, IonBackButton, IonTitle, IonToolbar, IonHeader, IonRow, IonSegmentButton, IonContent, IonChip, IonList, IonPopover, IonIcon, IonButton, IonItem, IonLabel, TranslateModule, ReactiveFormsModule, FormsModule, IonSegment, ErrorMessageDirective, IonInput, IonTextarea, IonSelect, IonSelectOption,
        ExerciseFormComponent, WorkoutStateColorPipe],
    providers: [FormsService, AutosaveService, ToastService]
})
export class ProgramComponent implements OnInit, OnDestroy {

    private unsubscribeAll = new Subject<void>();

    program: ProgramInfo;

    programForm: ProgramFormGroup = this.programFormService.createProgramFormGroup();
    subject: Subject<void>;

    selectedWeekIndex: number = 0;
    activeDayIndex: number | null = null;
    activeTab: string = 'info';
    RepType = RepType;
    WeightType = WeightType;
    WorkoutState = WorkoutState;
    public dayActionsPopoverOpen = false;

    weeks = Array.from({ length: 12 }, (_, i) => i + 1);

    // TODO: Trainer
    // assignedUsers =
    //     [
    //         {
    //             id: 0,
    //             name: 'John Smith',
    //             email: 'john-smth@example.com',
    //             avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg',
    //         },
    //     ];

    @ViewChild('popover') popover!: HTMLIonPopoverElement;

    constructor(
        private popoverCtrl: PopoverController,
        private programFormService: FormsService,
        private navCtrl: NavController,
        private activatedRoute: ActivatedRoute,
        private autosaveService: AutosaveService,
        private programService: ProgramService,
        private toastService: ToastService
    ) {
    }

    ngOnInit() {
        this.activatedRoute.params
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(params => {
                const id = params['id'];
                this.refresh(id);
            });
    }

    ngOnDestroy() {
        this.unsubscribeAll.next(null);
        this.unsubscribeAll.complete();
    }

    init(program?: ProgramInfo) {
        this.program = program;

        this.programForm = this.programFormService.createProgramFormGroup(program);
        this.autosaveService.register<ProgramBM>(this.programForm, 'programs', false).subscribe(); // TODO: autosave, get/map new changes or take all info from form?
    }

    async refresh(id: string) {
        if (!id) {
            this.init();
            return;
        }

        const res = await this.programService.getProgramInfoById(id)
        this.init(res);
    }

    tabChange() {
        if (this.activeTab.includes('week')) {
            this.activeDayIndex = 0;
        }
    }

    navigateToWorkout(day: Day) {
        if (day.workout?.id) {
            this.navCtrl.navigateForward([`./workout-wizard/${day.workout.id}`]);
        }
    }

    // TODO: Trainer
    // getAssignedUsers() {
    //     return this.programFormService.getAssignedUsers(this.programForm);
    // }

    getWeeksArray() {
        return this.programFormService.getWeeksArray(this.programForm);
    }

    getDaysArray(weekIndex: number) {
        return this.programFormService.getDaysArray(this.programForm, weekIndex);
    }

    getExercisesArray(weekIndex: number, dayIndex: number) {
        return this.programFormService.getExercisesArray(this.programForm, weekIndex, dayIndex);
    }

    getSetsArray(weekIndex: number, dayIndex: number, exerciseIndex: number) {
        return this.programFormService.getSetsArray(this.programForm, weekIndex, dayIndex, exerciseIndex);
    }

    removeDay(weekIndex: number, dayIndex: number) {
        this.programFormService.removeDay(this.programForm, weekIndex, dayIndex);
        if (this.activeDayIndex == dayIndex && this.selectedWeekIndex === weekIndex) {
            const newDayIndex = this.getDaysArray(weekIndex).length - 1;
            this.activeDayIndex = newDayIndex;
        }
    }

    removeExercise(weekIndex: number, dayIndex: number, exerciseIndex: number) {
        this.programFormService.removeExercise(this.programForm, weekIndex, dayIndex, exerciseIndex);
    }

    setActiveDay(dayIndex: number) {
        if (dayIndex < 0) return;
        this.activeDayIndex = dayIndex;
    }

    addDay(weekIndex: number): void {
        const daysArray = this.getDaysArray(weekIndex);
        if (daysArray.length >= 7) return;

        this.programFormService.addDay(this.programForm, weekIndex);
        const newDayIndex = daysArray.length - 1;
        this.activeDayIndex = newDayIndex;
    }

    moveExerciseDown(index) {
        const exercisesArray = this.getExercisesArray(this.selectedWeekIndex, this.activeDayIndex);
        if (index < 0 || index >= exercisesArray.length - 1) return;

        const currentExercise = exercisesArray.at(index);
        const nextExercise = exercisesArray.at(index + 1);

        exercisesArray.setControl(index, nextExercise);
        exercisesArray.setControl(index + 1, currentExercise);
    }

    moveExerciseUp(index) {
        const exercisesArray = this.getExercisesArray(this.selectedWeekIndex, this.activeDayIndex);
        if (index <= 0 || index >= exercisesArray.length) return;

        const currentExercise = exercisesArray.at(index);
        const previousExercise = exercisesArray.at(index - 1);

        exercisesArray.setControl(index, previousExercise);
        exercisesArray.setControl(index - 1, currentExercise);
    }

    async addExerciseToDay(weekIndex: number, dayIndex: number) {
        await this.programFormService.addExercisesToDay(this.programForm, weekIndex, dayIndex);
    }

    public moveUpHandler = (weekIndex: number) => {
        this.programFormService.moveDay(this.programForm, weekIndex, this.activeDayIndex, 'up');
        this.activeDayIndex = this.activeDayIndex - 1;
    }

    public moveDownHandler = (weekIndex: number) => {
        this.programFormService.moveDay(this.programForm, weekIndex, this.activeDayIndex, 'down');
        this.activeDayIndex = this.activeDayIndex + 1;
    }

    public removeHandler = (weekIndex: number) => {
        this.programFormService.removeDay(this.programForm, weekIndex, this.activeDayIndex);
        let lastDayIndex = this.getDaysArray(weekIndex).length - 1;
        if (this.activeDayIndex > lastDayIndex) {
            this.activeDayIndex = lastDayIndex;
        }
    }

    public copyToNextWeek = (weekIndex: number) => {
        const current = this.getDaysArray(weekIndex);

        if (current.length === 0) return;

        const currentDay = current.controls[this.activeDayIndex];

        if (!currentDay) return;

        const currentDayValue = currentDay.getRawValue();

        const daysArray = this.getDaysArray(weekIndex + 1);

        const newDay = this.programFormService.createDayFormGroup(currentDayValue as any, true);
        daysArray.push(newDay);

        for (let i = 0; i <= daysArray.length; i++)
            if (!daysArray.controls[i]?.value?.exercises?.length)
                this.removeDay(weekIndex + 1, i); // Remove empty days

        this.toastService.success();
        this.dayActionsPopoverOpen = false;

    }

    public copyToAllWeeks = () => {
        const totalWeeks = this.getWeeksArray().length;
        const currentDayArray = this.getDaysArray(this.selectedWeekIndex);

        if (currentDayArray.length === 0) return;

        const currentDay = currentDayArray.controls[this.activeDayIndex];
        if (!currentDay) return;

        const currentDayValue = currentDay.getRawValue();

        for (let weekIndex = 0; weekIndex < totalWeeks; weekIndex++) {
            if (weekIndex === this.selectedWeekIndex) continue;

            const daysArray = this.getDaysArray(weekIndex);

            const newDay = this.programFormService.createDayFormGroup(currentDayValue as any, true);
            daysArray.push(newDay);

            // Remove empty days
            for (let i = daysArray.length - 1; i >= 0; i--) {
                if (!daysArray.controls[i]?.value?.exercises?.length) {
                    this.removeDay(weekIndex, i);
                }
            }
        }

        this.toastService.success();
        this.dayActionsPopoverOpen = false;

    }

    public duplicateDay = () => {
        const currentDayArray = this.getDaysArray(this.selectedWeekIndex);

        if (currentDayArray.length === 0) return;

        const currentDay = currentDayArray.controls[this.activeDayIndex];
        if (!currentDay) return;

        const currentDayValue = currentDay.getRawValue();

        const daysArray = this.getDaysArray(this.selectedWeekIndex);

        const newDay = this.programFormService.createDayFormGroup(currentDayValue as any, true);
        daysArray.push(newDay);

        this.toastService.success();
        this.dayActionsPopoverOpen = false;
    }

    public presentPopover(e) {
        this.dayActionsPopoverOpen = true;
        this.popover.event = e
    }

    // TODO: Trainer
    // removeAssignedUser(userId: string) {
    //     this.programFormService.removeUser(this.programForm, userId);
    // }

    // async openAssignUsersModal() {
    //     const modal = await this.modalCtrl.create({
    //         component: AssignModalComponent,
    //         componentProps: {
    //             programName: this.programForm.get('name').value,
    //             programId: this.programForm.get('id')?.value || 'new',
    //             onAssign: (users) => this.assignUsers(users)
    //         }
    //     });

    //     await modal.present();
    // }

    // assignUsers(users: any[]) {
    //     users.forEach(user => {
    //         this.programFormService.addUser(this.programForm, user);
    //     });
    // }

    ionViewWillLeave() {
        //this.autosaveService.save('programs', this.programForm.getRawValue())
    }

    async openSettings() {
        const excludeActions: ProgramActionKey = {
            edit: true
        };
        if (!this.program || !this.program.id) {
            await this.refresh(this.programForm.get('id')?.value || '');
        };
        const actionSheet = await this.programService.presentProgramActionSheet(null, this.program, excludeActions);
        actionSheet.onDidDismiss().then(e => {
            if (e.data?.destructive || e.data?.constructive) {
                this.navCtrl.navigateBack(['./tabs']);
            }
        })
    }
}
