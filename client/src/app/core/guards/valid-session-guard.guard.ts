import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { NavController, Platform } from '@ionic/angular/common';
import { PocketbaseService } from '../services/pocketbase.service';
import { skipLocationChange } from '../helpers/platform-helpers';

export const validSessionGuard: CanActivateFn = async (route, state) => {
	const nav = inject(NavController);
	const pb = inject(PocketbaseService);
	const platform = inject(Platform);

	if (pb.pb.authStore.isValid) return true;
	else {
		await nav.navigateRoot(['./sign-in'], { skipLocationChange: skipLocationChange(platform) });
		return false;
	}

};
