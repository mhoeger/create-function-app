import { FunctionApp, AzureFunctionDefinition } from "../../src/azure-functions"
import { QueueTrigger, HttpTrigger, QueueOutput, EventHubOutput, HttpResponse } from "../../src/types/bindings"
import { HostOptions } from "../../src/types/hostConfig"

import { InvocationContext } from "./common/interfaces"
import { sayHello } from "./functions/hello"
import { sayGoodbye } from "./functions/goodbye"
import { getExampleClient } from "./services/fake-clients"

const functions: AzureFunctionDefinition[] = [
    {
        trigger: new HttpTrigger({
            name: "req",
            route: "/order",
            methods: ["post"],
            authLevel: "anonymous"
        }),
        handler: sayHello,
        outputBindings: [
            new HttpResponse({ bindingName: "res" }),
            new QueueOutput({
                name: "orderMessage",
                queueName: "order-messages",
                connection: "AzureStorage"
            })
        ],
    },
    {
        trigger: new HttpTrigger({
            name: "req",
            route: "/order",
            methods: ["delete"],
            authLevel: "anonymous"
        }),
        handler: sayHello,
        outputBindings: [
            new HttpResponse({ bindingName: "res" }),
            new QueueOutput({
                name: "deleteMessage", 
                queueName: "delete-messages",
                connection: "AzureStorage"
            })
        ]
    },
    {
        functionName: "QueueToEventHub",
        trigger: new QueueTrigger({
            name: "queueInput", 
            queueName: "queuename",
            connection: "AzureStorage"
        }),
        handler: sayGoodbye,
        outputBindings: [
            new EventHubOutput({ 
                name: "eventHubMessage",
                path: "path",
                connection: "EventHubConnection"
            })
        ]
    }
]

const options: HostOptions = {
    version: "2.0",
    logging: {
        logLevel: {
            default: "Trace"
        }
    }
};

// - local.settings.json??? also host.json not needed??
const app = new FunctionApp({
    functions,
    options
});
// before each function, do this
// beforeeach on trigger type
// for
app.beforeEach(async (context: InvocationContext) => {
    context.log(`~~ Starting invocation: '${context.invocationId}' ~~`);
    context.exampleClient = getExampleClient();
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


