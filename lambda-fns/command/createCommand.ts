const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
import Command = require('./command');

async function createCommand(command: Command) {
    const params = {
        TableName: process.env.COMMAND_TABLE,
        Item: command
    }
    try {
        await docClient.put(params).promise();
        return command;
    } catch (err) {
        console.log('DynamoDB error: ', err);
        return null;
    }
}

export default createCommand;