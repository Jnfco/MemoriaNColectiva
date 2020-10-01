import { Injectable } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UsuarioFundacion } from '../shared/Interfaces/UsuarioFundacion';

@Injectable({
  providedIn: 'root'
})
export class FundacionService {



  constructor(public db: AngularFirestore, private snackbar: MatSnackBar, public fireservices: AngularFirestore, public router: Router) {



  }


  /**
   * Crar fundacion de abogados
   * @param nombreFundacion 
   * @param userId 
   */
  crearFundacion(nombreFundacion: string, userId: string) {

    console.log("creando fundacion");


    const fundacion = {
      nombreFundacion: nombreFundacion,
      idAdmin: userId
    }

    const fundacionRef: AngularFirestoreDocument<any> = this.db.doc(
      `Fundacion/${userId}`
    );
    this.router.navigate(['/home']);
    return fundacionRef.set(fundacion, { merge: true });


  }

  /**
   * Crear fundacion de abogados con el admin de usuario por defecto
   * @param nombreFundacion 
   * @param userId 
   * @param admin 
   */
  createFundacionWithAdmin (nombreFundacion:string,userId:any,admin:UsuarioFundacion){
    console.log("creando fundacion");
    console.log("admin en service: ",admin)
    var listaFundacionAdmin:UsuarioFundacion[];
    listaFundacionAdmin = [];
    listaFundacionAdmin.push(admin);
    const fundacion ={
      nombreFundacion: nombreFundacion,
      idAdmin:userId,
      usuarios:listaFundacionAdmin
    }

    const fundacionRef:AngularFirestoreDocument<any> = this.db.doc(
      `Fundacion/${userId}`
    );
    this.router.navigate(['/home']);
    return fundacionRef.set(fundacion, { merge: true });
  }


}
