import getCoffeeById from "../coffee/getCoffeeById";
import getOrderById from "./getOrderById";

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

async function updateOrder(order: any, username: String, groups: String[]) {

  try {
    const item = await getOrderById(order.id, username, groups)
    if( item === undefined){
        return null
      }
    } catch (error) {
      return null
  }

  let price = 0
  for(let coffeeOrder of order.coffee){
      console.log("coffe", coffeeOrder)
      try {
          const item = await getCoffeeById(coffeeOrder.coffee)

          if(item === undefined){
              return null
          }else{
              price += item.price * coffeeOrder.quantity
          }
      } catch (error) {
          console.log("error", error)
      }

  }

  order.totalPrice = price
  order.username = username

  let params : Params = {
    TableName: process.env.ORDER_TABLE,
    Key: {
      id: order.id
    },
    ExpressionAttributeValues: {},
    ExpressionAttributeNames: {},
    UpdateExpression: "",
    ReturnValues: "UPDATED_NEW"
  };
  let prefix = "set ";
  let attributes = Object.keys(order);
  for (let i=0; i<attributes.length; i++) {
    let attribute = attributes[i];
    if (attribute !== "id") {
      params["UpdateExpression"] += prefix + "#" + attribute + " = :" + attribute;
      params["ExpressionAttributeValues"][":" + attribute] = order[attribute];
      params["ExpressionAttributeNames"]["#" + attribute] = attribute;
      prefix = ", ";
    }
 }
  console.log('params: ', params)
  try {
    await docClient.update(params).promise()
    return order
  } catch (err) {
    console.log('DynamoDB error: ', err)
    return null
  }
}

export default updateOrder;