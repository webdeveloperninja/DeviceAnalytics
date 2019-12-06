import {
  Component,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { DeviceEventsService } from 'src/app/state/device-events/device-events.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

export interface Chip {
  name: string;
  getFrom: (date: moment.Moment) => moment.Moment;
}

@Component({
  selector: 'app-events-search',
  templateUrl: './events-search.component.html',
  styleUrls: ['./events-search.component.scss']
})
export class EventsSearchComponent implements OnDestroy, OnChanges {
  @Input() deviceId;

  chips: Chip[] = [
    {
      name: '5 min',
      getFrom: (date: moment.Moment) => date.clone().subtract(5, 'm')
    },
    {
      name: '15 min',
      getFrom: (date: moment.Moment) => date.clone().subtract(15, 'm')
    },
    {
      name: '60 min',
      getFrom: (date: moment.Moment) => date.clone().subtract(60, 'm')
    },
    {
      name: '3 days',
      getFrom: (date: moment.Moment) => date.clone().subtract(3, 'd')
    }
  ];

  activeChip = this.chips[0];

  private onDestroy$ = new Subject();

  constructor(private readonly deviceEventsService: DeviceEventsService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes.deviceId && !!this.deviceId) {
      const from = this.activeChip.getFrom(moment());
      this.getEvents(from);
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next();
  }

  onChipClick(chip: Chip) {
    this.activeChip = chip;
    const from = chip.getFrom(moment());

    this.getEvents(from);
  }

  getEvents(from: moment.Moment) {
    const to = moment().endOf('day');

    this.deviceEventsService
      .get(this.deviceId, from, to)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe();
  }
}
