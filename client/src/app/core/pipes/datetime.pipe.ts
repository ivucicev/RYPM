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
