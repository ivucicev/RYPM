import { EntityBase } from "../entity-base";
import { Set } from "./exercise-set";
import { ExerciseTemplate } from "./exercise-templates";

export interface Exercise extends EntityBase, ExerciseTemplate {
    notes?: string;
    restDuration?: number;

    completed?: boolean;
    completedAt?: Date;

    sets?: Set[];

    superset: string;
}
