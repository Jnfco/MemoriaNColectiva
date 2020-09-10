import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sindicato',
  templateUrl: './sindicato.component.html',
  styleUrls: ['./sindicato.component.css']
})
export class SindicatoComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit(): void {
  }
  onCrearSindicato (){
    this.router.navigate(['/home/crearSindicato']);
  }
}
