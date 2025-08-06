import { EntityBase } from "../entity-base";
import { RepType } from "../enums/rep-type";
import { WeightType } from "../enums/weight-type";

export interface Set extends EntityBase {
    index?: number;

    type: RepType;
    weightType: WeightType;
    weight?: number;
    value?: number;
    minValue?: number;
    maxValue?: number;

    completed?: boolean;
    completedAt?: Date;

    restSkipped?: boolean;

    currentWeight?: number;
    currentValue?: number;

    previousWeight?: number;
    previousValue?: number;

    rir?: number;
    rpe?: number;
    dropset?: number;
}


