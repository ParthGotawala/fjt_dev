(function () {
  'use strict';

  angular
    .module('app.admin.customer')
    .controller('CPNPartsController', CPNPartsController);

  /** @ngInject */
  function CPNPartsController($timeout, $scope, $mdDialog, $q, $state, $stateParams, USER, CORE,
    DialogFactory, BaseService, DASHBOARD, ManufacturerFactory, RFQTRANSACTION, ManageMFGCodePopupFactory, $rootScope) {
    const vm = this;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.SEARCH_BOM;

    const getCustomerSearch = (searchObj) => ManageMFGCodePopupFactory.getMfgcodeList().query(searchObj).$promise.then((mfgcodes) => {
      if (mfgcodes && mfgcodes.data && mfgcodes.data) {
        vm.customerSearchList = mfgcodes.data;
        if (searchObj.mfgcodeID) {
          $timeout(() => {
            if (vm.autoCompleteCustomer && vm.autoCompleteCustomer.inputName) {
              $scope.$broadcast(vm.autoCompleteCustomer.inputName, mfgcodes.data[0]);
            }
          });
        }
      }
      else {
        vm.customerSearchList = [];
      }
      return vm.customerSearchList;
    }).catch((error) => BaseService.getErrorLog(error));

    const getAllCustomerList = () => MasterFactory.getCustomerList().query().$promise.then((customer) => {
      if (customer && customer.data) {
        _.each(customer.data, (item) => {
          item.mfgName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.mfgCode, item.mfgName);
        });
        vm.CustomerList = customer.data;
      }
      return $q.resolve(vm.CustomerList);
    }).catch((error) => BaseService.getErrorLog(error));


    //#region On change of tab
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
    });
    //#endregion

    const initAutoComplete = () => {
      /*Auto-complete for Search Customer/Supplier */
      vm.autoCompleteCustomer = {
        columnName: 'mfgCodeName',
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'Customer',
        placeholderName: 'Customer',
        isRequired: false,
        isAddnew: false,
        callbackFn: getAllCustomerList,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.customer = item;
            if ($stateParams.customerID) {
              $state.go(USER.ADMIN_CPN_PARTS_STATE, { customerID: item.id });
            }
            else {
              $state.go(USER.ADMIN_CPN_PARTS_STATE, { customerID: item.id });
            }
          }
          else {
            vm.customer = null;
            vm.cid = null;
            $state.go(USER.ADMIN_CPN_PARTS_STATE, { customerID: null });
          }
        },
        onSearchFn: (query) => {
          const searchObj = {
            searchQuery: query,
            inputName: vm.autoCompleteCustomer.inputName,
            type: CORE.MFG_TYPE.MFG,
            searchInActive: false,
            isCustomer: true
          };
          return getCustomerSearch(searchObj);
        }
      };
    };

    const methodPromise = [initAutoComplete()];
    vm.cgBusyLoading = $q.all(methodPromise).then(() => {
      if ($stateParams.customerID) {
        vm.cid = $stateParams.customerID ? $stateParams.customerID : null;
        getCustomerSearch({ mfgcodeID: vm.cid });
      }
    }).catch((error) => BaseService.getErrorLog(error));

    vm.goToCustomerDetails = () => {
      BaseService.goToCustomer(vm.cid);
    };
    vm.goToCustomer = () => {
      BaseService.goToCustomerList();
    };
  }
})();
