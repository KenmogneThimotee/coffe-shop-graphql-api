const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
import getBillById from "./getBillById";

async function deleteBill(billId: String, username: String, groups: String[]) {

    try {
        const item = await getBillById(billId, username, groups)
        if( item === undefined){
            return null
        }
    } catch (error) {
        return null
    }

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