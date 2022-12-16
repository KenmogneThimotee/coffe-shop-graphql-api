import { GraphqlApi, LambdaDataSource } from "@aws-cdk/aws-appsync-alpha";
import * as cdk from 'aws-cdk-lib';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';

function createPaymentInfra(construct: cdk.Stack, api: GraphqlApi){

    const lambdaFunction = new lambda.Function(construct, 'AppSyncPaymentHandler', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'main.handler',
      code: lambda.Code.fromAsset('lambda-fns/payment'),
      memorySize: 1024
    });

    const lambdaDs = api.addLambdaDataSource('lambdaPaymentDatasource', lambdaFunction)



    lambdaDs.createResolver({
        typeName: "Query",
        fieldName: "getPaymentById"
      });
  
      
    lambdaDs.createResolver({
        typeName: "Query",
        fieldName: "listPayments"
    });

    lambdaDs.createResolver({
        typeName: "Query",
        fieldName: "getPaymentByUsername"
    });

    lambdaDs.createResolver({
        typeName: "Mutation",
        fieldName: "createPayment"
      });
  
    lambdaDs.createResolver({
        typeName: "Mutation",
        fieldName: "updatePayment"
    });

    lambdaDs.createResolver({
        typeName: "Mutation",
        fieldName: "deletePayment"
    });

    const paymentTable = new ddb.Table(construct, 'PaymentTable', {
        billingMode: ddb.BillingMode.PAY_PER_REQUEST,
        partitionKey: {
          name: 'id',
          type: ddb.AttributeType.STRING,
        },
      });
      // enable the Lambda function to access the DynamoDB table (using IAM)
      paymentTable.grantFullAccess(lambdaFunction)
      
      // Create an environment variable that we will use in the function code
      lambdaFunction.addEnvironment('PAYMENT_TABLE', paymentTable.tableName);
  

}


export default createPaymentInfra