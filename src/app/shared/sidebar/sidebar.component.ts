import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';

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

            }
            else{

              
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

}
