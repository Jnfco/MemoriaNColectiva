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
    aniosVigencia: number[];
    categoriasAdminSindicato:string[];
    categoriasTrabSindicato:string[];
    categoriasAdminEmpresa:string[];
    categoriasTrabEmpresa:string[];
    esSindicato:boolean;
    datosAdminEmpresaPropuesta:datoPropuesta[];
    datosTrabEmpresaPropuesta:datoPropuesta[];
}

