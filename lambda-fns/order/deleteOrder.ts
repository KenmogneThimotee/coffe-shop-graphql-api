const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
import getCommandById from "./getCommandById";

async function deleteCommand(commandId: String, username: String, groups: String[]) {

    try {
        const item = await getCommandById(commandId, username, groups)
        if( item === undefined){
            return null
          }
        } catch (error) {
          return null
    }

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