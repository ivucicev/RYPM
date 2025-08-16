import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dateTime',
    standalone: true
})
export class DateTimePipe implements PipeTransform {

    dateFormat = 'dd.MM.yyyy HH:mm';

    transform(value: string | Date, ...args: unknown[]): unknown {
        if (!value) return '-';

        var datePipe = new DatePipe("en-US");
        value = datePipe.transform(value, this.dateFormat);

        return value;
    }

}

@Pipe({
    name: 'duration',
    standalone: true
})
export class DurationPipe implements PipeTransform {
    transform(start: string | Date, end: string | Date): string {
        if (!start || !end) return '-';

        const startDate = new Date(start);
        const endDate = new Date(end);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return '-';

        const diffMs = endDate.getTime() - startDate.getTime();
        const diffMinutes = Math.floor(diffMs / 60000);

        return `${diffMinutes} min`;
    }
}