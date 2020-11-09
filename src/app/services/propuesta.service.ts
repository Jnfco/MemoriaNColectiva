import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { datoPropuesta, Propuesta } from '../shared/Interfaces/Propuesta';

@Injectable({
  providedIn: 'root'
})
export class PropuestaService {

  constructor(public db: AngularFirestore) { }



  guardarPropuesta(idSindicato:string,datosPropAdmin:datoPropuesta[],datosPropTrab:datoPropuesta[],id:string,añosVigencia:number[],categoriasAdminSindicato:string[],categoriasTrabSindicato:string[],esSindicato:boolean,
    datosPropAdminEmpresa:datoPropuesta[],datosPropTrabEmpresa:datoPropuesta[],categoriasAdminEmpresa:string[],categoriasTrabEmpresa:string[]){

    var propuesta: Propuesta ={
      idSindicato:idSindicato,
      datosAdminPropuesta:datosPropAdmin,
      datosTrabPropuesta:datosPropTrab,
      aniosVigencia:añosVigencia,
      categoriasAdminSindicato: categoriasAdminSindicato,
      categoriasTrabSindicato:categoriasTrabSindicato,
      categoriasAdminEmpresa: categoriasAdminEmpresa,
      categoriasTrabEmpresa:categoriasTrabEmpresa,
      esSindicato:esSindicato,
      datosAdminEmpresaPropuesta:datosPropAdminEmpresa,
      datosTrabEmpresaPropuesta:datosPropTrabEmpresa
    }

    console.log("propuesta a agregar: ",propuesta)

    const propuestaRef:AngularFirestoreDocument<any> = this.db.doc(
      `Propuesta/${id}`
    );
    
    return propuestaRef.set(propuesta, { merge: true });

  }
}
