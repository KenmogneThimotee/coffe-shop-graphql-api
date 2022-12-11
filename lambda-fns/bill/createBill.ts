const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
import getOrderById from '../order/getOrderById';
import Bill = require('./bill');
const { v4: uuid } = require('uuid')


async function createBill(bill: Bill, username: String, callback: any) {

   
    bill.id = uuid()
    

    bill.username = username

    const order = await getOrderById(bill.order, username, ['admin'])
    if(order === undefined){
        callback("This order doesn't exist")
    }

    const params = {
        TableName: process.env.BILL_TABLE,
        Item: bill
    }
    try {
        await docClient.put(params).promise();
        return bill;
    } catch (err) {
        callback("Internal server error")
        return null;
    }
}

export default createBill;

