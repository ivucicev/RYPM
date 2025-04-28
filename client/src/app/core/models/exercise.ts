import { Set } from "./exercise-set";

export interface Exercise {
    id: string;
    name: string;
    tags?: string[];
    notes?: string;
    restDuration?: number;
    sets?: Set[];
    completed?: boolean;
}
