import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { Reunion } from '../shared/Interfaces/Reunion';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  sideBarOpen = true;
  userId: any;

  constructor(public db: AngularFirestore) { }

  ngOnInit(): void {
    

    //Implementar la notificacion mediante la aplicación de una reunión.
    /*this.userId = firebase.auth().currentUser.uid;



      this.db.collection("Reunion").get().subscribe((querySnapshot)=>{

        querySnapshot.forEach((doc)=> {


          if(doc.data().idCreador == this.userId )
          {


            var reunion:Reunion = {
              idReunion: doc.data().idReunion,
              idCreador: doc.data().idCreador,
              titulo: doc.data().titulo,
              descripcion: doc.data().descripcion,
              fecha: doc.data().fecha,
              horaInicio: doc.data().horaInicio,
              horaTermino: doc.data().horaTermino,
              email: doc.data().email
            }



          }
        })




      })*/







  }

  sideBarToggler()
  {
    this.sideBarOpen =!this.sideBarOpen
  }

}
