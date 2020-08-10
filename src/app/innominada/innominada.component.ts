import { Component, OnInit } from '@angular/core';
import { ChartType, ChartDataSets, ChartOptions } from 'chart.js';
import { MultiDataSet, Label, Color } from 'ng2-charts';
import * as XLSX from 'xlsx';
import * as firebase from 'firebase';
import { DocumentService } from '../services/document.service';
import { InformacionInominada } from '../shared/Interfaces/InformacionInominada';
import { AngularFirestore } from '@angular/fire/firestore';
import {ModalComponent} from '../shared/modal/modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-innominada',
  templateUrl: './innominada.component.html',
  styleUrls: ['./innominada.component.css'],
})
export class InnominadaComponent implements OnInit {
  public maxVal: number;
  public minVal:number;
  public nombreCargos: string[];
  public nombreCargos1Mitad: string [];
  public nombreCargos2Mitad: string[];
  public sueldos: any[];
  public sum: number;
  public noData: boolean=true;

  public isLoading: boolean =false;
  public noDataMessage: boolean = false;
  public promSueldos: number[];
  public chartLabels: Label[] = [];
  public data = [];
  public dataHalf = [];
  public dataHalf2 = [];
  public userId:any;
  public informacionInominada: InformacionInominada[];

  public countMap: any;
  public cargosAgrupados: any;
  public hideBoxChart:boolean = true;
  public hideBoxChartTab1 = false;
  public hideBoxChartTab2 = true;
  public hideBarChart:boolean = false;
  public hideBarChart2: boolean=false;


  public doughnutChartLabels: Label[] = [
    'Operador técnico',
    'In-Store Sales',
    'Mail-Order Sales',
  ];

  public doughnutChartType: ChartType = 'line';

