import { Component, OnInit } from '@angular/core';
import { Theme } from '@fullcalendar/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/angular';
import { ModalReunionComponent } from './modal-reunion/modal-reunion.component';
import { MatDialog } from '@angular/material/dialog';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { MeetingService } from '../services/meeting.service';
import * as firebase from 'firebase';
import { Reunion } from '../shared/Interfaces/Reunion';
import { AngularFirestore } from '@angular/fire/firestore';
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

  header: any;
  today: Date;
  userId: any;
  reuniones: Reunion [] = [];
  reunionesSimp: any [] =[];

  constructor(public dialog: MatDialog, public meetingSvc: MeetingService,public db: AngularFirestore) { }

  ngOnInit():void {
      //this.eventService.getEvents().then(events => {this.events = events;});
      this.userId = firebase.auth().currentUser.uid;
      this.options = {
        //plugins:[ dayGridPlugin, timeGridPlugin, interactionPlugin ],
        locale: 'es',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        buttonText:{
          today: 'Hoy',
          month: 'Mes',
          day: 'Día',
          week: 'Semana',
          list: 'Lista'
        },
        events: [{title: 'hola',start: '2020-08-02'}]
        ,
        height: 500,
       firstDay: 1,
       initialDate: this.today


    };
    this.getMeeting();

  }

  openDialog(): void {

    const dialogRef = this.dialog.open(ModalReunionComponent, {
      width: '800px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

  getMeeting(){


      this.db.collection("Reunion").get().subscribe((querySnapshot)=>{

        querySnapshot.forEach((doc)=> {


          if(doc.data().idCreador == this.userId )
          {


            var reunion:Reunion = {

              idCreador: doc.data().idCreador,
              titulo: doc.data().titulo,
              descripcion: doc.data().descripcion,
              fecha: doc.data().fecha,
              horaInicio: doc.data().horaInicio,
              horaTermino: doc.data().horaTermino
            }
            this.reuniones.push(reunion);


          }
        })

        for(let i =0; i< this.reuniones.length;i++){

          var reunionS = {
           title: this.reuniones[0].titulo,
           start: this.reuniones[0].fecha
          }
          this.reunionesSimp.push(reunionS);
        }


      })

      console.log('reuniones: ',this.reunionesSimp)
      //this.options.eventAdd([this.reunionesSimp]);
      this.options = {
        //plugins:[ dayGridPlugin, timeGridPlugin, interactionPlugin ],
        locale: 'es',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        buttonText:{
          today: 'Hoy',
          month: 'Mes',
          day: 'Día',
          week: 'Semana',
          list: 'Lista'
        },
        events: [this.reunionesSimp]
        ,
        height: 500,
       firstDay: 1,
       initialDate: this.today


    };



  }

}
