import { EntityBase } from "../entity-base";

export interface Timer extends EntityBase {
    sendAt: Date | string,
    token: string,
    body: any,
    state: 'prepared' | 'sent' | 'cancelled' | 'error',
}