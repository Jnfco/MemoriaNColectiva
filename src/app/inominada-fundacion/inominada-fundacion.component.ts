import { Component, OnInit } from '@angular/core';
import { Label, Color } from 'ng2-charts';
import { InformacionInominada } from '../shared/Interfaces/InformacionInominada';
import { ChartType, ChartDataSets, ChartOptions } from 'chart.js';
import { DocumentService } from '../services/document.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import * as firebase from 'firebase';
import { ModalComponent } from '../shared/modal/modal.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-inominada-fundacion',
  templateUrl: './inominada-fundacion.component.html',
  styleUrls: ['./inominada-fundacion.component.css']
})
export class InominadaFundacionComponent implements OnInit {

  public maxVal: number;
  public minVal: number;
  public nombreCargos: string[];
  public nombreCargos1Mitad: string[];
  public nombreCargos2Mitad: string[];
  public sueldos: any[];
  public sum: number;
  public noData: boolean = true;

  public isLoading: boolean;
  public noDataMessage: boolean = false;
  public promSueldos: number[];
  public chartLabels: Label[] = [];
  public data = [];
  public dataHalf = [];
  public dataHalf2 = [];
  public userId: any;
  public userEmail: any;
  public informacionInominada: InformacionInominada[];

  public countMap: any;
  public cargosAgrupados: any;
  public hideBoxChart: boolean = true;
  public hideBoxChartTab1 = false;
  public hideBoxChartTab2 = true;
  public hideBarChart: boolean = false;
  public hideBarChart2: boolean = false;

  public idSindicatoUser: string;

  public doughnutChartLabels: Label[] = [
    'Operador técnico',
    'In-Store Sales',
    'Mail-Order Sales',
  ];

  public doughnutChartType: ChartType = 'line';

