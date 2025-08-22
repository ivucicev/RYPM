import { Component, input, model, OnInit, output, SimpleChanges } from '@angular/core';
import { DurationPipe } from 'src/app/core/pipes/duration.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { IonIcon, IonButton } from '@ionic/angular/standalone';
import { StorageService } from 'src/app/core/services/storage.service';
import { StorageKeys } from 'src/app/core/constants/storage-keys';

@Component({
    selector: 'app-rest-badge',
    templateUrl: 'rest-badge.component.html',
    styleUrls: ['rest-badge.component.scss'],
    standalone: true,
    imports: [DurationPipe, TranslatePipe, IonButton, IonIcon]
})
export class RestBadgeComponent implements OnInit {

    isResting = false;

    restTimeRemaining = 0;
    restTimerId: any;

    initialTime = model<Date>();
    duration = model.required<number>();
    onTimerCompletedEvent = output<boolean>();

    onRestSkippedEvent = output<boolean>();

    increasedRest = 0;

    constructor(private storage: StorageService) {
    }

    async ngOnInit() {
        // Try to restore timer from localStorage
        const stored = await this.storage.getItem<any>(StorageKeys.REST_BADGE_STORAGE_KEY);
        if (stored) {
            const { initialTime, duration } = stored;
            if (initialTime && duration) {
                this.initialTime.set(new Date(initialTime));
                this.duration.set(duration);
                this.ngOnChanges({});
            }
        }
    }

    async ngOnChanges(_: SimpleChanges) {
        const initialTime = this.initialTime();
        if (initialTime != null) {
            await this.storage.setItem(StorageKeys.REST_BADGE_STORAGE_KEY, {
                initialTime,
                duration: this.duration()
            });
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
        if (this.restTimeRemaining <= 0)
            this.onTimerCompletedEvent.emit(true);
    }

    async startRest(duration: number) {
        this.stopRest();

        this.restTimeRemaining = duration;

        this.isResting = true;
        this.restTimerId = setInterval(async () => {
            this.restTimeRemaining--;
            if (this.restTimeRemaining <= 0) {
                await this.stopRest();
            }
        }, 1000);
    }

    async stopRest() {
        if (this.restTimerId) {
            clearInterval(this.restTimerId);
            this.restTimeRemaining = 0;
            this.restTimerId = null;
        }
        this.isResting = false;
        this.storage.removeItem(StorageKeys.REST_BADGE_STORAGE_KEY);
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
