import { Pipe, PipeTransform } from '@angular/core';
import { WeightType } from '../models/weight-type';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
    name: 'weightType',
    standalone: true
})
export class WeightTypePipe implements PipeTransform {

    private translationKeys = {
        [WeightType.KG]: 'kg',
        [WeightType.LB]: 'lb',
        [WeightType.BW]: 'bw',
        [WeightType.NA]: 'n_a'
    };

    constructor(private translateService: TranslateService) { }

    transform(value: WeightType | string): string {
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
