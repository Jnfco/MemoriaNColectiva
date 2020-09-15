import { Component, OnInit } from '@angular/core';
import { UsuarioSindicato } from '../shared/Interfaces/UsuarioSindicato';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { SindicatoService } from '../services/sindicato.service';
import { AuthService } from '../services/auth.service';
import { MatSnackBar} from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-crear-sindicato',
  templateUrl: './crear-sindicato.component.html',
  styleUrls: ['./crear-sindicato.component.css']
})
export class CrearSindicatoComponent implements OnInit {

  constructor(public router: Router, private sinSvc:SindicatoService, private authSvc:AuthService,private snackbar: MatSnackBar,private dialog: MatDialog, public db:AngularFirestore) { }
  displayedColumns: string[] = [
    'Nombre','Correo','Contraseña','columndelete'
  ];
  dataSource: any;
  usuarioSindicato: UsuarioSindicato[];
  sinUusuarios: UsuarioSindicato[];
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

  isUser = false;
  userId: any;

  hide = true;
  ngOnInit(): void {
    this.usuarioSindicato = [];
    this.userId = firebase.auth().currentUser.uid;
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
    this.isUser = true;
    var usuario = {
      nombre: "",
      correo: "",
      pass: "",
      uid:""
    }
    this.usuarioSindicato.push(usuario);
    this.dataSource = new MatTableDataSource<UsuarioSindicato>(this.usuarioSindicato);
    console.log('datasource', this.dataSource)
  }

  delete(elm) {

    const dialogRef = this.dialog.open(ConfirmationDialogComponent,{
      data:{
        message: '¿Está seguro que quiere eliminar este usuario?',
        buttonText: {
          ok: 'Aceptar',
          cancel: 'Cancelar'
        }
      }
    });
    

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.dataSource.data = this.dataSource.data
      .filter(i => i !== elm)
      .map((i, idx) => (i.position = (idx + 1), i));
      const index: number = this.usuarioSindicato.indexOf(elm);
      this.usuarioSindicato.splice(index,1);
       
      }
    });

    
  }


  onCrearSindicato (){

    
    
    
  
    this.usuarioSindicato.forEach(element => {
       this.authSvc.registerWithSindicate(element.correo,element.pass,element.nombre,"Sindicato",false,this.userId);
         
      console.log('element: ',element);
    });
    

    this.sinSvc.createSindicato(this.usuarioSindicato,this.group.get('nameControl').value,this.userId);
    
    this.snackbar.open("Datos guardados exitosamente!",'',{
      duration: 3000,
      verticalPosition:'bottom'
    });
  }


  
}
