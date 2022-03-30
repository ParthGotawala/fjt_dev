(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('activeOperationList', activeOperationList);

  /** @ngInject */
  function activeOperationList() {
    var directive = {
      restrict: 'E',
      scope: {
        employeeId: '=',
        operationTitle: '=?'
      },
      templateUrl: 'app/directives/custom/active-operation-list/active-operation-list.html',
      controller: activeOperationListCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function activeOperationListCtrl($scope, $q, $filter, BaseService, TravelersFactory, CORE, TRAVELER) {
      var vm = this;
      let employeeId = $scope.employeeId;
      vm.LabelConstant = CORE.LabelConstant;
      vm.DateTimeFormat = _dateTimeDisplayFormat;
      vm.woActiveOpeationMessage = stringFormat(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.START_ACTIVITY_PAUSE_OTHER_OPERATION.message, $scope.operationTitle);
      vm.noOperationRunning = stringFormat(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.WO_OP_RESUME_ACTIVITY_CONFIRM.message, ($scope.operationTitle ? $scope.operationTitle.toLowerCase() : ""));
      vm.selectedItems = [];


      /*
       * Author :  Vaibhav Shah
       * Purpose : Go to Work Order List
       */
      vm.goToWorkorderList = () => {
        BaseService.goToWorkorderList();
        return false;
      }

      /*
      * Author :  Vaibhav Shah
      * Purpose : Go to Work Order Details page
      */
      vm.goToWorkorderDetails = (woID) => {
        BaseService.goToWorkorderDetails(woID);
        return false;
      }

      /*Move to Work Order operation detail page*/
      vm.goToWorkorderOperationDetails = (woOPID) => {
        BaseService.goToWorkorderOperationDetails(woOPID);
      }


      //Get Active Operation List of Employee
      let getActiveOperationListOfEmployee = () => {
        let _objList = {};
        _objList.employeeID = employeeId;
        return TravelersFactory.getActiveOperationListByEmployeeID().query({
          listObj: _objList
        }).$promise.then((response) => {
          return response.data;
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      var cgPromise = [getActiveOperationListOfEmployee()];
      vm.cgBusyLoading = $q.all(cgPromise).then((responses) => {
        _.each(responses[0].activeOperationList, (item) => {
          item.opFullName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, item.opName, item.opNumber);
          item.checkinTime = $filter('date')(item.checkinTime, vm.DateTimeFormat);
          item.isTeamOperation = item.isTeamOperation ? "Yes" : "No";
          item.isClusterApplied = item.isParellelOperation != null ? "Yes" : "No";
          item.isParellelOperation = item.isClusterApplied == "Yes" ? (item.isParellelOperation ? "Yes" : "No") : "-";
        });
        vm.ActiveOperationList = responses[0].activeOperationList;
      });
    }
  }
})();
