import { Day } from "./day";
import { Exercise } from "./exercise";
import { WorkoutState } from "../enums/workout-state";
import { EntityBase } from "../entity-base";
import { User } from "./user";

export interface Workout extends EntityBase {
    start: Date,
    end: Date,
    state: WorkoutState;

    completedAt?: Date;

    day?: Day;
    effort?: number; // total effort in seconds
    comment?: string;

    exercises: Exercise[];
    tags?: string[];
    load?: number;
    user?: User
}
