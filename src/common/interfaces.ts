import { Context, HttpRequest } from "@azure/functions"

export interface NamedContext extends Context {
    name: string;
}

export interface CookiedRequest extends HttpRequest {
    cookies: any;
}