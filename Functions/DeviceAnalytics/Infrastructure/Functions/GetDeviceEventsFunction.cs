namespace DeviceAnalytics
{
    using DeviceAnalytics.Controllers;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Azure.WebJobs;
    using Microsoft.Azure.WebJobs.Extensions.Http;
    using Microsoft.Extensions.Logging;
    using System;
    using System.Threading.Tasks;

    public class GetDeviceEventsFunction
    {
        private readonly GetDeviceEventsController _getDeviceEventsController;

        public GetDeviceEventsFunction(GetDeviceEventsController getDeviceEventsController)
        {
            _getDeviceEventsController = getDeviceEventsController;
        }

        [FunctionName("get-device-events")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            var deviceId = req.Query["deviceId"];
            var eventsDateInput = req.Query["date"];

            var eventsDate = DateTime.Parse(eventsDateInput);

            var results = await _getDeviceEventsController.Execute(deviceId, eventsDate);

            return new OkObjectResult(results);
        }
    }
}
