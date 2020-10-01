import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioSindicato } from '../shared/Interfaces/UsuarioSindicato';
import { AngularFirestore } from '@angular/fire/firestore';
import { snapshotChanges } from '@angular/fire/database';
import * as firebase from 'firebase';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SindicatoService } from '../services/sindicato.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { AgregarUsuarioSindicatoComponent } from '../agregar-usuario-sindicato/agregar-usuario-sindicato.component';
@Component({
  selector: 'app-sindicato',
  templateUrl: './sindicato.component.html',
  styleUrls: ['./sindicato.component.css']
})
export class SindicatoComponent implements OnInit {

  usuariosSindicato: UsuarioSindicato [];
  userId: any;
  displayedColumns: string[] = [
    'Nombre','Correo'
  ];
  dataSource: any;
  dataSourceNewUsers: any;
  dataSourcePendientes:any;

  usuarioSindicato: UsuarioSindicato[];
  nuevosUsuariosSindicato: UsuarioSindicato[];

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
  tieneSindicato = false;
  hide = true;
  nombreSindicato = "";
  isLoading = true;

  existingEmails: string [];
  usuariosPendientes:UsuarioSindicato[];
  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  constructor(public router: Router,public db: AngularFirestore,private authSvc:AuthService,private snackbar: MatSnackBar,private sinSvc:SindicatoService,private dialog: MatDialog) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.userId = firebase.auth().currentUser.uid;
    this.usuariosSindicato = [];
    this.nuevosUsuariosSindicato = [];
    this.usuariosPendientes = [];
    
    this.getSindicato(this.userId);
    this.getPendientes();
    
    
    console.log('cantidad de usuarios en sindicato: ',this.usuariosSindicato.length);
  }
  onCrearSindicato (){
    this.router.navigate(['/home/crearSindicato']);
    
  }

  getPendientes(){
    this.usuariosPendientes = [];

    this.db.collection("InactiveUsers").get().subscribe((querySnapshot)=>{

      querySnapshot.forEach((doc)=> {

        var user = doc.data();
        if(user.idSindicato == this.userId){

          var usuario:UsuarioSindicato = {
            nombre:user.nombre,
            correo:user.correo,
            idSindicato:user.idOrg,
            pass:user.pass
          }

          this.usuariosPendientes.push(usuario);

        }

      })

      this.dataSourcePendientes = new MatTableDataSource<UsuarioSindicato>(this.usuariosPendientes);
    });

  }


onModificarSindicato(){

  //Para agregar a los nuevos usuarios al sistema
  this.usuariosSindicato.forEach(element => {
   this.authSvc.register(element.correo,element.pass,element.nombre,"Sindicato",false);

  });
  
//Para modificar el sindicato actual
//Primero cambia el nombre del sindicato
  this.sinSvc.createSindicato(this.group.get('nameControl').value,this.userId);
  //Luego se agregan las cuentas nuevas sin activar de usuarios nuevos agregados al sindicato


  this.snackbar.open("Datos guardados exitosamente!",'',{
    duration: 3000,
    verticalPosition:'bottom'
  });
}
  getSindicato (userId: any){

    

    this.db.collection('Sindicato').doc(userId).get().subscribe((snapshotChanges) =>{

      if(snapshotChanges.exists){
        this.tieneSindicato = true;
        var doc = snapshotChanges.data();
        var sindicato = doc.usuarios;
        this.nombreSindicato = doc.nombreSindicato
        console.log (this.nombreSindicato)
        for(let i = 0;i< sindicato.length; i++){

          var usuario = {
            nombre: sindicato[i].nombre,
            correo: sindicato[i].correo,
            pass: sindicato[i].pass,
            idSindicato: sindicato[i].uid
          }
          this.usuariosSindicato.push(usuario);
         
        }
        
        this.dataSource = new MatTableDataSource<UsuarioSindicato>(this.usuariosSindicato);
        console.log('usuarios: ',this.usuariosSindicato);
        console.log('datasource: ',this.dataSource.data)
        this.isLoading = false;
        
      }
      else{
        this.isLoading = false;
      }
    })

  }

  onAddUser(){
    //this.usuarioSindicato = [];
    this.isUser = true;
    var usuario = {
      nombre: "",
      correo: "",
      pass: "",
      idSindicato:this.userId
    }
    this.usuariosSindicato.push(usuario);
    console.log('usuarios nuevos: ',this.usuariosSindicato)
    this.dataSource = new MatTableDataSource<UsuarioSindicato>(this.usuariosSindicato);
  
    
  }

  addRowData(row_obj){
    this.dataSource = this.usuariosSindicato;
    this.dataSource.push({
      nombre: "",
      correo: "",
      pass: ""
    });
    this.table.renderRows();
    
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
      const index: number = this.usuariosSindicato.indexOf(elm);
      this.usuariosSindicato.splice(index,1);
       
      }
    });

    
  }

  validateEmailList() {

    this.existingEmails = [];
    
    this.db.collection("users").get().subscribe((querySnapshot) => {

      for(let i = 0; i< this.usuariosSindicato.length;i++){

        querySnapshot.forEach((doc) => {
          console.log("docs: ", doc.data().email)
          if (doc.data().email == this.usuariosSindicato[i].correo) {
            this.existingEmails.push(this.usuariosSindicato[i].correo)
            
  
          }
        })
      }
      

      console.log('email encontrados: ',this.existingEmails)
      if(this.existingEmails.length >0){
        this.snackbar.open("No se pudo crear sindicato, algunos correos ingresados pertenecen a una cuenta existente!: " + this.existingEmails, '', {
          duration: 3000,
          verticalPosition: 'bottom'
        });
      }
      else {
        for (let i = 0; i < this.usuariosSindicato.length; i++) {
          ///this.authSvc.registerWithSindicate(this.usuarioSindicato[i].correo, this.usuarioSindicato[i].pass, this.usuarioSindicato[i].nombre, "Sindicato", false, this.userId);
          
        }
        this.sinSvc.createSindicato(this.group.get('nameControl').value, this.userId);
      }
    })

  }


  openDialog(): void {

    const dialogRef = this.dialog.open(AgregarUsuarioSindicatoComponent, {
      width: '800px'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.usuariosPendientes = [];
      this.getPendientes();
    });
    
  }
}
