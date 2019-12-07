namespace DeviceAnalytics.Infrastructure.Repositories
{
    using DeviceAnalytics.Core.Entities;
    using System;
    using System.Collections.Generic;

    public class DeviceEventsFor
    {
        public readonly string DeviceId;

        public readonly DateTime Date;

        public readonly IEnumerable<DeviceEvent> Events;

        public DeviceEventsFor(string deviceId, DateTime date, IEnumerable<DeviceEvent> events)
        {
            DeviceId = deviceId;
            Date = date;
            Events = events;
        }
    }
}
