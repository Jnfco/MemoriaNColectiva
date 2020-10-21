import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerDocumentoHistorialComponent } from './ver-documento-historial.component';

describe('VerDocumentoHistorialComponent', () => {
  let component: VerDocumentoHistorialComponent;
  let fixture: ComponentFixture<VerDocumentoHistorialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerDocumentoHistorialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerDocumentoHistorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
