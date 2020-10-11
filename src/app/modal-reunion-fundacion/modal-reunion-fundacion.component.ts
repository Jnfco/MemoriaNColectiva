import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ReunionFundacion } from '../shared/Interfaces/Reunion';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MeetingService } from '../services/meeting.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFirestore } from '@angular/fire/firestore';
import * as moment from 'moment';
import * as firebase from 'firebase';
import { snapshotChanges } from '@angular/fire/database';
import { UsuarioFundacion } from '../shared/Interfaces/UsuarioFundacion';
import { UserInfo } from 'os';

@Component({
  selector: 'app-modal-reunion-fundacion',
  templateUrl: './modal-reunion-fundacion.component.html',
  styleUrls: ['./modal-reunion-fundacion.component.css']
})
export class ModalReunionFundacionComponent implements OnInit {


  //FormControls

  tituloFormControl = new FormControl('', [
    Validators.required,
  ]);
  descripcionFormControl = new FormControl('', [

  ])

  fechaFormControl = new FormControl('', [
    Validators.required
  ])
  horaInicioFormControl = new FormControl('', [
    Validators.required
  ])
  horaTerminoFormControl = new FormControl('', [
    Validators.required
  ])

  //Interfaz Reunion
  reunion: ReunionFundacion;
  userId: any;
  userEmail: any;

  //booleanos
  horaCorrecta = true;
  horaInicioVacia = false;
  horaTerminoVacia = false;
  tituloVacío = true;
  horaInicioMayorNoVacio = false;
  fechaVacia = true;
  listaEventos: any[]
  fechaCorrecta: boolean = true;

  public idSindicatoUser: string;

  //Lista de sindicatos asociados
  public sindicatoList: any[] = [];
  //Lista de abogados asociados
  public abogadoList: any[] = [];

  //Sindicato seleccionado
  public selectedSindicato: string;
  //Abogado seleccionado
  public selectedAbogado: string;


  sindicatosAsociados: string[] = [];

  abogadosAsociados: string[] = [];

  public idAbogado: any;

  public sindicatoSelected = false;

  public idFundacion:string;

  constructor(
    public dialogRef: MatDialogRef<ModalReunionFundacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public meetingSvc: MeetingService, public snackbar: MatSnackBar, public db: AngularFirestore) {

    this.userEmail = firebase.auth().currentUser.email;
    var actualDate = moment();
    var formattedFecha = actualDate.format("YYYY-MM-DD")
    console.log("data: ", data)
    this.userId = firebase.auth().currentUser.uid;
    console.log("user id !!: ", this.userId);
    console.log('Fecha actual: ', formattedFecha);
     this.getIdFundacion();
    this.cargarSindicatos();
    

  }
  ngOnInit(): void {

  }

  onNoClick(): void {
    this.dialogRef.close({
    });
  }

  getIdFundacion(){
    this.db.collection("Fundacion").get().subscribe((querySnapshot) => {

      querySnapshot.forEach((doc) => {

        doc.data().usuarios.forEach(element => {
          console.log("correo del user; ",this.userEmail);
          console.log("correo del sindicato: ",element.correo)
          
          if(this.userEmail == element.correo){

            this.idFundacion = element.idOrg;
            console.log("id fundacion: ",this.idFundacion)

          }
        });

      });
    });
  }

