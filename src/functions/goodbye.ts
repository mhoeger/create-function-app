import { AzureFunction, Context } from "@azure/functions"
import { Function2, HttpTrigger, BlobInput } from "../../future_node_modules/functions/azure-functions"
import { CookiedRequest } from "../common/interfaces"

const farewell: AzureFunction = async function (context: Context): Promise<void> {    
    // Log info from request cookie
    const req = context.req as CookiedRequest;
    const previousInvocationId = req.cookies.invocationId;
    if (previousInvocationId) {
        context.log(`HTTP trigger function processed a request. Previous request id was: ${req.cookies.invocationId}`);
    } else {
        context.log("fIRst11!!!!!!!");
    }
    
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: "Farewell!",
        headers: {
            "set-cookie": `invocationId=${context.invocationId}`
        }
    };
};

export const goodbyeFunction = new Function2(new HttpTrigger("api/bye", ["GET"]))
    .bindInputs([
        new BlobInput("blobInput")
    ])
    .onTrigger(farewell);