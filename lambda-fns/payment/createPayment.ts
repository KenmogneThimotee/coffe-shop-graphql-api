const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
import { callbackify } from 'util';
import Payment = require('./payment');
import * as crypto from 'crypto';


async function createPayment(payment: Payment, username: String, callback: any) {

    payment.id = crypto.randomBytes(4).toString("hex");
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
        if(Item === undefined){
            callback("This bill doesn't exist")
            return null
        } 
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