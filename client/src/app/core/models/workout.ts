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

    completedAt?: Date;
    updated?: Date;
    created?: Date;
}
