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
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-propuestas',
  templateUrl: './propuestas.component.html',
  styleUrls: ['./propuestas.component.css']
})
export class PropuestasComponent implements OnInit {

  administrativoFormControl = new FormControl('', [Validators.required]);
  vigenciaFormControl = new FormControl('', [Validators.required]);
  trabajadorFormControl = new FormControl('', [Validators.required]);

  //Booleanos para mostrar u ocultar tablas

  public cargarSindicato: boolean;
  public cargarEmpresa: boolean;
  public listaAuxCatAdminSindicato = [];
  public listaAuxCatTrabSindicato = [];
  public listaAuxCatAdminEmpresa = [];
  public listaAuxCatTrabEmpresa = [];

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
  public datosPropuestaAdmin: datoPropuesta[] = [];


  //Propuesta trabajador
  public propuestaTGenerada: boolean = false;
  public columnasPropuestaTrabajadorSindicato: string[] = ["Año", "Nombre", "sueldo base", "Reajuste", "Mes1", "IPC Marzo", "Mes2"];
  public propuestaTrabajadorSindicatoDataSource: MatTableDataSource<any>;
  public propuestaTrabajadorSindicato: any[] = [];
  public datosPropuestaTrab: datoPropuesta[] = [];

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

  //A continuacion se definirán los atributos para la propuesta de la empresa


  administrativoEmpresaFormControl = new FormControl('', [Validators.required]);
  vigenciaEmpresaFormControl = new FormControl('', [Validators.required]);
  trabajadorEmpresaFormControl = new FormControl('', [Validators.required]);

  //displayedColumns: string[] = [];
  //dataSource: MatTableDataSource<any>;

  //public columnDefinitions:any [] = [];
  public mostrarFormsEmpresa: boolean;
  public mostrarReajustesEmpresa: boolean;
  //public listaValoresIPC:any[] =[];

  public ipcsEmpresa: any[] = [];
  public columnasIPCEmpresa: string[] = ["Año", "IPCProyectado"];
  public reajusteColumnsEmpresa: any[] = [];
  public ipcDataSourceEmpresa: MatTableDataSource<any>;
  public reajusteDisplayedColumnsEmpresa: string[] = [];

  public singleTramoAdminEmpresaSelected: boolean;
  public singleTramoTrabajadoresEmpresaSelected: boolean;

  //Tramos administrativos empresa
  public tramosAdminEmpresaList: any[] = [{ opcion: "Un tramo" }, { opcion: "Más de un tramo" }];
  public tramoAdminSelectedEmpresa: string;
  public tramosAdminEmpresaDataSource: MatTableDataSource<any>;
  public tramosAdminEmpresa: any[] = [];
  public columnasTramosAdminEmpresa: string[] = ["inicio", "fin", "eliminar"];
  public tramosAdminEmpresaGuardados: boolean;

  //Tramos trabajadores empresa
  public tramosTrabajadoresEmpresaList: any[] = [{ opcion: "Un tramo" }, { opcion: "Más de un tramo" }];
  public tramoTrabajadoresEmpresaSelected: string;
  public tramosTrabajadoresEmpresaDataSource: MatTableDataSource<any>;
  public tramosTrabajadoresEmpresa: any[] = [];
  public columnasTramosTrabajadoresEmpresa: string[] = ["inicio", "fin", "eliminar"];
  public tramosTrabajadoresEmpresaGuardados: boolean;


  //Reajustes administrativos empresa
  public reajusteAdminEmpresaDataSource: MatTableDataSource<any>;
  public reajustesAdminEmpresa: any[] = [];

  public reajustesAdminEmpresaSingleDataSource: MatTableDataSource<any>;
  public reajustesAdminEmpresaSingle: any[] = [];

  //Reajustes trabajadores empresa
  public reajusteTrabajadoresEmpresaDataSource: MatTableDataSource<any>;
  public reajustesTrabajadoresEmpresa: any[] = [];
  public reajustesTrabajadoresEmpresaSingleDataSource: MatTableDataSource<any>;
  public reajustesTrabajadoresEmpresaSingle: any[] = [];


  public listaAñosEmpresa: any[] = [];



  //categorías
  public categoriasAdminDataSourceEmpresa: MatTableDataSource<any>;
  public categoriasAdminEmpresa: any[] = [];
  //categorias trabajadores
  public categoriasTrabajadoresDataSourceEmpresa: MatTableDataSource<any>;
  public categoriasTrabajadoresEmpresa: any[] = [];

  //generación de la propuesta sindicato
  //Prpuesta Administrativo
  public propuestaGeneradaEmpresa: boolean = false;
  public columnasPropuestaAdminEmpresa: string[] = ["Año", "Nombre", "sueldo base", "Reajuste", "Mes1", "IPC Marzo", "Mes2"];
  public propuestaAdminEmpresaDataSource: MatTableDataSource<any>;
  public propuestaAdminEmpresa: any[] = [];
  public datosPropuestaAdminEmpresa: datoPropuesta[] = [];

  //Propuesta trabajador
  public propuestaTGeneradaEmpresa: boolean = false;
  public columnasPropuestaTrabajadorEmpresa: string[] = ["Año", "Nombre", "sueldo base", "Reajuste", "Mes1", "IPC Marzo", "Mes2"];
  public propuestaTrabajadorEmpresaDataSource: MatTableDataSource<any>;
  public propuestaTrabajadorEmpresa: any[] = [];
  public datosPropuestaTrabEmpresa: datoPropuesta[] = [];

  firstFormGroupEmpresa: FormGroup;
  secondFormGroupEmpresa: FormGroup;

  //steppers
  public aniosIngresadosEmpresa: boolean;
  public ipcsCompletadosEmpresa: boolean;
  public paso2CompletoEmpresa: boolean = false;
  public paso2CompletoCompletoEmpresa: boolean = false;
  public paso3CompletoEmpresa: boolean = false;

  //Resumen y comparativa de las propuestas

  //Propuesta de la empresa

  public resumenPropuestaAdminEmpresaDataSource: MatTableDataSource<any>;
  public resumenPropuestaTrabajadoresEmpresaDataSource: MatTableDataSource<any>;
  public columnasPropuestaEmpresa: string[] = ["Categoria", "cantMiembros", "Año", "Sueldo"];

  //Elementos para el resumen de la empresa

  public resumenPropuestaAdminEmpresa: any[];
  public resumenPropuestaTrabajadoresEmpresa: any[];

  //elementos para la comparativa de parte de la empresa

  public comparativaAdminEmpresa: any[];
  public comparativaTrabajadoresEmpresa: any[];
  //Mat data tables 
  public comparativaAdminEmpresaDataSource: MatTableDataSource<any>;
  public comparativaTrabajadoresEmpresaDataSource: MatTableDataSource<any>;

  //Columnas tabla comparativa
  public columnasComparativaEmpresa: string[] = ["Año", "Categoria", "Incremento"];
  public listaDeCategoriasAdminEmpresa: string[] = [];
  public listaDeCategoriasTrabEmpresa: string[] = [];
  public listaDeAñosEmpresa: string[] = [];

  //booleanos de carga 
  public resumenSindicatoExists: boolean;
  public resumenEmpresaExists: boolean;
  public comparativaExists: boolean;
  public isLoading: boolean;

  //Definicion de listas para mostrar el incremento total de sindicato y empresa

