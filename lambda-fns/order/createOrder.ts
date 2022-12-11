const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
import getCoffeeById from '../coffee/getCoffeeById';
import Order = require('./order');
const { v4: uuid } = require('uuid')


async function createOrder(order: Order, username: String, callback: any) {

    order.id = uuid()
    console.log("order", order)
    let price = 0
    for(let coffeeOrder of order.coffee){
        console.log("coffe", coffeeOrder)
        try {
            const item = await getCoffeeById(coffeeOrder.coffee)

            if(item === undefined){
                return null
            }else{
                price += item.price * coffeeOrder.quantity
            }
        } catch (error) {
            console.log("error", error)
        }

    }

    order.totalPrice = price
    order.username = username
   
    const params = {
        TableName: process.env.ORDER_TABLE,
        Item: order
    }
    try {
        await docClient.put(params).promise();
        return order;
    } catch (err) {
        console.log('DynamoDB error: ', err);
        callback("Internal server error")
        return null
    }
}

export default createOrder;