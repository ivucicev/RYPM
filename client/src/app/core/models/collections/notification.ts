import { EntityBase } from "../entity-base";

export interface Notification extends EntityBase {
    id: string,
    sendAt: Date | string,
    body: any,
    state: 'prepared' | 'sent' | 'cancelled' | 'error',
    type: 'timer' | 'notification' | 'message',
    to: string,
    user: string
}