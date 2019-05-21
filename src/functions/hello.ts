import { AzFunction } from "../../future_node_modules/functions/azure-functions"
import { InvocationContext } from "../common/interfaces"
import { createResponse } from "../common/talkToPerson"
import { AzureFunction } from "@azure/functions";

const sayHello: AzureFunction = async (context: InvocationContext) => {
    context.res = createResponse("Hello, %s!", context.name);
}
// Newer look of an Azure Function. Note that it may be dangerous to not call "context.done" or forget to declare async
export const helloFunction = new AzFunction("HelloFunction", sayHello);
