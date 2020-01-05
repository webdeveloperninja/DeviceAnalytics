import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsListComponent } from './events-list.component';
import { ThemeModule } from 'src/app/theme/theme.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxAdalService } from 'ngx-adal-8';

describe('EventsListComponent', () => {
  let component: EventsListComponent;
  let fixture: ComponentFixture<EventsListComponent>;
  let adalAuthServiceSpy: jasmine.SpyObj<NgxAdalService>;

  beforeEach(async(() => {
    adalAuthServiceSpy = jasmine.createSpyObj('NgxAdalService', ['login']);

    TestBed.configureTestingModule({
      imports: [ThemeModule, NoopAnimationsModule, HttpClientTestingModule],
      providers: [{ provide: NgxAdalService, useValue: adalAuthServiceSpy }],
      declarations: [EventsListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsListComponent);
    component = fixture.componentInstance;
    component.ngAfterViewInit();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
