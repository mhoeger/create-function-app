import { Function2, HttpTrigger, BlobInput } from "../../future_node_modules/functions/azure-functions"
import { NamedContext } from "../common/interfaces"
import { createResponse } from "../common/talkToPerson"

export const helloFunction = new Function2(new HttpTrigger("api/hi", ["GET"]))
    .bindInputs([
        new BlobInput("blobInput")
    ])
    .onTrigger(async (context: NamedContext) => {
        context.res = createResponse("Hello, %s!", context.name);
    });