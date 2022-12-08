const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function deleteCommand(commandId: String) {
    const params = {
        TableName: process.env.COMMAND_TABLE,
        Key: {
          id: commandId
        }
    }
    try {
        await docClient.delete(params).promise()
        return commandId
    } catch (err) {
        console.log('DynamoDB error: ', err)
        return null
    }
}

export default deleteCommand;