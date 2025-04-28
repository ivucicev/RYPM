import { RepType } from "./rep-type";
import { WeightType } from "./weight-type";

export interface Set {
    id?: string;
    index: number;

    type: RepType;
    weightType: WeightType;
    weight?: number;
    value?: number;
    minValue?: number;
    maxValue?: number;

    completed?: boolean;
    currentWeight?: number;
    currentValue?: number;

    previousWeight?: number;
    previousValue?: number;
}


