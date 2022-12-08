const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function deleteType(typeId: String) {
    const params = {
        TableName: process.env.TYPE_TABLE,
        Key: {
          id: typeId
        }
    }
    try {
        await docClient.delete(params).promise()
        return typeId
    } catch (err) {
        console.log('DynamoDB error: ', err)
        return null
    }
}

export default deleteType;