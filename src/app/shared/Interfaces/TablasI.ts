export interface ActivosC {
  anio: string;
  efectivo: string;
  activosF: string;
  otrosAc: string;
  deudores:string;
  cuentas:string;
  activoImpC:string;
  total:string;
}

export interface ActivosNC {
  anio: string;
  otrosA: string;
  activosI: string;
  prop: string;
  activosD:string;
  totalNC:string;
  totalA:string;
}

export interface PasivosC{
  anio: string;
  pasivosAr: string;
  otrosP: string;
  cuentasC: string;
  cuentasR:string;
  otras:string;
  pasivosI:string;
  provisiones:string;
  totalPC:string;
}
export interface EstadoR{
  anio:string;
  ingresos: string;
  costoVentas:string;
  margen:string;
  otrosI:string;
  gastosAdm:string;
  otrasGanancias:string;
  ingresosF:string;
  resultadoR:string;
  costosF:string;
}

export interface PasivosNC{
  anio: string;
  pasivosAr: string;
  otrosP: string;
  provisionesB: string;
  total: string;
}
export interface Patrimonio{
  anio: string;
  aportes: string;
  resultadosR: string;
  patrimonioContador: string;
  participaciones: string;
  totalPNeto: string;
  totalPP: string;
}

export interface GananciaAntImp {
anio:string;
gastoImp:string;
gastoDespImp:string;
totalRes:string;
}

export interface GananciaAtribuible{
  anio: string;
  gastoImp:string;
  gastoDespImp:string;
  totalRes:string;
}

export interface EstadoResIntegrales{
  anio:string;
  ganancia:string;
  gananciaAct:string;
  total:string;
}
