
import createPayment from './createPayment';
import deletePayment from './deletePayment';
import getPaymentById from './getPaymentById';
import getPaymentByUsername from './getPaymentByUsername';
import listPayments from './listPayments';
import updatePayment from './updatePayment';
import Payment = require('./payment');


type AppSyncEvent = {
   info: {
     fieldName: string
  },
   arguments: {

     paymentId: string,
     payment: Payment,


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
        
        case "getPaymentById":
            return await getPaymentById(event.arguments.paymentId, event.identity.username, event.identity.groups);
        case "getPaymentByUsername":
            return await getPaymentByUsername(event.identity.username, callback);   
        case "createPayment":
            return await createPayment(event.arguments.payment, event.identity.username, callback);
        case "listPayments":
            return await listPayments();
        case "deletePayment":
            return await deletePayment(event.arguments.paymentId, callback);
        case "updatePayment":
            return await updatePayment(event.arguments.payment, callback);

        default:
            return null;
    }
}