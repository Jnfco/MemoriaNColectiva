import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAgregarEventoFundacionComponent } from './modal-agregar-evento-fundacion.component';

describe('ModalAgregarEventoFundacionComponent', () => {
  let component: ModalAgregarEventoFundacionComponent;
  let fixture: ComponentFixture<ModalAgregarEventoFundacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAgregarEventoFundacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAgregarEventoFundacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
