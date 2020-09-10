import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearSindicatoComponent } from './crear-sindicato.component';

describe('CrearSindicatoComponent', () => {
  let component: CrearSindicatoComponent;
  let fixture: ComponentFixture<CrearSindicatoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearSindicatoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearSindicatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
