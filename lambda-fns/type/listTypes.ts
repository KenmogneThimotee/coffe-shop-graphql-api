const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function listTypes() {
    const params = {
        TableName: process.env.TYPE_TABLE,
    }
    try {
        const data = await docClient.scan(params).promise()
        return data.Items
    } catch (err) {
        console.log('DynamoDB error: ', err)
        return null
    }
}

export default listTypes;