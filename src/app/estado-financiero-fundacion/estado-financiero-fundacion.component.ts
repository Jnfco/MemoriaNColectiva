import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  Output,
} from '@angular/core';
import * as XLSX from 'xlsx';
import { MatTableDataSource } from '@angular/material/table';
import {
  ActivosC,
  GananciaAtribuible,
  EstadoResIntegrales,
} from '../shared/Interfaces/TablasI';
import { ActivosNC } from '../shared/Interfaces/TablasI';
import { PasivosC } from '../shared/Interfaces/TablasI';
import { PasivosNC } from '../shared/Interfaces/TablasI';
import { Patrimonio } from '../shared/Interfaces/TablasI';
import { EstadoR } from '../shared/Interfaces/TablasI';
import { GananciaAntImp } from '../shared/Interfaces/TablasI';
import {
  AngularFirestoreDocument,
  AngularFirestore,
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { IUser } from '../services/User';

import { AuthService } from '../services/auth.service';
import { DocumentService } from '../services/document.service';
import * as firebase from 'firebase';

import { EstadoFinanciero } from '../shared/Interfaces/EstadoFinanciero';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { snapshotChanges } from '@angular/fire/database';
import { Sindicato } from '../shared/Interfaces/Sindicato';

@Component({
  selector: 'app-estado-financiero-fundacion',
  templateUrl: './estado-financiero-fundacion.component.html',
  styleUrls: ['./estado-financiero-fundacion.component.css']
})
export class EstadoFinancieroFundacionComponent implements OnInit {

  data: [][];
  @ViewChild('tabla', { static: false }) tabla: ElementRef;

  //Nombres para las columnas de las tablas en angular material
  displayedColumns: string[] = [
    'Año',
    'Efectivo y equivalentes al efectivo',
    'Activos financieros',
    'Otros activos no financieros',
    'Deudores educacionales y otras cuentas por cobrar, netos',
    'Cuentas por cobrar a partes relacionadas',
    'Activo por impuestos corrientes',
    'Total activos corrientes',
  ];
  tablaActivosNC: string[] = [
    'Año',
    'otros activos',
    'activos intangibles',
    'propiedades',
    'activos por derecho',
    'total no corrientes',
    'total',
  ];
  tablaPasivosC: string[] = [
    'Año',
    'pasivos arrendamientos',
    'otros pasivos',
    'cuentas comerciales',
    'cuentas relacionadas',
    'otras provisiones',
    'pasivos impuestos corrientes',
    'provisiones',
    'total pasivos corrientes',
  ];
  tablaPasivosNC: string[] = [
    'Año',
    'pasivos arrendamientos',
    'otras provisiones',
    'provisiones beneficios',
    'total pasivos no corrientes',
  ];
  tablaPatrimonio: string[] = [
    'Año',
    'aportes',
    'resultados retenidos',
    'patrimonio contador',
    'participaciones',
    'total patrimonio neto',
    'total pasivos y patrimonio',
  ];

  tablaEstadoResultados: string[] = [
    'Año',
    'ingresos',
    'costo ventas',
    'margen',
    'otros ingresos',
    'gastos admin',
    'otras ganancias',
    'ingresos financieros',
    'costos financieros',
    'resultado reajuste',
  ];
  tablaGananciaAntesImpuestos: string[] = [
    'Año',
    'gastoImp',
    'gananciaDespImp',
    'totalRes',
  ];
  tablaGananciaAtribuibleA: string[] = [
    'Año',
    'gananciaControlador',
    'gananciaNoControl',
    'ganancia',
  ];
  tablaEstadoResultadosIntegrales: string[] = [
    'Año',
    'ganancia',
    'gananciaActuariales',
    'totalResIntegrales',
  ];

  // Listas de interfaces para cada tabla
  activosC: ActivosC[];
  activosNC: ActivosNC[];
  pasivosC: PasivosC[];
  pasivosNC: PasivosNC[];
  patrimonio: Patrimonio[];
  estadoRes: EstadoR[];
  resultadoEstado: EstadoR[];
  gananciaAntesImpuesto: GananciaAntImp[];
  gananciaAtribuible: GananciaAtribuible[];
  estadoResInt: EstadoResIntegrales[];

  //listas a ingresar los datos de las tablas para ser leidas por las material tables
  dataSourceActivosC: any;
  dataSourceActivosNC: any;
  dataSourcePasivosC: any;
  dataSourcePasivosNC: any;
  dataSourcePatrimonio: any;
  dataSourceEstadoR: any;
  dataSourceGananciaA: any;
  dataSourceGananciaAtribuible: any;
  dataSourceEstadoResInt: any;
  dataSourceActivosCDinamica: any;

  importFile: File;
  storeData: any;
  csvData: any;
  jsonData: any;
  textData: any;
  worksheet: any;
  arrData: any;
  jsonArray: any[];
  noData: boolean = true;
  isLoading: boolean;
  noDataMessage: boolean = false;
  jsonSinTransformar: any;
  userId: any;

  estadoFinanciero: EstadoFinanciero;

  matcher = new ErrorStateMatcher();
  fieldForm = new FormControl('', [Validators.pattern('[0-9]*')]);
  test: boolean = true;

  disCol: string;

  idSindicatoUser: string;

  selectedValue: string;

  sindicatoList: any[] = [];
  sindicatosAsociados: string[]=[];

  userEmail: any;

  estadoExists:boolean;

  constructor(
    public afAuth: AngularFireAuth,
    public db: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.userId = firebase.auth().currentUser.uid;
    this.userEmail = firebase.auth().currentUser.email;
    this.noData = true;
    //this.isLoading = true;
    this.disCol = "Hola";
    this.estadoExists = false;
    this.cargarSindicatos();
    //this.getDocument(this.userId);

  }

  cargarSindicatos(){

    //Primero se buscan todos los sindicatos que están asociados al abogado actual en la sesión
    this.db.collection("Sindicato").get().subscribe((querySnapshot) => {

      querySnapshot.forEach((doc) => {

        doc.data().abogados.forEach(element => {

          if (element.correo == this.userEmail) {

            setTimeout(() => {
              this.db.collection("users").doc(doc.data().idAdmin).get().subscribe((snapshotChanges) => {

                var sindicato: any = {
                  nombre: doc.data().nombreSindicato,
                  cantidadMiembros: doc.data().usuarios.length,
                  usuarios: doc.data().usuarios,
                  nombreAdmin: snapshotChanges.data().name,
                  correoAdmin: snapshotChanges.data().email,
                  idFundacion: doc.data().idFundacion,
                  idAdmin: doc.data().idAdmin
                }

                //Luego de encontrar los sindicatos, se llenan en la lista 
                this.sindicatoList.push(sindicato);
              
                console.log("ids de sindicatos asociados: ", this.sindicatoList)

              })

            }, 1000);






          }

        });

      });

      


      

    });
  }
  selectSindicato() {

    var sindicatoSeleccionado = this.selectedValue;
    console.log("valor seleccionado: ",sindicatoSeleccionado);
    this.idSindicatoUser = sindicatoSeleccionado;
    
    this.getDocument();

  }






  getDocument() {
    this.isLoading = true;
    this.activosC = [];

    this.activosNC = [];
    this.pasivosC = [];
    this.pasivosNC = [];
    this.patrimonio = [];
    this.estadoRes = [];
    this.resultadoEstado = [];
    this.gananciaAntesImpuesto = [];
    this.gananciaAtribuible = [];
    this.estadoResInt = [];
    console.log("Id del sindicato: ",this.idSindicatoUser)

    //Ahora se va a buscar dentro de todos los estados financieros, el que tenga el id del sindicato del mismo usuario conectado actualmente

          
          //Aqui se busca el documento ya por el sindicato en vez del userId
          this.db.collection('EstadoFinanciero').doc(this.idSindicatoUser).get().subscribe((snapshotChanges) => {

            if (snapshotChanges.exists) {
              //this.noDataMessage = false;

              var doc = snapshotChanges.data();
              var activosC = doc.activosCorrientes;
              var activosNC = doc.activosNoCorrientes;
              var pasivosC = doc.pasivosCorrientes;
              var pasivosNC = doc.pasivosNoCorrientes;
              var patrimonio = doc.patrimonio;
              var estadoRes = doc.estadoResultados;
              var gananciaAntesImpuesto = doc.gananciaAntesImp;
              var gananciaActuariales = doc.gananciaAtribuible;
              var estadoResIntegrales = doc.estadoResIntegrales;

              for (let i = 0; i < activosC.length; i++) {

                let activosCorrientes = {
                  anio: activosC[i].anio,
                  efectivo: activosC[i].efectivo,
                  activosF: activosC[i].activosF,
                  otrosAc: activosC[i].otrosAc,
                  deudores: activosC[i].deudores,
                  cuentas: activosC[i].cuentas,
                  activoImpC: activosC[i].activoImpC,
                  total: activosC[i].total
                }
                this.activosC.push(activosCorrientes);

              }

              for (let i = 0; i < activosNC.length; i++) {

                let activosNoCorrientes = {
                  anio: activosNC[i].anio,
                  otrosA: activosNC[i].otrosA,
                  activosI: activosNC[i].activosI,
                  prop: activosNC[i].prop,
                  activosD: activosNC[i].activosD,
                  totalNC: activosNC[i].totalNC,
                  totalA: activosNC[i].totalA
                }
                this.activosNC.push(activosNoCorrientes);
              }


              for (let i = 0; i < pasivosC.length; i++) {

                let pasivosCorrientes = {
                  anio: pasivosC[i].anio,
                  pasivosAr: pasivosC[i].pasivosAr,
                  otrosP: pasivosC[i].otrosP,
                  cuentasC: pasivosC[i].cuentasC,
                  cuentasR: pasivosC[i].cuentasR,
                  otras: pasivosC[i].otras,
                  pasivosI: pasivosC[i].pasivosI,
                  provisiones: pasivosC[i].provisiones,
                  totalPC: pasivosC[i].totalPC,
                };
                this.pasivosC.push(pasivosCorrientes);
              }

              for (let i = 0; i < pasivosNC.length; i++) {

                let pasivosNoCorrientes = {
                  anio: pasivosNC[i].anio,
                  pasivosAr: pasivosNC[i].pasivosAr,
                  otrosP: pasivosNC[i].otrosP,
                  provisionesB: pasivosNC[i].provisionesB,
                  total: pasivosNC[i].total,
                };
                this.pasivosNC.push(pasivosNoCorrientes);
              }

              for (let i = 0; i < patrimonio.length; i++) {

                let patrimonios = {
                  anio: patrimonio[i].anio,
                  aportes: patrimonio[i].aportes,
                  resultadosR: patrimonio[i].resultadosR,
                  patrimonioContador: patrimonio[i].patrimonioContador,
                  participaciones: patrimonio[i].participaciones,
                  totalPNeto: patrimonio[i].totalPNeto,
                  totalPP: patrimonio[i].totalPP,
                };
                this.patrimonio.push(patrimonios);
              }

              for (let i = 0; i < estadoRes.length; i++) {

                let estadoR = {
                  anio: estadoRes[i].anio,
                  ingresos: estadoRes[i].ingresos,
                  costoVentas: estadoRes[i].costoVentas,
                  margen: estadoRes[i].margen,
                  otrosI: estadoRes[i].otrosI,
                  gastosAdm: estadoRes[i].gastosAdm,
                  otrasGanancias: estadoRes[i].otrasGanancias,
                  ingresosF: estadoRes[i].ingresosF,
                  costosF: estadoRes[i].costosF,
                  resultadoR: estadoRes[i].resultadoR,
                };
                this.resultadoEstado.push(estadoR);
              }

              for (let i = 0; i < gananciaAntesImpuesto.length; i++) {

                let gananciaAntesImp = {
                  anio: gananciaAntesImpuesto[i].anio,
                  gastoImp: gananciaAntesImpuesto[i].gastoImp,
                  gastoDespImp: gananciaAntesImpuesto[i].gastoDespImp,
                  totalRes: gananciaAntesImpuesto[i].totalRes,
                };
                this.gananciaAntesImpuesto.push(gananciaAntesImp);
              }

              for (let i = 0; i < gananciaActuariales.length; i++) {

                let gananciaAt = {
                  anio: gananciaActuariales[i].anio,
                  gananciaControlador: gananciaActuariales[i].gananciaControlador,
                  gananciaNoControladora: gananciaActuariales[i].gananciaNoControladora,
                  ganancia: gananciaActuariales[i].ganancia,
                };
                this.gananciaAtribuible.push(gananciaAt);
              }


              for (let i = 0; i < estadoResIntegrales.length; i++) {

                let estRInt = {
                  anio: estadoResIntegrales[i].anio,
                  ganancia: estadoResIntegrales[i].ganancia,
                  gananciaAct: estadoResIntegrales[i].gananciaAct,
                  total: estadoResIntegrales[i].total,
                };
                this.estadoResInt.push(estRInt);
              }


              console.log(this.resultadoEstado);

              this.dataSourceActivosC = new MatTableDataSource<ActivosC>(this.activosC);

              this.dataSourceActivosNC = new MatTableDataSource<ActivosNC>(this.activosNC);
              this.dataSourcePasivosC = new MatTableDataSource<PasivosC>(this.pasivosC);
              this.dataSourcePasivosNC = new MatTableDataSource<PasivosNC>(this.pasivosNC);
              this.dataSourcePatrimonio = new MatTableDataSource<Patrimonio>(this.patrimonio);
              this.dataSourceEstadoR = new MatTableDataSource<EstadoR>(this.resultadoEstado);
              this.dataSourceGananciaA = new MatTableDataSource<GananciaAntImp>(this.gananciaAntesImpuesto);
              this.dataSourceGananciaAtribuible = new MatTableDataSource<GananciaAtribuible>(this.gananciaAtribuible);
              this.dataSourceEstadoResInt = new MatTableDataSource<EstadoResIntegrales>(this.estadoResInt);
              this.estadoExists = true;
             // this.noData = false;
              this.isLoading = false;
            }
            else {
              this.estadoExists = false;
              //this.noDataMessage = true;
              //this.noData = true;
              this.isLoading = false;
            }


          });
        }

      }
   


  


