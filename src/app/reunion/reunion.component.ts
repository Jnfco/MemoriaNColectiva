import { Component, OnInit } from '@angular/core';
import { Theme } from '@fullcalendar/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/angular';
import { ModalReunionComponent } from './modal-reunion/modal-reunion.component';
import { MatDialog } from '@angular/material/dialog';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
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
  public position1: object={ X: 160, Y: 14 };

  constructor(public dialog: MatDialog) { }

  ngOnInit():void {
      //this.eventService.getEvents().then(events => {this.events = events;});

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
          }
          ,
          height: 500,
         firstDay: 1,
         initialDate: this.today


      };
  }

  openDialog(): void {

    const dialogRef = this.dialog.open(ModalReunionComponent, {
      width: '800px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

}
