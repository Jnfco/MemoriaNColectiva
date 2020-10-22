import { Component, Inject, OnInit } from '@angular/core';
import { snapshotChanges } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-ver-documento-historial',
  templateUrl: './ver-documento-historial.component.html',
  styleUrls: ['./ver-documento-historial.component.css']
})
export class VerDocumentoHistorialComponent implements OnInit {

  public htmlText: string;
  public contractAttached: boolean;
  constructor(public db: AngularFirestore, public dialogRef: MatDialogRef<VerDocumentoHistorialComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit(): void {
    console.log("data ver contrato: ",this.data)

    this.db.collection("Reunion").doc(this.data).get().subscribe((snapshotChanges) => {

      if (snapshotChanges.exists) {
        if (snapshotChanges.data().contractAttached == true) {
          //console.log("largo: ", snapshotChanges.data().contrato.lenght)
          this.contractAttached = true;
          this.htmlText = snapshotChanges.data().contrato.content;

        }


      }
    })
  }

}
