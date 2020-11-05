import { Component, OnInit} from '@angular/core';
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
  public columnasPropuestaAdminSindicato: string[] = ["Año", "Nombre", "Cantidad miembros", "sueldo base", "Reajuste", "Mes1", "IPC Marzo", "Mes2"];
  public propuestaAdminSindicatoDataSource: MatTableDataSource<any>;
  public propuestaAdminSindicato: any[] = [];

  //Propuesta trabajador
  public propuestaTGenerada: boolean = false;
  public columnasPropuestaTrabajadorSindicato: string[] = ["Año", "Nombre", "Cantidad miembros", "sueldo base", "Reajuste", "Mes1", "IPC Marzo", "Mes2"];
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
    console.log("single tramo admin sindicato selected: ",this.singleTramoAdminSindicatoSelected)
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
          console.log("valor reajuste en reajustes: ",reajuste[j].reajuste)
          console.log("propuesta: ",propuesta);
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

}
