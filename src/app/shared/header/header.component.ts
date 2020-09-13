import { Component, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EventEmitter } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter()
  public user$: Observable <any>= this.authSvc.afAuth.user;
  userId: any;
  isAdmin = false;
  constructor(private authSvc:AuthService,private router:Router,public db: AngularFirestore) { }


  ngOnInit(): void {
    this.userId = firebase.auth().currentUser.uid;

    this.db.collection('users').doc(this.userId).get().subscribe((snapshotChanges)=>{
      if(snapshotChanges.exists){
        console.log('existe')
        var doc = snapshotChanges.data();
        var isAdmin = doc.isAdmin;
        console.log('var isadmin= ',isAdmin)
        if(isAdmin == true){
          this.isAdmin =true;
        }
        else if(isAdmin == false){
          this.isAdmin =false;
        }
      }
    })
    //this.isAdmin = this.authSvc.isAdmin(this.userId);
    console.log('Es admin?: ',this.isAdmin)
    
  }


onToggle(){
  this.toggleSideBarForMe.emit();
}
  onLogout(){

    this.authSvc.logout();


}
}
