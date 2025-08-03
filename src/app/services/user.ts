import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class User {
   url = 'http://127.0.0.1:8000/api/users/'
  constructor(private http: HttpClient) { }

  getAllUser():Observable<any>{
    return this.http.get(this.url);
  }

  addUser(body: any):Observable<any>{
    return this.http.post(this.url,body)
  }

  getUserById(id: any): Observable<any> {
    return this.http.get(`${this.url}${id}/`);
  }

  update(body: any, id: any): Observable<any> {
    return this.http.put(`${this.url}${id}/`, body);
  }

  deleteUser(id: any): Observable<any> {
    return this.http.delete(`${this.url}${id}/`);
  }
  
}
