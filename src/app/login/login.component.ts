import { error } from '@angular/compiler/src/util';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../model/user.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private authService: AuthService, private router:Router) {
    console.log('text, password')

  }
  loginModel: User = new User();
  errorMessage: string;
  onSubmit(): void {
    this.errorMessage = '';
    this.authService.login(this.loginModel)
      .subscribe((result) => { 
        this.router.navigateByUrl('home');
       }, (error) => {
        const {message} = error.error
        this.errorMessage = message;
      });
  }
}
