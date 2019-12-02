using DeviceAnalytics;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;

[assembly: FunctionsStartup(typeof(Startup))]
namespace DeviceAnalytics
{
    using Newtonsoft.Json;
    using Newtonsoft.Json.Serialization;
    using System.Reflection;
    using MediatR;
    using DeviceAnalytics.Core;
    using DeviceAnalytics.Infrastructure.Repositories;
    using Microsoft.Extensions.DependencyInjection;
    using DeviceAnalytics.Controllers;
    using DeviceAnalytics.Infrastructure;

    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddMediatR(typeof(Startup).GetTypeInfo().Assembly);
            builder.Services.AddTransient<IDeviceEventRepository, DeviceEventRepository>();
            builder.Services.AddTransient<PersistDeviceEventController>();
            builder.Services.AddTransient<GetDeviceEventsController>();
            builder.Services.AddTransient<IConfiguration, Configuration>();

            JsonConvert.DefaultSettings = () => new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };
        }
    }
}
