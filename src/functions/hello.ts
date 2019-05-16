import { Function2, HttpTrigger, BlobInput } from "../../future_node_modules/functions/azure-functions"
import { NamedContext } from "../common/interfaces"
import { createResponse } from "../common/talkToPerson"

// Newer look of an Azure Function. Note that it may be dangerous to not call "context.done" or forget to declare async
export const helloFunction = new Function2("MyFunctionsIsAwesome", new HttpTrigger("api/hi", ["GET"]))
    .bindInputs([
        new BlobInput("blobInput")
    ])
    .onTrigger(async (context: NamedContext) => {
        context.res = createResponse("Hello, %s!", context.name);
    });