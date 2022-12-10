const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
import getOrderById from '../order/getOrderById';
import Bill = require('./bill');

async function createBill(bill: Bill, username: String) {

    bill.username = username

    const command = await getOrderById(bill.command, username, ['admin'])
    if(command === undefined){
        return null
    }

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