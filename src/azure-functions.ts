import { AzureFunction, Context } from "@azure/functions"
import { HostOptions } from "./hostConfig"
import { Trigger, InputBinding, InOutBinding, OutputBinding } from "./functionConfig"

export interface AzureFunctionDefinition {
    trigger: Trigger;
    handler: AzureFunction;
    name?: string;
    inputBindings?: (InputBinding|InOutBinding)[];
    outputBindings?: OutputBinding[];
}

export class FunctionApp {
    private count = 1;
    private _middleware = async (context) => { };
    private _endware = async(context) => { };
    private _functionConfigurations: AzureFunctionDefinition[] = [];
    private _hostOptions;

    private readonly defaultHostOptions: HostOptions = {
        version: "2.0",
        extensionBundle: {
            id: "Microsoft.Azure.Functions.ExtensionBundle",
            version: "[1.*, 2.0.0)"
        }
    };
    private readonly requiredHostOptions: HostOptions = {
        version: "2.0"
    };

    // host.json and local.settings.json... what to do??
    constructor(functions: AzureFunctionDefinition[], options?: HostOptions) {
        this._functionConfigurations = functions;
        this._hostOptions = Object.assign({}, this.defaultHostOptions, options, this.requiredHostOptions);        
        for (const func of functions) {
            const name = this.resolveName(func.trigger.type, func.name);
            this.addFunctionInternal(name, func.handler);
        }
    }

    public beforeEach(middleware: any): FunctionApp {
        let previousMiddle = this._middleware;
        this._middleware = async (context) => {
            await previousMiddle(context);
            await middleware(context);
        }
        return this;
    }

    public generateMetadata() {
        // TODO
    }

    public addFunction(trigger: Trigger, handler: AzureFunction, name?: string, inputBindings?: (InputBinding|InOutBinding)[], outputBindings?: OutputBinding[]) {
        this._functionConfigurations.push({
            trigger,
            handler,
            name,
            inputBindings,
            outputBindings
        });
        const resolvedName = this.resolveName(trigger.type, name);
        this.addFunctionInternal(resolvedName, handler);
    }

    private resolveName(triggerType: string, givenName?: string) {
        let name = givenName || `${triggerType}${this.count++}`;
        // Prioritize most common path
        if (name && !this[name]) {
            return name;
        // Conflict exists
        } else {
            this.resolveName("", `${name}-copy`);
        }
    }
 
    // todo: warn on no http response as output?
    private addFunctionInternal(name: string, funcCode: AzureFunction) {
        this[`${name}`] = async (context, ...args) => {
            let finalValue = null;
            let next = () => { finalValue = funcCode(context, ...args) };

            let previousDone = context.done;
            let wrappedDone = (err, result) => {
                this._endware(context);
                // actual done
                previousDone(err, result);
            }
            await this._middleware(context);
            context.done = wrappedDone;
            return funcCode(context, ...args); 
        };
        return this;
    }
    // public post(endware: any): FunctionApp {
    //     let previousEnd = this._endware;
    //     this._endware = async (context) => {
    //         await endware(context);
    //         await previousEnd(context);
    //     }
    //     return this;
    // }
}