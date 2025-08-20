import { ExerciseBM } from "./exercise-bm";

export interface DayBM {
    id?: string;
    exercises: ExerciseBM[];

    index: number;

    // parent refs
    week: string;
}
