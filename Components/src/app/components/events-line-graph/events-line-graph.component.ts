import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { finalize, map } from 'rxjs/operators';
import { DeviceEvent } from 'src/app/models/device-event.model';
import * as _ from 'underscore';

@Component({
  selector: 'app-events-line-graph',
  templateUrl: './events-line-graph.component.html',
  styleUrls: ['./events-line-graph.component.scss']
})
export class EventsLineGraphComponent implements OnChanges {
  chart;
  isLoading = false;

  @Input() deviceId;

  constructor(private readonly http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes.deviceId && !!this.deviceId) {
      this.getDeviceEvents();
    }
  }

  getDeviceEvents() {
    this.isLoading = true;
    const now = moment().endOf('day');
    const yesterday = moment().startOf('day');

    console.log(yesterday);
    this.http
      .get<DeviceEvent[]>(environment.getDeviceEventsApiUrl, {
        params: {
          deviceId: this.deviceId,
          from: yesterday.toISOString(),
          to: now.toISOString()
        }
      })
      .pipe(
        map(deviceEvents => {
          return deviceEvents.map(event => {
            return {
              ...event,
              publishedAt: moment(event.publishedAt)
            };
          });
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(deviceEvents => {
        const events = deviceEvents.sort((left, right) =>
          left.publishedAt.diff(right.publishedAt)
        );
        const data = events.map(e => {
          return {
            t: e.publishedAt.date,
            y: +e.data
          };
        });

        const labels = events.map(d => d.publishedAt.format('LLLL'));

        this.chart = new Chart('canvas', {
          type: 'line',
          data: {
            labels,
            datasets: [
              {
                data,
                label: 'A0',
                borderColor: '#3e95cd',
                fill: false
              }
            ]
          },
          options: {
            title: {
              display: true,
              text: 'Sensor Voltage (in mV)'
            }
          }
        });
      });
  }
}
