(function () {
  'use strict';
  angular
    .module('app.admin.aliasPartsValidation')
    .controller('CopyAliasPartsValidationsPopupController', CopyAliasPartsValidationsPopupController);

  /** @ngInject */
  function CopyAliasPartsValidationsPopupController($mdDialog, CORE, USER, data, BaseService, ComponentFactory, AliasPartsValidationFactory, DialogFactory) {
    const vm = this;
    vm.data = data;
    if (data) {
      vm.fromFunctionalTypeId = data.refRfqPartTypeId;
      vm.fromValidationsDetailsId = data.id;
      vm.fromPartGroupId = data.type;
      vm.fromFunctionalTypeName = data.partTypeName;
      vm.fromPartGroupname = data.typeName;
    }
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.disablecopy = true;

    //get Part Type List
    let getPartTypeList = () => {
      return ComponentFactory.getPartTypeList().query().$promise.then((res) => {
        vm.partTypeList = res.data;
        var fromFunctionalType = _.find(vm.partTypeList, (item) => { return item.id == vm.fromFunctionalTypeId });
        if (fromFunctionalType) {
          fromFunctionalType.isDeleted = true;
        }
        return vm.partTypeList;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    getPartTypeList();

    vm.changeSelectAll = () => {
      _.each(vm.partTypeList, (item) => {
        if (!item.isDeleted)
          item.isChecked = vm.selectAll;
      })
      let selectedItem = _.find(vm.partTypeList, (item) => {
        return item.isChecked;
      })
      if (selectedItem)
        vm.disablecopy = false;
      else
        vm.disablecopy = true;
    }

    vm.selectChange = () => {
      let unselectedItem = _.find(vm.partTypeList, (item) => {
        return !item.isChecked;
      })
      if (unselectedItem)
        vm.selectAll = false;
      else
        vm.selectAll = true;

      let selectedItem = _.find(vm.partTypeList, (item) => {
        return item.isChecked;
      })
      if (selectedItem)
        vm.disablecopy = false;
      else
        vm.disablecopy = true;
    }

    vm.CopyAliasPartValidations = () => {
      if (vm.disablecopy) {
        BaseService.focusRequiredField(vm.CopyAliasPartValidationForm);
        return;
      }
      
      var copyValidationsObj = {};
      copyValidationsObj.toFunctionalTypeIds = _.map(_.filter(vm.partTypeList, (item) => { return item.isChecked }), (a) => { return a.id });
      if (copyValidationsObj.toFunctionalTypeIds && copyValidationsObj.toFunctionalTypeIds.length > 0) {
        copyValidationsObj.toFunctionalTypeIds = copyValidationsObj.toFunctionalTypeIds.join(",");

        copyValidationsObj.fromFunctionalTypeId = vm.fromFunctionalTypeId;
        copyValidationsObj.fromPartGroupId = vm.fromPartGroupId;
        copyValidationsObj.fromValidationsDetailsId = vm.fromValidationsDetailsId;
        copyValidationsObj.isOverride = vm.isOverride;

        let messageContent = {};
        if (vm.isOverride) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.ALIAS_PART_VLIDATIONS_COPY_WITH_OVERRIDE);          
        } else {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.ALIAS_PART_VLIDATIONS_COPY);        
        }
        messageContent.message = stringFormat(messageContent.message, vm.fromFunctionalTypeName);        

        var obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = AliasPartsValidationFactory.copyAliasPartalidations().query(copyValidationsObj).$promise.then((response) => {
              if (response && response.data) {
                vm.CopyAliasPartValidationForm.$setPristine();
                $mdDialog.hide();
              }
            }).catch((error) => {
              return BaseService.getErrorLog(error);
            });
          }
        }, () => {
        });
      }
    }

    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.CopyAliasPartValidationForm);
      if (isdirty) {
        let data = {
          form: vm.CopyAliasPartValidationForm
        }
        BaseService.showWithoutSavingAlertForPopUp(data);
        
      } else {
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel();
      }
    };

    // Check Form Dirty state on state change and reload browser
    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.CopyAliasPartValidationForm];
    });

    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };
  }

})();
