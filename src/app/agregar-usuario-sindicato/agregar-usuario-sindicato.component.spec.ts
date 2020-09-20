import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarUsuarioSindicatoComponent } from './agregar-usuario-sindicato.component';

describe('AgregarUsuarioSindicatoComponent', () => {
  let component: AgregarUsuarioSindicatoComponent;
  let fixture: ComponentFixture<AgregarUsuarioSindicatoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarUsuarioSindicatoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarUsuarioSindicatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
