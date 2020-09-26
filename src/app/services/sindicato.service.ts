import { Injectable } from '@angular/core';
import { UsuarioSindicato } from '../shared/Interfaces/UsuarioSindicato';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SindicatoService {

  constructor(
    public fireservices: AngularFirestore,
    public db: AngularFirestore,public router: Router) { }

  createSindicato (nombreSindicato:string,userId:any){
      console.log("creando sindicato");

  
    const sindicato ={
      nombreSindicato: nombreSindicato,
      idAdmin:userId
    }

    const sindicatoRef:AngularFirestoreDocument<any> = this.db.doc(
      `Sindicato/${userId}`
    );
    this.router.navigate(['/home']);
    return sindicatoRef.set(sindicato, { merge: true });

  }

  createSindicatoWithAdmin (nombreSindicato:string,userId:any,admin:UsuarioSindicato){
    console.log("creando sindicato");
    console.log("admin en service: ",admin)
    var listaSindicatoAdmin:UsuarioSindicato[];
    listaSindicatoAdmin = [];
    listaSindicatoAdmin.push(admin);
    const sindicato ={
      nombreSindicato: nombreSindicato,
      idAdmin:userId,
      usuarios:listaSindicatoAdmin
    }

    const sindicatoRef:AngularFirestoreDocument<any> = this.db.doc(
      `Sindicato/${userId}`
    );
    this.router.navigate(['/home']);
    return sindicatoRef.set(sindicato, { merge: true });
  }


 
}
