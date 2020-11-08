import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { datoPropuesta } from '../shared/Interfaces/Propuesta';
import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { PropuestaService } from '../services/propuesta.service';
import { snapshotChanges } from '@angular/fire/database';
import { MatTabChangeEvent } from '@angular/material/tabs';


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

  public singleTramoAdminSindicatoSelected: boolean;
  public singleTramoTrabajadoresSindicatoSelected: boolean;

  //Tramos administrativos sindicato
  public tramosAdminSindicatoList: any[] = [{ opcion: "Un tramo" }, { opcion: "Más de un tramo" }];
  public tramoAdminSelected: string;
  public tramosAdminSindicatoDataSource: MatTableDataSource<any>;
  public tramosAdminSindicato: any[] = [];
  public columnasTramosAdminSindicato: string[] = ["inicio", "fin", "eliminar"];
  public tramosAdminSindicatoGuardados: boolean;

  //Tramos trabajadores sindicato
  public tramosTrabajadoresSindicatoList: any[] = [{ opcion: "Un tramo" }, { opcion: "Más de un tramo" }];
  public tramoTrabajadoresSindicatoSelected: string;
  public tramosTrabajadoresSindicatoDataSource: MatTableDataSource<any>;
  public tramosTrabajadoresSindicato: any[] = [];
  public columnasTramosTrabajadoresSindicato: string[] = ["inicio", "fin", "eliminar"];
  public tramosTrabajadoresSindicatoGuardados: boolean;


  public columnasReajustes: string[] = ["Pos", "inicio", "fin", "año", "reajuste"];
  public columnasReajustesSingle: string[] = ["año", "reajuste"];

  //Reajustes administrativos sindicato
  public reajusteAdminSindicatoDataSource: MatTableDataSource<any>;
  public reajustesAdminSindicato: any[] = [];

  public reajustesAdminSindicatoSingleDataSource: MatTableDataSource<any>;
  public reajustesAdminSindicatoSingle: any[] = [];

  //Reajustes trabajadores sindicato
  public reajusteTrabajadoresSindicatoDataSource: MatTableDataSource<any>;
  public reajustesTrabajadoresSindicato: any[] = [];
  public reajustesTrabajadoresSindicatoSingleDataSource: MatTableDataSource<any>;
  public reajustesTrabajadoresSindicatoSingle: any[] = [];

  public columnasCategorias: string[] = ["Nombre", "Cantidad miembros", "sueldo base", "eliminar"];
  public columnasCategoriasTrabajadores: string[] = ["Nombre", "Cantidad miembros", "sueldo base", "eliminar"];

  public listaAños: any[] = [];



  //categorías
  public categoriasAdminDataSource: MatTableDataSource<any>;
  public categoriasAdmin: any[] = [];
  //categorias trabajadores
  public categoriasTrabajadoresDataSource: MatTableDataSource<any>;
  public categoriasTrabajadores: any[] = [];

  //generación de la propuesta sindicato
  //Prpuesta Administrativo
  public propuestaGenerada: boolean = false;
  public columnasPropuestaAdminSindicato: string[] = ["Año", "Nombre", "sueldo base", "Reajuste", "Mes1", "IPC Marzo", "Mes2"];
  public propuestaAdminSindicatoDataSource: MatTableDataSource<any>;
  public propuestaAdminSindicato: any[] = [];

  //Propuesta trabajador
  public propuestaTGenerada: boolean = false;
  public columnasPropuestaTrabajadorSindicato: string[] = ["Año", "Nombre", "sueldo base", "Reajuste", "Mes1", "IPC Marzo", "Mes2"];
  public propuestaTrabajadorSindicatoDataSource: MatTableDataSource<any>;
  public propuestaTrabajadorSindicato: any[] = [];

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isLinear = true;

  //steppers
  public aniosIngresados: boolean;
  public ipcsCompletados: boolean;
  public paso2Completo: boolean = false;
  public paso2CompletoCompleto: boolean = false;
  public paso3Completo: boolean = false;

  //Atributos para obtener el id del sindicato del usuario conectado
  public userId: any;
  public idSindicato: string;


  //Resumen y comparativa de las propuestas

  //Propuesta de sindicato

  public resumenPropuestaAdminSindicatoDataSource: MatTableDataSource<any>;
  public resumenPropuestaTrabajadoresSindicatoDataSource: MatTableDataSource<any>;
  public columnasPropuestaSindicato: string[] = ["Categoria", "cantMiembros", "Año", "Sueldo"];

  //Elementos para el resumen de sindicato

  public resumenPropuestaAdminSindicato: any[];
  public resumenPropuestaTrabajadoresSindicato: any[];

  //elementos para la comparativa de parte del sindicato

  public comparativaAdminSindicato: any[];
  public comparativaTrabajadoresSindicato: any[];
  //Mat data tables 
  public comparativaAdminSindicatoDataSource: MatTableDataSource<any>;
  public comparativaTrabajadoresSindicatoDataSource: MatTableDataSource<any>;

  //Columnas tabla comparativa
  public columnasComparativaSindicato: string[] = ["Año", "Categoria", "Incremento"];
  public listaDeCategoriasAdmin: string[] = [];
  public listaDeCategoriasTrab: string[] = [];
  public listaDeAños: string[] = [];


  constructor(private dialog: MatDialog, private _formBuilder: FormBuilder, public db: AngularFirestore, private propSvc: PropuestaService) { }

  ngOnInit(): void {
    this.userId = firebase.auth().currentUser.uid;
    this.getIdSindicato();
    setTimeout(() => {
      this.generarResumen();
    }, 1000)

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

    this.mostrarReajustes = true;
    // inicializar la tabla de tramos administrativos sindicato

    console.log("valores ipc: ", this.ipcs)
    this.tramosAdminSindicato = [];

    var tramo = {
      nombre: "",
      inicio: 0,
      final: 0
    }

    this.tramosAdminSindicato.push(tramo);
    this.tramosAdminSindicatoDataSource = new MatTableDataSource<any>(this.tramosAdminSindicato);

    // inicializar la tabla de tramos Trabajadores sindicato
    this.tramosTrabajadoresSindicato = [];

    var tramo = {
      nombre: "",
      inicio: 0,
      final: 0
    }

    this.tramosTrabajadoresSindicato.push(tramo);
    this.tramosTrabajadoresSindicatoDataSource = new MatTableDataSource<any>(this.tramosTrabajadoresSindicato);




    //Se llama a la funcion para crear y rellenar la tabla de categorias
    this.crearTablaCategoriasAdmin();
    this.crearTablaCategoriasTrabajadores();



  }
  onSiguienteIPC() {




  }

  /**
   * Funcion para agregar una columna a la tabla tramos de administrativos desde sindicato
   */
  onAgregarTramoAdminSindicato() {

    let tramo = {
      pos: 1,
      inicio: "",
      final: ""
    }



    this.tramosAdminSindicato.push(tramo);
    this.tramosAdminSindicatoDataSource = new MatTableDataSource<any>(this.tramosAdminSindicato);
  }

  selectTramoAdminSindicato() {


    if (this.tramoAdminSelected == "Un tramo") {

      this.singleTramoAdminSindicatoSelected = true;


    }
    else {
      this.singleTramoAdminSindicatoSelected = false;
    }


  }

  selectTramoTrabajadoresSindicato() {


    if (this.tramoTrabajadoresSindicatoSelected == "Un tramo") {

      this.singleTramoTrabajadoresSindicatoSelected = true;


    }
    else {
      this.singleTramoTrabajadoresSindicatoSelected = false;
    }


  }

  /**
   * Funcion para agregar una columna a la tabla tramos de trabajadores desde sindicato
   */
  onAgregarTramoTrabajadoresSindicato() {

    let tramo = {
      pos: 1,
      inicio: "",
      final: ""
    }



    this.tramosTrabajadoresSindicato.push(tramo);
    this.tramosTrabajadoresSindicatoDataSource = new MatTableDataSource<any>(this.tramosTrabajadoresSindicato);
  }

  /**
   * Funcion para eliminar una columna de la tabla de tramos de administrativo desde sindicato
   * @param elm 
   */
  deleteTramoAdminSindicato(elm) {
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
        this.tramosAdminSindicatoDataSource.data = this.tramosAdminSindicatoDataSource.data
          .filter(i => i !== elm)
          .map((i, idx) => (i.position = (idx + 1), i));
        const index: number = this.tramosAdminSindicato.indexOf(elm);
        this.tramosAdminSindicato.splice(index, 1);

      }
    });
  }

  /**
   * Funcion para eliminar una columna de la tabla de tramos de trabajadores desde sindicato
   * @param elm 
   */
  deleteTramoTrabajadoresSindicato(elm) {
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
        this.tramosTrabajadoresSindicatoDataSource.data = this.tramosTrabajadoresSindicatoDataSource.data
          .filter(i => i !== elm)
          .map((i, idx) => (i.position = (idx + 1), i));
        const index: number = this.tramosTrabajadoresSindicato.indexOf(elm);
        this.tramosTrabajadoresSindicato.splice(index, 1);

      }
    });
  }


  /**
   * Funcion para guardar el estado del segundo paso en el calculo de propuestas, se comprueba que los campos de ipc y tramos estén escritos correctamente y validados
   */
  onGuardarPaso2() {

    this.ipcsCompletados = true;

    this.tramosAdminSindicatoGuardados = true;
    this.tramosTrabajadoresSindicatoGuardados = true;

    //inicializacion de arreglos de reajustes sindicato
    this.reajustesAdminSindicato = [];
    this.reajustesTrabajadoresSindicato = [];
    this.reajustesAdminSindicatoSingle = [];
    this.reajustesTrabajadoresSindicatoSingle = [];

    //Validación para tramos de los administrativos

    for (let i = 0; i < this.tramosAdminSindicato.length; i++) {

      if (this.tramosAdminSindicato.length == 0 || this.tramosAdminSindicato[i].inicio == null || this.tramosAdminSindicato[i].final == null || this.tramosAdminSindicato[i].final == 0) {

        this.tramosAdminSindicatoGuardados = false;

      }

    }
    console.log("single tramo admin sindicato selected:", this.singleTramoAdminSindicatoSelected)
    if (this.singleTramoAdminSindicatoSelected == true) {

      this.tramosAdminSindicatoGuardados = true;

    }


    console.log("tramos guardados: ", this.tramosAdminSindicatoGuardados)
    if (this.tramosAdminSindicatoGuardados == true) {
      for (let i = 0; i < this.ipcs.length; i++) {
        console.log("proyeccion ipc: ", this.ipcs[i])
        if (this.ipcs[i].proyeccion <= 0) {

          this.ipcsCompletados = false;
        }

      }
      console.log("ipcs completados: ", this.ipcsCompletados)
      if (this.ipcsCompletados == true && this.tramosAdminSindicatoGuardados == true) {
        console.log("paso 2 completo")
        this.paso2Completo = true;

        if (this.singleTramoAdminSindicatoSelected == true) {

          for (let i = 0; i < this.listaAños.length; i++) {

            var reajusteSingle = {
              anio: this.listaAños[i],
              reajuste: ""
            }
            this.reajustesAdminSindicatoSingle.push(reajusteSingle);

          }
          this.reajustesAdminSindicatoSingleDataSource = new MatTableDataSource<any>(this.reajustesAdminSindicatoSingle);

        }
        else {
          //Se crea el arreglo para la tabla de reajustes administrativos del sindicato
          for (let i = 0; i < this.listaAños.length; i++) {

            for (let j = 0; j < this.tramosAdminSindicato.length; j++) {

              var reajuste = {
                pos: j + 1,
                inicio: this.tramosAdminSindicato[j].inicio,
                final: this.tramosAdminSindicato[j].final,
                anio: this.listaAños[i],
                reajuste: ""
              }
              this.reajustesAdminSindicato.push(reajuste);

            }
          }
          console.log("reajuste tabla: ", this.reajustesAdminSindicato)
          this.reajusteAdminSindicatoDataSource = new MatTableDataSource<any>(this.reajustesAdminSindicato);
        }


      }
      else {
        this.paso2Completo = false;
      }


    }


    //validacion para tramos de trabajadores desde sindicato 
    if (this.paso2Completo == true) {
      for (let i = 0; i < this.tramosTrabajadoresSindicato.length; i++) {

        if (this.tramosTrabajadoresSindicato.length == 0 || this.tramosTrabajadoresSindicato[i].inicio == null || this.tramosTrabajadoresSindicato[i].final == null || this.tramosTrabajadoresSindicato[i].final == 0) {

          this.tramosTrabajadoresSindicatoGuardados = false;

        }

      }
      if (this.singleTramoTrabajadoresSindicatoSelected == true) {
        this.tramosTrabajadoresSindicatoGuardados = true;

      }
      console.log("tramos guardados: ", this.tramosTrabajadoresSindicatoGuardados)
      if (this.tramosTrabajadoresSindicatoGuardados == true) {

        console.log("paso 2 completo")
        this.paso2CompletoCompleto = true;

        if (this.singleTramoTrabajadoresSindicatoSelected) {

          for (let i = 0; i < this.listaAños.length; i++) {

            var reajusteSingle = {
              anio: this.listaAños[i],
              reajuste: ""
            }
            this.reajustesTrabajadoresSindicatoSingle.push(reajusteSingle);

          }
          this.reajustesTrabajadoresSindicatoSingleDataSource = new MatTableDataSource<any>(this.reajustesTrabajadoresSindicatoSingle);


        }
        else {

          //se crean los reajustes para los trabajadores desde sindicato
          for (let i = 0; i < this.listaAños.length; i++) {

            for (let j = 0; j < this.tramosTrabajadoresSindicato.length; j++) {

              var reajuste = {
                pos: j + 1,
                inicio: this.tramosTrabajadoresSindicato[j].inicio,
                final: this.tramosTrabajadoresSindicato[j].final,
                anio: this.listaAños[i],
                reajuste: ""
              }
              this.reajustesTrabajadoresSindicato.push(reajuste);

            }
          }
          console.log("reajuste tabla: ", this.reajustesTrabajadoresSindicato)
          this.reajusteTrabajadoresSindicatoDataSource = new MatTableDataSource<any>(this.reajustesTrabajadoresSindicato);

        }

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

  /**
   * Funcion para crear la tabla que se genera al procesar los datos de la propuesta para administrativos de sindicato
   */
  crearTablaPropuestaAdminSindicato() {
    console.log("creando tabla propuesta")
    this.propuestaAdminSindicato = [];
    for (let i = 0; i < this.categoriasAdmin.length; i++) {
      for (let j = 0; j < this.listaAños.length; j++) {

        var propuesta = {
          pos: i + 1,
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
        this.propuestaAdminSindicato.sort((a, b) => (a.anio > b.anio) ? 1 : -1);
        console.log("propuesta ordenada: ", this.propuestaAdminSindicato)

      }

    }

    //Llamado a las funciones para el calculo de los datos de la propuesta
    console.log("single tramo admin sindicato selected: ", this.singleTramoAdminSindicatoSelected)
    if (this.singleTramoAdminSindicatoSelected == true) {
      console.log("entrando en calculo...");
      this.calculoReajusteSimple(this.propuestaAdminSindicato, this.reajustesAdminSindicatoSingle);
    }
    else {
      this.calculoReajusteAño(this.propuestaAdminSindicato, this.reajustesAdminSindicato);
    }

    this.calculoMes1(this.propuestaAdminSindicato);
    this.calculoIPCMarzo(this.propuestaAdminSindicato, this.ipcs);
    this.calculoMes2(this.propuestaAdminSindicato);


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
          pos: i + 1,
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
        this.propuestaTrabajadorSindicato.sort((a, b) => (a.anio > b.anio) ? 1 : -1);
        console.log("propuesta ordenada: ", this.propuestaTrabajadorSindicato)

      }

    }

    console.log("single tramo trabajadores sindicato selected: ", this.singleTramoTrabajadoresSindicatoSelected)

    if (this.singleTramoTrabajadoresSindicatoSelected == true) {

      this.calculoReajusteSimple(this.propuestaTrabajadorSindicato, this.reajustesTrabajadoresSindicatoSingle);
    }
    else {
      this.calculoReajusteAño(this.propuestaTrabajadorSindicato, this.reajustesTrabajadoresSindicato);
    }


    this.calculoMes1(this.propuestaTrabajadorSindicato)
    this.calculoIPCMarzo(this.propuestaTrabajadorSindicato, this.ipcs);
    this.calculoMes2(this.propuestaTrabajadorSindicato);

    console.log("lista propuestas: ", this.propuestaTrabajadorSindicato)
    this.propuestaTrabajadorSindicatoDataSource = new MatTableDataSource<any>(this.propuestaTrabajadorSindicato);
  }



  /**
   * Función para calcular el reajuste segun el año y el tramo en el que se encuentra el sueldo
   */
  calculoReajusteAño(propuesta: any[], reajuste: any[]) {

    for (let i = 0; i < propuesta.length; i++) {
      for (let j = 0; j < reajuste.length; j++) {

        if (propuesta[i].anio == reajuste[j].anio) {

          if (propuesta[i].sueldoBase >= reajuste[j].inicio && propuesta[i].sueldoBase <= reajuste[j].final) {

            propuesta[i].reajuste = propuesta[i].sueldoBase * (reajuste[j].reajuste / 100);


          }

        }

      }

    }
    console.log("nueva propuesta con reajustes: ", propuesta)

  }

  calculoReajusteSimple(propuesta: any[], reajuste: any[]) {
    console.log("a punto de calcular..");
    for (let i = 0; i < propuesta.length; i++) {
      for (let j = 0; j < reajuste.length; j++) {

        if (propuesta[i].anio == reajuste[j].anio) {

          propuesta[i].reajuste = propuesta[i].sueldoBase * (reajuste[j].reajuste / 100);
          console.log("valor reajuste en reajustes: ", reajuste[j].reajuste)
          console.log("propuesta: ", propuesta);
        }

      }

    }
  }


  calculoMes1(propuestas: any[]) {

    for (let i = 0; i < propuestas.length; i++) {

      propuestas[i].mes1 = propuestas[i].sueldoBase + propuestas[i].reajuste;

    }
  }

  calculoIPCMarzo(propuestas: any[], ipcProyectado: any[]) {

    for (let i = 0; i < propuestas.length; i++) {
      for (let j = 0; j < ipcProyectado.length; j++) {

        if (propuestas[i].anio == ipcProyectado[j].anio) {

          propuestas[i].ipcMarzo = propuestas[i].mes1 * (ipcProyectado[j].proyeccion / 2);

        }

      }

    }

  }

  calculoMes2(propuestas: any[]) {
    for (let i = 0; i < propuestas.length; i++) {

      propuestas[i].mes2 = propuestas[i].mes1 + propuestas[i].ipcMarzo;

    }
  }

  guardarPropuestaSindicato() {

    //crear propuesta de administrativos para guardar
    var datosPropuestaAdmin: datoPropuesta[] = [];
    var datosPropuestaTrab: datoPropuesta[] = [];
    var fechaHoy = new Date(Date.now());
    var añoACtual = moment(fechaHoy).format("YYYY");
    var añoI = Number(añoACtual);

    //añadir datos para el año actual con las categorias

    for (let i = 0; i < this.categoriasAdmin.length; i++) {

      var datoAño0AdminSindicato: datoPropuesta = {
        categoria: this.categoriasAdmin[i].nombre,
        anio: añoI,
        cantMiembros: this.categoriasAdmin[i].cantidadMiembros,
        ipc: 0,
        mes1: 0,
        mes2: this.categoriasAdmin[i].sueldoBase,
        reajuste: 0,
        sueldoBase: 0

      }
      datosPropuestaAdmin.push(datoAño0AdminSindicato);

    }

    //Datos despues del año actual para la propuesta
    for (let i = 0; i < this.propuestaAdminSindicato.length; i++) {


      var datoPropuestaA: datoPropuesta = {

        anio: this.propuestaAdminSindicato[i].anio,
        categoria: this.propuestaAdminSindicato[i].nombre,
        cantMiembros: this.propuestaAdminSindicato[i].cantidadMiembros,
        sueldoBase: this.propuestaAdminSindicato[i].sueldoBase,
        mes1: this.propuestaAdminSindicato[i].mes1,
        ipc: this.propuestaAdminSindicato[i].ipcMarzo,
        mes2: this.propuestaAdminSindicato[i].mes2,
        reajuste: this.propuestaAdminSindicato[i].reajuste
      }
      datosPropuestaAdmin.push(datoPropuestaA);


    }

    //datos para propuesta de trabajadores 

    //datos para el año actual en la propuesta
    for (let i = 0; i < this.categoriasTrabajadores.length; i++) {

      var datoAño0TrabajadorSindicato: datoPropuesta = {
        categoria: this.categoriasTrabajadores[i].nombre,
        anio: añoI,
        cantMiembros: this.categoriasTrabajadores[i].cantidadMiembros,
        ipc: 0,
        mes1: 0,
        mes2: this.categoriasTrabajadores[i].sueldoBase,
        reajuste: 0,
        sueldoBase: 0

      }
      datosPropuestaTrab.push(datoAño0TrabajadorSindicato);

    }

    //Datos despues del año actual para la propuesta
    for (let i = 0; i < this.propuestaTrabajadorSindicato.length; i++) {

      var datoPropuestaT: datoPropuesta = {

        anio: this.propuestaTrabajadorSindicato[i].anio,
        categoria: this.propuestaTrabajadorSindicato[i].nombre,
        cantMiembros: this.propuestaTrabajadorSindicato[i].cantidadMiembros,
        sueldoBase: this.propuestaTrabajadorSindicato[i].sueldoBase,
        mes1: this.propuestaTrabajadorSindicato[i].mes1,
        ipc: this.propuestaTrabajadorSindicato[i].ipcMarzo,
        mes2: this.propuestaTrabajadorSindicato[i].mes2,
        reajuste: this.propuestaTrabajadorSindicato[i].reajuste
      }
      datosPropuestaTrab.push(datoPropuestaT);
    }

    // Se crean listas auxiliares para guardar los nombres de las categorias de admin y trabajadores
    var listaAuxCatAdmin: string[] = [];
    var listaAuxCatTrab: string[] = [];

    // Se recorre las categorias admin y trabajadores y se agrega el nombre a las listas auxiliares
    for (let i = 0; i < this.categoriasAdmin.length; i++) {

      var cat = this.categoriasAdmin[i].nombre;
      listaAuxCatAdmin.push(cat)

    }

    for (let i = 0; i < this.categoriasTrabajadores.length; i++) {

      var cat2 = this.categoriasTrabajadores[i].nombre;
      listaAuxCatTrab.push(cat2)

    }

    //llamar al servicio para crear la propuesta en la basae de datos
    this.propSvc.guardarPropuestaSindicato(this.idSindicato, datosPropuestaAdmin, datosPropuestaTrab, this.idSindicato, this.listaAños, listaAuxCatAdmin, listaAuxCatTrab);

  }

  getIdSindicato() {

    this.db.collection("users").doc(this.userId).get().subscribe((snapshotChanges) => {

      if (snapshotChanges.data().isAdmin == true) {

        this.idSindicato = this.userId;

      }
      else {
        this.idSindicato = snapshotChanges.data().idOrg;
      }
    })
  }

  //Funciones para el resumen y comparativas de las propuestas


  generarResumen() {

    this.resumenPropuestaAdminSindicato = [];
    this.resumenPropuestaTrabajadoresSindicato = [];

    console.log("id sindicato:", this.idSindicato)
    //añadir datos al resumen del admin desde sindicato
    this.db.collection("Propuesta").doc(this.idSindicato).get().subscribe((snapshotChanges) => {

      if (snapshotChanges.exists) {

        snapshotChanges.data().datosAdminPropuesta.forEach(element => {

          var datoResumen = {
            anio: element.anio,
            categoria: element.categoria,
            cantMiembros: element.cantMiembros,
            sueldo: element.mes2
          }
          this.resumenPropuestaAdminSindicato.push(datoResumen);

        });

        this.resumenPropuestaAdminSindicatoDataSource = new MatTableDataSource<any>(this.resumenPropuestaAdminSindicato);

        snapshotChanges.data().datosTrabPropuesta.forEach(element => {

          var datoResumenT = {
            anio: element.anio,
            categoria: element.categoria,
            cantMiembros: element.cantMiembros,
            sueldo: element.mes2
          }
          this.resumenPropuestaTrabajadoresSindicato.push(datoResumenT);

        });
        this.resumenPropuestaTrabajadoresSindicatoDataSource = new MatTableDataSource<any>(this.resumenPropuestaTrabajadoresSindicato);

      }
    })

  }

  generarComparativaSindicato() {

    this.comparativaAdminSindicato =[];
    this.comparativaTrabajadoresSindicato= [];

    //buscar la lista de las categorias y el año
    this.db.collection("Propuesta").doc(this.idSindicato).get().subscribe((snapshotChanges) => {

      if (snapshotChanges.exists) {

        this.listaDeCategoriasAdmin = snapshotChanges.data().categoriasAdmin;
        this.listaDeCategoriasTrab = snapshotChanges.data().categoriasTrab;
        this.listaDeAños = snapshotChanges.data().aniosVigencia;
        var catAdmin;
        var catsAdmin: any[] = [];
        var sueldos: any[] = [];

        //Calcular los incrementos de los administrativos
        //Primero se crea una lista con las categorias y sus sueldos asociados
        for (let i = 0; i < this.listaDeCategoriasAdmin.length; i++) {
          sueldos = [];
          catAdmin = [];

          for (let j = 0; j < this.resumenPropuestaAdminSindicato.length; j++) {

            if (this.listaDeCategoriasAdmin[i] == this.resumenPropuestaAdminSindicato[j].categoria) {
              console.log("categoria encontrada: ", this.resumenPropuestaAdminSindicato[j].categoria)
              console.log("ahora se agregará el sueldo ", this.resumenPropuestaAdminSindicato[j].sueldo + "a la categoría " + this.listaDeCategoriasAdmin[i]);
              var sueldoAño = {
                anio: this.resumenPropuestaAdminSindicato[j].anio,
                sueldo: this.resumenPropuestaAdminSindicato[j].sueldo
              }

              sueldos.push(sueldoAño);
              console.log("sueldo: ", sueldos)


            }

          }

          catAdmin = {
            categoria: this.listaDeCategoriasAdmin[i],
            sueldos: sueldos

          }
          catsAdmin.push(catAdmin)

        }
        console.log("Lista categorias con sueldo: ", catsAdmin);

        //Luego de crear las categorias con los sueldos se procede a realizar el cálculo de los incrementos
        //Esto se hace recorriendo las categorias y realizando la resta del valor actual menos el anterior
        //Para el primer valor siempre se considera que será de un incremento 0, condición especial

        for (let i = 0; i < catsAdmin.length; i++) {

          for (let j = 0; j < catsAdmin[i].sueldos.length; j++) {

            if (j == 0) {

              var comparativaAdmin = {
                categoria: catsAdmin[i].categoria,
                anio: catsAdmin[i].sueldos[j].anio,
                incremento: 0
              }

              this.comparativaAdminSindicato.push(comparativaAdmin);

            }
            else {
              var comparativaAdmin = {

                categoria: catsAdmin[i].categoria,
                anio: catsAdmin[i].sueldos[j].anio,
                incremento: catsAdmin[i].sueldos[j].sueldo - catsAdmin[i].sueldos[j-1].sueldo
              }
              this.comparativaAdminSindicato.push(comparativaAdmin);
            }

          }

        }

        //Luego se agregan los datos a la tabla de comparativa del sindicato

        this.comparativaAdminSindicatoDataSource = new MatTableDataSource<any>(this.comparativaAdminSindicato);

        //console.log("Datos comparativa admin: ", this.comparativaAdminSindicato)

        //Ahora se repite el proceso para la comparativa de los trabajadores



        var catTrab;
        var catsTrab: any[] = [];
        var sueldos: any[] = [];

        //Calcular los incrementos de los administrativos
        //Primero se crea una lista con las categorias y sus sueldos asociados
        for (let i = 0; i < this.listaDeCategoriasTrab.length; i++) {
          sueldos = [];
          catTrab = [];

          for (let j = 0; j < this.resumenPropuestaTrabajadoresSindicato.length; j++) {

            if (this.listaDeCategoriasTrab[i] == this.resumenPropuestaTrabajadoresSindicato[j].categoria) {
              
              var sueldoAño = {
                anio: this.resumenPropuestaTrabajadoresSindicato[j].anio,
                sueldo: this.resumenPropuestaTrabajadoresSindicato[j].sueldo
              }

              sueldos.push(sueldoAño);
              console.log("sueldo: ", sueldos)


            }

          }

          catAdmin = {
            categoria: this.listaDeCategoriasTrab[i],
            sueldos: sueldos

          }
          catsTrab.push(catTrab)

        }

        //Luego de crear las categorias con los sueldos se procede a realizar el cálculo de los incrementos
        //Esto se hace recorriendo las categorias y realizando la resta del valor actual menos el anterior
        //Para el primer valor siempre se considera que será de un incremento 0, condición especial

        for (let i = 0; i < catsTrab.length; i++) {

          for (let j = 0; j < catsTrab[i].sueldos.length; j++) {

            if (j == 0) {

              var comparativaTrab = {
                categoria: catsTrab[i].categoria,
                anio: catsTrab[i].sueldos[j].anio,
                incremento: 0
              }

              this.comparativaTrabajadoresSindicato.push(comparativaTrab);

            }
            else {
              var comparativaTrab = {

                categoria: catsTrab[i].categoria,
                anio: catsTrab[i].sueldos[j].anio,
                incremento: catsTrab[i].sueldos[j].sueldo - catsTrab[i].sueldos[j-1].sueldo
              }
              this.comparativaTrabajadoresSindicato.push(comparativaTrab);
            }

          }

        }

        //Luego se agregan los datos a la tabla de comparativa del sindicato

        this.comparativaTrabajadoresSindicatoDataSource = new MatTableDataSource<any>(this.comparativaTrabajadoresSindicato);

      }
    })







  }


  onChange(event: MatTabChangeEvent) {
    const tab = event.tab.textLabel;
    console.log(tab);
    if (tab === "Resumen y comparativa propuestas") {
      this.generarComparativaSindicato();
    }
  }


}
