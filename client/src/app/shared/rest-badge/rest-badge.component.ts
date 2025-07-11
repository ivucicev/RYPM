import { Component, input, model, output, SimpleChanges, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DurationPipe } from 'src/app/core/pipes/duration.pipe';
import { TranslatePipe } from '@ngx-translate/core';

const REST_BADGE_STORAGE_KEY = 'restBadgeTimer';

@Component({
    selector: 'app-rest-badge',
    templateUrl: './rest-badge.component.html',
    styleUrls: ['./rest-badge.component.scss'],
    standalone: true,
    imports: [IonicModule, DurationPipe, TranslatePipe]
})
export class RestBadgeComponent implements OnInit {

    isResting = false;
    restTimeRemaining = 0;
    restTimerId: any;

    initialTime = model<Date>();
    duration = model.required<number>();

    onRestSkippedEvent = output<boolean>();

    constructor() { }

    ngOnInit() {
        // Try to restore timer from localStorage
        const stored = localStorage.getItem(REST_BADGE_STORAGE_KEY);
        if (stored) {
            const { initialTime, duration } = JSON.parse(stored);
            if (initialTime && duration) {
                this.initialTime.set(new Date(initialTime));
                this.duration.set(duration);
                this.ngOnChanges({});
            }
        }
    }

    ngOnChanges(_: SimpleChanges) {
        const initialTime = this.initialTime();
        if (initialTime != null) {
            // Save to localStorage
            localStorage.setItem(REST_BADGE_STORAGE_KEY, JSON.stringify({
                initialTime,
                duration: this.duration()
            }));

            const start = new Date(initialTime);
            const end = start.setSeconds(start.getSeconds() + this.duration());
            if (new Date().getTime() < end) {
                const restTimeRemaining = Math.floor((end - new Date().getTime()) / 1000);
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
        localStorage.removeItem(REST_BADGE_STORAGE_KEY);
    }

    skipRest() {
        this.onRestSkippedEvent.emit(true);
        this.stopRest();
    }
}
