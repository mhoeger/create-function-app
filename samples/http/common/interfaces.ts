import { Context, HttpRequest } from "@azure/functions"
import { ExampleClient } from "../services/fake-clients";

export interface InvocationContext extends Context {
    name: string;
    exampleClient: ExampleClient;
    req: CookieRequest;
}

interface CookieRequest extends HttpRequest {
    cookies: any;
}