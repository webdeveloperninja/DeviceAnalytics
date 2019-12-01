namespace DeviceAnalytics.Infrastructure
{
    using DeviceAnalytics.Core;
    using System;

    public class Configuration : IConfiguration
    {
        public string StorageConnectionString => Environment.GetEnvironmentVariable("storageConnection", EnvironmentVariableTarget.Process);
    }
}
