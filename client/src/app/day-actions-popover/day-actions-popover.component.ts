import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-day-actions-popover',
    templateUrl: './day-actions-popover.component.html',
    styleUrls: ['./day-actions-popover.component.scss'],
    standalone: true,
    imports: [IonicModule, TranslateModule]
})
export class DayActionsPopoverComponent {

    @Input() canMoveUp: boolean = false;
    @Input() canMoveDown: boolean = false;

    @Input() moveUpHandler: () => void = () => { };
    @Input() moveDownHandler: () => void = () => { };
    @Input() removeHandler: () => void = () => { };
}
