import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InominadaFundacionComponent } from './inominada-fundacion.component';

describe('InominadaFundacionComponent', () => {
  let component: InominadaFundacionComponent;
  let fixture: ComponentFixture<InominadaFundacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InominadaFundacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InominadaFundacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
