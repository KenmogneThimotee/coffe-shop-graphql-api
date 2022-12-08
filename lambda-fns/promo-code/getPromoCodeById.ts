const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function getPromoCodeById(promoCodeId: String) {
    const params = {
        TableName: process.env.PROMOCODE_TABLE,
        Key: { id: promoCodeId }
    }
    try {
        const { Item } = await docClient.get(params).promise()
        return Item
    } catch (err) {
        console.log('DynamoDB error: ', err)
    }
}

export default getPromoCodeById