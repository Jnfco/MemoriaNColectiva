import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCrearSindicatoFundacionComponent } from './modal-crear-sindicato-fundacion.component';

describe('ModalCrearSindicatoFundacionComponent', () => {
  let component: ModalCrearSindicatoFundacionComponent;
  let fixture: ComponentFixture<ModalCrearSindicatoFundacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCrearSindicatoFundacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCrearSindicatoFundacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
