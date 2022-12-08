const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function getBillById(billId: String) {
    const params = {
        TableName: process.env.BILL_TABLE,
        Key: { id: billId }
    }
    try {
        const { Item } = await docClient.get(params).promise()
        return Item
    } catch (err) {
        console.log('DynamoDB error: ', err)
    }
}

export default getBillById