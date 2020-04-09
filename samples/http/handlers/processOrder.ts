import { AzureFunction, Context } from "@azure/functions"

export const processOrder: AzureFunction = async function (context: Context, orderMessage: string): Promise<void> {
    context.log('Queue trigger function processed work item', orderMessage);
    context.bindings.dbOutput = orderMessage;
};
