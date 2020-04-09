import { BindingBase, Trigger, InputBinding, OutputBinding } from "./bindings"

/**
 * EventHub Binding
 */
class CosmosDbBinding extends BindingBase {
    /**
     * 
     */
    databaseName: string;
    /**
     * 
     */
    collectionName: string;

    connectionStringSetting: string;

    constructor(parameters: {
        name: string,
        databaseName: string,
        collectionName: string,
        connectionStringSetting: string,
        dataType?: "string" | "binary" | "stream"
    }) {
        super(parameters);
        this.databaseName = parameters.databaseName;
        this.collectionName = parameters.collectionName;
        this.connectionStringSetting = parameters.connectionStringSetting;
    }

    public getRequiredProperties() {
        return [...super.getRequiredProperties(), "databaseName", "collectionName", "connectionStringSetting"];
    }
}

export class CosmosDbTrigger extends CosmosDbBinding implements Trigger {
    public type: string = "cosmosDBTrigger";
    public direction: "in" = "in";
    /**
     * 
     */
    public leaseCollectionName?: string;
    /**
     *
     */
    public createLeaseCollectionIfNotExists?: boolean;

    public leaseConnectionStringSetting?: string;
    public leaseDatabaseName?: string;
    public leasesCollectionThroughput?: string;
    public leaseCollectionPrefix?: string;
    public feedPollDelay?: string;
    public leaseAcquireInterval?: string;
    public leaseExpirationInterval?: string;
    public leaseRenewInterval?: string;
    public checkpointFrequency?: string;
    public maxItemsPerInvocation?: string;
    public startFromBeginning?: string;
    public preferredLocations?: string;

    constructor(parameters: {
        name: string,
        databaseName: string,
        collectionName: string,
        connectionStringSetting: string,
        leaseCollectionName?: string,
        createLeaseCollectionIfNotExists?: boolean,
        leaseConnectionStringSetting?: string,
        leaseDatabaseName?: string,
        leasesCollectionThroughput?: string,
        leaseCollectionPrefix?: string,
        feedPollDelay?: string,
        leaseAcquireInterval?: string,
        leaseExpirationInterval?: string,
        leaseRenewInterval?: string,
        checkpointFrequency?: string,
        maxItemsPerInvocation?: string,
        startFromBeginning?: string,
        preferredLocations?: string,
        dataType?: "string" | "binary" | "stream"
    }) {
        super(parameters);
        this.leaseCollectionName = parameters.leaseCollectionName;
        this.createLeaseCollectionIfNotExists = parameters.createLeaseCollectionIfNotExists;
        this.leaseConnectionStringSetting = parameters.leaseConnectionStringSetting;
        this.leaseDatabaseName = parameters.leaseDatabaseName;
        this.leasesCollectionThroughput = parameters.leasesCollectionThroughput;
        this.leaseCollectionPrefix = parameters.leaseCollectionPrefix;
        this.feedPollDelay = parameters.feedPollDelay;
        this.leaseAcquireInterval = parameters.leaseAcquireInterval;
        this.leaseExpirationInterval = parameters.leaseExpirationInterval;
        this.leaseRenewInterval = parameters.leaseRenewInterval;
        this.checkpointFrequency = parameters.checkpointFrequency;
        this.maxItemsPerInvocation = parameters.maxItemsPerInvocation;
        this.startFromBeginning = parameters.startFromBeginning;
        this.preferredLocations = parameters.preferredLocations;
    }

    public getOptionalProperties() {
        return [...super.getOptionalProperties(), "leaseCollectionName", "createLeaseCollectionIfNotExists", 
            "leaseConnectionStringSetting", "leaseDatabaseName", "leasesCollectionThroughput", 
            "leaseCollectionPrefix", "feedPollDelay", "leaseAcquireInterval", "leaseExpirationInterval",
            "leaseRenewInterval", "checkpointFrequency", "maxItemsPerInvocation", "startFromBeginning",
            "preferredLocations"];
    }
}

export class CosmosDbInput extends CosmosDbBinding implements InputBinding {
    public type: string = "cosmosDB";
    public direction: "in" = "in";
    public id: string;
    public partitionKey: string;
    public sqlQuery?: string;
    public preferredLocations?: string;

    constructor(parameters: {
        name: string,
        databaseName: string,
        collectionName: string,
        connectionStringSetting: string,
        id: string,
        partitionKey: string,
        sqlQuery?: string,
        preferredLocations?: string
        dataType?: "string" | "binary" | "stream"
    }) {
        super(parameters);
        this.id = parameters.id;
        this.partitionKey = parameters.partitionKey;
        this.sqlQuery = parameters.sqlQuery;
        this.preferredLocations = parameters.preferredLocations;
    }

    public getRequiredProperties() {
        return [...super.getRequiredProperties(), "id", "partitionKey"];
    }

    public getOptionalProperties() {
        return [...super.getOptionalProperties(), "sqlQuery", "preferredLocations"];
    }
}

export class CosmosDbOutput extends CosmosDbBinding implements OutputBinding {
    public type: string = "cosmosDB";
    public direction: "out" = "out";
    public partitionKey: string;
    public createIfNotExists?: boolean;
    public collectionThroughput?: string;
    public preferredLocations?: string;
    public useMultipleWriteLocations?: string;

    constructor(parameters: {
        name: string,
        databaseName: string,
        collectionName: string,
        connectionStringSetting: string,
        partitionKey: string,
        createIfNotExists?: boolean,
        collectionThroughput?: string,
        preferredLocations?: string,
        useMultipleWriteLocations?: string,
        dataType?: "string" | "binary" | "stream"
    }) {
        super(parameters);
        this.partitionKey = parameters.partitionKey;
        this.createIfNotExists = parameters.createIfNotExists;
        this.collectionThroughput = parameters.collectionThroughput;
        this.preferredLocations = parameters.preferredLocations;
        this.useMultipleWriteLocations = parameters.useMultipleWriteLocations;
    }

    public getRequiredProperties() {
        return [...super.getRequiredProperties(), "partitionKey"];
    }

    public getOptionalProperties() {
        return [...super.getOptionalProperties(), "createIfNotExists", "collectionThroughput", "preferredLocations", "useMultipleWriteLocations"];
    }
}
