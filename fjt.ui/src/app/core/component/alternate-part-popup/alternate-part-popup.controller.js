(function () {
  'use strict';
  angular
    .module('app.core')
    .controller('AlternatePartPopupController', AlternatePartPopupController);
  /** @ngInject */
  function AlternatePartPopupController($mdDialog, $q, ComponentFactory, data, CORE, USER, BaseService, DialogFactory, RFQTRANSACTION) {
    const vm = this;
    vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.NO_ALTERNATE_PART;
    vm.PopupLabel = data.isRoHSAlternate ? 'Select RoHS Replacement Part' : 'Select Alternate Part';
    if (data.isRoHSAlternate) {
      vm.EmptyMesssage = RFQTRANSACTION.RFQTRANSACTION_EMPTYSTATE.NO__ROHS_REPLACEMENT_PART;
    }
    vm.LabelConstant = CORE.LabelConstant;
    vm.alternatePartList = [];
    vm.selectedComponent = {};

    function getComponentAlternetAliasByID() {
      vm.cgBusyLoading = ComponentFactory.getComponentAlternetAliasByID().query({ id: data.componentID }).$promise.then((response) => {
        if (response && response.data) {
          vm.isNoDataFound = response.data.length === 0;
          vm.alternatePartList = [];
          _.each(response.data, (item) => {
            if (item.alternateComponent.id !== data.componentID) {
              vm.alternatePartList.push({
                name: stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.alternateComponent.mfgCodemst.mfgCode, item.alternateComponent.mfgPN),
                mfgCode: item.alternateComponent.mfgCodemst.mfgCode,
                mfgName: item.alternateComponent.mfgCodemst.mfgName,
                mfgCodeID: item.alternateComponent.mfgCodemst.id,
                mfgPN: item.alternateComponent.mfgPN,
                mfgPNDescription: item.alternateComponent.mfgPNDescription,
                mfgPNID: item.alternateComponent.id,
                RoHSStatusID: item.alternateComponent.rfq_rohsmst ? item.alternateComponent.rfq_rohsmst.id : null,
                roHSStatusIcon: item.alternateComponent.rfq_rohsmst ? stringFormat('{0}{1}{2}', CORE.WEB_URL, USER.ROHS_BASE_PATH, item.alternateComponent.rfq_rohsmst.rohsIcon) : null,
                roHSName: item.alternateComponent.rfq_rohsmst ? item.alternateComponent.rfq_rohsmst.name : null,
                pIDCode: item.alternateComponent.PIDCode,
                isCustom: item.alternateComponent.isCustom,
                isCPN: item.alternateComponent.isCPN,
                packagingName: item.alternateComponent.component_packagingmst ? item.alternateComponent.component_packagingmst.name : null,
                packageQty: item.alternateComponent.packageQty,
                custAssyPN: item.alternateComponent.custAssyPN
              });
            }
          });
        }
        else {
          vm.isNoDataFound = true;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    function getComponentROHSAlternetAliasByID() {
      vm.cgBusyLoading = ComponentFactory.getComponentROHSAlternetAliasByID().query({ id: data.componentID }).$promise.then((response) => {
        if (response && response.data) {
          vm.isNoDataFound = response.data.length === 0;
          vm.alternatePartList = [];
          _.each(response.data, (item) => {
            if (item.alternateComponent.id !== data.componentID) {
              vm.alternatePartList.push({
                name: stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.alternateComponent.mfgCodemst.mfgCode, item.alternateComponent.mfgPN),
                mfgCode: item.alternateComponent.mfgCodemst.mfgCode,
                mfgName: item.alternateComponent.mfgCodemst.mfgName,
                mfgCodeID: item.alternateComponent.mfgCodemst.id,
                mfgPN: item.alternateComponent.mfgPN,
                mfgPNDescription: item.alternateComponent.mfgPNDescription,
                mfgPNID: item.alternateComponent.id,
                RoHSStatusID: item.alternateComponent.rfq_rohsmst ? item.alternateComponent.rfq_rohsmst.id : null,
                roHSStatusIcon: item.alternateComponent.rfq_rohsmst ? stringFormat('{0}{1}{2}', CORE.WEB_URL, USER.ROHS_BASE_PATH, item.alternateComponent.rfq_rohsmst.rohsIcon) : null,
                roHSName: item.alternateComponent.rfq_rohsmst ? item.alternateComponent.rfq_rohsmst.name : null,
                pIDCode: item.alternateComponent.PIDCode,
                isCustom: item.alternateComponent.isCustom,
                isCPN: item.alternateComponent.isCPN,
                packagingName: item.alternateComponent.component_packagingmst ? item.alternateComponent.component_packagingmst.name : null,
                packageQty: item.alternateComponent.packageQty,
                custAssyPN: item.alternateComponent.custAssyPN
              });
            }
          });
        }
        else {
          vm.isNoDataFound = true;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.save = ($event) => {
      const selectedList = _.filter(vm.alternatePartList, (data) => data.isChecked === true);
      if (selectedList.length > 0) {
        const objData = {
          isValidate: true
        };
        DialogFactory.dialogService(
          CORE.MANAGE_PASSWORD_POPUP_CONTROLLER,
          CORE.MANAGE_PASSWORD_POPUP_VIEW,
          $event, objData).then((data) => {
            if (data) {
              const selectedList = _.filter(vm.alternatePartList, (data) => data.isChecked);
              DialogFactory.hideDialogPopup(selectedList);
            }
          },
            (err) => BaseService.getErrorLog(err));
      } else {
        const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.SELECT_ANY_PART_FIRST_TO_PROCESS);
        messgaeContent.message = stringFormat(messgaeContent.message, data.isRoHSAlternate ? 'RoHS replacement' : 'alternate part');
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

    init(true);

    function init(onLoad) {
      const promise = [];
      if (onLoad) {
        promise.push(getComponentdetailByID());
      }
      if (data.isRoHSAlternate) {
        promise.push(getComponentROHSAlternetAliasByID());
      }
      else {
        promise.push(getComponentAlternetAliasByID());
      }
      vm.cgBusyLoading = $q.all(promise).then(() => {
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.isAnySelected = () => {
      var parts = !_.some(vm.alternatePartList, (item) => item.isChecked);
      return parts;
    };

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
      const selectedList = _.filter(vm.alternatePartList, (data) => data.isChecked === true);
      if (selectedList.length > 0) {
        return false;
      } else {
        return true;
      }
    };
    vm.refereshPart = () => {
      init(false);
    };
    vm.addPart = () => {
      BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG.toLowerCase(), data.componentID);
    };

    //go to manage part number
    vm.goToAssyMaster = (itemID) => {
      BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG.toLowerCase(), itemID, USER.PartMasterTabs.Detail.Name);
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
        isAssy: true,
        isCopyAheadLabel: true,
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
