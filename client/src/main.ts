import { HttpClient, provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules, Router } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app/app.component';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { enableProdMode, ErrorHandler, importProvidersFrom, isDevMode } from '@angular/core';
import { environment } from './environments/environment.prod';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { routes } from './app/app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import * as Sentry from "@sentry/angular";
import { APP_INITIALIZER } from '@angular/core';

if (environment.production) {
    enableProdMode();
}

// Global listeners for uncaught errors and unhandled promise rejections
window.addEventListener('error', (event: ErrorEvent) => {
    try {
        Sentry.captureException(event.error ?? event.message ?? event);
    } catch {
        console.error(event);
    }
});

window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    try {
        Sentry.captureException(event.reason ?? event);
    } catch {
        console.error('Unhandled rejection', event);
    }
});

Sentry.init({
    dsn: "https://226f4c44870fc1974468a640b1837551@o318968.ingest.us.sentry.io/4510437093343232",
    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true,
    integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration()
    ],
    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.,
    // Enable sending logs to Sentry
    enableLogs: true
});

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

bootstrapApplication(AppComponent, {
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        provideIonicAngular({
            // TODO: check
            // mode: 'ios',
            //animated: true,
            // backButtonText: '',
            // rippleEffect: true,
            // tabButtonLayout: 'icon-top',
        }),
        provideHttpClient(),
        importProvidersFrom(
            TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useFactory: HttpLoaderFactory,
                    deps: [HttpClient],
                },
            }),
            NgCircleProgressModule.forRoot({}),
        ),
        {
            provide: ErrorHandler,
            useValue: Sentry.createErrorHandler({
                showDialog: true,
            }),
        }, {
            provide: Sentry.TraceService,
            deps: [Router],
        },
        {
            provide: APP_INITIALIZER,
            useFactory: () => () => { },
            deps: [Sentry.TraceService],
            multi: true,
        },
        provideRouter(routes
            , withPreloading(PreloadAllModules)), provideServiceWorker('/ngsw-worker.js', {
                enabled: !isDevMode(),
                registrationStrategy: 'registerWhenStable:30000'
            })
    ]
});