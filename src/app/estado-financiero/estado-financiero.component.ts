import { Component, ElementRef, ViewChild, OnInit, Output } from '@angular/core';
import * as XLSX from 'xlsx';
import { MatTableDataSource } from '@angular/material/table';
import {ActivosC} from './ActivosC';
import {ActivosNC} from './ActivosNC';



@Component({
  selector: 'app-estado-financiero',
  templateUrl: './estado-financiero.component.html',
  styleUrls: ['./estado-financiero.component.css']
})
export class EstadoFinancieroComponent implements OnInit {



  data: [][];
  @ViewChild('tabla',{static: false}) tabla: ElementRef;


  //Nombres para las columnas de las tablas en angular material
  displayedColumns: string[] = ['Año','Efectivo y equivalentes al efectivo','Activos financieros','Otros activos no financieros','Deudores educacionales y otras cuentas por cobrar, netos','Cuentas por cobrar a partes relacionadas','Activo por impuestos corrientes','Total activos corrientes'];
  tablaActivosNC: string[] = ['Año','otros activos','activos intangibles','propiedades','activos por derecho','total no corrientes','total']

  // Listas de interfaces para cada tabla
  activosC: ActivosC[];
  activosNC: ActivosNC[];


  importFile: File;
  storeData: any;
  csvData: any;
  jsonData: any;
  textData: any;
  worksheet: any;
  arrData: any;
  jsonArray: any[];
  noData: boolean = true;
  dataSourceActivosC : any;
  dataSourceActivosNC: any;
  jsonSinTransformar: any;

  constructor() { }

  ngOnInit(): void {

  }

  uploadedFile(ev: any) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      this.activosC =[];
      this.activosNC = [];
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
      console.log("Arreglo1: ",jsonData.Activos_corrientes)
      for (let i = 0; i < jsonData.Activos_corrientes.length; i++) {
        this.jsonArray = Array.of(jsonData.Activos_corrientes[i]);

        let activosCorrientes =
        {
          anio:this.jsonArray[0].Año,
          efectivo:this.jsonArray[0].Efectivo_y_equivalentes_al_efectivo,
          activosF: this.jsonArray[0].Activos_financieros,
          otrosAc: this.jsonArray[0].Otros_activos_no_financieros,
          deudores: this.jsonArray[0].Deudores_educacionales_y_otras_cuentas_por_cobrar_netos,
          cuentas: this.jsonArray[0].Cuentas_por_cobrar_a_partes_relacionadas,
          activoImpC: this.jsonArray[0].Activo_por_impuestos_corrientes,
          total:this.jsonArray[0].Total_activos_corrientes

        }
        //console.log('Arreglo 1: ',activosCorrientes)
        this.activosC.push(activosCorrientes);

      }

      //Recorre el JSON de la segunda hoja y agrega las tablas al datasource
      console.log('Arreglo 2 ', jsonData.Activos_no_corrientes)
      for (let i = 0; i < jsonData.Activos_no_corrientes.length; i++) {
        this.jsonArray = Array.of(jsonData.Activos_no_corrientes[i]);
        console.log("Activos no corrientes: ",i," :",this.jsonArray[0].Otros_activos_financieros_no_corrientes)
        var acs =
        {
          anio:this.jsonArray[0].Año,
          otrosA:this.jsonArray[0].Otros_activos_financieros_no_corrientes,
          activosI: this.jsonArray[0].Activos_intangibles_netos,
          prop: this.jsonArray[0].Propiedades_planta_y_equipos_neto,
          activosD: this.jsonArray[0].Activos_por_derecho_de_uso,
          totalNC: this.jsonArray[0].Total_activos_no_corrientes,
          totalA:this.jsonArray[0].Total_Activos


        }
        console.log('Arreglo 2: '+acs[0])
        this.activosNC.push(acs)

      }

    this.dataSourceActivosC= new MatTableDataSource<ActivosC>(this.activosC);
    this.dataSourceActivosNC = new MatTableDataSource<ActivosNC>(this.activosNC);

    }
    this.noData= false;

    reader.readAsBinaryString(file);


  }


}
