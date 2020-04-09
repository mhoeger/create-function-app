import { BindingBase, Trigger } from "../../src/types/bindings/bindings"

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

    public getRequiredProperties() {
        return [...super.getRequiredProperties(), "schedule"];
    }

    public getOptionalProperties() {
        return [...super.getOptionalProperties(), "useMonitor", "runOnStartup"];
    }
}
