namespace DeviceAnalyticsUnitTests.Infrastructure.Repositories
{
    using DeviceAnalytics.Core.Entities;
    using DeviceAnalytics.Infrastructure.Repositories;
    using DeviceAnalyticsUnitTests.Comparers;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.Collections.Generic;
    using System.Linq;

    [TestClass]
    public class DailyDeviceEventsCollectorTests
    {
        private DeviceEventComparer _deviceEventComparer;
        public DailyDeviceEventsCollectorTests()
        {
            _deviceEventComparer = new DeviceEventComparer();
        }

        [TestMethod]
        public void ShouldCollectEventsForDevice_GivenListOfDeviceEvents()
        {
            var deviceOneId = "20001f001247343438323536";
            var deviceTwoId = "7777RIf0012473434383277777";

            var eventsForDeviceOne = new List<DeviceEvent>()
            {
                new DeviceEvent
                {
                    DeviceId = deviceOneId,
                    Data = 4343,
                    EventName = "a0",
                    PublishedAt = new System.DateTime(2020, 5, 4)
                },
                new DeviceEvent
                {
                    DeviceId = deviceOneId,
                    Data = 4343,
                    EventName = "a0",
                    PublishedAt = new System.DateTime(2020, 5, 4)
                }
            };

            var eventsForDeviceTwo = new List<DeviceEvent>()
            {
                new DeviceEvent
                {
                    DeviceId = deviceTwoId,
                    Data = 4343,
                    EventName = "a0",
                    PublishedAt = new System.DateTime(2020, 5, 6)
                }
            };

            var mockEvents = new List<DeviceEvent>();
            mockEvents.AddRange(eventsForDeviceOne);
            mockEvents.AddRange(eventsForDeviceTwo);

            var sut = new DeviceEventsCollector(mockEvents);

            var deviceEventsPerDay = sut.Collect();

            Assert.IsTrue(deviceEventsPerDay.First(e => e.DeviceId == deviceOneId).Events.SequenceEqual(eventsForDeviceOne, _deviceEventComparer));
            Assert.IsTrue(deviceEventsPerDay.First(e => e.DeviceId == deviceTwoId).Events.SequenceEqual(eventsForDeviceTwo, _deviceEventComparer));
        }
    }
}
