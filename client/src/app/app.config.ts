import { InjectionToken } from "@angular/core";

export let APP_CONFIG = new InjectionToken<AppConfig>("app.config");

export interface AppConfig {
	availableLanguages: Array<{ code: string, name: string }>;
	demoMode: boolean;
}

export const BaseAppConfig: AppConfig = {
    availableLanguages: [{
        code: 'en',
        name: 'English'
    }, {
        code: 'ar',
        name: 'عربى'
    }, {
        code: 'fr',
        name: 'français'
    }, {
        code: 'es',
        name: 'Española'
    }, {
        code: 'id',
        name: 'bahasa Indonesia'
    }, {
        code: 'pt',
        name: 'português'
    }, {
        code: 'tr',
        name: 'Türk'
    }, {
        code: 'it',
        name: 'Italiana'
    }, {
        code: 'sw',
        name: 'Kiswahili'
    }],
	demoMode: false,
}; 