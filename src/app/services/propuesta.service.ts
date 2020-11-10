import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { datoPropuesta, Propuesta } from '../shared/Interfaces/Propuesta';

@Injectable({
  providedIn: 'root'
})
export class PropuestaService {

  constructor(public db: AngularFirestore) { }



  guardarPropuesta(idSindicato:string,datosPropAdmin:datoPropuesta[],datosPropTrab:datoPropuesta[],id:string,añosVigencia:number[],categoriasAdmin:string[],categoriasTrab:string[],esSindicato:boolean){

    if(esSindicato == true){
      id= idSindicato + "A";
    }
    else{
      id = idSindicato + "B";
    }
    
    var propuesta: Propuesta ={
      idSindicato:idSindicato,
      datosAdminPropuesta:datosPropAdmin,
      datosTrabPropuesta:datosPropTrab,
      aniosVigencia:añosVigencia,
      categoriasAdmin: categoriasAdmin,
      categoriasTrab:categoriasTrab,
      esSindicato:esSindicato
    }

    console.log("propuesta a agregar: ",propuesta)

    const propuestaRef:AngularFirestoreDocument<any> = this.db.doc(
      `Propuesta/${id}`
    );
    
    return propuestaRef.set(propuesta, { merge: true });

  }
}
