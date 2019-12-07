namespace DeviceAnalytics.Infrastructure.Repositories
{
    using DeviceAnalytics.Core;
    using DeviceAnalytics.Core.Entities;
    using Microsoft.WindowsAzure.Storage;
    using Microsoft.WindowsAzure.Storage.Blob;
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public class DeviceEventRepository : IDeviceEventRepository
    {
        private const int _maxBlobResults = 500;
        private const string _eventContainerName = "device-events";

        private readonly CloudStorageAccount _storageAccount;
        private readonly CloudBlobContainer _blobContainer;
        private readonly CloudBlobClient _blobClient;

        public DeviceEventRepository(IConfiguration configuration)
        {
            _storageAccount = CloudStorageAccount.Parse(configuration.StorageConnectionString);
            _blobClient = _storageAccount.CreateCloudBlobClient();
            _blobContainer = _blobClient.GetContainerReference(_eventContainerName);
        }

        public async Task<IEnumerable<DeviceEvent>> Add(IEnumerable<DeviceEvent> eventsToAdd)
        {
            var deviceEventsCollector = new DeviceEventsCollector(eventsToAdd);
            var deviceEventsForDay = deviceEventsCollector.Collect();

            foreach (var eventsForDay in deviceEventsForDay)
            {
                var blobName =
                    GetBlobName(eventsForDay.DeviceId, eventsForDay.EventsForDay);

                var blobForDay = _blobContainer.GetAppendBlobReference(blobName);

                var blobExists = await blobForDay.ExistsAsync();
                if (!blobExists) await blobForDay.CreateOrReplaceAsync();

                foreach (var deviceEvent in eventsForDay.Events)
                {
                    // TODO: Figure out how to batch append blobs. 
                    // Currently a batch append will always stay on the latest line

                    await blobForDay.AppendTextAsync(JsonConvert.SerializeObject(deviceEvent) + Environment.NewLine);
                }
            }

            return eventsToAdd;
        }

        public async Task<IEnumerable<DeviceEvent>> Get(string deviceId, DateTime from, DateTime to)
        {
            var deviceEvents = await GetDeviceEvents(deviceId, from, to);

            return deviceEvents;
        }

        private async Task<IEnumerable<DeviceEvent>> GetDeviceEvents(string deviceId, DateTime fromDate, DateTime toDate)
        {
            // Because we create blob based on UTC YYYY/MM/DD a query from the user based on date in their timezone 
            // will not match 1 to 1 with the utc stored blob. Hack for now is to subtract an extra day from the from 
            // and in the application search for the range.

            var dayBeforeFromDate = fromDate.Subtract(TimeSpan.FromDays(1));

            var blobs = new List<CloudAppendBlob>();

            while (dayBeforeFromDate < toDate)
            {
                var blobForDay = await GetBlobForDay(deviceId, dayBeforeFromDate);
                blobs.AddRange(blobForDay.Results.Cast<CloudAppendBlob>());

                dayBeforeFromDate = dayBeforeFromDate.AddDays(1);
            }

            var eventsForEachDayTasks = blobs.Select(async blob => await GetEventsFromBlob(blob));
            var eventsForEachDay = await Task.WhenAll(eventsForEachDayTasks);

            var events = eventsForEachDay
                .SelectMany(content => content.Select(blobEntry => blobEntry))
                .OrderBy(e => e.PublishedAt)
                .Where(e => e.PublishedAt >= fromDate.ToUniversalTime());

            return events;
        }

        private async Task<BlobResultSegment> GetBlobForDay(string deviceId, DateTime dateTime)
        {
            var blobListingDetails = new BlobListingDetails();
            var blobRequestOptions = new BlobRequestOptions();

            var blobName = GetBlobName(deviceId, dateTime);

            var blobResultSegment = await _blobContainer.ListBlobsSegmentedAsync(prefix: blobName, useFlatBlobListing: true, blobListingDetails, _maxBlobResults, null, blobRequestOptions, null);

            return blobResultSegment;
        }

        private async Task<IEnumerable<DeviceEvent>> GetEventsFromBlob(CloudAppendBlob blob)
        {
            var content = await blob.DownloadTextAsync();

            var blobEntries = content.Split(Environment.NewLine.ToCharArray()).Where(entry => !string.IsNullOrEmpty(entry));
            var deviceEvents = blobEntries.Where(b => !string.IsNullOrEmpty(b)).Select(b => JsonConvert.DeserializeObject<DeviceEvent>(b));

            return deviceEvents;
        }
        private string GetBlobName(string deviceId, DateTime date)
        {
            return $"{deviceId}/{date.Year}/{date.Month}/{date.Day}";
        }
    }
}
