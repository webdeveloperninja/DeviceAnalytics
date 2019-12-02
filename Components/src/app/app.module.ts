import { BrowserModule } from '@angular/platform-browser';
import { NgModule, DoBootstrap, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { AppComponent } from './app.component';
import { EventsListComponent } from './components/events-list/events-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ThemeModule } from './theme/theme.module';

@NgModule({
  declarations: [AppComponent, EventsListComponent],
  imports: [BrowserModule, HttpClientModule, ThemeModule],
  providers: [],
  bootstrap: [],
  entryComponents: [AppComponent, EventsListComponent]
})
export class AppModule implements DoBootstrap {
  constructor(private readonly injector: Injector) {}

  ngDoBootstrap() {
    const deviceEventsListElement = createCustomElement(EventsListComponent, {
      injector: this.injector
    });

    customElements.define('device-events-grid', deviceEventsListElement);
  }
}
