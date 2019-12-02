import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'device-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements OnInit {
  @Input() deviceId;

  displayedColumns: string[] = ['publishedAt', 'eventName', 'data'];

  data;

  constructor(private readonly http: HttpClient) {}

  ngOnInit() {}

  onGetEventsClick() {
    this.http
      .get(environment.getDeviceEventsApiUrl, {
        params: { deviceId: this.deviceId, date: '12/1/2019' }
      })
      .subscribe(d => {
        this.data = d;
      });
  }
}
