# **This project implement a coffee shop api.**

**

# Scope of the project

**

A coffee shop app is a project where client can register and login to buy a coffee
This project is buils **AWS APPSYNC** ,  **AWS DynamoDB**,  **AWS Cognito**, **AWS Lambda**
We have two type of users :

 - **Admin user**
 - **Simple user**

**The simple user can** :

 - Create an account via aws cognito
 - Login to get a token
 - See all type of coffee
 - See a specific type of coffee
 - See all coffee
 - See a specific coffee
 - Order an coffe
 - Update an order
 - Delete an order
 - See a specific order
 - See a bill
 - Make a payment for an order 
 - See a payment
 
 **The Admin user can** :
 
 - All what a simple is suposed to do
 - Create a Type of coffee
 - Update a type of coffee
 - Delete a type of coffee
 - Delete bill
 - Delete payment
 - Create coffee
 - Update coffee
 - Delete coffee

## Project Struture
├── bin						 
├── docs
├── graphql
├── lambda-fns
├── lib
└── test

## APIs documentation
Generate offline documentation based on graphql schema:
	
> First install magidoc on your system
```bash
npm install --global @magidoc/cli@latest
```
> Generate the documentation
> The documentation will be generated and placed in a docs folder

   ```bash
magidoc generate
```
> You can preview the documentation with this command

   ```bash
magidoc preview
```

> Online API documention [API doc link](https://coffee-shop-api-docs.netlify.app/)

# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

  

## Useful commands

  

*  `npm run build` compile typescript to js

*  `npm run watch` watch for changes and compile

*  `npm run test` perform the jest unit tests

*  `cdk deploy` deploy this stack to your default AWS account/region

*  `cdk diff` compare deployed stack with current state

*  `cdk synth` emits the synthesized CloudFormation template
* 