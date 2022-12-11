const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function getPaymentByUsername(username: String, callback: any) {
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
        let payments : any
        payments = await docClient.scan(params).promise()
        console.log('payment', payments)
        return payments.Items
    } catch (err) {
        console.log('DynamoDB error: ', err)
        callback("Internal server error")
    }
}

export default getPaymentByUsername