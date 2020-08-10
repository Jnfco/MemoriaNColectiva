import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import {
  ActivosC,
  ActivosNC,
  PasivosC,
  PasivosNC,
  Patrimonio,
  EstadoR,
  GananciaAntImp,
  GananciaAtribuible,
  EstadoResIntegrales,
} from '../shared/Interfaces/TablasI';
import { EstadoFinanciero } from '../shared/Interfaces/EstadoFinanciero';
import { BREAKPOINT } from '@angular/flex-layout';
import { snapshotChanges } from '@angular/fire/database';
import { InformacionInominada } from '../shared/Interfaces/InformacionInominada';
import { MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private userId: any;
  private estadoFinancieroDoc: any;
  private estadoFinanciero: EstadoFinanciero;
  private estadoFinancieroGet: EstadoFinanciero;
  constructor(
    public fireservices: AngularFirestore,
    public db: AngularFirestore,
    private snackbar: MatSnackBar
  ) {}

  SaveDocument(
    activosCorrientes: ActivosC[],
    activosNoCorrientes: ActivosNC[],
    pasivosCorrientes: PasivosC[],
    pasivocNoCorrientes: PasivosNC[],
    patrimonio: Patrimonio[],
    estadoResultados: EstadoR[],
    gananciaAntesImp: GananciaAntImp[],
    gananciaAtribuible: GananciaAtribuible[],
    estadoResIntegrales: EstadoResIntegrales[],
    userId: any
  ) {
    const estadoFinancieroID = Math.random();
    const estadoFinanciero = {
      activosCorrientes: activosCorrientes,
      activosNoCorrientes: activosNoCorrientes,
      pasivosCorrientes: pasivosCorrientes,
      pasivosNoCorrientes: pasivocNoCorrientes,
      patrimonio: patrimonio,
      estadoResultados: estadoResultados,
      gananciaAntesImp: gananciaAntesImp,
      gananciaAtribuible: gananciaAtribuible,
      estadoResIntegrales: estadoResIntegrales,
    };
    const estadoFinancieroRef: AngularFirestoreDocument<any> = this.db.doc(
      `EstadoFinanciero/${userId}`
    );
    console.log('Estado financiero ref: ',estadoFinanciero)
    this.snackbar.open("Datos guardados exitosamente!",'',{
      duration: 3000,
      verticalPosition:'bottom'
    });
    return estadoFinancieroRef.set(estadoFinanciero, { merge: true });
  }

  SaveInfoDocument (informacionInominada: InformacionInominada[],userId:any){


    const info = {
      info:informacionInominada
    }
    const informacionInominadaRef: AngularFirestoreDocument<any>= this.db.doc(
      `InformacionInnominada/${userId}`
    );
    console.log('Informacion innominada ref: ',informacionInominada)
    this.snackbar.open("Datos guardados exitosamente!",'',{
      duration: 3000,
      verticalPosition:'bottom'
    });
    return informacionInominadaRef.set(info,{merge:true});

  }

  returnEstadoFinanciero(doc: any):EstadoFinanciero {
    console.log(doc);
    var estado:EstadoFinanciero = {
      activosCorrientes: doc.activosCorrientes,
      activosNoCorrientes: doc.activosNoCorrientes,
      pasivosCorrientes: doc.pasivosCorrientes,
      pasivosNoCorrientes: doc.pasivosNoCorrientes,
      patrimonio: doc.patrimonio,
      estadoResultados: doc.estadoResultados,
      gananciaAntesImp: doc.gananciaAntesImp,
      gananciaAtribuible: doc.gananciaAtribuible,
      estadoResIntegrales: doc.estadoResIntegrales,
    };
    return estado;
  }
  GetDocument(userId: any) {
    var estadoFinancieroRef = this.db.collection(`EstadoFinanciero`).doc(userId);
    this.db.collection('EstadoFinanciero').doc(userId).get().subscribe((snapshotChanges) => {


        //this.returnEstadoFinanciero(snapshotChanges.data());
      });

  }

  deleteInfo (userId:any){

    this.snackbar.open("Datos eliminados exitosamente!",'',{
      duration: 3000,
      verticalPosition:'bottom'
    });

    return this.fireservices.collection("InformacionInnominada").doc(userId).delete();

  }

  deleteEstado(userId:any){

    this.snackbar.open("Datos eliminados exitosamente!",'',{
      duration: 3000,
      verticalPosition:'bottom'
    });

    return this.fireservices.collection("EstadoFinanciero").doc(userId).delete();

  }

}
