import { Trigger, OutputBinding, TriggerType, Binding } from "../../src/types/bindings"

export const HttpTriggerType: TriggerType = "httpTrigger";

/**
 * Http request binding
 */
export class HttpTrigger implements Trigger {
    public name: string;
    public type: string = HttpTriggerType;
    public direction: "in" = "in";
    /**
     * "The function HTTP route template."
     */
    public route?: string;
    /**
     * The type of WebHook handled by the trigger (if handling a pre-defined WebHook).
     */
    public webHookType?: string;
    /**
     * The function HTTP authorization level.
     */
    public authLevel: "anonymous" | "function" | "admin" = "function";
    public methods: ("get" | "post" | "delete" | "head" | "patch" | "put" | "options" | "trace")[];
    constructor(parameters: {
        name: string, 
        route?: string, 
        methods?: ("get" | "post" | "delete" | "head" | "patch" | "put" | "options" | "trace")[], 
        authLevel?: "anonymous" | "function" | "admin", 
        webHookType?: string
    }) {
        this.name = parameters.name;
        this.route = parameters.route;
        if (parameters.route && parameters.route.startsWith("/")) {
            this.route = parameters.route.substring(1);
        }
        this.methods = parameters.methods;
        this.authLevel = parameters.authLevel;
        this.webHookType = parameters.webHookType;
    }

    public getProperties(): Binding {
        if (!this.name) throw new Error("Missing required property 'name'")
        if (!this.type) throw new Error("Missing required property 'type'")
        if (!this.direction) throw new Error("Missing required property 'direction'")
        if (!this.authLevel) throw new Error("Missing required property 'authLevel'")

        return {
            name: this.name,
            type: this.type,
            direction: this.direction,
            authLevel: this.authLevel,
            route: this.route,
            webHookType: this.webHookType,
            methods: this.methods
        };
    }
}

/**
 * Http response binding
 */
export class HttpResponse implements OutputBinding {
    public name: string;
    public type: string = "http";
    public direction: "out" = "out";
    constructor(parameters: { bindingName: string }) {
        this.name = parameters.bindingName;
    }

    public getProperties(): Binding {
        if (!this.name) throw new Error("Missing required property 'name'")
        if (!this.type) throw new Error("Missing required property 'type'")
        if (!this.direction) throw new Error("Missing required property 'direction'")

        return {
            name: this.name,
            type: this.type,
            direction: this.direction
        };
    }
}
