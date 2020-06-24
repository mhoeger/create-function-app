import { AzFunctionBindingBase, Trigger, InputBinding, OutputBinding, Binding } from "../../src/types/bindings"

/**
 * EventHub Binding
 */
class CosmosDbBinding extends AzFunctionBindingBase {
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

    public getProperties(): Binding {
        if (!this.databaseName) throw new Error("Missing required property 'databaseName'")
        if (!this.collectionName) throw new Error("Missing required property 'collectionName'")
        if (!this.connectionStringSetting) throw new Error("Missing required property 'connectionStringSetting'")

        const properties = {
            path: this.databaseName,
            collectionName: this.collectionName,
            connectionStringSetting: this.connectionStringSetting
        };
        return Object.assign({}, super.getProperties(), properties);
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

    public getProperties(): Binding {
        const coreProperties = super.getProperties();

        const cosmosProperties = {
            leaseCollectionName: this.leaseCollectionName,
            createLeaseCollectionIfNotExists: this.createLeaseCollectionIfNotExists,
            leaseConnectionStringSetting: this.leaseConnectionStringSetting,
            leaseDatabaseName: this.leaseDatabaseName,
            leasesCollectionThroughput: this.leasesCollectionThroughput,
            leaseCollectionPrefix: this.leaseCollectionPrefix,
            feedPollDelay: this.feedPollDelay,
            leaseAcquireInterval: this.leaseAcquireInterval,
            leaseExpirationInterval: this.leaseExpirationInterval,
            leaseRenewInterval: this.leaseRenewInterval,
            checkpointFrequency: this.checkpointFrequency,
            maxItemsPerInvocation: this.maxItemsPerInvocation,
            startFromBeginning: this.startFromBeginning,
            preferredLocations: this.preferredLocations
        };
        return Object.assign({}, coreProperties, cosmosProperties);
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

    public getProperties(): Binding {
        const coreProperties = super.getProperties();
        if (!this.id) throw new Error("Missing required property 'id'")
        if (!this.partitionKey) throw new Error("Missing required property 'partitionKey'")

        const cosmosProperties = {
            id: this.id,
            partitionKey: this.partitionKey,
            sqlQuery: this.sqlQuery,
            preferredLocations: this.preferredLocations
        };
        return Object.assign({}, coreProperties, cosmosProperties);
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

    public getProperties(): Binding {
        const coreProperties = super.getProperties();
        if (!this.partitionKey) throw new Error("Missing required property 'partitionKey'")

        const cosmosProperties = {
            partitionKey: this.partitionKey,
            createIfNotExists: this.createIfNotExists,
            collectionThroughput: this.collectionThroughput,
            preferredLocations: this.preferredLocations,
            useMultipleWriteLocations: this.useMultipleWriteLocations
        };
        return Object.assign({}, coreProperties, cosmosProperties);
    }
}
