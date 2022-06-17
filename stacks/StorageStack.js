import * as sst from "@serverless-stack/resources";
import cfn from '@aws-cdk/aws-cloudformation';
import lambda from '@aws-cdk/aws-lambda';
import cdk from '@aws-cdk/core';
import * as iam from "@aws-cdk/aws-iam";
import { ProjectionType } from "@aws-cdk/aws-dynamodb";

export default class StorageStack extends sst.Stack {

    // Public reference to the bucket
    assetsBucket;

    // Public references to the DynamoDB Tables
    importsTable;
    cardsTable;

    databaseName = "Imports";

    constructor(scope, id, props) {

        super(scope, id, props);


        const bucketCORS = [
            {
                "allowedHeaders": [
                    "*"
                ],
                "allowedMethods": [
                    "PUT",
                    "POST",
                    "DELETE"
                ],
                "allowedOrigins": [
                    '*',
                ],
            },
            {
                "allowedHeaders": [],
                "allowedMethods": [
                    "GET"
                ],
                "allowedOrigins": [
                    "*"
                ],
            }
        ];

        this.assetsBucket = new sst.Bucket(this, "Assets", {
            s3Bucket: {
                autoDeleteObjects: true,
                removalPolicy: cdk.RemovalPolicy.DESTROY,
                publicReadAccess: true,
                enforceSSL: false,
                cors: bucketCORS,
            },
        });

        // Create the Imports DynamoDB table
        this.organizationsTable = new sst.Table(this, "Imports", {
            fields: {
                id: sst.TableFieldType.STRING,
            },
            primaryIndex: { partitionKey: "id" },
            dynamodbTable: {
                removalPolicy: cdk.RemovalPolicy.DESTROY,
            },
        });


        this.addOutputs({
            Table: this.importsTable,
            DatabaseName: this.databaseName,
            S3BucketName: this.assetsBucket.bucketName,
            S3BucketARN: this.assetsBucket.bucketArn,
        });

    }
}