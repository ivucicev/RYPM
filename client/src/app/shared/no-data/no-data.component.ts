import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-no-data',
    templateUrl: 'no-data.component.html',
    styleUrls: ['./no-data.component.scss'],
    standalone: true,
    imports: [IonicModule, TranslateModule],
})
export class NoDataComponent {

    @Input()
    text: string;

    constructor() { }
}
