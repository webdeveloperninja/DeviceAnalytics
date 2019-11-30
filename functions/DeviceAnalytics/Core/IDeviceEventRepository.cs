namespace DeviceAnalytics.Core
{
    using DeviceAnalytics.Core.Entities;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public interface IDeviceEventRepository
    {
        Task<IEnumerable<DeviceEvent>> Add(IEnumerable<DeviceEvent> eventsToAdd);
    }
}
