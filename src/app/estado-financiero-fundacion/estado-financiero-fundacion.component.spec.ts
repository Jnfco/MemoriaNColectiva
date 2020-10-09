import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoFinancieroFundacionComponent } from './estado-financiero-fundacion.component';

describe('EstadoFinancieroFundacionComponent', () => {
  let component: EstadoFinancieroFundacionComponent;
  let fixture: ComponentFixture<EstadoFinancieroFundacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadoFinancieroFundacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoFinancieroFundacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
