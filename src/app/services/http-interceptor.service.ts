import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('login')) {
      if(this.mockLogin(req)){
        const {Username} = req.body;
        return ok({
          Username: Username,
          Token: 'fake-jwt-token'
      } as User)
      }
      else{
        return error('Username or password is incorrect')
      }
    }
    return next.handle(req);
  }

private mockLogin(req: HttpRequest<any>){
  const {Username, Password} = req.body
  return Username === 'test' && Password ==='password'
}

}
function ok(body?:any) {
  return of(new HttpResponse({ status: 200, body }))
}

function error(message:any) {
  return throwError({ error: { message } });
}


