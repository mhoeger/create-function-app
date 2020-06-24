import { Binding } from "./bindings/bindings"

export interface FunctionConfiguration {
    /**
     * Optional path to function script file.
     */
    scriptFile?: string;

    /**
     * Optional named entry point.
     */
    entryPoint?: string;

    /**
     * A list of function bindings.
     */
    bindings: Binding[];

    [k: string]: any;
}