import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WakeLockService {
    private sentinel: any;
    private listening = false;

    async enable() {
        if (this.sentinel) return;
        if ('wakeLock' in navigator && (navigator as any).wakeLock?.request) {
            try {
                this.sentinel = await (navigator as any).wakeLock.request('screen');
                if (!this.listening) {
                    document.addEventListener('visibilitychange', this.reacquire, false);
                    this.listening = true;
                }
            } catch { }
        }
    }

    disable = () => {
        try {
            if (this.listening) {
                document.removeEventListener('visibilitychange', this.reacquire, false);
                this.listening = false;
            }
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
