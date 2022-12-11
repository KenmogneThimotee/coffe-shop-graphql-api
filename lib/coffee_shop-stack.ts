import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
//import * as cdk from '@aws-cdk/core';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cognito from 'aws-cdk-lib/aws-cognito'
import { AccountRecovery, UserPool, UserPoolClient, VerificationEmailStyle } from '@aws-cdk/aws-cognito'
import createCoffeInfra from './coffee/main'

import {
  GraphqlApi,
  Schema,
  AuthorizationType,

} from '@aws-cdk/aws-appsync-alpha'
import createOrderInfra from './order/main';
import createPaymentInfra from './payment/main';
import createTypeInfra from './typeOfCoffee/main';
import createBill from '../lambda-fns/bill/createBill';
import createBillInfra from './bill/main';


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
          authorizationType: AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool
          }
        }
      },
      xrayEnabled: true,
    });

    // Prints out the AppSync GraphQL endpoint to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl
    });

    // Prints out the stack region to the terminal
    new cdk.CfnOutput(this, "Stack Region", {
      value: this.region
    });

    new cdk.CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId
    })

    new cdk.CfnOutput(this, "UserPoolClientId", {
      value: userPoolClient.userPoolClientId
    })
    
    const coffeShopLambda = new lambda.Function(this, 'AppSyncCoffeeHandler', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'coffee-main.handler',
      code: lambda.Code.fromAsset('lambda-fns'),
      memorySize: 1024
    });

    // Set the new Lambda function as a data source for the AppSync API
    const lambdaDs = api.addLambdaDataSource('lambdaCoffeeDatasource', coffeShopLambda)
    
    createCoffeInfra(this, lambdaDs, coffeShopLambda)
    createOrderInfra(this, lambdaDs, coffeShopLambda)
    createPaymentInfra(this, lambdaDs, coffeShopLambda)
    createTypeInfra(this, lambdaDs, coffeShopLambda)
    createBillInfra(this, lambdaDs, coffeShopLambda)
  }
}
