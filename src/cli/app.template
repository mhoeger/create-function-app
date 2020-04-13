import { FunctionApp, HttpTrigger, HttpResponse } from "../../src/azure-functions"

// Function event handler
const sayHello = async function (context, req) {
    context.log("Starting function 'SayHello");
    const name = (req.query.name || (req.body && req.body.name));
    if (name) {
        return {
            body: `Hello, ${name}!`
        }
    } else {
        return {
            body: "Hello there! Please pass a name on the query string or in the request body for a customized message."
        }
    }
}

// Function definitions
const functions = [
    {
        functionName: "SayHello",
        trigger: new HttpTrigger({
            name: "req",
            route: "/order",
            methods: ["post"],
            authLevel: "anonymous"
        }),
        handler: sayHello,
        outputBindings: [
            new HttpResponse({ bindingName: "res" })
        ],
    }
];

// Function app options
const options = {
    version: "2.0",
    logging: {
        logLevel: {
            default: "Trace"
        }
    }
};

// Create function app object
const app = new FunctionApp({
    functions,
    options
});

// Add pre-hook to all executions
app.beforeEach(async (context) => {
    context.log(`~~ Starting invocation: '${context.invocationId}' ~~`);
    context.additionalProperty = true;
});

// Export function app object to have it run
module.exports = app;
