import { Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { StorageKeys } from '../constants/storage-keys';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {

    public isDark = signal(false);

    constructor(
        private storageService: StorageService
    ) {
        this.initializeTheme();
    }

    async initializeTheme() {
        const userTheme = await this.storageService.getItem<string>(StorageKeys.THEME);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (userTheme) {
            document.documentElement.setAttribute('data-theme', userTheme);
        } else if (prefersDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
        this.isDark.set(userTheme === 'dark')
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        this.storageService.setItem(StorageKeys.THEME, newTheme);
        this.isDark.set(newTheme === 'dark');
    }
}
