import { Context, HttpRequest } from "@azure/functions"

export interface InvocationContext extends Context {
    name: string;
    cosmosClient: any;
    req: CookieRequest;
}

interface CookieRequest extends HttpRequest {
    cookies: any;
}