import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { DeviceEventsSummary } from './models/device-events-summary.model';

export interface DeviceEventsState extends EntityState<DeviceEventsSummary> {}

const initialState: Partial<DeviceEventsState> = {
  loading: false
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'deviceEvents' })
export class DeviceEventsStore extends EntityStore<DeviceEventsState> {
  constructor() {
    super(initialState);
  }
}
