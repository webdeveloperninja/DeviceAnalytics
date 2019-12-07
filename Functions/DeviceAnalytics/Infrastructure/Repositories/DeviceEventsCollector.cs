namespace DeviceAnalytics.Infrastructure.Repositories
{
    using DeviceAnalytics.Core.Entities;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public class DeviceEventsCollector
    {
        private IEnumerable<DeviceEvent> _events;

        public DeviceEventsCollector(IEnumerable<DeviceEvent> events)
        {
            _events = events;
        }

        public IEnumerable<DeviceEventsForDay> Collect()
        {
            var eventsForDevice = _events
                .GroupBy(e => e.DeviceId);

            return eventsForDevice
                .SelectMany(eventsGrouping => eventsGrouping
                .GroupBy(deviceEvent => new DateTime(deviceEvent.PublishedAt.Year, deviceEvent.PublishedAt.Month, deviceEvent.PublishedAt.Day)))
                .Select(deviceEventsForDay =>
                {
                    // TODO: Figure out a better way to get device id here
                    var deviceId = deviceEventsForDay.First().DeviceId;

                    return new DeviceEventsForDay(deviceId, new DateTime(deviceEventsForDay.Key.Year, deviceEventsForDay.Key.Month, deviceEventsForDay.Key.Day), deviceEventsForDay);
                });
        }
    }
}
