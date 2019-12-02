namespace DeviceAnalytics.Core.Queries
{
    using DeviceAnalytics.Core.Entities;
    using MediatR;
    using System;
    using System.Collections.Generic;
    using System.Threading;
    using System.Threading.Tasks;

    public class GetDeviceEventsRequest : IRequest<IEnumerable<DeviceEvent>>
    {
        public string DeviceId;

        public DateTime eventsDate;
    }

    public class GetDeviceEvents : IRequestHandler<GetDeviceEventsRequest, IEnumerable<DeviceEvent>>
    {
        private readonly IDeviceEventRepository _eventRepository;

        public GetDeviceEvents(IDeviceEventRepository eventRepository)
        {
            _eventRepository = eventRepository;
        }

        public Task<IEnumerable<DeviceEvent>> Handle(GetDeviceEventsRequest request, CancellationToken cancellationToken)
        {
            return _eventRepository.Get(request.DeviceId, request.eventsDate);
        }
    }
}
