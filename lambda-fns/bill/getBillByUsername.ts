const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function getBillByUsername(username: String) {
    const params = {
        TableName: process.env.BILL_TABLE,
        FilterExpression: '#username = :username',
        ExpressionAttributeNames: {
            '#username': 'username',
        },
        ExpressionAttributeValues: {
            ':username': username,
        },
    }

    try {
        let bills : any
        bills = await docClient.scan(params).promise()
        return bills.Items
    } catch (err) {
        console.log('DynamoDB error: ', err)
    }
}

export default getBillByUsername