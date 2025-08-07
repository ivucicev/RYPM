import { Routes } from '@angular/router';

import { ConversationPage } from './conversation.page';

export const routes: Routes = [
	{
		path: '',
		component: ConversationPage
	},
	{
		path: 'ai',
		component: ConversationPage
	},
	{
		path: ':id',
		component: ConversationPage
	}
];
