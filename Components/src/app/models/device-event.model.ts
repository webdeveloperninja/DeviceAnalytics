import * as moment from 'moment';

export class DeviceEvent {
  deviceId: string;
  data: number;
  eventName: string;
  publishedAt: moment.Moment;
}
