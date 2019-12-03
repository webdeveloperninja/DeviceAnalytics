import { BrowserModule } from '@angular/platform-browser';
import { NgModule, DoBootstrap, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { AppComponent } from './app.component';
import { EventsListComponent } from './components/events-list/events-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ThemeModule } from './theme/theme.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ElementZoneStrategyFactory } from 'elements-zone-strategy';
import { EventsLineGraphComponent } from './components/events-line-graph/events-line-graph.component';

@NgModule({
  declarations: [AppComponent, EventsListComponent, EventsLineGraphComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    ThemeModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [],
  entryComponents: [AppComponent, EventsListComponent, EventsLineGraphComponent]
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

    customElements.define('device-events-grid', deviceEventsListElement);

    customElements.define(
      'device-events-line-graph',
      deviceEventsLineGraphElement
    );
  }
}
