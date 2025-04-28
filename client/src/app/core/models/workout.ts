import { Exercise } from "./exercise";
import { WorkoutState } from "./workout-state";

export interface Workout {
    id?: string,
    start: Date,
    end: Date,
    state: WorkoutState;
    exercises: Exercise[]
}
