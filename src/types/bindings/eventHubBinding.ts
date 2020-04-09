import { BindingBase, Trigger, InputBinding, OutputBinding } from "./bindings"

/**
 * EventHub Binding
 */
class EventHubBinding extends BindingBase {
    /**
     * The event hub path.
     */
    path: string;
    /**
     * The event hub connection string setting.
     */
    connection: string;

    constructor(parameters: {
        name: string,
        path: string
        connection: string,
        dataType?: "string" | "binary" | "stream"
    }) {
        super(parameters);
        this.path = parameters.path;
        this.connection = parameters.connection;
    }

    public getRequiredProperties() {
        return [...super.getRequiredProperties(), "path", "connection"];
    }
}

export class EventHubTrigger extends EventHubBinding implements Trigger {
    public type: string = "eventHubTrigger";
    public direction: "in" = "in";
    /**
     * The event hub consumer group.
     */
    public consumerGroup?: string;
    /**
     * The cardinality hint for the input binding parameter (single message or array of messages).
     */
    public cardinality?: "one" | "many";

    constructor(parameters: {
        name: string,
        path: string,
        connection: string,
        consumerGroup?: string,
        cardinality?: "one" | "many",
        dataType?: "string" | "binary" | "stream"
    }) {
        super(parameters);
        this.consumerGroup = parameters.consumerGroup;
        this.cardinality = parameters.cardinality;
    }

    public getRequiredProperties() {
        return [...super.getRequiredProperties(), "consumerGroup"];
    }

    public getOptionalProperties() {
        return [...super.getOptionalProperties(), "cardinality"];
    }
}

export class EventHubOutput extends EventHubBinding implements OutputBinding {
    public type: string = "eventHub";
    public direction: "out" = "out";
}
