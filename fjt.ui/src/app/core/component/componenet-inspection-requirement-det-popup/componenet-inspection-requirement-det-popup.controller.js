(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('ComponenetInspectionRequirementDetPopupController', ComponenetInspectionRequirementDetPopupController);

  /** @ngInject */
  function ComponenetInspectionRequirementDetPopupController($scope, $mdDialog, DialogFactory, CORE, USER, data, BaseService, $timeout, ComponentFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.purchaseInspectionModel = {
      isSelect: true
    };
    vm.saveBtnDisableFlag = false;
    vm.searchstring = null;
    vm.search = (item)  => {
      if (!vm.searchstring || (item.requirementCategory.toLowerCase().indexOf(vm.searchstring.toLowerCase()) !== -1) || (item.requirement.toLowerCase().indexOf(vm.searchstring.toLowerCase()) !== -1)) {
        return true;
      }
      return false;
    };
    vm.RequirementType = CORE.RequirmentType;
    vm.purchaseInpectionSaveType = USER.purchaseInpectionSaveType;
    vm.inspectionData = data;
    vm.partDetail = data.partDetail || null;
    vm.inspectionList = data.inspectionList || [];
    vm.requirmentCategory = data.requirmentCategory || {};
    vm.purchaseRequirementList = [];
    vm.query = {
      order: ['-requiementType', 'requirement']
    };
    vm.focusOnRequirement = false;
    vm.anyItemSelect = false;
    vm.isAllSelect = false;
    vm.headerdata = [];
    let selectedTemplateAutoComplete = null;
    let selectedRequirementAutoComplete = null;
    vm.purchaseInspectionModelCopy = _.clone(vm.purchaseInspectionModel);
    vm.checkDirtyObject = {
      oldModelName: vm.purchaseInspectionModelCopy,
      newModelName: vm.purchaseInspectionModel
    };
    vm.debounceTime = CORE.DEBOUNCE_TIME_INTERVAL;

      vm.goToPartList = () => BaseService.goToPartList();
      vm.goToPartDetails = (data) => BaseService.goToComponentDetailTab(null, data.partID);

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

    const getTemplateSearch = (searchObj) => {
      return ComponentFactory.getInspectionTemplateBySeach().query(searchObj).$promise.then((templates) => {
        if (templates) {
          if (searchObj.templateId || searchObj.templateId === 0) {
            $timeout(() => {
              if (vm.autoCompleteTemplate && vm.autoCompleteTemplate.inputName) {
                $scope.$broadcast(vm.autoCompleteTemplate.inputName, templates.data[0]);
              }
            });
          }
          return templates.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const getPurchaseRequirementSearch = (searchObj) => {
      return ComponentFactory.getInspectionDetailBySeach().query(searchObj).$promise.then((requirement) => {
        if (requirement) {
          _.each(requirement.data, (item) => item.purchaseRequirementDisplayName = item.requiementType ? stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.requiementType === vm.RequirementType[0].id ? vm.RequirementType[0].value : vm.RequirementType[1].value, item.requirement) : item.requirement)
          if (searchObj.instructionId || searchObj.instructionId == 0) {
            $timeout(() => {
              if (vm.autoCompletePurchaseRequirement && vm.autoCompletePurchaseRequirement.inputName) {
                $scope.$broadcast(vm.autoCompletePurchaseRequirement.inputName, requirement.data[0]);
              }
            });
          }
          return requirement.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const getPartRequirementCategorySearch = (searchObj) => {
      return ComponentFactory.getPartRequirementCategoryBySearch().query(searchObj).$promise.then((requirementCategory) => {
        if (requirementCategory) {
          _.each(requirementCategory.data, (item) => item.gencCategoryDisplayName = item.gencCategoryCode ? stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.gencCategoryCode, item.gencCategoryName) : item.gencCategoryName)
          if (searchObj.requirementCategoryID || searchObj.requirementCategoryID == 0) {
            $timeout(() => {
              if (vm.autoCompletePartRequirementCategory && vm.autoCompletePartRequirementCategory.inputName) {
                $scope.$broadcast(vm.autoCompletePartRequirementCategory.inputName, requirementCategory.data[0]);
              }
            });
          }
          return requirementCategory.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const getPurchaseRequirementByTemplateId = (templateId) => {
      if (templateId) {
        vm.cgBusyLoading = ComponentFactory.getPurchaseRequirementByTemplateId().query({ id: templateId }).$promise.then((requirement) => {
          if (requirement) {
            _.map(requirement.data, (data) => {
              let requirementTypeName = _.find(vm.RequirementType, (a) => a.id === data.inspectionmst.requiementType);
              data.isSelect = true;
              data.requirement = data.inspectionmst.requirement;
              data.requiementType = requirementTypeName.value;
              data.requirementCategoryId = data.inspectionmst.partRequirementCategory.gencCategoryID
              data.requirementCategory = data.inspectionmst.partRequirementCategory && data.inspectionmst.partRequirementCategory.gencCategoryCode ?
                stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, data.inspectionmst.partRequirementCategory.gencCategoryCode, data.inspectionmst.partRequirementCategory.gencCategoryName)
                : data.inspectionmst.partRequirementCategory.gencCategoryName
            });
            vm.purchaseRequirementList = _.uniqBy(_.concat(vm.purchaseRequirementList, requirement.data), 'inspectionRequirementId');
            checkAllSelected();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    let initAutoComplete = () => {

      vm.autoCompleteTemplate = {
        columnName: 'name',
        controllerName: CORE.MANAGE_PURCHASE_INSPECTION_REQUIREMENT_TEMPLATE_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_PURCHASE_INSPECTION_REQUIREMENT_TEMPLATE_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'name',
        addData: {},
        placeholderName: vm.LabelConstant.PURCHASE_INSPECTION_REQUIREMENT.Template,
        isRequired: false,
        isAddnew: true,
        callbackFn: (obj) => {
          let searchObj = {
            templateId: obj.id
          }
          return getTemplateSearch(searchObj);
        },
        onSelectCallbackFn: (item) => {
          if (item) {
            selectedTemplateAutoComplete = vm.purchaseInspectionModel.templateId = item.id;
            getPurchaseRequirementByTemplateId(vm.purchaseInspectionModel.templateId);
            $scope.$broadcast(vm.autoCompleteTemplate.inputName, null);
          }
          else {
            selectedTemplateAutoComplete = null;
            vm.purchaseRequirementList = _.reject(vm.purchaseRequirementList, (data) => data.inspectionTemplateId == vm.purchaseInspectionModel.templateId);
            $scope.$broadcast(vm.autoCompleteTemplate.inputName, null);
          }
        },
        onSearchFn: (query) => {
          const searchObj = {
            searchString: query
          };
          return getTemplateSearch(searchObj);
        }
      };

      vm.autoCompletePartRequirementCategory = {
        columnName: 'gencCategoryDisplayName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: null,
        inputName: 'requirementCategory',
        placeholderName: vm.LabelConstant.PURCHASE_INSPECTION_REQUIREMENT.PartRequirementCategory,
        isRequired: false,
        isAddnew: true,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_PARTREQUIREMENTCATEGORY_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CORE.PageName.PartRequirementCategory,
          headerTitle: vm.LabelConstant.PURCHASE_INSPECTION_REQUIREMENT.PartRequirementCategory,
          Title: vm.LabelConstant.PURCHASE_INSPECTION_REQUIREMENT.PartRequirementCategory
        },
        callbackFn: (obj) => {
          const searchObj = {
            requirementCategoryID: obj.gencCategoryID
          };
          return getPartRequirementCategorySearch(searchObj);
        },
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.purchaseInspectionModel.requirementCategoryId = item.gencCategoryID;
            if (vm.autoCompletePurchaseRequirement) {
              vm.autoCompletePurchaseRequirement.addData.partRequirementCategoryId = item.gencCategoryID;
            }
          }
          else {
            $scope.$broadcast(vm.autoCompletePartRequirementCategory.inputName, null);
            if (vm.autoCompletePurchaseRequirement) {
              vm.autoCompletePurchaseRequirement.addData.partRequirementCategoryId = null;
            }
          }
        },
        onSearchFn: (query) => {
          const searchObj = {
            searchString: query,
            categoryType: CORE.CategoryType.PartRequirementCategory.Name
          };
          return getPartRequirementCategorySearch(searchObj);
        }
      };

      vm.autoCompletePurchaseRequirement = {
        columnName: 'purchaseRequirementDisplayName',
        controllerName: CORE.MANAGE_PURCHASE_INSPECTION_REQUIREMENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_PURCHASE_INSPECTION_REQUIREMENT_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'requirement',
        placeholderName: vm.LabelConstant.PURCHASE_INSPECTION_REQUIREMENT.PurchaseRequirement,
        isRequired: false,
        isAddnew: true,
        addData: {
          partRequirementCategoryId: vm.autoCompletePartRequirementCategory.keyColumnId || null
        },
        callbackFn: (obj) => {
          let searchObj = {
            instructionId: obj.id
          };
          return getPurchaseRequirementSearch(searchObj);
        },
        onSelectCallbackFn: (item) => {
          let requirementTypeName;
          if (item) {
            selectedRequirementAutoComplete = item.id;
            vm.focusOnRequirement = false;
            requirementTypeName = _.find(vm.RequirementType, (a) => a.id === item.requiementType);

            const objPurchaseRequirement = {
              inspectionRequirementId: item.id,
              requirement: item.requirement,
              requiementType: requirementTypeName.value,
              isSelect: true,
              requirementCategory: item.partRequirementCategory && item.partRequirementCategory.gencCategoryCode ?
                stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.partRequirementCategory.gencCategoryCode, item.partRequirementCategory.gencCategoryName)
                : item.partRequirementCategory.gencCategoryName ,
              requirementCategoryId: item.partRequirementCategory.gencCategoryID
            };

            const duplicatRequirement = _.find(vm.purchaseRequirementList, (data) => data.inspectionRequirementId === objPurchaseRequirement.inspectionRequirementId);
            if (duplicatRequirement) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.PURCHASE_REQUIREMENT_ALREADY_EXIStS);
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(model).then((yes) => {
                if (yes) {
                  $timeout(() => vm.focusOnRequirement = true);
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
            else {
              vm.focusOnRequirement = true;
              vm.purchaseRequirementList.push(objPurchaseRequirement);
            }
            $scope.$broadcast(vm.autoCompletePartRequirementCategory.inputName, null);
            $scope.$broadcast(vm.autoCompletePurchaseRequirement.inputName, null);
            checkAllSelected();
          }
          else {
            selectedRequirementAutoComplete = null;
            $scope.$broadcast(vm.autoCompletePurchaseRequirement.inputName, null);
            $scope.$broadcast(vm.autoCompletePartRequirementCategory.inputName, null);
          }
        },
        onSearchFn: (query) => {
          const searchObj = {
            searchString: query,
            requirementCategory: vm.autoCompletePartRequirementCategory.keyColumnId || null
          };
          return getPurchaseRequirementSearch(searchObj);
        }
      };
    };

    initAutoComplete();

    vm.selectAllRequirement = () => {
      if (vm.isAllSelect) {
        _.map(vm.purchaseRequirementList, (data) => data.isSelect = true);
      }
      else {
        _.map(vm.purchaseRequirementList, (data) => data.isSelect = false);
      }
      vm.anyItemSelect = _.some(vm.purchaseRequirementList, (data) => data.isSelect == true);
    }

    vm.selectRequirement = (item) => {
      if (item.isSelect) {
        let checkAnyDeSelect = _.some(vm.purchaseRequirementList, (data) => data.isSelect == false);
        vm.isAllSelect = checkAnyDeSelect ? false : true
      } else {
        vm.isAllSelect = false;
      }
      vm.anyItemSelect = _.some(vm.purchaseRequirementList, (data) => data.isSelect == true);
    }

    let checkAllSelected = () => {
      let anyItemDeSelect = _.some(vm.purchaseRequirementList, (data) => data.isSelect == false);
      vm.isAllSelect = anyItemDeSelect ? false : true
      vm.anyItemSelect = _.some(vm.purchaseRequirementList, (data) => data.isSelect == true);
    };

    vm.askConfirmationForSaveOption = () => {
      if (BaseService.focusRequiredField(vm.formPurchaseInspectionDetail)) {
        return;
      }
      if (vm.anyItemSelect || (vm.purchaseRequirementList && vm.purchaseRequirementList.length > 0)) {
        if (vm.inspectionList && vm.inspectionList.length > 0) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.CONFIRMATION_SAVE_PURCHASE_INSPECTION_TYPE);
          messageContent.message = stringFormat(messageContent.message, vm.requirmentCategory.value);
          const buttonsList = [
            { name: vm.purchaseInpectionSaveType.Cancel },
            { name: vm.purchaseInpectionSaveType.Append },
            { name: vm.purchaseInpectionSaveType.Override }
          ];

          const data = {
            messageContent,
            buttonsList
          };
          DialogFactory.dialogService(
            CORE.MULTIPLE_BUTTONS_DIALOG_POPUP_CONTROLLER,
            CORE.MULTIPLE_BUTTONS_DIALOG_POPUP_VIEW,
            null,
            data).then((response) => {
            }, (response) => {
              if (response == buttonsList[1].name || response == buttonsList[2].name) {
                savePurchaseInspection(response);
              }
            }, (err) => BaseService.getErrorLog(err));
        }
        else {
          savePurchaseInspection(vm.purchaseInpectionSaveType.Append);
        }
      }
    };

    const savePurchaseInspection = (type) => {
      vm.saveBtnDisableFlag = true;

      const purchaseList = _.filter(vm.purchaseRequirementList, (data) => data.isSelect === true);
      const obj = {
        partId: vm.inspectionData.partId || null,
        inspectionRequirementList: purchaseList,
        category: vm.requirmentCategory.id,
        isMerge: type === vm.purchaseInpectionSaveType.Append ? true : false
      };

      vm.cgBusyLoading = ComponentFactory.addPurchaseInspectionRequirement().query(obj).$promise.then((requirement) => {
        if (requirement && requirement.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          BaseService.currentPagePopupForm = [];
          $mdDialog.cancel(true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    let active = () => initAutoComplete();
    active();

    vm.goToPurchaseInspectionRequirement = () => BaseService.goToPurchaseInspectionRequirement();
    vm.goToTemplatePurchaseInspectionRequirement = () => BaseService.goToTemplatePurchaseInspectionRequirement();
    vm.goToGenericCategoryPartRequirementCategoryList = () => BaseService.goToGenericCategoryPartRequirementCategoryList();
    vm.goToManageGenericCategoryPartRequirementCategory = (id) => BaseService.goToManageGenericCategoryPartRequirementCategory(id);

    vm.checkFormDirty = (form, columnName) => BaseService.checkFormDirty(form, columnName)

    vm.cancel = () => {
      let isdirty = vm.formPurchaseInspectionDetail.$dirty;
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        vm.formPurchaseInspectionDetail.$setPristine();
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel();
      }
    };

    angular.element(() => BaseService.currentPagePopupForm = [vm.formPurchaseInspectionDetail]);
  }
})();
