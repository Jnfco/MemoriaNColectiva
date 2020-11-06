export class datoPropuesta {
    anio: number;
    categoria:string;
    cantMiembros:number;
    sueldoBase:  number;
    reajuste: number;
    mes1:number;
    ipc:number;
    mes2:number;

}

export class Propuesta {

    idSindicato: string;
    datosAdminPropuesta: datoPropuesta[];
    datosTrabPropuesta: datoPropuesta[];
}

