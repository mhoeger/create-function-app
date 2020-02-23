import { FunctionApp, AzureFunctionDefinition } from "../../src/azure-functions"
import { QueueTrigger, HttpTrigger, QueueOutput, EventHubOutput, HttpResponse } from "../../src/functionConfig"
import { HostOptions } from "../../src/hostConfig"

import { InvocationContext } from "./common/interfaces"
import { sayHello } from "./functions/hello"
import { sayGoodbye } from "./functions/goodbye"
import { getExampleClient } from "./services/fake-clients"

const functions: AzureFunctionDefinition[] = [
    {
        trigger: new HttpTrigger({
            bindingName: "req",
            route: "/order",
            methods: ["post"],
            authLevel: "anonymous"
        }),
        handler: sayHello,
        outputBindings: [
            new HttpResponse({ bindingName: "res" }),
            new QueueOutput({
                bindingName: "orderMessage",
                queueName: "order-messages",
                connectionSetting: "AzureStorage"
            })
        ],
    },
    {
        trigger: new HttpTrigger({
            bindingName: "req",
            route: "/order",
            methods: ["delete"],
            authLevel: "anonymous"
        }),
        handler: sayHello,
        outputBindings: [
            new HttpResponse({ bindingName: "res" }),
            new QueueOutput({
                bindingName: "deleteMessage", 
                queueName: "delete-messages",
                connectionSetting: "AzureStorage"
            })
        ]
    },
    {
        trigger: new QueueTrigger({
            bindingName: "queueInput", 
            queueName: "queuename",
            connectionSetting: "AzureStorage"
        }),
        handler: sayGoodbye,
        outputBindings: [
            new EventHubOutput({ bindingName: "eventHubMessage" })
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


