import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorMessageDirective } from '../core/directives/error-message.directive';
import { PopoverController } from '@ionic/angular/standalone';
import { RepType } from '../core/models/rep-type';
import { WeightType } from '../core/models/weight-type';
import { ExerciseFormComponent } from '../form/exercise-form/exercise-form.component';
import { ProgramFormGroup, ProgramFormsService } from '../core/services/program-forms.service';
import { Subject } from 'rxjs';
import { DayActionsPopoverComponent } from '../day-actions-popover/day-actions-popover.component';
import { AssignModalComponent } from '../assign-program-modal/assign-modal.component';

@Component({
    selector: 'app-program',
    templateUrl: './program.component.html',
    styleUrls: ['./program.component.scss'],
    standalone: true,
    imports: [IonicModule, TranslateModule, ReactiveFormsModule, FormsModule, ErrorMessageDirective,
        ExerciseFormComponent],
    providers: [ProgramFormsService]
})
export class ProgramComponent implements OnInit {

    programForm: ProgramFormGroup;
    subject: Subject<void>;

    selectedWeekIndex: number = 0;
    activeTab: string = 'info';
    RepType = RepType;
    WeightType = WeightType;

    weeks = Array.from({ length: 12 }, (_, i) => i + 1);

    // TODO: fetch
    assignedUsers =
        [
            {
                id: 0,
                name: 'John Smith',
                email: 'john-smth@example.com',
                avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg',
            },
        ];

    constructor(
        private popoverCtrl: PopoverController,
        private programFormService: ProgramFormsService,
        private modalCtrl: ModalController
    ) {
    }

    ngOnInit() {
        const programForm = this.programFormService.createProgramFormGroup();
        this.programForm = programForm;
    }


    getAssignedUsers() {
        return this.programFormService.getAssignedUsers(this.programForm);
    }

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

    addDay(weekIndex: number) {
        return this.programFormService.addDay(this.programForm, weekIndex);
    }

    removeDay(weekIndex: number, dayIndex: number) {
        return this.programFormService.removeDay(this.programForm, weekIndex, dayIndex);
    }

    removeExercise(weekIndex: number, dayIndex: number, exerciseIndex: number) {
        return this.programFormService.removeExercise(this.programForm, weekIndex, dayIndex, exerciseIndex);
    }

    async addExerciseToDay(weekIndex: number, dayIndex: number) {
        await this.programFormService.addExerciseToDay(this.programForm, weekIndex, dayIndex);
    }

    async presentDayActionPopover(event: Event, weekIndex: number, dayIndex: number) {
        const popover = await this.popoverCtrl.create({
            component: DayActionsPopoverComponent,
            event: event,
            translucent: true,
            componentProps: {
                canMoveUp: dayIndex > 0,
                canMoveDown: dayIndex < this.getDaysArray(weekIndex).length - 1,
                moveUpHandler: () => {
                    this.programFormService.moveDay(this.programForm, weekIndex, dayIndex, 'up');
                },
                moveDownHandler: () => {
                    this.programFormService.moveDay(this.programForm, weekIndex, dayIndex, 'down');
                },
                removeHandler: () => {
                    this.programFormService.removeDay(this.programForm, weekIndex, dayIndex);
                }
            },
            dismissOnSelect: true,
            arrow: true
        });

        await popover.present();
    }

    removeAssignedUser(userId: string) {
        this.programFormService.removeUser(this.programForm, userId);
    }

    async openAssignUsersModal() {
        const modal = await this.modalCtrl.create({
            component: AssignModalComponent,
            componentProps: {
                programName: this.programForm.get('name').value,
                programId: this.programForm.get('id')?.value || 'new',
                onAssign: (users) => this.assignUsers(users)
            }
        });

        await modal.present();
    }

    assignUsers(users: any[]) {
        users.forEach(user => {
            this.programFormService.addUser(this.programForm, user);
        });
    }

    saveChanges() {
        this.programForm.markAllAsTouched();

        const program = this.programForm.getRawValue();

        // TODO: save
        console.log('Saving program:', program);
    }
}
