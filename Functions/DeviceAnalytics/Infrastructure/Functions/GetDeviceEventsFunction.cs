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
            var deviceId = req.Query["deviceId"];
            var fromDateInput = req.Query["from"];
            var toDateInput = req.Query["to"];

            var fromDate = DateTime.Parse(fromDateInput);
            var toDate = DateTime.Parse(toDateInput);

            var results = await _getDeviceEventsController.Execute(deviceId, fromDate, toDate);

            return new OkObjectResult(results);
        }
    }
}
