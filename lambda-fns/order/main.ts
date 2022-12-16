import createOrder from './createOrder';
import deleteOrder from './deleteOrder';
import getOrderById from './getOrderById';
import getOrderByUsername from './getOrderByUsername';
import listOrders from './listOrders';
import updateOrder from './updateOrder';
import Order = require('./order');


type AppSyncEvent = {
   info: {
     fieldName: string
  },
   arguments: {

     orderId: string,
     order: Order,
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
        
        case "getOrderById":
            return await getOrderById(event.arguments.orderId, event.identity.username, event.identity.groups);
        case "getOrderByUsername":
            return await getOrderByUsername(event.identity.username, callback);
        case "createOrder":
            return await createOrder(event.arguments.order, event.identity.username, callback);
        case "listOrders":
            return await listOrders();
        case "deleteOrder":
            return await deleteOrder(event.arguments.orderId, event.identity.username, event.identity.groups, callback);
        case "updateOrder":
            return await updateOrder(event.arguments.order, event.identity.username, event.identity.groups);

        
        default:
            return null;
    }
}