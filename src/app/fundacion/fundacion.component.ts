import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioFundacion } from '../shared/Interfaces/UsuarioFundacion';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FundacionService } from '../services/fundacion.service';
import { MatDialog } from '@angular/material/dialog';
import * as firebase from 'firebase';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { AgregarUsuarioFundacionComponent } from '../agregar-usuario-fundacion/agregar-usuario-fundacion.component';

@Component({
  selector: 'app-fundacion',
  templateUrl: './fundacion.component.html',
  styleUrls: ['./fundacion.component.css']
})
export class FundacionComponent implements OnInit {

 
  usuariosFundacion: UsuarioFundacion [];
  userId: any;
  displayedColumns: string[] = [
    'Nombre','Correo'
  ];
  dataSource: any;
  dataSourceNewUsers: any;
  dataSourcePendientes:any;

  
  nuevosUsuariosFundacion: UsuarioFundacion[];

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

  group= new FormGroup({
    nameControl: new FormControl('', [Validators.required, Validators.minLength(3)])
  })

  isUser = false;
  tieneFundacion = false;
  hide = true;
  nombreFundacion = "";
  isLoading = true;

  existingEmails: string [];
  usuariosPendientes:UsuarioFundacion[];
  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  constructor(public router: Router,public db: AngularFirestore,private authSvc:AuthService,private snackbar: MatSnackBar,private fundSvc:FundacionService,private dialog: MatDialog) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.userId = firebase.auth().currentUser.uid;
    this.usuariosFundacion = [];
    this.nuevosUsuariosFundacion = [];
    this.usuariosPendientes = [];
    
    this.getFundacion(this.userId);
    this.getPendientes();
    
    
    console.log('cantidad de usuarios en fundacion: ',this.usuariosFundacion.length);
  }
  onCrearFundacion (){
    this.router.navigate(['/home/crearFundacion']);
    
  }

  getPendientes(){
    this.usuariosPendientes = [];
console.log("get pendientes:")
    this.db.collection("InactiveUsers").get().subscribe((querySnapshot)=>{

      querySnapshot.forEach((doc)=> {

        var user = doc.data();
        console.log("user data: ",user)
        if(user.idOrg == this.userId){

          var usuario:UsuarioFundacion = {
            nombre:user.nombre,
            correo:user.correo,
            idFundacion:user.idOrg,
            pass:user.pass
          }
          console.log("pendientes: ",usuario)

          this.usuariosPendientes.push(usuario);

        }

      })

      this.dataSourcePendientes = new MatTableDataSource<UsuarioFundacion>(this.usuariosPendientes);
    });

  }


  getFundacion (userId: any){

    

    this.db.collection('Fundacion').doc(userId).get().subscribe((snapshotChanges) =>{

      if(snapshotChanges.exists){
        this.tieneFundacion = true;
        var doc = snapshotChanges.data();
        var fundacion = doc.usuarios;
        this.nombreFundacion = doc.nombreFundacion
        console.log (this.nombreFundacion)
        for(let i = 0;i< fundacion.length; i++){

          var usuario = {
            nombre: fundacion[i].nombre,
            correo: fundacion[i].correo,
            pass: fundacion[i].pass,
            idFundacion: fundacion[i].uid
          }
          this.usuariosFundacion.push(usuario);
         
        }
        
        this.dataSource = new MatTableDataSource<UsuarioFundacion>(this.usuariosFundacion);
        console.log('usuarios: ',this.usuariosFundacion);
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
      idFundacion:this.userId
    }
    this.usuariosFundacion.push(usuario);
    console.log('usuarios nuevos: ',this.usuariosFundacion)
    this.dataSource = new MatTableDataSource<UsuarioFundacion>(this.usuariosFundacion);
  
    
  }

  addRowData(row_obj){
    this.dataSource = this.usuariosFundacion;
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
      const index: number = this.usuariosFundacion.indexOf(elm);
      this.usuariosFundacion.splice(index,1);
       
      }
    });

    
  }

  validateEmailList() {

    this.existingEmails = [];
    
    this.db.collection("users").get().subscribe((querySnapshot) => {

      for(let i = 0; i< this.usuariosFundacion.length;i++){

        querySnapshot.forEach((doc) => {
          console.log("docs: ", doc.data().email)
          if (doc.data().email == this.usuariosFundacion[i].correo) {
            this.existingEmails.push(this.usuariosFundacion[i].correo)
            
  
          }
        })
      }
      

      console.log('email encontrados: ',this.existingEmails)
      if(this.existingEmails.length >0){
        this.snackbar.open("No se pudo crear fundacion, algunos correos ingresados pertenecen a una cuenta existente!: " + this.existingEmails, '', {
          duration: 3000,
          verticalPosition: 'bottom'
        });
      }
      else {
        for (let i = 0; i < this.usuariosFundacion.length; i++) {
          ///this.authSvc.registerWithSindicate(this.usuarioSindicato[i].correo, this.usuarioSindicato[i].pass, this.usuarioSindicato[i].nombre, "Sindicato", false, this.userId);
          
        }
        this.fundSvc.crearFundacion(this.group.get('nameControl').value, this.userId);
      }
    })

  }


  openDialog(): void {

    const dialogRef = this.dialog.open(AgregarUsuarioFundacionComponent, {
      width: '800px'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.usuariosPendientes = [];
      this.getPendientes();
    });
    
  }

}
