import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RepType } from '../models/enums/rep-type';

@Pipe({
    name: 'repType',
    standalone: true
})
export class RepTypePipe implements PipeTransform {

    private translationKeys = {
        [RepType.Duration]: 'duration',
        [RepType.Max]: 'max',
        [RepType.Reps]: 'reps',
        [RepType.Range]: 'range'
    };

    constructor(private translateService: TranslateService) { }

    transform(value: RepType | string): string {
        if (!value) {
            return '';
        }

        const translationKey = this.translationKeys[value];

        if (!translationKey) {
            return value.toString().toLowerCase();
        }

        return this.translateService.instant(translationKey);
    }
}
