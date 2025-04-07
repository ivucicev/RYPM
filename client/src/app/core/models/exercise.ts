import { ExerciseSet } from "./set";

export interface Exercise {
    id: string;
    name: string;
    tags?: string[];
    notes?: string;
    restDuration?: number;
    sets?: ExerciseSet[];
}
