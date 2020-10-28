import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { CalendarOptions } from '@fullcalendar/core';
import * as firebase from 'firebase';
import * as moment from 'moment';
import { ModalAgregarEventoFundacionComponent } from '../modal-agregar-evento-fundacion/modal-agregar-evento-fundacion.component';
import { ModalAgregarEventoComponent } from '../modal-agregar-evento/modal-agregar-evento.component';
import { ModalDetalleEventoFundacionComponent } from '../modal-detalle-evento-fundacion/modal-detalle-evento-fundacion.component';
import { ModalDetalleEventoSindicatoComponent } from '../modal-detalle-evento-sindicato/modal-detalle-evento-sindicato.component';
import { EventoFundacion, EventoSindicato } from '../shared/Interfaces/Evento';

@Component({
  selector: 'app-eventos-fundacion',
  templateUrl: './eventos-fundacion.component.html',
  styleUrls: ['./eventos-fundacion.component.css']
})
export class EventosFundacionComponent implements OnInit {
  public options: CalendarOptions;
  public listaEventos: any[];
  public today: Date;
  public idSindicato: string;
  public idFundacion: string;
  public userId: any;
  constructor(public dialog: MatDialog, public db: AngularFirestore) { }

  ngOnInit(): void {
    this.userId = firebase.auth().currentUser.uid;
    this.getIdFundacion();
    setTimeout(() => {
      console.log("ASDasdasdasdas")
      this.cargarEventos();

    }, 1000)
  }
  getIdFundacion() {

    this.db.collection("users").doc(this.userId).get().subscribe((snapshotChanges) => {

      if (snapshotChanges.data().isAdmin == true) {

        this.idFundacion = this.userId;

      }
      else {
        this.idFundacion = snapshotChanges.data().idOrg;
      }
      console.log("id fundacion: ",this.idFundacion)
    })
  }

  cargarEventos() {
    this.listaEventos = [];



    this.db.collection("Evento").get().subscribe((querySnapshot) => {

      querySnapshot.forEach(doc => {
        console.log("idFundacion: ", this.idFundacion)
        console.log("doc: ", doc.data())
        if (this.idFundacion == doc.data().idFundacion) {

          let evento = {
            title: doc.data().nombre,
            start: doc.data().fecha,
            description: doc.data().descripcion,
            id: doc.data().id,
            idSindicato: doc.data().idSindicato,
            idFundacion: doc.data().idFundacion
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

        }

      });
    })


  }
  handleEventClick(arg) {
    console.log("id: ", arg.event.id)
    this.db.collection("Evento").doc(arg.event.id).get().subscribe((snapshotChanges) => {
      const momentFecha = new Date(arg.event.start)
      const fecha = moment(momentFecha).format('YYYY-MM-DD');
      console.log('event data: ', arg.event);
      var evento = {
        nombre: arg.event.title,
        descripcion: arg.event.description,
        fecha: arg.event.start,
        id: arg.event.id,
        idFundacion: snapshotChanges.data().idFundacion,
        idSindicato: snapshotChanges.data().idSindicato
      }

      this.openInfoEvento(evento);
    })

  }
  openInfoEvento(evento: any) {
    const dialogRef = this.dialog.open(ModalDetalleEventoFundacionComponent, {
      data: { evento: evento },
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

    const dialogRef = this.dialog.open(ModalAgregarEventoFundacionComponent, {
      width: '800px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      const nowDate = new Date();
      const yearMonth = nowDate.getUTCFullYear() + '-' + (nowDate.getUTCMonth() + 1);

     


      this.cargarEventos();
    });
  }

}
