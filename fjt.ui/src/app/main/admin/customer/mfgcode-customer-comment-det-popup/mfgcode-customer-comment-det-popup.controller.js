(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('ComponentCustomerCommentDetPopupController', ComponentCustomerCommentDetPopupController);

  /** @ngInject */
  function ComponentCustomerCommentDetPopupController($scope, $mdDialog, DialogFactory, CORE, USER, data, BaseService, $timeout, ComponentFactory, CustomerFactory, NotificationFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.purchaseInspectionModel = {
      isSelect: true
    };
    vm.saveBtnDisableFlag = false;
    vm.searchstring = null;
    vm.search = (item) => {
      if (!vm.searchstring || (item.requirementCategory.toLowerCase().indexOf(vm.searchstring.toLowerCase()) !== -1) || (item.requirement.toLowerCase().indexOf(vm.searchstring.toLowerCase()) !== -1)) {
        return true;
      }
      return false;
    };
    vm.onSearchingList = false;
    vm.RequirementType = CORE.RequirmentType;
    vm.SaveType = USER.purchaseInpectionSaveType;
    vm.customerCommentData = data;
    vm.totalCommentCount = data.totalCommentCount;
    vm.customerCommentList = [];
    vm.query = {
      order: ['requiementType', 'Comment']
    };
    vm.focusOnRequirement = false;
    vm.anyItemSelect = false;
    vm.isAllSelect = false;
    vm.headerdata = [];

    vm.debounceTime = CORE.DEBOUNCE_TIME_INTERVAL;

    vm.goToSupplierList = () => BaseService.goToSupplierList();
    vm.goToCustomerList = () => BaseService.goToCustomerList();
    vm.goToSupplierDetails = (data) => BaseService.goToSupplierDetail(data.cid);
    vm.goToCustomerDetails = (data) => BaseService.goToCustomer(data.cid);

    vm.headerdata.push(
      {
        label: vm.customerCommentData.customerType === CORE.CUSTOMER_TYPE.SUPPLIER ? vm.LabelConstant.SupplierQuote.Supplier : vm.LabelConstant.Customer.Customer,
        value: `(${vm.customerCommentData.mfgCode}) ${vm.customerCommentData.mfgName}`,
        displayOrder: 1,
        labelLinkFn: vm.customerCommentData.customerType === CORE.CUSTOMER_TYPE.SUPPLIER ? vm.goToSupplierList : vm.goToCustomerList,
        valueLinkFn: vm.customerCommentData.customerType === CORE.CUSTOMER_TYPE.SUPPLIER ? vm.goToSupplierDetails : vm.goToCustomerDetails,
        valueLinkFnParams: { cid: vm.customerCommentData.mfgCodeId },
        isCopy: true
      }
    );

    const getTemplateSearch = (searchObj) => ComponentFactory.getInspectionTemplateBySeach().query(searchObj).$promise.then((templates) => {
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

    const getPurchaseRequirementSearch = (searchObj) => ComponentFactory.getInspectionDetailBySeach().query(searchObj).$promise.then((requirement) => {
        if (requirement) {
          _.each(requirement.data, (item) => item.purchaseRequirementDisplayName = item.requiementType ? stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.requiementType === vm.RequirementType[0].id ? vm.RequirementType[0].value : vm.RequirementType[1].value, item.requirement) : item.requirement);
          if (searchObj.instructionId || searchObj.instructionId === 0) {
            $timeout(() => {
              if (vm.autoCompletePurchaseRequirement && vm.autoCompletePurchaseRequirement.inputName) {
                $scope.$broadcast(vm.autoCompletePurchaseRequirement.inputName, requirement.data[0]);
              }
            });
          }
          return requirement.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));

    const getPartRequirementCategorySearch = (searchObj) => ComponentFactory.getPartRequirementCategoryBySearch().query(searchObj).$promise.then((requirementCategory) => {
        if (requirementCategory) {
          _.each(requirementCategory.data, (item) => item.gencCategoryDisplayName = item.gencCategoryCode ? stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.gencCategoryCode, item.gencCategoryName) : item.gencCategoryName);
          if (searchObj.requirementCategoryID || searchObj.requirementCategoryID === 0) {
            $timeout(() => {
              if (vm.autoCompletePartRequirementCategory && vm.autoCompletePartRequirementCategory.inputName) {
                $scope.$broadcast(vm.autoCompletePartRequirementCategory.inputName, requirementCategory.data[0]);
              }
            });
          }
          return requirementCategory.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));

    const getPurchaseRequirementByTemplateId = (templateId) => {
      if (templateId) {
        vm.cgBusyLoading = ComponentFactory.getPurchaseRequirementByTemplateId().query({ id: templateId}).$promise.then((requirement) => {
          if (requirement) {
            if (requirement.data.length > 0) {
              _.map(requirement.data, (data) => {
                const requirementTypeName = _.find(vm.RequirementType, (a) => a.id === data.inspectionmst.requiementType);
                if (data.inspectionmst && data.inspectionmst.requiementType === 'R') {
                  data.isDisable = true;
                  data.isSelect = false;
                }
                else {
                  data.isDisable = false;
                  data.isSelect = true;
                }
                data.requirement = data.inspectionmst.requirement;
                data.requiementType = requirementTypeName.value;
                data.requirementCategoryId = data.inspectionmst.partRequirementCategory.gencCategoryID;
                data.requirementCategory = data.inspectionmst.partRequirementCategory && data.inspectionmst.partRequirementCategory.gencCategoryCode ?
                  stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, data.inspectionmst.partRequirementCategory.gencCategoryCode, data.inspectionmst.partRequirementCategory.gencCategoryName)
                  : data.inspectionmst.partRequirementCategory.gencCategoryName;
              });
              vm.customerCommentList = _.uniqBy(_.concat(vm.customerCommentList, requirement.data), 'inspectionRequirementId');
              checkAllSelected();
            }
            else{ vm.onSearchingList = true; vm.customerCommentList = vm.customerCommentList.length > 0 ? vm.customerCommentList : []; }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    const initAutoComplete = () => {
      vm.autoCompleteTemplate = {
        columnName: 'name',
        controllerName: CORE.MANAGE_PURCHASE_INSPECTION_REQUIREMENT_TEMPLATE_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_PURCHASE_INSPECTION_REQUIREMENT_TEMPLATE_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'name',
        addData: {},
        placeholderName: vm.LabelConstant.MFGCODE_COMMENT.Template,
        isRequired: false,
        isAddnew: true,
        callbackFn: (obj) => {
          const searchObj = {
            templateId: obj.id
          };
          return getTemplateSearch(searchObj);
        },
        onSelectCallbackFn: (item) => {
          if (item) {
            getPurchaseRequirementByTemplateId(item.id);
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
        placeholderName: vm.LabelConstant.MFGCODE_COMMENT.PartRequirementCategory,
        isRequired: false,
        isAddnew: true,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_PARTREQUIREMENTCATEGORY_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CORE.PageName.PartRequirementCategory,
          headerTitle: vm.LabelConstant.MFGCODE_COMMENT.PartRequirementCategory,
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
        placeholderName: vm.LabelConstant.MFGCODE_COMMENT.PurchaseRequirement,
        isRequired: false,
        isAddnew: true,
        addData: {
          partRequirementCategoryId: vm.autoCompletePartRequirementCategory.keyColumnId || null,
          isCustomerComment:true
        },
        callbackFn: (obj) => {
          const searchObj = {
            instructionId: obj.id
          };
          return getPurchaseRequirementSearch(searchObj);
        },
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.focusOnRequirement = false;
            const requirementTypeName = _.find(vm.RequirementType, (a) => a.id === item.requiementType);

            const objPurchaseRequirement = {
              inspectionRequirementId: item.id,
              requirement: item.requirement,
              requiementType: requirementTypeName.value,
              isSelect: true,
              requirementCategory: item.partRequirementCategory && item.partRequirementCategory.gencCategoryCode ?
                stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.partRequirementCategory.gencCategoryCode, item.partRequirementCategory.gencCategoryName)
                : item.partRequirementCategory.gencCategoryName,
              requirementCategoryId: item.partRequirementCategory.gencCategoryID
            };

            const duplicatRequirement = _.find(vm.customerCommentList, (data) => data.inspectionRequirementId === objPurchaseRequirement.inspectionRequirementId);
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
              vm.customerCommentList.push(objPurchaseRequirement);
            }
            $scope.$broadcast(vm.autoCompletePartRequirementCategory.inputName, null);
            $scope.$broadcast(vm.autoCompletePurchaseRequirement.inputName, null);
            checkAllSelected();
          }
          else {
            $scope.$broadcast(vm.autoCompletePurchaseRequirement.inputName, null);
            $scope.$broadcast(vm.autoCompletePartRequirementCategory.inputName, null);
          }
        },
        onSearchFn: (query) => {
          const searchObj = {
            searchString: query,
            requirementCategory: vm.autoCompletePartRequirementCategory.keyColumnId || null,
            onlyComments: true
          };
          return getPurchaseRequirementSearch(searchObj);
        }
      };
    };

    initAutoComplete();

    vm.selectAllRequirement = () => {
      if (vm.isAllSelect) {
        _.map(vm.customerCommentList, (data) => data.isSelect = data.isDisable ? false : true);
      }
      else {
        _.map(vm.customerCommentList, (data) => data.isSelect = false);
      }
      vm.anyItemSelect = _.some(vm.customerCommentList, (data) => data.isSelect === true);
    };

    vm.selectRequirement = (item) => {
      if (item.isSelect) {
        const checkAnyDeSelect = _.some(vm.customerCommentList, (data) => data.isSelect === false);
        vm.isAllSelect = checkAnyDeSelect ? false : true;
      } else {
        vm.isAllSelect = false;
      }
      vm.anyItemSelect = _.some(vm.customerCommentList, (data) => data.isSelect === true);
    };

    const checkAllSelected = () => {
      const anyItemDeSelect = _.some(vm.customerCommentList, (data) => data.isSelect === false);
      vm.isAllSelect = anyItemDeSelect ? false : true;
      vm.anyItemSelect = _.some(vm.customerCommentList, (data) => data.isSelect === true);
    };

    vm.askConfirmationForSaveOption = () => {
      if (BaseService.focusRequiredField(vm.formCustomerCommentDetail)) {
        return;
      }
      if (vm.anyItemSelect) {
        if (vm.totalCommentCount > 0) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.CONFIRMATION_SAVE_CUSTOMER_COMMENT);
          messageContent.message = stringFormat(messageContent.message, vm.customerCommentData.customerType === CORE.CUSTOMER_TYPE.SUPPLIER ? vm.LabelConstant.SupplierQuote.Supplier : vm.LabelConstant.Customer.Customer);
          const buttonsList = [
            { name: vm.SaveType.Cancel },
            { name: vm.SaveType.Append },
            { name: vm.SaveType.Override }
          ];

          const data = {
            messageContent,
            buttonsList
          };
          DialogFactory.dialogService(
            CORE.MULTIPLE_BUTTONS_DIALOG_POPUP_CONTROLLER,
            CORE.MULTIPLE_BUTTONS_DIALOG_POPUP_VIEW,
            null,
            data).then(() => {
            }, (response) => {
              if (response === buttonsList[1].name || response === buttonsList[2].name) {
                saveComment(response);
              }
            }, (err) => BaseService.getErrorLog(err));
        }
        else {
          saveComment(vm.SaveType.Append);
        }
      }
      else {
        NotificationFactory.information(CORE.CUSTOMER_COMMENTS.EMPTY_COMMENT_LIST);
      }
    };

    const saveComment = (type) => {
      vm.saveBtnDisableFlag = true;

      const commentList = _.filter(vm.customerCommentList, (data) => data.isSelect === true);
      const obj = {
        mfgCodeId: vm.customerCommentData.mfgCodeId || null,
        customerCommentList: commentList,
        isMerge: type === vm.SaveType.Append ? true : false,
        customerType: vm.customerCommentData.customerType
      };

      vm.cgBusyLoading = CustomerFactory.addCustomerComment().query(obj).$promise.then((requirement) => {
        if (requirement && requirement.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          BaseService.currentPagePopupForm = [];
          $mdDialog.cancel(true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    initAutoComplete();

    vm.goToPurchaseInspectionRequirement = () => BaseService.goToPurchaseInspectionRequirement();
    vm.goToTemplatePurchaseInspectionRequirement = () => BaseService.goToTemplatePurchaseInspectionRequirement();
    vm.goToGenericCategoryPartRequirementCategoryList = () => BaseService.goToGenericCategoryPartRequirementCategoryList();
    vm.goToManageGenericCategoryPartRequirementCategory = (id) => BaseService.goToManageGenericCategoryPartRequirementCategory(id);

    vm.checkFormDirty = (form, columnName) => BaseService.checkFormDirty(form, columnName);

    vm.cancel = () => {
      const isdirty = vm.formCustomerCommentDetail.$dirty;
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        vm.formCustomerCommentDetail.$setPristine();
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel();
      }
    };

    angular.element(() => BaseService.currentPagePopupForm = [vm.formCustomerCommentDetail]);
  }
})();
