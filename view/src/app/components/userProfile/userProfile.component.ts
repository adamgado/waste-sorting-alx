import { Component, Input, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule], // Ensure CommonModule and FormsModule are included
  templateUrl: './userProfile.component.html',
  styleUrls: ['./userProfile.component.scss']
})

export class UserProfileComponent implements OnInit {
  constructor(private route: Router, private userService: UserService) { }

  user: any = null;

  async ngOnInit(): Promise<void> {
    this.user = await this.userService.getUser();
    this.userService.data$.subscribe(async(data) => {
      this.user = await this.userService.getUser();
      // console.log('userService, user =', this.user);
    });
    if(!this.user) {
      this.route.navigate(['/login']);
      return;
    }
  }

  editMode = false;

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  err: string = '';
  selectedFile: any;
  async saveProfile(event: Event) {
    event.preventDefault();
    let photo = false;
    // if(this.selectedFile) {
    //   const formData = new FormData();
    //   formData.append('image', this.selectedFile);
    //   const response = await fetch('http://localhost:3000/upload', {
    //     method: 'POST',
    //     body: formData,
    //   });

    //   if (!response.ok) {
    //     this.err = 'Failed to upload image';
    //     return;
    //   }
    //   photo = true;
    // }
    const name = (document.getElementById('name') as HTMLSelectElement).value;
    const email = (document.getElementById('email') as HTMLSelectElement).value;

    let data = {photoUrl: '', email: '', name: ''};

    if(photo) data.photoUrl = `/images/profiles/${this.user.id}.jpg`;
    if(email != this.user.email) data.email = email;
    if(name != this.user.name) data.name = name;
    
    const res = await fetch('http://localhost:3000/editProfile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('WSToken')}`
      },
      body: JSON.stringify(data)
    });

    const d = await res.json();

    if (!res.ok) {
      this.err = d.message;
      return;
    }
    this.userService.updateApp();
    if(photo) {
      location.reload();
    }
    this.err = '';
    this.editMode = false;  
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files.length > 0) {
      const originalFile = input.files[0];
  
      this.selectedFile = new File([originalFile], `${this.user.id}.jpg`, { type: originalFile.type });
      // console.log(this.selectedFile);
    }
  }
  

  viewHistory() {
    this.route.navigateByUrl('history')
  }
}
