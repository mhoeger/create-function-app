import { AzFunctionBindingBase, Trigger, InputBinding, OutputBinding, Binding } from "../../src/types/bindings"

/**
 * Blob Binding
 */
class BlobBinding extends AzFunctionBindingBase {
    /**
     * The path to the blob container
     */
    public path: string;
    /**
     * An app setting (or environment variable) with the storage connection string to be used by this binding.
     */
    public connection: string;

    constructor(parameters: {
        name: string,  
        path: string,
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

        const blobProperties = {
            path: this.path,
            connection: this.connection
        };
        return Object.assign({}, coreProperties, blobProperties);
    }
}

export class BlobTrigger extends BlobBinding implements Trigger {
    public type: string = "blobTrigger";
    public direction: "in" = "in";
}

export class BlobInput extends BlobBinding implements InputBinding {
    public type: string = "blob";
    public direction: "in" = "in";
}

export class BlobOutput extends BlobBinding implements OutputBinding {
    public type: string = "blob";
    public direction: "out" = "out";
}
