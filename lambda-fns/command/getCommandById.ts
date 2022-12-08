const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function getCommandById(commandId: String) {
    const params = {
        TableName: process.env.COMMAND_TABLE,
        Key: { id: commandId }
    }
    try {
        const { Item } = await docClient.get(params).promise()
        return Item
    } catch (err) {
        console.log('DynamoDB error: ', err)
    }
}

export default getCommandById