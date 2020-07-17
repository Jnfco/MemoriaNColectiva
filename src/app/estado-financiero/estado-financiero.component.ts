import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  Output,
} from '@angular/core';
import * as XLSX from 'xlsx';
import { MatTableDataSource } from '@angular/material/table';
import { ActivosC, GananciaAtribuible, EstadoResIntegrales } from '../shared/Interfaces/TablasI';
import { ActivosNC } from '../shared/Interfaces/TablasI';
import { PasivosC } from '../shared/Interfaces/TablasI';
import { PasivosNC } from '../shared/Interfaces/TablasI';
import {Patrimonio} from '../shared/Interfaces/TablasI';
import {EstadoR} from '../shared/Interfaces/TablasI';
import {GananciaAntImp} from '../shared/Interfaces/TablasI';

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
  tablaPasivosC: string[]= [
    'Año',
    'pasivos arrendamientos',
    'otros pasivos',
    'cuentas comerciales',
    'cuentas relacionadas',
    'otras provisiones',
    'pasivos impuestos corrientes',
    'provisiones',
    'total pasivos corrientes'
  ];
  tablaPasivosNC: string[] =[
    'Año',
    'pasivos arrendamientos',
    'otras provisiones',
    'provisiones beneficios',
    'total pasivos no corrientes'
  ]
  tablaPatrimonio: string [] = [
    'Año',
    'aportes',
    'resultados retenidos',
    'patrimonio contador',
    'participaciones',
    'total patrimonio neto',
    'total pasivos y patrimonio'
  ]

  tablaEstadoResultados: string [] = [
    'Año',
    'ingresos',
    'costo ventas',
    'margen',
    'otros ingresos',
    'gastos admin',
    'otras ganancias',
    'ingresos financieros',
    'costos financieros',
    'resultado reajuste'
  ]
  tablaGananciaAntesImpuestos: string [] = [
    'Año',
    'gastoImp',
    'gananciaDespImp',
    'totalRes'
  ]
  tablaGananciaAtribuibleA: string [] = [
    'Año',
    'gananciaControlador',
    'gananciaNoControl',
    'ganancia'
  ]
  tablaEstadoResultadosIntegrales: string [] =[
    'Año',
    'ganancia',
    'gananciaActuariales',
    'totalResIntegrales'
  ]

  // Listas de interfaces para cada tabla
  activosC: ActivosC[];
  activosNC: ActivosNC[];
  pasivosC: PasivosC[];
  pasivosNC:PasivosNC[];
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
  dataSourceGananciaAtribuible:any;
  dataSourceEstadoResInt:any;

  importFile: File;
  storeData: any;
  csvData: any;
  jsonData: any;
  textData: any;
  worksheet: any;
  arrData: any;
  jsonArray: any[];
  noData: boolean = true;
  jsonSinTransformar: any;

  constructor() {}

  ngOnInit(): void {}

  uploadedFile(ev: any) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      this.activosC = [];
      this.activosNC = [];
      this.pasivosC = [];
      this.pasivosNC = [];
      this.patrimonio = [];
      this.estadoRes = [];
      this.resultadoEstado = [];
      this.gananciaAntesImpuesto= [];
      this.gananciaAtribuible = [];
      this.estadoResInt = [];
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      this.jsonSinTransformar = JSON.stringify(jsonData.Activos_no_corrientes);
      //console.log('Data: ',dataString);

      //console.log("Cantidad filas: ",jsonData.Activos_corrientes.length);

      //Recorre el JSON de la primera hoja y agrega las tablas al datasource
      //console.log("Data: ",this.jsonSinTransformar)
      for (let i = 0; i < jsonData.Activos_corrientes.length; i++) {
        this.jsonArray = Array.of(jsonData.Activos_corrientes[i]);

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
          cuentasC: this.jsonArray[0].Cuentas_por_pagar_comerciales_y_otras_cuentas_por_pagar,
          cuentasR: this.jsonArray[0].Cuentas_por_pagar_a_partes_relacionadas,
          otras: this.jsonArray[0].Otras_provisiones,
          pasivosI: this.jsonArray[0].Pasivos_por_impuestos_corrientes,
          provisiones: this.jsonArray[0].Provisiones_por_beneficios_a_los_empleados,
          totalPC: this.jsonArray[0].Total_pasivos_Corrientes
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
          provisionesB: this.jsonArray[0].Provisiones_por_beneficios_a_los_empleados,
          total: this.jsonArray[0].Provisiones_por_beneficios_a_los_empleados

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
          patrimonioContador: this.jsonArray[0].Patrimono_atribuible_al_controlador,
          participaciones: this.jsonArray[0].Participaciones_no_controladoras,
          totalPNeto: this.jsonArray[0].Total_patrimonio_neto,
          totalPP: this.jsonArray[0].Total_pasivos_y_patrimonio
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
          resultadoR: this.jsonArray[0].Resultado_por_unidad_de_reajuste
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
          totalRes: this.jsonArray[0].Total_resultados
        };
        this.gananciaAntesImpuesto.push(gananciaAntesImp);
      }


       //Recorer el JSON de la octava hoja y agrega al datasource
       for (let i = 0; i < jsonData.Ganancia_atribuible_a.length; i++) {
        this.jsonArray = Array.of(jsonData.Ganancia_atribuible_a[i]);
        var gananciaAt = {
          anio: this.jsonArray[0].Año,
          gastoImp: this.jsonArray[0].Ganancia_atribuible_al_controlador,
          gastoDespImp: this.jsonArray[0].Ganancia_atribuible_participaciones_no_controladoras,
          totalRes: this.jsonArray[0].Ganancia
        };
        this.gananciaAtribuible.push(gananciaAt);
      }

      //Recorer el JSON de la novena hoja y agrega al datasource
      for (let i = 0; i < jsonData.Estado_resultados_integrales.length; i++) {
        this.jsonArray = Array.of(jsonData.Estado_resultados_integrales[i]);
        var estRInt = {
          anio: this.jsonArray[0].Año,
          ganancia: this.jsonArray[0].Ganancia,
          gananciaAct: this.jsonArray[0].Ganancia_actuariales_por_planes_de_beneficios_actuariales,
          total: this.jsonArray[0].Total_resultado_de_ingresos_y_gastos_integrales,
        };
        this.estadoResInt.push(estRInt);

      }

      this.dataSourceActivosC = new MatTableDataSource<ActivosC>(this.activosC);
      this.dataSourceActivosNC = new MatTableDataSource<ActivosNC>(this.activosNC);
      this.dataSourcePasivosC = new MatTableDataSource<PasivosC>(this.pasivosC);
      this.dataSourcePasivosNC = new MatTableDataSource<PasivosNC>(this.pasivosNC);
      this.dataSourcePatrimonio = new MatTableDataSource<Patrimonio>(this.patrimonio);
      this.dataSourceEstadoR = new MatTableDataSource<EstadoR>(this.resultadoEstado);
      this.dataSourceGananciaA = new MatTableDataSource<GananciaAntImp>(this.gananciaAntesImpuesto);
      this.dataSourceGananciaAtribuible = new MatTableDataSource<GananciaAtribuible>(this.gananciaAtribuible);
      this.dataSourceEstadoResInt = new MatTableDataSource<EstadoResIntegrales>(this.estadoResInt);
    };
    this.noData = false;

    reader.readAsBinaryString(file);
  }
}
