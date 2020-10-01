import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FundacionService } from '../services/fundacion.service';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/firestore';
import { InactiveUserFundacion } from '../shared/Interfaces/InactiveUserFundacion';
import { UsuarioFundacion } from '../shared/Interfaces/UsuarioFundacion';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import * as firebase from 'firebase';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-crear-fundacion',
  templateUrl: './crear-fundacion.component.html',
  styleUrls: ['./crear-fundacion.component.css']
})
export class CrearFundacionComponent implements OnInit {

  constructor(public router: Router, private fundSvc: FundacionService, private authSvc: AuthService, private snackbar: MatSnackBar, private dialog: MatDialog, public db: AngularFirestore) { }
  displayedColumns: string[] = [
    'Nombre', 'Correo', 'Contraseña', 'columndelete'
  ];
  dataSource: any;
  usuarioFundacion: InactiveUserFundacion[];
  sinUusuarios: UsuarioFundacion[];
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

  nombreFundacionFormControl = new FormControl('', [
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
  validated = false;
  hasMember: boolean;

  validEmail: boolean;

  userpass: any;
  ngOnInit(): void {
    this.usuarioFundacion = [];
    this.userId = firebase.auth().currentUser.uid;
  }
  get passwordInput() { return this.password }
  onAddUser() {
    console.log("length: ", this.usuarioFundacion.length)
    if (this.usuarioFundacion.length > 0) {
      if (this.usuarioFundacion[this.usuarioFundacion.length - 1].correo != "") {


        //this.usuarioSindicato = [];
        this.isUser = true;
        var usuario = {
          nombre: "",
          correo: "",
          pass: "",
          organization: "Fundacion",
          idFundacion: this.userId,
          isAdmin: false
        }
        this.usuarioFundacion.push(usuario);
        this.dataSource = new MatTableDataSource<UsuarioFundacion>(this.usuarioFundacion);
        console.log('datasource', this.dataSource)

      }
      this.hasMember = true;
    }
    else if (this.usuarioFundacion.length == 0) {
      this.isUser = true;
      var usuario = {
        nombre: "",
        correo: "",
        pass: "",
        organization: "Fundacion",
        idFundacion: this.userId,
        isAdmin: false
      }
      this.usuarioFundacion.push(usuario);
      this.dataSource = new MatTableDataSource<UsuarioFundacion>(this.usuarioFundacion);
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
        console.log("elemento a borrar: ", elm)
        this.dataSource.data = this.dataSource.data
          .filter(i => i !== elm)
          .map((i, idx) => (i.position = (idx + 1), i));
        const index: number = this.usuarioFundacion.indexOf(elm);
        this.usuarioFundacion.splice(index, 1);

      }
    });


  }
  evaluateEmailRegex(expresion: string): void {
    var regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;


    if (!regex.test(expresion)) {
      console.log(expresion);
      console.log('Email invalido !', regex.test(expresion));
      this.validEmail = false;
    }


  }

  evaluatePassRegex(expresion: string): void {
    var regex = /^.{7,}$/;


    if (!regex.test(expresion)) {
      console.log(expresion);
      console.log('Password muy corta!', regex.test(expresion));
      this.validEmail = false;
    }

  }

