(function () {
  'use strict';

  angular
    .module('app.transaction')
    .controller('SelectMultiPartComponentPopUpController', SelectMultiPartComponentPopUpController);

  function SelectMultiPartComponentPopUpController($mdDialog, CORE, USER, BaseService, data, ComponentFactory, RFQTRANSACTION) {
    const vm = this;
    vm.CORE = CORE;
    vm.objPart = data;
    vm.partList = [];
    vm.objPart.mfgType = vm.objPart.mfgType.toUpperCase();
    vm.mfgType = CORE.MFG_TYPE;
    vm.query = {
      order: ''
    };
    vm.isDisable = true;
    //vm.isOtherPart = false;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;

    function setPartDataAfterApiResponse(apiDataObj) {
      //const partResponse = apiDataObj;
      const mfgPartList = apiDataObj;
      //const otherPartList = partResponse[1];
      _.map(mfgPartList, (data) => {
        if (data) {
          data.mfgFullName = stringFormat('({0}){1}', data.mfgCode, data.mfgName);
          data.rohsName = data.name;
          data.actualmfgFullName = data.refSupplierMfgpnComponentID ? stringFormat('({0}){1}', data.mfgPartManufacturerCode, data.mfgPartManufacturerName) : null;
          data.actualmfgPartNumber = data.mfgPartNumber;
          if (data.isGoodPart === vm.CORE.PartCorrectList.CorrectPart) {
            data.labelGoodPart = vm.CORE.PartCorrectLabelList.CorrectPart;
          } else if (data.isGoodPart === vm.CORE.PartCorrectList.IncorrectPart) {
            data.labelGoodPart = vm.CORE.PartCorrectLabelList.IncorrectPart;
          } else if (data.isGoodPart === vm.CORE.PartCorrectList.UnknownPart) {
            data.labelGoodPart = vm.CORE.PartCorrectLabelList.UnknownPart;
          }
          data.isSelect = false;
        }
      });
      vm.partList = mfgPartList;
    }

    const getPartList = () => {
      /*While change in this API please take care same change on part master detail and add part popup also*/
      vm.cgBusyLoading = ComponentFactory.getComponentDetailByPN().query({ partNumber: vm.objPart ? vm.objPart.mfgPart : null, mfgType: vm.objPart ? vm.objPart.mfgType : null }).$promise.then((mfgparts) => {
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

    vm.confirmSelect = () => {
      $mdDialog.cancel(vm.selectedRow);
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };

    vm.gotoSupplier = (item) => {
      switch (item.supplier) {
        case RFQTRANSACTION.PRICING_SOURCE.DigiKey:
          BaseService.searchToDigikey(vm.mfgType.MFG === vm.objPart.mfgType ? item.mfgPN : item.actualmfgPartNumber);
          break;
        case RFQTRANSACTION.PRICING_SOURCE.Mouser:
          BaseService.searchToMouser(vm.mfgType.MFG === vm.objPart.mfgType ? item.mfgPN : item.actualmfgPartNumber);
          break;
        case RFQTRANSACTION.PRICING_SOURCE.TTI:
          BaseService.searchToTTI(vm.mfgType.MFG === vm.objPart.mfgType ? item.mfgPN : item.actualmfgPartNumber);
          break;
        case RFQTRANSACTION.PRICING_SOURCE.Newark:
          BaseService.searchToNewark(vm.mfgType.MFG === vm.objPart.mfgType ? item.mfgPN : item.actualmfgPartNumber);
          break;
        case RFQTRANSACTION.PRICING_SOURCE.Arrow:
          BaseService.searchToArrow(vm.mfgType.MFG === vm.objPart.mfgType ? item.mfgPN : item.actualmfgPartNumber);
          break;
        case RFQTRANSACTION.PRICING_SOURCE.Avnet:
          BaseService.searchToAvnet(vm.mfgType.MFG === vm.objPart.mfgType ? item.mfgPN : item.actualmfgPartNumber);
          break;
        case RFQTRANSACTION.PRICING_SOURCE.HEILIND:
          BaseService.searchToHeilind(vm.mfgType.MFG === vm.objPart.mfgType ? item.mfgPN : item.actualmfgPartNumber);
          break;
      }
    };
  }
})();
