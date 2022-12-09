const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
import getCoffeeById from '../coffee/getCoffeeById';
import Command = require('./command');

async function createCommand(command: Command, username: String) {

   console.log("command", command)
   let price = 0
    for(let coffeeCommand of command.coffee){
        console.log("coffe", coffeeCommand)
        try {
            const item = await getCoffeeById(coffeeCommand.coffee)

            if(item === undefined){
                return null
            }else{
                price += item.price * coffeeCommand.quantity
            }
        } catch (error) {
            console.log("error", error)
        }

    }

    command.totalPrice = price
    command.username = username
   
    console.log("end of user")
    console.log("egg", command)
    const params = {
        TableName: process.env.COMMAND_TABLE,
        Item: command
    }
    try {
        await docClient.put(params).promise();
        return command;
    } catch (err) {
        console.log('DynamoDB error: ', err);
        return null;
    }
}

export default createCommand;