(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('SelectPartPopUpController', SelectPartPopUpController);

  function SelectPartPopUpController($mdDialog, CORE, USER, BaseService, data, ComponentFactory, DialogFactory, $timeout) {
    const vm = this;
    vm.CORE = CORE;
    vm.objPart = data;
    const mappedManufactureList = data && data.mappedManufactureList && data.mappedManufactureList.length > 0 ? data.mappedManufactureList : [];
    vm.partList = [];
    vm.query = {
      order: ''
    };
    vm.isDisable = true;
    //vm.isOtherPart = false;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;

    function setPartDataAfterApiResponse(apiDataObj) {
      const partResponse = apiDataObj;
      const mfgPartList = partResponse[0];
      const otherPartList = partResponse[1];

      _.map(mfgPartList, (data) => {
        if (data) {
          data.mfgFullName = data.mfgCodemst ? stringFormat('({0}){1}', data.mfgCodemst.mfgCode, data.mfgCodemst.mfgName) : null;
          data.rohsIcon = data.rfq_rohsmst ? data.rfq_rohsmst.rohsIcon : null;
          data.rohsName = data.rfq_rohsmst ? data.rfq_rohsmst.name : null;
          data.imageURL = data.imageURL ? data.imageURL : BaseService.getPartMasterImageURL(null, null);
        }
      });

      _.map(otherPartList, (data) => {
        if (data.component) {
          data.id = data.component.id;
          data.imageURL = data.component.imageURL ? data.component.imageURL : BaseService.getPartMasterImageURL(null, null);
          data.mfgFullName = data.component.mfgCodemst ? stringFormat('({0}){1}', data.component.mfgCodemst.mfgCode, data.component.mfgCodemst.mfgName) : null;
          data.mfgCodeID = data.component.mfgCodeID;
          data.isCustom = data.component.isCustom;
          data.mfgPN = data.component.mfgPN;
          data.rohsIcon = data.component.rfq_rohsmst ? data.component.rfq_rohsmst.rohsIcon : null;
          data.rohsName = data.component.rfq_rohsmst ? data.component.rfq_rohsmst.name : null;
          data.isGoodPart = data.component.isGoodPart;
          data.otherPartName = data.name;
          data.supplier = data.component.componentLastExternalAPICall.length && data.component.componentLastExternalAPICall[0].supplierMaster.mfgCode;
          data.mfgPNDescription = data.component.mfgPNDescription;
        }
      });

      vm.partList = _.union(mfgPartList, otherPartList);
      _.map(vm.partList, (data) => {
        if (data.isGoodPart === vm.CORE.PartCorrectList.CorrectPart) {
          data.labelGoodPart = vm.CORE.PartCorrectLabelList.CorrectPart;
        } else if (data.isGoodPart === vm.CORE.PartCorrectList.IncorrectPart) {
          data.labelGoodPart = vm.CORE.PartCorrectLabelList.IncorrectPart;
        } else if (data.isGoodPart === vm.CORE.PartCorrectList.UnknownPart) {
          data.labelGoodPart = vm.CORE.PartCorrectLabelList.UnknownPart;
        }
        data.isSelect = false;
      });

      if (mappedManufactureList.length > 0) {
        vm.partList = _.filter(vm.partList, (item) => {
          if (item.isCustom && mappedManufactureList.includes(item.mfgcodeID)) {
            return true;
          } else {
            return false;
          }
        });
      }
      vm.copyPartList = angular.copy(vm.partList);
      setFocus('searchPart');
    }

    const getPartList = () => {
      /*While change in this API please take care same change on part master detail and add part popup also*/
      vm.cgBusyLoading = ComponentFactory.getComponentDetailByMfgPN().query({ mfgPn: vm.objPart ? vm.objPart.mfgPart : null }).$promise.then((mfgparts) => {
        setPartDataAfterApiResponse(mfgparts.data);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    if (data && vm.objPart.partData) {
      setPartDataAfterApiResponse(data.partData);
    }
    else {
      getPartList();
    }

    vm.selectPart = (item) => {
      if (item) {
        vm.isDisable = !item.isSelect;
        vm.selectedRow = item;
        _.map(vm.partList, (data) => {
          if (data.id !== item.id) {
            data.isSelect = false;
          }
        });
      }
    };

    vm.selectScanPart = ($event) => {
      $timeout(() => {
        if ($event.keyCode === 13 && vm.searchText) {
          searchText();
        }
      }, true);
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent($event);
    };

    const searchText = () => {
      vm.selectedRow = null;
      vm.isSearchDisable = true;
      vm.partList = _.filter(vm.partList, (item) => {
        if (item.mfgCodemst && item.mfgCodemst.mfgCode && item.mfgCodemst.mfgName && item.mfgFullName && (item.mfgCodemst.mfgCode.includes(vm.searchText.toUpperCase()) || item.mfgCodemst.mfgName.includes(vm.searchText.toUpperCase()) || item.mfgFullName.includes(vm.searchText.toUpperCase()))) {
          return true;
        } else {
          return false;
        }
      });
      if (vm.partList && vm.partList.length === 0) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SCAN_MFR_NOT_EXITS);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model).then((yes) => {
          if (yes) {
            vm.partList = angular.copy(vm.copyPartList);
            setFocus('searchPart');
            vm.searchText = null;
            vm.isSearchDisable = false;
          }
        });
      } else if (vm.partList && vm.partList.length === 1) {
        _.map(vm.partList, (item) => {
          item.isSelect = true;
        });
        vm.selectedRow = vm.partList[0];
        vm.isSearchDisable = true;
        vm.isDisable = false;
        setFocus('saveBtn');
      } else {
        setFocus('part-checkbox');
        vm.isSearchDisable = false;
      }
    };

    vm.reset = () => {
      vm.searchText = null;
      vm.partList = angular.copy(vm.copyPartList);
      setFocus('searchPart');
      vm.isSearchDisable = false;
    };

    vm.confirmSelect = () => {
      $mdDialog.cancel(vm.selectedRow);
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
