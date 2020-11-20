import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { ContratoService } from '../services/contrato.service';
import * as firebase from 'firebase';
import { Contrato } from '../shared/Interfaces/Contrato';
import * as moment from 'moment';
import { HistorialDocSindicato } from '../shared/Interfaces/Historial';

@Component({
  selector: 'app-contrato-fundacion',
  templateUrl: './contrato-fundacion.component.html',
  styleUrls: ['./contrato-fundacion.component.css']
})
export class ContratoFundacionComponent implements OnInit {

  
  private content: string = "";
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
    this.getUpdatedText();
    setTimeout(()=>{
      console.log(" se va a ir al metodo guardar historial con el contenido: ",this.content)
      this.saveHistory();

    },1500)
    

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

  saveHistory(){
    console.log("contenido antes de guardar en historial: ",this.content)
    
      this.db.collection("users").doc(this.userId).get().subscribe((snapshotChanges)=>{
    
        var fechaHoy = new Date(Date.now());
        var fechaHoyFormatted = moment(fechaHoy).format("YYYY-MM-DD hh:mm");
        var uuid = require("uuid");
        var id = uuid.v4();
        var historialEdicion :HistorialDocSindicato = {
    
          idMiembro: this.userId,
          idSindicato: this.idSindicato,
          nombre:snapshotChanges.data().name,
          correo:snapshotChanges.data().email,
          documento: this.content,
          fecha: fechaHoyFormatted,
          idCambio:id
        }
        
        this.contratoSvc.saveDocToHistory(historialEdicion,id);
    
      })
    
     
    
    }

}
