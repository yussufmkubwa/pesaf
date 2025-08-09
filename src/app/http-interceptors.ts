import { HttpInterceptorFn } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';

// This is a simplified way to provide interceptors in Angular 15+
// However, since AuthInterceptor is a class, we need to provide it differently.
// The `withInterceptors` function expects an array of `HttpInterceptorFn`.

// To use a class-based interceptor, we need a different approach.
// Let's correct the app.config.ts to provide the class-based interceptor.
// This file is not needed if we provide the interceptor directly in app.config.ts.
// I will correct app.config.ts instead.
