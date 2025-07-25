import { WorkoutState } from "../enums/workout-state";
import { ExerciseBM } from "./exercise-bm";

export interface WorkoutBM {
    id?: string,

    start: Date,
    end: Date,
    state: WorkoutState,

    exercises: ExerciseBM[];
}
