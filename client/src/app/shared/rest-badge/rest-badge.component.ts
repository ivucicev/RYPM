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
    private debounced?: any;

    constructor(private storage: StorageService) {
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.ngOnInit();
            }
        });
        window.addEventListener('pageshow', (e: PageTransitionEvent) => {
            this.ngOnInit();
        });
        window.addEventListener('focus', (e: PageTransitionEvent) => {
            this.ngOnInit();
        });
        window.addEventListener('blur', (e: PageTransitionEvent) => {
        });
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
        clearTimeout(this.debounced);

        this.debounced = setTimeout(async () => {
            const initialTime = this.initialTime();

            if (initialTime != null) {
                const duration = this.duration(); // in seconds
                const start = new Date(initialTime).getTime();   // ms
                const end = start + duration * 1000;             // ms
                const now = Date.now();

                // persist for later resumes
                await this.storage.setItem(StorageKeys.REST_BADGE_STORAGE_KEY, {
                    initialTime,
                    duration
                });

                // real-time based remaining seconds
                const remainingMs = end - now;
                const restTimeRemaining = Math.max(0, Math.ceil(remainingMs / 1000));

                if (restTimeRemaining > 0 && now < end) {
                    // pass remaining time (and optionally end) to the timer
                    this.startRest(restTimeRemaining);
                    return;
                }
            }

            this.stopRest();
            if (this.restTimeRemaining <= 0) {
                this.onTimerCompletedEvent.emit(true);
            }
        }, 100);
    }

    async startRest(duration: number) {
        this.stopRest();

        const end = Date.now() + duration * 1000;
        this.isResting = true;

        this.restTimerId = setInterval(async () => {
            const remainingMs = end - Date.now();
            this.restTimeRemaining = Math.max(0, Math.ceil(remainingMs / 1000));

            if (remainingMs <= 0) {
                await this.stopRest();
            }
        }, 250);
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
