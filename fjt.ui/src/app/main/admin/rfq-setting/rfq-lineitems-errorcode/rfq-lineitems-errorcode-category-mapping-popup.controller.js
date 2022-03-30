(function () {
  'use strict';
  angular
    .module('app.admin.rfqsetting')
    .controller('RFQLineitemsErrorcodeCategoryMappingPopupController', RFQLineitemsErrorcodeCategoryMappingPopupController);
  /** @ngInject */
  function RFQLineitemsErrorcodeCategoryMappingPopupController($scope, $mdDialog, $q, data, CORE, USER, DialogFactory, RFQSettingFactory, BaseService) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.categoryList = [];
    vm.errorCodeModel = {};

    init();
    function init() {
      if (data) {
        vm.errorCodeModel = {
          id: data.id,
          logicID: data.logicID,
          displayName: data.displayName,
        }
      }
      vm.cgBusyLoading = $q.all([getErrorCodeCategory(), getErrorCodeCategoryMapping()]).then((responses) => {
        _.each(vm.categoryList, (item) => {
          item.isChecked = false;
          var mappingDeatils = _.find(vm.categoryMappingList, { 'categoryID': item.id });
          if (mappingDeatils) {
            item.isChecked = true;
          }
        });

      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    function getErrorCodeCategory() {
      return RFQSettingFactory.getErrorCodeCategory().query().$promise.then((response) => {
        if (response.data) {
          vm.categoryList = response.data;
          return response.data;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    function getErrorCodeCategoryMapping() {
      return RFQSettingFactory.getErrorCodeCategoryMapping().query({ errorCodeID: vm.errorCodeModel.id }).$promise.then((response) => {
        if (response.data) {
          vm.categoryMappingList = response.data;
          return response.data;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    vm.saveErrorCode = () => {
      if (vm.ErrorcodeMappingForm.$invalid && !vm.isChange) {// || !vm.checkFormDirty(vm.ErrorcodeMappingForm) 
        BaseService.focusRequiredField(vm.ErrorcodeMappingForm);
        return;
      }
      var model = [];
      _.each(vm.categoryList, (item) => {
        var mappingDeatils = _.find(vm.categoryMappingList, { 'categoryID': item.id });
        if (!mappingDeatils && item.isChecked) {
          vm.categoryMappingList.push({ id: 0, categoryID: item.id, errorCodeId: vm.errorCodeModel.id });
        }
        else if (mappingDeatils && !item.isChecked) {
          if (mappingDeatils.id == 0) {
            _.remove(vm.categoryMappingList, { 'categoryID': item.id });
          }
          else {
            mappingDeatils.isDeleted = true;
          }
        }
      });
      var mappingDetails = {
        errorCodeID: vm.errorCodeModel.id,
        categoryMappingList: vm.categoryMappingList
      };
      return vm.cgBusyLoading = RFQSettingFactory.saveErrorCodeMapping().save(mappingDetails).$promise.then((response) => {
        if (response) {
          BaseService.currentPagePopupForm.pop();
          $mdDialog.hide();
        }
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });
    }

    vm.cancel = () => {
      if (vm.checkFormDirty(vm.ErrorcodeMappingForm)) {
        let data = {
          form: vm.ErrorcodeMappingForm
        }
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    // Check Form Dirty state on state change and reload browser
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.ErrorcodeMappingForm);
    });
  }
})();
