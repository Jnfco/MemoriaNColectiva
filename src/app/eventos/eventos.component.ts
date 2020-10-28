import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { CalendarOptions } from '@fullcalendar/core';
import * as firebase from 'firebase';
import * as moment from 'moment';
import { ModalAgregarEventoComponent } from '../modal-agregar-evento/modal-agregar-evento.component';
import { ModalDetalleEventoSindicatoComponent } from '../modal-detalle-evento-sindicato/modal-detalle-evento-sindicato.component';
import { EventoSindicato } from '../shared/Interfaces/Evento';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  public options: CalendarOptions;
  public listaEventos: any[];
  public today: Date;
  public idSindicato: string;
  public userId: any;

  //formcontrols


  constructor(public dialog: MatDialog, public db: AngularFirestore) {

  }

  ngOnInit(): void {
    this.userId = firebase.auth().currentUser.uid;
    this.getIdSindicato();
    setTimeout(() => {
      this.cargarEventos();

    }, 1000)
  }
  getIdSindicato() {

    this.db.collection("users").doc(this.userId).get().subscribe((snapshotChanges) => {

      if (snapshotChanges.data().isAdmin == true) {

        this.idSindicato = this.userId;

      }
      else {
        this.idSindicato = snapshotChanges.data().idOrg;
      }
    })
  }

  cargarEventos() {
    this.listaEventos = [];


    this.db.collection("Evento").get().subscribe((querySnapshot) => {

      querySnapshot.forEach(doc => {
        console.log("idsindicato: ", this.idSindicato)
        console.log("doc: ", doc.data())
        if (this.idSindicato == doc.data().idSindicato) {

          let evento = {
            title: doc.data().nombre,
            start: doc.data().fecha,
            description: doc.data().descripcion,
            id:doc.data().id
          }

          this.listaEventos.push(evento);
          console.log("lista eventos: ", this.listaEventos)
        }
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
          events: this.listaEventos,
          height: 500,
          firstDay: 1,
          initialDate: this.today,
          eventClick: this.handleEventClick.bind(this)
          //dateClick: this.handleDateClick.bind(this),
          //eventClick: this.handleEventClick.bind(this)

        }

      });
    })


  }
  handleEventClick(arg) {
    console.log("id: ",arg.event.id)
    this.db.collection("Evento").doc(arg.event.id).get().subscribe((snapshotChanges) => {
      const momentFecha = new Date(arg.event.start)
      const fecha = moment(momentFecha).format('YYYY-MM-DD');
      console.log('event data: ', arg.event);
      var evento= {
        nombre: arg.event.title,
        descripcion:snapshotChanges.data().descripcion,
        fecha:arg.event.start,
        id:arg.event.id,
        idSindicato:snapshotChanges.data().idSindicato
      }
     
      this.openInfoEvento(evento);
    })

  }
openInfoEvento(evento:EventoSindicato){
  const dialogRef = this.dialog.open(ModalDetalleEventoSindicatoComponent, {
    data: {evento: evento},
    width: '800px'
  });
  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed', result);
    const nowDate = new Date();
  const yearMonth = nowDate.getUTCFullYear() + '-' + (nowDate.getUTCMonth() + 1);



    //this.eve = [];
    this.cargarEventos();
  });

}
  agregarEvento() {

    const dialogRef = this.dialog.open(ModalAgregarEventoComponent, {
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


      this.cargarEventos();
    });
  }

}
