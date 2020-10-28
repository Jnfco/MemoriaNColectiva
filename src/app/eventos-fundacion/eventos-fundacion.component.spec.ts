import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventosFundacionComponent } from './eventos-fundacion.component';

describe('EventosFundacionComponent', () => {
  let component: EventosFundacionComponent;
  let fixture: ComponentFixture<EventosFundacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventosFundacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventosFundacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
