const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function getPaymentByUsername(username: String) {
    const params = {
        TableName: process.env.PAYMENT_TABLE,
        FilterExpression: '#username = :username',
        ExpressionAttributeNames: {
            '#username': 'username',
        },
        ExpressionAttributeValues: {
            ':username': username,
        },
    }
    try {
        const { Item } = await docClient.scan(params).promise()
        return Item
    } catch (err) {
        console.log('DynamoDB error: ', err)
    }
}

export default getPaymentByUsername