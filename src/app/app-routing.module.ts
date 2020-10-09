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
import { ActivarCuentaComponent } from './activar-cuenta/activar-cuenta.component';
import { AgregarUsuarioSindicatoComponent } from './agregar-usuario-sindicato/agregar-usuario-sindicato.component';
import { FundacionComponent } from './fundacion/fundacion.component';
import { CrearFundacionComponent } from './crear-fundacion/crear-fundacion.component';
import { SindicatosFundacionComponent } from './sindicatos-fundacion/sindicatos-fundacion.component';
import { ModalDetalleSindicatoFundacionComponent } from './modal-detalle-sindicato-fundacion/modal-detalle-sindicato-fundacion.component';
import { EstadoFinancieroFundacionComponent } from './estado-financiero-fundacion/estado-financiero-fundacion.component';

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
  },
  {
    path: 'fundacion',
    component:FundacionComponent
  },
  {
    path: 'crearFundacion',
    component:CrearFundacionComponent
  },
  {
    path: 'sindicatos-fundacion',
    component:SindicatosFundacionComponent
  },
  {
    path: 'estado-financiero-fundacion',
    component:EstadoFinancieroFundacionComponent
  }

]
  },
  {path: 'login', component: LoginComponent},
  {path: 'reset',component: RecuperarPassComponent},
  {path: 'activate',component:ActivarCuentaComponent},
  {path: 'registerUserSindicato',component:AgregarUsuarioSindicatoComponent},
  {path: 'detalleSindicatoFundacion',component:ModalDetalleSindicatoFundacionComponent},
  {path: 'crearSindicatoFundacion',component:CrearSindicatoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
