import { callbackify } from "util";
import getBillById from "./getBillById";

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

async function updateBill(bill: any, username: String, groups: String[], callback: any) {
  
  try {
    const item = await getBillById(bill.id, username, groups)
    if( item === undefined){
        return null
      }
  } catch (error) {
      return null
  }

  let params : Params = {
    TableName: process.env.BILL_TABLE,
    Key: {
      id: bill.id
    },
    ExpressionAttributeValues: {},
    ExpressionAttributeNames: {},
    UpdateExpression: "",
    ReturnValues: "UPDATED_NEW"
  };
  let prefix = "set ";
  let attributes = Object.keys(bill);
  for (let i=0; i<attributes.length; i++) {
    let attribute = attributes[i];
    if (attribute !== "id") {
      params["UpdateExpression"] += prefix + "#" + attribute + " = :" + attribute;
      params["ExpressionAttributeValues"][":" + attribute] = bill[attribute];
      params["ExpressionAttributeNames"]["#" + attribute] = attribute;
      prefix = ", ";
    }
 }
  console.log('params: ', params)
  try {
    await docClient.update(params).promise()
    return bill
  } catch (err) {
    console.log('DynamoDB error: ', err)
    callback("Internal server error")
    return null
  }
}

export default updateBill;