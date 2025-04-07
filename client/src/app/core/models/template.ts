import { Exercise } from "./exercise";

export interface Template {
    id: string,
    name: string,
    exercises: Exercise[];
}
