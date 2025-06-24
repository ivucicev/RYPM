import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorMessageDirective } from '../core/directives/error-message.directive';
import { NavController, PopoverController } from '@ionic/angular/standalone';
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

@Component({
    selector: 'app-program',
    templateUrl: './program.component.html',
    styleUrls: ['./program.component.scss'],
    standalone: true,
    imports: [IonicModule, TranslateModule, ReactiveFormsModule, FormsModule, ErrorMessageDirective,
        ExerciseFormComponent, WorkoutStateColorPipe],
    providers: [FormsService, AutosaveService]
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
        private programService: ProgramService
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
        //this.autosaveService.register<ProgramBM>(this.programForm, 'programs', false).subscribe(); // TODO: autosave, get/map new changes or take all info from form?
    }

    async refresh(id: string) {
        if (!id) {
            this.init();
            return;
        }

        this.programService.getProgramInfoById(id).then((res) => {
            this.init(res);
        });
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
        if (this.activeDayIndex == dayIndex) {
            const newDayIndex = this.getDaysArray(weekIndex).length - 1;
            this.activeDayIndex = newDayIndex;
        }
    }

    removeExercise(weekIndex: number, dayIndex: number, exerciseIndex: number) {
        this.programFormService.removeExercise(this.programForm, weekIndex, dayIndex, exerciseIndex);
    }

    setActiveDay(dayIndex: number) {
        this.activeDayIndex = dayIndex;
    }

    addDay(weekIndex: number): void {
        const daysArray = this.getDaysArray(weekIndex);
        if (daysArray.length >= 7) return;

        this.programFormService.addDay(this.programForm, weekIndex);
        const newDayIndex = daysArray.length - 1;
        this.activeDayIndex = newDayIndex;
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

        this.programFormService.addDay(this.programForm, weekIndex + 1,);

        const daysArray = this.getDaysArray(weekIndex + 1);

        
        /*for (let i = 0; i <= daysArray.length; i++) {
            if (!daysArray.controls[i]?.value?.exercises?.length) {
                console.log('Removing empty day at index:', i);
                this.removeDay(weekIndex + 1, i); // Remove empty days
            }
        }*/
        
        const newDay = this.programFormService.createDayFormGroup(currentDayValue as any, true);
        daysArray.push(newDay);
        

    }

    public copyToAllWeeks = () => {

    }

    public duplicateDay = () => {

    }

    public duplicateWeek = () => {

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
        this.autosaveService.save('programs', this.programForm.getRawValue())
    }

    async openSettings() {
        const excludeActions: ProgramActionKey = {
            edit: true
        };
        const actionSheet = await this.programService.presentProgramActionSheet(null, this.program, excludeActions);
        actionSheet.onDidDismiss().then(e => {
            if (e.data?.destructive || e.data?.constructive) {
                this.navCtrl.navigateBack(['./tabs']);
            }
        })
    }
}
