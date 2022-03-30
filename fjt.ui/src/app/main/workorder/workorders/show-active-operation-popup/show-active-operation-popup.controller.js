(function () {
  'use strict';

  angular
    .module('app.workorder.workorders')
    .controller('ShowActiveOperationPopUpController', ShowActiveOperationPopUpController);

  /** @ngInject */
  function ShowActiveOperationPopUpController( $mdDialog, data, CORE, BaseService) {

    const vm = this;
    vm.data = data;
    vm.data.message = vm.data.messageHeader + vm.data.messageContent;
    vm.headerData = [];

    // go to work order list
    vm.goToWOList = () => {
      BaseService.goToWorkorderList();
      return false;
    }
    //redirect to work order  Detail 
    vm.goToWODetail = () => {
      BaseService.goToWorkorderDetails(data.woID);
      return false;
    }
    // go to employee list
    vm.goToEmpList = () => {
        BaseService.goToPersonnelList();
      return false;
    }
    //redirect to employee  Detail 
    vm.goToEmployeeDetail = () => {
      BaseService.goToManagePersonnel(data.employeeID);
      return false;
    }

    if (vm.data) {
      if (vm.data.woID) {
        vm.headerData.push({
          label: CORE.LabelConstant.Workorder.WO,
          value: data.woNumber,
          displayOrder: (vm.headerData.length + 1),
          labelLinkFn: vm.goToWOList,
          valueLinkFn: vm.goToWODetail
        });
        vm.headerData.push({
          label: CORE.LabelConstant.Workorder.Status,
          value: data.woSubStatus,
          displayOrder: (vm.headerData.length + 1)
        });
      }
      if (vm.data.employeeID) {
        vm.headerData.push({
          label: CORE.LabelConstant.Personnel.PageName,
          value: data.employeeName,
          displayOrder: (vm.headerData.length + 1),
          labelLinkFn: vm.goToEmpList,
          valueLinkFn: vm.goToEmployeeDetail
        })
      }
    }
    
    vm.cancel = () => {
      $mdDialog.cancel();
    };


  }
})();
