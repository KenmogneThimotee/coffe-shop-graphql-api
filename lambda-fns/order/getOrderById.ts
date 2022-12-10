const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function getOrderById(orderId: String, username: String, groups: String[]) {
    const params = {
        TableName: process.env.ORDER_TABLE,
        Key: { id: orderId }
    }
    try {
        const { Item } = await docClient.get(params).promise()
        if(Item.username !== username){
            if( groups.includes('admin') ){
                return Item
            }else{
                return undefined
            }
        }
        return Item
    } catch (err) {
        console.log('DynamoDB error: ', err)
    }
}

export default getOrderById