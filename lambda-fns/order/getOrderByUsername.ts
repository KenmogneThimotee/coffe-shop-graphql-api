const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function getOrderByUsername(username: String, callback: any) {
    const params = {
        TableName: process.env.ORDER_TABLE,
        FilterExpression: '#username = :username',
        ExpressionAttributeNames: {
            '#username': 'username',
        },
        ExpressionAttributeValues: {
            ':username': username,
        },
    }
    try {
        let orders : any;
        orders = await docClient.scan(params).promise()
        console.log('orders', orders)
        return orders.Items
        
    } catch (err) {
        console.log('DynamoDB error: ', err)
        callback("Internal server error")
    }
}

export default getOrderByUsername