  public incrementoTotalAdminSindicato: any[] =[];
  public incrementoTotalAdminSindicatoDataSource: MatTableDataSource<any>;
  public incrementoTotalTrabSindicato: any[] =[];
  public incrementoTotalTrabSindicatoDataSource: MatTableDataSource<any>;
  public incrementoTotalAdminEmpresa: any[]= [];
  public incrementoTotalAdminEmpresaDataSource: MatTableDataSource<any>;
  public incrementoTotalTrabEmpresa: any[]=[];
  public incrementoTotalTrabEmpresaDataSource: MatTableDataSource<any>;

  public columnasIncremento:string[]= ["Categoria","Incremento total"]

  constructor(private dialog: MatDialog, private _formBuilder: FormBuilder, public db: AngularFirestore, private propSvc: PropuestaService, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.userId = firebase.auth().currentUser.uid;
    this.isLoading = true;
    this.getIdSindicato();
    setTimeout(() => {
      this.generarResumen();
      this.generarResumenEmpresa();

    }, 1500)

    setTimeout(() => {

      this.generarComparativaSindicato();
      this.generarComparativaEmpresa();
      this.isLoading = false;
    }, 2000)


    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  onAceptarDatos() {


    if (!this.vigenciaFormControl.valid || this.vigenciaFormControl.value == 0) {

      this.snackbar.open("No se han ingresado años válidos para la vigencia del contrato", '', {
        duration: 3000,
        verticalPosition: 'bottom'
      });


    }
    else {

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

    //this.ipcsCompletados = true;

    this.tramosAdminSindicatoGuardados = true;
    this.tramosTrabajadoresSindicatoGuardados = true;

    //inicializacion de arreglos de reajustes sindicato
    this.reajustesAdminSindicato = [];
    this.reajustesTrabajadoresSindicato = [];
    this.reajustesAdminSindicatoSingle = [];
    this.reajustesTrabajadoresSindicatoSingle = [];

    this.paso2Completo = true;

    //Primero validar la tabla de ipcs

    for (let i = 0; i < this.ipcs.length; i++) {
      console.log("proyeccion ipc: ", this.ipcs[i])
      if (this.ipcs[i].proyeccion <= 0 || this.ipcs[i].proyeccion == null) {

        this.paso2Completo = false;
      }

    }
    //Validar el largo
    if (this.ipcs.length == 0) {

      this.paso2Completo = false;

    }

    // se verifica si es que se ha seleccionado o no una opcion para los tramos 
    if (this.singleTramoAdminSindicatoSelected == undefined || this.singleTramoTrabajadoresSindicatoSelected == undefined) {
      this.paso2Completo = false;

    }
    //Validación para tramos de los administrativos
    //primero se pregunta si es un tramo multi o simple
    //si es simple entonces se hacen las comprobaciones correspondiente, en caso contrario se saltan
    if (this.singleTramoAdminSindicatoSelected == false) {

      if (this.tramosAdminSindicato.length == 0) {
        this.paso2Completo = false;
      }

      for (let i = 0; i < this.tramosAdminSindicato.length; i++) {

        if (this.tramosAdminSindicato[i].inicio == null || this.tramosAdminSindicato[i].final == null || this.tramosAdminSindicato[i].final == 0) {

          this.paso2Completo = false;

        }

      }
    }


    //Ahora se realizan las mismas validaciones para el caso de los tramos de los trabajadores 

    //primero se pregunta si es un tramo multi o simple
    //si es simple entonces se hacen las comprobaciones correspondiente, en caso contrario se saltan
    if (this.singleTramoTrabajadoresSindicatoSelected == false) {

      if (this.tramosTrabajadoresSindicato.length == 0) {
        this.paso2Completo = false;
      }

      for (let i = 0; i < this.tramosTrabajadoresSindicato.length; i++) {

        if (this.tramosTrabajadoresSindicato[i].inicio == null || this.tramosTrabajadoresSindicato[i].final == null || this.tramosTrabajadoresSindicato[i].final == 0) {

          this.paso2Completo = false;

        }

      }
    }

    //Luego de verificar los campos se procede a crear las tablas siguientes 
    //primero se pregunta si es que los campos fueron ya completados
    if (this.paso2Completo == true) {

      //Luego se pregunta si el tramo de admin es uno o mas

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
        this.reajusteAdminSindicatoDataSource = new MatTableDataSource<any>(this.reajustesAdminSindicato);
      }

      //Luego se crean las tablas para los trabajadores
      //Validando primero si es que es tramo simple o multi

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

      this.snackbar.open("Paso guardado , ahora puede hacer clic en siguiente para continuar", '', {
        duration: 3000,
        verticalPosition: 'bottom'
      });

    }
    //Si no se completa el paso 2 correctamente, entonces se muestra el mensaje de que faltan datos
    else {
      this.snackbar.open("No se puede avanzar al siguiente paso, porfavor revise los datos faltantes", '', {
        duration: 3000,
        verticalPosition: 'bottom'
      });
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


    //A continuación se realizan las validaciones para las tablas de reajuste
    //primero se comprueba si es que el tramo del administrativo es single o multi
    //En caso de serlo se realizan las validaciones de los campos del reajuste
    if (this.singleTramoAdminSindicatoSelected == true) {
      if (this.reajustesAdminSindicatoSingle.length == 0) {

        this.paso3Completo = false;
      }
      for (let i = 0; i < this.reajustesAdminSindicatoSingle.length; i++) {

        if (this.reajustesAdminSindicatoSingle[i].reajuste == null) {

          this.paso3Completo = false;

        }

      }
    }
    //Si no es single entonces se realizan las validaciones para el tramo multi
    //Se validan los reajustes para la tabla de admin 
    else {
      if (this.reajustesAdminSindicato.length == 0) {
        this.paso3Completo = false;
      }
      for (let i = 0; i < this.reajustesAdminSindicato.length; i++) {
        if (this.reajustesAdminSindicato[i].reajuste == null) {

          this.paso3Completo = false;
        }

      }

    }

    //Luego se procede a validar la tabla de la propuesta del administrativo

    //Se valida el largo de la tabla para el calculo
    if (this.categoriasAdmin.length == 0) {

      this.paso3Completo = false;

    }

    // Luego se valida que existan elementos y que sean mayores a 0 para el caso de los valores numéricos
    for (let i = 0; i < this.categoriasAdmin.length; i++) {

      if (this.categoriasAdmin[i].nombre == null || this.categoriasAdmin[i].cantidadMiembros == null || this.categoriasAdmin[i].sueldoBase == null ||
        this.categoriasAdmin[i].nombre == "" || this.categoriasAdmin[i].cantidadMiembros == 0 || this.categoriasAdmin[i].sueldoBase == 0) {

        this.paso3Completo = false;
      }

    }


    //Ahora se escriben las validaciones para las tablas correspondientes a los trabajadores


    //A continuación se realizan las validaciones para las tablas de reajuste
    //primero se comprueba si es que el tramo del administrativo es single o multi
    //En caso de serlo se realizan las validaciones de los campos del reajuste
    if (this.singleTramoTrabajadoresSindicatoSelected == true) {
      if (this.reajustesTrabajadoresSindicatoSingle.length == 0) {

        this.paso3Completo = false;
      }
      for (let i = 0; i < this.reajustesTrabajadoresSindicatoSingle.length; i++) {

        if (this.reajustesTrabajadoresSindicatoSingle[i].reajuste == null) {

          this.paso3Completo = false;

        }

      }
    }
    //Si no es single entonces se realizan las validaciones para el tramo multi
    //Se validan los reajustes para la tabla de admin 
    else {
      if (this.reajustesTrabajadoresSindicato.length == 0) {
        this.paso3Completo = false;
      }
      for (let i = 0; i < this.reajustesTrabajadoresSindicato.length; i++) {
        if (this.reajustesTrabajadoresSindicato[i].reajuste == null) {

          this.paso3Completo = false;
        }

      }

    }

    //Luego se procede a validar la tabla de la propuesta del administrativo

    //Se valida el largo de la tabla para el calculo
    if (this.categoriasTrabajadores.length == 0) {

      this.paso3Completo = false;

    }

    // Luego se valida que existan elementos y que sean mayores a 0 para el caso de los valores numéricos
    for (let i = 0; i < this.categoriasTrabajadores.length; i++) {

      if (this.categoriasTrabajadores[i].nombre == null || this.categoriasTrabajadores[i].cantidadMiembros == null || this.categoriasTrabajadores[i].sueldoBase == null ||
        this.categoriasTrabajadores[i].nombre == "" || this.categoriasTrabajadores[i].cantidadMiembros == 0 || this.categoriasTrabajadores[i].sueldoBase == 0) {

        this.paso3Completo = false;
      }

    }

    //Finalmente luego de las validaciones, se comprueba si es que las tablas son válidas, en caso de serlo se generan las tablas que muestran la propuesta generada

    if (this.paso3Completo == true) {

      this.snackbar.open("Paso guardado , ahora puede hacer clic en siguiente para continuar", '', {
        duration: 3000,
        verticalPosition: 'bottom'
      });

      this.crearTablaPropuestaAdminSindicato();
      this.crearTablaPropuestaTrabajadoresSindicato();
    }
    //De lo contrario se muestra el mensaje de aviso que faltan datos o que estos están incorrectos
    else {
      this.snackbar.open("No se puede avanzar al siguiente paso, porfavor revise los datos faltantes", '', {
        duration: 3000,
        verticalPosition: 'bottom'
      });
    }



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
    this.datosPropuestaAdmin = [];
    this.datosPropuestaTrab = [];
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
      this.datosPropuestaAdmin.push(datoAño0AdminSindicato);

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
      this.datosPropuestaAdmin.push(datoPropuestaA);


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
      this.datosPropuestaTrab.push(datoAño0TrabajadorSindicato);

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
      this.datosPropuestaTrab.push(datoPropuestaT);
    }

    // Se crean listas auxiliares para guardar los nombres de las categorias de admin y trabajadores
    this.listaAuxCatAdminSindicato = [];
    this.listaAuxCatTrabSindicato = [];

    // Se recorre las categorias admin y trabajadores y se agrega el nombre a las listas auxiliares
    for (let i = 0; i < this.categoriasAdmin.length; i++) {

      var cat = this.categoriasAdmin[i].nombre;
      this.listaAuxCatAdminSindicato.push(cat)

    }

    for (let i = 0; i < this.categoriasTrabajadores.length; i++) {

      var cat2 = this.categoriasTrabajadores[i].nombre;
      this.listaAuxCatTrabSindicato.push(cat2)

    }
    //Generar id aleatoria

    //llamar al servicio para crear la propuesta en la basae de datos
    this.propSvc.guardarPropuesta(this.idSindicato, this.datosPropuestaAdmin, this.datosPropuestaTrab, this.idSindicato, this.listaAños, this.listaAuxCatAdminSindicato, this.listaAuxCatTrabSindicato, true);
    this.snackbar.open("Propuesta del sindicato guardada ahora puede proceder con la propuesta de la empresa o ver la pestaña resumen", '', {
      duration: 3000,
      verticalPosition: 'bottom'
    });
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
    var idSindicatoPropuestaA = this.idSindicato + "A";
    console.log("id sindicato:", this.idSindicato)
    //añadir datos al resumen del admin desde sindicato

    this.db.collection("Propuesta").doc(idSindicatoPropuestaA).get().subscribe((snapshotChanges) => {


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


        snapshotChanges.data().datosTrabPropuesta.forEach(element => {

          var datoResumenT = {
            anio: element.anio,
            categoria: element.categoria,
            cantMiembros: element.cantMiembros,
            sueldo: element.mes2
          }
          this.resumenPropuestaTrabajadoresSindicato.push(datoResumenT);

        });

        this.resumenSindicatoExists = true;

      }
      else {
        this.resumenSindicatoExists = false;
      }
      this.resumenPropuestaAdminSindicatoDataSource = new MatTableDataSource<any>(this.resumenPropuestaAdminSindicato);
      this.resumenPropuestaTrabajadoresSindicatoDataSource = new MatTableDataSource<any>(this.resumenPropuestaTrabajadoresSindicato);



    });


  }

