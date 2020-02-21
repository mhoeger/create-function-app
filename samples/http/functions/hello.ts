import { InvocationContext } from "../common/interfaces"
import { createResponse } from "../common/talkToPerson"
import { AzureFunction } from "@azure/functions";

export const sayHello: AzureFunction = async (context: InvocationContext) => {
    context.res = createResponse("Hello, %s!", context.name);
}
