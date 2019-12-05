namespace DeviceAnalytics.Controllers
{
    using DeviceAnalytics.Core.Entities;
    using DeviceAnalytics.Core.Queries;
    using MediatR;
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public class GetDeviceEventsController
    {
        private readonly IMediator _mediator;

        public GetDeviceEventsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task<IEnumerable<DeviceEvent>> Execute(string deviceId, DateTime fromDate, DateTime toDate)
        {
            var request = new GetDeviceEventsRequest
            {
                DeviceId = deviceId,
                fromDate = fromDate,
                toDate = toDate
            };

            var results = await _mediator.Send(request);
            return results;
        }
    }
}
