import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAsociarAbogadoComponent } from './modal-asociar-abogado.component';

describe('ModalAsociarAbogadoComponent', () => {
  let component: ModalAsociarAbogadoComponent;
  let fixture: ComponentFixture<ModalAsociarAbogadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAsociarAbogadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAsociarAbogadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
