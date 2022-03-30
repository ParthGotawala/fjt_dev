(function () {
  'use strict';
  angular
    .module('app.core')
    .controller('EpoxyProcessMaterialPartPopupController', EpoxyProcessMaterialPartPopupController);
  /** @ngInject */
  function EpoxyProcessMaterialPartPopupController($mdDialog, $q, ComponentFactory, data, CORE, USER, BaseService, DialogFactory, RFQTRANSACTION) {
    const vm = this;
    vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.NO_PROCESS_MATERIAL;
    vm.processMaterialList = [];
    vm.LabelConstant = CORE.LabelConstant;
    vm.selectedComponent = {};
    function getComponentProcessMaterialGroup() {
      vm.cgBusyLoading = ComponentFactory.getComponentProcessMaterialGroupByCompomentID().query({ id: data.componentID }).$promise.then((response) => {
        if (response && response.data) {
          vm.isNoDataFound = response.data.length === 0;
          vm.processMaterialList = [];
          _.each(response.data, (item) => {
            if (item.componentAsProcessMaterial.id !== data.componentID) {
              vm.processMaterialList.push({
                name: stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.componentAsProcessMaterial.mfgCodemst.mfgCode, item.componentAsProcessMaterial.mfgPN),
                mfgCode: item.componentAsProcessMaterial.mfgCodemst.mfgCode,
                mfgName: item.componentAsProcessMaterial.mfgCodemst.mfgName,
                mfgCodeID: item.componentAsProcessMaterial.mfgCodemst.id,
                mfgPN: item.componentAsProcessMaterial.mfgPN,
                mfgPNID: item.componentAsProcessMaterial.id,
                roHSStatusIcon: item.componentAsProcessMaterial.rfq_rohsmst ? stringFormat('{0}{1}{2}', CORE.WEB_URL, USER.ROHS_BASE_PATH, item.componentAsProcessMaterial.rfq_rohsmst.rohsIcon) : null,
                roHSName: item.componentAsProcessMaterial.rfq_rohsmst ? item.componentAsProcessMaterial.rfq_rohsmst.name : null,
                pIDCode: item.componentAsProcessMaterial.PIDCode,
                uom: item.componentAsProcessMaterial.uom,
                mfgPNDescription: item.componentAsProcessMaterial.mfgPNDescription,
                isCustom: item.componentAsProcessMaterial.isCustom,
                isCPN: item.componentAsProcessMaterial.isCPN,
                packagingName: item.componentAsProcessMaterial.component_packagingmst ? item.componentAsProcessMaterial.component_packagingmst.name : null,
                packageQty: item.componentAsProcessMaterial.packageQty,
                custAssyPN: item.componentAsProcessMaterial.custAssyPN
              });
            }
          });
        } else {
          vm.isNoDataFound = true;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.save = () => {
      var selectedList = _.filter(vm.processMaterialList, (data) => data.isChecked === true);
      if (selectedList.length > 0) {
        DialogFactory.hideDialogPopup(selectedList);
      } else {
        const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.SELECT_ANY_PART_FIRST_TO_PROCESS);
        messgaeContent.message = stringFormat(messgaeContent.message, 'process material (Epoxy)');
        const model = {
          messageContent: messgaeContent
        };
        DialogFactory.messageAlertDialog(model);
      }
    };

    function getComponentdetailByID() {
      vm.cgBusyLoading = ComponentFactory.getComponentByID().query({ id: data.componentID }).$promise.then((response) => {
        vm.selectedComponent = {
          id: data.componentID,
          MFGPN: response.data.mfgPN,
          MFG: response.data.mfgCodemst.mfgCode,
          CustomerID: response.data.mfgCodemst.id,
          Customer: stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, response.data.mfgCodemst.mfgCode, response.data.mfgCodemst.mfgName),
          Component: stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, response.data.mfgCodemst.mfgCode, response.data.mfgPN),
          RoHSStatusIcon: response.data.rfq_rohsmst ? stringFormat('{0}{1}{2}', CORE.WEB_URL, USER.ROHS_BASE_PATH, response.data.rfq_rohsmst.rohsIcon) : null,
          RoHSName: response.data.rfq_rohsmst ? response.data.rfq_rohsmst.name : null,
          PIDCode: response.data.PIDCode
        };
        bindHeaderData();
        vm.component = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, response.data.mfgCodemst.mfgCode, response.data.mfgPN);
      }).catch((error) => BaseService.getErrorLog(error));
    }

    init();

    function init() {
      var promise = [];
      promise.push(getComponentProcessMaterialGroup(), getComponentdetailByID());

      vm.cgBusyLoading = $q.all(promise).then(() => {
        // Empty
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.AlternatePartForm);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form) => {
      const checkDirty = form.$dirty;
      return checkDirty;
    };
    vm.checkSelectedRecord = () => {
      const selectedList = _.filter(vm.processMaterialList, (data) => data.isChecked === true);
      if (selectedList.length > 0) {
        return false;
      } else {
        return true;
      }
    };
    vm.refereshPart = () => {
      init();
    };
    vm.addPart = () => {
      BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG.toLowerCase(), data.componentID);
    };
    //go to manage part number
    vm.goToAssyMaster = (itemID) => {
      BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG.toLowerCase(), itemID, USER.PartMasterTabs.Detail.Name);
      return false;
    };
    // go to customer
    vm.goToCustomer = () => {
      BaseService.goToCustomer(vm.selectedComponent.CustomerID);
      return false;
    };
    //redirect to customer list
    vm.goToCustomerList = () => {
      BaseService.goToCustomerList();
      return false;
    };
    // Go to Packaging master
    vm.goToPackagingList = () => {
      BaseService.goToPackaging();
    };
    // Go to MFR List
    vm.GotoMFRList = () => {
      BaseService.goToManufacturerList();
    };
    // Go to Part List
    vm.GotoPartList = () => {
      BaseService.goToPartList();
    };
    // Go to MFR Detail
    vm.goToMFR = (item) => {
      BaseService.goToManufacturer(item.mfgCodeID);
    };

    function bindHeaderData() {
      vm.headerdata = [];
      vm.headerdata.push({
        label: vm.LabelConstant.MFG.PID,
        value: vm.selectedComponent.PIDCode,
        displayOrder: 1,
          labelLinkFn: vm.GotoPartList,
        valueLinkFn: vm.goToAssyMaster,
        valueLinkFnParams: vm.selectedComponent.id,
        isCopy: true,
        isCopyAheadLabel: true,
        isAssy: true,
        imgParms: {
          imgPath: vm.selectedComponent.RoHSStatusIcon,
          imgDetail: vm.selectedComponent.RoHSName
        },
        isCopyAheadOtherThanValue: true,
        copyAheadLabel: vm.LabelConstant.MFG.MFGPN,
        copyAheadValue: vm.selectedComponent.MFGPN
      });
    }
  };
})();
