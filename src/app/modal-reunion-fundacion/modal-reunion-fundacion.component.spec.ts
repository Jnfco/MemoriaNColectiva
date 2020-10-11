import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalReunionFundacionComponent } from './modal-reunion-fundacion.component';

describe('ModalReunionFundacionComponent', () => {
  let component: ModalReunionFundacionComponent;
  let fixture: ComponentFixture<ModalReunionFundacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalReunionFundacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalReunionFundacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
