import { Injectable } from '@angular/core';
import { PocketbaseService } from './pocketbase.service';

@Injectable({
    providedIn: 'root'
})
export class HelloWorldService {

    private pocketBase = this.pocketBaseService.pb;

    constructor(
        private pocketBaseService: PocketbaseService
    ) {
    }

    public hello(name: string): Promise<any> {
        return this.pocketBase.send('/api/hello-world/hello', { query: { name: name } });
    }
}
