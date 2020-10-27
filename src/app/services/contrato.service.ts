import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Contrato } from '../shared/Interfaces/Contrato';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HistorialDocSindicato } from '../shared/Interfaces/Historial';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {

  constructor(public db: AngularFirestore, private snackbar: MatSnackBar, public fireservices: AngularFirestore, public router: Router) { }


  saveContractEdit(contrato:Contrato){

    

    const contratoRef: AngularFirestoreDocument<any> = this.db.doc(`Contrato/${contrato.idSindicato}`);
      this.snackbar.open("Documento guardado",'',{
        duration: 3000,
        verticalPosition:'bottom'
      });
      return contratoRef.set(contrato,{merge: true});

  }

  saveDocToHistory(historialDocSindicato:HistorialDocSindicato,idCambio:string){


    const historyRef: AngularFirestoreDocument<any> = this.db.doc(`Historial/${idCambio}`);

    return historyRef.set(historialDocSindicato,{merge: true});

  }
  
}
