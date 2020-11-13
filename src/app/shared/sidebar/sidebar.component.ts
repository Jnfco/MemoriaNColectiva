import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { snapshotChanges } from '@angular/fire/database';
import { timeStamp } from 'console';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent  {

  public user: Observable <any>= this.authSvc.afAuth.user;
  public userEmail:any;
  userId:any;
  sindicato :boolean;
  sindicatoAsociado:boolean;
  isFundAdmin:boolean;
  constructor(private authSvc:AuthService,private router:Router,public db: AngularFirestore) { }


  ngOnInit(): void {
    this.userId = firebase.auth().currentUser.uid;
    this.userEmail = firebase.auth().currentUser.email
    this.db.collection("users").get().subscribe((querySnapshot)=>{

      querySnapshot.forEach((doc)=> {

        if(doc.data().uid == this.userId)
        {
          console.log("org: ",doc.data().organization)
            if(doc.data().organization == "Sindicato")
            {

              console.log("Es sindicato!!");
              this.sindicato = true;
              this.buscarSindicatoAsociado();

            }
            else{
              this.sindicatoAsociado= true;
              
              this.sindicato = false;
              if(doc.data().isAdmin == true){
                this.isFundAdmin = true;

              }
              else{
                this.isFundAdmin = false;
              }
              
            }
        }

      });
    });

    
  }

  buscarSindicatoAsociado(){

    this.db.collection("users").doc(this.userId).get().subscribe((snapshotChanges)=>{

      if(snapshotChanges.exists){
        var emailUser;

          emailUser = snapshotChanges.data().email;

          this.db.collection("Sindicato").get().subscribe((querySnapshot)=>{
            querySnapshot.forEach((doc)=>{

              doc.data().usuarios.forEach(element => {

                if(element.email == emailUser){
                  console.log("usuario pertenece al sindicato y es admin");
                  this.sindicatoAsociado = true;

                }
                
              });
              
            });
          })

        

      }
    })
  }

}
