import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerDocHistorialComponent } from './ver-doc-historial.component';

describe('VerDocHistorialComponent', () => {
  let component: VerDocHistorialComponent;
  let fixture: ComponentFixture<VerDocHistorialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerDocHistorialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerDocHistorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
