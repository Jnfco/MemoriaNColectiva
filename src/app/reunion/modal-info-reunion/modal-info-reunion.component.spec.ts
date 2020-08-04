import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInfoReunionComponent } from './modal-info-reunion.component';

describe('ModalInfoReunionComponent', () => {
  let component: ModalInfoReunionComponent;
  let fixture: ComponentFixture<ModalInfoReunionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalInfoReunionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalInfoReunionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
