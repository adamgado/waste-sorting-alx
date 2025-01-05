import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { UserdetialsComponent } from './components/userdetials/userdetials.component';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet, CommonModule,UserdetialsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private route: Router, private userService: UserService) { }

  user: any = null;
  notification: any = new WebSocket('ws://localhost:8081');

  async ngOnInit(): Promise<void> {
    this.user = await this.userService.getUser();
    this.userService.data$.subscribe(async(data) => {
      this.user = await this.userService.getUser();
      if(this.user.id) {
        this.notification.send(this.user.id);
      }
    });
  }
}
