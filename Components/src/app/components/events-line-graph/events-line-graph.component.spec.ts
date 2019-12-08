import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsLineGraphComponent } from './events-line-graph.component';
import { ThemeModule } from 'src/app/theme/theme.module';

describe('EventsLineGraphComponent', () => {
  let component: EventsLineGraphComponent;
  let fixture: ComponentFixture<EventsLineGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ThemeModule],
      declarations: [EventsLineGraphComponent]
    }).compileComponents();
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
