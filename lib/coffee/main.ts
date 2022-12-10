import { LambdaDataSource } from "@aws-cdk/aws-appsync-alpha";
import * as cdk from 'aws-cdk-lib';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';


function createCoffeInfra(construct: cdk.Stack ,lambdaDs: LambdaDataSource, lambdaFunction: cdk.aws_lambda.Function){

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