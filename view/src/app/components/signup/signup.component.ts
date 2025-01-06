import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  imports: [FormsModule, NgIf],
  selector: 'app-signup',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
  
})

export class SignupComponent implements OnInit {
  constructor(private route: Router, private userService: UserService) { }
  async ngOnInit(): Promise<void> {
    const user = await this.userService.getUser();
    if(user) {
      this.route.navigate(['/userProfile']);
      return;
    }
  }
  username: string = '';
  email: string = '';
  password: string = '';
  confirm_password: string = '';
  err: string = '';
  setName(name: string): void {
    this.username = name;
  }
  setEmail(email: string): void {
    this.email = email;
  }
  setPassword(password: string): void {
    this.password = password;
  }
  setConfirmPassword(confirm_password: string): void {
    this.confirm_password = confirm_password;
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    if(this.password !== this.confirm_password) {
      this.err = "password not match confirm password";
      return;
    }
    const gender = document.getElementById('gender') as HTMLSelectElement;

    const data = { name: this.username, email: this.email, password: this.password, gender: gender.value };
    try {
      const res = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const responseData = await res.json();
  
      if (!res.ok) {
        this.err = responseData.message;
        console.error('Error submitting signup data:', res.statusText);
        return;
      }
  
      localStorage.setItem('WSToken', responseData.token);
      this.userService.updateApp();
      this.route.navigateByUrl('userProfile')

    } catch (error) {
      console.error('Error submitting signup data:', error);
    }

  }

  routeLogin(): void {
    this.route.navigate(['/login']);
  }
}
