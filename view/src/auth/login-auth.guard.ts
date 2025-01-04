import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';

export const loginAuthGuard: CanActivateFn = async(route, state) => {
  const router = inject(Router);
  const userService = new UserService();
  const user = await userService.getUser(); 
  if(user) return true;
  alert('please login first.')
  router.navigate(['/login']);
  return false;
};
