import { ActivosC, ActivosNC, PasivosC, PasivosNC, Patrimonio, EstadoR, GananciaAntImp, GananciaAtribuible, EstadoResIntegrales } from './TablasI';

export interface EstadoFinanciero {
  activosCorrientes: ActivosC[];
  activosNoCorrientes: ActivosNC[];
  pasivosCorrientes: PasivosC[];
  pasivosNoCorrientes: PasivosNC[];
  patrimonio: Patrimonio[];
  estadoResultados: EstadoR[];
  gananciaAntesImp: GananciaAntImp[];
  gananciaAtribuible: GananciaAtribuible[];
  estadoResIntegrales: EstadoResIntegrales[];

}
