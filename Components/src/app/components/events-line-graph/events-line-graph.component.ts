import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { finalize } from 'rxjs/operators';
import { DeviceEvent } from 'src/app/models/device-event.model';

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
    const now = moment.utc();

    this.http
      .get(environment.getDeviceEventsApiUrl, {
        params: { deviceId: this.deviceId, date: now.format() }
      })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((deviceEvents: DeviceEvent[]) => {
        const data = deviceEvents.map(e => {
          return {
            t: moment(e.publishedAt).format(),
            y: +e.data
          };
        });

        this.chart = new Chart('canvas', {
          type: 'line',
          data: {
            labels: [6000, 5000, 4000, 3000, 2000, 1000],
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
