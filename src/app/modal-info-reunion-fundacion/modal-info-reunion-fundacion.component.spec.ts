import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInfoReunionFundacionComponent } from './modal-info-reunion-fundacion.component';

describe('ModalInfoReunionFundacionComponent', () => {
  let component: ModalInfoReunionFundacionComponent;
  let fixture: ComponentFixture<ModalInfoReunionFundacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalInfoReunionFundacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalInfoReunionFundacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
