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
import {ErrorStateMatcher} from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-estado-financiero',
  templateUrl: './estado-financiero.component.html',
  styleUrls: ['./estado-financiero.component.css'],
})
export class EstadoFinancieroComponent implements OnInit {
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
  isLoading: boolean =false;
  noDataMessage: boolean = false;
  jsonSinTransformar: any;
  userId: any;

  estadoFinanciero: EstadoFinanciero;

  matcher = new ErrorStateMatcher();
  fieldForm = new FormControl('',[Validators.pattern('[0-9]*')]);
  test:boolean = true;

  disCol:string;

  constructor(
    public afAuth: AngularFireAuth,
    public db: AngularFirestore,
    private authSvc: AuthService,
    private docSvc: DocumentService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.userId = firebase.auth().currentUser.uid;
    this.noData = true;
    this.isLoading = true;
    this.disCol="Hola"
    this.getDocument(this.userId);

  }

  uploadedFile(ev: any) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    this.noData=true;
    this.isLoading=true;
    reader.onload = (event) => {
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
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      this.jsonSinTransformar =JSON.stringify(jsonData).split('.').join("");
      console.log('sin puntos: ', this.jsonSinTransformar)
      //console.log('Data: ',dataString);

      //console.log("Cantidad filas: ",jsonData.Activos_corrientes.length);

      //Recorre el JSON de la primera hoja y agrega las tablas al datasource
      //console.log("Data: ",this.jsonSinTransformar)


      //A probar con un ingreso dinamico de la primera hoja

      for (let i = 0; i < jsonData.Activos_corrientes.length; i++) {
        this.jsonArray = Array.of(jsonData.Activos_corrientes[i]);
        console.log('data matriz sin saber nombres: ', this.jsonArray);

        let activosCorrientes = {
          anio: this.jsonArray[0].Año,
          efectivo: this.jsonArray[0].Efectivo_y_equivalentes_al_efectivo,
          activosF: this.jsonArray[0].Activos_financieros,
          otrosAc: this.jsonArray[0].Otros_activos_no_financieros,
          deudores: this.jsonArray[0]
            .Deudores_educacionales_y_otras_cuentas_por_cobrar_netos,
          cuentas: this.jsonArray[0].Cuentas_por_cobrar_a_partes_relacionadas,
          activoImpC: this.jsonArray[0].Activo_por_impuestos_corrientes,
          total: this.jsonArray[0].Total_activos_corrientes,
        };
        //console.log('Arreglo 1: ',activosCorrientes)

        this.activosC.push(activosCorrientes);
      }

      //Recorre el JSON de la segunda hoja y agrega las tablas al datasource

      for (let i = 0; i < jsonData.Activos_no_corrientes.length; i++) {
        this.jsonArray = Array.of(jsonData.Activos_no_corrientes[i]);
        var acs = {
          anio: this.jsonArray[0].Año,
          otrosA: this.jsonArray[0].Otros_activos_financieros_no_corrientes,
          activosI: this.jsonArray[0].Activos_intangibles_netos,
          prop: this.jsonArray[0].Propiedades_planta_y_equipos_neto,
          activosD: this.jsonArray[0].Activos_por_derecho_de_uso,
          totalNC: this.jsonArray[0].Total_activos_no_corrientes,
          totalA: this.jsonArray[0].Total_Activos,
        };
        this.activosNC.push(acs);
      }

      //Recorer el JSON de la tercera hoja y agrega al datasource
      for (let i = 0; i < jsonData.Pasivos_corrientes.length; i++) {
        this.jsonArray = Array.of(jsonData.Pasivos_corrientes[i]);
        var pasivosCorrientes = {
          anio: this.jsonArray[0].Año,
          pasivosAr: this.jsonArray[0].Pasivos_financieros_por_arrendamientos,
          otrosP: this.jsonArray[0].Otros_pasivos_no_financieros,
          cuentasC: this.jsonArray[0]
            .Cuentas_por_pagar_comerciales_y_otras_cuentas_por_pagar,
          cuentasR: this.jsonArray[0].Cuentas_por_pagar_a_partes_relacionadas,
          otras: this.jsonArray[0].Otras_provisiones,
          pasivosI: this.jsonArray[0].Pasivos_por_impuestos_corrientes,
          provisiones: this.jsonArray[0]
            .Provisiones_por_beneficios_a_los_empleados,
          totalPC: this.jsonArray[0].Total_pasivos_Corrientes,
        };
        this.pasivosC.push(pasivosCorrientes);
      }

      //Recorer el JSON de la cuarta hoja y agrega al datasource
      for (let i = 0; i < jsonData.Pasivos_no_corrientes.length; i++) {
        this.jsonArray = Array.of(jsonData.Pasivos_no_corrientes[i]);
        var pasivosNoCorrientes = {
          anio: this.jsonArray[0].Año,
          pasivosAr: this.jsonArray[0].Pasivos_financieros_por_arrendamientos,
          otrosP: this.jsonArray[0].Otras_povisiones,
          provisionesB: this.jsonArray[0]
            .Provisiones_por_beneficios_a_los_empleados,
          total: this.jsonArray[0].Provisiones_por_beneficios_a_los_empleados,
        };
        this.pasivosNC.push(pasivosNoCorrientes);
      }

      //Recorer el JSON de la quinta hoja y agrega al datasource
      for (let i = 0; i < jsonData.Patrimonio.length; i++) {
        this.jsonArray = Array.of(jsonData.Patrimonio[i]);
        var patrimonio = {
          anio: this.jsonArray[0].Año,
          aportes: this.jsonArray[0].Aportes_y_donaciones,
          resultadosR: this.jsonArray[0].Resultados_retenidos,
          patrimonioContador: this.jsonArray[0]
            .Patrimono_atribuible_al_controlador,
          participaciones: this.jsonArray[0].Participaciones_no_controladoras,
          totalPNeto: this.jsonArray[0].Total_patrimonio_neto,
          totalPP: this.jsonArray[0].Total_pasivos_y_patrimonio,
        };
        this.patrimonio.push(patrimonio);
      }

      //Recorer el JSON de la sexta hoja y agrega al datasource
      for (let i = 0; i < jsonData.Estado_de_resultados.length; i++) {
        this.jsonArray = Array.of(jsonData.Estado_de_resultados[i]);
        let estadoR = {
          anio: this.jsonArray[0].Año,
          ingresos: this.jsonArray[0].Ingresos_de_actividades_ordinarios,
          costoVentas: this.jsonArray[0].Costo_de_ventas,
          margen: this.jsonArray[0].margen_bruto,
          otrosI: this.jsonArray[0].Otros_ingresos_por_función,
          gastosAdm: this.jsonArray[0].Gastos_de_administración,
          otrasGanancias: this.jsonArray[0].Otras_ganancias_perdidas,
          ingresosF: this.jsonArray[0].Ingresos_financieros,
          costosF: this.jsonArray[0].Costos_financieros,
          resultadoR: this.jsonArray[0].Resultado_por_unidad_de_reajuste,
        };

        this.resultadoEstado.push(estadoR);
      }

      //Recorer el JSON de la septima hoja y agrega al datasource

      for (let i = 0; i < jsonData.Ganancia_antes_del_impuesto.length; i++) {
        this.jsonArray = Array.of(jsonData.Ganancia_antes_del_impuesto[i]);
        var gananciaAntesImp = {
          anio: this.jsonArray[0].Año,
          gastoImp: this.jsonArray[0].Gasto_por_impuesto_a_las_ganancias,
          gastoDespImp: this.jsonArray[0].Ganancia_después_de_impuesto,
          totalRes: this.jsonArray[0].Total_resultados,
        };
        this.gananciaAntesImpuesto.push(gananciaAntesImp);
      }

      //Recorer el JSON de la octava hoja y agrega al datasource
      for (let i = 0; i < jsonData.Ganancia_atribuible_a.length; i++) {
        this.jsonArray = Array.of(jsonData.Ganancia_atribuible_a[i]);
        var gananciaAt = {
          anio: this.jsonArray[0].Año,
          gananciaControlador: this.jsonArray[0]
            .Ganancia_atribuible_al_controlador,
          gananciaNoControladora: this.jsonArray[0]
            .Ganancia_atribuible_participaciones_no_controladoras,
          ganancia: this.jsonArray[0].Ganancia,
        };
        this.gananciaAtribuible.push(gananciaAt);
      }

      //Recorer el JSON de la novena hoja y agrega al datasource
      console.log(jsonData.Estado_resultados_integrales);
      for (let i = 0; i < jsonData.Estado_resultados_integrales.length; i++) {
        this.jsonArray = Array.of(jsonData.Estado_resultados_integrales[i]);
        var estRInt = {
          anio: this.jsonArray[0].Año,
          ganancia: this.jsonArray[0].Ganancia,
          gananciaAct: this.jsonArray[0]
            .Ganancia_actuariales_por_planes_de_beneficios_actuariales,
          total: this.jsonArray[0]
            .Total_resultado_de_ingresos_y_gastos_integrales,
        };
        this.estadoResInt.push(estRInt);
      }

      this.dataSourceActivosC = new MatTableDataSource<ActivosC>(this.activosC);
      this.dataSourceActivosNC = new MatTableDataSource<ActivosNC>(
        this.activosNC
      );
      this.dataSourcePasivosC = new MatTableDataSource<PasivosC>(this.pasivosC);
      this.dataSourcePasivosNC = new MatTableDataSource<PasivosNC>(
        this.pasivosNC
      );
      this.dataSourcePatrimonio = new MatTableDataSource<Patrimonio>(
        this.patrimonio
      );
      console.log('Estado resultado antes de agregar a la tabla: ', this.resultadoEstado)
      this.dataSourceEstadoR = new MatTableDataSource<EstadoR>(this.resultadoEstado);
      this.dataSourceGananciaA = new MatTableDataSource<GananciaAntImp>(
        this.gananciaAntesImpuesto
      );
      this.dataSourceGananciaAtribuible = new MatTableDataSource<
        GananciaAtribuible
      >(this.gananciaAtribuible);
      this.dataSourceEstadoResInt = new MatTableDataSource<EstadoResIntegrales>(
        this.estadoResInt
      );
    };
    this.noData = false;
    this.isLoading = false;
    this.noDataMessage =false;

