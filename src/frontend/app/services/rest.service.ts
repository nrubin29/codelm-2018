import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class RestService {

  private baseUrl = '/api/';
  key: string;

  constructor(private http: HttpClient) { }

  private get headers(): HttpHeaders {
    return new HttpHeaders().set('Authorization', 'Basic ' + this.key)
  }

  get<T>(endpoint: string): Promise<T> {
    return this.http.get<T>(this.baseUrl + endpoint, {headers: this.headers}).toPromise()
  }

  post<T>(endpoint: string, body: any): Promise<T> {
    return this.http.post<T>(this.baseUrl + endpoint, body, {headers: this.headers}).toPromise()
  }
}
