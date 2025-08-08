import { Injectable } from '@angular/core';
import { PocketbaseService } from './pocketbase.service';
import { ActionSheetController, ModalController, NavController } from '@ionic/angular/standalone';
import { last, lastValueFrom, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Program } from '../models/collections/program';
import { Day } from '../models/collections/day';
import { WorkoutState } from '../models/enums/workout-state';
import { DayBM } from '../models/bm/day-bm';
import { ProgramBM } from '../models/bm/program-bm';
import { WeekBM } from '../models/bm/week-bm';
import { Workout } from '../models/workout';
import { AssignModalComponent } from 'src/app/assign-modal/assign-modal.component';
import { User } from '../models/collections/user';

export type ProgramInfo = (
    Program &
    {
        nextDay: Day,
        started: boolean,
        completed: boolean,
        totalDaysCount: number,
        completedDaysCount: number
    }
);

export type ProgramActionKey = { [key in keyof typeof PROGRAM_ACTIONS]?: boolean };

export const PROGRAM_ACTIONS = {
    start: 'Start',
    continue: 'Continue',
    edit: 'Edit',
    close: 'Close',
    delete: 'Delete',
    assign: 'Assign',
    copy: 'Copy'
};

@Injectable({
    providedIn: 'root'
})
export class ProgramService {


    constructor(
        private pocketbaseService: PocketbaseService,
        private actionSheetCtrl: ActionSheetController,
        private translateService: TranslateService,
        private navCtrl: NavController,
        private modalCtrl: ModalController
    ) {
    }

    /**
     * Maps program info.
     * Requires included collections: `weeks`, `weeks.days`, `week.days.workout`
     * @param program
     * @returns
     */
    static mapProgram(program: Program): ProgramInfo {
        const days = program.weeks.flatMap(w => w.days);

        const nextDay = days.find(d => !d.workout);
        const started = days.some(d => !!d.workout);
        const completedDaysCount = days.filter(d => d.workout && d.workout.state != WorkoutState.InProgress)?.length;
        const totalDaysCount = days.length;

        return {
            ...program,
            nextDay: nextDay,
            completedDaysCount: completedDaysCount,
            totalDaysCount: totalDaysCount,
            started: started,
            completed: started && completedDaysCount == totalDaysCount
        }
    }

    /**
     * Returns complete program info.
     * (included `weeks`, `weeks.days`, `week.days.workout`)
     */
    async getProgramInfoById(programId: string) {
        const program = await this.pocketbaseService.programs.getOne(
            programId,
            {
                expand: 'weeks,weeks.days,weeks.days.workout'
            }
        );

        return ProgramService.mapProgram(program);
    }

    async presentProgramActionSheet(programId?: string, program?: ProgramInfo, excludeActions?: ProgramActionKey) {
        if (!programId && !program) return lastValueFrom(of(null));

        if (program == null) {
            program = await this.getProgramInfoById(programId);
        }

        if (!excludeActions) {
            excludeActions = {};
        };

        const translations = await lastValueFrom(this.translateService.get(Object.values(PROGRAM_ACTIONS)));

        const actionSheet = await this.actionSheetCtrl.create({
            header: program.name,
            buttons: [
                !excludeActions[PROGRAM_ACTIONS.start] && !program.completed ? {
                    text: program.started
                        ? translations.Continue
                        : translations.Start,
                    icon: 'play-outline',
                    handler: () => {
                        return this.startWorkoutFromProgram(program);
                    },
                } : null,
                !excludeActions[PROGRAM_ACTIONS.edit] ? {
                    text: translations.Edit,
                    icon: 'create-outline',
                    handler: () => {
                        return this.editProgram(program.id);
                    },
                } : null,
                // TODO: Trainer
                // {
                //     text: translations.assign,
                //     icon: 'person-add-outline',
                //     handler: () => {
                //         return this.presentAssignProgramPopover(program);
                //     },
                // },
                !excludeActions[PROGRAM_ACTIONS.copy] ? {
                    text: translations.Copy,
                    icon: 'copy-outline',
                    data: {
                        reload: true,
                        constructive: true
                    },
                    handler: () => {
                        return this.copyProgram(program);
                    },
                } : null,
                !excludeActions[PROGRAM_ACTIONS.delete] ? {
                    text: translations.Delete,
                    icon: 'trash-outline',
                    role: 'destructive',
                    data: {
                        reload: true,
                        destructive: true
                    },
                    handler: () => {
                        return this.deleteProgram(program.id);
                    },
                } : null,
                {
                    text: translations.Close,
                    icon: 'close-outline',
                    role: 'cancel',
                },
            ].filter(Boolean),
        });

        await actionSheet.present();

        return actionSheet;
    }

