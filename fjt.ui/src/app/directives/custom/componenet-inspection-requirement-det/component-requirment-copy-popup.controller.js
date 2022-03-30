(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('componentRequirmentCopyPopupController', componentRequirmentCopyPopupController);

  /** @ngInject */
  function componentRequirmentCopyPopupController($scope, $rootScope, $mdDialog, DialogFactory, CORE, USER, data, BaseService, ComponentFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.inspectionData = data;
    vm.partDetail = data.partDetail || null;
    vm.inspectionList = data.inspectionList || [];
    vm.requirmentCategory = data.requirmentCategory || {};
    vm.RequirmentCategoryList = angular.copy(CORE.RequirmentCategory);
    vm.purchaseInpectionSaveType = USER.purchaseInpectionSaveType;

    function filterDisplayCategory() {
      Object.keys(vm.RequirmentCategoryList).forEach((field) => {
        if (vm.RequirmentCategoryList[field].id === vm.requirmentCategory.id || vm.RequirmentCategoryList[field].id == 'C') {
          delete vm.RequirmentCategoryList[field];
        }
      });
    }

    filterDisplayCategory();

  /*model initialize*/
    vm.purchaseInspectionModel = {
    };
    vm.headerdata = [];

    vm.checkDirtyObject = {
      oldModelName: vm.purchaseInspectionModelCopy,
      newModelName: vm.purchaseInspectionModel
    };

    /**redirection links */
    vm.goToPartList = () => {
        BaseService.goToPartList();
      return false;
    };
    vm.goToPartDetails = (data) => {
        BaseService.goToComponentDetailTab(null, data.partID);
      return false;
    };

    vm.headerdata.push(
      {
        label: vm.LabelConstant.MFG.MFGPN,
        value: vm.partDetail.mfgPN,
        displayOrder: 1,
        labelLinkFn: vm.goToPartList,
        valueLinkFn: vm.goToPartDetails,
        valueLinkFnParams: { partID: vm.partDetail.id },
        isCopy: true,
        isCopyAheadLabel: false,
        imgParms: {
          imgPath: vm.partDetail.rohsIcon,
          imgDetail: vm.partDetail.rohsName
        }
      }
    );

    /**select all */
    vm.selectAllRequirement = () => {
      if (vm.isAllSelect) {
        _.map(vm.purchaseRequirementList, (data) => {
          data.isSelect = true;
        });
      }
      else {
        _.map(vm.purchaseRequirementList, (data) => {
          data.isSelect = false;
        });
      }
      vm.anyItemSelect = _.some(vm.purchaseRequirementList, (data) => data.isSelect === true);
    };

    /**
     * select clicked requirment
     * @param {any} item
     */
    vm.selectRequirement = (item) => {
      if (item.isSelect) {
        const checkAnyDeSelect = _.some(vm.purchaseRequirementList, (data) => data.isSelect === false);
        if (checkAnyDeSelect) {
          vm.isAllSelect = false;
        } else {
          vm.isAllSelect = true;
        }
      } else {
        vm.isAllSelect = false;
      }
      vm.anyItemSelect = _.some(vm.purchaseRequirementList, (data) => data.isSelect === true);
    };

    /**confirmation to overwrite or merge while save */
    vm.askConfirmationForSaveOption = () => {
      const selectedCategoryValue = [];
      Object.keys(vm.RequirmentCategoryList).forEach((field) => {
        if (vm.RequirmentCategoryList[field].selected) {
          selectedCategoryValue.push(vm.RequirmentCategoryList[field].value);
        }
      });
      if (selectedCategoryValue.length === 0) {
        return;
      }
      if (vm.inspectionList && vm.inspectionList.length > 0) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.CONFIRMATION_SAVE_PURCHASE_INSPECTION_TYPE);
        messageContent.message = stringFormat(messageContent.message, selectedCategoryValue.join(', '));
        const buttonsList = [
          { name: vm.purchaseInpectionSaveType.Cancel },
          { name: vm.purchaseInpectionSaveType.Append },
          { name: vm.purchaseInpectionSaveType.Override }
        ];

        const data = {
          messageContent: messageContent,
          buttonsList: buttonsList
        };
        DialogFactory.dialogService(
          CORE.MULTIPLE_BUTTONS_DIALOG_POPUP_CONTROLLER,
          CORE.MULTIPLE_BUTTONS_DIALOG_POPUP_VIEW,
          null,
          data).then(() => {
          }, (response) => {
            if (response === buttonsList[1].name || response === buttonsList[2].name) {
              savePurchaseInspection(response);
            }
          }, (err) => BaseService.getErrorLog(err));
      }
      else {
        savePurchaseInspection(vm.purchaseInpectionSaveType.Append);
      }
    };

    /**
     * save purchase inspection
     * @param {any} type
     */
    const savePurchaseInspection = (type) => {
      vm.saveBtnDisableFlag = true;
      /*if (BaseService.focusRequiredField(vm.formPurchaseInspectionDetail)) {
        vm.saveBtnDisableFlag = false;
        return;
      }*/
      const category = [];
      Object.keys(vm.RequirmentCategoryList).forEach((field) => {
        if (vm.RequirmentCategoryList[field].selected) {
          category.push(vm.RequirmentCategoryList[field]);
        }
      });

      const obj = {
        partId: vm.inspectionData.partId || null,
        inspectionRequirementList: vm.inspectionList,
        category: category.map((item) => item.id)
      };

      if (type === vm.purchaseInpectionSaveType.Append) {
        obj.isMerge = true;
      }
      else {
        obj.isMerge = false;
      }
      vm.cgBusyLoading = ComponentFactory.addPurchaseInspectionRequirement().query(obj).$promise.then((requirement) => {
        if (requirement && requirement.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          BaseService.currentPagePopupForm = [];
          category.forEach((item) => {
            $rootScope.$broadcast(item.broadCastValue);
          });
          $mdDialog.cancel(true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.goToPurchaseInspectionRequirement = () => BaseService.goToPurchaseInspectionRequirement();
    vm.goToTemplatePurchaseInspectionRequirement = () => BaseService.goToTemplatePurchaseInspectionRequirement();
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.checkFormDirty = (form, columnName) => BaseService.checkFormDirty(form, columnName);

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.formPurchaseInspectionDetail, vm.checkDirtyObject);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        vm.formPurchaseInspectionDetail.$setPristine();
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel();
      }
    };

    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.formPurchaseInspectionDetail];
      focusOnFirstEnabledFormField(vm.formPurchaseInspectionDetail);
    });
  }
})();
