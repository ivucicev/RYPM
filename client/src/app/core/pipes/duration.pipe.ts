import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'duration',
    standalone: true
})
export class DurationPipe implements PipeTransform {
    transform(seconds: number): string {
        if (!seconds) return '-';

        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return mins > 0 ?
            `${mins}:${secs.toString().padStart(2, '0')}` :
            `${secs}s`;
    }
}
