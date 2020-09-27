import { Component, OnInit } from '@angular/core';
import { UsuarioSindicato } from '../shared/Interfaces/UsuarioSindicato';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { SindicatoService } from '../services/sindicato.service';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/firestore';
import { snapshotChanges } from '@angular/fire/database';
import { element } from 'protractor';
import { async } from '@angular/core/testing';
import { InactiveUser } from '../shared/Interfaces/InactiveUser';

@Component({
  selector: 'app-crear-sindicato',
  templateUrl: './crear-sindicato.component.html',
  styleUrls: ['./crear-sindicato.component.css']
})
export class CrearSindicatoComponent implements OnInit {

  constructor(public router: Router, private sinSvc: SindicatoService, private authSvc: AuthService, private snackbar: MatSnackBar, private dialog: MatDialog, public db: AngularFirestore) { }
  displayedColumns: string[] = [
    'Nombre', 'Correo', 'Contraseña', 'columndelete'
  ];
  dataSource: any;
  usuarioSindicato: InactiveUser[];
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

  group = new FormGroup({
    nameControl: new FormControl('', [Validators.required, Validators.minLength(3)])
  })

  isUser = false;
  userId: any;

  hide = true;

  emailExist = false;

  emailSaved: string;

  existingEmails: string[];
  validated  = false;
  hasMember:boolean;

  userpass:any;
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
  onAddUser() {
    console.log("length: ", this.usuarioSindicato.length)
    if (this.usuarioSindicato.length > 0) {
      if (this.usuarioSindicato[this.usuarioSindicato.length - 1].correo != "") {


        //this.usuarioSindicato = [];
        this.isUser = true;
        var usuario = {
          nombre: "",
          correo: "",
          pass: "",
          organization:"Sindicato",
          idSindicato: this.userId,
          isAdmin:false
        }
        this.usuarioSindicato.push(usuario);
        this.dataSource = new MatTableDataSource<UsuarioSindicato>(this.usuarioSindicato);
        console.log('datasource', this.dataSource)

      }
      this.hasMember =true;
    }
    else if (this.usuarioSindicato.length == 0) {
      this.isUser = true;
      var usuario = {
          nombre: "",
          correo: "",
          pass: "",
          organization:"Sindicato",
          idSindicato: this.userId,
          isAdmin:false
      }
      this.usuarioSindicato.push(usuario);
      this.dataSource = new MatTableDataSource<UsuarioSindicato>(this.usuarioSindicato);
      this.hasMember = false;
    }

  }

  delete(elm) {

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: '¿Está seguro que quiere eliminar este usuario?',
        buttonText: {
          ok: 'Aceptar',
          cancel: 'Cancelar'
        }
      }
    });


    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        console.log("elemento a borrar: ",elm)
        this.dataSource.data = this.dataSource.data
          .filter(i => i !== elm)
          .map((i, idx) => (i.position = (idx + 1), i));
        const index: number = this.usuarioSindicato.indexOf(elm);
        this.usuarioSindicato.splice(index, 1);

      }
    });


  }


  onCrearSindicato() {

    console.log('lista de correos: ', this.usuarioSindicato)
    if (this.usuarioSindicato.length == 1) {

      var correo = this.usuarioSindicato[0].correo;
      this.searchEmail(correo);
      this.emailSaved = correo;
      console.log("existe el correo ya ?: ", this.emailExist);
      console.log("correo ingresado: ", this.emailSaved);






      setTimeout(() => {
        if (this.emailExist == false) {
          this.usuarioSindicato.forEach(element => {
            //this.authSvc.registerWithSindicate(element.correo, element.pass, element.nombre, "Sindicato", false, this.userId);
            //A continuación se va a agregar el usuario a una tabla de usuarios con cuentas inactivas, no se agregará al sindicato inmediatamente
            this.authSvc.addNewInactiveUser(element.nombre,element.correo,element.pass,this.userId);
            console.log('element: ', element);
          });



          //Aqui se crea el sindicato con el administrador como usuario por defecto
      this.db.collection("users").doc(this.userId).get().subscribe((snapshotChanges)=>{

        if(snapshotChanges.exists){

          console.log("ID del usuario antes de crear: ",this.userId)
          var admin:UsuarioSindicato = {
            nombre: snapshotChanges.data().name,
            correo: snapshotChanges.data().email,
            idSindicato: this.userId,
            pass: ""
          }
          console.log("admin antes de service: ",admin)

          this.sinSvc.createSindicatoWithAdmin(this.group.get('nameControl').value,this.userId,admin);

        }
      })
          /*this.sinSvc.createSindicato( this.group.get('nameControl').value, this.userId);
          
          this.snackbar.open("Datos guardados exitosamente!", '', {
            duration: 3000,
            verticalPosition: 'bottom'
          });*/
          //this.router.navigate(['/home']);
        }
        else {
          this.snackbar.open("No se pudo crear sindicato, el correo ingresado " + this.emailSaved + " ya se encuentra en otro sindicato", '', {
            duration: 3000,
            verticalPosition: 'bottom'
          });
        }

      }, 500);

    }
    else if (this.usuarioSindicato.length > 1) {
    this.validateEmailList();
    }

    

      
    

  }

  /**
   * Método que busca si un correo existe o no en los usuarios, devuelve un boolean
   */
  searchEmail(email: string) {

    this.emailExist = false;

    this.db.collection("users").get().subscribe((querySnapshot) => {


      querySnapshot.forEach((doc) => {
        console.log("doc: ", doc.data().email)
        if (doc.data().email == email) {
          console.log("A")
          this.emailExist = true;
          console.log("emaaaaaail: ", this.emailExist)

        }
      })
    })


  }

  validateEmailList() {

    this.existingEmails = [];
    
    this.db.collection("users").get().subscribe((querySnapshot) => {

      for(let i = 0; i< this.usuarioSindicato.length;i++){

        querySnapshot.forEach((doc) => {
          console.log("docs: ", doc.data().email)
          if (doc.data().email == this.usuarioSindicato[i].correo) {
            this.existingEmails.push(this.usuarioSindicato[i].correo)
            
  
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
        /*
        for (let i = 0; i < this.usuarioSindicato.length; i++) {
          //this.authSvc.registerWithSindicate(this.usuarioSindicato[i].correo, this.usuarioSindicato[i].pass, this.usuarioSindicato[i].nombre, "Sindicato", false, this.userId);
          
        }*/
        //this.sinSvc.createSindicato(this.usuarioSindicato, this.group.get('nameControl').value, this.userId);
        //A continuación se agregan los usuarios válidos a la tabla de usuarios con cuenta inactiva

        for (let i = 0; i <this.usuarioSindicato.length ; i++) {
          
          this.authSvc.addNewInactiveUser(this.usuarioSindicato[i].nombre,this.usuarioSindicato[i].correo,this.usuarioSindicato[i].pass,this.userId);
          
        }
        //Aqui se crea el sindicato con el administrador como usuario por defecto
      this.db.collection("users").doc(this.userId).get().subscribe((snapshotChanges)=>{

        if(snapshotChanges.exists){

          console.log("ID del usuario antes de crear: ",this.userId)
          var admin:UsuarioSindicato = {
            nombre: snapshotChanges.data().name,
            correo: snapshotChanges.data().email,
            idSindicato: this.userId,
            pass: ""
          }
          console.log("admin antes de service: ",admin)

          this.sinSvc.createSindicatoWithAdmin(this.group.get('nameControl').value,this.userId,admin);

        }
      })
        
      }
    })

  }


  createSindicato(){

  }

}
