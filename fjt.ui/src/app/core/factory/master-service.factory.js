(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('MasterFactory', ['$resource', 'CORE', MasterFactory]);


    /** @ngInject */
    function MasterFactory($resource, CORE) {
      return {
        getWorkorderByWoOPID: () => $resource(CORE.API_URL + 'workorders/getWorkorderByWoOPID/:woOPID', {
          woOPID: '@_woOPID',
        }, {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
        getWODetails: () => $resource(CORE.API_URL + 'workorders/getWODetails/:woID', {
          woID: '@_woID',
        }, {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
        getAllOperationDetail: () => $resource(CORE.API_URL + 'operation/getAllOperationDetail', null, {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
        getAllWorkOrderDetail: () => $resource(CORE.API_URL + 'workorders/getAllWorkOrderDetail', null, {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
        getWorkorderAuthor: () => $resource(CORE.API_URL + 'workorders/getWorkorderAuthor/:woID', {
          woID: '@_woID'
        }, {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
        getWorkorderOperationDetails: () => $resource(CORE.API_URL + 'workorder_request_for_review/getWorkorderOperationDetails/:woID/:opID', {
          woID: '@_woID',
          opID: '@_opID'
        },
          {
            query: {
              isArray: false,
              method: 'GET'
            }
          }),
        getTerminatedOperationDetail: () => $resource(CORE.API_URL + 'workordertransfer/getTerminatedOperationDetail/:woID', {
          woID: '@_woID'
        },
          {
            query: {
              isArray: false,
              method: 'GET'
            }
          }),
        getUOMsList: () => $resource(CORE.API_URL + 'uoms/getUOMsList/', {
        }, {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
        getFilters: () => $resource(CORE.API_URL + 'rfqLineItemFilter/getRFQFilters/', {
        }, {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
        getWorkorderWithAssyDetails: () => $resource(CORE.API_URL + 'workorders/getWorkorderWithAssyDetails', {
        }, {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
        getAllModuleDynamicMessages: () => $resource(CORE.API_URL + 'alldynamicmessage/getAllModuleDynamicMessages', {
        }, {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
        getPartCategoryMstList: (param) => $resource(CORE.API_URL + 'rfqpartcategory/getPartCategoryMstList', {
        }, {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
        getEpicorTypeList: (param) => $resource(CORE.API_URL + 'rfqpartcategory/getEpicorTypeList', {
        }, {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),

        validateUserPassword: () => $resource(CORE.IDENTITY_URL + 'api/Account/ValidatePassword', {
        }, {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),

        validatePassword: (param) => $resource(CORE.API_URL + 'users/validatePassword', {
        }, {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),

        verifyUser: (param) => $resource(CORE.API_URL + 'users/verifyUser', {
        }, {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
        getRohsList: () => $resource(CORE.API_URL + 'rfqRohs/getRohsList', {
        }, {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
        getComponentMSLList: (param) => $resource(CORE.API_URL + 'componentMSL/getComponentMSLList', {}, {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
        getAssyPartList: () => $resource(CORE.API_URL + 'component/getAssemblyPIDList', {

        },
          {
            query: {
              isArray: false,
              method: 'POST'
            }
          }),

        getQuoteNumberList: () => $resource(CORE.API_URL + 'rfqforms/getQuoteNumberList', {},
          {
            query: {
              isArray: false,
              method: 'POST'
            }
          }),
        getPartList: () => $resource(CORE.API_URL + 'component/getPartList', {},
          {
            query: {
              isArray: false,
              method: 'GET',
            }
          }),
        getComponentInternalVersion: () => $resource(CORE.API_URL + 'component/getComponentInternalVersion/:id', {
          id: '@_id'
        },
          {
            query: {
              isArray: false,
              method: 'GET'
            }
          }),
        getCustomerList: (param) => $resource(CORE.API_URL + 'customers/getCustomerList', {},
          {
            query: {
              isArray: false,
              method: 'GET',
              params: {
                mfgType: CORE.MFG_TYPE.MFG,
                isCustOrDisty: true
              }
            }
          }),
        getCustomerByEmployeeID: (param) => $resource(CORE.API_URL + 'customers/getCustomerByEmployeeID', {},
          {
            query: {
              isArray: false,
              method: 'GET',
              params: {
                mfgType: CORE.MFG_TYPE.MFG,
                isCustOrDisty: true
              }
            }
          }),
        getSupplierList: (param) => $resource(CORE.API_URL + 'supplier/getSupplierList', {},
          {
            query: {
              isArray: false,
              method: 'GET',
              params: {
                mfgType: CORE.MFG_TYPE.DIST,
                isCustOrDisty: true
              }
            }
          }),
        getManufacturerList: (param) => $resource(CORE.API_URL + 'mfgcode/getManufacturerList', {},
          {
            query: {
              isArray: false,
              method: 'GET',
              params: {
                mfgType: CORE.MFG_TYPE.MFG
              }
            }
          }),
        saveManufacturer: (param) => $resource(CORE.API_URL + 'mfgcode/saveManufacturer', {
        }, {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),

        getAssemblyComponentDetailById: (param) => $resource(CORE.API_URL + 'component/getAssemblyComponentDetailById/:id', {
          id: '@_id',
        }, {
          query: {
            isArray: false,
            method: 'GET',

          }
        }),
        getSOAssyPartList: () => $resource(CORE.API_URL + 'salesorder/getSOAssemblyPIDList', {

        },
          {
            query: {
              isArray: false,
              method: 'POST'
            }
          }),
        getComponentCustomer: () => $resource(CORE.API_URL + 'componentcustomerloa/getComponentCustomer/:customerID', {
          customerID: '@_customerID'
        }, {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
        getSupplierScanDocumentSetting: () => $resource(CORE.API_URL + 'supplier/getSupplierScanDocumentSetting/:id', {}, {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
        getActiveScanner: () => $resource(CORE.API_URL + 'scanner/getActiveScanner', {}, {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
        getSelectedGlobalSettingKeyValues: () => $resource(CORE.API_URL + 'settings/getSelectedGlobalSettingKeyValues', {}, {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
        getAcessLeval: (param) => $resource(CORE.API_URL + 'mfgcode/getAcessLeval', {},
          {
            query: {
              isArray: false,
              method: 'GET'
            }
          }),
        checkEmpHasValidStandardsForDoc: (param) => $resource(CORE.API_URL + 'employee_certification/checkEmpHasValidStandardsForDoc', {},
          {
            query: {
              isArray: false,
              method: 'POST'
            }
          }),

        createAuthenticatedApprovalReason: (param) => $resource(CORE.API_URL + 'authenticateReason/createAuthenticatedApprovalReason', {
          objReason: "@_objReason"
        }, {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
        saveAllApprovalReasons: (param) => $resource(CORE.API_URL + 'authenticateReason/saveAllApprovalReasons', {
          objReasonlst: "@_objReasonlst"
        }, {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
        verifyUserForRestrictWithPermissionFeature: (param) => $resource(CORE.API_URL + 'featureUserMapping/verifyUserForRestrictWithPermissionFeature', {
        }, {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
        getUIGridColumnDetail: (param) => $resource(CORE.API_URL + 'configuration/getUIGridColumnDetail', {
          gridId: '@_gridId',
        }, {
          query: {
            isArray: false,
            method: 'GET',
            params: {
              gridId: param ? param.gridId : null
            }
          }
        }),
        saveUIGridColumnDetail: () => $resource(CORE.API_URL + 'configuration/saveUIGridColumnDetail', {},
          {
            query: {
              isArray: false,
              method: 'POST'
            }
          }),
        getAllCategoryDynamicMessages: () => $resource(CORE.API_URL + 'alldynamicmessage/getAllCategoryDynamicMessages', {
        }, {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
        retrieveGenericConfirmation: () => $resource(CORE.API_URL + 'authenticateReason/retrieveGenericConfirmation', {
        }, {
          query: {
            isArray: false,
            method: 'POST'
          }
        }),
        // Get All customer/ Manufacturer / Supplier list.(Contact person Advanced filter.)
        getCustMfrDistList: (param) => $resource(CORE.API_URL + 'mfgcode/getManufacturerList', {},
        {
          query: {
            isArray: false,
            method: 'GET'
          }
        }),
      };
    }
})();
