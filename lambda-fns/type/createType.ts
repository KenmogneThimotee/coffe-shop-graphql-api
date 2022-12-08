const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
import Type = require('./type');

async function createType(type: Type) {
    const params = {
        TableName: process.env.TYPE_TABLE,
        Item: type
    }
    try {
        await docClient.put(params).promise();
        return type;
    } catch (err) {
        console.log('DynamoDB error: ', err);
        return null;
    }
}

export default createType;