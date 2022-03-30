(function () {
  'use strict';

  angular
    .module('app.admin.dynamicmessage')
    .factory('DynamicMessageFactory', DynamicMessageFactory);

  /** @ngInject */
  function DynamicMessageFactory($resource, CORE) {
    return {
      dynamicmessage: (param) => $resource(CORE.API_URL + 'dynamicmessage', {

      }, {
        query: {
          isArray: false,
          //params: {
          //    page: param && param.Page ? param.Page : 1,
          //    pageSize: CORE.UIGrid.ItemsPerPage(),
          //    order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
          //    search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null,
          //}
        },
        update: {
          method: 'PUT',
        },
      }),

      getDefaultMessageByKeyAndModuelName: () => $resource(CORE.API_URL + 'dynamicmessage/getDefaultMessageByKeyAndModuelName', {
        objMessageData: '@_objMessageData',
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      timelinedynamicmessages: (param) => $resource(CORE.API_URL + 'dynamicmessage/getEmpTimelineDynamicMessage', {

      }, {
        query: {
          isArray: false,
        },
        update: {
          method: 'PUT',
        },
      }),
      getDefaultMessageForEmpTimelineMessage: () => $resource(CORE.API_URL + 'dynamicmessage/getDefaultMessageForEmpTimelineMessage', {
        objMessageData: '@_objMessageData',
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getDynamicMessageListDB: (param) => $resource(CORE.API_URL + 'dynamicmessage/getDynamicMessagesListDB', {},
        {

          query: {
            method: 'GET',
            isArray: false,
            params: {
              page: param && param.Page ? param.Page : 1,
              pageSize: param && param.pageSize ? param.pageSize : CORE.UIGrid.ItemsPerPage(),
              order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
              search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null,
            }

          }
        }),

      getDynamiceMessageDBByKey: (ObjId) => $resource(CORE.API_URL + 'dynamicmessage/getDynamiceMessageDB/:ObjId', { ObjId: '@_ObjId' },
        {
          query: {
            method: 'GET',
            isArray: false
          }
        }),

      updateDynamicMessageDB: (data) => $resource(CORE.API_URL + 'dynamicmessage/updateDynamicMessageDB',
        {},
        {
          query: {
            method: 'POST',
            isArray: false
          }
        }),

      getMessageHistoryByKey: (ObjId) => $resource(CORE.API_URL + 'dynamicmessage/getMessageHistoryByKey/:ObjId', { ObjId: '@_ObjId' },
        {
          query: {
            method: 'GET',
            isArray: false,
          }
        }),

      generateJSonFromMongoDB: (data) => $resource(CORE.API_URL + 'dynamicmessage/generateJSonFromMongoDB', {},
        {
          query: {
            method: 'GET',
            isArray: false,
            params: {
              callFromDbScript: data.callFromDbScript ? data.callFromDbScript : false
            }
          }
        }),
      //For edit popup of message usage by message code and page id
      getWhereUsedListByKey: (data) => $resource(CORE.API_URL + 'dynamicmessage/getWhereUsedListByKey', {},
        {
          query: {
            method: 'GET',
            isArray: false,
            params: {
              message_Id: data.id,
              pageId: data.pageId
            }
          }
        }),
      //For list of message usage by message id 
      getWhereUsedListByMessageId: (param) => $resource(CORE.API_URL + 'dynamicmessage/getWhereUsedListByMessageId', {},
        {
          query: {
            method: 'GET',
            isArray: false,
            params: {
              page: param && param.Page ? param.Page : 1,
              pageSize: param && param.pageSize ? param.pageSize : CORE.UIGrid.ItemsPerPage(),
              order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
              search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null,
              ObjId: param && param.ObjId ? param.ObjId : null
            }
          }
        }),

      addWhereUsedData: (data) => $resource(CORE.API_URL + 'dynamicmessage/addWhereUsedData',
        {},
        {
          query: {
            method: 'POST',
            isArray: false
          }
        }),

      updateWhereUsedData: (data) => $resource(CORE.API_URL + 'dynamicmessage/updateWhereUsedData',
        {},
        {
          query: {
            method: 'POST',
            isArray: false
          }
        }),

      deleteWhereUsedData: (data) => $resource(CORE.API_URL + 'dynamicmessage/deleteWhereUsedData',
        {},
        {
          query: {
            method: 'POST',
            isArray: false
          }
        }),


    }
  }
})();
