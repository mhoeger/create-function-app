import { BindingBase, Trigger, Binding, OutputBinding } from "../../src/types/bindings"

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

    public getProperties(): Binding {
        const coreProperties = super.getProperties();
        if (!this.path) throw new Error("Missing required property 'path'")
        if (!this.connection) throw new Error("Missing required property 'connection'")

        const eventHubProperties = {
            path: this.path,
            connection: this.connection
        };
        return Object.assign({}, coreProperties, eventHubProperties);
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

    public getProperties(): Binding {
        const coreProperties = super.getProperties();
        if (!this.consumerGroup) throw new Error("Missing required property 'consumerGroup'")

        const eventHubProperties = {
            consumerGroup: this.consumerGroup,
            cardinality: this.cardinality
        };
        return Object.assign({}, coreProperties, eventHubProperties);
    }
}

export class EventHubOutput extends EventHubBinding implements OutputBinding {
    public type: string = "eventHub";
    public direction: "out" = "out";
}
