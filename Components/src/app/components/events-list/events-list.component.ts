import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
      .get('http://localhost:7071/api/get-device-events', {
        params: { deviceId: '20001f001247343438323536', date: '12/1/2019' }
      })
      .subscribe(d => {
        this.data = d;
      });
  }
}
