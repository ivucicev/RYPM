import { Force, Level, Mechanic, Muscle, Category } from "../autogen/enums";
import { SetBM } from "./exercise-set-bm";

export interface ExerciseBM {
    id?: string;
    name: string;
    force: Force;
    level: Level,
    mechanic: Mechanic;
    equipment: string;
    primaryMuscles: Muscle[];
    secondaryMuscles: Muscle[];
    instructions: string;
    category: Category;

    notes?: string;
    restDuration?: number;

    sets?: SetBM[];

    superset?: string;

    // parent refs
    workout: string;
}
