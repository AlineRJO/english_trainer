import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/cards';

  create(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  read(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  update(id: string | number, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string | number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
