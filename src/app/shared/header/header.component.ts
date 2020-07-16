import { Component, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EventEmitter } from '@angular/core';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter()
  public user$: Observable <any>= this.authSvc.afAuth.user;
  constructor(private authSvc:AuthService,private router:Router) { }


  ngOnInit(): void {
  }


onToggle(){
  this.toggleSideBarForMe.emit();
}
  onLogout(){

    this.authSvc.logout();


}
}
