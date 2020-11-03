import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';

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
  public reajusteDisplayedColumns: string[] = [];
  public reajusteDataSource: MatTableDataSource<any>;
  public reajustes: any[] = [];

  public tramosDataSource: MatTableDataSource<any>;
  public tramos: any[] = [];
  public columnasTramos: string[] = ["inicio", "fin", "eliminar"];
  public columnasReajustes: string[] = ["Pos", "inicio", "fin", "año", "reajuste"];
  public columnasCategorias: string[] = ["Nombre", "Cantidad miembros", "sueldo base", "eliminar"];
  public columnasCategoriasTrabajadores: string[] = ["Nombre", "Cantidad miembros", "sueldo base", "eliminar"];

  public listaAños: any[] = [];

  public tramosGuardados: boolean;

  //categorías
  public categoriasAdminDataSource: MatTableDataSource<any>;
  public categoriasAdmin: any[] = [];
  //categorias trabajadores
  public categoriasTrabajadoresDataSource: MatTableDataSource<any>;
  public categoriasTrabajadores: any[] = [];

  //generación de la propuesta sindicato
  //Prpuesta Administrativo
  public propuestaGenerada: boolean = false;
  public columnasPropuestaAdminSindicato: string[] = ["Año","Nombre", "Cantidad miembros", "sueldo base","Reajuste", "Mes1", "IPC Marzo", "Mes2"];
  public propuestaAdminSindicatoDataSource: MatTableDataSource<any>;
  public propuestaAdminSindicato: any[] = [];

  //Propuesta trabajador
  public propuestaTGenerada: boolean = false;
  public columnasPropuestaTrabajadorSindicato: string[] = ["Año","Nombre", "Cantidad miembros", "sueldo base","Reajuste", "Mes1", "IPC Marzo", "Mes2"];
  public propuestaTrabajadorSindicatoDataSource: MatTableDataSource<any>;
  public propuestaTrabajadorSindicato: any[] = [];

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isLinear = true;

  //steppers
  public aniosIngresados: boolean;
  public ipcsCompletados: boolean;
  public paso2Completo: boolean = false;
  public paso3Completo: boolean = false;


  constructor(private dialog: MatDialog, private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  onAceptarDatos() {

    this.mostrarForms = true;
    this.ipcs = [];
    //Encontrar el año actual
    var fechaHoy = new Date(Date.now());
    var añoACtual = moment(fechaHoy).format("YYYY");
    var añoI = Number(añoACtual) + 1;
    this.listaAños = [];
    for (let i = 0; i < this.vigenciaFormControl.value; i++) {



      var ipc = {
        anio: añoI,
        proyeccion: 0
      }

      this.ipcs.push(ipc);
      this.listaAños.push(añoI);
      añoI++;
    }
    this.ipcDataSource = new MatTableDataSource<any>(this.ipcs);


    // inicializar la tabla de tramos
    this.mostrarReajustes = true;
    console.log("valores ipc: ", this.ipcs)
    this.tramos = [];

    var tramo = {
      nombre: "",
      inicio: 0,
      final: 0
    }

    this.tramos.push(tramo);
    this.tramosDataSource = new MatTableDataSource<any>(this.tramos);


    //Se llama a la funcion para crear y rellenar la tabla de categorias
    this.crearTablaCategoriasAdmin();
    this.crearTablaCategoriasTrabajadores();

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

  onAgregarTramo() {

    let tramo = {
      pos: 1,
      inicio: "",
      final: ""
    }



    this.tramos.push(tramo);
    this.tramosDataSource = new MatTableDataSource<any>(this.tramos);
  }
  deleteTramo(elm) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: '¿Está seguro que quiere quitar esta fila?',
        buttonText: {
          ok: 'Aceptar',
          cancel: 'Cancelar'
        }
      }
    });

    console.log("elemento: ", elm)
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        console.log("elemento a borrar: ", elm)
        this.tramosDataSource.data = this.tramosDataSource.data
          .filter(i => i !== elm)
          .map((i, idx) => (i.position = (idx + 1), i));
        const index: number = this.tramos.indexOf(elm);
        this.tramos.splice(index, 1);

      }
    });
  }

  onGuardarPaso2() {

    this.ipcsCompletados = true;
    this.tramosGuardados = true;


    this.reajustes = [];



    for (let i = 0; i < this.tramos.length; i++) {

      if (this.tramos.length == 0 || this.tramos[i].inicio == null || this.tramos[i].final == null || this.tramos[i].final == 0) {

        this.tramosGuardados = false;

      }

    }
    console.log("tramos guardados: ", this.tramosGuardados)
    if (this.tramosGuardados == true) {
      for (let i = 0; i < this.ipcs.length; i++) {
        console.log("proyeccion ipc: ", this.ipcs[i])
        if (this.ipcs[i].proyeccion <= 0) {

          this.ipcsCompletados = false;
        }

      }
      console.log("ipcs completados: ", this.ipcsCompletados)
      if (this.ipcsCompletados == true && this.tramosGuardados == true) {
        console.log("paso 2 completo")
        this.paso2Completo = true;
        for (let i = 0; i < this.listaAños.length; i++) {

          for (let j = 0; j < this.tramos.length; j++) {

            var reajuste = {
              pos: j + 1,
              inicio: this.tramos[j].inicio,
              final: this.tramos[j].final,
              anio: this.listaAños[i],
              reajuste: ""
            }
            this.reajustes.push(reajuste);

          }
        }
        console.log("reajuste tabla: ", this.reajustes)
        this.reajusteDataSource = new MatTableDataSource<any>(this.reajustes);
      }
      else {
        this.paso2Completo = false;
      }


    }

  }

  deleteCategoriasAdmin(elm) {

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: '¿Está seguro que quiere quitar esta fila?',
        buttonText: {
          ok: 'Aceptar',
          cancel: 'Cancelar'
        }
      }
    });

    console.log("elemento: ", elm)
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        console.log("elemento a borrar: ", elm)
        this.categoriasAdminDataSource.data = this.categoriasAdminDataSource.data
          .filter(i => i !== elm)
          .map((i, idx) => (i.position = (idx + 1), i));
        const index: number = this.categoriasAdmin.indexOf(elm);
        this.categoriasAdmin.splice(index, 1);

      }
    });

  }

  crearTablaCategoriasAdmin() {
    this.categoriasAdmin = [];

    var categoria = {
      nombre: "",
      cantidadMiembros: 0,
      sueldoBase: 0
    }

    this.categoriasAdmin.push(categoria);

    this.categoriasAdminDataSource = new MatTableDataSource<any>(this.categoriasAdmin);

  }

  onAgregarCategoriaAdmin() {

    var categoria = {
      nombre: "",
      cantidadMiembros: 0,
      sueldoBase: 0
    }

    this.categoriasAdmin.push(categoria);

    this.categoriasAdminDataSource = new MatTableDataSource<any>(this.categoriasAdmin);

  

  }



  //categorias para trabajadores

  deleteCategoriasTrabajadores(elm) {

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: '¿Está seguro que quiere quitar esta fila?',
        buttonText: {
          ok: 'Aceptar',
          cancel: 'Cancelar'
        }
      }
    });

    console.log("elemento: ", elm)
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        console.log("elemento a borrar: ", elm)
        this.categoriasTrabajadoresDataSource.data = this.categoriasTrabajadoresDataSource.data
          .filter(i => i !== elm)
          .map((i, idx) => (i.position = (idx + 1), i));
        const index: number = this.categoriasTrabajadores.indexOf(elm);
        this.categoriasTrabajadores.splice(index, 1);

      }
    });

  }

  crearTablaCategoriasTrabajadores() {
    this.categoriasTrabajadores = [];

    var categoria = {
      nombre: "",
      cantidadMiembros: 0,
      sueldoBase: 0
    }

    this.categoriasTrabajadores.push(categoria);

    this.categoriasTrabajadoresDataSource = new MatTableDataSource<any>(this.categoriasTrabajadores);

  }

  onAgregarCategoriaTrabajadores() {

    var categoria = {
      nombre: "",
      cantidadMiembros: 0,
      sueldoBase: 0
    }

    this.categoriasTrabajadores.push(categoria);
    console.log("categorias trabajadores: ", this.categoriasTrabajadores)

    this.categoriasTrabajadoresDataSource = new MatTableDataSource<any>(this.categoriasTrabajadores);

  }


  generarPropuestaSindicato() {
    this.propuestaGenerada = true;
    this.paso3Completo = true;
    this.crearTablaPropuestaAdminSindicato();
    this.crearTablaPropuestaTrabajadoresSindicato();

  }

  crearTablaPropuestaAdminSindicato() {
    console.log("creando tabla propuesta")
    this.propuestaAdminSindicato = [];
    for (let i = 0; i < this.categoriasAdmin.length; i++) {
      for (let j = 0; j < this.listaAños.length; j++) {

        var propuesta = {
          nombre: this.categoriasAdmin[i].nombre,
          cantidadMiembros: this.categoriasAdmin[i].cantidadMiembros,
          sueldoBase: this.categoriasAdmin[i].sueldoBase,
          anio: this.listaAños[j],
          reajuste: 0,
          mes1: 0,
          ipcMarzo: 0,
          mes2: 0
        }
        this.propuestaAdminSindicato.push(propuesta);
        this.propuestaAdminSindicato.sort((a,b)=> (a.anio > b.anio) ?1:-1);
        console.log("propuesta ordenada: ",this.propuestaAdminSindicato)

      }

    }




    console.log("lista propuestas: ", this.propuestaAdminSindicato)
    this.propuestaAdminSindicatoDataSource = new MatTableDataSource<any>(this.propuestaAdminSindicato);
  }

  //Crear la tabla de la propuesta de los trabajadores por el sindicato
  crearTablaPropuestaTrabajadoresSindicato() {
    console.log("creando tabla propuesta")
    this.propuestaTrabajadorSindicato = [];
    for (let i = 0; i < this.categoriasTrabajadores.length; i++) {
      for (let j = 0; j < this.listaAños.length; j++) {

        var propuesta = {
          nombre: this.categoriasTrabajadores[i].nombre,
          cantidadMiembros: this.categoriasTrabajadores[i].cantidadMiembros,
          sueldoBase: this.categoriasTrabajadores[i].sueldoBase,
          anio: this.listaAños[j],
          reajuste: 0,
          mes1: 0,
          ipcMarzo: 0,
          mes2: 0
        }
        this.propuestaTrabajadorSindicato.push(propuesta);
        this.propuestaTrabajadorSindicato.sort((a,b)=> (a.anio > b.anio) ?1:-1);
        console.log("propuesta ordenada: ",this.propuestaTrabajadorSindicato)

      }

    }




    console.log("lista propuestas: ", this.propuestaTrabajadorSindicato)
    this.propuestaTrabajadorSindicatoDataSource = new MatTableDataSource<any>(this.propuestaTrabajadorSindicato);
  }

}
