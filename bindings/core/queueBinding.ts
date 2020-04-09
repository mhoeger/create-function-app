import { BindingBase, Trigger, OutputBinding, TriggerType } from "./bindings"

export const QueueTriggerType: TriggerType = "queueTrigger";

/**
 * Queue binding
 */
class QueueBinding extends BindingBase {
    /**
     * The queue name.
     */
    queueName: string;
    /**
     * An app setting (or environment variable) with the storage connection string to be used by this binding.
     */
    connection: string;

    constructor(parameters: {
        name: string, 
        queueName: string, 
        connection: string,
        dataType?: "string" | "binary" | "stream"
    }) {
        super(parameters);
        this.connection = parameters.connection;
        this.queueName = parameters.queueName;
    }

    public getRequiredProperties() {
        return [...super.getRequiredProperties(), "queueName", "connection"];
    }
}

export class QueueTrigger extends QueueBinding implements Trigger {
    public type: string = QueueTriggerType;
    public direction: "in" = "in";
}

export class QueueOutput extends QueueBinding implements OutputBinding {
    public type: string = "queue";
    public direction: "out" = "out";
}