  onCrearFundacion() {

    this.validEmail = true;

    console.log('lista de correos: ', this.usuarioFundacion)
    this.usuarioFundacion.forEach(element => {

      this.evaluateEmailRegex(element.correo);
      this.evaluatePassRegex(element.pass);
    })

    if (this.validEmail == true) {
      if (this.usuarioFundacion.length == 1) {

        var correo = this.usuarioFundacion[0].correo;
        this.searchEmail(correo);
        this.emailSaved = correo;
        console.log("existe el correo ya ?: ", this.emailExist);
        console.log("correo ingresado: ", this.emailSaved);






        setTimeout(() => {
          if (this.emailExist == false) {
            this.usuarioFundacion.forEach(element => {
              //this.authSvc.registerWithSindicate(element.correo, element.pass, element.nombre, "Sindicato", false, this.userId);
              //A continuación se va a agregar el usuario a una tabla de usuarios con cuentas inactivas, no se agregará al sindicato inmediatamente
              this.authSvc.addNewInactiveUser(element.nombre, element.correo, element.pass, this.userId,"Fundación");
              console.log('element: ', element);
            });



            //Aqui se crea la fundacion con el administrador como usuario por defecto
            this.db.collection("users").doc(this.userId).get().subscribe((snapshotChanges) => {

              if (snapshotChanges.exists) {

                console.log("ID del usuario antes de crear: ", this.userId)
                var admin: UsuarioFundacion = {
                  nombre: snapshotChanges.data().name,
                  correo: snapshotChanges.data().email,
                  idFundacion: this.userId,
                  pass: ""
                }
                console.log("admin antes de service: ", admin)

                this.fundSvc.createFundacionWithAdmin(this.group.get('nameControl').value, this.userId, admin);
                this.snackbar.open("Fundación creada con éxito ", '', {
                  duration: 3000,
                  verticalPosition: 'bottom'
                });

              }
            })
          }
          else {
            this.snackbar.open("No se pudo crear la fundación, el correo ingresado " + this.emailSaved + " ya se encuentra en otra fundación", '', {
              duration: 3000,
              verticalPosition: 'bottom'
            });
          }

        }, 500);

      }
      if (this.usuarioFundacion.length > 1) {
        this.validateEmailList();
      }

      if (this.usuarioFundacion.length == 0) {

        this.db.collection("users").doc(this.userId).get().subscribe((snapshotChanges) => {

          if (snapshotChanges.exists) {

            console.log("ID del usuario antes de crear: ", this.userId)
            var admin: UsuarioFundacion = {
              nombre: snapshotChanges.data().name,
              correo: snapshotChanges.data().email,
              idFundacion: this.userId,
              pass: ""
            }
            console.log("admin antes de service: ", admin)

            this.fundSvc.createFundacionWithAdmin(this.group.get('nameControl').value, this.userId, admin);
            this.snackbar.open("Fundación creada con éxito ", '', {
              duration: 3000,
              verticalPosition: 'bottom'
            });

          }
        })
      }



    }
    else {
      console.log("algunos campos inválidos, revise antes de crear la fundación")
      this.snackbar.open("algunos campos inválidos, revise antes de crear la fundación ", '', {
        duration: 3000,
        verticalPosition: 'bottom'
      });
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

      for (let i = 0; i < this.usuarioFundacion.length; i++) {

        querySnapshot.forEach((doc) => {
          console.log("docs: ", doc.data().email)
          if (doc.data().email == this.usuarioFundacion[i].correo) {
            this.existingEmails.push(this.usuarioFundacion[i].correo)


          }
        })
      }


      console.log('email encontrados: ', this.existingEmails)
      if (this.existingEmails.length > 0) {
        this.snackbar.open("No se pudo crear la fundación, algunos correos ingresados pertenecen a una cuenta existente!: " + this.existingEmails, '', {
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

        for (let i = 0; i < this.usuarioFundacion.length; i++) {

          this.authSvc.addNewInactiveUser(this.usuarioFundacion[i].nombre, this.usuarioFundacion[i].correo, this.usuarioFundacion[i].pass, this.userId,"Fundación");

        }
        //Aqui se crea el sindicato con el administrador como usuario por defecto
        this.db.collection("users").doc(this.userId).get().subscribe((snapshotChanges) => {

          if (snapshotChanges.exists) {

            console.log("ID del usuario antes de crear: ", this.userId)
            var admin: UsuarioFundacion = {
              nombre: snapshotChanges.data().name,
              correo: snapshotChanges.data().email,
              idFundacion: this.userId,
              pass: ""
            }
            console.log("admin antes de service: ", admin)

            this.fundSvc.createFundacionWithAdmin(this.group.get('nameControl').value, this.userId, admin);
            this.snackbar.open("Fundación creada con éxito ", '', {
              duration: 3000,
              verticalPosition: 'bottom'
            });

          }
        })

      }
    })

  }



}
