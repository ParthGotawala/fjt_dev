(function () {
  'use strict';

  angular
    .module('app.transaction.searchMaterial')
    .controller('SearchMaterialPrintUtilityPopUpController', SearchMaterialPrintUtilityPopUpController);

  /** @ngInject */
  function SearchMaterialPrintUtilityPopUpController($scope, $timeout, $q, $mdDialog, ComponentFactory, data, CORE, USER, TRANSACTION, BaseService, ReceivingMaterialFactory, LabelTemplatesFactory, SearchMaterialFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    const categoryTypeObjList = angular.copy(CORE.CategoryType);
    let getPrinterLocalStorageValue = getLocalStorageValue('Printer');
    let getPrintFormatLocalStorageValue = getLocalStorageValue('PrintFormateOfSearchMaterial');
    let getNoOfPrintLocalStorageValue = getLocalStorageValue('NoOfPrint');
    let defaultLabelType = null;
    vm.labelConstant = CORE.LabelConstant;
    vm.printData = data;
    let updatePrinterObject;
    let updateLableObject;
    vm.focusAssyAuto = false;
    vm.searchMaterialPrintOption = TRANSACTION.SearchMaterialPrintOption;
    vm.printSearchMaterialLabel = {
      isCallFromRow: vm.printData ? vm.printData.isCallFromRow : false,
      printLableOption: vm.searchMaterialPrintOption[3].value,
      printLable: vm.printData && vm.printData.isCallFromRow === true ? vm.printData.printLabelString : null,
      noprint: null,
      isNoPrint: false,
      isPrinter: false,
      isLabelPrinter: false
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    const getAutoCompleteData = () => LabelTemplatesFactory.getPrinterAndLabelTemplateData().query().$promise.then((autoCompleteData) => {
      vm.PrinterList = autoCompleteData.data.printer;
      vm.LabelTemplateList = autoCompleteData.data.labeltemplate;
      return $q.resolve(vm.LabelTemplateList);
    }).catch((error) => BaseService.getErrorLog(error));

    const initautoComplete = () => {
      vm.autoCompleteAssy = {
        columnName: 'searchText',
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'searchText',
        placeholderName: 'Type here to search',
        isRequired: true,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.printSearchMaterialLabel.assyId = item.id;
            if (vm.printSearchMaterialLabel.printLableOption === vm.searchMaterialPrintOption[0].value) {
              vm.printSearchMaterialLabel.printLable = item.nickName;
            } else if (vm.printSearchMaterialLabel.printLableOption === vm.searchMaterialPrintOption[1].value) {
              vm.printSearchMaterialLabel.printLable = item.PIDCode;
            } else if (vm.printSearchMaterialLabel.printLableOption === vm.searchMaterialPrintOption[2].value) {
              vm.printSearchMaterialLabel.printLable = item.mfgPN;
            }
          } else {
            vm.printSearchMaterialLabel.assyId = null;
            vm.printSearchMaterialLabel.printLable = null;
          }
        },
        onSearchFn: (query) => {
          const searchObj = {
            query: query
          };

          if (vm.printSearchMaterialLabel.printLableOption === vm.searchMaterialPrintOption[0].value) {
            searchObj.type = 'NickName';
          } else if (vm.printSearchMaterialLabel.printLableOption === vm.searchMaterialPrintOption[1].value) {
            searchObj.type = 'AssyID';
          } else if (vm.printSearchMaterialLabel.printLableOption === vm.searchMaterialPrintOption[2].value) {
            searchObj.type = 'Assy#';
          }
          return getAssySearch(searchObj);
        }
      };

      vm.autoCompletePrinter = {
        columnName: 'gencCategoryName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.printSearchMaterialLabel ? vm.printSearchMaterialLabel.printerId : null,
        inputName: categoryTypeObjList.Printer.Name,
        inputId: 'printer',
        placeholderName: categoryTypeObjList.Printer.Title,
        addData: { headerTitle: categoryTypeObjList.Printer.Title },
        isRequired: true,
        isAddnew: true,
        callbackFn: getAutoCompleteData,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.printSearchMaterialLabel.printerName = item.gencCategoryName;
            updatePrinterObject = item;
            vm.setLocalStorageValue();
          } else {
            vm.printSearchMaterialLabel.printerName = null;
            vm.printSearchMaterialLabel.printerId = null;
            $scope.$broadcast(vm.autoCompletePrinter ? vm.autoCompletePrinter.inputName : null, null);
          }
        }
      };

      vm.autoCompleteLabelTemplate = {
        columnName: 'Name',
        keyColumnName: 'id',
        keyColumnId: vm.printSearchMaterialLabel ? vm.printSearchMaterialLabel.printFormateId : null,
        inputName: vm.labelConstant.LabelTemplate.Name,
        placeholderName: vm.labelConstant.LabelTemplate.Title,
        isRequired: true,
        callbackFn: getAutoCompleteData,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.printSearchMaterialLabel.printFormateId = item.id;
            vm.printSearchMaterialLabel.printFormateName = item.Name;
            updateLableObject = item;
            vm.setLocalStorageValue();
          } else {
            $scope.$broadcast(vm.autoCompleteLabelTemplate ? vm.autoCompleteLabelTemplate.inputName : null, null);
            vm.printSearchMaterialLabel.printFormateId = null;
            vm.printSearchMaterialLabel.printFormateName = null;
          }
        }
      };
    };

    vm.setLocalStorageValue = () => {
      if (vm.printSearchMaterialLabel.isNoPrint) {
        BaseService.setPrintStorage('NoOfPrint', vm.printSearchMaterialLabel.noprint);
      } else {
        removeLocalStorageValue('NoOfPrint');
      }
      if (vm.printSearchMaterialLabel.isPrinter) {
        BaseService.setPrintStorage('Printer', updatePrinterObject);
      } else {
        removeLocalStorageValue('Printer');
      }
      if (vm.printSearchMaterialLabel.isLabelPrinter) {
        BaseService.setPrintStorage('PrintFormateOfSearchMaterial', updateLableObject);
      } else {
        removeLocalStorageValue('PrintFormateOfSearchMaterial');
      }
    };

    const getAssySearch = (searchObj) => ComponentFactory.getAllAssemblyBySearch().save({ listObj: searchObj }).$promise.then((assyIDList) => {
      if (assyIDList && assyIDList.data.data) {
        vm.assyList = assyIDList.data.data;
        if (searchObj.type === 'NickName') {
          vm.assyList = _.orderBy(_.uniqBy(vm.assyList, 'nickName'), 'nickName');
        }

        _.map(vm.assyList, (data) => {
          if (searchObj.type === 'NickName') {
            data.searchText = data.nickName;
          } else if (searchObj.type === 'AssyID') {
            data.searchText = data.PIDCode;
          } else if (searchObj.type === 'Assy#') {
            data.searchText = data.mfgPN;
          }
        });
      }
      else {
        vm.assyList = [];
      }
      return vm.assyList;
    }).catch((error) => BaseService.getErrorLog(error)
    );

    vm.changePrintLableOption = () => {
      $scope.$broadcast(vm.autoCompleteAssy ? vm.autoCompleteAssy.inputName : null, null);
      vm.printSearchMaterialLabel.printLable = vm.printData && vm.printData.isCallFromRow === true ? vm.printData.printLabelString : null;
    };

    const setInitialData = () => {
      vm.changePrintLableOption();
      getPrinterLocalStorageValue = getLocalStorageValue('Printer');
      getPrintFormatLocalStorageValue = getLocalStorageValue('PrintFormateOfSearchMaterial');
      getNoOfPrintLocalStorageValue = getLocalStorageValue('NoOfPrint');

      const autocompletePromise = [getAutoCompleteData()];
      vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
        if (getPrinterLocalStorageValue && getPrinterLocalStorageValue.Printer) {
          vm.printSearchMaterialLabel.printerId = getPrinterLocalStorageValue.Printer.gencCategoryID;
          vm.printSearchMaterialLabel.printerName = getPrinterLocalStorageValue.Printer.gencCategoryName;
          vm.printSearchMaterialLabel.isPrinter = true;
        } else {
          vm.printSearchMaterialLabel.printerId = null;
          vm.printSearchMaterialLabel.printerName = null;
        }
        if (getPrintFormatLocalStorageValue && getPrintFormatLocalStorageValue.PrintFormate) {
          defaultLabelType = _.find(CORE.LABELTEMPLATE_DEFAULTLABELTYPE, { name: 'Search Material' });
          vm.printSearchMaterialLabel.printFormateId = getPrintFormatLocalStorageValue.PrintFormate.id;
          vm.printSearchMaterialLabel.printFormateName = getPrintFormatLocalStorageValue.PrintFormate.Name;
          vm.printSearchMaterialLabel.isLabelPrinter = true;
        } else {
          vm.printSearchMaterialLabel.printFormateId = null;
          vm.printSearchMaterialLabel.printFormateName = null;
        }
        if (getNoOfPrintLocalStorageValue && getNoOfPrintLocalStorageValue.NoOfPrint) {
          vm.printSearchMaterialLabel.noprint = getNoOfPrintLocalStorageValue.NoOfPrint;
          vm.printSearchMaterialLabel.isNoPrint = true;
        } else {
          vm.printSearchMaterialLabel.noprint = null;
        }

        initautoComplete();
        $timeout(() => {
          if (vm.formSearchMaterialPrintLabel) {
            vm.formSearchMaterialPrintLabel.$setPristine();
            vm.formSearchMaterialPrintLabel.$setUntouched();
          }
        });
      }).catch((error) => BaseService.getErrorLog(error));
    };

    setInitialData();

    vm.printSearchLabel = () => {
      if (!vm.formSearchMaterialPrintLabel.$valid && BaseService.focusRequiredField(vm.formSearchMaterialPrintLabel)) {
        return;
      }

      const printList = [
        {
          printLabelForSearchMaterial: vm.printSearchMaterialLabel.printLable,
          reqName: 'Print',
          numberOfPrint: vm.printSearchMaterialLabel.noprint,
          PrinterName: vm.printSearchMaterialLabel.printerName,
          ServiceName: vm.printSearchMaterialLabel.printFormateName,
          printType: 'Print',
          pageName: TRANSACTION.TRANSACTION_SEARCH_MATERIAL_LABEL
        }];

      vm.cgBusyLoading = ReceivingMaterialFactory.printLabelTemplate().query({ printObj: printList }).$promise.then((printResponse) => {
        if (printResponse && printResponse.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          if (vm.printSearchMaterialLabel.isCallFromRow) {
            $mdDialog.cancel();
          } else {
            setInitialData();
            if (vm.autoCompleteAssy && vm.printSearchMaterialLabel.printLableOption !== vm.searchMaterialPrintOption[3].value) {
              vm.focusAssyAuto = true;
            } else {
              setFocus('printLable')
              vm.focusAssyAuto = false;
            }
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.goToPrinterList = () => {
      BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_PRINTER_TYPE_STATE, {});
    };

    vm.goToPrinterLabelList = () => {
      BaseService.openInNew(USER.ADMIN_LABELTEMPLATE_PRINTER_FORMAT_STATE, {});
    };

    vm.goToPartList = () => {
      BaseService.goToPartList();
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.formSearchMaterialPrintLabel);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel();
      }
    };

    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.formSearchMaterialPrintLabel];
    });
  }
})();
