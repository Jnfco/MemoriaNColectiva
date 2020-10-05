import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerAbogadosSindicatoComponent } from './ver-abogados-sindicato.component';

describe('VerAbogadosSindicatoComponent', () => {
  let component: VerAbogadosSindicatoComponent;
  let fixture: ComponentFixture<VerAbogadosSindicatoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerAbogadosSindicatoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerAbogadosSindicatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
