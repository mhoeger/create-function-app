import { BindingBase } from "../../src/types/bindings/bindings"

/**
 * Manual Binding
 */
export class ManualTrigger extends BindingBase {
    public type: string = "manualTrigger";
    public direction: "in" | "out" | "inout" = "in";
}
