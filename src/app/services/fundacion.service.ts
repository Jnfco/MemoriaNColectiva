import { Injectable } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UsuarioFundacion, Abogado } from '../shared/Interfaces/UsuarioFundacion';
import { SindicatoService } from './sindicato.service';
import { UsuarioSindicato } from '../shared/Interfaces/UsuarioSindicato';
import { snapshotChanges } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class FundacionService {



  constructor(public db: AngularFirestore, private snackbar: MatSnackBar, public fireservices: AngularFirestore, public router: Router, private sindSvc: SindicatoService) {



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
    this.router.navigate(['/home/sindicatos-fundacion']);
    return fundacionRef.set(fundacion, { merge: true });


  }

  /**
   * Crear fundacion de abogados con el admin de usuario por defecto
   * @param nombreFundacion 
   * @param userId 
   * @param admin 
   */
  createFundacionWithAdmin(nombreFundacion: string, userId: any, admin: UsuarioFundacion) {
    console.log("creando fundacion");
    console.log("admin en service: ", admin)
    var listaFundacionAdmin: UsuarioFundacion[];
    listaFundacionAdmin = [];
    listaFundacionAdmin.push(admin);
    const fundacion = {
      nombreFundacion: nombreFundacion,
      idAdmin: userId,
      usuarios: listaFundacionAdmin
    }

    const fundacionRef: AngularFirestoreDocument<any> = this.db.doc(
      `Fundacion/${userId}`
    );
    this.router.navigate(['/home/fundacion']);
    return fundacionRef.set(fundacion, { merge: true });
  }


  createSindicatoFundacion(nombreSindicato: string, admin: any, idFundacion: string) {

    console.log("creando sindicato");
    console.log("admin en service: ", admin)
    var listaSindicatoAdmin: any[];
    listaSindicatoAdmin = [];
    listaSindicatoAdmin.push(admin);
    var listaAbogados: any[] = [];
    const sindicato = {
      nombreSindicato: nombreSindicato,
      idAdmin: admin.id,
      usuarios: listaSindicatoAdmin,
      idFundacion: idFundacion,
      abogados: listaAbogados
    }


    const sindicatoRef: AngularFirestoreDocument<any> = this.db.doc(
      `Sindicato/${admin.id}`
    );
    //this.router.navigate(['/home']);
    return sindicatoRef.set(sindicato, { merge: true });


  }

  addLawyerToSyndicate(idSindicato: string, abogados: Abogado[]) {


    this.db.collection("Sindicato").doc(idSindicato).get().subscribe((snapshotChanges) => {
      var abogadoList: Abogado[] = [];
      if (snapshotChanges.exists) {

        var sindicato = snapshotChanges.data();
        abogadoList = snapshotChanges.data().abogados;
        abogados.forEach(abogado => {
          var abogadoN = {
            nombre: abogado.nombre,
            correo: abogado.correo,
            posicion: 0
          }
          abogadoList.push(abogadoN);
        });






        var sindicatoN = {
          idAdmin: sindicato.idAdmin,
          idFundacion: sindicato.idFundacion,
          nombreSindicato: sindicato.nombreSindicato,
          usuarios: sindicato.usuarios,
          abogados: abogadoList

        }

        return this.fireservices.collection("Sindicato").doc(idSindicato).set(sindicatoN, { merge: true });

      }
    })

  }

  eliminarAbogado(correoAbogado: string, idSindicato: string) {

    this.db.collection("Sindicato").doc(idSindicato).get().subscribe((snapshotChanges) => {
      if (snapshotChanges.exists) {
        console.log("sindicato existe")

        var listaAbogados: any[] = [];
        snapshotChanges.data().abogados.forEach(element => {

          var abo = {
            nombre: element.nombre,
            correo: element.correo,
            posicion: element.posicion
          }
          console.log("abogadopasdasdas: ", abo)
          listaAbogados.push(abo);
        });


        //var listaAbogados = snapshotChanges.data().abogados;
        console.log("lista recien obtenida: ", listaAbogados)

        var sind = snapshotChanges.data();

        for (let i = 0; i < listaAbogados.length; i++) {

          if (correoAbogado == listaAbogados[i].correo) {

            console.log("correo encontrado: ", listaAbogados[i].correo);
            listaAbogados.splice(i, 1);

          }
        }
        if (listaAbogados.length == 0) {

          console.log("0");
        }
        



        var sindicato = {
          nombreSindicato: sind.nombreSindicato,
          idAdmin: sind.idAdmin,
          idFundacion: sind.idFundacion,
          usuarios: sind.usuarios,
          abogados: listaAbogados
        }

        console.log ("Sindicato nuevo: ",sindicato)
        const sindicatoRef: AngularFirestoreDocument<any> = this.db.doc(
          `Sindicato/${idSindicato}`);
        console.log("lista nueva: ", listaAbogados[0])
        return sindicatoRef.set(sindicato, { merge: true });
      }
    })

  }



}
