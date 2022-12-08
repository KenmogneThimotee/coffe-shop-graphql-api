const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function getTypeById(typeId: String) {
    const params = {
        TableName: process.env.TYPE_TABLE,
        Key: { id: typeId }
    }
    try {
        const { Item } = await docClient.get(params).promise()
        return Item
    } catch (err) {
        console.log('DynamoDB error: ', err)
    }
}

export default getTypeById