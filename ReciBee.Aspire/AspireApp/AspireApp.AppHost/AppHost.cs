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
    .WithHttpEndpoint(port: 8000, env: "UVICORN_PORT")
    .WithReference(reciBeeDB);

// Alternative to AddUvicornApp: run uvicorn as a plain executable.
// Useful if you need an explicit interpreter/venv path instead of the
// auto-detected .venv, or want full control over the launch args.
// var python = builder.AddExecutable(
//         name: "python-api",
//         command: Path.Combine(apiPath, ".venv", "Scripts", "python.exe"),
//         workingDirectory: apiPath,
//         args: ["-m", "uvicorn", "main:app", "--port", "8000"])
//     .WithHttpEndpoint(port: 8000, env: "UVICORN_PORT")
//     .WithReference(reciBeeDB);

// Run Website (Vite/React). Aspire assigns the port via the PORT env var,
// which vite.config.ts reads for its dev server.
var websitePath = Path.GetFullPath(
    Path.Combine(builder.Environment.ContentRootPath, "..", "..", "..", "ReciBee"));

builder.AddNpmApp("recibee-website", websitePath, "dev")
    .WithHttpEndpoint(env: "PORT", port: 5173)
    .WithExternalHttpEndpoints()
    .WithReference(python)
    .WithEnvironment("VITE_API_BASE_URL", python.GetEndpoint("http"))
    .WaitFor(python);

builder.Build().Run();
