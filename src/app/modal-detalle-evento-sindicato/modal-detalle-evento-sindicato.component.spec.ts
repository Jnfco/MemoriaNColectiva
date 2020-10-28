import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetalleEventoSindicatoComponent } from './modal-detalle-evento-sindicato.component';

describe('ModalDetalleEventoSindicatoComponent', () => {
  let component: ModalDetalleEventoSindicatoComponent;
  let fixture: ComponentFixture<ModalDetalleEventoSindicatoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDetalleEventoSindicatoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDetalleEventoSindicatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
