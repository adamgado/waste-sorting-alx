import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';

export const adminAuthGuard: CanActivateFn = async(route, state) => {
  const router = inject(Router);
  const userService = new UserService();
  const user = await userService.getUser(); 
  // console.log(user && user.role === "Admin");
  if(user && user.role === "Admin") return true;
  alert(`you don't have the privilege.`)
  router.navigate(['/home']);
  return false;
};
