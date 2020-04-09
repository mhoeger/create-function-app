import { BindingBase, Trigger, InputBinding, OutputBinding } from "../../src/types/bindings/bindings"

/**
 * Blob Binding
 */
class BlobBinding extends BindingBase {
    /**
     * The path to the blob container
     */
    public path: string;
    /**
     * An app setting (or environment variable) with the storage connection string to be used by this binding.
     */
    public connection: string;

    public getRequiredProperties() {
        return [...super.getRequiredProperties(), "path", "connection"];
    }

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
