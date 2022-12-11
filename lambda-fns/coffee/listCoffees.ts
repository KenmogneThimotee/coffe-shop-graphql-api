const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function listCoffees(callback: any) {
    const params = {
        TableName: process.env.COFFEE_TABLE,
    }
    try {
        const data = await docClient.scan(params).promise()
        return data.Items
    } catch (err) {
        console.log('DynamoDB error: ', err)
        callback("Internal server error")
        return null
    }
}

export default listCoffees;