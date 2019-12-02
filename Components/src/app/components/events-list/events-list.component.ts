import {
  Component,
  Input,
  ViewChild,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatPaginator, MatTableDataSource, MatTable } from '@angular/material';

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

  dataSource: MatTableDataSource<any>;

  displayedColumns = ['publishedAt', 'eventName', 'data'];

  constructor(private readonly http: HttpClient) {}

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes.deviceId && !!this.deviceId) {
      this.getDeviceEvents();
    }
  }

  getDeviceEvents() {
    this.http
      .get(environment.getDeviceEventsApiUrl, {
        params: { deviceId: this.deviceId, date: '12/1/2019' }
      })
      .subscribe((deviceEvents: any[]) => {
        this.dataSource = new MatTableDataSource(deviceEvents);
        this.dataSource.paginator = this.paginator;
      });
  }
}
