import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VerDocumentoHistorialComponent } from '../ver-documento-historial/ver-documento-historial.component';

@Component({
  selector: 'app-ver-doc-historial',
  templateUrl: './ver-doc-historial.component.html',
  styleUrls: ['./ver-doc-historial.component.css']
})
export class VerDocHistorialComponent implements OnInit {

  public htmlText: string;
  constructor(public db: AngularFirestore, public dialogRef: MatDialogRef<VerDocHistorialComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit(): void {
    console.log("data ver contrato: ",this.data)

    this.db.collection("Historial").doc(this.data).get().subscribe((snapshotChanges) => {

      if (snapshotChanges.exists) {
        
         
          this.htmlText = snapshotChanges.data().documento;
          console.log("texto: ",this.htmlText)

        


      }
    })
  }

}
