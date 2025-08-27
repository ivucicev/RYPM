import { Routes } from '@angular/router';

import { ConversationPage } from './conversation.page';

export const routes: Routes = [
	{
		path: '',
		component: ConversationPage
	},
	{
		path: 'ai/:id',
		component: ConversationPage,
		data: { aiConversation: true }
	},
	{
		path: ':id/:to',
		component: ConversationPage
	}
];