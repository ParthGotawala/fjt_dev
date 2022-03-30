(function () {
  'use restrict';

  angular.module('app.core')
    .controller('ManagePuchaseInspectionRequirementPopupController', ManagePuchaseInspectionRequirementPopupController);

  /* @ngInject */
  function ManagePuchaseInspectionRequirementPopupController(data, $mdDialog, DialogFactory, CORE, BaseService, $timeout, PurchaseInspectionRequirementFactory, GenericCategoryFactory, $q, USER) {
    var vm = this;
    vm.isPurchaseRequirementFormDirty = true;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.requirmentType = CORE.RequirmentType;
    vm.LabelConstant = CORE.LabelConstant;
    vm.maxLengthForDescription = 500;
    vm.isCustomerComment = data ? (data.isCustomerComment ? data.isCustomerComment : false) : false ;
    vm.RadioGroup = {
      isActive: {
        array: CORE.ActiveRadioGroup
      }
    };
    const PartRequirementCategory = CORE.CategoryType.PartRequirementCategory;
    vm.themeClass = CORE.THEME;

    vm.purchaseInspectionModel = {
      requiementType: 'R',
      requirement: data && data.Name ? data.Name : data && data.requirement ? data.requirement : null,
      isrequirementOnly: data && data.isrequirementOnly ? data.isrequirementOnly : null,
      isActive: true,
      partRequirementCategoryID: data && data.partRequirementCategoryId ? data.partRequirementCategoryId : null
    };

    if (data && (data.id || data.id == 0)) {
      vm.purchaseInspectionModel.id = data.id;
    }

    if (vm.isCustomerComment) {
      vm.purchaseInspectionModel.requiementType = 'C';
    }

    const getPartRequirementCategoryList = () => {
      const GencCategoryType = [PartRequirementCategory.Name];
      const listObj = {
        GencCategoryType,
        isActive: true
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((partRequirementCategoryResponse) => {
        if (partRequirementCategoryResponse && partRequirementCategoryResponse.data) {
          vm.partrequirementcategorylist = partRequirementCategoryResponse.data;
          _.each(partRequirementCategoryResponse.data, (item) => item.gencCategoryDisplayName = item.gencCategoryCode ? stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.gencCategoryCode, item.gencCategoryName) : item.gencCategoryName)
          return $q.resolve(vm.partrequirementcategorylist);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const autocompletePromise = [getPartRequirementCategoryList()];
    vm.cgBusyLoading = $q.all(autocompletePromise).then(() => initAutoComplete()).catch((error) => BaseService.getErrorLog(error));

    const initAutoComplete = () => {
      vm.autoCompletePartRequirementCategory = {
        columnName: 'gencCategoryDisplayName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.purchaseInspectionModel.partRequirementCategoryID || null,
        inputName: PartRequirementCategory.Title,
        placeholderName: PartRequirementCategory.singleLabel,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_PARTREQUIREMENTCATEGORY_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CORE.PageName.PartRequirementCategory,
          headerTitle: PartRequirementCategory.singleLabel
        },
        isRequired: true,
        isAddnew: true,
        callbackFn: getPartRequirementCategoryList
      };
    };

    //Check Duplicate Purchase Inspection Requirement
    vm.checkDuplicateName = (event) => {
      vm.isduplicate = false;

      if (vm.purchaseInspectionModel.requirement) {
        vm.cgBusyLoading = PurchaseInspectionRequirementFactory.checkDuplicatePurchaseRequirement().save({
          id: (vm.purchaseInspectionModel.id || vm.purchaseInspectionModel.id == 0) ? vm.purchaseInspectionModel.id : null,
          requiementType: vm.purchaseInspectionModel.requiementType,
          requirement: vm.purchaseInspectionModel.requirement,
          refTableName: CORE.TABLE_NAME.PURCHASE_INSPECTION_REQUIREMENT
        }).$promise.then((res) => {
          if (res && res.status == CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicate) {
            vm.isduplicate = true;

            let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
            messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.PURCHASE_INSPECTION_REQUIREMENT.PurchaseRequirement);

            let uniqueObj = {
              messageContent: messageContent,
              controlName: 'requirement'
            };

            let obj = {
              messageContent: uniqueObj.messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK,
              multiple: true
            };

            vm.purchaseInspectionModel.requirement = null;

            DialogFactory.messageAlertDialog(obj).then((yes) => {
              if (uniqueObj.controlName) {
                setFocusByName(uniqueObj.controlName);
              }
            }, (cancel) => {
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    }

    // Edit Purchase Inspection Requirement
    if (vm.purchaseInspectionModel.id || vm.purchaseInspectionModel.id == 0) {
      vm.cgBusyLoading = PurchaseInspectionRequirementFactory.getpurchaseInspectionRequirement().query({ id: vm.purchaseInspectionModel.id }).$promise.then((response) => {
        if (response && response.data) {
          vm.purchaseInspectionModel = response.data;
          vm.autoCompletePartRequirementCategory.keyColumnId = vm.purchaseInspectionModel.partRequirementCategoryID;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    // Save Purchase Inspection Requirement
    vm.savePurchaseInspection = () => {
      if (BaseService.focusRequiredField(vm.purchaseInspectionForm, vm.isPurchaseRequirementFormDirty)) {
        return;
      }

      vm.purchaseInspectionModel.partRequirementCategoryID = vm.autoCompletePartRequirementCategory.keyColumnId || null,

        vm.cgBusyLoading = PurchaseInspectionRequirementFactory.savePurchaseInspection().save(vm.purchaseInspectionModel).$promise.then((res) => {
          if (res.data && res.data.id) {
             $mdDialog.cancel(res.data);
          }
          getPartRequirementCategoryList();
        }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    angular.element(() => focusOnFirstEnabledFormField(vm.purchaseInspectionForm));

    vm.goToGenericCategoryPartRequirementCategoryList = () => BaseService.goToGenericCategoryPartRequirementCategoryList();

    vm.cancel = () => {
      const isdirty = vm.purchaseInspectionForm.$dirty;
      if (isdirty) {
        const data = {
          form: vm.purchaseInspectionForm
        }
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        $mdDialog.cancel();
      }
    }
  }
})();
