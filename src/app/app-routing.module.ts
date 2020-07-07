import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RegisterComponent} from './auth/register/register.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RecuperarPassComponent } from './auth/recuperar-pass/recuperar-pass.component';
import { AuthService } from './services/auth.service';
import { InicioComponent } from './inicio/inicio.component';
import { DashboardComponent } from './shared/dashboard/dashboard.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'register', component: RegisterComponent},
  {path: 'home',
  canActivate: [AuthService],
   component: HomeComponent,
   children:[{
     path: '',
     component: DashboardComponent
   },{
     path: 'inicio',
     component: InicioComponent
   }]
  },
  {path: 'login', component: LoginComponent},
  {path: 'reset',component: RecuperarPassComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
