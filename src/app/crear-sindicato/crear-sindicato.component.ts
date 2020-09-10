import { Component, OnInit } from '@angular/core';
import { UsuarioSindicato } from '../shared/Interfaces/UsuarioSindicato';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-crear-sindicato',
  templateUrl: './crear-sindicato.component.html',
  styleUrls: ['./crear-sindicato.component.css']
})
export class CrearSindicatoComponent implements OnInit {

  constructor(public router: Router) { }
  displayedColumns: string[] = [
    'Nombre','Correo','Contraseña','columndelete'
  ];
  dataSource: any;
  usuarioSindicato: UsuarioSindicato[];
  password = new FormControl('', [
    Validators.required,
    Validators.min(7),
  ]);
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  nombreFormControl = new FormControl('', [
    Validators.required
  ]);
  
  nombreSindicatoFormControl = new FormControl('', [
    Validators.required
  ]);

  group= new FormGroup({
    nameControl: new FormControl('', [Validators.required, Validators.minLength(3)])
  })

  hide = true;
  ngOnInit(): void {
    this.usuarioSindicato = [];
    /*var usuario = {
      nombre: " ",
      correo: " ",
      pass: " "
    }
    this.usuarioSindicato.push(usuario);
    this.dataSource = new MatTableDataSource<UsuarioSindicato>(this.usuarioSindicato);*/

  }
  get passwordInput() { return this.password }  
  onAddUser(){
    //this.usuarioSindicato = [];
    var usuario = {
      nombre: "",
      correo: "",
      pass: ""
    }
    this.usuarioSindicato.push(usuario);
    this.dataSource = new MatTableDataSource<UsuarioSindicato>(this.usuarioSindicato);
  }

  delete(elm) {
    this.dataSource.data = this.dataSource.data
      .filter(i => i !== elm)
      .map((i, idx) => (i.position = (idx + 1), i));
      const index: number = this.usuarioSindicato.indexOf(elm);
      this.usuarioSindicato.splice(index,1);
  }

  onCrearSindicato (){
    this.router.navigate(['/home']);
  }

  
}
