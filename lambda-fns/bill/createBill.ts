const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
import Bill = require('./bill');

async function createBill(bill: Bill) {
    const params = {
        TableName: process.env.BILL_TABLE,
        Item: bill
    }
    try {
        await docClient.put(params).promise();
        return bill;
    } catch (err) {
        console.log('DynamoDB error: ', err);
        return null;
    }
}

export default createBill;