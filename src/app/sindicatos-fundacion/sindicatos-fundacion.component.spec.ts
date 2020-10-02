import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SindicatosFundacionComponent } from './sindicatos-fundacion.component';

describe('SindicatosFundacionComponent', () => {
  let component: SindicatosFundacionComponent;
  let fixture: ComponentFixture<SindicatosFundacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SindicatosFundacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SindicatosFundacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
