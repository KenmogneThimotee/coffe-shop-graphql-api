const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

interface Params {
  TableName: string | undefined,
  Key: string | {},
  ExpressionAttributeValues: any,
  ExpressionAttributeNames: any,
  UpdateExpression: string,
  ReturnValues: string
}

async function updateCoffee(coffee: any, callback: any) {
  let params : Params = {
    TableName: process.env.COFFEE_TABLE,
    Key: {
      id: coffee.id
    },
    ExpressionAttributeValues: {},
    ExpressionAttributeNames: {},
    UpdateExpression: "",
    ReturnValues: "UPDATED_NEW"
  };
  let prefix = "set ";
  let attributes = Object.keys(coffee);
  for (let i=0; i<attributes.length; i++) {
    let attribute = attributes[i];
    if (attribute !== "id") {
      params["UpdateExpression"] += prefix + "#" + attribute + " = :" + attribute;
      params["ExpressionAttributeValues"][":" + attribute] = coffee[attribute];
      params["ExpressionAttributeNames"]["#" + attribute] = attribute;
      prefix = ", ";
    }
 }
  console.log('params: ', params)
  try {
    await docClient.update(params).promise()
    return coffee
  } catch (err) {
    console.log('DynamoDB error: ', err)
    callback("Internal server error")
  }
}

export default updateCoffee;