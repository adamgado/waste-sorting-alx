import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-userlist',
  standalone: true,
  imports: [NgFor,NgIf],
  templateUrl: './userlist.component.html',
  styleUrl: './userlist.component.scss'
})
export class UserlistComponent implements OnInit {
  constructor(private router: Router,private userservice: UserService) { }
  users: any[] = [];
user:any;
  async ngOnInit(): Promise<void> {
    this.user=await this.userservice.getUser()
    const res = await fetch('http://localhost:3000/getAllUsres', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('WSToken')}`
        }
      }
    );

    const data = await res.json();

    if(!res.ok) {
      alert(data.message);
      return;
    }

    this.users = data.Users;
    this.users.forEach((user: any) => {
      if(!user.urlphoto) {
        user.urlphoto = 'images/defProfile.jpg';
      }
    })
  this.users=this.users.filter(u=>u.id!=this.user.id);
  }

    toggleEdit(userId: number) {
      this.users = this.users.map(user =>
        user.id === userId
          ? { ...user, showEditOptions: !user.showEditOptions }
          : user
      );
    }

    async assignRole(userId: number, role: string) {

      const res = await fetch('http://localhost:3000/editeRoleUser', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('WSToken')}`
          },
          body: JSON.stringify({id: userId, NewRole: role})
        }
      );

      if(!res.ok) {
        const data = await res.json();
        alert(data.message);
        return;
      }


      this.users = this.users.map(user =>
        user.id === userId
          ? { ...user, role, showEditOptions: false }
          : user
      );
    }


    viewDetails(userId: number) {
      this.router.navigate(['userdetials', userId])
    }
  }
