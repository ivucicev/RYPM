import { Routes } from '@angular/router';

import { ProgramComponent } from './program.component';

export const routes: Routes = [
    {
        path: '',
        component: ProgramComponent
    },
    {
        path: ':id',
        component: ProgramComponent
    }
];

