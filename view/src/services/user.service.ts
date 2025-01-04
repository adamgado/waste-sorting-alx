import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();
  private userData: any = null;

  constructor() { }

  updateApp(): void {
    this.dataSubject.next(null);
  }

  setUser(user: any): any {
    this.userData = user;
    if(this?.userData && !this.userData?.urlphoto) {
      this.userData.urlphoto = 'images/defProfile.jpg';
    }
    return this.userData;
  }

  async getUser() {
    const token = localStorage.getItem('WSToken');
    if(!token) return this.setUser(null);

    const req = await fetch(`http://localhost:3000/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      }
    });

    if (!req.ok) {
      return this.setUser(null);
    }

    return this.setUser((await req.json()).user);
  }
}
