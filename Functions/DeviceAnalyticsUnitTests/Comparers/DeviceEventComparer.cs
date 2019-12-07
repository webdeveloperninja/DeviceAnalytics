namespace DeviceAnalyticsUnitTests.Comparers
{
    using DeviceAnalytics.Core.Entities;
    using System.Collections.Generic;

    public class DeviceEventComparer : EqualityComparer<DeviceEvent>
    {
        public override bool Equals(DeviceEvent deviceEvent, DeviceEvent toCompare)
        {
            if (object.ReferenceEquals(deviceEvent, toCompare))
                return true;

            if (deviceEvent is null || toCompare is null)
                return false;

            return deviceEvent.Data == toCompare.Data && deviceEvent.DeviceId == toCompare.DeviceId && deviceEvent.EventName == toCompare.EventName && deviceEvent.PublishedAt == toCompare.PublishedAt;
        }

        public override int GetHashCode(DeviceEvent deviceEvent) => deviceEvent.GetHashCode();
    }
}
