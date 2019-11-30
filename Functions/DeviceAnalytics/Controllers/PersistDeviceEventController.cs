namespace DeviceAnalytics.Controllers
{
    using DeviceAnalytics.Controllers.Contracts;
    using DeviceAnalytics.Core.Commands;
    using DeviceAnalytics.Core.Entities;
    using MediatR;
    using Microsoft.Azure.EventHubs;
    using Newtonsoft.Json;
    using System.Linq;
    using System.Text;

    public class PersistDeviceEventController
    {
        private IMediator _mediator { get; set; }

        public PersistDeviceEventController(IMediator mediator)
        {
            _mediator = mediator;
        }

        public void Execute(EventData[] eventsToPersist)
        {
            var events = eventsToPersist.Select(ToDeviceEvent);

            var request = new PersistDeviceEventRequest
            {
                Events = events
            };

            _mediator.Send(request);
        }

        private DeviceEvent ToDeviceEvent(EventData data)
        {
            var eventBody = Encoding.UTF8.GetString(data.Body.Array, data.Body.Offset, data.Body.Count);
            var particleEvent = JsonConvert.DeserializeObject<ParticlePhotonEvent>(eventBody);

            return ParticlePhotonEvent.ToDeviceEvent(particleEvent);
        }
    }
}
