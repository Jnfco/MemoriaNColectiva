import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { snapshotChanges } from '@angular/fire/database';
import { ContratoService } from '../services/contrato.service';
import { Contrato } from '../shared/Interfaces/Contrato';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';  
 
// Default export is a4 paper, portrait, using millimeters for units
//const doc = new jsPDF();

@Component({
  selector: 'app-contrato-colectivo',
  templateUrl: './contrato-colectivo.component.html',
  styleUrls: ['./contrato-colectivo.component.css']
})
export class ContratoColectivoComponent implements OnInit {

  
  private content: string = "";
  public isNew: boolean = true;
  public userId: any;
  public userEmail: any;
  public idSindicato: any;
  public isAdmin: boolean;
  public idFundacion: any;
  public isFinished = false; 
  public isLoading:boolean = true;

  textoFormControl = new FormControl('', [
    Validators.required
  ]);



  constructor(public db: AngularFirestore, private contratoSvc: ContratoService) {

    this.userId = firebase.auth().currentUser.uid;
    this.userEmail = firebase.auth().currentUser.email;
  }

  ngOnInit(): void {

    this.isLoading == true;
    this.getIdSindicato();
    setTimeout(() => {

      this.isNewContract();
      

    }, 1000)
    
    setTimeout(()=>{
      console.log("is new?: ",this.isNew);
      if(this.isNew == false){
       
        this.getUpdatedText()

      }
      else{
        console.log("ASDASDASDASD")
        this.textoFormControl.setValue(this.content)
        this.isLoading = false;
        
      }
    },1500)
  
    
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


      }
    })
    this.isLoading = false;
  }

  isNewContract() {
    this.db.collection("Contrato").doc(this.idSindicato).get().subscribe((snapshotChanges) => {

      if (snapshotChanges.exists) {
        this.isNew = snapshotChanges.data().isNew;
        console.log("es nuevo? :",this.isNew)

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



}



