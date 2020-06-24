import { Trigger } from "./bindings"

type TriggerObject = {
    name: string;
    type: string;
    [key: string]: any;
}

export interface FunctionDefinition {
    trigger: Trigger | TriggerObject;
    handler: (...args: any[]) => Promise<any> | any;
    inputBindings?: any[];
    outputBindings?: any[];
}

export interface FunctionDeclaration {
    [functionName: string]: FunctionDefinition
}