  public barChartPromData: ChartDataSets[] = [
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
  constructor(private docSvc: DocumentService,public db: AngularFirestore,public dialog: MatDialog) {}

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
    this.nombreCargos2Mitad = [];
    this.sueldos = [];
    this.nombreCargos = [];
    this.promSueldos = [];
    this.informacionInominada =[];
    this.cargosAgrupados=[];
    this.nombreCargos = [];
    this.data = [];
    this.noData=true;
    this.nombreCargos1Mitad = [];
    this.nombreCargos2Mitad =[];

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
      //Ordenar de mayor a menor los datos
      var jsonArray = Array.of(jsonData);
      jsonArray = jsonArray.sort();
      console.log('Data raw: ',jsonData)
      console.log('Data arreglo:',jsonArray)
      //Encontrar los nombres de los cargos y agregarlos a una lista
      this.countMap = jsonArray[0].reduce((result, element) => {
        result[element.CARGO] = (result[element.CARGO] || 0) + 1;
        return result;
      }, {});
console.log('countmap ordenado: ',this.countMap)

      const result = Object.keys(this.countMap)
        .filter((title) => this.countMap[title] > 1)
        .map((CARGO) => {
          return { CARGO, repeat: this.countMap[CARGO] };
        });
console.log('Result: ',result)

      for (let i = 0; i < result.length; i++) {
        this.nombreCargos.push(result[i].CARGO);
      }
      console.log('A: ', this.nombreCargos);
      this.nombreCargos=this.nombreCargos.sort();

      //Separar los nombres en 2 mitades

      let halfwayThrough = Math.floor(this.nombreCargos.length / 2)

      let arrayFirstHalf = this.nombreCargos.slice(0, halfwayThrough);
      this.nombreCargos2Mitad = this.nombreCargos.slice(halfwayThrough, this.nombreCargos.length);



      //Agrupar los datos por arrays de cargos

       this.cargosAgrupados = jsonArray[0].reduce((grouping, item) => {
        let cargo = item.CARGO;
        grouping[cargo] = grouping[cargo] || [];
        grouping[cargo].push({
          cargo: item.CARGO,
          sueldo: parseInt(item.REMUNERACION),
        });
        return grouping;
      }, {});

      console.log('Cargos agrupados: ',this.cargosAgrupados);
      var arrayCargosAgrupados = Array.of(this.cargosAgrupados);

      //Crear la matriz que va a tener todos los sueldos pero agrupados por cargo

      var matrizSueldosPorCargo = [];
      console.log('array cargos agrupados: ', arrayCargosAgrupados)
    for(let i = 0; i < this.nombreCargos.length; i++) {
        this.data[i] = [];
        for(let j = 0; j < this.countMap[this.nombreCargos[i]]; j++) {
            this.data[i][j] =arrayCargosAgrupados[0][this.nombreCargos[i]][j].sueldo ;
        }
    }

     //Version de la matriz de sueldos por cargo pero cortada a la mitad
     for(let i = 0; i < arrayFirstHalf.length; i++) {
      this.dataHalf[i] = [];
      for(let j = 0; j < this.countMap[arrayFirstHalf[i]]; j++) {
          this.dataHalf[i][j] =this.cargosAgrupados[arrayFirstHalf[i]][j].sueldo ;
      }
  }

    //Version de la matriz de sueldos por cargo pero con la segunda mitad
    for(let i = 0; i < this.nombreCargos2Mitad.length; i++) {
      this.dataHalf2[i] = [];
      for(let j = 0; j < this.countMap[this.nombreCargos2Mitad[i]]; j++) {
          this.dataHalf2[i][j] =this.cargosAgrupados[this.nombreCargos2Mitad[i]][j].sueldo ;
      }
  }

    console.log('datas: ',this.data)

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

//Aquí encontramos el sueldo minimo por cada cargo
var arraySueldosMinPorCargo = [];
for(let i = 0; i<this.data.length;i++){
  var minAux = this.data[i][0]
  for(let j = 0;j<this.data[i].length;j++){

    if(this.data[i][j]< minAux)
    {
      minAux = this.data[i][j];
    }

  }
  arraySueldosMinPorCargo.push(minAux);
}
console.log('Sueldos mínimos por cargo: ',arraySueldosMinPorCargo)
this.barChartData[1] ={data: arraySueldosMinPorCargo, label:'Menor sueldo por cargo'}



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
    this.maxVal = aux +100000;

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

      //var JSONResult = JSON.stringify(result);
      //console.log('Result: ', JSONResult[''])

      //var arrayCargos = Array.of(cargosAgrupados);
      //console.log('Cargos arreglo: ',JSON.stringify(cargosAgrupados));

      //ar cargosAgrupadosJSON = JSON.stringify(cargosAgrupados);
      //console.log('Cargos json: ', cargosAgrupadosJSON);


      //Tratar de generar un json con los sueldos sumados de cada cargo

      var r = jsonArray[0].reduce(function (pv, cv) {

        if (pv[cv.CARGO]) {
          pv[cv.CARGO] += parseInt(cv.REMUNERACION);
        } else {
          pv[cv.CARGO] = parseInt(cv.REMUNERACION);
        }
        return pv;
      }, {});

      // mostrar los valores de dinero de todos los cargos sin saber cuales hay
      for (let i = 0; i < this.nombreCargos.length; i++) {

        this.sueldos.push(r[this.nombreCargos[i]]);
      }
      console.log('sueldos: ',this.sueldos)
      console.log(this.nombreCargos);
      //this.doughnutChartData= this.sueldos;
      //console.log('AA: ',this.doughnutChartData)

      //Sacar el promedio de los sueldos de cada cargo
      this.barChartPromData[0].data = this.promSueldos;


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



  openDialog(): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '800px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });


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
    this.nombreCargos1Mitad = [];
    this.nombreCargos2Mitad =[];

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
        this.nombreCargos = this.nombreCargos.sort();
        console.log('A: ', this.nombreCargos);

        //Cortar el data por la mitad para el gráfico de caja
        let halfwayThrough = Math.floor(this.nombreCargos.length / 2)

    this.nombreCargos1Mitad = this.nombreCargos.slice(0, halfwayThrough);
    this.nombreCargos2Mitad = this.nombreCargos.slice(halfwayThrough, this.nombreCargos.length);
        console.log('Nombres 2 mitad: ',this.nombreCargos2Mitad)


    console.log('nombre cargos primera mitad: ',this.nombreCargos1Mitad)

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

    //Version de la matriz de sueldos por cargo pero cortada a la mitad
    for(let i = 0; i <this.nombreCargos1Mitad.length; i++) {
      this.dataHalf[i] = [];
      for(let j = 0; j < this.countMap[this.nombreCargos1Mitad[i]]; j++) {
          this.dataHalf[i][j] =this.cargosAgrupados[this.nombreCargos1Mitad[i]][j].sueldo ;
      }
  }

  //Version de la matriz de sueldos por cargo pero con la segunda mitad
  for(let i = 0; i < this.nombreCargos2Mitad.length; i++) {
    this.dataHalf2[i] = [];
    for(let j = 0; j < this.countMap[this.nombreCargos2Mitad[i]]; j++) {
        this.dataHalf2[i][j] =this.cargosAgrupados[this.nombreCargos2Mitad[i]][j].sueldo ;
    }
}

console.log('Data half: ',this.dataHalf)
//maximo sueldo por cargo
    console.log('data: ',this.data)

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

    //Aquí encontramos el sueldo minimo por cada cargo
var arraySueldosMinPorCargo = [];
for(let i = 0; i<this.data.length;i++){
  var minAux = this.data[i][0]
  for(let j = 0;j<this.data[i].length;j++){

    if(this.data[i][j]< minAux)
    {
      minAux = this.data[i][j];
    }

  }
  arraySueldosMinPorCargo.push(minAux);
}
console.log('Sueldos mínimos por cargo: ',arraySueldosMinPorCargo)
this.barChartData[1] ={data: arraySueldosMinPorCargo, label:'Menor sueldo por cargo'}

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
     this.maxVal = aux +100000;

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
     this.barChartPromData[0].data = this.promSueldos;


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


  public deleteInfo (){

    this.docSvc.deleteInfo(this.userId);
    this.data = [];
    this.dataHalf = [];
    this.dataHalf2 = [];
    this.barChartData= [];
    this.barChartPromData = [];
    this.noDataMessage = true;
    this.noData = true;

  }

  onHideBoxChart (){

    this.hideBoxChart = !this.hideBoxChart
  }

  onHideBarChart(){
    this.hideBarChart = !this.hideBarChart;

  }

  onHideBarChart2(){

    this.hideBarChart2 =!this.hideBarChart2;

  }

  onHideBoxChartTab1 (){
    this.hideBoxChartTab1 = false;
    this.hideBoxChartTab2 = true;
  }

  onHideBoxChartTab2(){
    this.hideBoxChartTab1= true;
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
