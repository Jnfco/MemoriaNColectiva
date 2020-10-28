import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAgregarEventoComponent } from './modal-agregar-evento.component';

describe('ModalAgregarEventoComponent', () => {
  let component: ModalAgregarEventoComponent;
  let fixture: ComponentFixture<ModalAgregarEventoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAgregarEventoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAgregarEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
