import { SetBM } from "./exercise-set-bm";

export interface ExerciseBM {
    id?: string;
    name: string;
    tags: string[];
    notes: string;
    restDuration: number;
    sets: SetBM[];
    completed: boolean;
    completedAt: Date;
}
