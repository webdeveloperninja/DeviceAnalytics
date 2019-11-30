namespace DeviceAnalyticsUnitTests.Controllers
{
    using DeviceAnalytics.Controllers;
    using DeviceAnalytics.Controllers.Contracts;
    using DeviceAnalytics.Core.Commands;
    using DeviceAnalytics.Core.Entities;
    using MediatR;
    using Microsoft.Azure.EventHubs;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Moq;
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading;

    [TestClass]
    public class PersistDeviceEventControllerTests
    {
        private DeviceEventComparer _deviceEventComparer;

        public PersistDeviceEventControllerTests()
        {
            _deviceEventComparer = new DeviceEventComparer();
        }

        [TestMethod]
        public void ShouldSendPersistDeviceEventRequest_GivenEventData()
        {
            var mediatorMock = new Mock<IMediator>();

            var sut = new PersistDeviceEventController(mediatorMock.Object);

            var particleEvent = new ParticlePhotonEvent
            {
                DeviceId = "20001f001247343438323536",
                EventName = "a0",
                Data = 3223,
                PublishedAt = new DateTime()
            };

            var eventString = JsonConvert.SerializeObject(particleEvent);
            var eventData = new EventData(Encoding.UTF8.GetBytes(eventString));

            var eventsToPersist = new EventData[1]
            {
                eventData
            };

            sut.Execute(eventsToPersist);

            var expectedDeviceEvent = new DeviceEvent
            {
                DeviceId = particleEvent.DeviceId,
                EventName = particleEvent.EventName,
                Data = particleEvent.Data,
                PublishedAt = particleEvent.PublishedAt
            };

            var expectedRequest = new PersistDeviceEventRequest
            {
                Events = new List<DeviceEvent>()
                {
                    expectedDeviceEvent
                }
            };

            mediatorMock
                .Verify(mediator => mediator
                    .Send(It.Is<PersistDeviceEventRequest>(r => DoesRequestMatch(r, expectedRequest)), It.IsAny<CancellationToken>()), Times.Once);
        }

        private bool DoesRequestMatch(PersistDeviceEventRequest deviceEvent, PersistDeviceEventRequest toCompare)
        {
            return deviceEvent.Events.SequenceEqual(toCompare.Events, _deviceEventComparer);
        }
    }

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
