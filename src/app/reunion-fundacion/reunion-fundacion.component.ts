import { Component, OnInit } from '@angular/core';
import { Reunion } from '../shared/Interfaces/Reunion';
import { ModalInfoReunionFundacionComponent } from '../modal-info-reunion-fundacion/modal-info-reunion-fundacion.component';
import { CalendarOptions, Calendar } from '@fullcalendar/core';
import { postData, respData } from '../shared/Interfaces/postDataObj';
import { MatDialog } from '@angular/material/dialog';
import { MeetingService } from '../services/meeting.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import * as firebase from 'firebase';
import { ModalReunionFundacionComponent } from '../modal-reunion-fundacion/modal-reunion-fundacion.component';
import * as moment from 'moment';

@Component({
  selector: 'app-reunion-fundacion',
  templateUrl: './reunion-fundacion.component.html',
  styleUrls: ['./reunion-fundacion.component.css']
})
export class ReunionFundacionComponent implements OnInit {

  events: any[];

  options: CalendarOptions;
  calendar: Calendar;

  header: any;
  today: Date;
  userId: any;
  userEmail: any;
  reuniones: Reunion[] = [];
  reunionesSimple: any[] = [];
  listaTest: any[];

  //campos correo

  public email = "jnfco_18@hotmail.com"
  public horaInicio = "15:30"
  public horaTermino = "18:00"
  public titulo = "Reunion mesa negociadora"

  //Email

  dataEmail: string;
  posData: postData;
  resultData: respData;

  public idSindicatoUser: string;

  postData = {
    test: 'my content',
  };
  url = "http://localhost:5001/negociacioncolectiva-80355/us-central1/sendMail?dest=" + this.email + "&horaInicio=" + this.horaInicio + "&horaTermino=" + this.horaTermino + "&titulo=" + this.titulo;
  json;

  constructor(public dialog: MatDialog, public meetingSvc: MeetingService, public db: AngularFirestore, public http: HttpClient) { }

  ngOnInit(): void {
    //this.eventService.getEvents().then(events => {this.events = events;});
    this.userId = firebase.auth().currentUser.uid;
    this.userEmail = firebase.auth().currentUser.email;

    this.getMeeting();


  }

  onEnviarCorreo() {



    this.http.post(this.url, this.postData).toPromise().then((data: any) => {
      console.log(data);
      console.log(data.json.test);
      this.json = JSON.stringify(data.json);
    });

  }
  handleDateClick(arg) {
    console.log(arg);
  }
  openInfoReunion(reunion: Reunion): void {

    const dialogRef = this.dialog.open(ModalInfoReunionFundacionComponent, {
      data: { reunion: reunion },
      width: '800px'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      const nowDate = new Date();
      const yearMonth = nowDate.getUTCFullYear() + '-' + (nowDate.getUTCMonth() + 1);




      this.getMeeting();
    });

  }

  openDialog(): void {

    const dialogRef = this.dialog.open(ModalReunionFundacionComponent, {
      width: '800px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      const nowDate = new Date();
      const yearMonth = nowDate.getUTCFullYear() + '-' + (nowDate.getUTCMonth() + 1);

      this.options.events = [{
        title: 'Updaten Event',
        start: yearMonth + '-08',
        end: yearMonth + '-10'
      }];


      this.getMeeting();
    });
  }
  handleEventClick(arg) {
    console.log("arg: ", arg)
    this.db.collection("Reunion").doc(arg.event.id).get().subscribe((snapshotChanges) => {

      const momentHoraInicio = new Date(arg.event.start);
      const momentHoraTermino = new Date(arg.event.end);
      const horaInicio = moment(momentHoraInicio).format("HH:mm");
      const horaTermino = moment(momentHoraTermino).format("HH:mm");

      const momentFecha = new Date(arg.event.start)
      const fecha = moment(momentFecha).format('YYYY-MM-DD')
      console.log('Formated hora inicio: ', horaInicio);
      console.log('Formated hora termino: ', horaTermino);
      console.log('event data: ', arg.event);
      var reunion: Reunion = {
        idReunion: arg.event.id,
        titulo: arg.event.title,
        descripcion: arg.event.extendedProps.description,
        idCreador: this.userId,
        fecha: fecha,
        horaInicio: horaInicio,
        horaTermino: horaTermino,
        email: this.userEmail,
        idSindicato: snapshotChanges.data().idSindicato,
        idAbogado: snapshotChanges.data().idAbogado,
        idFundacion: snapshotChanges.data().idFundacion,
        started: snapshotChanges.data().started
      }
      console.log("Reunion eventclick: ", reunion)
      this.openInfoReunion(reunion);
    })

  }


  //obtener las reuniones buscandolas todas primero y luego comparar con la reunion
  //reunion que tenga la misma id del administrador perteneciente al mismo sindicato
  getMeeting() {

    this.listaTest = [];
    this.reuniones = [];
    //Primero se buscan los sindicatos asociados al abogado que inicia la sesión



    this.db.collection("Reunion").get().subscribe((querySnapshot) => {

      querySnapshot.forEach((doc) => {

        if (this.userId == doc.data().idAbogado) {

          var reunion: Reunion = {
            idReunion: doc.data().idReunion,
            idCreador: doc.data().idCreador,
            titulo: doc.data().titulo,
            descripcion: doc.data().descripcion,
            fecha: doc.data().fecha,
            horaInicio: doc.data().horaInicio,
            horaTermino: doc.data().horaTermino,
            email: doc.data().email,
            idSindicato: doc.data().idSindicato,
            idAbogado: doc.data().idAbogado,
            idFundacion: doc.data().idFundacion,
            started: doc.data().started
          }
          this.reuniones.push(reunion);

          let array = {
            title: doc.data().titulo,
            start: doc.data().fecha + "T" + doc.data().horaInicio,
            end: doc.data().fecha + "T" + doc.data().horaTermino,
            description: doc.data().descripcion,
            id: doc.data().idReunion,


          }
          console.log("array: ", array)

          this.listaTest.push(array)
        }

      })
    })


    //console.log('reuniones simp: ',this.reunionesSimple)
    setTimeout(() => {
      this.options = {
        //plugins:[ dayGridPlugin, timeGridPlugin, interactionPlugin ],
        locale: 'es',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth'//timeGridWeek,timeGridDay'
        },
        buttonText: {
          today: 'Hoy',
          month: 'Mes',
          day: 'Día',
          week: 'Semana',
          list: 'Lista'
        },
        events: this.listaTest
        ,
        height: 500,
        firstDay: 1,
        initialDate: this.today,
        dateClick: this.handleDateClick.bind(this),
        eventClick: this.handleEventClick.bind(this)

      };
      console.log('opciones: ', this.options);
      console.log('Reuniones hardcode: ', this.listaTest);
    }, 1000)

    console.log('Reuniones ', this.reuniones)


  }

}
