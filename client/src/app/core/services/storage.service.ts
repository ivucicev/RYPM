import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { StorageKeys } from '../constants/storage-keys';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    public async setItem(key: StorageKeys, data: any): Promise<void> {
        if (typeof data !== 'string') {
            data = JSON.stringify(data);
        }
        await Preferences.set({ key, value: data });
    }

    public async removeItem(key: StorageKeys): Promise<void> {
        await Preferences.remove({ key });
    }

    public async getItem<T>(key: StorageKeys): Promise<T | null> {
        const { value } = await Preferences.get({ key });
        if (value === null) {
            return null;
        }
        let data: unknown = value;
        try {
            data = JSON.parse(value);
        } catch (err) { }
        return data as T;
    }

    public async clear(): Promise<void> {
        await Preferences.clear();
    }
}
