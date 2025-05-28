import { UserType } from "../enums/user-type";

export interface RegisterBM {
    name: string;
    email: string;
    type: UserType;
    password: string;
    avatar: any;
}

