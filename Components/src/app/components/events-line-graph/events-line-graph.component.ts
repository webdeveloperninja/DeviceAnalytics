import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js';
import { filter, tap } from 'rxjs/operators';
import { DeviceEventsQuery } from 'src/app/state/device-events/device-events.query';
import { DeviceEvent } from 'src/app/state/device-events/models/device-event.model';
import * as moment from 'moment';

@Component({
  selector: 'app-events-line-graph',
  templateUrl: './events-line-graph.component.html',
  styleUrls: ['./events-line-graph.component.scss']
})
export class EventsLineGraphComponent implements OnChanges {
  chart;
  isLoading = false;
  isLoading$ = this.deviceEventsQuery.selectLoading();

  @Input() deviceId;

  constructor(private readonly deviceEventsQuery: DeviceEventsQuery) {}

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes.deviceId && !!this.deviceId) {
      this.deviceEventsQuery
        .selectEntity(this.deviceId)
        .pipe(
          filter(events => !!events),
          tap(summary => {
            this.renderGraph(summary.events);
          })
        )
        .subscribe();
    }
  }

  private renderGraph(deviceEvents: DeviceEvent[]) {
    const data = deviceEvents.map(e => {
      return {
        t: e.publishedAt.date,
        y: +e.data
      };
    });

    const labels = deviceEvents.map(d => d.publishedAt.format('LLLL'));

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
  }
}
