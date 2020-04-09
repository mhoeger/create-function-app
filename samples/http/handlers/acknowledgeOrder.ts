import { AzureFunction, Context, HttpRequest } from "@azure/functions"

export const acknowledgeOrder: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const productId = (req.query.productId || (req.body && req.body.productId));
    const userId = (req.query.userId || (req.body && req.body.userId));
    
    if (!productId || !userId) {
        context.bindings.res = {
            status: 400,
            body: `Must include productId and userId for order. Found productId: '${productId}' and userId: '${userId}.'`
        }
    } else {
        context.bindings.orderMessage = {
            pid: productId,
            uid: userId
        }
        context.bindings.res = {
            body: "Processing order..."
        };
    }
};