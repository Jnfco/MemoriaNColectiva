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
import { NavbarComponent } from './shared/navbar/navbar.component';
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


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
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
    SpinnerComponent


  ],
  imports: [
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
    MatListModule
  ],
  providers: [DocumentService,
    AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
