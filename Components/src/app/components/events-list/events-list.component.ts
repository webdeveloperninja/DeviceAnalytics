import {
  Component,
  Input,
  ViewChild,
  AfterViewInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
  MatPaginator,
  MatTableDataSource,
  MatTable,
  MatSort,
  MatSortable
} from '@angular/material';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'device-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements AfterViewInit, OnChanges {
  @Input() deviceId;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  isLoading = false;

  dataSource: MatTableDataSource<any>;

  displayedColumns = ['publishedAt', 'eventName', 'data'];

  constructor(private readonly http: HttpClient) {}

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes.deviceId && !!this.deviceId) {
      this.getDeviceEvents();
    }
  }

  getDeviceEvents() {
    this.isLoading = true;
    const now = moment().endOf('day');
    const yesterday = moment()
      .subtract(5, 'd')
      .startOf('day');

    this.http
      .get(environment.getDeviceEventsApiUrl, {
        params: {
          deviceId: this.deviceId,
          from: yesterday.toISOString(),
          to: now.toISOString()
        }
      })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((deviceEvents: any[]) => {
        this.dataSource = new MatTableDataSource(deviceEvents);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.sort.sort({ id: 'publishedAt', start: 'desc' } as MatSortable);
      });
  }
}
