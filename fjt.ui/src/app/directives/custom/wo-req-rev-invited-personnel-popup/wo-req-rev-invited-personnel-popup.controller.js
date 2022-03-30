(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('WOReqRevInvitedPersonnelPopupController', WOReqRevInvitedPersonnelPopupController);

  /** @ngInject */
  function WOReqRevInvitedPersonnelPopupController($mdDialog, data, WorkorderReviewFactory, CORE, BaseService, WorkorderFactory,$q) {

    const vm = this;
    vm.woNumber = data.woNumber;
    let woID = data.woID;
    let woRevReqID = data.woRevReqID;
    vm.dateTimeDisplayFormat = _dateTimeDisplayFormat;
    vm.reviewerEmpList = [];
    vm.woAuthorID = data.woAuthorID;
    vm.LabelConstant = CORE.LabelConstant;

    //redirect to work order list
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    }

    //redirect to work order details
    vm.goToWorkorderDetails = () => {
      BaseService.goToWorkorderDetails(woID);
      return false;
    }

    vm.headerdata = [
      {
        label: CORE.LabelConstant.Workorder.WO, value: vm.woNumber,
        displayOrder: 1, labelLinkFn: vm.goToWorkorderList,
        valueLinkFn: vm.goToWorkorderDetails
      }
    ];

    //get co owner employee list
    let getCoOwnerlist = () => {
      return WorkorderFactory.getCoOwnerEmpList().query({ woID: woID }).$promise.then((response) => {
        vm.coOwnerList = [];
        if (response && response.data) {
          response.data.forEach((item) => {
            vm.coOwnerList.push({
              createdAt: item.createdAt,
              employeeID: item.employeeID,
              fullName: stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, item.employee.initialName, item.employee.firstName, item.employee.lastName),
            });
          });
        }
        return response;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    // get all invited employees for defined review request
    let getReqRevInvitedEmpList = () => {
      return WorkorderReviewFactory.getReqRevInvitedEmpList().query({
        woRevReqID: woRevReqID
      }).$promise.then((response) => {
        if (response && response.data) {
          vm.invitedEmpList = [];
          response.data.forEach((item) => {
            vm.invitedEmpList.push({
              createdAt: item.createdAt,
              employeeID: item.employeeID,
              fullName: stringFormat(CORE.GENERIC_DATA_FORMAT.EmployeeManager, item.employee.initialName, item.employee.firstName, item.employee.lastName),
            });
          });
        }
        return response;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    let pageInit = () => {
      var pageInitPromise = [getCoOwnerlist(), getReqRevInvitedEmpList()];
      vm.cgBusyLoading = $q.all(pageInitPromise).then((responses) => {
        // include co-owner in review group member count
        vm.reviewerEmpList = _.unionBy(vm.coOwnerList, vm.invitedEmpList, 'employeeID');
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    if (woRevReqID) {
      pageInit();
    }

    vm.cancel = () => {
      $mdDialog.cancel(null);
    };

  }

})();
