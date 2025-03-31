import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import PocketBase from 'pocketbase';
import { environment } from 'src/environments/environment';
import { ToastService } from './toast-service';

@Injectable({
    providedIn: 'root'
})
export class PocketbaseService {

    pb: PocketBase = new PocketBase(environment.apiURL);

    constructor(
        translateService: TranslateService,
        private toastService: ToastService
    ) {
        this.pb.afterSend = (response, data, options?: any) => {
            if (options && options.headers && options.headers.notoast) return data;

            if (response.status != 200) {
                switch (response.status) {
                    case 400:
                        let messages = '';
                        if (data.data)
                            Object.keys(data.data).forEach(key => {
                                const d = data.data as { code: string, message: string };
                                messages += translateService.instant((key.charAt(0).toUpperCase() + key.slice(1)) + " - " + data.data[key].message) + ' ';
                            })
                        this.toastService.error(data?.message + ' ' + messages);
                        break;

                    case 500:
                        this.toastService.error('errors.unexpected_error');
                        break;
                    default:
                        break;
                }
            } else if (options?.method == "POST" || options?.method == "PATCH" || options?.method == "DELETE") {
                toastService.success();
            }
            return data;
        };
    }

    //#region Collections
    public get users() {
        return this.pb.collection('users');
    }
    //#endregion
}

