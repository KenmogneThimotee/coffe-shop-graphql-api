
import createType from './createType';
import deleteType from './deleteType';
import getTypeById from './getTypeById';
import listTypes from './listTypes';
import updateType from './updateType';
import Type = require('./type');

type AppSyncEvent = {
   info: {
     fieldName: string
  },
   arguments: {
       
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

exports.handler = async (event:AppSyncEvent, context: any, callback: any) => {
    console.log(context)
    console.log(event)
    switch (event.info.fieldName) {
        case "getTypeById":
            return await getTypeById(event.arguments.typeId);
        case "createType":
            return await createType(event.arguments.type, callback);
        case "listTypes":
            return await listTypes();
        case "deleteType":
            return await deleteType(event.arguments.typeId, callback);
        case "updateType":
            return await updateType(event.arguments.type, callback);

        default:
            return null;
    }
}