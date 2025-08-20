import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { StorageService } from "./storage.service";
import { StorageKeys } from "../constants/storage-keys";
import { AccountService } from "./account.service";
import { PocketbaseService } from "./pocketbase.service";

@Injectable({
    providedIn: 'root'
})
export class PushService {

    constructor(private storage: StorageService, private pocketbase: PocketbaseService, private account: AccountService) {

    }

    b64urlToU8(b64u) {
        const pad = "=".repeat((4 - b64u.length % 4) % 4);
        const b64 = (b64u + pad).replace(/-/g, "+").replace(/_/g, "/");
        return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    }

    async requestNotifications() {
        let token = await this.storage.getItem<string>(StorageKeys.PORTABLE_SUBSCRIPTION_TOKEN);
        if (!token) {
            if (!('Notification' in window))
                throw new Error('Notifications unsupported')

            const perm = await Notification.requestPermission();
            if (perm !== 'granted')
                throw new Error('User denied');

            const sub = await (
                "pushManager" in window
                    ? (window as any).pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: this.b64urlToU8("BEaY_oTCzI5fYJqxhZX27r63lv7Q0kF_oZiQ24c-vPu9zL4867WOEEKvkdTTKciEFJjIpcc0SPuJmtRSmocklzU") })
                    : (await navigator.serviceWorker.register("/sw.js")).pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: this.b64urlToU8("BEaY_oTCzI5fYJqxhZX27r63lv7Q0kF_oZiQ24c-vPu9zL4867WOEEKvkdTTKciEFJjIpcc0SPuJmtRSmocklzU") })
            );
            token = await this.getToken(sub);

            const user = await this.account.getCurrentUser();

            await this.pocketbase.users.update(user.id, { notificationsEnabled: true, notificationsToken: token });
        }
        return token;
    }

    async push(title, body, duration) {
        let token = await this.storage.getItem<string>(StorageKeys.PORTABLE_SUBSCRIPTION_TOKEN);
        if (!token) token = await this.requestNotifications();
        await fetch(environment.api + `api/push-send?token=${token}&duration=${duration}`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                token,
                title,
                body,
                navigate: "https://app.rypm.app/"
            })
        });
    }

    async getToken(sub?) {
        const res = await fetch(environment.api + "api/push-subscribe", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ subscription: sub })
        });
        const { token } = await res.json();
        await this.storage.setItem(StorageKeys.PORTABLE_SUBSCRIPTION_TOKEN, token);
        return token;
    }

}