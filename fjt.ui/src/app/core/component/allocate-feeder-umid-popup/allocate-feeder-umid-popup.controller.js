(function () {
  'use strict';
  angular
    .module('app.core')
    .controller('AllocateFeederUMIDPopupController', AllocateFeederUMIDPopupController);
  /** @ngInject */
  function AllocateFeederUMIDPopupController($mdDialog, data, CORE, USER, BaseService, WorkorderTransactionUMIDFactory, DialogFactory) {
    const vm = this;
    vm.verificationType = CORE.VerificationType;
    vm.LabelConstant = CORE.LabelConstant;
    vm.allocateUMID = data || {};
    vm.cancel = () => {
      $mdDialog.cancel();
    };

    // feeder first - validation
    vm.validateFeederDetails = () => {
      let feederObj = {
        feederLocation: vm.allocateUMID.feederLocation || null,
        UMID: null,
        partID: vm.allocateUMID.partID || null,
        woOpEqpID: vm.allocateUMID.woOpEqpID || null,
        woOPID: vm.allocateUMID.woOPID || null,
        woTransID: vm.allocateUMID.woTransID || null,
        employeeId: vm.allocateUMID.employeeId || null,
        checkKitAllocation: false,
        verificationType: vm.verificationType.FeederFirst,
        isVerify: false,
        isConfirmed:  false,
        woID: vm.allocateUMID.woID,
        transactionType: CORE.TransactionType.Feeder,
        authenticationApprovedDet: null
      };
      vm.cgBusyLoading = WorkorderTransactionUMIDFactory.validateScanFeederFirst().query({ feederObj: feederObj }).$promise.then((res) => {
        if (res.data && res.data.feederDetails && res.data.feederDetails.length > 0) {
          vm.feederDetails = _.first(res.data.feederDetails);
          updateImagePath(vm.feederDetails);
          if (res.data.allocatedUMIDList.length > 0) {
            vm.sumObj = {};
            vm.getFooterAllocationTotal(res.data.allocatedUMIDList);
            vm.getFooterFreeUnitsTotal(res.data.allocatedUMIDList);
            vm.getFooterAllocatedUnitTotal(res.data.allocatedUMIDList);
            vm.allocatedUMIDList = res.data.allocatedUMIDList;
          } else {
            vm.allocatedUMIDList = [];
          }
        } else {
          vm.allocatedUMIDList = [];
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    // update image path
    let updateImagePath = (details) => {
      if (details) {
        if (!details.imageURL) {
          details.imageURL = CORE.WEB_URL + USER.COMPONENT_DEFAULT_IMAGE_PATH + 'profile.jpg';
        } else {
          if (!details.imageURL.startsWith("http://") && !details.imageURL.startsWith("https://")) {
            details.imageURL = BaseService.getPartMasterImageURL(details.documentPath, details.imageURL);
          }
        }
      }
    }

    //get footer allocation total
    vm.getFooterAllocationTotal = (list) => {
      let sum = 0;
      sum = _.sumBy(list, (data) => {
        if (data.convertedUnit)
          return data.convertedUnit;
        else
          return 0;
      });
      vm.sumObj.sumOfAllocationUnit = sum;
    }

    //get footer allocation unit total
    vm.getFooterAllocatedUnitTotal = (list) => {
      let sum = _.sumBy(list, (data) => {
        if (data.allocatedUnit)
          return data.allocatedUnit;
        else
          return 0;
      });
      vm.sumObj.sumOfAllocatedUnit = sum;
    }
    //get footer free units total
    vm.getFooterFreeUnitsTotal = (list) => {
      let sum = _.sumBy(list, (data) => {
        if (data.FreeToShare)
          return data.FreeToShare;
        else
          return 0;
      });
      vm.sumObj.sumOfFreeUnit = sum;
    }
    vm.validateFeederDetails();

    //go to sales order list page
    vm.gotoSalesorderList = () => {
      BaseService.goToSalesOrderList();
    }

    //go to manage salesorder list page
    vm.gotoMangeSalesorder = (ev) => {
      if (vm.allocateUMID.poNumber && vm.allocateUMID.salesOrderNumber) {
        let data = angular.copy(vm.allocateUMID);
        DialogFactory.dialogService(
          CORE.WO_SO_HEADER_DETAILS_MODAL_CONTROLLER,
          CORE.WO_SO_HEADER_DETAILS_MODAL_VIEW,
          ev,
          data).then(() => {

          }, ((result) => {

          }), (error) => {
            return BaseService.getErrorLog(error);
          });
      }
    }
    // go to workorder list page
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
    }
    //go to workorder detail page
    vm.goToWorkorderDetails = () => {
      BaseService.goToWorkorderDetails(vm.allocateUMID.woID);
    }
    function bindHeaderData() {
      vm.headerdata = [];
      vm.headerdata.push({
        label: vm.LabelConstant.SalesOrder.SO,
        value: vm.allocateUMID.salesOrderNumber,
        displayOrder: 1,
        labelLinkFn: vm.gotoSalesorderList,
        valueLinkFn: vm.gotoMangeSalesorder,
      },
        {
          label: vm.LabelConstant.SalesOrder.PO,
          value: vm.allocateUMID.poNumber,
          displayOrder: 2,
        },
        {
          label: vm.LabelConstant.Workorder.WO,
          value: vm.allocateUMID.woNumber,
          displayOrder: 3,
          labelLinkFn: vm.goToWorkorderList,
          valueLinkFn: vm.goToWorkorderDetails,
        },
        {
          label: vm.LabelConstant.Workorder.Version,
          value: vm.allocateUMID.woVersion,
          displayOrder: 4,
        },
        {
          label: vm.LabelConstant.Traveler.Feeder,
          value: vm.allocateUMID.feederLocation,
          displayOrder: 5,
        });
    }
    bindHeaderData();
  };
})();
