const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function deletePromoCode(promoCodeId: String) {
    const params = {
        TableName: process.env.PROMOCODE_TABLE,
        Key: {
          id: promoCodeId
        }
    }
    try {
        await docClient.delete(params).promise()
        return promoCodeId
    } catch (err) {
        console.log('DynamoDB error: ', err)
        return null
    }
}

export default deletePromoCode;