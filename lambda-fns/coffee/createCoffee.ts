const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
import Coffee = require('./coffee');
import getTypeById from '../type/getTypeById';

async function createCoffee(coffee: Coffee) {
    const params = {
        TableName: process.env.COFFEE_TABLE,
        Item: coffee
    }

    const paramsType = {
        TableName: process.env.TYPE_TABLE,
        Key: { id: coffee.type }
    }
    try {
        const { Item } = await docClient.get(paramsType).promise()
        console.log(Item)
        if(Item === undefined) return null
    } catch (err) {
        console.log('DynamoDB error: ', err)
        return null
    }


    try {
        await docClient.put(params).promise();
        return coffee;
    } catch (err) {
        console.log('DynamoDB error: ', err);
        return null
    }
}

export default createCoffee;