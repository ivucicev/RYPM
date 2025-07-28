import { Routes } from '@angular/router';
import { SignInPage } from './sign-in/sign-in.page';

// TODO: add guards/auth
export const routes: Routes = [
    {
        path: '',
        redirectTo: 'sign-in',
        pathMatch: 'full'
    },
    {
        path: '',
        loadChildren: () => import('./tabs/tabs.routes').then(m => m.routes)
    },
    {
        path: 'sign-in',
        loadChildren: () => import('./sign-in/sign-in.routes').then(m => m.routes)
    },
    {
        path: 'register',
        loadChildren: () => import('./register/register.routes').then(m => m.routes)
    },
    {
        path: 'verification',
        loadChildren: () => import('./verification/verification.routes').then(m => m.routes)
    },
    {
        path: 'forgot-password',
        loadChildren: () => import('./forgot-password/forgot-password.routes').then(m => m.routes)
    },
    {
        path: 'home',
        loadChildren: () => import('./home/home.routes').then(m => m.routes)
    },
    {
        path: 'weight-programs',
        loadChildren: () => import('./weight-programs/weight-programs.routes').then(m => m.routes)
    },
    {
        path: 'workout-start',
        loadChildren: () => import('./workout-start/workout-start.routes').then(m => m.routes)
    },
    {
        path: 'rest',
        loadChildren: () => import('./rest/rest.routes').then(m => m.routes)
    },
    {
        path: 'my-activity',
        loadChildren: () => import('./my-activity/my-activity.routes').then(m => m.routes)
    },
    {
        path: 'chats',
        loadChildren: () => import('./chats/chats.routes').then(m => m.routes)
    },
    {
        path: 'settings',
        loadChildren: () => import('./settings/settings.routes').then(m => m.routes)
    },
    {
        path: 'search-user',
        loadChildren: () => import('./search-user/search-user-routes').then(m => m.routes)
    },
    {
        path: 'conversation',
        loadChildren: () => import('./conversation/conversation.routes').then(m => m.routes)
    },
    {
        path: 'program',
        loadChildren: () => import('./program/program.routes').then(m => m.routes)
    },

    {
        path: 'workout',
        loadChildren: () => import('./workout/workout.routes').then(m => m.routes)
    },
    {
        path: 'template',
        loadChildren: () => import('./template/template.routes').then(m => m.routes)
    },
    {
        path: 'workout-wizard',
        loadChildren: () => import('./workout-wizard/workout-routes').then(m => m.routes)
    },
    {
        path: 'my-profile',
        loadChildren: () => import('./settings/my-profile/my-profile.routes').then(m => m.routes)
    },
    {
        path: 'get-pro',
        loadChildren: () => import('./get-pro/get-pro.routes').then(m => m.routes)
    },
    {
        path: 'my-trainers',
        loadChildren: () => import('./my-trainers/my-trainers.routes').then(m => m.routes)
    },
    {
        path: 'help',
        loadChildren: () => import('./help/help.routes').then(m => m.routes)
    },
    {
        path: 'change-language',
        loadChildren: () => import('./change-language/change-language.routes').then(m => m.routes)
    },
    {
        path: 'account',
        loadChildren: () => import('./settings/account/account.routes').then(m => m.routes)
    },
    {
        path: 'measurements',
        loadChildren: () => import('./measurements/measurements.routes').then(m => m.routes)
    },
    {
        path: 'terms-condition',
        loadChildren: () => import('./terms-condition/terms-condition.routes').then(m => m.routes)
    },
    {
        path: 'trainer-profile',
        loadChildren: () => import('./trainer-profile/trainer-profile.routes').then(m => m.routes)
    },
    {
        path: 'buyappalert',
        loadChildren: () => import('./buyappalert/buyappalert.routes').then(m => m.routes)
    },
    {
        path: 'workout-info',
        loadChildren: () => import('./workout-info/workout-info.routes').then(m => m.routes)
    },
    {
        path: 'stretch-workouts',
        loadChildren: () => import('./stretch-workouts/stretch-workouts.routes').then(m => m.routes)
    },
    {
        path: 'chest-workouts',
        loadChildren: () => import('./chest-workouts/chest-workouts.routes').then(m => m.routes)
    },
    {
        path: 'vt-popup',
        loadChildren: () => import('./vt-popup/vt-popup.routes').then(m => m.routes)
    }
];
