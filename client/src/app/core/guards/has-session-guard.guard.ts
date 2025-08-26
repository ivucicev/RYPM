import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { NavController, Platform } from '@ionic/angular/common';
import { AccountService } from '../services/account.service';
import { skipLocationChange } from '../helpers/platform-helpers';

export const hasSessionGuard: CanActivateFn = async (route, state) => {
    const nav = inject(NavController);
    const acc = inject(AccountService);
    const platform = inject(Platform);
    const res = await acc.attemptAutoLogin();
    if (!res) return true;
    await nav.navigateRoot(['./tabs/home'], { skipLocationChange: skipLocationChange(platform)});
    return false;
};
