import { EntityBase } from "../entity-base";
import { Set } from "./exercise-set";
import { ExerciseTemplate } from "./exercise-templates";

export interface Exercise extends EntityBase, ExerciseTemplate {
    summary: string;
    notes?: string;
    restDuration?: number;

    completed?: boolean;
    completedAt?: Date;

    sets?: Set[];

    superset: string;
}
