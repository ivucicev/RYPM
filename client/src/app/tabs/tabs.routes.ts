import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
    {
        path: 'tabs',
        component: TabsPage,
        children: [
            {
                path: 'home',
                loadChildren: () => import('../home/home.routes').then(m => m.routes)
            },
            {
                path: 'activity',
                loadChildren: () => import('../my-activity/my-activity.routes').then(m => m.routes)
            },
            {
                path: 'chats',
                loadChildren: () => import('../chats/chats.routes').then(m => m.routes)
            },
            {
                path: 'settings',
                loadChildren: () => import('../settings/settings.routes').then(m => m.routes)
            },
            {
                path: '',
                redirectTo: '/tabs/home',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
    }
];
