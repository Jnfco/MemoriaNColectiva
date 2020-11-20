import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-disable-confirmation',
  templateUrl: './disable-confirmation.component.html',
  styleUrls: ['./disable-confirmation.component.css']
})
export class DisableConfirmationComponent implements OnInit {
  message: string = "Está seguro que quiere deshabilitar este sindicato?"
  confirmButtonText = "Aceptar"
  cancelButtonText = "Cancelar"
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<DisableConfirmationComponent>) {
      if(data){
    this.message = data.message || this.message;
    if (data.buttonText) {
      this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
      this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
    }
      }
  }
  ngOnInit(): void {
    
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }

}
