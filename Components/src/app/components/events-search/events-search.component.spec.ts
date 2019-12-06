import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsSearchComponent } from './events-search.component';

describe('EventsSearchComponent', () => {
  let component: EventsSearchComponent;
  let fixture: ComponentFixture<EventsSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
