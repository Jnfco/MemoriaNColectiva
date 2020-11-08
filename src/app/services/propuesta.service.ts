import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { datoPropuesta, Propuesta } from '../shared/Interfaces/Propuesta';

@Injectable({
  providedIn: 'root'
})
export class PropuestaService {

  constructor(public db: AngularFirestore) { }



  guardarPropuestaSindicato(idSindicato:string,datosPropAdmin:datoPropuesta[],datosPropTrab:datoPropuesta[],id:string,añosVigencia:number[],categoriasAdmin:string[],categoriasTrab:string[]){

    var propuesta: Propuesta ={
      idSindicato:idSindicato,
      datosAdminPropuesta:datosPropAdmin,
      datosTrabPropuesta:datosPropTrab,
      aniosVigencia:añosVigencia,
      categoriasAdmin: categoriasAdmin,
      categoriasTrab:categoriasTrab
    }

    const propuestaRef:AngularFirestoreDocument<any> = this.db.doc(
      `Propuesta/${id}`
    );
    
    return propuestaRef.set(propuesta, { merge: true });

  }
}
