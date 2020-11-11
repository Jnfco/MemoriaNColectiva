import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropuestasFundacionComponent } from './propuestas-fundacion.component';

describe('PropuestasFundacionComponent', () => {
  let component: PropuestasFundacionComponent;
  let fixture: ComponentFixture<PropuestasFundacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropuestasFundacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropuestasFundacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
