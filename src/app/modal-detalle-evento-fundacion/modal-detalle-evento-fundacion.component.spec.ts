import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetalleEventoFundacionComponent } from './modal-detalle-evento-fundacion.component';

describe('ModalDetalleEventoFundacionComponent', () => {
  let component: ModalDetalleEventoFundacionComponent;
  let fixture: ComponentFixture<ModalDetalleEventoFundacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDetalleEventoFundacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDetalleEventoFundacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
