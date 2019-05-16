import { AzureFunction } from "@azure/functions"
import { Function2, BlobInput } from "../../future_node_modules/functions/azure-functions"
import { InvocationContext } from "../common/interfaces"

// More traditional look of an Azure Function + registering by creating a "Function2" object
const farewell: AzureFunction = async function (context: InvocationContext): Promise<void> {    
    // Log info from request cookie
    const { req } = context;
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

const bindingOptions = {
    inputs: [ new BlobInput("blobInput") ],
    outputs: [ ]
};

export const goodbyeFunction = new Function2("GoodbyeFunction", farewell, bindingOptions);