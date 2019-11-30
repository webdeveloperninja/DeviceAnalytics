namespace DeviceAnalytics.Core.Commands
{
    using DeviceAnalytics.Core.Entities;
    using MediatR;
    using System.Collections.Generic;
    using System.Threading;
    using System.Threading.Tasks;

    public class PersistDeviceEventRequest : IRequest<IEnumerable<DeviceEvent>>
    {
        public IEnumerable<DeviceEvent> Events;
    }

    public class PersistDeviceEvent : IRequestHandler<PersistDeviceEventRequest, IEnumerable<DeviceEvent>>
    {
        private IDeviceEventRepository _eventRepository;

        public PersistDeviceEvent(IDeviceEventRepository eventRepository)
        {
            _eventRepository = eventRepository;
        }

        public Task<IEnumerable<DeviceEvent>> Handle(PersistDeviceEventRequest request, CancellationToken cancellationToken)
        {
            return _eventRepository.Add(request.Events);
        }
    }
}
