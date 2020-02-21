import { FunctionApp, AzureFunctionDefinition } from "../../src/azure-functions"
import { QueueTrigger, HttpTrigger, QueueOutput, EventHubOutput, HttpResponse } from "../../src/functionConfig"
import { HostOptions } from "../../src/hostConfig"

import { InvocationContext } from "./common/interfaces"
import { sayHello } from "./functions/hello"
import { sayGoodbye } from "./functions/goodbye"
import { CosmosClient } from "./services/fake-clients"

const functions: AzureFunctionDefinition[] = [
    {
        trigger: new HttpTrigger("req", "/order", ["post"], "anonymous"),
        handler: sayHello,
        outputBindings: [
            new HttpResponse("res"),
            new QueueOutput("orderMessage", "order-messages", "AzureStorage")
        ],
    },
    { 
        trigger: new HttpTrigger("req", "/order", ["delete"], "anonymous"),
        handler: sayHello,
        outputBindings: [
            new HttpResponse("res"),
            new QueueOutput("deleteMessage", "delete-messages", "AzureStorage")
        ]
    },
    { 
        trigger: new QueueTrigger("queueInput", "queuename", "AzureStorage"),
        handler: sayGoodbye,
        outputBindings: [
            new EventHubOutput("eventHubMessage")
        ]
    }
]

const options: HostOptions = {
    version: "2.0",
    logging: {
        logLevel: {
            default: "Warning"
        }
    }
};

// - local.settings.json??? also host.json not needed??
const app = new FunctionApp(functions, options);
// before each function, do this
// beforeeach on trigger type
// for
let cosmosClient = new CosmosClient();

app.beforeEach(async (context: InvocationContext) => {
    context.log(`~~ Starting invocation: '${context.invocationId}' ~~`);
    context.cosmosClient = cosmosClient;
});

app.beforeEach(async (context: InvocationContext) => {
    const name = (context.req.query.name || (context.req.body && context.req.body.name));
    context.name = name;
});

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


