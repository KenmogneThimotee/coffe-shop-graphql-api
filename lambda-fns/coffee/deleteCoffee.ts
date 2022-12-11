const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function deleteCoffee(coffeeId: String, callback: any) {
    const params = {
        TableName: process.env.COFFEE_TABLE,
        Key: {
          id: coffeeId
        }
    }
    try {
        await docClient.delete(params).promise()
        return coffeeId
    } catch (err) {
        console.log('DynamoDB error: ', err)
        callback("Internal server error")
        return null
    }
}

export default deleteCoffee;