    reader.readAsBinaryString(file);
  }

  evaluateRegex(expresion:string):void{
    var regex =  /(^\$?([0-9]{1,3}.([0-9]{3}.)*[0-9]{3}|[0-9]+)(,[0-9][0-9])?$)|(^\$?([0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+)(.[0-9][0-9])?$)/;


    if(!regex.test(expresion))
    {
      console.log(expresion);
      console.log('No pasa la prueba no se sube !!',regex.test(expresion));
      this.test = false;
    }


  }

  saveDocument() {
    console.log('A guardar !');
    console.log("estado REs: ", this.resultadoEstado);
    console.log('Test: ',this.test)
    this.test = true;
    this.activosC.forEach(element => {
      this.evaluateRegex(element.activoImpC);
      this.evaluateRegex(element.activosF);
      this.evaluateRegex(element.cuentas);
      this.evaluateRegex(element.deudores);
      this.evaluateRegex(element.efectivo);
      this.evaluateRegex(element.otrosAc);
      this.evaluateRegex(element.total);

    });

    this.activosNC.forEach(element =>{
      this.evaluateRegex(element.activosD);
      this.evaluateRegex(element.activosI);
      this.evaluateRegex(element.otrosA);
      this.evaluateRegex(element.prop);
      this.evaluateRegex(element.totalA);
      this.evaluateRegex(element.totalNC);
    })

    this.pasivosC.forEach(element =>{
      this.evaluateRegex(element.cuentasC);
      this.evaluateRegex(element.cuentasR);
      this.evaluateRegex(element.otras);
      this.evaluateRegex(element.otrosP);
      this.evaluateRegex(element.pasivosAr);
      this.evaluateRegex(element.pasivosI);
      this.evaluateRegex(element.provisiones);
      this.evaluateRegex(element.totalPC);
    })

    this.pasivosNC.forEach(element => {
      this.evaluateRegex(element.otrosP);
      this.evaluateRegex(element.pasivosAr);
      this.evaluateRegex(element.provisionesB);
      this.evaluateRegex(element.total);
    })

    this.patrimonio.forEach(element => {
      this.evaluateRegex(element.aportes);
      this.evaluateRegex(element.participaciones);
      this.evaluateRegex(element.patrimonioContador);
      this.evaluateRegex(element.resultadosR);
      this.evaluateRegex(element.totalPNeto);
      this.evaluateRegex(element.totalPP);
    })

    this.resultadoEstado.forEach(element => {
      this.evaluateRegex(element.costoVentas);
      this.evaluateRegex(element.costosF);
      this.evaluateRegex(element.gastosAdm);
      this.evaluateRegex(element.ingresos);
      this.evaluateRegex(element.ingresosF);
      this.evaluateRegex(element.margen);
      this.evaluateRegex(element.otrasGanancias);
      this.evaluateRegex(element.otrosI);
      this.evaluateRegex(element.resultadoR);
    })

    this.gananciaAntesImpuesto.forEach(element => {
      this.evaluateRegex(element.gastoDespImp);
      this.evaluateRegex(element.gastoImp);
      this.evaluateRegex(element.totalRes);
    })

    this.gananciaAtribuible.forEach(element => {
      this.evaluateRegex(element.ganancia);
      this.evaluateRegex(element.gananciaControlador);
      this.evaluateRegex(element.gananciaNoControladora);
    })

    this.estadoResInt.forEach(element => {
      this.evaluateRegex(element.ganancia);
      this.evaluateRegex(element.gananciaAct);
      this.evaluateRegex(element.total);
    })

    if(this.test == true)
    {
      console.log()
      this.docSvc.SaveDocument(
        this.activosC,
        this.activosNC,
        this.pasivosC,
        this.pasivosNC,
        this.patrimonio,
        this.resultadoEstado,
        this.gananciaAntesImpuesto,
        this.gananciaAtribuible,
        this.estadoResInt,
        this.userId
      );
    }
    else{
      this.snackbar.open("Ocurrió un problema al guardar el archivo, revise que los datos estén ingresados correctamente",'',{
        duration: 3000,
        verticalPosition:'bottom'
      });
    }
  }



  getDocument(userId: any) {
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
    this.db.collection('EstadoFinanciero').doc(userId).get().subscribe((snapshotChanges) => {

      if (snapshotChanges.exists) {
        this.noDataMessage=false;

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
        this.noData = false;
        this.isLoading = false;
      }
      else{
        this.noDataMessage = true;
        this.noData=true;
        this.isLoading= false;
      }


    });


    //this.estadoFinanciero=this.docSvc.GetDocument(userId);


  }

}
