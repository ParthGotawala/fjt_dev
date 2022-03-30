(function () {
  'use strict';

  angular
    .module('app.workorder')
    .factory('WorkorderFactory', WorkorderFactory);

  /** @ngInject */
  function WorkorderFactory($resource, CORE, $http) {
    return {
      workorder: (param) => $resource(CORE.API_URL + 'workorders/:id/:isPermanentDelete', {
        id: '@_id',
        isPermanentDelete: '@_isPermanentDelete'
      }, {
        query: {
          isArray: false,
          params: {
            page: param && param.Page ? param.Page : 1,
            pageSize: CORE.UIGrid.ItemsPerPage(),
            order: param && param.SortColumns ? JSON.stringify(param.SortColumns) : null,
            search: param && param.SearchColumns ? JSON.stringify(param.SearchColumns) : null,
            whereStatus: param && param.whereStatus ? param.whereStatus : null,
            SearchColumnName: param && param.SearchColumnName ? param.SearchColumnName : null,
            woID: param && param.woID ? param && param.woID : null,
            wosubstatusIds: param && param.woSubStatusIds ? param.woSubStatusIds : null,
            woTypeIds: param && param.woTypeIds ? param.woTypeIds : null,
            rohsStatusIds: param && param.rohsStatusIds ? param.rohsStatusIds : null,
            assyTypeIds: param && param.assyTypeIds ? param.assyTypeIds : null,
            stdCertificationIds: param && param.stdCertificationIds ? param.stdCertificationIds : null,
            stdclassIds: param && param.stdclassIds ? param.stdclassIds : null,
            isPendingSoMapping: param && param.isPendingSoMapping ? param.isPendingSoMapping : null,
            isPendingkitMapping: param && param.isPendingkitMapping ? param.isPendingkitMapping : null,
            isRunningwo: param && param.isRunningwo ? param.isRunningwo : null,
            isTrackBySerialNumber: param && param.isTrackBySerialNumber ? param.isTrackBySerialNumber : null,
            isrushJob: param && param.isrushJob ? param.isrushJob : null,
            isstoppedWo: param && param.isstoppedWo ? param.isstoppedWo : null,
            isnewWo: param && param.isnewWo ? param.isnewWo : param && param.isnewWo === false ? false : null,
            iswaterSoluable: param && param.iswaterSoluable ? param.iswaterSoluable : param && param.iswaterSoluable === false ? false : null,
            isecodfm: param && param.isecodfm ? param.isecodfm : null,
            isOpenWo: param && param.isOpenWo ? param.isOpenWo : param && param.isOpenWo === false ? false : null,
            customerIds: param && param.customerIds ? param.customerIds : null,
            assyNicknameIds: param && param.assyNicknameIds ? param.assyNicknameIds : null,
            assyIds: param && param.assyIds ? param.assyIds : null,
            salesOrderdetails: param && param.salesOrderdetails ? param.salesOrderdetails : null,
            operationIds: param && param.operationIds ? param.operationIds : null,
            employeeIds: param && param.employeeIds ? param.employeeIds : null,
            equipmentIds: param && param.equipmentIds ? param.equipmentIds : null,
            materialIds: param && param.materialIds ? param.materialIds : null,
            umidIds: param && param.umidIds ? param.umidIds : null
          }
        },
        update: {
          method: 'PUT'
        }
      }),
      retriveWorkorderlist: () => $resource(CORE.API_URL + 'workorders/retriveWorkorderlist', {}, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      createWorkorder_CertificateList: () => $resource(CORE.API_URL + 'workorder_certification/createWorkorder_CertificateList', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      addWorkorder: () => $resource(CORE.API_URL + 'workorders/addWorkorder', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      stopWorkorder: () => $resource(CORE.API_URL + 'workorders/stopWorkorder', {
        obj: '@_obj'
      }, {
        update: {
          method: 'POST',
          isArray: false
        }
      }),
      verifyWorkorder: () => $resource(CORE.API_URL + 'workorders/verifyWorkorder', {
        obj: '@_obj'
      }, {
        update: {
          method: 'POST',
          isArray: false
        }
      }),
      convertToMasterTemplate: () => $resource(CORE.API_URL + 'workorders/convertToMasterTemplate', {
        obj: '@_obj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      inviteEmployeeForWorkorderReview: () => $resource(CORE.API_URL + 'workorder_ReqRev_Invited_Emp/inviteEmployeeForWorkorderReview', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getInvitedEmployeeForWorkorderReview: () => $resource(CORE.API_URL + 'workorder_ReqRev_Invited_Emp/getInvitedEmployeeForWorkorderReview', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getDefaultWORevReqForReview: () => $resource(CORE.API_URL + 'workorder_request_for_review/getDefaultWORevReqForReview/:woID/:empID/:woRevReqID', {
        woID: '@_woID',
        woRevReqID: '@_woRevReqID',
        empID: '@_empID'
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      getWorkorder_profile: () => $resource(CORE.API_URL + 'workorders/workorder_profile/:woID', {
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      getWorkorderOperationList: () => $resource(CORE.API_URL + 'workorders/getWorkorderOperationList/:woID', {
        woID: '@_woID'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      getWorkOrderListByAssyID: () => $resource(CORE.API_URL + 'workorders/getWorkOrderListByAssyID/:assyID', {
        assyID: '@_assyID'
      }, {
        query: {
          isArray: false,
          method: 'GET'
        }
      }),
      getAssemblyStockDetailsByAssyID: () => $resource(CORE.API_URL + 'workorders/getAssemblyStockDetailsByAssyID', {
        listObj: '@_listObj'
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getIdlePOQtyByAssyID: () => $resource(CORE.API_URL + 'workorders/getIdlePOQtyByAssyID', {
        listObj: '@_listObj'
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      deleteWorkorder: () => $resource(CORE.API_URL + 'workorders/deleteWorkorder', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      printWoOPDetail: () => $resource(CORE.API_URL + 'workorders/printWoOPDetail', {
        obj: '@_obj'
      }, {
        update: {
          method: 'POST',
          isArray: false
        }
      }),
      getMaxWorkorderNumberByAssyID: () => $resource(CORE.API_URL + 'workorders/getMaxWorkorderNumberByAssyID', {
        obj: '@_obj'
      }, {
        update: {
          method: 'POST',
          isArray: false
        }
      }),
      validateAssemblyByAssyID: () => $resource(CORE.API_URL + 'workorders/validateAssemblyByAssyID', {
        obj: '@_obj'
      }, {
        update: {
          method: 'POST',
          isArray: false
        }
      }),
      getWorkorderHaltResumeReasonList: () => $resource(CORE.API_URL + 'workorders/getWorkorderHaltResumeReasonList', {
        obj: '@_obj'
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getWorkOrderListWithDetail: () => $resource(CORE.API_URL + 'workorders/getWorkOrderListWithDetail', {
        searchWo: '@_searchObj'
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      getWorkorderHeaderDisplayDetails: () => $resource(CORE.API_URL + 'workorders/getWorkorderHeaderDisplayDetails', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAllLocationDetailsOfSample: () => $resource(CORE.API_URL + 'workorders/getAllLocationDetailsOfSample', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAllWORFQContainSamePartID: () => $resource(CORE.API_URL + 'workorders/getAllWORFQContainSamePartID', {
        workorderObj: '@_workorderObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retrieveWorkorderEntityDataElements: () => $resource(CORE.API_URL + 'workorders/retrieveWorkorderEntityDataElements', {
        workorderObj: '@_workorderObj'
      }, {
        query: {
          isArray: false,
          method: 'POST'
        }
      }),
      createWorkorderDataElements: () => $resource(CORE.API_URL + 'workorders/createWorkorderDataElements', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      deleteWorkorderDataElements: () => $resource(CORE.API_URL + 'workorders/deleteWorkorderDataElements', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      retrieveWorkorderDataElementList: () => $resource(CORE.API_URL + 'workorders/retrieveWorkorderDataElementList/:woID', {
        woID: '@_woID'
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      getWorkOrderNumbers: () => $resource(CORE.API_URL + 'workorders/getWorkOrderNumbers', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getPrevWoListForCustomerAssy: () => $resource(CORE.API_URL + 'workorders/getPrevWoListForCustomerAssy', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getTempratureSensitiveComponentListByWoID: () => $resource(CORE.API_URL + 'workorders/getTempratureSensitiveComponentListByWoID', {
        listObj: '@_listObj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getWOHeaderAllIconList: () => $resource(CORE.API_URL + 'workorders/getWOHeaderAllIconList', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getCoOwnerEmpList: () => $resource(CORE.API_URL + 'workorder_ReqRev_Invited_Emp/getCoOwnerEmpList/:woID', {
        woID: '@_woID'
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      }),
      saveCoOwnerEmployeeDetail: () => $resource(CORE.API_URL + 'workorder_ReqRev_Invited_Emp/saveCoOwnerEmployeeDetail', {
        objCoOwner: '@_objCoOwner'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAllWOForSearchAutoComplete: () => $resource(CORE.API_URL + 'workorders/getAllWOForSearchAutoComplete', {

      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAllActiveWorkorderForCopyFolderDoc: () => $resource(CORE.API_URL + 'workorders/getAllActiveWorkorderForCopyFolderDoc', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      copyAllFolderDocToActiveWorkorder: () => $resource(CORE.API_URL + 'workorders/copyAllFolderDocToActiveWorkorder', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      copyAllDuplicateDocToWOOPBasedOnConfirmation: () => $resource(CORE.API_URL + 'workorders/copyAllDuplicateDocToWOOPBasedOnConfirmation', {
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getSoPoFilterList: () => $resource(CORE.API_URL + 'workorders/getSoPoFilterList', {
        obj: '@_obj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAssyIdFilterList: () => $resource(CORE.API_URL + 'workorders/getAssyIdFilterList', {
        obj: '@_obj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getNickNameFilterList: () => $resource(CORE.API_URL + 'workorders/getNickNameFilterList', {
        obj: '@_obj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getOperationFilterList: () => $resource(CORE.API_URL + 'workorders/getOperationFilterList', {
        obj: '@_obj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),

      getEmployeeFilterList: () => $resource(CORE.API_URL + 'workorders/getEmployeeFilterList', {
        obj: '@_obj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getEquipmentFilterList: () => $resource(CORE.API_URL + 'workorders/getEquipmentFilterList', {
        obj: '@_obj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getMaterialSupplierFilterList: () => $resource(CORE.API_URL + 'workorders/getMaterialSupplierFilterList', {
        obj: '@_obj'
      }, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      checkDateCodeOnPublishWO: (param) => $resource(CORE.API_URL + 'workorders/checkDateCodeOnPublishWO', {}, {
        query: {
          isArray: false,
          params: {
            woID: param && param.woID ? param.woID : null
          }
        }
      }),
      getAssemblyStockPODetailsByAssyID: () => $resource(CORE.API_URL + 'workorders/getAssemblyStockPODetailsByAssyID', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAssemblyStockWODetailsByAssyID: () => $resource(CORE.API_URL + 'workorders/getAssemblyStockWODetailsByAssyID', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      getAssemblyStockSummaryByAssyID: () => $resource(CORE.API_URL + 'workorders/getAssemblyStockSummaryByAssyID', {}, {
        query: {
          method: 'POST',
          isArray: false
        }
      }),
      //AddedImagesIntoPDF: () => $http.post(CORE.API_URL + 'workorders/AddedImagesIntoPDF', {},
      //  { responseType: 'arraybuffer' }).then((response) => response, (error) => error),

      getWorkorderUsageMaterial: (obj) => $http.post(CORE.API_URL + 'workorders/getWorkorderUsageMaterial/:obj', obj,
        { responseType: 'arraybuffer' }).then((response) => response, (error) => error)

    };
  }
})();
