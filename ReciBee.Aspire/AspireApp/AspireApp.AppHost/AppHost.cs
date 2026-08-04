using System.Diagnostics;
using System.IO;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;


var builder = DistributedApplication.CreateBuilder(args);

var recipeMongoDB = builder.AddMongoDB("reciBee-db")
    .WithEndpoint(port: 27020, targetPort: 27017, name: "reciBee-mongo", isProxied: false)
    .WithLifetime(ContainerLifetime.Persistent);

var reciBeeDB = recipeMongoDB.AddDatabase("reciBee");

var apiPath = Path.GetFullPath(
    Path.Combine(builder.Environment.ContentRootPath, "..", "..", "..", "ReciBee.API"));

var python = builder.AddUvicornApp(
        name: "python-api",
        appDirectory: apiPath,
        app: "main:app")
    .WithHttpEndpoint(port: 8000, env: "PORT")
    .WithReference(reciBeeDB);

builder.AddProject<Projects.AspireApp_ApiService>("reciBee-api")
    .WithReference(python);

// Run Website (Vite/React) on port 4200
var websitePath = Path.GetFullPath(
    Path.Combine(builder.Environment.ContentRootPath, "..", "..", "..", "ReciBee"));

builder.AddViteApp("recibee-website", websitePath, "dev")
    .WithReference(python)
    .WaitFor(python)
    .WithEnvironment("VITE_API_BASE_URL", python.GetEndpoint("http"))
    .WithNpmPackageInstallation();

builder.Build().Run();
