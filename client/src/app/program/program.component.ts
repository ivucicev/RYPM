import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActionSheetController, IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ErrorMessageDirective } from '../core/directives/error-message.directive';
import { NavController, PopoverController } from '@ionic/angular/standalone';
import { RepType } from '../core/models/enums/rep-type';
import { WeightType } from '../core/models/enums/weight-type';
import { ExerciseFormComponent } from '../form/exercise-form/exercise-form.component';
import { ProgramFormGroup, FormsService } from '../core/services/forms.service';
import { lastValueFrom, Subject, takeUntil } from 'rxjs';
import { DayActionsPopoverComponent } from '../day-actions-popover/day-actions-popover.component';
import { AssignModalComponent } from '../assign-program-modal/assign-modal.component';
import { PocketbaseService } from '../core/services/pocketbase.service';
import { ActivatedRoute } from '@angular/router';
import { Program } from '../core/models/collections/program';
import { ProgramBM } from '../core/models/bm/program-bm';
import { AutosaveService } from '../core/services/autosave.service';
import { WorkoutState } from '../core/models/enums/workout-state';
import { Day } from '../core/models/collections/day';
import { WorkoutStateColorPipe } from '../core/pipes/workout-state-color.pipe';

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

    program: Program;

    programForm: ProgramFormGroup = this.programFormService.createProgramFormGroup();
    subject: Subject<void>;

    selectedWeekIndex: number = 0;
    activeDayIndex: number | null = null;
    activeTab: string = 'info';
    RepType = RepType;
    WeightType = WeightType;
    WorkoutState = WorkoutState;

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

    constructor(
        private popoverCtrl: PopoverController,
        private programFormService: FormsService,
        private modalCtrl: ModalController,
        private pocketbaseService: PocketbaseService,
        private navCtrl: NavController,
        private activatedRoute: ActivatedRoute,
        private translateService: TranslateService,
        private actionSheetCtrl: ActionSheetController,
        private autosaveService: AutosaveService,
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

    init(program?: Program) {
        this.program = program;

        this.programForm = this.programFormService.createProgramFormGroup(program);
        this.autosaveService.register<ProgramBM>(this.programForm, 'programs', false)
            .subscribe();
    }

    async refresh(id: string) {
        if (!id) {
            this.init();
            return;
        }

        this.pocketbaseService.programs.getOne(id, { expand: 'weeks,weeks.days,weeks.days.workout' }).then((res) => {
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

    async presentDayActionPopover(event: Event, weekIndex: number, dayIndex: number) {
        const daysArrayLength = this.getDaysArray(weekIndex).length;
        const popover = await this.popoverCtrl.create({
            component: DayActionsPopoverComponent,
            event: event,
            translucent: true,
            componentProps: {
                canDelete: daysArrayLength > 1,
                canMoveUp: dayIndex > 0,
                canMoveDown: dayIndex < (daysArrayLength - 1),
                moveUpHandler: () => {
                    this.programFormService.moveDay(this.programForm, weekIndex, dayIndex, 'up');
                    this.activeDayIndex = dayIndex - 1;
                },
                moveDownHandler: () => {
                    this.programFormService.moveDay(this.programForm, weekIndex, dayIndex, 'down');
                    this.activeDayIndex = dayIndex + 1;
                },
                removeHandler: () => {
                    this.programFormService.removeDay(this.programForm, weekIndex, dayIndex);
                    let lastDayIndex = this.getDaysArray(weekIndex).length - 1;
                    if (dayIndex > lastDayIndex) {
                        this.activeDayIndex = lastDayIndex;
                    }
                }
            },
            dismissOnSelect: true,
            arrow: true
        });

        await popover.present();
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

    async openSettings() {
        const translations = await lastValueFrom(this.translateService.get([
            'delete', 'cancel'
        ]));

        const actionSheet = await this.actionSheetCtrl.create({
            header: translations.workout,
            buttons: [
                {
                    text: translations.delete,
                    icon: 'trash-outline',
                    role: 'destructive',
                    handler: () => {
                        this.pocketbaseService.programs.delete(this.programForm.get('id')?.value).then(() => {
                            this.navCtrl.navigateBack(['./tabs']);
                        })
                    }
                },
                {
                    text: translations.cancel,
                    icon: 'close-outline',
                    role: 'cancel'
                }
            ]
        });

        await actionSheet.present();
    }
}
