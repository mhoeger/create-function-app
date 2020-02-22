import { HttpMethod } from "@azure/functions"

export interface FunctionConfiguration {
    // /**
    //  * If set to true, the function will not be loaded, compiled, or triggered.
    //  */
    // excluded?: boolean;
    // /**
    //  * Optional path to function script file.
    //  */
    // scriptFile?: string;
    // /**
    //  * Optional named entry point.
    //  */
    // entryPoint?: string;
    // /**
    //  * For C# precompiled functions only. If set to 'attributes', use WebJobs attributes to specify bindings. Otherwise, use the 'bindings' property of this function.json.
    //  */
    // configurationSource?: "attributes" | "config";
    /**
     * A list of function bindings.
     */
    bindings?: BindingBase[];
    [k: string]: any;
}

export interface BindingBase {
    name: string;
    type: string;
    direction: "in" | "out" | "inout";
    /**
     * The data type hint for the binding parameter (string, binary, or stream).
     */
    dataType?: "string" | "binary" | "stream";
    [k: string]: any;
}

export interface InputBinding extends BindingBase {
    direction: "in";
}

export interface Trigger extends BindingBase {
    direction: "in";
}

export interface InOutBinding extends BindingBase {
    direction: "inout";
}

export interface OutputBinding extends BindingBase {
    direction: "out";
}

/**
 * Service bus binding
 */
interface ServiceBusBinding extends BindingBase {
    /**
     * The service bus queue to monitor (if using a queue)
     */
    queueName?: string;
    /**
     * The service bus topic to monitor (if using a queue)
     */
    topicName?: string;
    /**
     * The topic subscription name
     */
    subscriptionName?: string;
    /**
     * An app setting (or environment variable) with the service bus connection string to be used by this binding.
     */
    connection?: string;
    /**
     * The permission level of the service bus connection string used by this binding.
     */
    accessRights?: "manage" | "listen";
}

export class ServiceBusTrigger implements ServiceBusBinding, Trigger {
    public type: string = "serviceBusTrigger";
    public direction: "in" = "in";
    public name: string;
}

export class ServiceBusOutput implements ServiceBusBinding, OutputBinding {
    public type: string = "serviceBus";
    public direction: "out" = "out";
    public name: string;
}

/**
 * Blob Binding
 */
interface BlobBinding extends BindingBase {
    /**
     * The path to the blob container
     */
    path?: string;
    /**
     * An app setting (or environment variable) with the storage connection string to be used by this binding.
     */
    connection?: string;
}

export class BlobTrigger implements BlobBinding {
    public type: string = "blobTrigger";
    public direction: "in" | "out" | "inout" = "in";
    public name: string;
}

export class BlobOutput implements BlobBinding {
    public type: string = "blob";
    public direction: "in" | "out" | "inout" = "in";
    public name: string;
}

export class BlobInput implements BlobBinding {
    public type: string = "blob";
    public direction: "in" | "out" | "inout" = "out";
    public name: string;
}

/**
 * Manual Binding
 */
export class ManualTrigger implements BindingBase {
    public type: string = "manualTrigger";
    public direction: "in" | "out" | "inout" = "in";
    public name: string;
}

/**
 * EventHub Binding
 */
interface EventHubBinding extends BindingBase {
    /**
     * The event hub path.
     */
    path?: string;
    /**
     * The event hub connection string setting.
     */
    connection?: string;
}

export class EventHubTrigger implements EventHubBinding {
    public type: string = "eventHubTrigger";
    public direction: "in" | "out" | "inout" = "in";
    public name: string;
    /**
     * The event hub consumer group.
     */
    public consumerGroup?: string;
    /**
     * The cardinality hint for the input binding parameter (single message or array of messages).
     */
    public cardinality?: "one" | "many";
}

export class EventHubOutput implements EventHubBinding {
    public type: string = "eventHub";
    public direction: "out" = "out";
    public name: string;
    constructor(setup: { bindingName: string }) {
        this.name = setup.bindingName
    }
}

/**
 * Timer binding
 */
export class TimerTrigger implements BindingBase {
    public type: string = "timerTrigger";
    public direction: "in" | "out" | "inout" = "in";
    public name: string;
    /**
     * A CRON expression representing the timer schedule.
     */
    public schedule: string;
    /**
     * Not recommended for production. When true, your timer function will be invoked immediately after a runtime restart and on-schedule thereafter.
     */
    public runOnStartup?: boolean;
    /**
     * When true, schedule will be persisted to aid in maintaining the correct schedule even through restarts. Defaults to true for schedules with interval >= 1 minute.
     */
    public useMonitor?: boolean;
}

/**
 * Queue binding
 */
interface QueueBinding extends BindingBase {
    /**
     * The queue name.
     */
    queueName: string;
    /**
     * An app setting (or environment variable) with the storage connection string to be used by this binding.
     */
    connection: string;
}

export class QueueTrigger implements QueueBinding {
    public type: string = "queueTrigger";
    public direction: "in" = "in";
    public name: string;
    public queueName: string;
    public connection: string;
    constructor(setup: {
        bindingName: string, 
        queueName: string, 
        connectionSetting: string
    }) {
        this.queueName = setup.queueName;
        this.connection = setup.connectionSetting;
        this.name = setup.bindingName;
    }
}

export class QueueOutput implements QueueBinding {
    public type: string = "queue";
    public direction: "out" = "out";
    public name: string;
    public queueName: string;
    public connection: string;
    constructor(setup: {
        bindingName: string, 
        queueName: string, 
        connectionSetting: string
    }) {
        this.queueName = setup.queueName;
        this.connection = setup.connectionSetting;
        this.name = setup.bindingName;
    }
}

/**
 * Queue binding
 */
export class HttpTrigger implements Trigger {
    public name: string;
    public type: string = "httpTrigger";
    public direction: "in" = "in";
    /**
     * "The function HTTP route template."
     */
    public route: string;
    /**
     * The type of WebHook handled by the trigger (if handling a pre-defined WebHook).
     */
    public webHookType?: string;
    /**
     * The function HTTP authorization level.
     */
    public authLevel: "anonymous" | "function" | "admin" = "function";
    public methods: ("get" | "post" | "delete" | "head" | "patch" | "put" | "options" | "trace")[];
    constructor(setup: {
        bindingName: string, route: string, 
        methods: ("get" | "post" | "delete" | "head" | "patch" | "put" | "options" | "trace")[], 
        authLevel?: "anonymous" | "function" | "admin", 
        webHookType?: string 
    }) {
        this.name = setup.bindingName;
        this.route = setup.route;
        this.methods = setup.methods;
        this.authLevel = setup.authLevel;
        this.webHookType = setup.webHookType;
    }
}

/**
 * Queue binding
 */
export class HttpResponse implements OutputBinding {
    public name: string;
    public type: string = "http";
    public direction: "out" = "out";
    constructor(setup: { bindingName: string }) {
        this.name = setup.bindingName;
    }
}
