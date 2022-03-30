(function () {
  'use strict';

  angular
    .module('app.admin.aliasPartsValidation')
    .controller('AliasPartsValidationAddUpdatePopupController', AliasPartsValidationAddUpdatePopupController);

  /** @ngInject */
  function AliasPartsValidationAddUpdatePopupController($scope, $mdDialog, data, $q, CORE, AliasPartsValidationFactory, USER, ComponentFactory, BaseService, DialogFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.matchCriteriaList = CORE.matchCriteriaOptionsDropdown;
    vm.matchCriteriaListForStringField = CORE.matchCriteriaOptionsForStringFieldDropdown;
    vm.validationTypeList = CORE.validationTypeOptionsDropdown;
    vm.fieldDataTypeList = CORE.fieldDataTypeOptionsDropdown;
    vm.isChange = false;
    vm.isReadOnly = data ? data.isViewOnly : false;

    vm.aliasPartsValidation = {
    };
    vm.aliasPartsValidationList = [];
    //get Part Type List
    const getPartTypeList = () => ComponentFactory.getPartTypeList().query().$promise.then((res) => {
      vm.partTypeList = res.data;
      return res.data;
    }).catch((error) => BaseService.getErrorLog(error));

    //get Part Type List
    const getColumnField = () => AliasPartsValidationFactory.getColumnField().query().$promise.then((res) => {
      vm.filedList = res.data;
      return res.data;
    }).catch((error) => BaseService.getErrorLog(error));

    const autocompletePromise = [getPartTypeList(), getColumnField()];
    vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
      initAutoComplete();
      if (data && data.id) {
        aliasPartsValidationDetails();
      }
      else {
        vm.openExpression();
      }
    });
    const initAutoComplete = () => {
      vm.autoCompletePartType = {
        columnName: 'partTypeName',
        keyColumnName: 'id',
        controllerName: USER.ADMIN_PART_TYPE_ADD_UPDATE_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_PART_TYPE_ADD_UPDATE_MODAL_VIEW,
        keyColumnId: vm.aliasPartsValidation && (vm.aliasPartsValidation.refRfqPartTypeId || vm.aliasPartsValidation.refRfqPartTypeId === 0) ? vm.aliasPartsValidation.refRfqPartTypeId : null,
        inputName: 'Functional Category',
        placeholderName: 'Functional Type',
        isRequired: true,
        isAddnew: true,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_PART_TYPE_STATE],
          pageNameAccessLabel: CORE.PageName.funtional_type
        },
        callbackFn: getPartTypeList,
        onSelectCallbackFn: (item) => {
          if (!vm.aliasPartsValidation.id && (item && vm.autoCompleteValidationType.keyColumnId)) {
            vm.autoCompletePartType.keyColumnId = item.id;
            vm.aliasPartsValidationList = [];
            aliasPartsValidationDetails();
          }
        }
      };
      vm.autoCompleteValidationType = {
        columnName: 'value',
        keyColumnName: 'id',
        keyColumnId: vm.aliasPartsValidation ? vm.aliasPartsValidation.type : null,
        inputName: 'part group',
        placeholderName: 'Part Group',
        isRequired: true,
        isAddnew: false,
        onSelectCallbackFn: (item) => {
          if (!vm.aliasPartsValidation.id && (item && (vm.autoCompletePartType.keyColumnId || vm.autoCompletePartType.keyColumnId === 0))) {
            vm.autoCompleteValidationType.keyColumnId = item.id;
            vm.aliasPartsValidationList = [];
            aliasPartsValidationDetails();
          }
        }
      };
    };
    /* retrieve alias Parts Validation Details*/
    const aliasPartsValidationDetails = () => {
      const listObj = {
        refRfqPartTypeId: vm.autoCompletePartType && (vm.autoCompletePartType.keyColumnId || vm.autoCompletePartType.keyColumnId === 0) ? vm.autoCompletePartType.keyColumnId : null,
        type: vm.autoCompleteValidationType ? vm.autoCompleteValidationType.keyColumnId : 0
      };
      vm.cgBusyLoading = AliasPartsValidationFactory.retrieveAliasPartsValidationDetails().query({ listObj: listObj }).$promise.then((retrieveAliasPartsValidation) => {
        const GetAliasPartsValidationList = retrieveAliasPartsValidation.data;
        GetAliasPartsValidationList.forEach((x) => {
          var defaultExpdObj = angular.copy(defaultExp);
          defaultExpdObj.id = x.id,
            defaultExpdObj.refRfqPartTypeId = x.refRfqPartTypeId,
            defaultExpdObj.type = x.type,
            defaultExpdObj.fieldTitle = x.fieldTitle;
          defaultExpdObj.autoCompleteTitle = angular.copy(defaultAutoCompleteTitle);
          defaultExpdObj.autoCompleteTitle.keyColumnId = x.fieldNameToValidate;

          defaultExpdObj.autoCompleteFieldDataType = angular.copy(defaultAutoCompleteFieldDataType);
          defaultExpdObj.autoCompleteFieldDataType.keyColumnId = x.fieldDataType;

          defaultExpdObj.autoCompleteMatchCriteria = angular.copy(defaultAutoCompleteMatchCriteria);

          //defaultExpdObj.matchCriteriaList =
          if (x.fieldDataType === 'string') {
            defaultExpdObj.matchCriteriaList = vm.matchCriteriaListForStringField;
          }
          else {
            defaultExpdObj.matchCriteriaList = vm.matchCriteriaList;
          }
          defaultExpdObj.autoCompleteMatchCriteria.keyColumnId = x.matchCriteria;
          vm.aliasPartsValidationList.push(defaultExpdObj);
        });
        if (!vm.aliasPartsValidation.id) {
          vm.openExpression();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    if (data && data.id) {
      vm.aliasPartsValidation = angular.copy(data);
    }
    vm.saveUpdateAliasPartsValidation = () => {
      vm.isSubmit = false;

      vm.aliasPartsValidationList.forEach((x) => {
        x.refRfqPartTypeId = vm.autoCompletePartType && (vm.autoCompletePartType.keyColumnId || vm.autoCompletePartType.keyColumnId === 0) ? vm.autoCompletePartType.keyColumnId : null,
          x.type = vm.autoCompleteValidationType ? vm.autoCompleteValidationType.keyColumnId : 0;
      });

      const aliasPartsValidationInfo = {
        refRfqPartTypeId: vm.autoCompletePartType && (vm.autoCompletePartType.keyColumnId || vm.autoCompletePartType.keyColumnId === 0) ? vm.autoCompletePartType.keyColumnId : null,
        type: vm.autoCompleteValidationType ? vm.autoCompleteValidationType.keyColumnId : 0,
        aliasPartsValidationList: vm.aliasPartsValidationList
      };
      if (vm.aliasPartsValidation && vm.aliasPartsValidation.id) {
        vm.cgBusyLoading = AliasPartsValidationFactory.updateAliasPartsValidation().query({ aliasPartsValidationInfo: aliasPartsValidationInfo }).$promise.then((res) => {
          if (res && res.data) {
            if (res.data && res.data.type) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.ALTERNATE_PART_NOT_FOUND);
              const obj = {
                messageContent: messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(obj).then(() => {
                BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.aliasPartsValidationForm);
              }, () => {
              }).catch((error) => BaseService.getErrorLog(error));
            }
            else {
              BaseService.currentPagePopupForm.pop();
              $mdDialog.hide(res.data);
            }
          } else {
            if (checkResponseHasCallBackFunctionPromise(res)) {
              res.alretCallbackFn.then(() => {
                BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.aliasPartsValidationForm);
              });
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        vm.cgBusyLoading = AliasPartsValidationFactory.saveAliasPartsValidation().save(aliasPartsValidationInfo).$promise.then((res) => {
          if (res && res.data) {
            BaseService.currentPagePopupForm.pop();
            $mdDialog.hide(res.data);
          } else {
            if (checkResponseHasCallBackFunctionPromise(res)) {
              res.alretCallbackFn.then(() => {
                BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.aliasPartsValidationForm);
              });
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    //add and update alias parts validation
    vm.saveAliasPartsValidation = (ev) => {
      //!vm.aliasPartsValidationForm.$valid || (!vm.checkFormDirty(vm.aliasPartsValidationForm, vm.checkFormDirty) && !vm.isChange)
      //vm.isChange this used when any condition is removed
      if (!vm.aliasPartsValidationForm.$valid || vm.isReadOnly) {
        BaseService.focusRequiredField(vm.aliasPartsValidationForm);
        return;
      }
      const objIDs = {
        functionalCategoryID: vm.autoCompletePartType && (vm.autoCompletePartType.keyColumnId || vm.autoCompletePartType.keyColumnId === 0) ? vm.autoCompletePartType.keyColumnId : null,
        type: vm.autoCompleteValidationType ? vm.autoCompleteValidationType.keyColumnId : 0
      };
      return AliasPartsValidationFactory.checkAlternatePartValidationUsed().query({ objIDs: objIDs }).$promise.then((res) => {
        const data = {};
        data.transactionDetails = res.data;
        data.isAlterntePartValidation = true;
        data.PageName = CORE.PageName.alias_parts_validation;
        if (data.transactionDetails && data.transactionDetails !== 0) {
          DialogFactory.dialogService(
            USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
            USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
            ev,
            data).then((res) => {
              if (res === true) {
                vm.saveUpdateAliasPartsValidation();
              }
            }, () => {
            });
        }
        else {
          vm.saveUpdateAliasPartsValidation();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    /*Used to close pop-up*/
    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.aliasPartsValidationForm, vm.checkDirtyObject);
      if (isdirty || vm.isChange) {
        const data = {
          form: vm.aliasPartsValidationForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };
    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };
    //redirect to functional type list page
    vm.goToFunctionalTypeList = () => {
      BaseService.openInNew(USER.ADMIN_PART_TYPE_STATE, {});
    };

    const defaultExp = {
      id: null,
      refRfqPartTypeId: null,
      type: null,
      fieldTitle: null,
      autoCompleteTitle: {},
      autoCompleteFieldDataType: {},
      autoCompleteMatchCriteria: {},
      ExpressionLevel: 1,
      fieldNameToValidate: null,
      fieldDataType: null,
      matchCriteria: null,
      matchCriteriaList: []
    };

    const defaultAutoCompleteTitle = {
      columnName: 'displayName',
      keyColumnName: 'tableField',
      keyColumnId: null,
      inputName: 'field',
      placeholderName: 'Column',
      isRequired: true,
      isAddnew: false,
      callbackFn: getColumnField,
      onSelectCallbackFn: (item, selectedItem) => {
        selectedItem.fieldNameToValidate = item ? item.tableField : null;
        vm.fieldNameToValidate = item ? item.tableField : null;
        selectedItem.fieldTitle = item ? item.displayName : null;
        selectedItem.autoCompleteFieldDataType.keyColumnId = item ? item.fieldDataType : null;
        //selectedItem.autoCompleteMatchCriteria.keyColumnId = item ? item.matchCriteria : null;
        vm.selectedItemID = selectedItem ? selectedItem.id : null;
        if (item) {
          if (item.fieldDataType === 'string') {
            selectedItem.matchCriteriaList = vm.matchCriteriaListForStringField;
          }
          else {
            selectedItem.matchCriteriaList = vm.matchCriteriaList;
          }
          getSelectedLocationDetails(vm.selectedItemID, selectedItem);
        }
      }
    };
    const defaultAutoCompleteFieldDataType = {
      columnName: 'value',
      keyColumnName: 'id',
      keyColumnId: null,
      inputName: 'data type',
      placeholderName: 'Data Type',
      isRequired: true,
      isAddnew: false,
      onSelectCallbackFn: (item, selectedItem) => {
        selectedItem.fieldDataType = item ? item.id : null;
      }
    };
    const defaultAutoCompleteMatchCriteria = {
      columnName: 'value',
      keyColumnName: 'id',
      keyColumnId: null,
      inputName: 'criteria',
      placeholderName: 'Criteria',
      isRequired: true,
      isAddnew: false,
      onSelectCallbackFn: (item, selectedItem) => {
        selectedItem.matchCriteria = item ? item.id : null;
        selectedItem.matchCriteriaText = item ? item.value : null;
      }
    };
    vm.openExpression = function () {
      if (vm.maxGrpLevel) {
        vm.maxGrpLevel = vm.maxGrpLevel + 1;
      }
      else {
        vm.maxGrpLevel = 1;
      }
      const defaultExpdObj = angular.copy(defaultExp);
      defaultExpdObj.id = null;
      defaultExpdObj.autoCompleteTitle = angular.copy(defaultAutoCompleteTitle);
      defaultExpdObj.autoCompleteFieldDataType = angular.copy(defaultAutoCompleteFieldDataType);
      defaultExpdObj.autoCompleteMatchCriteria = angular.copy(defaultAutoCompleteMatchCriteria);
      vm.aliasPartsValidationList.push(defaultExpdObj);
    };

    vm.removeAliasFromList = (ev, $index) => {
      if (vm.isReadOnly) {
        return;
      }
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
      messageContent.message = stringFormat(messageContent.message, 'Part Alias Validations', 1);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          const objIDs = {
            functionalCategoryID: vm.autoCompletePartType && (vm.autoCompletePartType.keyColumnId || vm.autoCompletePartType.keyColumnId === 0) ? vm.autoCompletePartType.keyColumnId : null,
            type: vm.autoCompleteValidationType ? vm.autoCompleteValidationType.keyColumnId : 0
          };
          return AliasPartsValidationFactory.checkAlternatePartValidationUsed().query({ objIDs: objIDs }).$promise.then(() => {
            vm.aliasPartsValidationList.splice($index, 1);
            vm.isChange = true;
            vm.aliasPartsValidationForm.$dirty = true;
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };
    // retrieve Selected Location Details
    const getSelectedLocationDetails = (id, data) => {
      if (data) {
        vm.checkAliasPartsValidationExists(id, data);
      }
      else {
        data.fieldNameToValidate = null;
      }
    };
    //check function type and part group and column unique validation
    vm.checkAliasPartsValidationExists = (id, item) => {
      var duplicateCheck = _.filter(vm.aliasPartsValidationList, (alias) => alias.refRfqPartTypeId === item.refRfqPartTypeId && alias.type === item.type && alias.fieldNameToValidate === item.fieldNameToValidate);
      if (duplicateCheck.length > 1) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.FUNCTIONALTYPE_VALIDATIONTYPE_FIELD_UNIQUE);
        const alertModel = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(alertModel).then(() => {
          item.autoCompleteTitle.keyColumnId = null;
        });
      }
    };
    //Set as current form when page loaded
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.aliasPartsValidationForm);
    });
  }
})();
