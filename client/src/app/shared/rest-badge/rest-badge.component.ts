import { Component, input, output, SimpleChanges } from '@angular/core';
import { DurationPipe } from 'src/app/core/pipes/duration.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { IonIcon, IonButton } from '@ionic/angular/standalone';
import { StorageService } from 'src/app/core/services/storage.service';
import { StorageKeys } from 'src/app/core/constants/storage-keys';

@Component({
    selector: 'app-rest-badge',
    templateUrl: './rest-badge.component.html',
    styleUrls: ['./rest-badge.component.scss'],
    standalone: true,
    imports: [DurationPipe, TranslatePipe, IonButton, IonIcon]
})
export class RestBadgeComponent {

    isResting = false;

    restTimeRemaining = 0;
    restTimerId: any;

    initialTime = input<Date>();
    duration = input.required<number>();

    onRestSkippedEvent = output<boolean>();

    increasedRest = 0;

    constructor(private storage: StorageService) {
    }

    ngOnChanges(_: SimpleChanges) {
        const initialTime = this.initialTime();
        if (initialTime != null) {

            const start = new Date(initialTime);
            const end = start.setSeconds(start.getSeconds() + this.duration());
            if (new Date().getTime() < end) {
                let restTimeRemaining = Math.floor((end - new Date().getTime()) / 1000);
                if (restTimeRemaining > 0) {
                    this.startRest(restTimeRemaining);
                    return;
                }
            }
        }

        this.stopRest();
    }

    startRest(duration: number) {
        this.stopRest();

        this.restTimeRemaining = duration;

        this.isResting = true;
        this.restTimerId = setInterval(() => {
            this.restTimeRemaining--;
            if (this.restTimeRemaining <= 0) {
                this.stopRest();
            }
        }, 1000);
    }

    stopRest() {
        if (this.restTimerId) {
            clearInterval(this.restTimerId);
            this.restTimeRemaining = 0;
            this.restTimerId = null;
        }
        this.isResting = false;
    }

    skipRest() {
        this.onRestSkippedEvent.emit(true);
        this.stopRest();
    }

    async increaseRest() {
        this.restTimeRemaining += 30;
        this.increasedRest += 30;
        //await this.storage.setItem(StorageKeys.INCREASED_REST, this.increasedRest);
    }

}