    //#region Actions
    async copyProgram(program: ProgramInfo) {
        const newProgram = {
            id: null,
            name: program.name,
            numberOfWeeks: program.numberOfWeeks,
            description: program.description,
            weeks: program.weeks.map(w => {
                return {
                    days: w.days.map(d => {
                        return {
                            exercises: d.exercises
                        } as DayBM
                    })
                } as WeekBM
            })
        } as ProgramBM

        await this.pocketbaseService.upsertRecord('programs', newProgram);

        return true;
    }

    newProgram() {
        this.navCtrl.navigateForward(['./program']);
    }

    editProgram(programId: string) {
        this.navCtrl.navigateForward([`./program/${programId}`]);
    }

    async deleteProgram(id: string) {
        await this.pocketbaseService.programs.delete(id);
        return true;
    }

    async startWorkoutFromProgram(program: ProgramInfo) {
        const workout: Workout = {
            end: null,
            start: new Date(),
            day: program.nextDay,
            exercises: program.nextDay.exercises,
            effort: 5,
            comment: '',
            state: WorkoutState.InProgress
        };

        this.createAndNavToWorkout(workout);
    }

    private async createAndNavToWorkout(workout: Workout) {
        const excersizes = workout.exercises.map(e => e.name);
        const filter = excersizes.map(name => `exercise.name = '${name}'`).join(' || ');
        const sets = await this.pocketbaseService.sets.getList(0, 20,
            {
                expand: 'exercise',
                filter,
                sort: '-completedAt, -index'
            }
        );

        const groupedSets = sets.items.reduce((acc, set: any) => {
            const name = set.exercise?.name;
            if (!name) return acc;
            if (!acc[name]) acc[name] = [];
            acc[name].push(set);
            return acc;
        }, {} as Record<string, typeof sets.items>);

        // Fill in previousValue for each set in workout.exercises from groupedSets
        workout.exercises.forEach(ex => {
            const setsForExercise: any = groupedSets[ex.name];
            if (!setsForExercise || setsForExercise?.length === 0) return;
            ex.notes = setsForExercise[0]?.exercise?.notes || '';
            if (!setsForExercise) return;
            ex.sets.forEach((set, index) => {
                const previousSet = setsForExercise.find(s => s.index === index);
                if (previousSet) {
                    set.previousValue = previousSet.currentValue;
                    set.previousWeight = previousSet.currentWeight;
                }
            });
        });

        const wo = await this.pocketbaseService.upsertRecord('workouts', workout);
        this.navCtrl.navigateForward([`./workout-wizard/${wo.id}`]);
    }
    //#endregion

    async presentAssignProgramPopover(program: Program) {
        const assign = (users) => {
            // TODO: Trainer
        }
        const modal = await this.presentAssignPopover(program.name, assign);

        return modal;
    }

    async presentAssignPopover(title: string, func: (users: User) => void) {
        const modal = await this.modalCtrl.create({
            component: AssignModalComponent,
            componentProps: {
                title: title,
                onAssign: (users) => {
                    // TODO: Trainer
                    func(users)
                }
            }
        });

        await modal.present();

        return modal;
    }
}
