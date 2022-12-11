const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
import { callbackify } from 'util';
import Payment = require('./payment');
const { v4: uuid } = require('uuid')


async function createPayment(payment: Payment, username: String, callback: any) {

    payment.id = uuid()
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
        callback("Internal server error")
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