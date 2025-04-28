import { RepType } from "../rep-type";
import { WeightType } from "../weight-type";


export interface SetBM {
    id?: string;

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


