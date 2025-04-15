import { Exercise } from "./exercise";

export interface Workout {
    id: string,
    userId: string,
    createdById: string,
    start: Date,
    end: Date,
    exercises: Exercise[];
}
