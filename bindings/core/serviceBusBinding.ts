import { BindingBase, Trigger, OutputBinding } from "./bindings"

/**
 * Service bus binding
 */
class ServiceBusBinding extends BindingBase {
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

    constructor(parameters: {
        name: string, 
        queueName?: string, 
        topicName?: string,
        subscriptionName: string,
        connection: string,
        accessRights?: "manage" | "listen",
        dataType?: "string" | "binary" | "stream"
    }) {
        super(parameters);
        this.queueName = parameters.queueName;
        this.topicName = parameters.topicName;
        this.subscriptionName = parameters.subscriptionName;
        this.connection = parameters.connection;
        this.accessRights = parameters.accessRights;
        this.dataType = parameters.dataType;
    }

    public getRequiredProperties() {
        return [...super.getRequiredProperties(), "connection", "subscriptionName", "connection"];
    }

    public getOptionalProperties() {
        return [...super.getOptionalProperties(), "queueName", "topicName", "accessRights"];
    }
}

export class ServiceBusTrigger extends ServiceBusBinding implements Trigger {
    public type: string = "serviceBusTrigger";
    public direction: "in" = "in";
}

export class ServiceBusOutput extends ServiceBusBinding implements OutputBinding {
    public type: string = "serviceBus";
    public direction: "out" = "out";
}
