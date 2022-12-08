const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function getCoffeeById(coffeeId: String) {
    const params = {
        TableName: process.env.COFFEE_TABLE,
        Key: { id: coffeeId }
    }
    try {
        const { Item } = await docClient.get(params).promise()
        return Item
    } catch (err) {
        console.log('DynamoDB error: ', err)
    }
}

export default getCoffeeById