import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, tap, catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { DeviceEventsStore } from './device-events.store';
import * as moment from 'moment';
import { DeviceEventsSummary } from './models/device-events-summary.model';
import { DeviceEvent } from './models/device-event.model';

export const getDeviceEventsErrorMessage =
  'There was an error getting device events';
export const errorSnackBarDuration = 3000;

@Injectable({
  providedIn: 'root'
})
export class DeviceEventsService {
  constructor(
    private deviceEventsStore: DeviceEventsStore,
    private readonly httpClient: HttpClient,
    private readonly snackBar: MatSnackBar
  ) {}

  get(deviceId: string, from: moment.Moment, to: moment.Moment) {
    this.deviceEventsStore.setLoading(true);

    return this.httpClient
      .get<DeviceEvent[]>(environment.getDeviceEventsApiUrl, {
        params: {
          deviceId,
          from: from.toISOString(),
          to: to.toISOString()
        }
      })
      .pipe(
        map(events => {
          return events.map(event => {
            return {
              ...event,
              publishedAt: moment(event.publishedAt)
            };
          });
        }),
        tap(events => {
          const summary: DeviceEventsSummary = {
            events
          };

          this.deviceEventsStore.upsert(deviceId, summary);
          this.deviceEventsStore.setActive(deviceId);
        }),
        finalize(() => {
          this.deviceEventsStore.setLoading(false);
        }),
        catchError(error => {
          this.openSnackBar(getDeviceEventsErrorMessage);

          return throwError(error);
        })
      );
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: errorSnackBarDuration
    });
  }
}
