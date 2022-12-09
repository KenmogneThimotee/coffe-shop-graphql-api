import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
//import * as cdk from '@aws-cdk/core';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cognito from 'aws-cdk-lib/aws-cognito'
import { AccountRecovery, UserPool, UserPoolClient, VerificationEmailStyle } from '@aws-cdk/aws-cognito'


import {
  GraphqlApi,
  Schema,
  AuthorizationType,
  FieldLogLevel,
  MappingTemplate,
  PrimaryKey,
  Values,
} from '@aws-cdk/aws-appsync-alpha'


export class CoffeeShopStack extends cdk.Stack {
  constructor(scope:Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userPool = new cognito.UserPool(this, 'cdk-coffee-user-pool', {
      selfSignUpEnabled: true,
      accountRecovery: cognito.AccountRecovery.PHONE_AND_EMAIL,
      userVerification: {
        emailStyle: cognito.VerificationEmailStyle.CODE
      },
      autoVerify: {
        email: true
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true
        }
      }
    })

    const userPoolClient = new cognito.UserPoolClient(this, "UserPoolClient", {
      userPool
    })

    // Creates the AppSync API
    const api = new GraphqlApi(this, 'Api', {
      name: 'cdk-coffee-shop-appsync-api',
      schema: Schema.fromAsset('graphql/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365))
          }
        },
        additionalAuthorizationModes: [{
          authorizationType: AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool
          }
        }]
      },
      xrayEnabled: true,
    });

    // Prints out the AppSync GraphQL endpoint to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl
    });
  
    // Prints out the AppSync GraphQL API key to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || ''
    });

    // Prints out the stack region to the terminal
    new cdk.CfnOutput(this, "Stack Region", {
      value: this.region
    });

    
    const coffeShopLambda = new lambda.Function(this, 'AppSyncCoffeeHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'coffee-main.handler',
      code: lambda.Code.fromAsset('lambda-fns'),
      memorySize: 1024
    });

    // Set the new Lambda function as a data source for the AppSync API
    const lambdaDs = api.addLambdaDataSource('lambdaCoffeeDatasource', coffeShopLambda)
    
    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "getCoffeeById"
    });

    
    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "listCoffees"
    });
  
    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "getCommandById"
    });
    
    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "listCommands"
    });
    
    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "getTypeById"
    });
    
    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "listTypes"
    });
    
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
      fieldName: "getPaymentById"
    });

    
    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "listPayments"
    });
    
    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "getPromoCodeById"
    });
    
    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "listPromoCodes"
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
    
    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "createCommand"
    });

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "updateCommand"
    });

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "deleteCommand"
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

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "createPromoCode"
    });

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "updatePromoCode"
    });

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "deletePromoCode"
    });
    
    const coffeTable = new ddb.Table(this, 'CoffeeTable', {
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: ddb.AttributeType.STRING,
      },
    });
    // enable the Lambda function to access the DynamoDB table (using IAM)
    coffeTable.grantFullAccess(coffeShopLambda)
    
    // Create an environment variable that we will use in the function code
    coffeShopLambda.addEnvironment('COFFEE_TABLE', coffeTable.tableName);


    const commandTable = new ddb.Table(this, 'CommandTable', {
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: ddb.AttributeType.STRING,
      },
    });
    // enable the Lambda function to access the DynamoDB table (using IAM)
    commandTable.grantFullAccess(coffeShopLambda)
    
    // Create an environment variable that we will use in the function code
    coffeShopLambda.addEnvironment('COMMAND_TABLE', commandTable.tableName);


    const typeTable = new ddb.Table(this, 'TypeTable', {
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: ddb.AttributeType.STRING,
      },
    });
    // enable the Lambda function to access the DynamoDB table (using IAM)
    typeTable.grantFullAccess(coffeShopLambda)
    
    // Create an environment variable that we will use in the function code
    coffeShopLambda.addEnvironment('TYPE_TABLE', typeTable.tableName);


    const billTable = new ddb.Table(this, 'BillTable', {
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: ddb.AttributeType.STRING,
      },
    });
    // enable the Lambda function to access the DynamoDB table (using IAM)
    billTable.grantFullAccess(coffeShopLambda)
    
    // Create an environment variable that we will use in the function code
    coffeShopLambda.addEnvironment('BILL_TABLE', billTable.tableName);


    const paymentTable = new ddb.Table(this, 'PaymentTable', {
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: ddb.AttributeType.STRING,
      },
    });
    // enable the Lambda function to access the DynamoDB table (using IAM)
    paymentTable.grantFullAccess(coffeShopLambda)
    
    // Create an environment variable that we will use in the function code
    coffeShopLambda.addEnvironment('PAYMENT_TABLE', paymentTable.tableName);


    const promoCodeTable = new ddb.Table(this, 'PromoCodeTable', {
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: ddb.AttributeType.STRING,
      },
    });
    // enable the Lambda function to access the DynamoDB table (using IAM)
    promoCodeTable.grantFullAccess(coffeShopLambda)
    
    // Create an environment variable that we will use in the function code
    coffeShopLambda.addEnvironment('PROMOCODE_TABLE', promoCodeTable.tableName);

  }
}
