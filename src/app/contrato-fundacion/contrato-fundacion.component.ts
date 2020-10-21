import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { ContratoService } from '../services/contrato.service';
import * as firebase from 'firebase';
import { Contrato } from '../shared/Interfaces/Contrato';

@Component({
  selector: 'app-contrato-fundacion',
  templateUrl: './contrato-fundacion.component.html',
  styleUrls: ['./contrato-fundacion.component.css']
})
export class ContratoFundacionComponent implements OnInit {

  
  private content: string = "<p><strong>PROYECTO </strong><strong>CONTRATO COLECTIVO DE TRABAJO</strong></p><p>&nbsp;</p><p>&nbsp;</p><p><strong><u>Art&iacute;culo Primero: Definiciones</u></strong></p><p><strong><u>&nbsp;</u></strong></p><p>Para los efectos de este contrato colectivo del trabajo, cada vez que se use, mencione o haga una referencia a las siguientes expresiones, se entender&aacute; por:</p><ol><li>Contrato colectivo, contrato colectivo de trabajo o instrumento colectivo: El presente contrato colectivo de trabajo, cuyas cl&aacute;usulas se encuentran establecidas en &eacute;l.</li><li>Empleador, establecimiento o instituci&oacute;n: _________</li><li>Trabajador, empleado, dependiente, personal o funcionario en cualquiera de los dos g&eacute;neros: Todos aquellos trabajadores y trabajadoras, que prestan servicios personales para el Empleador, que se encuentran afiliados al Sindicato ________, cuyos nombres se indican en n&oacute;mina debidamente firmada por las partes y que se considera parte integrante del Contrato Colectivo de Trabajo; o se integren con posterioridad al sindicato. Salvo en los casos en que se exprese que se trata de un solo g&eacute;nero.</li><li>Sindicato u organizaci&oacute;n sindical: Sindicato _____________.</li><li>Salario base, sueldo base, sueldo mes: El estipendio fijo en dinero pagado mensualmente a los trabajadores y trabajadoras por la prestaci&oacute;n de sus servicios personales en jornada ordinaria de trabajo.</li><li>Remuneraci&oacute;n: Las contraprestaciones en dinero y las adicionales en especie avaluables en dinero que debe percibir el trabajador por causa del contrato de trabajo de forma peri&oacute;dica.</li><li>Liquidaci&oacute;n: Liquidaci&oacute;n de remuneraci&oacute;n mensual.</li><li>Valores de remuneraciones y beneficios: Todos los montos y cantidades expresadas en moneda corriente establecidas en el contrato colectivo, se refieren a montos brutos, antes de impuestos o descuentos legales y previsionales que correspondan, salvo que expresamente se establezca que se trata de montos l&iacute;quidos que deber&aacute; percibir la trabajadora una vez efectuados los descuentos legales que corresponden.</li> <li>Las partes acuerdan que todos los beneficios del presente instrumento ser&aacute;n estipulados en Pesos ($) y en U.F (Unidades de Fomento), que se pagar&aacute;n por su valor vigente al d&iacute;a 01 de cada mes en que se pague cada beneficio.</li><li>A&ntilde;o calendario: El per&iacute;odo de doce meses que se extiende desde el 01 de enero al 31 de diciembre de cada a&ntilde;o.</li><li>A&ntilde;o de vigencia del contrato colectivo: El per&iacute;odo de doce meses que se extiende desde la fecha de inicio del presente instrumento colectivo.</li><li>IPC: &Iacute;ndice de Precios al Consumidor determinado por el Instituto Nacional de Estad&iacute;sticas o el organismo que en el futuro lo reemplace.</li><li>Variaci&oacute;n del IPC: El porcentaje de variaci&oacute;n que experimenta el &Iacute;ndice de Precios al Consumidor en un per&iacute;odo determinado, considerando para su c&aacute;lculo el o los IPC negativos del per&iacute;odo o el mecanismo hom&oacute;logo que en el futuro lo reemplace, salvo en los casos en que se acuerde no aplicar la variaci&oacute;n negativa.</li><li>Comit&eacute; Bipartito, Comit&eacute;: El comit&eacute; constituido por representantes de la Fundaci&oacute;n y la directiva del sindicato, para la implementaci&oacute;n y seguimiento del cumplimiento del contrato colectivo.</li><li>Piso de la negociaci&oacute;n: id&eacute;nticas estipulaciones a las establecidas en el instrumento colectivo vigente, suscrito con fecha 23 de mayo de 2018 entre ambas partes, con los valores que corresponda pagar a la fecha del t&eacute;rmino del contrato, de conformidad con el art&iacute;culo 336 del C&oacute;digo del Trabajo.</li></ol><p><strong><u>&nbsp;</u></strong></p><p><strong><u>&nbsp;</u></strong></p><p><strong><u>Art&iacute;culo Segundo: Partes del contrato </u></strong></p><p>&nbsp;</p><p>El presente contrato regular&aacute; las relaciones laborales entre el empleador _____________, en adelante la Fundaci&oacute;n o la Empresa, y los Trabajadores socios del Sindicato _______________, en adelante el Sindicato o la organizaci&oacute;n sindical, que se individualiza en la n&oacute;mina adjunta, Anexo Nro. 1, documento que forma parte integrante de este contrato para todos los efectos legales.</p><p>Se deja expresa constancia que se incluyen dentro del &aacute;mbito de aplicaci&oacute;n del presente contrato, los socios que se afilien al sindicato luego de su celebraci&oacute;n.</p><p><u>&nbsp;</u></p><p><strong><u>Art&iacute;culo Tercero: Objeto</u></strong></p><p>&nbsp;</p><p>El objeto de este contrato colectivo de trabajo es establecer las condiciones comunes de trabajo, remuneraciones, regal&iacute;as y otras prestaciones entre la Fundaci&oacute;n y los trabajadores sujetos a &eacute;l. Declaran las partes que el presente contrato colectivo es el instrumento &uacute;nico que rige las relaciones entre ellos. Sin perjuicio de lo estipulado en los respectivos contratos individuales de trabajo.</p><p>&nbsp;</p> <p>&nbsp;</p><p><strong><u>Art&iacute;culo Cuarto: Vigencia</u></strong></p><p>&nbsp;</p><p>El presente contrato colectivo de trabajo tendr&aacute; una vigencia de dos a&ntilde;os, contados entre el _____; de ____ de ____ y el ____; de ____ de ____, ambas fechas inclusive.</p><p>Se conviene que, dada la naturaleza de los servicios que presta la Fundaci&oacute;n, los cuales obligan al desplazamiento de los trabajadores de un lugar a otro, se entender&aacute; por lugar de trabajo toda la zona geogr&aacute;fica que comprende la actividad de la Empresa.</p>";
  public isNew: boolean = true;
  public userId: any;
  public userEmail: any;
  public idSindicato: any;
  public isAdmin: boolean;
  public idFundacion: any;
  public isFinished = false; 
  public sindicatoSeleccionado = false;
  public isLoading:boolean;

