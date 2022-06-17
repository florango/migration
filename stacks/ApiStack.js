import * as sst from "@serverless-stack/resources";
import lambda from '@aws-cdk/aws-lambda';
import * as iam from "@aws-cdk/aws-iam";
import cdk from '@aws-cdk/core';
import AWS from 'aws-sdk';


export default class ApiStack extends sst.Stack {

    // Public reference to the API
    api;

    constructor(scope, id, props) {
        super(scope, id, props);

        const { importsTable, databaseName, assetsBucket } = props;

        // Create the API
        this.api = new sst.Api(this, "Api", {
            defaultThrottlingRateLimit: 100,
            defaultThrottlingBurstLimit: 50,
            defaultFunctionProps: {
                environment: {
                    importsTableName: importsTable.tableName,
                    assetsBucketName: assetsBucket.bucketName,
                    region: scope.region,
                    AWS_NODEJS_CONNECTION_REUSE_ENABLED: 1,
                },
            },
            routes: {
                'GET    /cards/{orgId}/{cardId}': 'api/functions/lambda.spreadsheetImporter',
            },
        });

        // Allow the API to access the tables
        this.api.attachPermissions([importsTable]);

        // Allow the API to access the Assets bucket
        this.api.attachPermissions([assetsBucket]);

        // Show the API endpoint in the output
        this.addOutputs({
            APIEndpoint: this.api.url,
            databaseName,
        });
    }
}