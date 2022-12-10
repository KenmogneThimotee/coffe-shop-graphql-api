import { LambdaDataSource } from "@aws-cdk/aws-appsync-alpha";
import * as cdk from 'aws-cdk-lib';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';


function createPaymentInfra(construct: cdk.Stack, lambdaDs: LambdaDataSource, lambdaFunction: cdk.aws_lambda.Function){

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