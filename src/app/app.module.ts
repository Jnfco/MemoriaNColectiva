import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';

//Firebase
import {AngularFireDatabaseModule} from '@angular/fire/database'
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFirestoreModule} from '@angular/fire/firestore';

//Componentes
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

//Servicios
import {DocumentService} from './services/document.service';
import {AuthService} from './services/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Angular material

import { MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
 import {MatTableModule} from '@angular/material/table';
 import {MatDividerModule} from '@angular/material/divider';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import { RecuperarPassComponent } from './auth/recuperar-pass/recuperar-pass.component';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { DashboardComponent } from './shared/dashboard/dashboard.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import { InicioComponent } from './inicio/inicio.component';
import { EstadoFinancieroComponent } from './estado-financiero/estado-financiero.component';
import { HistorialComponent } from './historial/historial.component';
import { ContratoColectivoComponent } from './contrato-colectivo/contrato-colectivo.component';
import { ComparativaComponent } from './comparativa/comparativa.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { InnominadaComponent } from './innominada/innominada.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {BD2NgxHBoxplotModule} from 'bd2-ngx-hboxplot';
import { ChartsModule } from 'ng2-charts';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatTabsModule} from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReunionComponent } from './reunion/reunion.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ModalReunionComponent} from './reunion/modal-reunion/modal-reunion.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpRequest, HttpResponse, HttpInterceptor, HttpHandler, HttpEvent, HttpClient, HttpClientModule } from '@angular/common/http'

//calendar
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

//TimePicker
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { ModalInfoReunionComponent } from './reunion/modal-info-reunion/modal-info-reunion.component';
import { CrearSindicatoComponent } from './crear-sindicato/crear-sindicato.component';
import { SindicatoComponent } from './sindicato/sindicato.component';
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component';
import { ActivarCuentaComponent } from './activar-cuenta/activar-cuenta.component';
import { AgregarUsuarioSindicatoComponent } from './agregar-usuario-sindicato/agregar-usuario-sindicato.component';
import { DetalleReunionComponent } from './detalle-reunion/detalle-reunion.component';
import { FundacionComponent } from './fundacion/fundacion.component';
import { CrearFundacionComponent } from './crear-fundacion/crear-fundacion.component';
import { AgregarUsuarioFundacionComponent } from './agregar-usuario-fundacion/agregar-usuario-fundacion.component';
import { SindicatosFundacionComponent } from './sindicatos-fundacion/sindicatos-fundacion.component';
import { ModalCrearSindicatoFundacionComponent } from './modal-crear-sindicato-fundacion/modal-crear-sindicato-fundacion.component';
import { ModalDetalleSindicatoFundacionComponent } from './modal-detalle-sindicato-fundacion/modal-detalle-sindicato-fundacion.component';
import { ModalAsociarAbogadoComponent } from './modal-asociar-abogado/modal-asociar-abogado.component';
import { VerAbogadosSindicatoComponent } from './ver-abogados-sindicato/ver-abogados-sindicato.component';
import { EstadoFinancieroFundacionComponent } from './estado-financiero-fundacion/estado-financiero-fundacion.component';
import { InominadaFundacionComponent } from './inominada-fundacion/inominada-fundacion.component';
import { ReunionFundacionComponent } from './reunion-fundacion/reunion-fundacion.component';
import { ModalInfoReunionFundacionComponent } from './modal-info-reunion-fundacion/modal-info-reunion-fundacion.component';
import { ModalReunionFundacionComponent } from './modal-reunion-fundacion/modal-reunion-fundacion.component';
import { HistorialFundacionComponent } from './historial-fundacion/historial-fundacion.component';


//Editor de texto
import {EditorModule, TINYMCE_SCRIPT_SRC} from '@tinymce/tinymce-angular';
import { VerDocumentoHistorialComponent } from './ver-documento-historial/ver-documento-historial.component';
import { ContratoFundacionComponent } from './contrato-fundacion/contrato-fundacion.component';
import { VerDocHistorialComponent } from './ver-doc-historial/ver-doc-historial.component';


FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin
])


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    RecuperarPassComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    InicioComponent,
    EstadoFinancieroComponent,
    HistorialComponent,
    ContratoColectivoComponent,
    ComparativaComponent,
    SpinnerComponent,
    InnominadaComponent,
    ReunionComponent,
    ModalReunionComponent,
    ModalInfoReunionComponent,
    CrearSindicatoComponent,
    SindicatoComponent,
    ConfirmationDialogComponent,
    ActivarCuentaComponent,
    AgregarUsuarioSindicatoComponent,
    DetalleReunionComponent,
    FundacionComponent,
    CrearFundacionComponent,
    AgregarUsuarioFundacionComponent,
    SindicatosFundacionComponent,
    ModalCrearSindicatoFundacionComponent,
    ModalDetalleSindicatoFundacionComponent,
    ModalAsociarAbogadoComponent,
    VerAbogadosSindicatoComponent,
    EstadoFinancieroFundacionComponent,
    InominadaFundacionComponent,
    ReunionFundacionComponent,
    ModalInfoReunionFundacionComponent,
    ModalReunionFundacionComponent,
    HistorialFundacionComponent,
    VerDocumentoHistorialComponent,
    ContratoFundacionComponent,
    VerDocHistorialComponent


  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatSidenavModule,
    FlexLayoutModule,
    MatListModule,
    MatTableModule,
    SatPopoverModule,
    MatProgressBarModule,
    BD2NgxHBoxplotModule,
    ChartsModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTooltipModule,
    FullCalendarModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    EditorModule
  ],
  providers: [DocumentService,
    AuthService, MatDatepickerModule,
    MatNativeDateModule,HttpClient,{provide: TINYMCE_SCRIPT_SRC,useValue: 'tinymce/tinymce.min.js'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
