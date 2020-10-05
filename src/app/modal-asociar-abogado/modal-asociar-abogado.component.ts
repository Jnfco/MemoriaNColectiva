import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatListOption, MatSelectionListChange, MatSelectionList } from '@angular/material/list';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Abogado } from '../shared/Interfaces/UsuarioFundacion';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FundacionService } from '../services/fundacion.service';
import { ModalInfoReunionComponent } from '../reunion/modal-info-reunion/modal-info-reunion.component';

@Component({
  selector: 'app-modal-asociar-abogado',
  templateUrl: './modal-asociar-abogado.component.html',
  styleUrls: ['./modal-asociar-abogado.component.css']
})
export class ModalAsociarAbogadoComponent implements OnInit {

  @ViewChild('abogados') abogadosSelectionList:MatSelectionList;

 
  isLoading =true;
  listaAbogados:Abogado[] = [];
  listaAbogadosAux:Abogado[]=[];
  selectedLawyers:Abogado[]=[];
  correoAbogadoSelected:string;
  userId:any;
  abogadosSource:any;
  lawyersExists:boolean;
  displayedColumns: string[] = [
    'select','nombre', 'correo'
  ];
  selection= new SelectionModel<Abogado>(true,[]);
  constructor(public db: AngularFirestore,@Inject(MAT_DIALOG_DATA) public idSindicato: any,private fundSvc:FundacionService,public dialogRef: MatDialogRef<ModalInfoReunionComponent>) {

    this.selection.changed.asObservable().subscribe(selectionChange =>{
      this.selectedLawyers =[...this.selection.selected];
      //console.log('selectionChange', selectionChange);
      //console.log('selectedElements', this.selectedLawyers);
    })
   }
  ngOnInit(): void {

    
    this.userId = firebase.auth().currentUser.uid;
    this.db.collection("Fundacion").doc(this.userId).get().subscribe((snapshotChanges)=>{



      for(let i=0;i<snapshotChanges.data().usuarios.length;i++){

        var abogado:Abogado = {
          nombre: snapshotChanges.data().usuarios[i].nombre,
          correo: snapshotChanges.data().usuarios[i].correo,
          posicion:i+1
        }

        //console.log("abogado: ",abogado)
        this.listaAbogadosAux.push(abogado);
        //this.listaAbogados.push(abogado);

      }

      this.db.collection("Sindicato").doc(this.idSindicato).get().subscribe((snapshotChanges)=>
      {
        var sindicato = snapshotChanges.data();

        var i=1;
        this.listaAbogadosAux.forEach(abogadoC => {
          var isInSindicato = false;
          sindicato.abogados.forEach(abogadoS => {

            if(abogadoC.correo == abogadoS.correo){

              isInSindicato = true;

            }
            
          });
          
          if(isInSindicato == false){

            var lawyer:Abogado ={
              nombre:abogadoC.nombre,
              correo:abogadoC.correo,
              posicion:i
            }
            i++;

            this.listaAbogados.push(lawyer);

          } 
          else{
            console.log("El abogado ya esta asociado a este sindicato, por lo tanto no se muestra");
          }
          
        });
        console.log("abogados que no están en el sindicato todavia: ",this.listaAbogados);
        if(this.listaAbogados.length == 0)
        {
          this.lawyersExists= false;
        }
        else{
          this.lawyersExists=true;
        }
        this.abogadosSource = new MatTableDataSource<Abogado>(this.listaAbogados);
        this.isLoading=false;
      })
      
      //this.listaAbogados = snapshotChanges.data().usuarios.correo;
      //console.log("lista usuarios: ",this.abogadosSource)

    })

      


    
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.listaAbogados.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.abogadosSource.data.forEach(row => this.selection.select(row));
  }
  checkboxLabel(row?: Abogado): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.posicion + 1}`;
  }
  onLawyerChange(){

   this.correoAbogadoSelected = this.abogadosSelectionList.selectedOptions.selected.map(s => s.value)[0];
   

  }

  onAsociarAbogado(){

    
    console.log("Abogados asociados:");

    for(let i=0;i<this.selectedLawyers.length;i++){

      //console.log("Nombre: ", element.nombre + " Correo: ",element.correo);
/*
      var abogado:Abogado ={
        nombre:this.selectedLawyers[i].nombre,
        correo:this.selectedLawyers[i].correo,
        posicion:0
      }*/

      this.fundSvc.addLawyerToSyndicate(this.idSindicato,this.selectedLawyers);
      this.dialogRef.close();

    }
  }



}
