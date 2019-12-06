import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {
  MatPaginator,
  MatSort,
  MatTable,
  MatTableDataSource
} from '@angular/material';
import { Observable, Subject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { DeviceEvent } from 'src/app/state/device-events/models/device-event.model';
import { DeviceEventsQuery } from '../../state/device-events/device-events.query';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'device-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent
  implements AfterViewInit, OnChanges, OnDestroy {
  @Input() deviceId;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  hasCache$ = this.deviceEventsQuery.selectHasCache();

  deviceEvents$: Observable<DeviceEvent[]>;
  isLoading$ = this.deviceEventsQuery.selectLoading();

  dataSource: MatTableDataSource<any>;
  displayedColumns = ['publishedAt', 'eventName', 'data'];

  constructor(private readonly deviceEventsQuery: DeviceEventsQuery) {}

  private readonly onDestroy$ = new Subject();

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes.deviceId && !!this.deviceId) {
      this.deviceEventsQuery
        .selectEntity(this.deviceId)
        .pipe(
          filter(events => !!events),
          tap(events => {
            this.dataSource = new MatTableDataSource(events.events);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          })
        )
        .subscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
  }
}
