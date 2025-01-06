import { NgClass, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatIconModule, NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  @Input({required: true}) user: any;
  @Input({required: true}) notification: any;
  haveNotification: boolean = false;

  sound = new Audio('ringing.mp3');
  ngOnInit(): void {
    
    this.notification.addEventListener('message', (event: any) => {
      const message = event.data;
      this.sound.play();
      this.haveNotification = true;
    });
  }

  isSlideOut = true;
  notfication = true;
  constructor(private router: Router, private userService: UserService) { }

  toggleSlideOut(): void {
    this.isSlideOut = !this.isSlideOut;
  }
  onHome(){
    this.isSlideOut = true;
    this.router.navigate(['/home']);
  }
  onHistory(){
    this.isSlideOut = true;
    this.router.navigate(['/history']);
  }
  onLogout() {
    this.isSlideOut = true;
    localStorage.removeItem('WSToken');
    this.userService.updateApp();
    this.router.navigate(['/login']);
  }
  onMachinesList(){
    this.isSlideOut = true;
    this.router.navigate(['/machinelist']);
  }
  onUsersList(){
    this.isSlideOut = true;
    this.router.navigate(['/userlist']);
  }
  onSignup(){
    this.isSlideOut = true;
    this.router.navigate(['/signup']);
  }
  onLogin(){
    this.isSlideOut = true;
    this.router.navigate(['/login']);
  }
  onProfile(){
    this.isSlideOut = true;
    this.router.navigate(['/userProfile']);
  }
  onNotification(){
    this.isSlideOut = true;
    this.haveNotification = false;
    this.router.navigate(['/notification', this.user.id]);
  }
}
