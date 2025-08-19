import { EntityBase } from "../entity-base";
import { Exercise } from "./exercise";
import { Workout } from "./workout";

export interface Day extends EntityBase {
    exercises: Exercise[];

    index: number;

    workout?: Workout;
    /**
     *  Do not use, map to {@link workout} instead.
     *  TODO: force singular relationship, PB my default always marks as a multiple relationship: {@link https://pocketbase.io/docs/working-with-relations/} */
    workouts?: Workout[];

    // parent refs
    week: string;
}
