import createCoffee from './coffee/createCoffee';
import deleteCoffee from './coffee/deleteCoffee';
import getCoffeeById from './coffee/getCoffeeById';
import listCoffees from './coffee/listCoffees';
import updateCoffee from './coffee/updateCoffee';
import Coffee = require('./coffee/coffee');

import createBill from './bill/createBill';
import deleteBill from './bill/deleteBill';
import getBillById from './bill/getBillById';
import getBillByUsername from './bill/getBillByUsername';
import listBills from './bill/listBills';
import updateBill from './bill/updateBill';
import Bill = require('./bill/bill');

import createOrder from './order/createOrder';
import deleteOrder from './order/deleteOrder';
import getOrderById from './order/getOrderById';
import getOrderByUsername from './order/getOrderByUsername';
import listOrders from './order/listOrders';
import updateOrder from './order/updateOrder';
import Order = require('./order/order');

import createPayment from './payment/createPayment';
import deletePayment from './payment/deletePayment';
import getPaymentById from './payment/getPaymentById';
import getPaymentByUsername from './payment/getPaymentByUsername';
import listPayments from './payment/listPayments';
import updatePayment from './payment/updatePayment';
import Payment = require('./payment/payment');


import createType from './type/createType';
import deleteType from './type/deleteType';
import getTypeById from './type/getTypeById';
import listTypes from './type/listTypes';
import updateType from './type/updateType';
import Type = require('./type/type');

type AppSyncEvent = {
   info: {
     fieldName: string
  },
   arguments: {
     coffeeId: string,
     coffee: Coffee,

     billId: string,
     bill: Bill,

     orderId: string,
     order: Order,

     paymentId: string,
     payment: Payment,

     typeId: string,
     type: Type,

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

exports.handler = async (event:AppSyncEvent, context: any) => {
    console.log(context)
    console.log(event)
    switch (event.info.fieldName) {
        case "getCoffeeById":
            return await getCoffeeById(event.arguments.coffeeId);
        case "createCoffee":
            return await createCoffee(event.arguments.coffee);
        case "listCoffees":
            return await listCoffees();
        case "deleteCoffee":
            return await deleteCoffee(event.arguments.coffeeId);
        case "updateCoffee":
            return await updateCoffee(event.arguments.coffee);
        
        case "getBillById":
            return await getBillById(event.arguments.billId, event.identity.username, event.identity.groups);
        case "getBillByUsername":
            return await getBillByUsername(event.identity.username);
        case "createBill":
            return await createBill(event.arguments.bill, event.identity.username);
        case "listBills":
            return await listBills();
        case "deleteBill":
            return await deleteBill(event.arguments.billId, event.identity.username, event.identity.groups);
        case "updateBill":
            return await updateBill(event.arguments.bill, event.identity.username, event.identity.groups);

        case "getOrderById":
            return await getOrderById(event.arguments.orderId, event.identity.username, event.identity.groups);
        case "getOrderByUsername":
            return await getOrderByUsername(event.identity.username);
        case "createOrder":
            return await createOrder(event.arguments.order, event.identity.username);
        case "listOrders":
            return await listOrders();
        case "deleteOrder":
            return await deleteOrder(event.arguments.orderId, event.identity.username, event.identity.groups);
        case "updateOrder":
            return await updateOrder(event.arguments.order, event.identity.username, event.identity.groups);

        
        case "getPaymentById":
            return await getPaymentById(event.arguments.paymentId, event.identity.username, event.identity.groups);
        case "getPaymentByUsername":
            return await getPaymentByUsername(event.identity.username);   
        case "createPayment":
            return await createPayment(event.arguments.payment, event.identity.username);
        case "listPayments":
            return await listPayments();
        case "deletePayment":
            return await deletePayment(event.arguments.paymentId);
        case "updatePayment":
            return await updatePayment(event.arguments.payment);
        
        case "getTypeById":
            return await getTypeById(event.arguments.typeId);
        case "createType":
            return await createType(event.arguments.type);
        case "listTypes":
            return await listTypes();
        case "deleteType":
            return await deleteType(event.arguments.typeId);
        case "updateType":
            return await updateType(event.arguments.type);

        default:
            return null;
    }
}