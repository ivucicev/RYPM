import { EntityBase } from "../entity-base";
import { AITrainer } from "../enums/ai-trainer";
import { UserType } from "../enums/user-type";
import { WeightType } from "../enums/weight-type";

export interface User extends EntityBase {
    name: string;
    email: string;
    avatar: string;
    type: UserType;
    isPublic: boolean;
    about: string;
    defaultWeightType: WeightType.KG | WeightType.LB;
    weightIncrement: any;
    aiTrainer: AITrainer;
}
