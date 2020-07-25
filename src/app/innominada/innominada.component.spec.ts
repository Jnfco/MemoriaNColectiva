import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InnominadaComponent } from './innominada.component';

describe('InnominadaComponent', () => {
  let component: InnominadaComponent;
  let fixture: ComponentFixture<InnominadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InnominadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InnominadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
