import { Context, HttpRequest } from "@azure/functions"

export interface InvocationContext extends Context {
    name: string;
    req: CookieRequest;
}

interface CookieRequest extends HttpRequest {
    cookies: any;
}