import createCoffee from './coffee/createCoffee';
import deleteCoffee from './coffee/deleteCoffee';
import getCoffeeById from './coffee/getCoffeeById';
import listCoffees from './coffee/listCoffees';
import updateCoffee from './coffee/updateCoffee';
import Coffee = require('./coffee/coffee');

import createBill from './bill/createBill';
import deleteBill from './bill/deleteBill';
import getBillById from './bill/getBillById';
import listBills from './bill/listBills';
import updateBill from './bill/updateBill';
import Bill = require('./bill/bill');

import createCommand from './command/createCommand';
import deleteCommand from './command/deleteCommand';
import getCommandById from './command/getCommandById';
import listCommands from './command/listCommands';
import updateCommand from './command/updateCommand';
import Command = require('./command/command');

import createPayment from './payment/createPayment';
import deletePayment from './payment/deletePayment';
import getPaymentById from './payment/getPaymentById';
import listPayments from './payment/listPayments';
import updatePayment from './payment/updatePayment';
import Payment = require('./payment/payment');

import createPromoCode from './promo-code/createPromoCode';
import deletePromoCode from './promo-code/deletePromoCode';
import getPromoCodeById from './promo-code/getPromoCodeById';
import listPromoCodes from './promo-code/listPromoCodes';
import updatePromoCode from './promo-code/updatePromoCode';
import PromoCode = require('./promo-code/promo-code');

import createType from './type/createType';
import deleteType from './type/deleteType';
import getTypeById from './type/getTypeById';
import listTypes from './type/listTypes';
import updateType from './type/updateType';
import Type = require('./type/type');
import { Identity } from 'aws-cdk-lib/aws-ses';

type AppSyncEvent = {
   info: {
     fieldName: string
  },
   arguments: {
     coffeeId: string,
     coffee: Coffee,

     billId: string,
     bill: Bill,

     commandId: string,
     command: Command,

     paymentId: string,
     payment: Payment,

     promoCodeId: string,
     promoCode: PromoCode,

     typeId: string,
     type: Type
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
        case "createBill":
            return await createBill(event.arguments.bill, event.identity.username);
        case "listBills":
            return await listBills();
        case "deleteBill":
            return await deleteBill(event.arguments.billId, event.identity.username, event.identity.groups);
        case "updateBill":
            return await updateBill(event.arguments.bill, event.identity.username, event.identity.groups);

        case "getCommandById":
            return await getCommandById(event.arguments.commandId, event.identity.username, event.identity.groups);
        case "createCommand":
            return await createCommand(event.arguments.command, event.identity.username);
        case "listCommands":
            return await listCommands();
        case "deleteCommand":
            return await deleteCommand(event.arguments.commandId, event.identity.username, event.identity.groups);
        case "updateCommand":
            return await updateCommand(event.arguments.command, event.identity.username, event.identity.groups);

        
        case "getPaymentById":
            return await getPaymentById(event.arguments.paymentId, event.identity.username, event.identity.groups);
        case "createPayment":
            return await createPayment(event.arguments.payment, event.identity.username);
        case "listPayments":
            return await listPayments();
        case "deletePayment":
            return await deletePayment(event.arguments.paymentId);
        case "updatePayment":
            return await updatePayment(event.arguments.payment);

        case "getPromoCodeById":
            return await getPromoCodeById(event.arguments.promoCodeId);
        case "createPromoCode":
            return await createPromoCode(event.arguments.promoCode);
        case "listPromoCodes":
            return await listPromoCodes();
        case "deletePromoCode":
            return await deletePromoCode(event.arguments.promoCodeId);
        case "updatePromoCode":
            return await updatePromoCode(event.arguments.promoCode);
        
        
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