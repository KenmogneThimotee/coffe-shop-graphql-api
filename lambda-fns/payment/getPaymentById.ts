const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function getPaymentById(paymentId: String) {
    const params = {
        TableName: process.env.PAYMENT_TABLE,
        Key: { id: paymentId }
    }
    try {
        const { Item } = await docClient.get(params).promise()
        return Item
    } catch (err) {
        console.log('DynamoDB error: ', err)
    }
}

export default getPaymentById