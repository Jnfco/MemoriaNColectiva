import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratoColectivoComponent } from './contrato-colectivo.component';

describe('ContratoColectivoComponent', () => {
  let component: ContratoColectivoComponent;
  let fixture: ComponentFixture<ContratoColectivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContratoColectivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContratoColectivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
