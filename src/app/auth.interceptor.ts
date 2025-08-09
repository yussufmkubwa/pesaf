import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authToken = localStorage.getItem('authToken');
    console.log('Auth Interceptor - Token:', authToken);

    if (authToken) {
      const authReq = request.clone({
        headers: request.headers.set('Authorization', `Token ${authToken}`)
      });
      console.log('Auth Interceptor - Request with token:', authReq);
      return next.handle(authReq);
    }

    console.log('Auth Interceptor - Request without token:', request);
    return next.handle(request);
  }
}
