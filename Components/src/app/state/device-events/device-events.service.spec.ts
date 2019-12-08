import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { DeviceEventsStore } from './device-events.store';
import {
  DeviceEventsService,
  getDeviceEventsErrorMessage,
  errorSnackBarDuration
} from './device-events.service';
import * as moment from 'moment';
import { DeviceEvent } from './models/device-event.model';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

describe('DeviceEventsService', () => {
  const deviceId = '20001f001247343438323536';
  const from = moment('12-08-2019', 'MM-DD-YYYY');
  const to = moment('12-09-2019', 'MM-DD-YYYY');

  const mockDeviceEvent: DeviceEvent = {
    deviceId,
    publishedAt: from,
    data: 434,
    eventName: 'Coolant level'
  };

  const mockDeviceEvents = [mockDeviceEvent];

  let deviceEventsStoreSpy: jasmine.SpyObj<DeviceEventsStore>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let httpTestingController: HttpTestingController;
  let deviceEventsService: DeviceEventsService;

  beforeEach(() => {
    deviceEventsStoreSpy = jasmine.createSpyObj('DeviceEventsStore', [
      'upsert',
      'setActive',
      'setLoading'
    ]);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    TestBed.configureTestingModule({
      providers: [
        DeviceEventsService,
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: DeviceEventsStore, useValue: deviceEventsStoreSpy }
      ],
      imports: [HttpClientTestingModule]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    deviceEventsService = TestBed.get(DeviceEventsService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('get', () => {
    it('should make GET request', () => {
      deviceEventsService.get(deviceId, from, to).subscribe();

      httpTestingController.expectOne(
        r => r.url === environment.getDeviceEventsApiUrl && r.method === 'GET'
      );
    });

    it('should upsert device events', () => {
      deviceEventsService.get(deviceId, from, to).subscribe();

      const req = httpTestingController.expectOne(
        r => r.url === environment.getDeviceEventsApiUrl && r.method === 'GET'
      );

      req.flush(mockDeviceEvents);

      expect(deviceEventsStoreSpy.upsert).toHaveBeenCalledWith(deviceId, {
        events: mockDeviceEvents
      });
    });

    it('should set active device events', () => {
      deviceEventsService.get(deviceId, from, to).subscribe();

      const req = httpTestingController.expectOne(
        r => r.url === environment.getDeviceEventsApiUrl && r.method === 'GET'
      );

      req.flush(mockDeviceEvents);
      expect(deviceEventsStoreSpy.setActive).toHaveBeenCalledWith(deviceId);
    });

    it('should set loading to false on error', () => {
      deviceEventsService
        .get(deviceId, from, to)
        .pipe(catchError(e => of(e)))
        .subscribe();

      const req = httpTestingController.expectOne(
        request =>
          request.url === environment.getDeviceEventsApiUrl &&
          request.method === 'GET'
      );

      req.error({} as ErrorEvent);

      expect(deviceEventsStoreSpy.setLoading).toHaveBeenCalledWith(false);
    });

    it('should call snackbar on http error', () => {
      deviceEventsService
        .get(deviceId, from, to)
        .pipe(catchError(e => of(e)))
        .subscribe();

      const req = httpTestingController.expectOne(
        request =>
          request.url === environment.getDeviceEventsApiUrl &&
          request.method === 'GET'
      );

      req.error({} as ErrorEvent);

      expect(snackBarSpy.open).toHaveBeenCalledWith(
        getDeviceEventsErrorMessage,
        null,
        {
          duration: errorSnackBarDuration
        }
      );
    });
  });
});
