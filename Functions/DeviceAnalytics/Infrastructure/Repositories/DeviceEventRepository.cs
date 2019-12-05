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
            var deviceIds = eventsToAdd.Select(e => e.DeviceId).Distinct();
            var eventsForDay = new Dictionary<DateTime, List<DeviceEvent>>();
            var blobsForDevice = new Dictionary<string, Dictionary<DateTime, List<DeviceEvent>>>();

            foreach (string deviceId in deviceIds)
            {
                var eventsForDevice = eventsToAdd.Where(e => e.DeviceId == deviceId);
                foreach (DeviceEvent deviceEvent in eventsForDevice)
                {
                    var eventDay = new DateTime(deviceEvent.PublishedAt.Year, deviceEvent.PublishedAt.Month, deviceEvent.PublishedAt.Day);

                    eventsForDay.TryGetValue(eventDay, out var deviceEvents);

                    if (deviceEvents == null)
                    {
                        var newEvents = new List<DeviceEvent>();
                        newEvents.Add(deviceEvent);

                        eventsForDay.Add(eventDay, newEvents);
                    }
                    else
                    {
                        deviceEvents.Add(deviceEvent);

                        eventsForDay.Add(eventDay, deviceEvents);
                    }

                    var blobName = $"{deviceId}/{eventDay.Year}/{eventDay.Month}/{eventDay.Day}";

                    var blobForDay = _blobContainer.GetAppendBlobReference(blobName);

                    var blobExists = await blobForDay.ExistsAsync();
                    if (!blobExists) await blobForDay.CreateOrReplaceAsync();

                    foreach (var e in eventsToAdd)
                    {
                        await blobForDay.AppendTextAsync(JsonConvert.SerializeObject(e) + Environment.NewLine);
                    }
                }
            }

            return new List<DeviceEvent>().AsEnumerable();
        }

        public async Task<IEnumerable<DeviceEvent>> Get(string deviceId, DateTime eventsDateTime)
        {
            var blobs = await GetBlobsForDevice(deviceId, eventsDateTime);
            var orderedBlobs = blobs.OrderByDescending(blob => blob.Properties.LastModified);

            var blobsContentTasks = orderedBlobs.Select(toDeviceEvents);
            var blobsContent = await Task.WhenAll(blobsContentTasks);

            var events = blobsContent.SelectMany(content => content.Select(blobEntry => blobEntry));

            return events;
        }

        private async Task<IEnumerable<CloudAppendBlob>> GetBlobsForDevice(string deviceId, DateTime date)
        {
            var blobListingDetails = new BlobListingDetails();
            var blobRequestOptions = new BlobRequestOptions();

            var blobResultSegment = await _blobContainer.ListBlobsSegmentedAsync(prefix: deviceId, useFlatBlobListing: true, blobListingDetails, _maxBlobResults, null, blobRequestOptions, null);
            return blobResultSegment.Results.Cast<CloudAppendBlob>();
        }

        private async Task<IEnumerable<DeviceEvent>> toDeviceEvents(CloudAppendBlob blob)
        {
            var content = await blob.DownloadTextAsync();

            var blobEntries = content.Split(Environment.NewLine.ToCharArray()).Where(entry => !string.IsNullOrEmpty(entry));
            var deviceEvents = blobEntries.Select(b => JsonConvert.DeserializeObject<DeviceEvent>(b));

            return deviceEvents;
        }
    }
}
