import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetalleSindicatoFundacionComponent } from './modal-detalle-sindicato-fundacion.component';

describe('ModalDetalleSindicatoFundacionComponent', () => {
  let component: ModalDetalleSindicatoFundacionComponent;
  let fixture: ComponentFixture<ModalDetalleSindicatoFundacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDetalleSindicatoFundacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDetalleSindicatoFundacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
