(function () {
  'use strict';

  angular
  angular.module('app.core')
    .controller('PurchaseInspectionUpdateMultipleCategoryPopupController', PurchaseInspectionUpdateMultipleCategoryPopupController);

  /** @ngInject */
  function PurchaseInspectionUpdateMultipleCategoryPopupController($mdDialog, $timeout, $q, CORE, USER, data, BaseService, GenericCategoryFactory, DialogFactory, PurchaseInspectionRequirementFactory) {
    const vm = this;
    const objPartRequirement = angular.copy(data);
    const PartRequirementCategory = CORE.CategoryType.PartRequirementCategory;
    vm.RadioGroup = {
      isActive: {
        array: CORE.ActiveRadioGroup
      }
    };
    vm.purchaseInspectionModel = {
      changeCategory: false,
      changeStatus: false,
      status: null
    };
    vm.requirmentType = CORE.RequirmentType;
    vm.assyData = objPartRequirement.rowData;

    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.disablecopy = true;
    vm.ErrorTypes = CORE.PRICING_ERROR_TYPES;
    vm.objPartRequirement = {};

    const getPartRequirementCategoryList = () => {
      const GencCategoryType = [CORE.LabelConstant.MFGCODE_COMMENT.PartRequirementCategoryType];
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

    vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
      initAutoComplete();
    }).catch((error) => {
      return BaseService.getErrorLog(error);
    });

    /*Update method*/
    vm.UpdatePartsAttributes = () => {
      if (vm.UpdatePurchaseInspectionCategoryForm.$invalid ||
        (!vm.purchaseInspectionModel.changeStatus && !vm.purchaseInspectionModel.changeCategory)
      ) {
        BaseService.focusRequiredField(vm.UpdatePurchaseInspectionCategoryForm);
        return;
      }

      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.PART_REQUIREMENT_CATEGORY_UPDATE_CONFIRMATION_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          const updatePartRequirementInfo = { ids: _.map(vm.assyData, (item) => item.id) };
          updatePartRequirementInfo.data = {};
          if (vm.purchaseInspectionModel.changeCategory) {
            updatePartRequirementInfo.data.partRequirementCategoryID = vm.autoCompletePartRequirementCategory.keyColumnId;
          }
          if (vm.purchaseInspectionModel.status) {
            updatePartRequirementInfo.data.isActive = vm.purchaseInspectionModel.status;
          }

          vm.cgBusyLoading = PurchaseInspectionRequirementFactory.updatePartRequiremmentCategorys().query({ updatePartRequirementInfo: updatePartRequirementInfo }).$promise.then((res) => {
            if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              BaseService.currentPagePopupForm.pop();
              DialogFactory.closeDialogPopup(res.data);
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }, () => {
      });
    };
    vm.goToGenericCategoryPartRequirementCategoryList = () => BaseService.goToGenericCategoryPartRequirementCategoryList();

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.UpdatePurchaseInspectionCategoryForm);
      if (isdirty) {
        const data = {
          form: vm.UpdatePurchaseInspectionCategoryForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
        $timeout(() => {
          vm.clickCancel = false;
        }, 300);
      } else {
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel();
      }
    };

    // Check Form Dirty state on state change and reload browser
    angular.element(() => BaseService.currentPagePopupForm = [vm.UpdatePurchaseInspectionCategoryForm]);

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    };
  };
})();
