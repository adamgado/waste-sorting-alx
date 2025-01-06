import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  constructor(private route: Router, private userService: UserService) { }
  async ngOnInit(): Promise<void> {
    const user = await this.userService.getUser();
    if(user) {
      this.route.navigate(['/userProfile']);
      return;
    }
  }

  routeSignup(): void {
    this.route.navigate(['/signup']);
  }

  err: string = '';
  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    const email = (document.getElementById('email') as HTMLSelectElement).value;
    const password = (document.getElementById('password') as HTMLSelectElement).value;

    const data = {email, password}
    try {
      const req = await fetch('http://localhost:3000/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const res = await req.json();

      if(!req.ok) {
        this.err = res.message;
        return;
      }

      
      localStorage.setItem('WSToken', res.token);
      this.userService.updateApp();
      this.route.navigateByUrl('userProfile')
      
    } catch(err) {
      this.err = "error in server" + err
    }
  }
}
