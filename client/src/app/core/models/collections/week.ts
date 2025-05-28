import { EntityBase } from "../entity-base";
import { Day } from "./day";

export interface Week extends EntityBase {
    days: Day[];
}
