(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('PrinterPopUpController', PrinterPopUpController);

  function PrinterPopUpController($mdDialog, $timeout, $state, CORE, USER,
    DialogFactory, BaseService, $http, $scope, GenericCategoryFactory, $q) {

    const vm = this;
    let printObj = {};
    let CategoryTypeObjList = angular.copy(CORE.CategoryType);
    /* GenericCategory dropdown fill up */
    let getAllGenericCategoryByCategoryType = (item) => {
      let GencCategoryType = [];
      let GenericCategoryAllData = [];
      GencCategoryType.push(CORE.CategoryType.Printer.Name);
      GencCategoryType.push(CORE.CategoryType.PrintFormat.Name);
      let listObj = {
        GencCategoryType: GencCategoryType
      }
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((genericCategories) => {
        GenericCategoryAllData = genericCategories.data;
        //get printer list
        vm.PrinterList = _.filter(GenericCategoryAllData, (item) => {
          return item.categoryType == CategoryTypeObjList.Printer.Name && item.isActive == true;
        });
        //get Label Templates list
        vm.PrintFormatList = _.filter(GenericCategoryAllData, (item) => {
          return item.categoryType == CORE.LabelConstant.LabelTemplate.Name && item.isActive == true;
        });
        return $q.resolve(vm.PrintFormatList);
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    var autocompletePromise = [getAllGenericCategoryByCategoryType()];
    vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
      initAutoComplete();
    }).catch((error) => {
      return BaseService.getErrorLog(error);
    });
    let initAutoComplete = () => {
      vm.autoCompletePrinter = {
        columnName: 'gencCategoryName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: null,
        inputName: CategoryTypeObjList.Printer.Name,
        placeholderName: CategoryTypeObjList.Printer.Title,
        addData: { headerTitle: CategoryTypeObjList.Printer.Title },
        isRequired: true,
        isAddnew: true,
        callbackFn: getAllGenericCategoryByCategoryType,
        onSelectCallbackFn: function (item) {
          vm.PrintDetail = item;
        }
      }
      vm.autoCompletePrintFormat = {
        columnName: 'gencCategoryName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: null,
        inputName: CORE.LabelConstant.LabelTemplate.Name,
        placeholderName: CORE.LabelConstant.LabelTemplate.Title,
        addData: { headerTitle: CORE.CategoryType.PrintFormat.Title },
        isRequired: true,
        isAddnew: false,
        callbackFn: getAllGenericCategoryByCategoryType,
        onSelectCallbackFn: function (item) {
          vm.PrintFormatDetail = item;
        }
      }
    }

    vm.savePrinterDetail = () => {
      printObj = {
        'ServiceName': vm.PrintFormatDetail.gencCategoryName,
        'reqName': 'Web Service',
        'PrinterName': vm.PrintDetail.gencCategoryName,
        'isSucess': true
      }
      $mdDialog.cancel(printObj);
    }
    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.AddPrinterForm);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    }
  }
})();
