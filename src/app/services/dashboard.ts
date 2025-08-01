import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Dashboard {
   url = 'http://127.0.0.1:8000/api/irrigation-events/'
  constructor(private http: HttpClient) { }

  getAllIrrigationEvent():Observable<any>{
    return this.http.get(this.url);
  }

  addIrrigationEvent(body: any):Observable<any>{
    return this.http.post(this.url,body)
  }

  getIrrigationEventById(id: any):Observable<any>{
    return this.http.get(`${this.url}/${id}`);
  }

  update(body: any,id: any):Observable<any>{
    return this.http.put(`${this.url}/${id}`,body);

  }

  deleteIrrigationEvent(id: any):Observable<any>{
    return this.http.delete(`${this.url}/${id}`);
  }
  
}
