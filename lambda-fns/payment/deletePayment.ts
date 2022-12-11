const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function deletePayment(paymentId: String, callback: any) {
    const params = {
        TableName: process.env.PAYMENT_TABLE,
        Key: {
          id: paymentId
        }
    }
    try {
        await docClient.delete(params).promise()
        return paymentId
    } catch (err) {
        console.log('DynamoDB error: ', err)
        callback("Internal server error")
        return null
    }
}

export default deletePayment;