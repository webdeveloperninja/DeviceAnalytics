namespace DeviceAnalytics.Core.Entities
{
    using System;

    public class DeviceEvent
    {
        public string DeviceId { get; set; }

        public int Data { get; set; }

        public string EventName { get; set; }

        public DateTime PublishedAt { get; set; }
    }
}
