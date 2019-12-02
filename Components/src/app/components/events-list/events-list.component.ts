import {
  Component,
  OnInit,
  Input,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'device-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements OnInit, AfterViewInit {
  @Input() deviceId;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  readonly dataSource = new MatTableDataSource();

  displayedColumns: string[] = ['publishedAt', 'eventName', 'data'];

  constructor(private readonly http: HttpClient) {}

  ngOnInit() {
    this.getDeviceEvents();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getDeviceEvents() {
    this.http
      .get(environment.getDeviceEventsApiUrl, {
        params: { deviceId: this.deviceId, date: '12/1/2019' }
      })
      .subscribe((deviceEvents: any[]) => {
        this.dataSource.data = deviceEvents;
        this.dataSource.paginator = this.paginator;
      });
  }
}
