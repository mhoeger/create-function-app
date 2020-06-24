import { BindingBase, Trigger, Binding } from "../../src/types/bindings"

/**
 * Timer binding
 */
export class TimerTrigger extends BindingBase implements Trigger {
    public type: string = "timerTrigger";
    public direction: "in" = "in";
    /**
     * A CRON expression representing the timer schedule.
     */
    public schedule: string;
    /**
     * Not recommended for production. When true, your timer function will be invoked immediately after a runtime restart and on-schedule thereafter.
     */
    public runOnStartup?: boolean;
    /**
     * When true, schedule will be persisted to aid in maintaining the correct schedule even through restarts. Defaults to true for schedules with interval >= 1 minute.
     */
    public useMonitor?: boolean;

    constructor(parameters: {
        name: string, 
        schedule: string, 
        useMonitor?: boolean,
        runOnStartup?: boolean
    }) {
        super(parameters);
        this.schedule = parameters.schedule;
        this.useMonitor = parameters.useMonitor;
        this.runOnStartup = parameters.runOnStartup;
    }

    public getProperties(): Binding {
        const coreProperties = super.getProperties();
        if (!this.schedule) throw new Error("Missing required property 'schedule'")

        const serviceBusProperties = {
            schedule: this.schedule,
            useMonitor: this.useMonitor,
            runOnStartup: this.runOnStartup
        };
        return Object.assign({}, coreProperties, serviceBusProperties);
    }
}
