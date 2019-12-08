import { BrowserModule } from '@angular/platform-browser';
import { NgModule, DoBootstrap, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { EventsListComponent } from './components/events-list/events-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ThemeModule } from './theme/theme.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ElementZoneStrategyFactory } from 'elements-zone-strategy';
import { EventsLineGraphComponent } from './components/events-line-graph/events-line-graph.component';
import { EventsSearchComponent } from './components/events-search/events-search.component';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { environment } from '../environments/environment';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    EventsListComponent,
    EventsLineGraphComponent,
    EventsSearchComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ThemeModule,
    BrowserAnimationsModule,
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [],
  entryComponents: [
    EventsListComponent,
    EventsLineGraphComponent,
    EventsSearchComponent
  ]
})
export class AppModule implements DoBootstrap {
  constructor(private readonly injector: Injector) {}

  ngDoBootstrap() {
    const eventsGridStrategyFactory = new ElementZoneStrategyFactory(
      EventsListComponent,
      this.injector
    );
    const eventsLineGraphstrategyFactory = new ElementZoneStrategyFactory(
      EventsLineGraphComponent,
      this.injector
    );
    const eventsSearchstrategyFactory = new ElementZoneStrategyFactory(
      EventsSearchComponent,
      this.injector
    );

    const deviceEventsListElement = createCustomElement(EventsListComponent, {
      injector: this.injector,
      strategyFactory: eventsGridStrategyFactory
    });

    const deviceEventsLineGraphElement = createCustomElement(
      EventsLineGraphComponent,
      {
        injector: this.injector,
        strategyFactory: eventsLineGraphstrategyFactory
      }
    );

    const deviceEventsSearchElement = createCustomElement(
      EventsSearchComponent,
      {
        injector: this.injector,
        strategyFactory: eventsSearchstrategyFactory
      }
    );

    customElements.define('device-events-grid', deviceEventsListElement);

    customElements.define(
      'device-events-line-graph',
      deviceEventsLineGraphElement
    );

    customElements.define('device-events-search', deviceEventsSearchElement);
  }
}
