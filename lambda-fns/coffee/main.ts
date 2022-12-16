import createCoffee from './createCoffee';
import deleteCoffee from './deleteCoffee';
import getCoffeeById from './getCoffeeById';
import listCoffees from './listCoffees';
import updateCoffee from './updateCoffee';
import Coffee = require('./coffee');


type AppSyncEvent = {
   info: {
     fieldName: string
  },
   arguments: {
     coffeeId: string,
     coffee: Coffee,

     username: String
  },
  identity: {
    username: string,
    claims: {
      [key: string]: string[]
    },
    groups: string[],
  }
}

exports.handler = async (event:AppSyncEvent, context: any, callback: any) => {
    console.log(context)
    console.log(event)
    switch (event.info.fieldName) {
        case "getCoffeeById":
            return await getCoffeeById(event.arguments.coffeeId);
        case "createCoffee":
            return await createCoffee(event.arguments.coffee, callback);
        case "listCoffees":
            return await listCoffees(callback);
        case "deleteCoffee":
            return await deleteCoffee(event.arguments.coffeeId, callback);
        case "updateCoffee":
            return await updateCoffee(event.arguments.coffee, callback);
        

        default:
            return null;
    }
}