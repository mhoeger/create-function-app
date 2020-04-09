import { AzureFunction, Context } from "@azure/functions"
import { HostOptions } from "./types/hostConfig"
import { FunctionConfiguration } from "./types/functionConfig"
import { Trigger, InputBinding, InOutBinding, OutputBinding, BindingBase, Binding, TriggerType } from "./types/bindings/bindings"
import { writeFile, existsSync, mkdirSync } from "fs"
import { promisify, isFunction } from "util"
import { relative } from "path" 

export interface AzureFunctionDefinition {
    trigger: Trigger;
    handler: AzureFunction;
    functionName?: string;
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
        },
        extensions: {
            http: {
                routePrefix: ""
            }
        }
    };
    private readonly requiredHostOptions: HostOptions = {
        version: "2.0"
    };
    private readonly localSettings = {
        IsEncrypted: false,
        Values: {
          FUNCTIONS_WORKER_RUNTIME: "node",
          AzureWebJobsStorage: "{AzureWebJobsStorage}"
        }
    };

    // host.json and local.settings.json... what to do??
    constructor(setup: { functions: AzureFunctionDefinition[], options?: HostOptions }) {
        let { functions, options } = setup; 
        this._hostOptions = Object.assign({}, this.defaultHostOptions, options, this.requiredHostOptions);        
        for (const func of functions) {
            this.addFunctionInternal(func);
        }
    }

    public beforeEach(middleware: any, filter?: TriggerType): FunctionApp {
        // TODO: we can also do object type binding here! find by name??
        let previousMiddle = this._middleware;
        this._middleware = async (context: Context) => {
            await previousMiddle(context);
            if (filter) {
                const matchingType = context.bindingDefinitions.filter((bindingDef) => { return bindingDef.type === filter });
                if (matchingType.length > 0) {
                    await middleware(context);
                }
            } else {
                await middleware(context);
            }
        }
        return this;
    }

    public async generateMetadata(functionRoot: string, appLocation: string) {
        const writeFileAsync = promisify(writeFile);
        let promises = [];
        this.ensureDirectoryExistence(functionRoot);
        // write function.jsons 
        for (const func of this._functionConfigurations) {
            const path = `${functionRoot}/${func.functionName}`;
            const pathToApp = relative(path, appLocation);
            const functionConfig = this.getFunctionConfig(func, pathToApp)
            this.ensureDirectoryExistence(path);
            promises.push(writeFileAsync(`${path}/function.json`, functionConfig));
        }
        // write host.jsons
        const hostConfig = JSON.stringify(this._hostOptions);
        promises.push(writeFileAsync(`${functionRoot}/host.json`, hostConfig));

        // write a local.setting.json
        const settings = JSON.stringify(this.localSettings);
        promises.push(writeFileAsync(`${functionRoot}/local.settings.json`, settings));

        // wait for all to return
        await Promise.all(promises);
        console.log("Done generating files!");
    }

    public addFunction(trigger: Trigger, handler: AzureFunction, functionName?: string, inputBindings?: (InputBinding|InOutBinding)[], outputBindings?: OutputBinding[]) {
        const functionDefinition: AzureFunctionDefinition = {
            trigger,
            handler,
            functionName,
            inputBindings,
            outputBindings
        };
        this.addFunctionInternal(functionDefinition);
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
    private addFunctionInternal(func: AzureFunctionDefinition) {
        const name = this.resolveName(func.trigger.type, func.functionName);
        
        if (!isFunction(func.handler)) {
            throw new Error(`Function '${name}' must include a handler that is a valid function.`);
        }

        // Add to internal list
        func.functionName = name;
        this._functionConfigurations.push(func);

        // Assign property name
        this[`${name}`] = async (context, ...args) => {
            console.log("Test!");
            console.log(JSON.stringify(this._middleware));
            let finalValue = null;
            let next = () => { finalValue = func.handler(context, ...args) };

            let previousDone = context.done;
            let wrappedDone = (err, result) => {
                this._endware(context);
                // actual done
                previousDone(err, result);
            }
            await this._middleware(context);
            context.done = wrappedDone;
            return func.handler(context, ...args); 
        };
        return this;
    }

    // TODO: this should be an interchangeable converter
    private getFunctionConfig (func: AzureFunctionDefinition, pathToApp: string): string {
        const functionName = func.functionName
        const configuration: FunctionConfiguration = {
            bindings: [],
            scriptFile: pathToApp,
            entryPoint: functionName
        }

        const sanitizedTrigger = this.toBindingConfiguration(func.trigger, functionName);
        configuration.bindings.push(sanitizedTrigger);

        if (func.inputBindings) {
            for (const input of func.inputBindings) {
                const sanitizedInput = this.toBindingConfiguration(input, functionName)
                configuration.bindings.push(sanitizedInput);
            }
        }

        if (func.outputBindings) {
            for (const output of func.outputBindings) {
                const sanitizedOutput = this.toBindingConfiguration(output, functionName)
                configuration.bindings.push(sanitizedOutput);
            }
        }

        return JSON.stringify(configuration);
    }

    private ensureDirectoryExistence(dirname) {
        if (existsSync(dirname)) {
          return true;
        }
        console.warn("This part is only good for node v10.12 and above..!")
        mkdirSync(dirname, { recursive: true });
      }

    private toBindingConfiguration(binding: BindingBase, functionName: string): Binding {
        // if we can't find getRequiredProperties or getOptionalProperties
        if (!isFunction(binding.getRequiredProperties) || !isFunction(binding.getOptionalProperties)) {
            return binding;
        }

        let sanitizedConfiguration = { };
        for (const required of binding.getRequiredProperties()) {
            if (binding[required] === undefined || binding[required] === null) {
                throw new Error(`Could not find required property ${required} for function ${functionName}`);
            }
            sanitizedConfiguration[required] = binding[required];
        }

        for (const optional of binding.getOptionalProperties()) {
            if (binding[optional] !== undefined && binding[optional] !== null) {
                sanitizedConfiguration[optional] = binding[optional];
            }
        }

        return sanitizedConfiguration as Binding;
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