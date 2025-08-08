import { Routes } from '@angular/router';

import { TrainerProfilePage } from './trainer-profile.page';

export const routes: Routes = [
	{
		path: '',
		component: TrainerProfilePage
	},
	{
		path: 'ai/:id',
		component: TrainerProfilePage,
		data: { ai: true }
	}
];