  generarComparativaSindicato() {

    this.comparativaAdminSindicato = [];
    this.comparativaTrabajadoresSindicato = [];
    this.incrementoTotalAdminSindicato = [];
    this.incrementoTotalTrabSindicato=[];

    var idSindicatoA = this.idSindicato + "A";

    //buscar la lista de las categorias y el año


    this.db.collection("Propuesta").doc(idSindicatoA).get().subscribe((snapshotChanges) => {



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
              var sueldoAño = {
                anio: this.resumenPropuestaAdminSindicato[j].anio,
                sueldo: this.resumenPropuestaAdminSindicato[j].sueldo
              }

              sueldos.push(sueldoAño);


            }

          }

          catAdmin = {
            categoria: this.listaDeCategoriasAdmin[i],
            sueldos: sueldos

          }
          catsAdmin.push(catAdmin)


        }

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
                incremento: catsAdmin[i].sueldos[j].sueldo - catsAdmin[i].sueldos[j - 1].sueldo
              }
              this.comparativaAdminSindicato.push(comparativaAdmin);
            }

          }

        }

        //Luego se agregan los datos a la tabla de comparativa del sindicato

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

            }

          }
          catTrab = {
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
                incremento: catsTrab[i].sueldos[j].sueldo - catsTrab[i].sueldos[j - 1].sueldo
              }
              this.comparativaTrabajadoresSindicato.push(comparativaTrab);
            }

          }

        }

        this.comparativaExists = true;
        //Calcular el incremento total del administrativo y generar la tabla
        //Se llama a la funcion para calcular el incremento total

        this.calcularIncrementoTotal(this.listaDeCategoriasAdmin,this.listaDeCategoriasTrab,this.comparativaAdminSindicato,this.comparativaTrabajadoresSindicato,this.incrementoTotalAdminSindicato,this.incrementoTotalTrabSindicato);


      }
      else {
        this.comparativaExists = false;
      }
      this.comparativaAdminSindicatoDataSource = new MatTableDataSource<any>(this.comparativaAdminSindicato);
      this.comparativaTrabajadoresSindicatoDataSource = new MatTableDataSource<any>(this.comparativaTrabajadoresSindicato);
      
      this.incrementoTotalAdminSindicatoDataSource = new MatTableDataSource<any>(this.incrementoTotalAdminSindicato);
      this.incrementoTotalTrabSindicatoDataSource = new MatTableDataSource<any>(this.incrementoTotalTrabSindicato);
    });

  }

  onChange(event: MatTabChangeEvent) {

    this.isLoading = true;
    const tab = event.tab.textLabel;
    console.log(tab);
    if (tab === "Resumen y comparativa propuestas") {
      setTimeout(() => {
        this.generarResumen();

      }, 1000)
      setTimeout(() => {
        this.generarResumenEmpresa();

      }, 1000)
      setTimeout(() => {
        this.generarComparativaSindicato();

      }, 1000)
      setTimeout(() => {
        this.generarComparativaEmpresa();
        this.isLoading = false;

      }, 1000)



    }
  }


  //A continuacion estarán los métodos correspondientes a la propuesta del lado de la empresa
  onAceptarDatosEmpresa() {

    if (!this.vigenciaEmpresaFormControl.valid || this.vigenciaEmpresaFormControl.value == 0) {

      this.snackbar.open("No se han ingresado años válidos para la vigencia del contrato", '', {
        duration: 3000,
        verticalPosition: 'bottom'
      });

    }
    else {
      this.mostrarFormsEmpresa = true;
      this.ipcsEmpresa = [];
      //Encontrar el año actual
      var fechaHoy = new Date(Date.now());
      var añoACtual = moment(fechaHoy).format("YYYY");
      var añoI = Number(añoACtual) + 1;
      this.listaAñosEmpresa = [];
      for (let i = 0; i < this.vigenciaEmpresaFormControl.value; i++) {

        var ipc = {
          anio: añoI,
          proyeccion: 0
        }

        this.ipcsEmpresa.push(ipc);
        this.listaAñosEmpresa.push(añoI);
        añoI++;
      }
      this.ipcDataSourceEmpresa = new MatTableDataSource<any>(this.ipcsEmpresa);

      this.mostrarReajustesEmpresa = true;
      // inicializar la tabla de tramos administrativos empresa

      console.log("valores ipc: ", this.ipcsEmpresa)
      this.tramosAdminEmpresa = [];

      var tramo = {
        nombre: "",
        inicio: 0,
        final: 0
      }

      this.tramosAdminEmpresa.push(tramo);
      this.tramosAdminEmpresaDataSource = new MatTableDataSource<any>(this.tramosAdminEmpresa);

      // inicializar la tabla de tramos Trabajadores empresa
      this.tramosTrabajadoresEmpresa = [];

      var tramo = {
        nombre: "",
        inicio: 0,
        final: 0
      }

      this.tramosTrabajadoresEmpresa.push(tramo);
      this.tramosTrabajadoresEmpresaDataSource = new MatTableDataSource<any>(this.tramosTrabajadoresEmpresa);


      //Se llama a la funcion para crear y rellenar la tabla de categorias
      this.crearTablaCategoriasAdminEmpresa();
      this.crearTablaCategoriasTrabajadoresEmpresa();

    }

  }

  /**
  * Funcion para guardar el estado del segundo paso en el calculo de propuestas, por el lado de la empresa
  */
  onGuardarPaso2Empresa() {

    this.tramosAdminEmpresaGuardados = true;
    this.tramosTrabajadoresEmpresaGuardados = true;

    //inicializacion de arreglos de reajustes sindicato
    this.reajustesAdminEmpresa = [];
    this.reajustesTrabajadoresEmpresa = [];
    this.reajustesAdminEmpresaSingle = [];
    this.reajustesTrabajadoresEmpresaSingle = [];

    this.paso2CompletoEmpresa = true;

    //Primero validar la tabla de ipcs

    for (let i = 0; i < this.ipcsEmpresa.length; i++) {
      console.log("proyeccion ipc: ", this.ipcsEmpresa[i])
      if (this.ipcsEmpresa[i].proyeccion <= 0 || this.ipcsEmpresa[i].proyeccion == null) {

        this.paso2CompletoEmpresa = false;
      }

    }
    //Validar el largo
    if (this.ipcsEmpresa.length == 0) {

      this.paso2CompletoEmpresa = false;

    }

    // se verifica si es que se ha seleccionado o no una opcion para los tramos 
    if (this.singleTramoAdminEmpresaSelected == undefined || this.singleTramoTrabajadoresEmpresaSelected == undefined) {
      this.paso2CompletoEmpresa = false;

    }
    //Validación para tramos de los administrativos
    //primero se pregunta si es un tramo multi o simple
    //si es simple entonces se hacen las comprobaciones correspondiente, en caso contrario se saltan
    if (this.singleTramoAdminEmpresaSelected == false) {

      if (this.tramosAdminEmpresa.length == 0) {
        this.paso2CompletoEmpresa = false;
      }

      for (let i = 0; i < this.tramosAdminEmpresa.length; i++) {

        if (this.tramosAdminEmpresa[i].inicio == null || this.tramosAdminEmpresa[i].final == null || this.tramosAdminEmpresa[i].final == 0) {

          this.paso2CompletoEmpresa = false;

        }

      }
    }


    //Ahora se realizan las mismas validaciones para el caso de los tramos de los trabajadores 

    //primero se pregunta si es un tramo multi o simple
    //si es simple entonces se hacen las comprobaciones correspondiente, en caso contrario se saltan
    if (this.singleTramoTrabajadoresEmpresaSelected == false) {

      if (this.tramosTrabajadoresEmpresa.length == 0) {
        this.paso2CompletoEmpresa = false;
      }

      for (let i = 0; i < this.tramosTrabajadoresEmpresa.length; i++) {

        if (this.tramosTrabajadoresEmpresa[i].inicio == null || this.tramosTrabajadoresEmpresa[i].final == null || this.tramosTrabajadoresEmpresa[i].final == 0) {

          this.paso2CompletoEmpresa = false;

        }

      }
    }

    //Luego de verificar los campos se procede a crear las tablas siguientes 
    //primero se pregunta si es que los campos fueron ya completados
    if (this.paso2CompletoEmpresa == true) {

      //Luego se pregunta si el tramo de admin es uno o mas

      if (this.singleTramoAdminEmpresaSelected == true) {

        for (let i = 0; i < this.listaAñosEmpresa.length; i++) {

          var reajusteSingle = {
            anio: this.listaAñosEmpresa[i],
            reajuste: ""
          }
          this.reajustesAdminEmpresaSingle.push(reajusteSingle);

        }
        this.reajustesAdminEmpresaSingleDataSource = new MatTableDataSource<any>(this.reajustesAdminEmpresaSingle);

      }
      else {
        //Se crea el arreglo para la tabla de reajustes administrativos del sindicato
        for (let i = 0; i < this.listaAñosEmpresa.length; i++) {

          for (let j = 0; j < this.tramosAdminEmpresa.length; j++) {

            var reajuste = {
              pos: j + 1,
              inicio: this.tramosAdminEmpresa[j].inicio,
              final: this.tramosAdminEmpresa[j].final,
              anio: this.listaAñosEmpresa[i],
              reajuste: ""
            }
            this.reajustesAdminEmpresa.push(reajuste);

          }
        }
        this.reajusteAdminEmpresaDataSource = new MatTableDataSource<any>(this.reajustesAdminEmpresa);
      }

      //Luego se crean las tablas para los trabajadores
      //Validando primero si es que es tramo simple o multi

      if (this.singleTramoTrabajadoresEmpresaSelected) {

        for (let i = 0; i < this.listaAñosEmpresa.length; i++) {

          var reajusteSingle = {
            anio: this.listaAñosEmpresa[i],
            reajuste: ""
          }
          this.reajustesTrabajadoresEmpresaSingle.push(reajusteSingle);

        }
        this.reajustesTrabajadoresEmpresaSingleDataSource = new MatTableDataSource<any>(this.reajustesTrabajadoresEmpresaSingle);


      }
      else {

        //se crean los reajustes para los trabajadores desde sindicato
        for (let i = 0; i < this.listaAñosEmpresa.length; i++) {

          for (let j = 0; j < this.tramosTrabajadoresEmpresa.length; j++) {

            var reajuste = {
              pos: j + 1,
              inicio: this.tramosTrabajadoresEmpresa[j].inicio,
              final: this.tramosTrabajadoresEmpresa[j].final,
              anio: this.listaAñosEmpresa[i],
              reajuste: ""
            }
            this.reajustesTrabajadoresEmpresa.push(reajuste);

          }
        }
        console.log("reajuste tabla: ", this.reajustesTrabajadoresEmpresa)
        this.reajusteTrabajadoresEmpresaDataSource = new MatTableDataSource<any>(this.reajustesTrabajadoresEmpresa);

      }
      this.snackbar.open("Paso guardado , ahora puede hacer clic en siguiente para continuar", '', {
        duration: 3000,
        verticalPosition: 'bottom'
      });

    }
    //Si no se completa el paso 2 correctamente, entonces se muestra el mensaje de que faltan datos
    else {
      this.snackbar.open("No se puede avanzar al siguiente paso, porfavor revise los datos faltantes", '', {
        duration: 3000,
        verticalPosition: 'bottom'
      });
    }

  }

  //Funciones para la tabla de tramos


  /**
   * Funcion para agregar una columna a la tabla tramos de administrativos desde sindicato
   */
  onAgregarTramoAdminEmpresa() {

    let tramo = {
      pos: 1,
      inicio: "",
      final: ""
    }



    this.tramosAdminEmpresa.push(tramo);
    this.tramosAdminEmpresaDataSource = new MatTableDataSource<any>(this.tramosAdminEmpresa);
  }

  selectTramoAdminEmpresa() {


    if (this.tramoAdminSelectedEmpresa == "Un tramo") {

      this.singleTramoAdminEmpresaSelected = true;


    }
    else {
      this.singleTramoAdminEmpresaSelected = false;
    }


  }

  selectTramoTrabajadoresEmpresa() {


    if (this.tramoTrabajadoresEmpresaSelected == "Un tramo") {

      this.singleTramoTrabajadoresEmpresaSelected = true;


    }
    else {
      this.singleTramoTrabajadoresEmpresaSelected = false;
    }


  }

  /**
   * Funcion para agregar una columna a la tabla tramos de trabajadores desde la empresa
   */
  onAgregarTramoTrabajadoresEmpresa() {

    let tramo = {
      pos: 1,
      inicio: "",
      final: ""
    }



    this.tramosTrabajadoresEmpresa.push(tramo);
    this.tramosTrabajadoresEmpresaDataSource = new MatTableDataSource<any>(this.tramosTrabajadoresEmpresa);
  }

  /**
   * Funcion para eliminar una columna de la tabla de tramos de administrativo desde empresa
   * @param elm 
   */
  deleteTramoAdminEmpresa(elm) {
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
        this.tramosAdminEmpresaDataSource.data = this.tramosAdminEmpresaDataSource.data
          .filter(i => i !== elm)
          .map((i, idx) => (i.position = (idx + 1), i));
        const index: number = this.tramosAdminEmpresa.indexOf(elm);
        this.tramosAdminEmpresa.splice(index, 1);

      }
    });
  }

  /**
   * Funcion para eliminar una columna de la tabla de tramos de trabajadores desde empresa
   * @param elm 
   */
  deleteTramoTrabajadoresEmpresa(elm) {
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
        this.tramosTrabajadoresEmpresaDataSource.data = this.tramosTrabajadoresEmpresaDataSource.data
          .filter(i => i !== elm)
          .map((i, idx) => (i.position = (idx + 1), i));
        const index: number = this.tramosTrabajadoresEmpresa.indexOf(elm);
        this.tramosTrabajadoresEmpresa.splice(index, 1);

      }
    });
  }


  //Funciones para las categorias de la empresa

  deleteCategoriasAdminEmpresa(elm) {

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
        this.categoriasAdminDataSourceEmpresa.data = this.categoriasAdminDataSourceEmpresa.data
          .filter(i => i !== elm)
          .map((i, idx) => (i.position = (idx + 1), i));
        const index: number = this.categoriasAdminEmpresa.indexOf(elm);
        this.categoriasAdminEmpresa.splice(index, 1);

      }
    });

  }

  crearTablaCategoriasAdminEmpresa() {
    this.categoriasAdminEmpresa = [];

    var categoria = {
      nombre: "",
      cantidadMiembros: 0,
      sueldoBase: 0
    }

    this.categoriasAdminEmpresa.push(categoria);

    this.categoriasAdminDataSourceEmpresa = new MatTableDataSource<any>(this.categoriasAdminEmpresa);

  }

  onAgregarCategoriaAdminEmpresa() {

    var categoria = {
      nombre: "",
      cantidadMiembros: 0,
      sueldoBase: 0
    }

    this.categoriasAdminEmpresa.push(categoria);

    this.categoriasAdminDataSourceEmpresa = new MatTableDataSource<any>(this.categoriasAdminEmpresa);



  }


  //categorias para trabajadores

  deleteCategoriasTrabajadoresEmpresa(elm) {

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
        this.categoriasTrabajadoresDataSourceEmpresa.data = this.categoriasTrabajadoresDataSourceEmpresa.data
          .filter(i => i !== elm)
          .map((i, idx) => (i.position = (idx + 1), i));
        const index: number = this.categoriasTrabajadoresEmpresa.indexOf(elm);
        this.categoriasTrabajadoresEmpresa.splice(index, 1);

      }
    });

  }

  crearTablaCategoriasTrabajadoresEmpresa() {
    this.categoriasTrabajadoresEmpresa = [];

    var categoria = {
      nombre: "",
      cantidadMiembros: 0,
      sueldoBase: 0
    }

    this.categoriasTrabajadoresEmpresa.push(categoria);

    this.categoriasTrabajadoresDataSourceEmpresa = new MatTableDataSource<any>(this.categoriasTrabajadoresEmpresa);

  }

  onAgregarCategoriaTrabajadoresEmpresa() {

    var categoria = {
      nombre: "",
      cantidadMiembros: 0,
      sueldoBase: 0
    }

    this.categoriasTrabajadoresEmpresa.push(categoria);
    console.log("categorias trabajadores: ", this.categoriasTrabajadoresEmpresa)

    this.categoriasTrabajadoresDataSourceEmpresa = new MatTableDataSource<any>(this.categoriasTrabajadoresEmpresa);

  }

  /**
   * Función para llamar a la creacion de las tablas de las propuestas de administrativos y trabajadores para la empresa
   */
  generarPropuestaEmpresa() {
    this.propuestaGeneradaEmpresa = true;
    this.paso3CompletoEmpresa = true;


    //A continuación se realizan las validaciones para las tablas de reajuste
    //primero se comprueba si es que el tramo del administrativo es single o multi
    //En caso de serlo se realizan las validaciones de los campos del reajuste
    if (this.singleTramoAdminEmpresaSelected == true) {
      if (this.reajustesAdminEmpresaSingle.length == 0) {

        this.paso3CompletoEmpresa = false;
      }
      for (let i = 0; i < this.reajustesAdminEmpresaSingle.length; i++) {

        if (this.reajustesAdminEmpresaSingle[i].reajuste == null) {

          this.paso3CompletoEmpresa = false;

        }

      }
    }
    //Si no es single entonces se realizan las validaciones para el tramo multi
    //Se validan los reajustes para la tabla de admin 
    else {
      if (this.reajustesAdminEmpresa.length == 0) {
        this.paso3CompletoEmpresa = false;
      }
      for (let i = 0; i < this.reajustesAdminEmpresa.length; i++) {
        if (this.reajustesAdminEmpresa[i].reajuste == null) {

          this.paso3CompletoEmpresa = false;
        }

      }

    }

    //Luego se procede a validar la tabla de la propuesta del administrativo

    //Se valida el largo de la tabla para el calculo
    if (this.categoriasAdminEmpresa.length == 0) {

      this.paso3CompletoEmpresa = false;

    }

    // Luego se valida que existan elementos y que sean mayores a 0 para el caso de los valores numéricos
    for (let i = 0; i < this.categoriasAdminEmpresa.length; i++) {

      if (this.categoriasAdminEmpresa[i].nombre == null || this.categoriasAdminEmpresa[i].cantidadMiembros == null || this.categoriasAdminEmpresa[i].sueldoBase == null ||
        this.categoriasAdminEmpresa[i].nombre == "" || this.categoriasAdminEmpresa[i].cantidadMiembros == 0 || this.categoriasAdminEmpresa[i].sueldoBase == 0) {

        this.paso3CompletoEmpresa = false;
      }

    }


    //Ahora se escriben las validaciones para las tablas correspondientes a los trabajadores


    //A continuación se realizan las validaciones para las tablas de reajuste
    //primero se comprueba si es que el tramo del administrativo es single o multi
    //En caso de serlo se realizan las validaciones de los campos del reajuste
    if (this.singleTramoTrabajadoresEmpresaSelected == true) {
      if (this.reajustesTrabajadoresEmpresaSingle.length == 0) {

        this.paso3CompletoEmpresa = false;
      }
      for (let i = 0; i < this.reajustesTrabajadoresEmpresaSingle.length; i++) {

        if (this.reajustesTrabajadoresEmpresaSingle[i].reajuste == null) {

          this.paso3CompletoEmpresa = false;

        }

      }
    }
    //Si no es single entonces se realizan las validaciones para el tramo multi
    //Se validan los reajustes para la tabla de admin 
    else {
      if (this.reajustesTrabajadoresEmpresa.length == 0) {
        this.paso3CompletoEmpresa = false;
      }
      for (let i = 0; i < this.reajustesTrabajadoresEmpresa.length; i++) {
        if (this.reajustesTrabajadoresEmpresa[i].reajuste == null) {

          this.paso3CompletoEmpresa = false;
        }

      }

    }

    //Luego se procede a validar la tabla de la propuesta del administrativo

    //Se valida el largo de la tabla para el calculo
    if (this.categoriasTrabajadoresEmpresa.length == 0) {

      this.paso3CompletoEmpresa = false;

    }

    // Luego se valida que existan elementos y que sean mayores a 0 para el caso de los valores numéricos
    for (let i = 0; i < this.categoriasTrabajadoresEmpresa.length; i++) {

      if (this.categoriasTrabajadoresEmpresa[i].nombre == null || this.categoriasTrabajadoresEmpresa[i].cantidadMiembros == null || this.categoriasTrabajadoresEmpresa[i].sueldoBase == null ||
        this.categoriasTrabajadoresEmpresa[i].nombre == "" || this.categoriasTrabajadoresEmpresa[i].cantidadMiembros == 0 || this.categoriasTrabajadoresEmpresa[i].sueldoBase == 0) {

        this.paso3CompletoEmpresa = false;
      }

    }

    //Finalmente luego de las validaciones, se comprueba si es que las tablas son válidas, en caso de serlo se generan las tablas que muestran la propuesta generada

    if (this.paso3CompletoEmpresa == true) {

      this.snackbar.open("Paso guardado , ahora puede hacer clic en siguiente para continuar", '', {
        duration: 3000,
        verticalPosition: 'bottom'
      });

      this.crearTablaPropuestaAdminEmpresa();
      this.crearTablaPropuestaTrabajadoresEmpresa();
    }
    //De lo contrario se muestra el mensaje de aviso que faltan datos o que estos están incorrectos
    else {
      this.snackbar.open("No se puede avanzar al siguiente paso, porfavor revise los datos faltantes", '', {
        duration: 3000,
        verticalPosition: 'bottom'
      });
    }

  }

  //Funciones para crear las tablas de las propuestas de la empresa
  /**
 * Funcion para crear la tabla que se genera al procesar los datos de la propuesta para administrativos de empresa
 */
  crearTablaPropuestaAdminEmpresa() {
    console.log("creando tabla propuesta")
    this.propuestaAdminEmpresa = [];
    for (let i = 0; i < this.categoriasAdminEmpresa.length; i++) {
      for (let j = 0; j < this.listaAñosEmpresa.length; j++) {

        var propuesta = {
          pos: i + 1,
          nombre: this.categoriasAdminEmpresa[i].nombre,
          cantidadMiembros: this.categoriasAdminEmpresa[i].cantidadMiembros,
          sueldoBase: this.categoriasAdminEmpresa[i].sueldoBase,
          anio: this.listaAñosEmpresa[j],
          reajuste: 0,
          mes1: 0,
          ipcMarzo: 0,
          mes2: 0
        }
        this.propuestaAdminEmpresa.push(propuesta);
        this.propuestaAdminEmpresa.sort((a, b) => (a.anio > b.anio) ? 1 : -1);
        console.log("propuesta ordenada: ", this.propuestaAdminEmpresa)

      }

    }

    //Llamado a las funciones para el calculo de los datos de la propuesta
    console.log("single tramo admin sindicato selected: ", this.singleTramoAdminEmpresaSelected)
    if (this.singleTramoAdminEmpresaSelected == true) {
      console.log("entrando en calculo...");
      this.calculoReajusteSimple(this.propuestaAdminEmpresa, this.reajustesAdminEmpresaSingle);
    }
    else {
      this.calculoReajusteAño(this.propuestaAdminEmpresa, this.reajustesAdminEmpresa);
    }

    this.calculoMes1(this.propuestaAdminEmpresa);
    this.calculoIPCMarzo(this.propuestaAdminEmpresa, this.ipcsEmpresa);
    this.calculoMes2(this.propuestaAdminEmpresa);


    console.log("lista propuestas: ", this.propuestaAdminEmpresa)
    this.propuestaAdminEmpresaDataSource = new MatTableDataSource<any>(this.propuestaAdminEmpresa);
  }


  //Crear la tabla de la propuesta de los trabajadores por el sindicato
  crearTablaPropuestaTrabajadoresEmpresa() {
    console.log("creando tabla propuesta")
    this.propuestaTrabajadorEmpresa = [];
    for (let i = 0; i < this.categoriasTrabajadoresEmpresa.length; i++) {
      for (let j = 0; j < this.listaAñosEmpresa.length; j++) {

        var propuesta = {
          pos: i + 1,
          nombre: this.categoriasTrabajadoresEmpresa[i].nombre,
          cantidadMiembros: this.categoriasTrabajadoresEmpresa[i].cantidadMiembros,
          sueldoBase: this.categoriasTrabajadoresEmpresa[i].sueldoBase,
          anio: this.listaAñosEmpresa[j],
          reajuste: 0,
          mes1: 0,
          ipcMarzo: 0,
          mes2: 0
        }
        this.propuestaTrabajadorEmpresa.push(propuesta);
        this.propuestaTrabajadorEmpresa.sort((a, b) => (a.anio > b.anio) ? 1 : -1);
        console.log("propuesta ordenada: ", this.propuestaTrabajadorEmpresa)

      }

    }

    console.log("single tramo trabajadores sindicato selected: ", this.singleTramoTrabajadoresEmpresaSelected)

    if (this.singleTramoTrabajadoresEmpresaSelected == true) {

      this.calculoReajusteSimple(this.propuestaTrabajadorEmpresa, this.reajustesTrabajadoresEmpresaSingle);
    }
    else {
      this.calculoReajusteAño(this.propuestaTrabajadorEmpresa, this.reajustesTrabajadoresEmpresa);
    }


    this.calculoMes1(this.propuestaTrabajadorEmpresa)
    this.calculoIPCMarzo(this.propuestaTrabajadorEmpresa, this.ipcsEmpresa);
    this.calculoMes2(this.propuestaTrabajadorEmpresa);

    console.log("lista propuestas: ", this.propuestaTrabajadorEmpresa)
    this.propuestaTrabajadorEmpresaDataSource = new MatTableDataSource<any>(this.propuestaTrabajadorEmpresa);
  }


  /**
   * Funcion para guardar la propuesta con los datos calculados anteriormente de la parte de la empresa
   */
  guardarPropuestaEmpresa() {

    //crear propuesta de administrativos para guardar
    this.datosPropuestaAdminEmpresa = [];
    this.datosPropuestaTrabEmpresa = [];
    var fechaHoy = new Date(Date.now());
    var añoACtual = moment(fechaHoy).format("YYYY");
    var añoI = Number(añoACtual);

    //añadir datos para el año actual con las categorias

    for (let i = 0; i < this.categoriasAdminEmpresa.length; i++) {

      var datoAño0AdminEmpresa: datoPropuesta = {
        categoria: this.categoriasAdminEmpresa[i].nombre,
        anio: añoI,
        cantMiembros: this.categoriasAdminEmpresa[i].cantidadMiembros,
        ipc: 0,
        mes1: 0,
        mes2: this.categoriasAdminEmpresa[i].sueldoBase,
        reajuste: 0,
        sueldoBase: 0

      }
      this.datosPropuestaAdminEmpresa.push(datoAño0AdminEmpresa);

    }

    //Datos despues del año actual para la propuesta
    for (let i = 0; i < this.propuestaAdminEmpresa.length; i++) {


      var datoPropuestaA: datoPropuesta = {

        anio: this.propuestaAdminEmpresa[i].anio,
        categoria: this.propuestaAdminEmpresa[i].nombre,
        cantMiembros: this.propuestaAdminEmpresa[i].cantidadMiembros,
        sueldoBase: this.propuestaAdminEmpresa[i].sueldoBase,
        mes1: this.propuestaAdminEmpresa[i].mes1,
        ipc: this.propuestaAdminEmpresa[i].ipcMarzo,
        mes2: this.propuestaAdminEmpresa[i].mes2,
        reajuste: this.propuestaAdminEmpresa[i].reajuste
      }
      this.datosPropuestaAdminEmpresa.push(datoPropuestaA);


    }

    //datos para propuesta de trabajadores 

    //datos para el año actual en la propuesta
    for (let i = 0; i < this.categoriasTrabajadoresEmpresa.length; i++) {

      var datoAño0TrabajadorEmpresa: datoPropuesta = {
        categoria: this.categoriasTrabajadoresEmpresa[i].nombre,
        anio: añoI,
        cantMiembros: this.categoriasTrabajadoresEmpresa[i].cantidadMiembros,
        ipc: 0,
        mes1: 0,
        mes2: this.categoriasTrabajadoresEmpresa[i].sueldoBase,
        reajuste: 0,
        sueldoBase: 0

      }
      this.datosPropuestaTrabEmpresa.push(datoAño0TrabajadorEmpresa);

    }

    //Datos despues del año actual para la propuesta
    for (let i = 0; i < this.propuestaTrabajadorEmpresa.length; i++) {

      var datoPropuestaT: datoPropuesta = {

        anio: this.propuestaTrabajadorEmpresa[i].anio,
        categoria: this.propuestaTrabajadorEmpresa[i].nombre,
        cantMiembros: this.propuestaTrabajadorEmpresa[i].cantidadMiembros,
        sueldoBase: this.propuestaTrabajadorEmpresa[i].sueldoBase,
        mes1: this.propuestaTrabajadorEmpresa[i].mes1,
        ipc: this.propuestaTrabajadorEmpresa[i].ipcMarzo,
        mes2: this.propuestaTrabajadorEmpresa[i].mes2,
        reajuste: this.propuestaTrabajadorEmpresa[i].reajuste
      }
      this.datosPropuestaTrabEmpresa.push(datoPropuestaT);
    }

    // Se crean listas auxiliares para guardar los nombres de las categorias de admin y trabajadores
    this.listaAuxCatAdminEmpresa = [];
    this.listaAuxCatTrabEmpresa = [];

    // Se recorre las categorias admin y trabajadores y se agrega el nombre a las listas auxiliares
    for (let i = 0; i < this.categoriasAdminEmpresa.length; i++) {

      var cat = this.categoriasAdminEmpresa[i].nombre;
      this.listaAuxCatAdminEmpresa.push(cat)

    }

    for (let i = 0; i < this.categoriasTrabajadoresEmpresa.length; i++) {

      var cat2 = this.categoriasTrabajadoresEmpresa[i].nombre;
      this.listaAuxCatTrabEmpresa.push(cat2)

    }

    //llamar al servicio para crear la propuesta en la basae de datos
    this.propSvc.guardarPropuesta(this.idSindicato, this.datosPropuestaAdminEmpresa, this.datosPropuestaTrabEmpresa, this.idSindicato, this.listaAñosEmpresa, this.listaAuxCatAdminEmpresa, this.listaAuxCatTrabEmpresa, false);
    this.snackbar.open("Propuesta de la empresa guardada, ahora puede proceder con la propuesta del sindicato o ver la pestaña resumen", '', {
      duration: 3000,
      verticalPosition: 'bottom'
    });
  }

  /**
   * Función para generar el resumen que se carga al ingresar a la opción de propuestas si es que existe una propuesta anteriormente guardada
   */
  generarResumenEmpresa() {

    this.resumenPropuestaAdminEmpresa = [];
    this.resumenPropuestaTrabajadoresEmpresa = [];
    var idSindicatoB = this.idSindicato + "B";

    console.log("id sindicato:", this.idSindicato)
    //añadir datos al resumen del admin desde sindicato

    this.db.collection("Propuesta").doc(idSindicatoB).get().subscribe((snapshotChanges) => {

      if (snapshotChanges.exists) {

        snapshotChanges.data().datosAdminPropuesta.forEach(element => {

          var datoResumen = {
            anio: element.anio,
            categoria: element.categoria,
            cantMiembros: element.cantMiembros,
            sueldo: element.mes2
          }
          console.log("dato resumen: ", datoResumen)
          this.resumenPropuestaAdminEmpresa.push(datoResumen);

        });


        snapshotChanges.data().datosTrabPropuesta.forEach(element => {

          var datoResumenT = {
            anio: element.anio,
            categoria: element.categoria,
            cantMiembros: element.cantMiembros,
            sueldo: element.mes2
          }
          this.resumenPropuestaTrabajadoresEmpresa.push(datoResumenT);

        });
        this.resumenEmpresaExists = true;
      }
      else {
        this.resumenEmpresaExists = false;
      }

      this.resumenPropuestaAdminEmpresaDataSource = new MatTableDataSource<any>(this.resumenPropuestaAdminEmpresa);
      this.resumenPropuestaTrabajadoresEmpresaDataSource = new MatTableDataSource<any>(this.resumenPropuestaTrabajadoresEmpresa);

    });


  }


  generarComparativaEmpresa() {

    this.comparativaAdminEmpresa = [];
    this.comparativaTrabajadoresEmpresa = [];
    this.incrementoTotalTrabEmpresa = [];
    this.incrementoTotalAdminEmpresa=[];
    var idSindicatoB = this.idSindicato + "B";

    //buscar la lista de las categorias y el año

    this.db.collection("Propuesta").doc(idSindicatoB).get().subscribe((snapshotChanges) => {



      if (snapshotChanges.exists) {
        this.listaDeCategoriasAdminEmpresa = snapshotChanges.data().categoriasAdmin;
        this.listaDeCategoriasTrabEmpresa = snapshotChanges.data().categoriasTrab;
        this.listaDeAñosEmpresa = snapshotChanges.data().aniosVigencia;
        var catAdmin;
        var catsAdmin: any[] = [];
        var sueldos: any[] = [];

        //Calcular los incrementos de los administrativos
        //Primero se crea una lista con las categorias y sus sueldos asociados
        for (let i = 0; i < this.listaDeCategoriasAdminEmpresa.length; i++) {
          sueldos = [];
          catAdmin = [];

          for (let j = 0; j < this.resumenPropuestaAdminEmpresa.length; j++) {

            if (this.listaDeCategoriasAdminEmpresa[i] == this.resumenPropuestaAdminEmpresa[j].categoria) {
              console.log("categoria encontrada: ", this.resumenPropuestaAdminEmpresa[j].categoria)
              console.log("ahora se agregará el sueldo ", this.resumenPropuestaAdminEmpresa[j].sueldo + "a la categoría " + this.listaDeCategoriasAdminEmpresa[i]);
              var sueldoAño = {
                anio: this.resumenPropuestaAdminEmpresa[j].anio,
                sueldo: this.resumenPropuestaAdminEmpresa[j].sueldo
              }

              sueldos.push(sueldoAño);
              console.log("sueldo: ", sueldos)


            }

          }

          catAdmin = {
            categoria: this.listaDeCategoriasAdminEmpresa[i],
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

              this.comparativaAdminEmpresa.push(comparativaAdmin);

            }
            else {
              var comparativaAdmin = {

                categoria: catsAdmin[i].categoria,
                anio: catsAdmin[i].sueldos[j].anio,
                incremento: catsAdmin[i].sueldos[j].sueldo - catsAdmin[i].sueldos[j - 1].sueldo
              }
              this.comparativaAdminEmpresa.push(comparativaAdmin);
            }

          }

        }

        //Luego se agregan los datos a la tabla de comparativa del sindicato


        //console.log("Datos comparativa admin: ", this.comparativaAdminSindicato)

        //Ahora se repite el proceso para la comparativa de los trabajadores



        var catTrab;
        var catsTrab: any[] = [];
        var sueldos: any[] = [];

        //Calcular los incrementos de los administrativos
        //Primero se crea una lista con las categorias y sus sueldos asociados
        for (let i = 0; i < this.listaDeCategoriasTrabEmpresa.length; i++) {
          sueldos = [];
          catTrab = [];

          for (let j = 0; j < this.resumenPropuestaTrabajadoresEmpresa.length; j++) {

            if (this.listaDeCategoriasTrabEmpresa[i] == this.resumenPropuestaTrabajadoresEmpresa[j].categoria) {

              var sueldoAño = {
                anio: this.resumenPropuestaTrabajadoresEmpresa[j].anio,
                sueldo: this.resumenPropuestaTrabajadoresEmpresa[j].sueldo
              }

              sueldos.push(sueldoAño);
              console.log("sueldo: ", sueldos)


            }

          }

          catTrab = {
            categoria: this.listaDeCategoriasTrabEmpresa[i],
            sueldos: sueldos

          }
          catsTrab.push(catTrab)

        }

        console.log("categorias trab: ", catsTrab)
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

              this.comparativaTrabajadoresEmpresa.push(comparativaTrab);

            }
            else {
              var comparativaTrab = {

                categoria: catsTrab[i].categoria,
                anio: catsTrab[i].sueldos[j].anio,
                incremento: catsTrab[i].sueldos[j].sueldo - catsTrab[i].sueldos[j - 1].sueldo
              }
              this.comparativaTrabajadoresEmpresa.push(comparativaTrab);
            }

          }

        }

        //Luego se agregan los datos a la tabla de comparativa del sindicato
        console.log("comparativa trabajadores: ", this.comparativaTrabajadoresEmpresa)
      
        this.calcularIncrementoTotal(this.listaDeCategoriasAdminEmpresa,this.listaDeCategoriasTrabEmpresa,this.comparativaAdminEmpresa,this.comparativaTrabajadoresEmpresa,this.incrementoTotalAdminEmpresa,this.incrementoTotalTrabEmpresa);

     

        this.comparativaExists = true;
      }
      else {
        this.comparativaExists = false;
      }

      this.comparativaAdminEmpresaDataSource = new MatTableDataSource<any>(this.comparativaAdminEmpresa);
      this.comparativaTrabajadoresEmpresaDataSource = new MatTableDataSource<any>(this.comparativaTrabajadoresEmpresa);
      this.incrementoTotalAdminEmpresaDataSource = new MatTableDataSource<any>(this.incrementoTotalAdminEmpresa);
      this.incrementoTotalTrabEmpresaDataSource = new MatTableDataSource<any>(this.incrementoTotalTrabEmpresa);

    });







  }


  calcularIncrementoTotal(categoriasAdmin:string[],categoriasTrab:string[],comparativaAdmin:any[],comparativaTrab:any[],incrementosTotalesPorCatAdmin:any[],incrementosTotalesPorCatTrab:any[]){

    //Primero recorrer la comparativa de admin
    var incrementoTotal =0;
    console.log("categorias  admin incremento: ",categoriasAdmin);
    console.log("categorias trab incremento: ",categoriasTrab);
    console.log("comparativa admin incremento: ",comparativaAdmin);
    console.log("comparativa trab incremento: ",comparativaTrab);
    console.log("incrementosadmin: ",incrementosTotalesPorCatAdmin);
    console.log("incrementos trab: ",incrementosTotalesPorCatTrab);

      for (let i = 0; i < categoriasAdmin.length; i++) {
        for (let j = 0; j < comparativaAdmin.length; j++) {
          
          if(categoriasAdmin[i] == comparativaAdmin[j].categoria){

            incrementoTotal = incrementoTotal + comparativaAdmin[j].incremento

          }
          
        }
        
        var incrementoPorCatAdmin = {
          categoria: categoriasAdmin[i],
          incrementoTotal: incrementoTotal
        }
        incrementosTotalesPorCatAdmin.push(incrementoPorCatAdmin);

        
      }

      //Luego calcular el incremento para la categoria de trabajadores
      var incrementoTotal =0;
      for (let i = 0; i < categoriasTrab.length; i++) {
        for (let j = 0; j < comparativaTrab.length; j++) {
          
          if(categoriasTrab[i] == comparativaTrab[j].categoria){

            incrementoTotal = incrementoTotal + comparativaTrab[j].incremento

          }
          
        }
        
        var incrementoPorCatTrab = {
          categoria: categoriasTrab[i],
          incrementoTotal: incrementoTotal
        }
        incrementosTotalesPorCatTrab.push(incrementoPorCatTrab);

        
      }

  }

}