  textoFormControl = new FormControl('', [
    Validators.required
  ]);

  selectedValue: string;

  sindicatoList: any[] = [];
  sindicatosAsociados: string[]=[];


  contratoExists:boolean;


  constructor(public db: AngularFirestore, private contratoSvc: ContratoService) {

    this.userId = firebase.auth().currentUser.uid;
    this.userEmail = firebase.auth().currentUser.email;
  }

  ngOnInit(): void {

    
    //this.getIdSindicato();
    this.cargarSindicatos();
    
    
  }
  onGuardar(content) {

    console.log('Texto actual', content);

    if(this.isNew == true){
      this.isNew = false;
    }

    var contrato: Contrato = {
      content: content,
      idSindicato: this.idSindicato,
      isNew: this.isNew,
      isfinished: this.isFinished
    }

    this.contratoSvc.saveContractEdit(contrato);

  }

  onFinalizar(){

  
  }

  getUpdatedText(){

    
    this.db.collection("Contrato").doc(this.idSindicato).get().subscribe((snapshotChanges)=>{
      if(snapshotChanges.exists){

        this.content = snapshotChanges.data().content;
        this.textoFormControl.setValue(this.content);
        this.contratoExists = true;

      }
      else{
        this.contratoExists = false;
      }
      this.isLoading = false;
    })
  }

  isNewContract() {
    this.db.collection("Contrato").doc(this.idSindicato).get().subscribe((snapshotChanges) => {

      if (snapshotChanges.exists) {
        this.isNew = snapshotChanges.data().isNew;
        console.log("es nuevo? :",this.isNew)
        this.contratoExists = true;
      }
      else{
        this.contratoExists = false;
      }
    })
  }

  getIdSindicato() {
    this.db.collection("Sindicato").get().subscribe((querySnapshot) => {


      querySnapshot.forEach((doc) => {

        doc.data().usuarios.forEach(element => {

          if (element.correo == this.userEmail) {

            this.idSindicato = doc.data().idAdmin;

          }
        });

      });
    });

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
    this.isLoading = true;
    this.sindicatoSeleccionado = true;
    var sindicatoSeleccionado = this.selectedValue;
    console.log("valor seleccionado: ",sindicatoSeleccionado);
    this.idSindicato = sindicatoSeleccionado;
    setTimeout(() => {

      this.isNewContract();
      

    }, 1000)

    setTimeout(()=>{
      console.log("is new?: ",this.isNew);
      if(this.isNew == false){
        this.getUpdatedText()

      }
      else{
        this.textoFormControl.setValue(this.content)
      }
    },1500)

  }

}
