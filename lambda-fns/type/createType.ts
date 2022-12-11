const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
import Type = require('./type');
import { v4 as uuid } from 'uuid'


async function createType(type: Type, callback: any) {
    
    type.id = uuid()
    const params = {
        TableName: process.env.TYPE_TABLE,
        Item: type
    }
    try {
        await docClient.put(params).promise();
        return type;
    } catch (err) {
        console.log('DynamoDB error: ', err);
        callback("Internal server error")
        return null;
    }
}

export default createType;