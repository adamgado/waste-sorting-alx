import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [NgIf , NgFor ,CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent implements OnInit {
  constructor(private route: ActivatedRoute, private userService: UserService) { }
  notifications: any[] = [];
  ws: any = new WebSocket('ws://localhost:8081');
  user: any;
  
  async ngOnInit() {
    this.user = await this.userService.getUser();

    this.ws.send(this.user.id);

    this.route.paramMap.subscribe(async(params) => {
      
      const res = await fetch(`http://localhost:3000/notifications`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('WSToken')}`
        }
      });

      if (!res.ok) {
        return;
      }

      const data = await res.json();

      this.notifications = data.result;
      this.notifications.sort((a, b) => {
        const timeA = new Date(a.time).getTime();
        const timeB = new Date(b.time).getTime();
        return timeB - timeA;
      });

      
    this.ws.addEventListener('message', async(event: any) => {
        const res = await fetch(`http://localhost:3000/notifications`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('WSToken')}`
          }
        });

        if (!res.ok) {
          return;
        }

        const data = await res.json();

        this.notifications = data.result;
        this.notifications.sort((a, b) => {
          const timeA = new Date(a.time).getTime();
          const timeB = new Date(b.time).getTime();
          return timeB - timeA;
        });
    });
    });
  }
  async clearNotifications() {
    const res = await fetch('http://localhost:3000/deletNotification', {
      method: "DELETE",
      headers: {
        'Authorization': `${localStorage.getItem('WSToken')}`
      }
    });
    if(res.ok) {
      this.notifications = [];
    }
  }

}

