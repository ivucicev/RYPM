import { ProgramUser } from "./program-user";
import { Week } from "./week";

export interface Program {
    id: string;
    name: string;
    description?: string;
    duration: number;
    weeks?: Week[];
    users?: ProgramUser[];
}
