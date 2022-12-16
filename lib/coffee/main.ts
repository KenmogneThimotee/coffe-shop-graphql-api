import { GraphqlApi } from "@aws-cdk/aws-appsync-alpha";
import * as cdk from 'aws-cdk-lib';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';


function createCoffeInfra(construct: cdk.Stack, api: GraphqlApi){

    const lambdaFunction = new lambda.Function(construct, 'AppSyncCoffeeHandler', {
        runtime: lambda.Runtime.NODEJS_16_X,
        handler: 'main.handler',
        code: lambda.Code.fromAsset('lambda-fns/coffee'),
        memorySize: 1024
      });
    
    const lambdaDs = api.addLambdaDataSource('lambdaCoffeeDatasource', lambdaFunction)


    lambdaDs.createResolver({
        typeName: "Query",
        fieldName: "getCoffeeById"
    });
  
      
    lambdaDs.createResolver({
        typeName: "Query",
        fieldName: "listCoffees"
    });

    lambdaDs.createResolver({
        typeName: "Mutation",
        fieldName: "createCoffee"
      });
      
    lambdaDs.createResolver({
        typeName: "Mutation",
        fieldName: "updateCoffee"
    });
    
    lambdaDs.createResolver({
        typeName: "Mutation",
        fieldName: "deleteCoffee"
    });

    const coffeTable = new ddb.Table(construct, 'CoffeeTable', {
        billingMode: ddb.BillingMode.PAY_PER_REQUEST,
        partitionKey: {
          name: 'id',
          type: ddb.AttributeType.STRING,
        },
      });
      // enable the Lambda function to access the DynamoDB table (using IAM)
      coffeTable.grantFullAccess(lambdaFunction)
      
      // Create an environment variable that we will use in the function code
      lambdaFunction.addEnvironment('COFFEE_TABLE', coffeTable.tableName);
  
}

export default createCoffeInfra