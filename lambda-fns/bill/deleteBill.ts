const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
import getBillById from "./getBillById";

async function deleteBill(billId: String, username: String, groups: String[], callback: any) {

    try {
        const item = await getBillById(billId, username, groups)
        if( item === undefined){
            callback("This bill doesn't exist")
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
        callback("Internal server error")
        return null
    }
}

export default deleteBill;