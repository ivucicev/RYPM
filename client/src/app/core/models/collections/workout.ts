import { Day } from "./day";
import { Exercise } from "./exercise";
import { WorkoutState } from "../enums/workout-state";
import { EntityBase } from "../entity-base";

export interface Workout extends EntityBase {
    start: Date,
    end: Date,
    state: WorkoutState;

    completedAt?: Date;

    day?: Day;

    exercises: Exercise[];
}
