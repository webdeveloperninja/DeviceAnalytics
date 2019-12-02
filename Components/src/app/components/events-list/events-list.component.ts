import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'device-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements OnInit {
  data;

  constructor(private readonly http: HttpClient) {}

  ngOnInit() {}

  onGetEventsClick() {
    this.http
      .get(environment.getDeviceEventsApiUrl, {
        params: { deviceId: '20001f001247343438323536', date: '12/1/2019' }
      })
      .subscribe(d => {
        this.data = d;
      });
  }
}
