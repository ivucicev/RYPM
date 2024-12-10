import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PocketBaseService {
  public pocketBase = new PocketBase(environment.apiURL);
}
