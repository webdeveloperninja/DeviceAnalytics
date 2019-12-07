namespace DeviceAnalytics
{
    using DeviceAnalytics.Controllers;
    using Microsoft.Azure.EventHubs;
    using Microsoft.Azure.WebJobs;
    using Microsoft.Extensions.Logging;

    public class PersistDeviceEventFunction
    {
        private PersistDeviceEventController _persistEventController;

        public PersistDeviceEventFunction(PersistDeviceEventController persistEventController)
        {
            _persistEventController = persistEventController;
        }

        [FunctionName("persist-device-event")]
        public void Run([EventHubTrigger("allthingssensorshub", ConsumerGroup = "local-device-analytics", Connection = "eventHubConnection")] EventData[] events, ILogger log)
        {
            _persistEventController.Execute(events);
        }
    }
}