  public barChartPromData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Promedio' }
  ];

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Sueldos máximos por cargo' }
  ];

  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };

  public lineChartColors: Color[] = [
    {
      // red
      backgroundColor: 'rgba(15,109,217,85)',
      borderColor: 'rgba(17,43,217,57)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(15,109,250,85)'
    }
  ];

  sindicatoList: any[] = [];
  sindicatosAsociados: string[] = [];
  selectedValue: string;
  innominadaExists: boolean = false;

  constructor(private docSvc: DocumentService, public db: AngularFirestore, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.noData = true;
    this.userId = firebase.auth().currentUser.uid;
    this.userEmail = firebase.auth().currentUser.email;
    //this.getDocumentInfo();
    this.cargarSindicatos();

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

    var sindicatoSeleccionado = this.selectedValue;
    console.log("valor seleccionado: ", sindicatoSeleccionado);
    this.idSindicatoUser = sindicatoSeleccionado;

    this.getDocumentInfo();

  }



  openDialog(): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '800px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });


  }

  public getDocumentInfo() {

    this.isLoading = true;

    this.sueldos = [];
    this.nombreCargos = [];
    this.promSueldos = [];
    this.informacionInominada = [];
    this.cargosAgrupados = [];
    this.nombreCargos = [];
    this.data = [];
    this.noData = true;
    this.nombreCargos1Mitad = [];
    this.nombreCargos2Mitad = [];

    this.db.collection('users').doc(this.userId).get().subscribe((snapshotChanges) => {
      if (snapshotChanges.exists) {

        this.db.collection('InformacionInnominada').doc(this.idSindicatoUser).get().subscribe((snapshotChanges) => {
          //let e = this.estadoFinanciero = this.docSvc.returnEstadoFinanciero(snapshotChanges.data());
          if (snapshotChanges.exists) {
            /*for (let index = 0; index < snapshotChanges.data()['info'].length; index++) {
                console.log( snapshotChanges.data()['info'][index])
    
            }*/
            //console.log(snapshotChanges.data()['info'].length);
            this.countMap = snapshotChanges.data()['info'].reduce((result, element) => {
              result[element.cargo] = (result[element.cargo] || 0) + 1;
              return result;
            }, {});


            const result = Object.keys(this.countMap)
              .filter((title) => this.countMap[title] > 1)
              .map((cargo) => {
                return { cargo, repeat: this.countMap[cargo] };
              });

            for (let i = 0; i < result.length; i++) {
              this.nombreCargos.push(result[i].cargo);
            }
            this.nombreCargos = this.nombreCargos.sort();
            console.log('A: ', this.nombreCargos);

            //Cortar el data por la mitad para el gráfico de caja
            let halfwayThrough = Math.floor(this.nombreCargos.length / 2)

            this.nombreCargos1Mitad = this.nombreCargos.slice(0, halfwayThrough);
            this.nombreCargos2Mitad = this.nombreCargos.slice(halfwayThrough, this.nombreCargos.length);
            console.log('Nombres 2 mitad: ', this.nombreCargos2Mitad)


            console.log('nombre cargos primera mitad: ', this.nombreCargos1Mitad)

            //Agrupar los datos por arrays de cargos

            this.cargosAgrupados = snapshotChanges.data()['info'].reduce((grouping, item) => {
              let cargo = item.cargo;
              grouping[cargo] = grouping[cargo] || [];
              grouping[cargo].push({
                cargo: item.cargo,
                sueldo: parseInt(item.sueldo),
              });
              return grouping;
            }, {});

            console.log('cargos agrupados: ', this.cargosAgrupados)

            //Crear la matriz que va a tener todos los sueldos pero agrupados por cargo

            var matrizSueldosPorCargo = [];
            for (let i = 0; i < this.nombreCargos.length; i++) {
              this.data[i] = [];
              for (let j = 0; j < this.countMap[this.nombreCargos[i]]; j++) {
                this.data[i][j] = this.cargosAgrupados[this.nombreCargos[i]][j].sueldo;
              }
            }

            //Version de la matriz de sueldos por cargo pero cortada a la mitad
            for (let i = 0; i < this.nombreCargos1Mitad.length; i++) {
              this.dataHalf[i] = [];
              for (let j = 0; j < this.countMap[this.nombreCargos1Mitad[i]]; j++) {
                this.dataHalf[i][j] = this.cargosAgrupados[this.nombreCargos1Mitad[i]][j].sueldo;
              }
            }

            //Version de la matriz de sueldos por cargo pero con la segunda mitad
            for (let i = 0; i < this.nombreCargos2Mitad.length; i++) {
              this.dataHalf2[i] = [];
              for (let j = 0; j < this.countMap[this.nombreCargos2Mitad[i]]; j++) {
                this.dataHalf2[i][j] = this.cargosAgrupados[this.nombreCargos2Mitad[i]][j].sueldo;
              }
            }

            console.log('Data half: ', this.dataHalf)
            //maximo sueldo por cargo
            console.log('data: ', this.data)

            var arraySueldosMaxPorCargo = []

            for (let i = 0; i < this.data.length; i++) {
              var maxAux = 0;
              for (let j = 0; j < this.data[i].length; j++) {

                if (this.data[i][j] > maxAux) {
                  maxAux = this.data[i][j]
                }

              }
              arraySueldosMaxPorCargo.push(maxAux);

            }
            console.log('Sueldos maximos por cargo: ', arraySueldosMaxPorCargo)
            this.barChartData[0] = { data: arraySueldosMaxPorCargo, label: 'Mayor sueldo por cargo' }

            //Aquí encontramos el sueldo minimo por cada cargo
            var arraySueldosMinPorCargo = [];
            for (let i = 0; i < this.data.length; i++) {
              var minAux = this.data[i][0]
              for (let j = 0; j < this.data[i].length; j++) {

                if (this.data[i][j] < minAux) {
                  minAux = this.data[i][j];
                }

              }
              arraySueldosMinPorCargo.push(minAux);
            }
            console.log('Sueldos mínimos por cargo: ', arraySueldosMinPorCargo)
            this.barChartData[1] = { data: arraySueldosMinPorCargo, label: 'Menor sueldo por cargo' }

            //Encontrar el valor maximo de sueldos
            var aux = 0;
            for (let index = 0; index < this.data.length; index++) {
              for (let j = 0; j < this.data[index].length; j++) {
                //console.log(this.data[index][j])
                if (this.data[index][j] > aux) {
                  aux = this.data[index][j];
                }
              }
            }
            this.maxVal = aux + 100000;

            //Encontrar el valor minimo de sueldos


            var aux: number = this.data[0][0];
            for (let index = 0; index < this.data.length; index++) {
              for (let j = 0; j < this.data[index].length; j++) {
                //console.log(this.data[index][j])
                if (this.data[index][j] < aux) {
                  aux = this.data[index][j];
                }
              }
            }
            this.minVal = aux;
            console.log('minval: ', this.minVal)



            var JSONResult = JSON.stringify(result);
            console.log('Result: ', JSONResult[''])

            //var arrayCargos = Array.of(cargosAgrupados);
            //console.log('Cargos arreglo: ',JSON.stringify(cargosAgrupados));

            //ar cargosAgrupadosJSON = JSON.stringify(cargosAgrupados);
            //console.log('Cargos json: ', cargosAgrupadosJSON);


            //Tratar de generar un json con los sueldos sumados de cada cargo

            var r = snapshotChanges.data()['info'].reduce(function (pv, cv) {

              if (pv[cv.cargo]) {
                pv[cv.cargo] += parseInt(cv.sueldo);
              } else {
                pv[cv.cargo] = parseInt(cv.sueldo);
              }
              return pv;
            }, {});

            // mostrar los valores de plata de todos los cargos sin saber cuales hay
            for (let i = 0; i < this.nombreCargos.length; i++) {

              this.sueldos.push(r[this.nombreCargos[i]]);
            }
            console.log('sueldos: ', this.sueldos)
            console.log(this.nombreCargos);
            //this.doughnutChartData= this.sueldos;
            //console.log('AA: ',this.doughnutChartData)

            //Sacar el promedio de los sueldos de cada cargo
            this.barChartPromData[0].data = this.promSueldos;


            for (let i = 0; i < this.nombreCargos.length; i++) {

              this.promSueldos.push(Math.trunc(this.sueldos[i] / (this.countMap[this.nombreCargos[i]])));

            }
            this.innominadaExists=true;
            console.log(this.promSueldos)

            this.noData = false;
            this.isLoading = false;
          }
          else {
            
            this.innominadaExists = false;
            this.isLoading = false;

          }

        });


      }
      this.isLoading = false;
    })






  }



  onHideBoxChart() {

    this.hideBoxChart = !this.hideBoxChart
  }

  onHideBarChart() {
    this.hideBarChart = !this.hideBarChart;

  }

  onHideBarChart2() {

    this.hideBarChart2 = !this.hideBarChart2;

  }

  onHideBoxChartTab1() {
    this.hideBoxChartTab1 = false;
    this.hideBoxChartTab2 = true;
  }

  onHideBoxChartTab2() {
    this.hideBoxChartTab1 = true;
    this.hideBoxChartTab2 = false;
  }

  public chartClicked({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }
}