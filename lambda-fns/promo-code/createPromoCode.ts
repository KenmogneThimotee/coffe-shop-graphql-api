const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
import PromoCode = require('./promo-code');

async function createPromoCode(promoCode: PromoCode) {
    const params = {
        TableName: process.env.PROMOCODE_TABLE,
        Item: promoCode
    }
    try {
        await docClient.put(params).promise();
        return promoCode;
    } catch (err) {
        console.log('DynamoDB error: ', err);
        return null;
    }
}

export default createPromoCode;