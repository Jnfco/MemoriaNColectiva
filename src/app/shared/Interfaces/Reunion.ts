export interface Reunion {
  titulo:string;
  descripcion:string;
  fecha:string;
  horaInicio:string;
  horaTermino:string;
  idCreador: string;
  idReunion: string;
  email: string;
  idSindicato: string;
  started:boolean;
}

export class ReunionFundacion {

  titulo:string;
  descripcion:string;
  fecha:string;
  horaInicio:string;
  horaTermino:string;
  idCreador:string;
  idReunion:string;
  email:string;
  idSindicato:string;
  idAbogado:string;
  idFundacion:string;
  started:boolean;
}