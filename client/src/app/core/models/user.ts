import { UserType } from "./user-type";
import { WeightType } from "./weight-type";

export type User = {
    id?: string;
    name: string;
    email: string;
    avatar: string;
    type: UserType;
    isPublic: boolean;
    about: string;
    defaultWeightType: WeightType.KG | WeightType.LB
}
