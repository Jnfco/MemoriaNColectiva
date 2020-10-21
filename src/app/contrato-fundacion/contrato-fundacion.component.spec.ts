import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratoFundacionComponent } from './contrato-fundacion.component';

describe('ContratoFundacionComponent', () => {
  let component: ContratoFundacionComponent;
  let fixture: ComponentFixture<ContratoFundacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContratoFundacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContratoFundacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
