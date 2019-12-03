import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsLineGraphComponent } from './events-line-graph.component';

describe('EventsLineGraphComponent', () => {
  let component: EventsLineGraphComponent;
  let fixture: ComponentFixture<EventsLineGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsLineGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsLineGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
