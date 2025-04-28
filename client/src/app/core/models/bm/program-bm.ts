import { WeekBM } from "./week-bm";

export interface ProgramBM {
    id?: string;
    name: string;
    description?: string;
    numberOfWeeks: number;
    weeks?: WeekBM[];
}
