import { GraphqlApi, LambdaDataSource } from "@aws-cdk/aws-appsync-alpha";
import * as cdk from 'aws-cdk-lib';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';


function createBillInfra(construct: cdk.Stack, api: GraphqlApi){

    const lambdaFunction = new lambda.Function(construct, 'AppSyncBillHandler', {
        runtime: lambda.Runtime.NODEJS_16_X,
        handler: 'main.handler',
        code: lambda.Code.fromAsset('lambda-fns/bill'),
        memorySize: 1024
    });

    const lambdaDs = api.addLambdaDataSource('lambdaBillDatasource', lambdaFunction)


    lambdaDs.createResolver({
        typeName: "Query",
        fieldName: "getBillById"
      });
      
    lambdaDs.createResolver({
        typeName: "Query",
        fieldName: "listBills"
    });

    lambdaDs.createResolver({
        typeName: "Query",
        fieldName: "getBillByUsername"
    });

    lambdaDs.createResolver({
        typeName: "Mutation",
        fieldName: "createBill"
      });
  
    lambdaDs.createResolver({
        typeName: "Mutation",
        fieldName: "updateBill"
    });

    lambdaDs.createResolver({
        typeName: "Mutation",
        fieldName: "deleteBill"
    });

    const billTable = new ddb.Table(construct, 'BillTable', {
        billingMode: ddb.BillingMode.PAY_PER_REQUEST,
        partitionKey: {
            name: 'id',
            type: ddb.AttributeType.STRING,
        },
    });
    // enable the Lambda function to access the DynamoDB table (using IAM)
    billTable.grantFullAccess(lambdaFunction)
    
    // Create an environment variable that we will use in the function code
    lambdaFunction.addEnvironment('BILL_TABLE', billTable.tableName);

}


export default createBillInfra