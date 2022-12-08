const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function deleteBill(billId: String) {
    const params = {
        TableName: process.env.BILL_TABLE,
        Key: {
          id: billId
        }
    }
    try {
        await docClient.delete(params).promise()
        return billId
    } catch (err) {
        console.log('DynamoDB error: ', err)
        return null
    }
}

export default deleteBill;