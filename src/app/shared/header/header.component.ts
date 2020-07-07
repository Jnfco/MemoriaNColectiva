import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {


  public user$: Observable <any>= this.authSvc.afAuth.user;
  constructor(private authSvc:AuthService,private router:Router) { }


  ngOnInit(): void {
  }


  onLogout(){

    this.authSvc.logout();


}
}
