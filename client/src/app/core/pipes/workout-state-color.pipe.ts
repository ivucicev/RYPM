import { Pipe, PipeTransform } from '@angular/core';
import { WorkoutState } from '../models/enums/workout-state';

@Pipe({
    name: 'workoutStateColor',
    standalone: true
})
export class WorkoutStateColorPipe implements PipeTransform {

    private colors = {
        [WorkoutState.Completed]: 'success',
        [WorkoutState.Stopped]: 'danger',
        [WorkoutState.InProgress]: 'primary',
    };

    transform(value: WorkoutState | string): string {
        if (!value) {
            return 'medium';
        }

        const color = this.colors[value];

        return color ?? 'medium';
    }

}
