import { HttpClient, provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app/app.component';
import { APP_CONFIG, BaseAppConfig } from './app/app.config';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment.prod';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { routes } from './app/app.routes';

if (environment.production) {
    enableProdMode();
}

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

bootstrapApplication(AppComponent, {
    providers: [
        { provide: APP_CONFIG, useValue: BaseAppConfig },
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        provideIonicAngular({
            // TODO: check
            // mode: 'ios',
            // animated: true,
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
        provideRouter(routes, withPreloading(PreloadAllModules))
    ],
});
