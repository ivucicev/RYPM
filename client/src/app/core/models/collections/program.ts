import { EntityBase } from "../entity-base";
import { Week } from "./week";

export interface Program extends EntityBase {
    name: string;
    description: string;
    numberOfWeeks: number;
    aiProgram: boolean;
    weeks: Week[];
}
