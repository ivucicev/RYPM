import { RepType } from "../enums/rep-type";
import { WeightType } from "../enums/weight-type";

export interface SetBM {
    id?: string;

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
}


