import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-time-badge',
    templateUrl: 'time-badge.component.html',
    styleUrls: ['./time-badge.component.scss'],
    standalone: true,
    imports: [IonicModule]
})
export class TimeBadgeComponent implements OnInit {

    private timer;

    elapsedTime: string = null;

    @Input()
    initialTime: Date | null = null;

    ngOnInit() {
        this.startTimer();
    }

    ngOnDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    private initTick() {
        if (!this.initialTime) return;

        this.initialTime = new Date(this.initialTime);

        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - this.initialTime.getTime()) / 1000);

        const hours = Math.floor(diffInSeconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((diffInSeconds % 3600) / 60).toString().padStart(2, '0');
        const seconds = (diffInSeconds % 60).toString().padStart(2, '0');

        this.elapsedTime = `${hours}:${minutes}:${seconds}`;
    }

    private startTimer() {
        this.timer = setInterval(() => {
            this.initTick();
        }, 1000);
        this.initTick();
    }
}
