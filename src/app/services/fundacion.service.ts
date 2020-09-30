import { Injectable } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class FundacionService {

  

  constructor(public db:AngularFirestore,private snackbar: MatSnackBar) { 

    

  }


  crearFundacion(nombreFundacion:string,user:any,adminFundacion:any){

    console.log("alguien acá ?")
    var admin = {
      nombre:adminFundacion.nombre,
      correo:adminFundacion.correo,
      pass:adminFundacion.pass,
      idFundacion:adminFundacion.idFundacion
    }

    var userList:any [];
    userList.push(admin);

    var fundacion = {
      nombre:nombreFundacion,
      id:user.uid
    }

    const fundacionRef: AngularFirestoreDocument<any> = this.db.doc(
      `Fundacion/${user.uid}`
    );
    
    this.snackbar.open("Se ha creado la fundación: "+ nombreFundacion +" correctamente",'',{
      duration: 3000,
      verticalPosition:'bottom'
    });
    return fundacionRef.set(fundacion, { merge: true });

  };
  
}

  

