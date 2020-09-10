import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SindicatoComponent } from './sindicato.component';

describe('SindicatoComponent', () => {
  let component: SindicatoComponent;
  let fixture: ComponentFixture<SindicatoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SindicatoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SindicatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
