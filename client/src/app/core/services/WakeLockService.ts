import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WakeLockService {
    private sentinel: any;

    async enable() {
        if ('wakeLock' in navigator && (navigator as any).wakeLock?.request) {
            try {
                this.sentinel = await (navigator as any).wakeLock.request('screen');
                document.addEventListener('visibilitychange', this.reacquire, false);
            } catch { }
        }
    }

    disable = () => {
        try {
            document.removeEventListener('visibilitychange', this.reacquire, false);
            this.sentinel?.release?.();
            this.sentinel = null;
        } catch { }
    };

    private reacquire = async () => {
        if (document.visibilityState === 'visible' && !this.sentinel) {
            try { this.sentinel = await (navigator as any).wakeLock.request('screen'); } catch { }
        }
    };
}