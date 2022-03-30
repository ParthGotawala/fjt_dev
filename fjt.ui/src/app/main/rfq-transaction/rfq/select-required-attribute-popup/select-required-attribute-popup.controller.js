(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('RequireAttributeSelectPopupController', RequireAttributeSelectPopupController);

  /** @ngInject */
  function RequireAttributeSelectPopupController($mdDialog, $filter, RFQSettingFactory, ComponentFactory, CORE, USER, data, BaseService, DialogFactory) {
    const vm = this;
    vm.dataList = [];
    vm.selectedDataList = [];
    vm.oldSelectedValues = [];
    vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE;
    vm.labelConstant = CORE.LabelConstant;

    // get mounting type list
    vm.getMountingType = () => {
      vm.cgBusyLoading = ComponentFactory.getMountingTypeList().query().$promise.then((mointingType) => {
        if (mointingType.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          const dataList = [];
          _.each(mointingType.data, (item) => {
            if (item.isActive) {
              const newItem = {
                id: item.id,
                name: item.name
              };
              dataList.push(newItem);
            }
          });
          vm.dataList = dataList;
          if (vm.dataList.length > 0) {
            bindData();
            vm.isNoDataFound = false;
          } else {
            vm.isNoDataFound = true;
          }
        }
      });
    };

    // get functional type list
    vm.getFunctionalType = () => {
      vm.cgBusyLoading = RFQSettingFactory.getPartTypeList().query().$promise.then((functionaltype) => {
        if (functionaltype.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          const dataList = [];
          _.each(functionaltype.data, (item) => {
            if (item.isActive) {
              const newItem = {
                id: item.id,
                name: item.partTypeName
              };
              dataList.push(newItem);
            }
          });
          vm.dataList = dataList;
          if (vm.dataList.length > 0) {
            bindData();
            vm.isNoDataFound = false;
          } else {
            vm.isNoDataFound = false;
          }
        }
      });
    };

    // Add mounting type list
    vm.addNewMountingType = () => {
      const popUpData = { popupAccessRoutingState: [USER.ADMIN_MOUNTING_TYPE_STATE], pageNameAccessLabel: CORE.PageName.mounting_type };
      const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        DialogFactory.dialogService(
          CORE.MANAGE_MOUNTING_TYPE_MODAL_CONTROLLER,
          CORE.MANAGE_MOUNTING_TYPE_MODAL_VIEW,
          null,
          null).then((result) => {
            if (result) {
              vm.getMountingType();
            }
          }, (error) => BaseService.getErrorLog(error));
      }
    };

    // add Functional type list
    vm.addNewFunctionalType = () => {
      const popUpData = { popupAccessRoutingState: [USER.ADMIN_PART_TYPE_STATE], pageNameAccessLabel: CORE.PageName.funtional_type };
      const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
      if (isAccessPopUp) {
        DialogFactory.dialogService(
          CORE.MANAGE_PART_TYPE_MODAL_CONTROLLER,
          CORE.MANAGE_PART_TYPE_MODAL_VIEW,
          null,
          null).then((result) => {
            if (result) {
              vm.getFunctionalType();
            }
          }, (error) => BaseService.getErrorLog(error));
      }
    };

    vm.GotoList = () => {
      if (vm.isMountingType) {
        BaseService.goToMountingTypeList();
      } else if (vm.isFunctionalType) {
        BaseService.goToFunctionalTypeList();
      }
    };

    if (data) {
      if (data.SelectedValues) {
        vm.selectedDataList = data.SelectedValues;
        vm.oldSelectedValues = _.clone(data.SelectedValues);
      }
      if (data.isMountingType) {
        vm.getMountingType();
        vm.addNewFunction = vm.addNewMountingType;
        vm.refreshFunction = vm.getMountingType;
        vm.isMountingType = true;
      }
      if (data.isFunctionalType) {
        vm.getFunctionalType();
        vm.addNewFunction = vm.addNewFunctionalType;
        vm.refreshFunction = vm.getFunctionalType;
        vm.isFunctionalType = true;
      }
    }

    // Bind data as per selected items list
    function bindData() {
      vm.datalistarray = angular.copy(vm.dataList);
      _.each(vm.selectedDataList, (item) => {
        var index = _.find(vm.dataList, (data) => {
          if (data.id === item.id) {
            data.isSelected = true;
            return true;
          }
        });
        vm.dataList.splice(vm.dataList.indexOf(index), 1);
        item.isSelected = true;
      });
    }

    vm.searchListItems = (criteria) => $filter('filter')(vm.dataList, { name: criteria });

    // select item function call
    vm.onSelectedItem = (item, form) => {
      item.isSelected = true;
      vm.selectedDataList.push(item);
      vm.dataList.splice(vm.dataList.indexOf(item), 1);
      form.$setDirty();
    };

    //go to manage part number
    vm.goToAssyMaster = () => {
        BaseService.goToComponentDetailTab(null, data.partID);
      return false;
    };
    //go to assy list
    vm.goToAssyList = () => {
        BaseService.goToPartList();
      return false;
    };
    // go to customer
    vm.goToCustomer = () => {
      BaseService.goToCustomer(data.customerID);
      return false;
    };
    //redirect to customer list
    vm.goToCustomerList = () => {
      BaseService.goToCustomerList();
      return false;
    };
    // close pop up
    vm.cancel = () => {
      const isdirty = vm.MultiSelectForm.$dirty;
      if (isdirty) {
        const data = {
          form: vm.MultiSelectForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm = [];
        vm.MultiSelectForm.$setPristine();
        $mdDialog.cancel();
      }
    };
    if (data) {
      vm.headerdata = [];
      vm.headerdata.push({
        label: vm.labelConstant.Customer.Customer,
        value: data.customer,
        displayOrder: 1,
        labelLinkFn: vm.goToCustomerList,
        valueLinkFn: vm.goToCustomer,
        valueLinkFnParams: null,
        isCopy: false,
        copyParams: null,
        imgParms: null
      }, {
        label: vm.labelConstant.Assembly.ID,
        value: data.PIDCode,
        displayOrder: 1,
        labelLinkFn: vm.goToAssyList,
        valueLinkFn: vm.goToAssyMaster,
        valueLinkFnParams: null,
        isCopy: true,
        isCopyAheadLabel: false,
        isAssy: true,
        imgParms: {
          imgPath: data.RoHSIcon,
          imgDetail: data.rohsName
        }
      }, {
        label: vm.labelConstant.Assembly.MFGPN,
        value: data.mfgPN,
        displayOrder: 1,
        labelLinkFn: vm.goToAssyList,
        valueLinkFn: vm.goToAssyMaster,
        valueLinkFnParams: null,
        isCopy: true,
        isCopyAheadLabel: false,
        isAssy: true,
        imgParms: {
          imgPath: data.RoHSIcon,
          imgDetail: data.rohsName
        }
      });
    }
    // send selected list array back to parent controller
    vm.save = () => {
      vm.selectedDataList;
      vm.oldSelectedValues;
      const selectedValue = _.map(vm.selectedDataList, 'id');
      const oldValue = _.map(vm.oldSelectedValues, 'id');
      if (!_.isEqual(selectedValue.sort(), oldValue.sort())) {
        data.selectedValues = vm.selectedDataList;
        data.oldSelectedValues = vm.oldSelectedValues;
        DialogFactory.dialogService(
          USER.REQUIRE_ATTRIBUTE_SELECT_POPUP_ALERT_CONTROLLER,
          USER.REQUIRE_ATTRIBUTE_SELECT_POPUP_ALERT_VIEW,
          null,
          data).then(() => {
            $mdDialog.hide(vm.selectedDataList);
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      }
      else {
        $mdDialog.hide();
      }
    };

    // un-select item function call
    vm.unselect = (form) => {
      vm.dataList = _.filter(vm.datalistarray, (dataobj) => {
        const selectedType = _.find(vm.selectedDataList, (m) => m.id === dataobj.id);
        if (!selectedType) {
          dataobj.isSelected = false;
          return true;
        } else {
          return false;
        }
      });
      form.$setDirty();
    };
  }
})();
