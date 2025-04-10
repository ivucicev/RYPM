import { ExerciseSet } from "./set";

export interface Exercise {
    id: string;
    // exerciseId: string; // TODO: external exercise identifier
    name: string;
    tags?: string[];
    notes?: string;
    restDuration?: number;
    sets?: ExerciseSet[];
}
