import { UserType } from "./user-type";

export type User = {
    name: string;
    email: string;
    avatar: string;
    type: UserType;
    id: string;
}
