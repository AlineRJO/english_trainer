import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JsonArchieve } from '../models/json-archieve.enum';
/*JSON-serve work it*/
@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private http = inject(HttpClient);

  create(data: any, api: JsonArchieve = JsonArchieve.vocabulary): Observable<any> {
    return this.http.post(api, data);
  }

  read(api: JsonArchieve = JsonArchieve.vocabulary): Observable<any[]> {
    return this.http.get<any[]>(api);
  }

  update(id: string | number, data: any, api: JsonArchieve = JsonArchieve.vocabulary): Observable<any> {
    return this.http.patch(`${api}/${id}`, data);
  }

  delete(id: string | number, api: JsonArchieve = JsonArchieve.vocabulary): Observable<any> {
    return this.http.delete(`${api}/${id}`);
  }
}
