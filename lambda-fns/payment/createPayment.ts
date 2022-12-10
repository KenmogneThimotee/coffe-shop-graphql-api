const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
import Payment = require('./payment');

async function createPayment(payment: Payment, username: String) {

    const params = {
        TableName: process.env.PAYMENT_TABLE,
        Item: payment
    }

    const paramsBill = {
        TableName: process.env.BILL_TABLE,
        Key: { id: payment.bill }
    }
    try {
        const { Item } = await docClient.get(paramsBill).promise()
        if(Item === undefined) return null
    } catch (err) {
        console.log('DynamoDB error: ', err)
        return null
    }

    payment.username = username

    try {
        await docClient.put(params).promise();
        return payment;
    } catch (err) {
        console.log('DynamoDB error: ', err);
        return null;
    }
}

export default createPayment;