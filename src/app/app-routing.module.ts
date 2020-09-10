import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RegisterComponent} from './auth/register/register.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RecuperarPassComponent } from './auth/recuperar-pass/recuperar-pass.component';
import { AuthService } from './services/auth.service';
import { InicioComponent } from './inicio/inicio.component';
import { DashboardComponent } from './shared/dashboard/dashboard.component';
import { EstadoFinancieroComponent } from './estado-financiero/estado-financiero.component';
import { HistorialComponent } from './historial/historial.component';
import { ComparativaComponent } from './comparativa/comparativa.component';
import { ContratoColectivoComponent } from './contrato-colectivo/contrato-colectivo.component';
import { InnominadaComponent } from './innominada/innominada.component';
import { ReunionComponent } from './reunion/reunion.component';
import { CrearSindicatoComponent } from './crear-sindicato/crear-sindicato.component';
import { SindicatoComponent } from './sindicato/sindicato.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'register', component: RegisterComponent},
  {path: 'home',
  canActivate: [AuthService],
   component: HomeComponent,
   children:[{
     path: '',
     component: EstadoFinancieroComponent
   },
  {
    path: 'estadoFinanciero',
    component: EstadoFinancieroComponent
  },
  {
    path: 'reunion',
    component: ReunionComponent
  },
  {
    path: 'innominada',
    component: InnominadaComponent
  },
  {
    path:'historial',
    component: HistorialComponent
  },
  {
    path:'comparativa',
    component: ComparativaComponent
  },
  {
    path:'contrato',
    component: ContratoColectivoComponent
  },
  
  {
    path: 'sindicato',
    component: SindicatoComponent
  }
  ,
  {
    path: 'crearSindicato',
    component: CrearSindicatoComponent
  }

]
  },
  {path: 'login', component: LoginComponent},
  {path: 'reset',component: RecuperarPassComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
