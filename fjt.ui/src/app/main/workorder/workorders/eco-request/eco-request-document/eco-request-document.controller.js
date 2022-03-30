(function () {
    'use strict';

    angular
        .module('app.workorder.workorders')
        .controller('ECORequestDocumentController', ECORequestDocumentController);


    /** @ngInject */
    function ECORequestDocumentController($scope, $mdDialog, $state, $stateParams, $filter, $q, USER, CORE, DASHBOARD, REPORTS, DialogFactory,
        DepartmentFactory, EmployeeFactory, ECORequestFactory, WorkorderFactory, BaseService, MasterFactory, $timeout, WORKORDER, WorkorderOperationFactory) {  // eslint-disable-line func-names
        const vm = this;
        vm.requestType = WORKORDER.ECO_REQUEST_TYPE;
        vm.employeeDetails = BaseService.loginUser.employee;
        
        if (!vm.employeeDetails) {
            $state.go(DASHBOARD.DASHBOARD_STATE);
            DialogFactory.alertDialog({ title: CORE.MESSAGE_CONSTANT.ALERT_HEADER, textContent: CORE.MESSAGE_CONSTANT.USER_EMPLOYEE_DETAIL, multiple: true });
            return;
        }

        var loginUserFullName = vm.employeeDetails.firstName + ' ' + vm.employeeDetails.lastName;
        vm.woID = $stateParams.woID;
        var ecoReqID = $stateParams.ecoReqID;
        vm.id = ecoReqID;
        vm.entity = CORE.AllEntityIDS.ECORequest.Name;
        vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;

        vm.ecoRequestModel = {
            ecoReqID: ecoReqID,
            woID: vm.woID,
        };
        if ($stateParams.requestType) {
            switch ($stateParams.requestType) {
                case vm.requestType.ECO.Name:
                    vm.ecoRequestModel.requestType = vm.requestType.ECO.Value;
                    break;
                case vm.requestType.DFM.Name:
                    vm.ecoRequestModel.requestType = vm.requestType.DFM.Value;
                    break;
            }
        }

      // get work order details
      const getWorkorderBasicDetails = () => {
        vm.headerdata = [];
        return MasterFactory.getWODetails().query({ woID: vm.woID }).$promise.then((response) => {
          if (response && response.data) {
            vm.workOrderDet = response.data;
            vm.isWoInSpecificStatusNotAllowedToChange = (vm.workOrderDet.woStatus === CORE.WOSTATUS.TERMINATED || vm.workOrderDet.woStatus === CORE.WOSTATUS.COMPLETED || vm.workOrderDet.woStatus === CORE.WOSTATUS.VOID) ? true : false;
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      };
      if (vm.woID) {
        getWorkorderBasicDetails();
      }

    }
})();
