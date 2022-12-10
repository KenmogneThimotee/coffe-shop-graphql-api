import { LambdaDataSource } from "@aws-cdk/aws-appsync-alpha";
import * as cdk from 'aws-cdk-lib';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';


function createOrderInfra(construct: cdk.Stack, lambdaDs: LambdaDataSource, lambdaFunction: cdk.aws_lambda.Function){

    lambdaDs.createResolver({
        typeName: "Query",
        fieldName: "getOrderById"
      });
      
    lambdaDs.createResolver({
    typeName: "Query",
    fieldName: "listOrders"
    });

    lambdaDs.createResolver({
        typeName: "Query",
        fieldName: "getOrderByUsername"
    });

    lambdaDs.createResolver({
        typeName: "Mutation",
        fieldName: "createOrder"
      });
  
    lambdaDs.createResolver({
        typeName: "Mutation",
        fieldName: "updateOrder"
    });

    lambdaDs.createResolver({
        typeName: "Mutation",
        fieldName: "deleteOrder"
    });

    const commandTable = new ddb.Table(construct, 'OrderTable', {
        billingMode: ddb.BillingMode.PAY_PER_REQUEST,
        partitionKey: {
          name: 'id',
          type: ddb.AttributeType.STRING,
        },
      });
      // enable the Lambda function to access the DynamoDB table (using IAM)
      commandTable.grantFullAccess(lambdaFunction)
      
      // Create an environment variable that we will use in the function code
      lambdaFunction.addEnvironment('ORDER_TABLE', commandTable.tableName);
  


}


export default createOrderInfra