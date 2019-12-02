import { BrowserModule } from '@angular/platform-browser';
import { NgModule, DoBootstrap, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { AppComponent } from './app.component';
import { EventsListComponent } from './components/events-list/events-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ThemeModule } from './theme/theme.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ElementZoneStrategyFactory } from 'elements-zone-strategy';

@NgModule({
  declarations: [AppComponent, EventsListComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    ThemeModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [],
  entryComponents: [AppComponent, EventsListComponent]
})
export class AppModule implements DoBootstrap {
  constructor(private readonly injector: Injector) {}

  ngDoBootstrap() {
    const strategyFactory = new ElementZoneStrategyFactory(
      EventsListComponent,
      this.injector
    );
    const deviceEventsListElement = createCustomElement(EventsListComponent, {
      injector: this.injector,
      strategyFactory
    });
    customElements.define('device-events-grid', deviceEventsListElement);
  }
}
