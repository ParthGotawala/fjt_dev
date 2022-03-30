(function () {
    'use strict';

    angular
        .module('app.reports.tranwisewodataelement')
        .controller('TranwiseWODataElementMainController', TranwiseWODataElementMainController);

    /** @ngInject */
    function TranwiseWODataElementMainController($timeout, BaseService, CORE, WorkorderDataelementFactory) {
        const vm = this;
        vm.woOPID = null;
        vm.eqpID = null;
        vm.ShowEmptyStateForWOOP = true;
        vm.ShowEmptyStateForWOOPEqp = true;
        vm.allWorkorders = [];
        vm.allWorkorderOperations = [];
        vm.allWorkorderOperationEquipments = [];

        vm.Show = {
            OperationDLReport: true,
            EquipmentDLReport: true,
        }
        var selectedWorkorder;
        var selectedOperation;

        //Get details of site map crumb 
        $timeout(() => {
            vm.crumbs = BaseService.getCrumbs();
        }, _configBreadCrumbTimeout);

        let clearWoOpDETransValuesReportData = () => {
            vm.isNoDataFoundForOpDataelementReport = true;
            vm.isNoDataFoundForEqpDataelementReport = true;

            vm.emptyStateForOpDataelementReport = null;
            vm.emptyStateForEqpDataelementReport = null;

            vm.allWorkorderOperationEquipments = [];
        }

        /*  get all work order to set in autocomplete which contain transaction data element */
        let retrieveAllWorkordersforTransDataElement = () => {
           return WorkorderDataelementFactory.retrieveAllWorkordersforTransDataElement().query().$promise.then((res) => {
                if (res.data && res.data.workorderlist.length > 0) {
                    vm.allWorkorders = res.data.workorderlist;
                }
                else {
                    vm.allWorkorders = [];
                }
                return vm.allWorkorders;
            }).catch((error) => {
                return BaseService.getErrorLog(error);
            });
        }
        retrieveAllWorkordersforTransDataElement();


        /* get all work order operation to set in autocomplete which contain transaction data element */
        let getAllOperationBySelectedWO = (selectedWorkOrder) => {
            selectedWorkorder = selectedWorkOrder;
            if (!selectedWorkOrder || !selectedWorkOrder.woID) {
                clearWoOpDETransValuesReportData();
                vm.autoCompleteOfWorkorder.keyColumnId = null;
                vm.autoCompleteOfWorkorderOperation.keyColumnId = null;
                vm.allWorkorderOperations = [];
                vm.woOPID = null;
                vm.eqpID = null;
                return;
            }
            getallOperation();
        }

        function getallOperation(){
            if(selectedWorkorder.woID){
                return WorkorderDataelementFactory.retrieveAllWorkorderOperationforTransDataElement().query({ woID: selectedWorkorder.woID }).$promise.then((res) => {
                    if (res.data && res.data.workorderOperationlist.length > 0) {
                        vm.allWorkorderOperations = res.data.workorderOperationlist;
                        vm.allWorkorderOperations = _.sortBy(vm.allWorkorderOperations, 'opNumber');
                        _.each(vm.allWorkorderOperations, (item) => {
                            item.opName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, item.opName, item.opNumber);
                        });
                    }
                    else {
                        vm.allWorkorderOperations = [];
                    }
                }).catch((error) => {
                    return BaseService.getErrorLog(error);
                });
            }  
        }

        /* get work order transaction data element values to show */
        let getWoOpDataElementValuesBySelectedWoOp = (selectedWorkOrderOperation) => {
            selectedOperation = selectedWorkOrderOperation;
            if (!selectedWorkOrderOperation || !selectedWorkOrderOperation.woOPID || !vm.autoCompleteOfWorkorder.keyColumnId) {
                clearWoOpDETransValuesReportData();
                vm.autoCompleteOfWorkorderOperation.keyColumnId = null;
                vm.autoCompleteOfWorkorderOperationEquipment.keyColumnId = null;
                vm.Show.OperationDLReport = true;
                vm.Show.EquipmentDLReport = true;
                vm.woOPID = null;
                vm.eqpID = null;
                return;
            }
            getAllEquipment();
            vm.woOPID = selectedWorkOrderOperation.woOPID;
            /* get all operation equipment that used in data-element transaction */
           
        }

        function getAllEquipment(){
            return WorkorderDataelementFactory.retrieveAllWOOPEquipmentforTransDataElement().query({ woID: vm.autoCompleteOfWorkorder.keyColumnId, woOPID: selectedOperation.woOPID })
                              .$promise.then((resOfAllEqp) => {
                                  if (resOfAllEqp.data && resOfAllEqp.data.workorderOperationEquipmentlist.length > 0) {
                                      vm.allWorkorderOperationEquipments = resOfAllEqp.data.workorderOperationEquipmentlist;
                                      _.each(vm.allWorkorderOperationEquipments, (item) => {
                                          let eqpMake = "";
                                          let eqpModel = "";
                                          let eqpYear = "";
                                          eqpMake = item.eqpMake ? '(' + item.eqpMake : '-';
                                          eqpModel = item.eqpModel ? '|' + item.eqpModel : '-';
                                          eqpYear = item.eqpYear ? '|' + item.eqpYear + ')' : '-';
                                          item.eqipmentName = item.assetName + ' ' + eqpMake + eqpModel + eqpYear;
                                      });
                                  }
                                  else {
                                      vm.allWorkorderOperationEquipments = [];
                                  }
                              }).catch((error) => {
                                  return BaseService.getErrorLog(error);
                              });
                        }

        /* get work order transaction equipment data element values to show */
        let getWoOpEqpDataElementValuesBySelectedWoOpEqp = (selectedWorkOrderOperationEquipment) => {
            if (!selectedWorkOrderOperationEquipment || !selectedWorkOrderOperationEquipment.eqpID
                || !vm.autoCompleteOfWorkorderOperation.keyColumnId || !vm.autoCompleteOfWorkorder.keyColumnId) {
                //clearWoOpEqpDETransValuesReportData();
                vm.autoCompleteOfWorkorderOperationEquipment.keyColumnId = null;
                vm.eqpID = null;
                vm.Show.EquipmentDLReport = true;
                return;
            }
            vm.eqpID = selectedWorkOrderOperationEquipment.eqpID;
        }

        vm.autoCompleteOfWorkorder = {
            columnName: 'woNumber',
            keyColumnName: 'woID',
            keyColumnId: null,
            inputName: 'WorkOrder',
            placeholderName: CORE.LabelConstant.Workorder.WO,
            isRequired: false,
            isAddnew: false,
            callbackFn:retrieveAllWorkordersforTransDataElement,
            onSelectCallbackFn: getAllOperationBySelectedWO
        }

        vm.autoCompleteOfWorkorderOperation = {
            columnName: 'opName',
            keyColumnName: 'woOPID',
            keyColumnId: null,
            inputName: 'WorkOrderOperation',
            placeholderName: 'Operation',
            isRequired: false,
            isAddnew: false,
            callbackFn:getallOperation,
            onSelectCallbackFn: getWoOpDataElementValuesBySelectedWoOp
        }

        vm.autoCompleteOfWorkorderOperationEquipment = {
            columnName: 'eqipmentName',
            keyColumnName: 'eqpID',
            keyColumnId: null,
            inputName: 'WorkOrderOperationEquipment',
            placeholderName: 'Equipments',
            isRequired: false,
            isAddnew: false,
            callbackFn:getAllEquipment,
            onSelectCallbackFn: getWoOpEqpDataElementValuesBySelectedWoOpEqp
        }
    }
})();