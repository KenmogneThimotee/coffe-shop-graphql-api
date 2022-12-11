const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
import { callbackify } from "util";
import getOrderById from "./getOrderById";

async function deleteOrder(orderId: String, username: String, groups: String[], callback: any) {

    try {
        const item = await getOrderById(orderId, username, groups)
        if( item === undefined){
            return null
          }
        } catch (error) {
          return null
    }

    const params = {
        TableName: process.env.ORDER_TABLE,
        Key: {
          id: orderId
        }
    }
    try {
        await docClient.delete(params).promise()
        return orderId
    } catch (err) {
        console.log('DynamoDB error: ', err)
        callback("Internal server error")
        return null
    }
}

export default deleteOrder;