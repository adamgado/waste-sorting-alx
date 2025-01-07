import { NgIf } from '@angular/common';
import { Component, Input  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-userdetials',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './userdetials.component.html',  
  styleUrls: ['./userdetials.component.scss']
})
export class UserdetialsComponent {
  constructor(private route: ActivatedRoute) { }
  user: any;
   
  async ngOnInit() {
    this.route.paramMap.subscribe(async(params) => {
      this.user = {};
      this.user.id = params.get('id');
      
      const res = await fetch(`http://localhost:3000/user?id=` + this.user.id, {
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

      this.user = data.user;
    });
  }
}
