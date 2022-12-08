const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
import Payment = require('./payment');
import getBillById from '../bill/getBillById';
import getPromoCodeById from '../promo-code/getPromoCodeById';

async function createPayment(payment: Payment) {
    const params = {
        TableName: process.env.PAYMENT_TABLE,
        Item: payment
    }

    try {
        await getBillById(payment.bill)
    } catch (error) {
        return null;
    }

    try {
        await getPromoCodeById(payment.promoCode)
    } catch (error) {
        
    }


    try {
        await docClient.put(params).promise();
        return payment;
    } catch (err) {
        console.log('DynamoDB error: ', err);
        return null;
    }
}

export default createPayment;