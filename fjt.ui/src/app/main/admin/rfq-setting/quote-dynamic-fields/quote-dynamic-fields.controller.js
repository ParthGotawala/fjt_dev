(function () {
  'use strict';

  angular
    .module('app.admin.rfqsetting')
    .controller('QuoteDynamicFieldsController', QuoteDynamicFieldsController);

  /** @ngInject */
  function QuoteDynamicFieldsController(USER, $scope, $stateParams, CORE, $state, DialogFactory, $mdDialog, BaseService) {
    const vm = this;
    vm.view = false;
    vm.isUpdatable = true;
    vm.type = $stateParams.type;
    vm.attributeTypeConst = CORE.ATTRIBUTE_TYPE;
    vm.quote_attribute_type = CORE.QUOTE_DB_ATTRIBUTE_TYPE;
    vm.quoteAyytibuteTypeName = CORE.ATTRIBUTE_TYPE_NAME;
    if (vm.type === vm.attributeTypeConst.RFQ) {
      vm.selectedTabIndex = 0;
    } else {
      vm.selectedTabIndex = 1;
    }
    vm.pageTabRights = {
      RFQAttribute: false,
      supplierAttibute: false
    };

    const init = (pageList) => {
      let tab;
      tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_QUOTE_DYNAMIC_FIELDS_STATE);
      if (tab && tab.length > 0 && tab[0].isActive) {
        vm.pageTabRights.RFQAttribute = true;
      }
      tab = pageList.filter((a) => a.PageDetails && a.PageDetails.pageRoute === USER.ADMIN_SUPPLIER_DYNAMIC_FIELDS_STATE);
      if (tab && tab.length > 0 && tab[0].isActive) {
        vm.pageTabRights.supplierAttibute = true;
      }
    };

    if (BaseService.loginUserPageList && BaseService.loginUserPageList.length >0 ) {
      init(BaseService.loginUserPageList);
    };

    vm.onTabChanges = (type, msWizard) => {
      msWizard.selectedIndex = vm.selectedTabIndex;
      if (type !== vm.type) {
        if (type === vm.attributeTypeConst.RFQ) {
          $state.go(USER.ADMIN_QUOTE_DYNAMIC_FIELDS_STATE, { type: type }, { reload: true });
        } else {
          $state.go(USER.ADMIN_SUPPLIER_DYNAMIC_FIELDS_STATE, { type: type }, { reload: true });
        }
      }
    };

    // add/edit quote Dynamic Fields
    vm.addEditRecord = (data, ev) => {
      if (!data) {
        data = { quoteAttributeType: vm.type === vm.attributeTypeConst.RFQ ? vm.quote_attribute_type.RFQ : vm.quote_attribute_type.SUPPLIER };
      }
      DialogFactory.dialogService(
        CORE.MANAGE_QUOTE_DYNAMIC_FIELDS_MODAL_CONTROLLER,
        CORE.MANAGE_QUOTE_DYNAMIC_FIELDS_MODAL_VIEW,
        ev,
        data).then(() => {
        }, (data) => {
          if (data) {
            vm.refereshData();
          }
        },(error) => BaseService.getErrorLog(error));
    };

    $scope.$on(USER.LoginUserPageListBroadcast, (event, data) => {
      init(data);
    });

    //close popup on page destroy
    $scope.$on('$destroy', ()=> {
      $mdDialog.hide(false, { closeAll: true });
    });
  }
})();
