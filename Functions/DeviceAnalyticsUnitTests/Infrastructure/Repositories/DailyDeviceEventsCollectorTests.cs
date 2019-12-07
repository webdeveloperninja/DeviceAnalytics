namespace DeviceAnalyticsUnitTests.Infrastructure.Repositories
{
    using DeviceAnalytics.Core.Entities;
    using DeviceAnalytics.Infrastructure.Repositories;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.Collections.Generic;

    [TestClass]
    public class DailyDeviceEventsCollectorTests
    {
        [TestMethod]
        public void ShouldCollect()
        {
            var mockEvents = new List<DeviceEvent>()
            {
                new DeviceEvent
                {
                    DeviceId = "20001f001247343438323536",
                    Data = 4343,
                    EventName = "a0",
                    PublishedAt = new System.DateTime(2020, 5, 4)
                },
                new DeviceEvent
                {
                    DeviceId = "20001f001247343438323536",
                    Data = 4343,
                    EventName = "a0",
                    PublishedAt = new System.DateTime(2020, 5, 4)
                },
                new DeviceEvent
                {
                    DeviceId = "20001f00124734343832f3536",
                    Data = 4343,
                    EventName = "a0",
                    PublishedAt = new System.DateTime(2020, 5, 6)
                },
            };

            var sut = new DailyDeviceEventsCollector(mockEvents);

            var deviceEventsPerDay = sut.Collect();
        }
    }
}
