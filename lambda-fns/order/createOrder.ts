const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
import getCoffeeById from '../coffee/getCoffeeById';
import Order = require('./order');

async function createOrder(order: Order, username: String) {

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
   
    console.log("end of user")
    console.log("egg", order)
    const params = {
        TableName: process.env.ORDER_TABLE,
        Item: order
    }
    try {
        await docClient.put(params).promise();
        return order;
    } catch (err) {
        console.log('DynamoDB error: ', err);
        return null;
    }
}

export default createOrder;