import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProductsComponent } from './components/products/products.component';
import { UserProfileComponent } from './components/userProfile/userProfile.component';
import { UserlistComponent } from './components/userlist/userlist.component';
import { MachinelistComponent } from './components/machinelist/machinelist.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AddmachineComponent } from './components/addmachine/addmachine.component';
import { EditmachineComponent } from './components/editmachine/editmachine.component';
import { DetailsmachineComponent } from './components/detailsmachine/detailsmachine.component';
import { UserdetialsComponent } from './components/userdetials/userdetials.component';
import { loginAuthGuard } from '../auth/login-auth.guard';
import { adminAuthGuard } from '../auth/admin-auth.guard';
import { NotificationComponent } from './components/notification/notification.component';
import { HistoryComponent } from './components/history/history.component';

export const routes: Routes = [
  {path : 'home', component:HomeComponent},
  {path : 'login', component:LoginComponent},
  {path : 'signup', component:SignupComponent},
  {path : 'userProfile', component:UserProfileComponent, canActivate:[loginAuthGuard]},
  {path : 'userlist', component:UserlistComponent, canActivate:[adminAuthGuard]},
  {path : 'products/:lat/:lng', component:ProductsComponent, canActivate:[loginAuthGuard]},
  {path : 'machinelist',component: MachinelistComponent, canActivate:[adminAuthGuard]},
  {path: 'userdetials/:id',component:UserdetialsComponent, canActivate:[adminAuthGuard]},
  {path : 'detailsmachine/:id', component:DetailsmachineComponent, canActivate:[adminAuthGuard]},
  {path : 'addmachine', component:AddmachineComponent, canActivate:[adminAuthGuard]},
  {path : 'editmachine/:id', component:EditmachineComponent, canActivate:[adminAuthGuard]},
  {path : 'notification/:id', component:NotificationComponent, canActivate:[loginAuthGuard]},
  {path : 'history', component:HistoryComponent, canActivate:[loginAuthGuard]},
  {path : '', pathMatch: 'full', redirectTo:'home'},
  {path : '**', component:PageNotFoundComponent}

];
