import { FunctionApp } from "../../src/azure-functions"
import { HostOptions } from "../../src/types/hostConfig"
import { InvocationContext } from "./common/interfaces"
import { getExampleClient } from "./services/fake-clients"
import { functions } from "./handlers/functions"
import { HttpTriggerType } from "../../bindings"

const hostOptions: HostOptions = {
    version: "2.0",
    logging: {
        logLevel: {
            default: "Trace"
        }
    }
};

const app = new FunctionApp({
    functions,
    hostOptions
});

app.beforeEach(async (context: InvocationContext) => {
    context.log(`~~ Starting invocation: '${context.invocationId}' ~~`);
    context.exampleClient = getExampleClient();
});

app.beforeEach(async (context: InvocationContext) => {
    const name = (context.req.query.name || (context.req.body && context.req.body.name));
    context.name = name;
});

app.beforeEach(async (context: InvocationContext) => {
    context.log.warn("This is an Http triggered function.")
}, HttpTriggerType);

export = app;

// FUNCTIONS_WORKER_RUNTIME
// 

// {
// secrets
// configuration
//
//     "IsEncrypted": false,
//     "Values": {
//       "FUNCTIONS_WORKER_RUNTIME": "<language worker>",
//       "AzureWebJobsStorage": "<connection-string>",
//       "AzureWebJobsDashboard": "<connection-string>",
//       "MyBindingConnection": "<binding-connection-string>"
//     },
//     "Host": {
//       "LocalHttpPort": 7071,
//       "CORS": "*",
//       "CORSCredentials": false
//     },
//     "ConnectionStrings": {
//       "SQLConnectionString": "<sqlclient-connection-string>"
//     }
//   }

// some sort of init??
// - cache should be first class
//   - this could be a "per invocations", "per lifetime"
// become serverless framework on build step?
// filter on trigger type??
// - function.json generation - look at bindings.js!!
