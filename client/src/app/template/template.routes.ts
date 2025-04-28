import { Routes } from '@angular/router';

import { TemplateComponent } from './template.component';

export const routes: Routes = [
    {
        path: '',
        component: TemplateComponent
    },
    {
        path: ':id',
        component: TemplateComponent
    }
];

