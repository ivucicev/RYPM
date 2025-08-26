import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { NavController } from '@ionic/angular/common';
import { AccountService } from '../services/account.service';

export const hasSessionGuardGuard: CanActivateFn = async (route, state) => {
    const nav = inject(NavController);
    const acc = inject(AccountService);
    const res = await acc.attemptAutoLogin();
    if (!res) return true;
    await nav.navigateRoot(['./tabs/home']);
    return false;
};
