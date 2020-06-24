import { BindingBase, Binding, Trigger, OutputBinding, TriggerType } from "../../src/types/bindings"

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

    public getProperties(): Binding {
        const coreProperties = super.getProperties();
        if (!this.queueName) throw new Error("Missing required property 'queueName'")
        if (!this.connection) throw new Error("Missing required property 'connection'")

        const queueProperties = {
            queueName: this.queueName,
            connection: this.connection
        };
        return Object.assign({}, coreProperties, queueProperties);
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
