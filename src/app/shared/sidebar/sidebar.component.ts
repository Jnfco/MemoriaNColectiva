import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent  {

  public user: Observable <any>= this.authSvc.afAuth.user;
  public userEmail:any;
  constructor(private authSvc:AuthService,private router:Router) { }


  ngOnInit(): void {
    this.userEmail = firebase.auth().currentUser.email
  }

}
