import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import * as firebase from 'firebase';
import { PropuestaService } from '../services/propuesta.service';

@Component({
  selector: 'app-propuestas-fundacion',
  templateUrl: './propuestas-fundacion.component.html',
  styleUrls: ['./propuestas-fundacion.component.css']
})
export class PropuestasFundacionComponent implements OnInit {

  public userId: any;
  public userEmail: any;

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

  //Atributos de la empresa

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

  public sindicatoList: any[] = [];
  public sindicatosAsociados: string[] = [];
  public selectedValue: string;
  public propuestaExists: boolean = false;
  public idSindicato: string;

  public resumenExists: boolean;
  public comparativaExists: boolean;
  public sindicatoSelected: boolean;
  public isLoading:boolean ;

   //Definicion de listas para mostrar el incremento total de sindicato y empresa

   public incrementoTotalAdminSindicato: any[] =[];
   public incrementoTotalAdminSindicatoDataSource: MatTableDataSource<any>;
   public incrementoTotalTrabSindicato: any[] =[];
   public incrementoTotalTrabSindicatoDataSource: MatTableDataSource<any>;
   public incrementoTotalAdminEmpresa: any[]= [];
   public incrementoTotalAdminEmpresaDataSource: MatTableDataSource<any>;
   public incrementoTotalTrabEmpresa: any[]=[];
   public incrementoTotalTrabEmpresaDataSource: MatTableDataSource<any>;

  constructor(public db: AngularFirestore) { }

  ngOnInit(): void {
    this.userId = firebase.auth().currentUser.uid;
    this.userEmail = firebase.auth().currentUser.email;
    this.sindicatoSelected = false;
    this.cargarSindicatos();
  }


  cargarSindicatos() {

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

    this.isLoading = true;
    var sindicatoSeleccionado = this.selectedValue;
    console.log("valor seleccionado: ", sindicatoSeleccionado);
    this.idSindicato = sindicatoSeleccionado;

    /*
    this.resumenPropuestaAdminSindicato = [];
    this.resumenPropuestaTrabajadoresSindicato = [];
    this.resumenPropuestaAdminEmpresa = [];
    this.resumenPropuestaTrabajadoresEmpresa = [];
    
    this.resumenPropuestaAdminSindicatoDataSource = new MatTableDataSource<any>(this.resumenPropuestaAdminSindicato);
    this.resumenPropuestaTrabajadoresSindicatoDataSource = new MatTableDataSource<any>(this.resumenPropuestaTrabajadoresSindicato);
    this.resumenPropuestaAdminEmpresaDataSource = new MatTableDataSource<any>(this.resumenPropuestaAdminEmpresa);
    this.resumenPropuestaTrabajadoresEmpresaDataSource = new MatTableDataSource<any>(this.resumenPropuestaTrabajadoresEmpresa);

    this.comparativaAdminSindicato = [];
    this.comparativaTrabajadoresSindicato = [];
    this.comparativaAdminEmpresa = [];
    this.comparativaTrabajadoresEmpresa = [];

    this.comparativaAdminSindicatoDataSource = new MatTableDataSource<any>(this.comparativaAdminSindicato);
    this.comparativaTrabajadoresSindicatoDataSource = new MatTableDataSource<any>(this.comparativaTrabajadoresSindicato);
    this.comparativaAdminEmpresaDataSource = new MatTableDataSource<any>(this.comparativaAdminEmpresa);
    this.comparativaTrabajadoresEmpresaDataSource = new MatTableDataSource<any>(this.comparativaTrabajadoresEmpresa);
    */

    this.sindicatoSelected = true;

    this.generarResumen();
    this.generarComparativaSindicato();
    this.generarResumenEmpresa();
    this.generarComparativaEmpresa();

    setTimeout(()=>{
      this.isLoading = false;

    },500)

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

        this.resumenExists = true;

      }
      else {
        this.resumenExists = false;
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

        //Luego se agregan los datos a la tabla de comparativa del sindicato
        this.calcularIncrementoTotal(this.listaDeCategoriasAdmin,this.listaDeCategoriasTrab,this.comparativaAdminSindicato,this.comparativaTrabajadoresSindicato,this.incrementoTotalAdminSindicato,this.incrementoTotalTrabSindicato);

        this.comparativaExists = true;
      }
      else {
        this.resumenExists = false;
      }


      this.comparativaAdminSindicatoDataSource = new MatTableDataSource<any>(this.comparativaAdminSindicato);
      this.comparativaTrabajadoresSindicatoDataSource = new MatTableDataSource<any>(this.comparativaTrabajadoresSindicato);
      
      this.incrementoTotalAdminSindicatoDataSource = new MatTableDataSource<any>(this.incrementoTotalAdminSindicato);
      this.incrementoTotalTrabSindicatoDataSource = new MatTableDataSource<any>(this.incrementoTotalTrabSindicato);
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
        this.resumenExists = true;
      }
      else {
        this.resumenExists = false;
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
      else{
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
