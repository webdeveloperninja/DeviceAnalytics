import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { DeviceEventsState, DeviceEventsStore } from './device-events.store';

@Injectable({ providedIn: 'root' })
export class DeviceEventsQuery extends QueryEntity<DeviceEventsState> {
  constructor(protected store: DeviceEventsStore) {
    super(store);
  }
}
