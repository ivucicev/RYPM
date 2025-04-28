import { Exercise } from "./exercise";

export interface Day {
    id?: string;
    exercises: Exercise[];
}
