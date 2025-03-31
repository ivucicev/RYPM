import { Injectable } from '@angular/core';
import { LoginBM } from '../models/bm/login-bm';

@Injectable({
    providedIn: 'root'
})
export class VerificationStateService {
    private tempEmail: string | null = null;
    private tempPassword: string | null = null;

    setCredentials(email: string, password: string): void {
        this.tempEmail = email;
        this.tempPassword = password;
    }

    popLoginBM(): LoginBM | null {
        if (this.tempEmail && this.tempPassword) {
            const result = {
                email: this.tempEmail,
                password: this.tempPassword
            };
            this.clearCredentials();
            return result;
        }
        return null;
    }

    clearCredentials(): void {
        this.tempEmail = null;
        this.tempPassword = null;
    }

    hasCredentials(): boolean {
        return !!this.tempEmail && !!this.tempPassword;
    }
}
