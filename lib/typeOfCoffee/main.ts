import { GraphqlApi, LambdaDataSource } from "@aws-cdk/aws-appsync-alpha";
import * as cdk from 'aws-cdk-lib';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';


function createTypeInfra(construct: cdk.Stack, api: GraphqlApi){

    const lambdaFunction = new lambda.Function(construct, 'AppSyncTypeHandler', {
        runtime: lambda.Runtime.NODEJS_16_X,
        handler: 'main.handler',
        code: lambda.Code.fromAsset('lambda-fns/type'),
        memorySize: 1024
    });
  
    const lambdaDs = api.addLambdaDataSource('lambdaTypeDatasource', lambdaFunction)
  

    lambdaDs.createResolver({
        typeName: "Query",
        fieldName: "getTypeById"
      });
      
    lambdaDs.createResolver({
        typeName: "Query",
        fieldName: "listTypes"
    });

    lambdaDs.createResolver({
        typeName: "Mutation",
        fieldName: "createType"
      });
      
    lambdaDs.createResolver({
        typeName: "Mutation",
        fieldName: "updateType"
    });

    lambdaDs.createResolver({
        typeName: "Mutation",
        fieldName: "deleteType"
    });

    const typeTable = new ddb.Table(construct, 'TypeTable', {
        billingMode: ddb.BillingMode.PAY_PER_REQUEST,
        partitionKey: {
            name: 'id',
            type: ddb.AttributeType.STRING,
        },
    });
    // enable the Lambda function to access the DynamoDB table (using IAM)
    typeTable.grantFullAccess(lambdaFunction)
    
    // Create an environment variable that we will use in the function code
    lambdaFunction.addEnvironment('TYPE_TABLE', typeTable.tableName);

}


export default createTypeInfra