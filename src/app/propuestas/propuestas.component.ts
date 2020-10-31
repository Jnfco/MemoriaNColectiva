import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';

@Component({
  selector: 'app-propuestas',
  templateUrl: './propuestas.component.html',
  styleUrls: ['./propuestas.component.css']
})
export class PropuestasComponent implements OnInit {

  administrativoFormControl = new FormControl('', [Validators.required]);
  vigenciaFormControl = new FormControl('', [Validators.required]);
  trabajadorFormControl = new FormControl('', [Validators.required]);

  //displayedColumns: string[] = [];
  //dataSource: MatTableDataSource<any>;

  //public columnDefinitions:any [] = [];
  public mostrarForms: boolean;
  public mostrarReajustes: boolean;
  //public listaValoresIPC:any[] =[];

  public ipcs: any[] = [];
  public columnasIPC: string[] = ["Año", "IPCProyectado"];
  public reajusteColumns: any[] = [];
  public ipcDataSource: MatTableDataSource<any>;
  public reajusteDisplayedColumns:string[]=[];
  public reajusteDataSource: MatTableDataSource<any>;
  public reajustes:any[]=[];

  public tramosDataSource: MatTableDataSource<any>;
  public tramos:any[]=[];
  public columnasTramos: string[]=["Nombre","inicio","fin"]

  constructor() { }

  ngOnInit(): void {
  }

  onAceptarDatos() {
    this.mostrarForms = true;
    this.ipcs = [];
    //Encontrar el año actual
    var fechaHoy = new Date(Date.now());
    var añoACtual = moment(fechaHoy).format("YYYY");
    var añoI = Number(añoACtual) + 1;

    for (let i = 0; i < this.vigenciaFormControl.value; i++) {



      var ipc = {
        anio: añoI,
        proyeccion: 0
      }

      this.ipcs.push(ipc);

      añoI++;
    }
    this.ipcDataSource = new MatTableDataSource<any>(this.ipcs);

    //primero inicializar los arreglos
    //this.displayedColumns = [];
    //this.columnDefinitions = [];
    //this.listaValoresIPC =[];

    //ahora se llenan los valores por defecto
    /*
    if (this.mostrarForms == true) {
      console.log("es true ")
      var año = 2020;
      for (let i = 0; i < this.vigenciaFormControl.value; i++) {
        this.displayedColumns.push(año.toString());
        this.columnDefinitions.push({
          matColumnDef: año.toString(),
          columnHeaderName: año.toString(),
          value: 4
        })
        año++;
        var valoresIPC = {
          valor: 4
        }
        this.listaValoresIPC.push(valoresIPC);
      }
      this.dataSource = new MatTableDataSource<any>(this.listaValoresIPC);
    }*/

  }
  onSiguienteIPC() {
    this.mostrarReajustes = true;
    /*
    for (let i = 0; i < this.ipcs.length; i++) {

      var columnas = {
        columnName: this.ipcs[i].anio.toString()
      }
      this.reajusteDisplayedColumns.push(this.ipcs[i].anio.toString())
      this.reajusteColumns.push(columnas);
      this.reajustes.push(this.ipcs[i].anio.toString());
      this.reajusteDataSource = new MatTableDataSource<any>(this.reajustes)

    }
    console.log("reajuste displayed clumns: ",this.reajusteDisplayedColumns);
    console.log("reajuste columns: ",this.reajusteColumns)
    */



  }
}
