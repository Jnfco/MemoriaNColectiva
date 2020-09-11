import { Injectable } from '@angular/core';
import { UsuarioSindicato } from '../shared/Interfaces/UsuarioSindicato';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SindicatoService {

  constructor(
    public fireservices: AngularFirestore,
    public db: AngularFirestore,) { }

  createSindicato (usuarios:UsuarioSindicato [],nombreSindicato:string,userId:any){
      
    const sindicato ={
      usuarios: usuarios,
      nombreSindicato: nombreSindicato,
      idAdmin:userId
    }

    const sindicatoRef:AngularFirestoreDocument<any> = this.db.doc(
      `Sindicato/${userId}`
    );

    return sindicatoRef.set(sindicato, { merge: true });

  }

  getSindicato(){

  }
}