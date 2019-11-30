namespace DeviceAnalyticsUnitTests.Core.Commands
{
    using DeviceAnalytics.Core;
    using DeviceAnalytics.Core.Commands;
    using DeviceAnalytics.Core.Entities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Moq;
    using System.Collections.Generic;
    using System.Threading;

    [TestClass]
    public class PersistDeviceEventTests
    {
        [TestMethod]
        public void ShouldAddLatestEvent_GivenPersistDeviceEventRequest()
        {
            var repositoryMock = new Mock<IDeviceEventRepository>();

            var sut = new PersistDeviceEvent(repositoryMock.Object);

            var request = new PersistDeviceEventRequest
            {
                Events = new List<DeviceEvent>()
                {
                    new DeviceEvent
                    {
                        DeviceId = "20001f001247343438323536",
                        Data = 4343,
                        EventName = "a0",
                        PublishedAt = new System.DateTime()
                    }
                }
            };

            sut.Handle(request, It.IsAny<CancellationToken>());

            repositoryMock.Verify(eventRepositoryMock => eventRepositoryMock.Add(request.Events), Times.Once());
        }

        [TestMethod]
        public void ShouldNotAddLatestEvent_WithDifferentPersistDeviceEventRequest()
        {
            var repositoryMock = new Mock<IDeviceEventRepository>();

            var sut = new PersistDeviceEvent(repositoryMock.Object);

            var request = new PersistDeviceEventRequest
            {
                Events = new List<DeviceEvent>()
                {
                    new DeviceEvent
                    {
                        DeviceId = "20001f001247343438323536",
                        Data = 4343,
                        EventName = "a0",
                        PublishedAt = new System.DateTime()
                    }
                }
            };

            var differentRequest = new PersistDeviceEventRequest();

            sut.Handle(request, It.IsAny<CancellationToken>());

            repositoryMock.Verify(eventRepositoryMock => eventRepositoryMock.Add(differentRequest.Events), Times.Never());
        }
    }
}
