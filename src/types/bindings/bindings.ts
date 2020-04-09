export type TriggerType = string;

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
    bindings?: Binding[];
    [k: string]: any;
}

export interface Binding {
    name: string;
    type: string;
    direction: "in" | "out" | "inout";
    /**
     * The data type hint for the binding parameter (string, binary, or stream).
     */
    dataType?: "string" | "binary" | "stream";
    getRequiredProperties(): string[];
    getOptionalProperties(): string[];
    [k: string]: any;
}

export class BindingBase implements Binding {
    name: string;
    type: string;
    direction: "in" | "out" | "inout";
    /**
     * The data type hint for the binding parameter (string, binary, or stream).
     */
    dataType?: "string" | "binary" | "stream";
    
    constructor(parameters: {
        name: string,
        dataType?: "string" | "binary" | "stream"
    }) {
        this.name = parameters.name;
        this.dataType = parameters.dataType;
    }
    
    getRequiredProperties() {
        return ["name", "type", "direction"];
    }
    getOptionalProperties() {
        return ["dataType"];
    }
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
