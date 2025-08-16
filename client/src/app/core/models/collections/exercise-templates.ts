import { EntityBase } from "../entity-base";
import { Category, Force, Level, Mechanic, Muscle } from "../autogen/enums";

export interface ExerciseTemplate extends EntityBase {
    name: string;
    force: Force;
    level: Level,
    mechanic: Mechanic;
    equipment: string;
    primaryMuscles: Muscle[];
    secondaryMuscles: Muscle[];
    instructions: string;
    category: Category;
    isCommunity?: boolean;
    superset: string; 
    summary: string;
}

export const exerciseTemplatesArrayFields: Partial<Record<keyof ExerciseTemplate, boolean>> = {
    primaryMuscles: true,
    secondaryMuscles: true
}

