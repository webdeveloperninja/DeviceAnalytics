namespace DeviceAnalytics.Infrastructure.Repositories
{
    using DeviceAnalytics.Core.Entities;
    using System;
    using System.Collections.Generic;

    public class DeviceEventsForDay
    {
        public readonly string DeviceId;

        public readonly DateTime EventsForDay;

        public readonly IEnumerable<DeviceEvent> Events;

        public DeviceEventsForDay(string deviceId, DateTime date, IEnumerable<DeviceEvent> events)
        {
            DeviceId = deviceId;
            EventsForDay = date;
            Events = events;
        }
    }
}
