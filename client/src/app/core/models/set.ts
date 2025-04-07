import { RepType } from "./rep-type";
import { WeightType } from "./weight-type";

export interface ExerciseSet {
    type: RepType;
    weightType: WeightType;
    weight?: number;
    value?: number;
    minValue?: number;
    maxValue?: number;
}
