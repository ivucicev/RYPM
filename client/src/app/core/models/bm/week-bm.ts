import { DayBM } from "./day-bm";

export interface WeekBM {
    id?: string;

    days: DayBM[];

    index: number;

    // parent refs
    program: string;
}
