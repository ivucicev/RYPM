import { Day } from "./collections/day";
import { Exercise } from "./collections/exercise";
import { WorkoutState } from "./enums/workout-state";

export interface Workout {
    id?: string,
    start: Date,
    end: Date,
    state: WorkoutState;
    exercises: Exercise[];
    day?: Day;
    effort?: number; // total effort in seconds
    comment?: string;
    completedAt?: Date;
    updated?: Date;
    created?: Date;
}
