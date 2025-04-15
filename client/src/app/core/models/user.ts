import { UserType } from "./user-type";
import { WeightType } from "./weight-type";

export type User = {
    name: string;
    email: string;
    avatar: string;
    type: UserType;
    id: string;
    isPublic: boolean;
    about: string;
    defaultWeightType: WeightType.KG | WeightType.LB
}
