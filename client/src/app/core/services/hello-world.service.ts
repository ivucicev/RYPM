import { Injectable } from '@angular/core';
import { PocketbaseService } from './pocketbase.service';

@Injectable({
    providedIn: 'root'
})
export class HelloWorldService {

    private pocketbase = this.pocketbaseService.pb;

    constructor(
        private pocketbaseService: PocketbaseService
    ) {
    }

    public hello(name: string): Promise<any> {
        return this.pocketbase.send('/api/hello-world/hello', { query: { name: name } });
    }
}
