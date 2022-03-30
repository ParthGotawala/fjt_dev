(function () {
  'use strict';

  angular
    .module('app.operation')
    .factory('OperationFactory', OperationFactory);

  /** @ngInject */
  function OperationFactory($resource, CORE) {
    return {
      operation: () => $resource(CORE.API_URL + 'operation/:id/:isPermanentDelete', {
        id: '@_id',
        isPermanentDelete: '@_isPermanentDelete'
      }, {
        query: {
          isArray: false
        },
        update: {
          method: 'PUT'
        }
      }),
      retriveOperationList: () => $resource(CORE.API_URL + 'operation/retriveOperationList', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      mastertemplate: () => $resource(CORE.API_URL + 'mastertemplate/:id', {
        id: '@_id'
      }, {
        query: {
          isArray: false
        },
        update: {
          method: 'PUT'
        }
      }),
      retriveMastertemplateList: () => $resource(CORE.API_URL + 'mastertemplate/retriveMasterTemplateList', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retrieveOperationMasterTemplate: () => $resource(CORE.API_URL + 'mastertemplate/retrieveOperationMasterTemplate/:id', {
        id: '@_id'
      },
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      createOperation_MasterTemplateList: () => $resource(CORE.API_URL + 'mastertemplate/createOperation_MasterTemplateList', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retrieveOperationEntityDataElements: () => $resource(CORE.API_URL + 'operation_dataelement/retrieveOperationEntityDataElements', {
        operationObj: '@_operationObj'
      },
        {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
      retrieveEmployeeOperationDetails: () => $resource(CORE.API_URL + 'operation_employee/retrieveEmployeeOperationDetails/:id', {
        id: '@_id'
      },
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      createOperation_EmployeeList: () => $resource(CORE.API_URL + 'operation_employee/createOperation_EmployeeList', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retrieveEquipmentOperationDetails: () => $resource(CORE.API_URL + 'operation_equipment/retrieveEquipmentOperationDetails/:id', {
        id: '@_id'
      },
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      createOperation_EquipmentList: () => $resource(CORE.API_URL + 'operation_equipment/createOperation_EquipmentList', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getMasterTemplateList: () => $resource(CORE.API_URL + 'mastertemplate/getMasterTemplateList', {},
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      getMasterTemplateOperationList: () => $resource(CORE.API_URL + 'mastertemplate/getMasterTemplateOperationList/:id', {
        id: '@_id'
      },
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      getOperationList: () => $resource(CORE.API_URL + 'operation/getOperationList', {},
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),

      retrieveOperationProfile: () => $resource(CORE.API_URL + 'operation/retrieveOperationProfile/:id', {
        id: '@_id'
      },
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),

      //retrievePartOperationDetails: () => $resource(CORE.API_URL + 'operation_part/retrievePartOperationDetails/:id', {
      //    id: '@_id',
      //},
      //{
      //    query: {
      //        isArray: false,
      //        method: 'GET',
      //    }
      //}),
      retrievePartsForOpMaster: (param) => $resource(CORE.API_URL + 'operation_part/retrievePartsForOpMaster/:opID', {
        id: '@_opID'
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
              searchTextOfNoAddedPart: param && param.searchTextOfNoAddedPart ? JSON.stringify(param.searchTextOfNoAddedPart) : null
            }
          }
        }),
      retrieveOperationPartDetails: () => $resource(CORE.API_URL + 'operation_part/retrieveOperationPartDetails', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retrievetemplateOperationDetails: () => $resource(CORE.API_URL + 'operation/retrievetemplateOperationDetails', {},
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      createOperation_PartList: () => $resource(CORE.API_URL + 'operation_part/createOperation_PartList', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteOperation_PartList: () => $resource(CORE.API_URL + 'Operation_Part/deleteOperation_PartList', {
        listObj: '@_listObj'
      }, {
        query: {
          isArray: false
        }
      }),
      deleteOperation_EquipmentList: () => $resource(CORE.API_URL + 'Operation_Equipment/deleteOperation_EquipmentList', {
        listObj: '@_listObj'
      }, {
        query: {
          isArray: false
        }
      }),

      deleteOperation_EmployeeList: () => $resource(CORE.API_URL + 'Operation_Employee/deleteOperation_EmployeeList', {
        listObj: '@_listObj'
      }, {
        query: {
          isArray: false
        }
      }),

      deleteOperation_MasterTemplateList: () => $resource(CORE.API_URL + 'mastertemplate/deleteOperation_MasterTemplateList', {
        listObj: '@_listObj'
      }, {
        query: {
          isArray: false
        }
      }),

      deleteOperation: () => $resource(CORE.API_URL + 'operation/deleteOperation', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteMasterTemplate: () => $resource(CORE.API_URL + 'mastertemplate/deleteMasterTemplate', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      copyMasterTemplate: () => $resource(CORE.API_URL + 'mastertemplate/copyMasterTemplate', {
        objCopyMasterTemplate: '@_objCopyMasterTemplate'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      checkDuplicateOpNumber: () => $resource(CORE.API_URL + 'operation/checkDuplicateOpNumber', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      checkDublicateMasterTemplate: () => $resource(CORE.API_URL + 'mastertemplate/checkDublicateMasterTemplate', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retrieveNotAddedEmployeeListForOp: () => $resource(CORE.API_URL + 'Operation_Employee/retrieveNotAddedEmployeeListForOp', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retrieveAddedEmployeeListForOp: () => $resource(CORE.API_URL + 'Operation_Employee/retrieveAddedEmployeeListForOp', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      saveMasterTemplateStatus: () => $resource(CORE.API_URL + 'mastertemplate/saveMasterTemplateStatus', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getMasterTemplateListByTemplateStatus: () => $resource(CORE.API_URL + 'mastertemplate/getMasterTemplateListByTemplateStatus', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAllPublishedOpMasterList: () => $resource(CORE.API_URL + 'operation/getAllPublishedOpMasterList', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retriveDraftOperationsByMasterTemplate: () => $resource(CORE.API_URL + 'operation/retriveDraftOperationsByMasterTemplate', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      })
    };
  }
})();
