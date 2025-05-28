import { EntityBase } from "./entity-base";
import { Set } from "./collections/exercise-set";

export interface Exercise extends EntityBase {
    name: string;
    tags?: string[];
    notes?: string;
    restDuration?: number;

    completed?: boolean;
    completedAt?: Date;

    sets?: Set[];
}
