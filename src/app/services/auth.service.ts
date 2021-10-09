import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../model/user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService  {
  public currentUserSubject: BehaviorSubject<User | null> =new BehaviorSubject<User | null>(null);;
  public currentUser: Observable<User | null>;
  constructor(private http:HttpClient, private router: Router ) { 
    const storageItem= localStorage.getItem('user');
    if(storageItem){
      const user = JSON.parse(storageItem) as User;
      this.currentUserSubject = new BehaviorSubject<User | null>(user);
      this.currentUser = this.currentUserSubject.asObservable();
    } 


  }

  isAuthenticated():boolean{
    return this.currentUserSubject.value !== null;
  }

  login(data:User){
    return this.http.post(environment.apiUrl+'login',data)
    .pipe(
      map((user)=>{
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      } )
    );
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigateByUrl('');
  }
}
