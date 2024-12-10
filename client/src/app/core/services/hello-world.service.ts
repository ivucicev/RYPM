import { Injectable } from '@angular/core';
import { PocketBaseService } from './pocketbase.service';

@Injectable({
  providedIn: 'root'
})
export class HelloWorldService {

  private pocketBase = this.pocketBaseService.pocketBase;

  constructor(
    private pocketBaseService: PocketBaseService
  ) {
  }

  public hello(name: string): Promise<any> {
    return this.pocketBase.send('/api/hello-world/hello', { query: { name: name } });
  }
}
