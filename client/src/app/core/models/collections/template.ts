import { EntityBase } from "../entity-base";
import { Exercise } from "./exercise";

export interface Template extends EntityBase {
    name: string,

    exercises: Exercise[];
}
