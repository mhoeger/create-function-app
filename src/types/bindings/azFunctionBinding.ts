import { Binding, BindingBase } from "./bindings"

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
    bindings?: AzFunctionBinding[];
    [k: string]: any;
}

export interface AzFunctionBinding extends Binding {
    direction: "in" | "out" | "inout";
    /**
     * The data type hint for the binding parameter (string, binary, or stream).
     */
    dataType?: "string" | "binary" | "stream";
}

export class AzFunctionBindingBase extends BindingBase implements AzFunctionBinding {
    direction: "in" | "out" | "inout";
    /**
     * The data type hint for the binding parameter (string, binary, or stream).
     */
    dataType?: "string" | "binary" | "stream";
    
    constructor(parameters: {
        name: string,
        dataType?: "string" | "binary" | "stream"
    }) {
        super(parameters);
        this.dataType = parameters.dataType;
    }
    
    getProperties(): Binding {
        let baseProperties = super.getProperties();
        if (!this.direction) throw new Error("Missing required property 'direction'")

        return Object.assign(baseProperties, {
            name: this.name,
            type: this.type,
            direction: this.direction,
            dataType: this.dataType
        });
    }
}

export interface InputBinding extends AzFunctionBindingBase {
    direction: "in";
}

export interface Trigger extends AzFunctionBindingBase {
    direction: "in";
}

export interface InOutBinding extends AzFunctionBindingBase {
    direction: "inout";
}

export interface OutputBinding extends AzFunctionBindingBase {
    direction: "out";
}
