import { TranslateModule } from '@ngx-translate/core';
import { Component, Input } from '@angular/core';
import { IonButton, IonIcon} from '@ionic/angular/standalone';
import { reloadOutline, sadOutline } from 'ionicons/icons';

@Component({
    selector: 'app-no-data',
    templateUrl: 'no-data.component.html',
    styleUrls: ['./no-data.component.scss'],
    standalone: true,
    imports: [TranslateModule, IonButton, IonIcon],
})
export class NoDataComponent {

    reloadIcon = reloadOutline;
    sadIcon = sadOutline;

    @Input()
    text: string;

    @Input()
    reloadFn: Function;

    constructor() { }

    reload = async () => {
        await this.reloadFn();
    }

}
