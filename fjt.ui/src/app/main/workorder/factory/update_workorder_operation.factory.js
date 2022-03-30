(function () {
  'use strict';

  angular
    .module('app.workorder')
    .factory('WorkorderOperationFactory', WorkorderOperationFactory);

  /** @ngInject */
  function WorkorderOperationFactory($resource, CORE) {
    return {
      getOperationDet: () => $resource(CORE.API_URL + 'workorderoperation/detail/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false
        }
      }),
      updateOperation: () => $resource(CORE.API_URL + 'workorderoperation/update/:id', {
        id: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      }),
      stopWOOperation: () => $resource(CORE.API_URL + 'workorderoperation/stopWOOperation/:id', {
        id: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      }),
      retrieveOperationEntityDataElements: () => $resource(CORE.API_URL + 'workorderoperation/retrieveOperationEntityDataElements', {
        operationObj: '@_operationObj'
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      createWorkorderOperationDataElements: () => $resource(CORE.API_URL + 'workorderoperation/createWorkorderOperationDataElements', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retrievePartOperationDetails: () => $resource(CORE.API_URL + 'workorderoperation/retrievePartOperationDetails', {
        operationObj: '@_operationObj'
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      retrieveNotAddedPartsForWoOp: (param) => $resource(CORE.API_URL + 'workorderoperation/retrieveNotAddedPartsForWoOp/:woOPID', {
        id: '@_woOPID'
      },
        {
          query: {
            isArray: false,
            method: 'GET',
            params: {
              page: param && param.Page ? param.Page : 1,
              pageSize: CORE.LoadItemsPerPage.Drag_Drop,
              order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
              search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null,
              searchTextOfNoAddedPart: param && param.searchTextOfNoAddedPart ? JSON.stringify(param.searchTextOfNoAddedPart) : null,
              partID: param && param.partID ? JSON.stringify(param.partID) : null
            }
          }
        }),
      retrieveAddedPartsForWoOp: () => $resource(CORE.API_URL + 'workorderoperation/retrieveAddedPartsForWoOp', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      createWorkorderOperationParts: () => $resource(CORE.API_URL + 'workorderoperation/createWorkorderOperationParts', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retrieveEquipmentOperationDetails: () => $resource(CORE.API_URL + 'workorderoperation/retrieveEquipmentOperationDetails', {
        operationObj: '@_operationObj'
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      createWorkorderOperationEquipments: () => $resource(CORE.API_URL + 'workorderoperation/createWorkorderOperationEquipments', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retrieveEmployeeOperationDetails: () => $resource(CORE.API_URL + 'workorderoperation/retrieveEmployeeOperationDetails', {
        operationObj: '@_operationObj'
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      createWorkorderOperationEmployees: () => $resource(CORE.API_URL + 'workorderoperation/createWorkorderOperationEmployees', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteWorkorderOperationDataElements: () => $resource(CORE.API_URL + 'workorder_operation_dataelement/deleteWorkorderOperationDataElements', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retriveOPListbyWoID: () => $resource(CORE.API_URL + 'workorderoperation/retriveOPListbyWoID/:woID', {
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      retriveOPListWithTransbyWoID: () => $resource(CORE.API_URL + 'workorderoperation/retriveOPListWithTransbyWoID/:woID', {
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      saveWorkorderOperationDataelement_Role: () => $resource(CORE.API_URL + 'workorder_operation_dataelement_role/saveWorkorderOperationDataelement_Role', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getRolesListBywoOpDataelementWise: () => $resource(CORE.API_URL + 'workorder_operation_dataelement_role/getRolesListBywoOpDataelementWise/:woOpDataElementID', {
        woOpDataElementID: '@_woOpDataElementID'
      }, {
        query: {
          isArray: false
        }
      }),
      getwoOpDataelementListRoleWise: () => $resource(CORE.API_URL + 'workorder_operation_dataelement_role/getwoOpDataelementListRoleWise/:roleID', {
        roleID: '@_roleID'
      }, {
        query: {
          isArray: false
        }
      }),
      deleteWoOpdataElmentRoles: () => $resource(CORE.API_URL + 'workorder_operation_dataelement_role/deleteWoOpdataElmentRoles', {
        woOpDataElementID: '@_woOpDataElementID'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAllwoOpDataElementRoleData: () => $resource(CORE.API_URL + 'workorder_operation_dataelement_role/getAllwoOpDataElementRoleData', {
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      changeEquipmentStatusDetails: () => $resource(CORE.API_URL + 'workorderoperation/changeEquipmentStatusDetails', {
        operationObj: '@_operationObj'
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),

      getPreviousWorkOrderOperationDetails: () => $resource(CORE.API_URL + 'workorderoperation/getPreviousWorkOrderOperationDetails', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      workorderOperationConfigurationList: () => $resource(CORE.API_URL + 'workorderoperation/workorderOperationConfigurationList', {
        woID: '@_woID'
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getWOOPFieldDetailsByFieldName: () => $resource(CORE.API_URL + 'workorderoperation/getWOOPFieldDetailsByFieldName', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      retriveWorkOrderOperaionRefDesigList: () => $resource(CORE.API_URL + 'workorderoperation/retriveWorkOrderOperaionRefDesigList', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getRFQLineItemsByIDWithSubAssembly: () => $resource(CORE.API_URL + 'workorderoperation/getRFQLineItemsByIDWithSubAssembly', {
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      })
    };
  }
})();
