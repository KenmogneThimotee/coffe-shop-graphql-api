import getCoffeeById from "../coffee/getCoffeeById";
import getCommandById from "./getCommandById";

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

async function updateCommand(command: any, username: String, groups: String[]) {

  try {
    const item = await getCommandById(command.id, username, groups)
    if( item === undefined){
        return null
      }
    } catch (error) {
      return null
  }

  let price = 0
  for(let coffeeCommand of command.coffee){
      console.log("coffe", coffeeCommand)
      try {
          const item = await getCoffeeById(coffeeCommand.coffee)

          if(item === undefined){
              return null
          }else{
              price += item.price * coffeeCommand.quantity
          }
      } catch (error) {
          console.log("error", error)
      }

  }

  command.totalPrice = price
  command.username = username

  let params : Params = {
    TableName: process.env.COMMAND_TABLE,
    Key: {
      id: command.id
    },
    ExpressionAttributeValues: {},
    ExpressionAttributeNames: {},
    UpdateExpression: "",
    ReturnValues: "UPDATED_NEW"
  };
  let prefix = "set ";
  let attributes = Object.keys(command);
  for (let i=0; i<attributes.length; i++) {
    let attribute = attributes[i];
    if (attribute !== "id") {
      params["UpdateExpression"] += prefix + "#" + attribute + " = :" + attribute;
      params["ExpressionAttributeValues"][":" + attribute] = command[attribute];
      params["ExpressionAttributeNames"]["#" + attribute] = attribute;
      prefix = ", ";
    }
 }
  console.log('params: ', params)
  try {
    await docClient.update(params).promise()
    return command
  } catch (err) {
    console.log('DynamoDB error: ', err)
    return null
  }
}

export default updateCommand;