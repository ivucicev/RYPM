import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

export type ToastType = 'error' | 'warning' | 'info' | 'success';

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    constructor(
        private toastController: ToastController,
        private translateService: TranslateService
    ) { }

    async show(
        message: string,
        duration: number = 3000,
        position: 'top' | 'bottom' | 'middle' = 'bottom',
        type: ToastType = 'info',
        translate: boolean = true
    ): Promise<void> {
        let displayMessage: string;

        if (translate) {
            displayMessage = await firstValueFrom(this.translateService.get(message));
        } else {
            displayMessage = message;
        }

        const toast = await this.toastController.create({
            message: displayMessage,
            duration: duration,
            position: position,
            keyboardClose: true,
            buttons: [
                {
                    text: '×',
                    role: 'cancel'
                },
            ],
            swipeGesture: 'vertical',
            color: this.getColorForType(type),
            icon: this.getIconForType(type)
        });

        await toast.present();
    }

    async success(successKey: string = 'success'): Promise<void> {
        await this.show(successKey, 3000, 'bottom', 'success');
    }

    async info(infoKey: string): Promise<void> {
        await this.show(infoKey, 3000, 'bottom', 'info');
    }

    async error(errorKey: string): Promise<void> {
        await this.show(errorKey, 3000, 'bottom', 'error');
    }

    private getColorForType(type: ToastType): string {
        switch (type) {
            case 'error':
                return 'danger';
            case 'warning':
                return 'warning';
            case 'success':
                return 'success';
            case 'info':
                return 'secondary';
            default:
                return 'primary';
        }
    }

    private getIconForType(type: ToastType): string {
        switch (type) {
            case 'error':
                return 'alert-circle-outline';
            case 'warning':
                return 'warning-outline';
            case 'success':
                return 'checkmark-circle-outline';
            case 'info':
            default:
                return 'information-circle-outline';
        }
    }
}
