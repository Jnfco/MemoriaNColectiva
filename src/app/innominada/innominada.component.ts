import { Component, OnInit } from '@angular/core';
import { ChartType, ChartDataSets, ChartOptions } from 'chart.js';
import { MultiDataSet, Label, Color } from 'ng2-charts';
import * as XLSX from 'xlsx';
import * as firebase from 'firebase';
import { DocumentService } from '../services/document.service';
import { InformacionInominada } from '../shared/Interfaces/InformacionInominada';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-innominada',
  templateUrl: './innominada.component.html',
  styleUrls: ['./innominada.component.css'],
})
export class InnominadaComponent implements OnInit {
  public maxVal: number;
  public minVal:number;
  public nombreCargos: string[];
  public sueldos: any[];
  public sum: number;
  public noData: boolean=true;

  public isLoading: boolean =false;
  public noDataMessage: boolean = false;
  public promSueldos: number[];
  public chartLabels: Label[] = [];
  public data = [];
  public userId:any;
  public informacionInominada: InformacionInominada[];

  public countMap: any;
  public cargosAgrupados: any;


  public doughnutChartLabels: Label[] = [
    'Operador técnico',
    'In-Store Sales',
    'Mail-Order Sales',
  ];

  public doughnutChartType: ChartType = 'line';

  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Promedio' }
  ];

  public barChartData: ChartDataSets[] =[
    {data:[],label:'Sueldos máximos por cargo'}
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
  constructor(private docSvc: DocumentService,public db: AngularFirestore) {}

  ngOnInit(): void {
    this.noData = true;
    this.isLoading = true;
    this.userId = firebase.auth().currentUser.uid;
    this.getDocumentInfo();

  }

  uploadedFile(ev: any) {
    this.sueldos = [];
    this.nombreCargos = [];
    this.promSueldos = [];
    this.informacionInominada =[];
    this.cargosAgrupados=[];

    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    this.noData=true;
    this.isLoading=true;
    reader.onload = (ev) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      var jsonSinTransformar = JSON.stringify(jsonData);
      console.log('Datos cargados de archivo: ',jsonData);
      //console.log(jsonSinTransformar);

      //this.sueldos.push( jsonData.forEach(function(item){
      // return item.REMUNERACION;

      //}));


      //Encontrar los nombres de los cargos y agregarlos a una lista
      this.countMap = jsonData.reduce((result, element) => {
        result[element.CARGO] = (result[element.CARGO] || 0) + 1;
        return result;
      }, {});

      const result = Object.keys(this.countMap)
        .filter((title) => this.countMap[title] > 1)
        .map((CARGO) => {
          return { CARGO, repeat: this.countMap[CARGO] };
        });


      for (let i = 0; i < result.length; i++) {
        this.nombreCargos.push(result[i].CARGO);
      }
      console.log('A: ', this.nombreCargos);
      //Agrupar los datos por arrays de cargos

       this.cargosAgrupados = jsonData.reduce((grouping, item) => {
        let cargo = item.CARGO;
        grouping[cargo] = grouping[cargo] || [];
        grouping[cargo].push({
          cargo: item.CARGO,
          sueldo: parseInt(item.REMUNERACION),
        });
        return grouping;
      }, {});

      //Crear la matriz que va a tener todos los sueldos pero agrupados por cargo

      var matrizSueldosPorCargo = [];
    for(let i = 0; i < this.nombreCargos.length; i++) {
        this.data[i] = [];
        for(let j = 0; j < this.countMap[this.nombreCargos[i]]; j++) {
            this.data[i][j] =this.cargosAgrupados[this.nombreCargos[i]][j].sueldo ;
        }
    }

    //Aqui encontramos el sueldo maximo por cada cargo
    var arraySueldosMaxPorCargo = []

    for(let i =0;i<this.data.length;i++){
      var maxAux=0;
      for(let j=0;j<this.data[i].length;j++){

          if(this.data[i][j]> maxAux){
            maxAux=this.data[i][j]
          }

      }
      arraySueldosMaxPorCargo.push(maxAux);

    }
    console.log('Sueldos maximos por cargo: ',arraySueldosMaxPorCargo)
    this.barChartData[0]={data: arraySueldosMaxPorCargo,label: 'Mayor sueldo por cargo'}




    console.log('data: ',this.data)

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
    this.maxVal = aux-100;

    //Encontrar el valor minimo de sueldos


    var aux:number = this.data[0][0];
    for (let index = 0; index < this.data.length; index++) {
      for (let j = 0; j < this.data[index].length; j++) {
        //console.log(this.data[index][j])
        if (this.data[index][j] < aux) {
          aux = this.data[index][j];
        }
      }
    }
    this.minVal =aux;
    console.log('minval: ',this.minVal)
    //this.data=matrizSueldosPorCargo


    console.log('Matriz de sueldos agrupados por cargo: ',matrizSueldosPorCargo)

      var JSONResult = JSON.stringify(result);
      console.log('Result: ', JSONResult[''])

      //var arrayCargos = Array.of(cargosAgrupados);
      //console.log('Cargos arreglo: ',JSON.stringify(cargosAgrupados));

      //ar cargosAgrupadosJSON = JSON.stringify(cargosAgrupados);
      //console.log('Cargos json: ', cargosAgrupadosJSON);


      //Tratar de generar un json con los sueldos sumados de cada cargo

      var r = jsonData.reduce(function (pv, cv) {

        if (pv[cv.CARGO]) {
          pv[cv.CARGO] += parseInt(cv.REMUNERACION);
        } else {
          pv[cv.CARGO] = parseInt(cv.REMUNERACION);
        }
        return pv;
      }, {});

      // mostrar los valores de plata de todos los cargos sin saber cuales hay
      for (let i = 0; i < this.nombreCargos.length; i++) {

        this.sueldos.push(r[this.nombreCargos[i]]);
      }
      console.log('sueldos: ',this.sueldos)
      console.log(this.nombreCargos);
      //this.doughnutChartData= this.sueldos;
      //console.log('AA: ',this.doughnutChartData)

      //Sacar el promedio de los sueldos de cada cargo
      this.lineChartData[0].data = this.promSueldos;


      for (let i =0; i<this.nombreCargos.length;i++){

        this.promSueldos.push(Math.trunc(this.sueldos[i]/(this.countMap[this.nombreCargos[i]])));

      }
      console.log(this.promSueldos)
      //this.doughnutChartData[0].data = this.promSueldos;

      //console.log(result)
      var landSum = jsonData.reduce(function (sum, d) {
        if (d.CARGO == 'OPERADOR TECNICO') {
          sum + parseInt(d.REMUNERACION);
        }
        return sum;
      }, 0);

      //console.log(landSum);
    };
    this.noData = false;
    this.isLoading = false;
    this.noDataMessage =false;
    reader.readAsBinaryString(file);

  }
  // events

  public saveDocumentInfo(){

    var infoInominada : InformacionInominada[];
    infoInominada = [];
    for(let i = 0; i < this.nombreCargos.length; i++) {
      this.data[i] = [];
      for(let j = 0; j < this.countMap[this.nombreCargos[i]]; j++) {
          this.data[i][j] =this.cargosAgrupados[this.nombreCargos[i]][j].sueldo ;
          let info = {
            cargo:this.nombreCargos[i],
            sueldo: this.cargosAgrupados[this.nombreCargos[i]][j].sueldo
          }
          infoInominada.push(info);

      }

  }



    this.docSvc.SaveInfoDocument(infoInominada,this.userId)

  }

  public getDocumentInfo(){
    this.sueldos = [];
    this.nombreCargos = [];
    this.promSueldos = [];
    this.informacionInominada =[];
    this.cargosAgrupados=[];
    this.nombreCargos = [];
    this.data = [];
    this.noData=true;

    this.db.collection('InformacionInnominada').doc(this.userId).get().subscribe((snapshotChanges) => {
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
        console.log('A: ', this.nombreCargos);

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
      console.log('cargos agrupados: ',this.cargosAgrupados)

      //Crear la matriz que va a tener todos los sueldos pero agrupados por cargo

      var matrizSueldosPorCargo = [];
    for(let i = 0; i < this.nombreCargos.length; i++) {
        this.data[i] = [];
        for(let j = 0; j < this.countMap[this.nombreCargos[i]]; j++) {
            this.data[i][j] =this.cargosAgrupados[this.nombreCargos[i]][j].sueldo ;
        }
    }

    console.log('data: ',this.data)

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
     this.maxVal = aux-100;

     //Encontrar el valor minimo de sueldos


     var aux:number = this.data[0][0];
     for (let index = 0; index < this.data.length; index++) {
       for (let j = 0; j < this.data[index].length; j++) {
         //console.log(this.data[index][j])
         if (this.data[index][j] < aux) {
           aux = this.data[index][j];
         }
       }
     }
     this.minVal =aux;
     console.log('minval: ',this.minVal)



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
     console.log('sueldos: ',this.sueldos)
     console.log(this.nombreCargos);
     //this.doughnutChartData= this.sueldos;
     //console.log('AA: ',this.doughnutChartData)

     //Sacar el promedio de los sueldos de cada cargo
     this.lineChartData[0].data = this.promSueldos;


     for (let i =0; i<this.nombreCargos.length;i++){

       this.promSueldos.push(Math.trunc(this.sueldos[i]/(this.countMap[this.nombreCargos[i]])));

     }
     console.log(this.promSueldos)

     this.noData = false;
        this.isLoading = false;
      }
      else{
        console.log('no hay data:')
        this.noDataMessage = true;
        this.noData=true;
        this.isLoading= false;

      }

    });

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
