namespace DeviceAnalytics.Infrastructure.Repositories
{
    using DeviceAnalytics.Core;
    using DeviceAnalytics.Core.Entities;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public class DeviceEventRepository : IDeviceEventRepository
    {
        public Task<IEnumerable<DeviceEvent>> Add(IEnumerable<DeviceEvent> eventsToAdd)
        {
            return Task.FromResult(new List<DeviceEvent>().AsEnumerable());
        }
    }
}
