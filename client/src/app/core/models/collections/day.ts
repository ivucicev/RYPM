import { EntityBase } from "../entity-base";
import { Exercise } from "./exercise";
import { Workout } from "../workout";

export interface Day extends EntityBase {
    exercises: Exercise[];

    workout: Workout;
}
