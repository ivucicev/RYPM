import { Routes } from '@angular/router';
import { WorkoutWizardComponent } from './workout-wizard.component';


export const routes: Routes = [
    {
        path: '',
        component: WorkoutWizardComponent
    },
    {
        path: ':id',
        component: WorkoutWizardComponent
    }
];

