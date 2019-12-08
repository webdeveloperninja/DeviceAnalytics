import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsSearchComponent } from './events-search.component';
import { ThemeModule } from 'src/app/theme/theme.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EventsSearchComponent', () => {
  let component: EventsSearchComponent;
  let fixture: ComponentFixture<EventsSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ThemeModule, HttpClientTestingModule],
      declarations: [EventsSearchComponent]
    }).compileComponents();
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
