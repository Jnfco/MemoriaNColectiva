import { Component, Inject, OnInit } from '@angular/core';
import { snapshotChanges } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-detalle-evento-fundacion',
  templateUrl: './modal-detalle-evento-fundacion.component.html',
  styleUrls: ['./modal-detalle-evento-fundacion.component.css']
})
export class ModalDetalleEventoFundacionComponent implements OnInit {

  tituloFormControl = new FormControl('', [Validators.required]);
  descripcionFormControl = new FormControl('', []);

  fechaFormControl = new FormControl('', [Validators.required]);
  nombreSindicatoFormControl = new FormControl('', [Validators.required]);
  nombreSindicato:string;
  descripcionExist:boolean;
  constructor( @Inject(MAT_DIALOG_DATA) public data: any,public db: AngularFirestore) {
    this.getSindicato();
   }

  ngOnInit(): void {
    
    console.log("evento seleccionado: ",this.data.evento)
    this.tituloFormControl.setValue(this.data.evento.nombre);
    if(this.data.evento.descripcion == ""){
      this.descripcionExist = false;
      
    }
    else{
      this.descripcionExist= true;
    }
    this.descripcionFormControl.setValue(this.data.evento.descripcion);
    this.fechaFormControl.setValue(this.data.evento.fecha);
  }


  getSindicato(){

    this.db.collection("Sindicato").doc(this.data.evento.idSindicato).get().subscribe((snapshotChanges)=>{

      this.nombreSindicato = snapshotChanges.data().nombreSindicato;
      this.nombreSindicatoFormControl.setValue(this.nombreSindicato);
    })
  }

}
