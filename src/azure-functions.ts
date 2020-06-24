import { AzureFunction, Context } from "@azure/functions"
import { HostOptions } from "./types/hostConfig"
import { FunctionConfiguration } from "./types/functionConfig"
import { FunctionDefinition, FunctionDeclaration } from "./types/functionDefinition"
import { Trigger, InputBinding, InOutBinding, OutputBinding, Binding, TriggerType } from "./types/bindings"
import { writeFile, existsSync, mkdirSync } from "fs"
import { promisify, isFunction } from "util"
import { relative } from "path" 

interface InternalFunctionDefinition extends FunctionDefinition {
    functionName: string;
}

export class FunctionApp {
    private count = 1;
    private _middleware = async (context) => { };
    private _endware = async(context) => { };
    private _functionConfigurations: InternalFunctionDefinition[] = [];
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

    // host.json and functions
    constructor(options: { functions: FunctionDeclaration, hostOptions?: HostOptions }) {
        let { functions, hostOptions } = options; 
        this._hostOptions = Object.assign({}, this.defaultHostOptions, hostOptions, this.requiredHostOptions);        
        for (const funcName in functions) {
            const func = functions[funcName] as InternalFunctionDefinition;
            func.functionName = funcName;
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
        const hostConfig = JSON.stringify(this._hostOptions, null, '\t');
        promises.push(writeFileAsync(`${functionRoot}/host.json`, hostConfig));

        // wait for all to return
        await Promise.all(promises);
        console.log("Done generating files!");
    }

    public addFunction(trigger: Trigger, handler: AzureFunction, functionName?: string, inputBindings?: (InputBinding|InOutBinding)[], outputBindings?: OutputBinding[]) {
        const functionDefinition: InternalFunctionDefinition = {
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
    private addFunctionInternal(func: InternalFunctionDefinition) {
        const name = this.resolveName(func.trigger.type, func.functionName);

        if (!isFunction(func.handler)) {
            throw new Error(`Function '${name}' must include a handler that is a valid function.`);
        }

        // Add to internal list
        func.functionName = name;
        this._functionConfigurations.push(func);

        // Assign property name
        this[`${name}`] = async (context, ...args) => {
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
    private getFunctionConfig (func: InternalFunctionDefinition, pathToApp: string): string {
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

        return JSON.stringify(configuration, null, '\t');
    }

    private ensureDirectoryExistence(dirname) {
        if (existsSync(dirname)) {
          return true;
        }
        console.warn("This part is only good for node v10.12 and above..!")
        mkdirSync(dirname, { recursive: true });
      }

    private toBindingConfiguration(binding: Binding, functionName: string): Binding {
        // if we can't find getRequiredProperties or getOptionalProperties
        if (!isFunction(binding.getProperties)) {
            return binding;
        }

        return binding.getProperties() as Binding;
        // let sanitizedConfiguration = { };
        // for (const required of binding.getRequiredProperties()) {
        //     if (binding[required] === undefined || binding[required] === null) {
        //         throw new Error(`Could not find required property ${required} for function ${functionName}`);
        //     }
        //     sanitizedConfiguration[required] = binding[required];
        // }

        // for (const optional of binding.getOptionalProperties()) {
        //     if (binding[optional] !== undefined && binding[optional] !== null) {
        //         sanitizedConfiguration[optional] = binding[optional];
        //     }
        // }

        // return sanitizedConfiguration as Binding;
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