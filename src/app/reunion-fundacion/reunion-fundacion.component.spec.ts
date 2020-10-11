import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReunionFundacionComponent } from './reunion-fundacion.component';

describe('ReunionFundacionComponent', () => {
  let component: ReunionFundacionComponent;
  let fixture: ComponentFixture<ReunionFundacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReunionFundacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReunionFundacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
