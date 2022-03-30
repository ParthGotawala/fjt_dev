(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('SupplierQuoteCopyPopupController', SupplierQuoteCopyPopupController);

  /** @ngInject */
  function SupplierQuoteCopyPopupController($scope, $q, $state, data, $timeout, CORE, $mdDialog, SupplierQuoteFactory, DialogFactory, USER, $filter, BaseService) {
    const vm = this;
    vm.LabelConstant = CORE.LabelConstant;
    vm.supplierQuote = {
      id: data.id,
      copyFromSupplierID: data.id,
      supplierID: data.supplierID,
      mfgCode: data.mfgCode,
      mfgPN: data.mfgPN,
      isExisting: true,
      quoteDate: new Date(),
      isConfirmationTaken: data ? data.confirmationTaken : false,
      quoteNumber: data.quoteNumber
    };
    vm.DATE_PICKER = CORE.DATE_PICKER;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.autoFocusQuoteNumber = false;
    vm.IsPickerOpen = {};
    vm.IsPickerOpen[vm.DATE_PICKER.quoteDate] = false;

    vm.goToManufacturerList = () => {
      BaseService.goToManufacturerList();
    };
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };
    vm.goToManufacturer = () => {
      BaseService.goToManufacturer(data.mfgcodeID);
    };
    vm.goToComponentDetailTab = () => {
      BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG, data.partID);
    };
    vm.goToSupplierList = () => {
      BaseService.goToSupplierList();
    };
    vm.goToSupplierDetail = () => {
      BaseService.goToSupplierDetail(data.supplierID);
    };
    vm.goToSupplierQuoteList = () => {
      BaseService.goToSupplierQuoteList();
    };
    vm.goToSupplierQuoteDetail = () => {
      BaseService.goToSupplierQuoteWithPartDetail(data.id);
    };
    vm.headerdata = [
      {
        label: vm.LabelConstant.SupplierQuote.Supplier,
        value: data.supplier,
        displayOrder: 1,
        labelLinkFn: vm.goToSupplierList,
        valueLinkFn: vm.goToSupplierDetail,
        isCopy: true
      },
      {
        label: vm.LabelConstant.SupplierQuote.Quote,
        value: data.quoteNumber,
        displayOrder: 2,
        labelLinkFn: vm.goToSupplierQuoteList,
        valueLinkFn: vm.goToSupplierQuoteDetail,
        isCopy: true
      },
      {
        label: vm.LabelConstant.MFG.MFG,
        value: data.mfgName,
        displayOrder: 3,
        labelLinkFn: vm.goToManufacturerList,
        valueLinkFn: vm.goToManufacturer,
        isCopy: true
      },
      {
        label: vm.LabelConstant.MFG.MFGPN,
        value: data.mfgPN,
        displayOrder: 4,
        labelLinkFn: vm.goToPartList,
        valueLinkFn: vm.goToComponentDetailTab,
        isCopy: true,
        isCopyAheadLabel: true,
        imgParms: {
          imgPath: vm.rohsImagePath + data.rohsIcon,
          imgDetail: data.rohsName
        }
      }];
    vm.checkQuoteNumberUnique = () => {
      if (vm.supplierQuote.quoteNumber) {
        const checkObject = {
          quoteNumber: vm.supplierQuote.quoteNumber,
          supplierID: data.supplierID
        };
        vm.cgBusyLoading = SupplierQuoteFactory.checkUniqueSupplierQuoteNumber().query(checkObject).$promise.then((response) => {
          if (response.data && response.data.length > 0) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
            messageContent.message = stringFormat(messageContent.message, `Supplier wise ${vm.LabelConstant.SupplierQuote.Quote}`);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.supplierQuote.quoteNumber = null;
                setFocus('quoteNumber');
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    const checkQuotePartUnique = (item) => {
      if (item) {
        vm.supplierQuote.selectedQuoteNumber = item.quoteNumber;
        const checkObject = {
          id: item.id,
          partID: data.partID
        };
        vm.cgBusyLoading = SupplierQuoteFactory.checkSupplierQuoteQuoteNumberAndPartID().query(checkObject).$promise.then((response) => {
          if (response.data && response.data.length > 0) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PART_ALREADY_EXIST_IN_SAME_SUPPLIER_QUOTE);
            messageContent.message = stringFormat(messageContent.message, `(${data.mfgCode}) ${data.mfgPN}`, item.quoteNumber);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                $scope.$broadcast(vm.autoCompleteQuoteNumber.inputName, null);
                vm.autoCompleteQuoteNumber.keyColumnId = null;
                vm.autoFocusQuoteNumber = true;
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.supplierQuote.selectedQuoteNumber = null;
      }
    };

    vm.save = () => {
      if (BaseService.focusRequiredField(vm.supplierQuoteCopyForm)) {
        vm.saveDisable = false;
        return;
      }
      if (vm.supplierQuote.isExisting) {
        vm.supplierQuote.id = vm.autoCompleteQuoteNumber.keyColumnId;
        vm.supplierQuote.supplierQuotePartDetID = data.supplierQuotePartDetID;
        vm.supplierQuote.partID = data.partID;
      }
      vm.supplierQuote.quoteDate = BaseService.getAPIFormatedDate(vm.supplierQuote.quoteDate);
      if (!vm.supplierQuote.isConfirmationTaken) {
        const supplierQuoteDet = {
          id: vm.supplierQuote.copyFromSupplierID
        };
        vm.cgBusyLoading = SupplierQuoteFactory.checkInActivePartOfSupplierQuote().query(supplierQuoteDet).$promise.then((response) => {
          if (response.data && response.data.isContainInactivePart) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.DUPLICATE_SUPPLIER_QUOTE_WITH_INACTIVE_PART);
            messageContent.message = stringFormat(messageContent.message, vm.supplierQuote.mfgPN, vm.supplierQuote.quoteNumber);
            const obj = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(obj).then(() => {
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            copySupplierQuote();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        copySupplierQuote();
      }
    };

    const copySupplierQuote = () => {
      vm.cgBusyLoading = SupplierQuoteFactory.copySupplierQuote().query({ supplierQuote: vm.supplierQuote }).$promise.then((response) => {
        if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          BaseService.currentPagePopupForm = [];
          const newQuoteId = vm.supplierQuote.isExisting ? vm.autoCompleteQuoteNumber.keyColumnId : response.data[0];
          $mdDialog.hide(newQuoteId);
        }
        if (response.status === CORE.ApiResponseTypeStatus.EMPTY) {
          if (vm.supplierQuote.isExisting) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PART_ALREADY_EXIST_IN_SAME_SUPPLIER_QUOTE);
            messageContent.message = stringFormat(messageContent.message, `(${data.mfgCode}) ${data.mfgPN}`, vm.supplierQuote.selectedQuoteNumber);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                $scope.$broadcast(vm.autoCompleteQuoteNumber.inputName, null);
                vm.autoCompleteQuoteNumber.keyColumnId = null;
                vm.autoFocusQuoteNumber = true;
              }
            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
            messageContent.message = stringFormat(messageContent.message, `Supplier wise ${vm.LabelConstant.SupplierQuote.Quote}`);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.supplierQuote.quoteNumber = null;
                setFocus('quoteNumber');
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const initAutoComplete = () => {
      vm.autoCompleteQuoteNumber = {
        columnName: 'quoteNumber',
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'quoteNumber',
        placeholderName: 'Quote#',
        isRequired: true,
        isAddnew: false,
        callbackFn: getSupplierQuoteList,
        onSelectCallbackFn: checkQuotePartUnique
      };
    };

    const getSupplierQuoteList = () => {
      const search = {
        id: data.id,
        supplierID: data.supplierID
      };
      return SupplierQuoteFactory.getSupplierQuoteNumberList().query(search).$promise.then((supplierQuote) => {
        if (supplierQuote && supplierQuote.data) {
          vm.quoteNumberList = supplierQuote.data;
          return $q.resolve(vm.quoteNumberList);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const getAutoCompleteData = () => {
      const autocompletePromise = [getSupplierQuoteList()];
      vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
        initAutoComplete();
      }).catch((error) => BaseService.getErrorLog(error));
    };


    getAutoCompleteData();

    /* For max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.goToSupplierQuoteList = () => {
      BaseService.goToSupplierQuoteList();
    };

    vm.changeRadioStatus = () => {
      vm.supplierQuote.quoteDate = new Date();
      vm.supplierQuote.selectedQuoteNumber = vm.supplierQuote.quoteNumber = vm.supplierQuote.supplierQuotePartDetID = vm.supplierQuote.reference = vm.autoCompleteQuoteNumber.keyColumnId = null;
    };

    /*Used to set focus*/
    function setFocus(id) {
      $timeout(() => {
        const myEl = angular.element(document.querySelector(`#${id}`));
        myEl.focus();
      });
    }

    vm.cancel = () => {
      if (vm.supplierQuoteCopyForm.$dirty) {
        const data = {
          form: vm.supplierQuoteCopyForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.supplierQuoteCopyForm);
    });
  }
})();
