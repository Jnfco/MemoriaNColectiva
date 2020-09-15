import { Component, OnInit } from '@angular/core';
import { Theme, Calendar } from '@fullcalendar/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/angular';
import { ModalReunionComponent } from './modal-reunion/modal-reunion.component';
import { MatDialog } from '@angular/material/dialog';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { MeetingService } from '../services/meeting.service';
import * as firebase from 'firebase';
import { Reunion } from '../shared/Interfaces/Reunion';
import { AngularFirestore } from '@angular/fire/firestore';
import { ModalInfoReunionComponent } from './modal-info-reunion/modal-info-reunion.component';
import * as moment from 'moment';
import { DataService } from '../services/data.service';
import { postData, respData } from '../shared/Interfaces/postDataObj';
import { HttpClient } from '@angular/common/http';
import { snapshotChanges } from '@angular/fire/database';
/*import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
*/




@Component({
  selector: 'app-reunion',
  templateUrl: './reunion.component.html',
  styleUrls: ['./reunion.component.css']
})


export class ReunionComponent implements OnInit {

  events: any[];

  options: CalendarOptions;
  calendar : Calendar;

  header: any;
  today: Date;
  userId: any;
  userEmail:any;
  reuniones: Reunion [] = [];
  reunionesSimple: any []=[];
  listaTest: any [];

  //campos correo

  public email = "jnfco_18@hotmail.com"
  public horaInicio = "15:30"
  public horaTermino = "18:00"
  public titulo  = "Reunion mesa negociadora"

   //Email

   dataEmail:string;
   posData:postData;
   resultData: respData;

  public idSindicatoUser:string;

   postData = {
    test: 'my content',
  };
  url = "http://localhost:5001/negociacioncolectiva-80355/us-central1/sendMail?dest="+this.email+"&horaInicio="+this.horaInicio+"&horaTermino="+this.horaTermino+"&titulo="+this.titulo;
  json;

  constructor(public dialog: MatDialog, public meetingSvc: MeetingService,public db: AngularFirestore, public http:HttpClient) { }

  ngOnInit():void {
      //this.eventService.getEvents().then(events => {this.events = events;});
      this.userId = firebase.auth().currentUser.uid;
      this.userEmail= firebase.auth().currentUser.email;

    this.getMeeting();


  }

  onEnviarCorreo(){



    this.http.post(this.url, this.postData).toPromise().then((data:any) => {
      console.log(data);
      console.log(data.json.test);
      this.json = JSON.stringify(data.json);
   });

  }
  handleDateClick(arg) {
    console.log(arg);
  }
openInfoReunion (reunion:Reunion): void {
  const dialogRef = this.dialog.open(ModalInfoReunionComponent, {
    data: {reunion: reunion},
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

    const dialogRef = this.dialog.open(ModalReunionComponent, {
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
    const momentHoraInicio = new Date(arg.event.start);
    const momentHoraTermino = new Date(arg.event.end);
    const horaInicio = moment(momentHoraInicio).format("HH:mm");
    const horaTermino = moment(momentHoraTermino).format("HH:mm");

    const momentFecha = new Date(arg.event.start)
    const fecha = moment(momentFecha).format('YYYY-MM-DD')
    console.log('Formated hora inicio: ',horaInicio);
    console.log('Formated hora termino: ',horaTermino);
    console.log ('event data: ', arg.event);
   var reunion : Reunion ={
     idReunion: arg.event.id,
     titulo: arg.event.title,
     descripcion:arg.event.extendedProps.description,
     idCreador: this.userId,
     fecha: fecha,
     horaInicio: horaInicio,
     horaTermino: horaTermino,
     email:this.userEmail,
     idSindicato:this.idSindicatoUser
   }
    this.openInfoReunion(reunion);
  }


//obtener las reuniones buscandolas todas primero y luego comparar con la reunion
//reunion que tenga la misma id del administrador perteneciente al mismo sindicato
  getMeeting(){

    this.listaTest = [];

    this.db.collection('users').doc(this.userId).get().subscribe((snapshotChanges)=>{
              
      var usuario = snapshotChanges.data();
      console.log('aqui')
      this.idSindicatoUser = usuario.idSindicato;
      console.log('id sindicato encontrada: ',this.idSindicatoUser)
      console.log('es admin o no ?',usuario.isAdmin)
      if(usuario.isAdmin == true){
        this.idSindicatoUser =this.userId;

      }
      
    
    })

      this.db.collection("Reunion").get().subscribe((querySnapshot)=>{

        querySnapshot.forEach((doc)=> {


          if(doc.data().idSindicato == this.idSindicatoUser )
          {
            var reunion:Reunion = {
              idReunion: doc.data().idReunion,
              idCreador: doc.data().idCreador,
              titulo: doc.data().titulo,
              descripcion: doc.data().descripcion,
              fecha: doc.data().fecha,
              horaInicio: doc.data().horaInicio,
              horaTermino: doc.data().horaTermino,
              email: this.userEmail,
              idSindicato:this.idSindicatoUser
            }
            this.reuniones.push(reunion);

            let array = {
              title: doc.data().titulo,
              start: doc.data().fecha +"T"+doc.data().horaInicio,
              end: doc.data().fecha + "T"+doc.data().horaTermino,
              description: doc.data().descripcion,
              id: doc.data().idReunion

            }
              console.log('let array: ',array)
              this.listaTest.push (array)

           
          

            
          }
        })


        this.options = {
          //plugins:[ dayGridPlugin, timeGridPlugin, interactionPlugin ],
          locale: 'es',
          headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth'//timeGridWeek,timeGridDay'
          },
          buttonText:{
            today: 'Hoy',
            month: 'Mes',
            day: 'Día',
            week: 'Semana',
            list: 'Lista'
          },
          events : this.listaTest
          ,
          height: 500,
         firstDay: 1,
         initialDate: this.today,
         dateClick: this.handleDateClick.bind(this),
         eventClick: this.handleEventClick.bind(this)

        }


      })

      console.log('reuniones simp: ',this.reunionesSimple)
      console.log ('Reuniones hardcode: ', this.listaTest)




    console.log ('opciones: ',this.options)







  }

}
