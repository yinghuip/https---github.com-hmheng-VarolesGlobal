import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'valores-global';
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );
  authenticated: boolean = false;
constructor(private breakpointObserver: BreakpointObserver, private authService: AuthService) {

}
ngOnInit(){
  this.authService.currentUserSubject.subscribe((user)=>{
    this.authenticated = user !== null;
  })
}

logout(){
  this.authService.logout();
}
}
