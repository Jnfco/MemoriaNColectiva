import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarUsuarioFundacionComponent } from './agregar-usuario-fundacion.component';

describe('AgregarUsuarioFundacionComponent', () => {
  let component: AgregarUsuarioFundacionComponent;
  let fixture: ComponentFixture<AgregarUsuarioFundacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarUsuarioFundacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarUsuarioFundacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
