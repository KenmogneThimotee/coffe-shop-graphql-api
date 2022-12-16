
import createBill from './createBill';
import deleteBill from './deleteBill';
import getBillById from './getBillById';
import getBillByUsername from './getBillByUsername';
import listBills from './listBills';
import updateBill from './updateBill';
import Bill = require('./bill');


type AppSyncEvent = {
   info: {
     fieldName: string
  },
   arguments: {
     billId: string,
     bill: Bill,

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
        case "getBillById":
            return await getBillById(event.arguments.billId, event.identity.username, event.identity.groups);
        case "getBillByUsername":
            return await getBillByUsername(event.identity.username);
        case "createBill":
            return await createBill(event.arguments.bill, event.identity.username, callback);
        case "listBills":
            return await listBills();
        case "deleteBill":
            return await deleteBill(event.arguments.billId, event.identity.username, event.identity.groups, callback);
        case "updateBill":
            return await updateBill(event.arguments.bill, event.identity.username, event.identity.groups, callback);

        default:
            return null;
    }
}