(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('ManageErrorCodeLegendPopupController', ManageErrorCodeLegendPopupController);

  /** @ngInject */
  function ManageErrorCodeLegendPopupController($mdDialog, CORE, USER, RFQTRANSACTION, BaseService, ImportBOMFactory, DialogFactory) {
    const vm = this;
    var _successColor = RFQTRANSACTION.SUCCESS_COLOR;
    vm.logicCategoryList = _.sortBy(CORE.LogicCategoryDropdown, 'value');
    vm.debounceTime = CORE.DEBOUNCE_TIME_INTERVAL;
    vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.BOM_ERROR_LEGEND;

    vm.cgBusyLoading = ImportBOMFactory.getErrorCode().query({}).$promise.then((response) => {
      vm.errorCodeLegendList = [];
      if (response && response.data) {
        _.each(response.data, (item) => {
          vm.errorCodeLegendList.push(item);
        });
        const successObj = {
          displayName: 'Validation Complete',
          errorCode: 'SUCCESS',
          errorColor: _successColor,
          logicID: 0
        };
        vm.errorCodeLegendList.splice(0, 0, successObj);
        vm.AllerrorCodeLegendList = angular.copy(vm.errorCodeLegendList);
      }
    }).catch((error) => BaseService.getErrorLog(error));

    vm.updateErrocode = (errorCode) => {
      errorCode.popupAccessRoutingState = [USER.ADMIN_RFQ_LINEITEMS_ERRORCODE_STATE];
      errorCode.pageNameAccessLabel = CORE.PageName.RFQLineItemErrorCode;
      if (!BaseService.checkRightToAccessPopUp(errorCode)) {
        return false;
      } else {
        DialogFactory.dialogService(
          CORE.MANAGE_RFQ_LINEITEMS_ERRORCODE_CONTROLLER,
          CORE.MANAGE_RFQ_LINEITEMS_ERRORCODE_VIEW,
          null,
          errorCode).then((response) => {
            if (response) {
              errorCode.description = response.description;
              errorCode.displayName = response.displayName;
              errorCode.errorCode = response.errorCode;
              errorCode.errorColor = response.errorColor;
              errorCode.isAllowToEngrApproved = response.isAllowToEngrApproved;
              errorCode.isAssemblyLevelError = response.isAssemblyLevelError;
              errorCode.isExternalIssue = response.isExternalIssue;
              errorCode.isResearchStatus = response.isResearchStatus;
              errorCode.systemVariable = response.systemVariable;
              errorCode.narrative = response.narrative;
            }
          }, () => {
          });
      }
    };

    vm.searchErrorCode = (isReset) => {
      if (isReset) {
        vm.searchText = null;
        vm.errorCodeLegendList = vm.AllerrorCodeLegendList;
      }
      else {
        vm.errorCodeLegendList = _.filter(vm.AllerrorCodeLegendList, (x) => x.displayName.toLowerCase().indexOf(vm.searchText.toLowerCase()) !== -1);
      }
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