  onAgendar(): void {


    console.log("id de ahora: ", this.userId)
    const momentDate = new Date(this.fechaFormControl.value);
    momentDate.setHours(parseInt(this.horaInicioFormControl.value))
    const formattedDate = moment(momentDate).format("YYYY-MM-DD");
    var fecha = new Date(this.fechaFormControl.value);
    var fechaHoy = new Date(Date.now());

    console.log('fecha: ', fecha)
    console.log('fecha hoy: ', fechaHoy)
    console.log('fecha ingresada es mayor que hoy?: ', fecha > fechaHoy);

    console.log('fecha sin formato: ', this.fechaFormControl.value)
    console.log('Agendar formated date: ', formattedDate)

    this.userId = firebase.auth().currentUser.uid;
    if (fecha < fechaHoy) {
      this.fechaCorrecta = false;
    }
    else if (fecha >= fechaHoy) {
      this.fechaCorrecta = true;
    }


    console.log('horacorrecta: ', this.horaCorrecta);
    console.log('inicio > final ?', this.horaInicioFormControl.value > this.horaTerminoFormControl.value)
    console.log('tamaño hora inicio: ', this.horaInicioFormControl.value.length);
    console.log('hora termino size: ', this.horaTerminoFormControl.value.length)
    console.log('comparacion antes del if: ', (this.horaInicioFormControl.value.length != 0 && this.horaTerminoFormControl.value.length != 0));
    if ((this.horaInicioFormControl.value < this.horaTerminoFormControl.value)) {
      this.horaCorrecta = true;
      if ((this.horaInicioFormControl.value.length != 0 && this.horaTerminoFormControl.value.length != 0)) {


        this.horaInicioVacia = false;
        this.horaTerminoVacia = false;
        console.log('horacorrecta: ', this.horaCorrecta);
        console.log('hora inicio vacia: ', this.horaInicioVacia);
        console.log('hora termino vacia: ', this.horaTerminoVacia)
      }
      else {
        this.horaInicioVacia = true;
        this.horaTerminoVacia = true;
      }

    }
    else {
      this.horaCorrecta = false;
      console.log('else hora mayor menor')
      console.log('horacorrecta: ', this.horaCorrecta);
      console.log('hora inicio vacia: ', this.horaInicioVacia);
      console.log('hora termino vacia: ', this.horaTerminoVacia)
    }
    if (this.horaCorrecta == false) {

      if ((this.horaInicioFormControl.value.length != 0 && this.horaTerminoFormControl.value.length != 0)) {
        this.horaInicioVacia = false;
        this.horaTerminoVacia = false;
      }
      else {
        this.horaInicioVacia = true;
        this.horaTerminoVacia = true;
      }


    }

    if (this.horaCorrecta == true && this.fechaCorrecta == true) {

      console.log('horacorrecta: ', this.horaCorrecta);
       this.reunion = {
       idReunion:"",
       titulo: this.tituloFormControl.value,
       descripcion: this.descripcionFormControl.value,
       fecha: formattedDate,
       horaInicio:this.horaInicioFormControl.value,
       horaTermino: this.horaTerminoFormControl.value,
       idCreador: this.userId,
       email: this.userEmail,
       idSindicato: this.idSindicatoUser,
       idAbogado:this.idAbogado,
       idFundacion:this.idFundacion,
       started:false
     }
      if (this.reunion.horaInicio.length == 0) {
        this.horaInicioVacia = true;
      }
      else if (this.reunion.horaInicio.length != 0) {
        this.horaInicioVacia = false;
      }
      if (this.reunion.horaTermino.length == 0) {
        this.horaTerminoVacia = true;
      }
      else if (this.reunion.horaTermino.length != 0) {
        this.horaTerminoVacia = false;
      }
      if (this.reunion.horaInicio > this.reunion.horaTermino) {
        this.horaCorrecta = true;
      }
      else {
        this.horaCorrecta = false;
      }

      if (this.reunion.titulo.length <= 0) {
        this.tituloVacío = true;
      }
      else {
        this.tituloVacío = false;
      }

      if (this.horaInicioVacia == false && this.horaTerminoVacia == false && this.tituloVacío == false) {
        console.log('Reunion: ', this.reunion)
        this.meetingSvc.addMeetingFoundation(this.reunion);
        this.dialogRef.close({});
      }


    }





  }

  onCerrar(): void {
    this.dialogRef.close({});
  }

  cargarSindicatos() {

    //Primero se buscan todos los sindicatos que están asociados al abogado actual en la sesión
    this.db.collection("Sindicato").get().subscribe((querySnapshot) => {

      querySnapshot.forEach((doc) => {

        doc.data().abogados.forEach(element => {

          if (element.correo == this.userEmail) {

            setTimeout(() => {
              this.db.collection("users").doc(doc.data().idAdmin).get().subscribe((snapshotChanges) => {

                var sindicato: any = {
                  nombre: doc.data().nombreSindicato,
                  cantidadMiembros: doc.data().usuarios.length,
                  usuarios: doc.data().usuarios,
                  nombreAdmin: snapshotChanges.data().name,
                  correoAdmin: snapshotChanges.data().email,
                  idFundacion: doc.data().idFundacion,
                  idAdmin: doc.data().idAdmin
                }

                //Luego de encontrar los sindicatos, se llenan en la lista 
                this.sindicatoList.push(sindicato);

                console.log("ids de sindicatos asociados: ", this.sindicatoList)

              })

            }, 1000);






          }

        });

      });






    });
  }
  selectSindicato() {

    var sindicatoSeleccionado = this.selectedSindicato;
    console.log("valor seleccionado: ", sindicatoSeleccionado);
    this.idSindicatoUser = sindicatoSeleccionado;

    //this.getDocumentInfo();
    this.sindicatoSelected = true;
    this.cargarAbogados();

  }

  cargarAbogados() {

    this.db.collection("Sindicato").doc(this.idSindicatoUser).get().subscribe((snapshotChanges) => {

      if (snapshotChanges.exists) {

        snapshotChanges.data().abogados.forEach(element => {


          this.db.collection("users").get().subscribe((querySnapshot) => {

            querySnapshot.forEach((doc) => {

              if (doc.data().email == element.correo) {

                var abogado= {
                  nombre: doc.data().name,
                  correo: doc.data().email,
                  uid: doc.data().uid

                }
                this.abogadoList.push(abogado);
                console.log("abogado: ",abogado)
              }

            })
          })



        });

      }
    })



  }

  selectAbogado() {

    var abogadoSeleccionado = this.selectedAbogado;
    console.log("valor seleccionado: ", abogadoSeleccionado);
    this.idAbogado = abogadoSeleccionado;

  }

}
