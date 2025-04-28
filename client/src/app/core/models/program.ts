import { Week } from "./week";

export interface Program {
    id?: string;
    name: string;
    description: string;
    numberOfWeeks: number;
    weeks: Array<Week>;
}
