import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialFundacionComponent } from './historial-fundacion.component';

describe('HistorialFundacionComponent', () => {
  let component: HistorialFundacionComponent;
  let fixture: ComponentFixture<HistorialFundacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorialFundacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialFundacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
