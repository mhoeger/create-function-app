import { Function2, HttpTrigger, BlobInput } from "../../future_node_modules/functions/azure-functions"
import { NamedContext } from "../common/interfaces"
import { createResponse } from "../common/talkToPerson"
import { AzureFunction } from "@azure/functions";

const sayHello: AzureFunction = async (context: NamedContext) => {
    context.res = createResponse("Hello, %s!", context.name);
}
// Newer look of an Azure Function. Note that it may be dangerous to not call "context.done" or forget to declare async
export const helloFunction = new Function2("HelloFunction", sayHello);