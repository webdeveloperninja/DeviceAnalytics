import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { DeviceSummary } from './models/device-summary.model';

export interface DeviceEventsState extends EntityState<DeviceSummary> {}

const initialState: Partial<DeviceEventsState> = {
  loading: false
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'deviceSummaries' })
export class DeviceEventsStore extends EntityStore<DeviceEventsState> {
  constructor() {
    super(initialState);
  }
}
