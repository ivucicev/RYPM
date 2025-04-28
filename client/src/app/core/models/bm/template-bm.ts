import { ExerciseBM } from "./exercise-bm";

export interface TemplateBM {
    id?: string,
    name: string,
    exercises: ExerciseBM[];
}
