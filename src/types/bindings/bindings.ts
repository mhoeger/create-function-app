export type TriggerType = string;

export interface Binding {
    name: string;
    type: string;
    [k: string]: any;
}

export interface RichBinding extends Binding {
    getProperties(): { [key: string]: any }
}

export class BindingBase implements RichBinding {
    name: string;
    type: string;
    
    constructor(parameters: {
        name: string,
    }) {
        this.name = parameters.name;
    }
    
    getProperties(): Binding {
        if (!this.name) throw new Error("Missing required property 'name'")
        if (!this.type) throw new Error("Missing required property 'type'")

        return {
            name: this.name,
            type: this.type
        }
    }
}