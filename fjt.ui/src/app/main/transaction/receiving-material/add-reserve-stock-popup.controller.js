(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('AddReserveStockPopUpController', AddReserveStockPopUpController);

  function AddReserveStockPopUpController($mdDialog, $q, CORE, BaseService, data, USER, MasterFactory, ReceivingMaterialFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.ReserveStockModel = {};
    vm.saveBtnDisableFlag = false;
    vm.PartCategory = CORE.PartCategory;

    const getCustomerList = () => MasterFactory.getCustomerList().query().$promise.then((customer) => {
      if (customer && customer.data) {
        _.each(customer.data,(item)=>{
          item.mfgName = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.mfgCode, item.mfgName);
        });
        vm.CustomerList = customer.data;
      }
      return $q.resolve(vm.CustomerList);
    }).catch((error) => BaseService.getErrorLog(error));

    const getAssyList = (item) => {
      if (item || vm.autoCompleteCustomer.keyColumnId) {
        vm.assyList = [];
        return MasterFactory.getAssyPartList().query({ customerID: item && item.id ? item.id : vm.autoCompleteCustomer.keyColumnId }).$promise.then((response) => {
          vm.assyList = response.data;
          initAutoCompleteAssy();
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    const selectAssy = (item) => {
      if (item) {
        vm.ReserveStockModel.nickName = item.nickName;
      } else {
        vm.ReserveStockModel.nickName = null;
      }
    };

    const autocompletePromise = [getCustomerList()];
    vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
      initAutoCompleteCustomer();
      initAutoCompleteAssy();
    }).catch((error) => BaseService.getErrorLog(error));

    const initAutoCompleteCustomer = () => {
      vm.autoCompleteCustomer = {
        columnName: 'mfgName',
        controllerName: USER.ADMIN_CUSTOMER_ADD_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_CUSTOMER_ADD_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.ReserveStockModel && vm.ReserveStockModel.customerID ? vm.ReserveStockModel.customerID : null,
        addData: {
          customerType: CORE.CUSTOMER_TYPE.CUSTOMER, popupAccessRoutingState: [USER.ADMIN_MANAGECUSTOMER_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.customer
        },
        inputName: 'Customer',
        placeholderName: 'Customer',
        isRequired: true,
        isAddnew: true,
        callbackFn: getCustomerList,
        onSelectCallbackFn: getAssyList
      };
    };

    const initAutoCompleteAssy = () => {
      vm.autoCompleteAssy = {
        columnName: 'PIDCode',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.ReserveStockModel && vm.ReserveStockModel.assyID ? vm.ReserveStockModel.assyID : null,
        inputName: 'Assembly',
        placeholderName: 'Assy ID',
        isRequired: false,
        isAddnew: true,
        callbackFn: getAssyList,
        onSelectCallbackFn: selectAssy,
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          category: vm.PartCategory.SubAssembly,
          customerID: vm.autoCompleteCustomer ? vm.autoCompleteCustomer.keyColumnId : null,
          popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
          pageNameAccessLabel: CORE.PageName.part_master
        }
      };
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.formAddReserveStock, vm.checkDirtyObject);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    vm.addInReserveStock = () => {
      vm.saveBtnDisableFlag = true;
      if (BaseService.focusRequiredField(vm.formAddReserveStock)) {
        vm.saveBtnDisableFlag = false;
        return;
      }
      const ReceivingMaterial = {};
      if (data && data.length && data.length > 0) {
        vm.reserveStockModel = data;
        _.map(vm.reserveStockModel, (item) => {
          item.customerID = vm.autoCompleteCustomer.keyColumnId;
          item.assyID = vm.autoCompleteAssy.keyColumnId;
          item.nickName = vm.ReserveStockModel.nickName;
        });
        ReceivingMaterial.selectedRow = vm.reserveStockModel;
      } else {
        vm.ReserveStockModel.customerID = vm.autoCompleteCustomer.keyColumnId;
        vm.ReserveStockModel.assyID = vm.autoCompleteAssy.keyColumnId;
        vm.ReserveStockModel.id = data.id;

        ReceivingMaterial.selectedRow = [];
        ReceivingMaterial.selectedRow.push(vm.ReserveStockModel);
      }

      vm.cgBusyLoading = ReceivingMaterialFactory.AddInReserveStock().query(ReceivingMaterial).$promise.then((res) => {
        if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.saveBtnDisableFlag = false;
          $mdDialog.cancel(true);
        } else {
          if (checkResponseHasCallBackFunctionPromise(response)) {
            response.alretCallbackFn.then(() => {
              BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.formAddReserveStock);
            });
          }
          vm.saveBtnDisableFlag = false;
        }
      }).catch((error) => {
        vm.saveBtnDisableFlag = false;
        return BaseService.getErrorLog(error);
      });
    };

    vm.goToCustomerList = () => {
      BaseService.goToCustomerList();
    };

    vm.goToAssayList = () => {
      BaseService.openInNew(USER.ADMIN_MFG_COMPONENT_STATE, {});
    };
    /** Validate max size */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
  }
})();
