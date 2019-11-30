namespace DeviceAnalytics.Controllers.Contracts
{
    using System;
    using DeviceAnalytics.Core.Entities;
    using Newtonsoft.Json;
    public class ParticlePhotonEvent
    {
        [JsonProperty("device_id")]
        public string DeviceId { get; set; }

        public int Data { get; set; }

        [JsonProperty("event")]
        public string EventName { get; set; }

        [JsonProperty("published_at")]
        public DateTime PublishedAt { get; set; }

        public static DeviceEvent ToDeviceEvent(ParticlePhotonEvent photonEvent)
        {
            return new DeviceEvent
            {
                DeviceId = photonEvent.DeviceId,
                Data = photonEvent.Data,
                EventName = photonEvent.EventName,
                PublishedAt = photonEvent.PublishedAt
            };
        }
    }
}
