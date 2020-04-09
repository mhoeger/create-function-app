import { AzureFunctionDefinition } from "../../src/azure-functions"
import { QueueTrigger, HttpTrigger, QueueOutput, CosmosDbOutput, HttpResponse } from "../../bindings"
import { processOrder } from "./handlers/processOrder"
import { acknowledgeOrder } from "./handlers/acknowledgeOrder"

const orderQueue = {
    name: "order-messages",
    connection: "AzureWebJobsStorage"
};

export const functions: AzureFunctionDefinition[] = [
    {
        functionName: "OrderRequest",
        trigger: new HttpTrigger({
            name: "req",
            route: "/order",
            methods: ["post"],
            authLevel: "anonymous"
        }),
        handler: acknowledgeOrder,
        outputBindings: [
            new HttpResponse({ bindingName: "res" }),
            new QueueOutput({
                name: "orderMessage",
                queueName: orderQueue.name,
                connection: orderQueue.connection
            })
        ],
    },
    {
        functionName: "OrderProcessing",
        trigger: new QueueTrigger({
            name: "orderMessage", 
            queueName: orderQueue.name,
            connection: orderQueue.connection
        }),
        handler: processOrder,
        outputBindings: [
            new CosmosDbOutput({ 
                name: "dbOutput",
                databaseName: "OrderDatabase",
                collectionName: "MerchOrders",
                partitionKey: "123",
                connectionStringSetting: "CosmosDBConnection"
            })
        ]
    }
]
