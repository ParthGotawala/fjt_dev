(function () {
  'use strict';
  angular
    .module('app.admin.rfqsetting')
    .controller('ManageQuoteDynamicFieldsPopupController', ManageQuoteDynamicFieldsPopupController);
  /** @ngInject */
  function ManageQuoteDynamicFieldsPopupController($mdDialog, data, CORE, RFQSettingFactory, BaseService, DialogFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.taToolbar = CORE.Toolbar;
    vm.uomList = CORE.QUOTE_ATTRIBUTE_LIST;
    vm.selectionCriteria = CORE.QUOTE_ATTRIBUTE_CRITERIA;
    vm.quoteAttributeType = CORE.QUOTE_ATTRIBUTE_TYPE;
    vm.quote_attribute_type = CORE.QUOTE_DB_ATTRIBUTE_TYPE;
    vm.quoteAyytibuteTypeName = CORE.ATTRIBUTE_TYPE_NAME;
    vm.quoteMarginType = CORE.QUOTE_ATTRIBUTE_MARGIN_TYPE;
    vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;
    vm.quoteAttributeTypeValue = data.quoteAttributeType;
    vm.historyactionButtonName = `${CORE.PageName.quote_attribute} History`;
    vm.isRFQPage = data.quoteAttributeType === vm.quote_attribute_type.RFQ ? true : false;
    let oldFieldName = '';

    vm.pageInit = (data) => {
      vm.costingType = data && data.costingCategory ? data.costingCategory : null;
      vm.quoteDynamicFieldsModel = {
        fieldName: null,
        costingType: vm.costingType ? vm.costingType : CORE.QuoteDynamicFieldsType.Material,
        displayPercentage: false,
        displayMargin: false,
        isDaysRequire: false,
        displayOrder: null,
        dataType: CORE.Costing_Data_Type[0].ID,
        marginApplicableType: null,
        toolingQty: null,
        toolingPrice: null,
        isActive: true,
        applyToAll: false,
        quoteAttributeType: vm.quoteAttributeTypeValue
      };
    };
    vm.pageInit(data);

    if (vm.costingType === CORE.QuoteDynamicFieldsType.NRE || vm.costingType === CORE.QuoteDynamicFieldsType.RC || vm.costingType === CORE.QuoteDynamicFieldsType.TOOL) {
      vm.quoteDynamicFieldsModel.toolingQty = 1;
    }

    vm.QuoteDynamicFieldsType = CORE.QuoteDynamicFieldsType;
    //manage auto complete
    const autoComplete = () => {
      vm.autocompleteMarginType = {
        columnName: 'Name',
        keyColumnName: 'Value',
        keyColumnId: vm.quoteDynamicFieldsModel && vm.quoteDynamicFieldsModel.marginApplicableType ? vm.quoteDynamicFieldsModel.marginApplicableType : null,
        inputName: 'Markup',
        placeholderName: 'Select Markup',
        isRequired: false,
        isAddnew: false
      },
        vm.autocompleteUOMType = {
          columnName: 'Type',
          keyColumnName: 'Value',
          keyColumnId: vm.quoteDynamicFieldsModel && vm.quoteDynamicFieldsModel.defaultuomType ? vm.quoteDynamicFieldsModel.defaultuomType : null,
          inputName: 'UOM',
          placeholderName: 'Unit of Time',
          isRequired: false,
          isAddnew: false
        },
        vm.autocompleteAffectingType = {
          columnName: 'Name',
          keyColumnName: 'Value',
          keyColumnId: vm.quoteDynamicFieldsModel && vm.quoteDynamicFieldsModel.affectType ? vm.quoteDynamicFieldsModel.affectType : null,
          inputName: 'Affecting',
          placeholderName: 'Affecting',
          isRequired: false,
          isAddnew: false
        },
        vm.autocompleteSelectionCriteriaType = {
          columnName: 'Name',
          keyColumnName: 'Value',
          keyColumnId: vm.quoteDynamicFieldsModel && vm.quoteDynamicFieldsModel.selectionType ? vm.quoteDynamicFieldsModel.selectionType : null,
          inputName: 'Selection Criteria',
          placeholderName: 'Selection Criteria',
          isRequired: false,
          isAddnew: false
        };
      vm.autocompleteRefQuoteAttribute = {
        columnName: 'fieldName',
        keyColumnName: 'id',
        keyColumnId: vm.quoteDynamicFieldsModel && vm.quoteDynamicFieldsModel.refAttributeID ? vm.quoteDynamicFieldsModel.refAttributeID : null,
        inputName: 'Selection Attribute',
        placeholderName: 'Selection Attribute',
        isRequired: true,
        isAddnew: false,
        callbackFn: getRFQAttributeList
      };
    };
    if (vm.quoteDynamicFieldsModel.quoteAttributeType === vm.quote_attribute_type.RFQ) {
      getRFQAttributeList();
    }
    if (data && data.id) {
      vm.quoteDynamicFieldsModel.id = data.id;
    }
    if (vm.quoteDynamicFieldsModel.id) {
      vm.cgBusyLoading = RFQSettingFactory.retriveQuoteDynamicFields().query({
        id: vm.quoteDynamicFieldsModel.id
      }).$promise.then((response) => {
        if (response && response.data) {
          vm.quoteDynamicFieldsModel = response.data;
          oldFieldName = vm.quoteDynamicFieldsModel.fieldName;
          vm.isQuotefieldUsed = vm.quoteDynamicFieldsModel.rfqAssyQuotationsAdditionalCost && vm.quoteDynamicFieldsModel.rfqAssyQuotationsAdditionalCost.length > 0 ? true : false;
          autoComplete();
          vm.copyActive = angular.copy(vm.quoteDynamicFieldsModel.isActive);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }
    else {
      autoComplete();
    }
    function getRFQAttributeList() {
      vm.cgBusyLoading = RFQSettingFactory.retriveRFQQuoteAttributeList().query().$promise.then((response) => {
        if (response && response.data) {
          const rfqList = response.data;
          if (vm.quoteDynamicFieldsModel.id) {
            vm.rfqQuoteAttributeList = _.filter(rfqList, (item) => { if (item.id !== vm.quoteDynamicFieldsModel.id) { return item; } });
          }
          else {
            vm.rfqQuoteAttributeList = rfqList;
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }
    //save quote dynamic details
    vm.saveQuoteDynamicFields = (buttonCategory) => {
      if (BaseService.focusRequiredField(vm.AddQuoteDynamicFieldsForm)) {
        if (vm.quoteDynamicFieldsModel.id && !vm.AddQuoteDynamicFieldsForm.$dirty && buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
          $mdDialog.cancel(vm.data);
        }
        return;
      }
      if (vm.AddQuoteDynamicFieldsForm.$invalid) {
        BaseService.focusRequiredField(vm.AddQuoteDynamicFieldsForm);
        return;
      }
      if (vm.quoteDynamicFieldsModel.id && vm.copyActive !== vm.quoteDynamicFieldsModel.isActive) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.STATUS_CHANGE_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, vm.copyActive ? 'Active' : 'Inactive', vm.quoteDynamicFieldsModel.isActive ? 'Active' : 'Inactive');
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            saveAttribute(buttonCategory);
          }
        }, () => {
          // empty
        });
      } else { saveAttribute(buttonCategory); }
    };
    vm.removeSelectedAttribute = () => {
      if (!vm.quoteDynamicFieldsModel.isIncludeInOtherAttribute) {
        vm.autocompleteRefQuoteAttribute.keyColumnId = null;
      }
    };
    //save quote attributes
    const saveAttribute = (buttonCategory) => {
      if (vm.quoteDynamicFieldsModel.costingType === CORE.QuoteDynamicFieldsType.NRE || vm.quoteDynamicFieldsModel.costingType === CORE.QuoteDynamicFieldsType.RC || vm.quoteDynamicFieldsModel.costingType === CORE.QuoteDynamicFieldsType.TOOL) {
        vm.quoteDynamicFieldsModel.dataType = CORE.Costing_Data_Type[1].ID;
      }
      else {
        vm.quoteDynamicFieldsModel.dataType = CORE.Costing_Data_Type[0].ID;
      }
      vm.quoteDynamicFieldsModel.toolingQty = (vm.quoteDynamicFieldsModel.toolingQty || vm.quoteDynamicFieldsModel.toolingQty === 0) ? parseInt(vm.quoteDynamicFieldsModel.toolingQty) : null;
      vm.quoteDynamicFieldsModel.marginApplicableType = vm.autocompleteMarginType.keyColumnId;
      vm.quoteDynamicFieldsModel.defaultuomType = vm.autocompleteUOMType.keyColumnId;
      vm.quoteDynamicFieldsModel.affectType = vm.autocompleteAffectingType.keyColumnId;
      vm.quoteDynamicFieldsModel.selectionType = vm.autocompleteSelectionCriteriaType.keyColumnId;
      if (vm.quoteDynamicFieldsModel.quoteAttributeType === vm.quote_attribute_type.RFQ && vm.autocompleteRefQuoteAttribute.keyColumnId) {
        vm.quoteDynamicFieldsModel.refAttributeID = vm.autocompleteRefQuoteAttribute.keyColumnId;
        const refAttribute = _.find(vm.rfqQuoteAttributeList, { id: vm.quoteDynamicFieldsModel.refAttributeID });
        if (refAttribute) {
          vm.quoteDynamicFieldsModel.refAttributeName = refAttribute.fieldName;
        }
      }
      else {
        vm.quoteDynamicFieldsModel.refAttributeID = null;
      }
      if (vm.autocompleteRefQuoteAttribute.keyColumnId) {
        const refAttribute = _.find(vm.rfqQuoteAttributeList, { id: vm.autocompleteRefQuoteAttribute.keyColumnId });
        if (refAttribute && refAttribute.costingType !== vm.quoteDynamicFieldsModel.costingType) {
          const messageContent = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.MISMATCH_REF_ATTRIBUTE_TYPE;
          messageContent.message = stringFormat(messageContent.message, data.TotalCount);
          const alertModel = {
            messageContent: messageContent
          };
          return DialogFactory.messageAlertDialog(alertModel).then(() => true, () => { // Empty block
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
      vm.cgBusyLoading = RFQSettingFactory.quoteDynamicFields().save(vm.quoteDynamicFieldsModel).$promise.then((res) => {
        if (res.data) {
          if (res.data.id) {
            oldFieldName = vm.quoteDynamicFieldsModel.fieldName;
            BaseService.currentPagePopupForm.pop();
            vm.saveAndProceed(buttonCategory, res.data);
          }
        } else {
          if (checkResponseHasCallBackFunctionPromise(res)) {
            res.alretCallbackFn.then(() => {
              BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.AddQuoteDynamicFieldsForm);
            });
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const resetAllAutocomplete = () => {
      vm.autocompleteRefQuoteAttribute.keyColumnId = null;
      vm.autocompleteMarginType.keyColumnId = null;
      vm.autocompleteUOMType.keyColumnId = null;
      vm.autocompleteAffectingType.keyColumnId = null;
      vm.autocompleteSelectionCriteriaType.keyColumnId = null;
    };

    /* Manage Add Category Btn and After Save manage need to close popup or not. */
    vm.saveAndProceed = (buttonCategory, data) => {
      if (data) {
        vm.data = data;
      }
      if (buttonCategory === vm.BUTTON_TYPE.SAVE) {
        vm.AddQuoteDynamicFieldsForm.$setPristine();
        vm.quoteDynamicFieldsModel.id = data.id;
      } else if (buttonCategory === vm.BUTTON_TYPE.ADDNEW) {
        const isdirty = vm.AddQuoteDynamicFieldsForm.$dirty;
        if (isdirty) {
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_RESET_BODY_MESSAGE);
          const obj = {
            messageContent: messgaeContent,
            btnText: CORE.MESSAGE_CONSTANT.RESET_POPUP_BUTTON,
            canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
          };
          DialogFactory.messageConfirmDialog(obj).then(() => {
            vm.AddQuoteDynamicFieldsForm.$setPristine();
            vm.pageInit();
            resetAllAutocomplete();
            setFocus('fieldName');
          }, () => {
          }, (error) => BaseService.getErrorLog(error));
        } else {
          vm.AddQuoteDynamicFieldsForm.$setPristine();
          resetAllAutocomplete();
          vm.pageInit();
        }
      } else if (buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel(vm.data);
      }
      setFocus('fieldName');
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.AddQuoteDynamicFieldsForm);
      if (isdirty) {
        const data = {
          form: vm.AddQuoteDynamicFieldsForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };
    //empty all records for leadtime
    vm.changeCostingType = (isCost) => {
      if (!isCost) {
        vm.quoteDynamicFieldsModel.selectionType = null;
        vm.quoteDynamicFieldsModel.affectType = null;
        vm.quoteDynamicFieldsModel.defaultuomType = null;
        vm.quoteDynamicFieldsModel.defaultuomValue = null;
        vm.quoteDynamicFieldsModel.toolingQty = null;
        vm.quoteDynamicFieldsModel.toolingPrice = null;
        vm.autocompleteMarginType.keyColumnId = null;
        vm.autocompleteUOMType.keyColumnId = null;
        vm.autocompleteAffectingType.keyColumnId = null;
        vm.autocompleteSelectionCriteriaType.keyColumnId = null;
      }
      if (vm.quoteDynamicFieldsModel.costingType !== vm.QuoteDynamicFieldsType.Material && vm.quoteDynamicFieldsModel.costingType !== vm.QuoteDynamicFieldsType.Labor) {
        vm.quoteDynamicFieldsModel.displayPercentage = false;
        vm.quoteDynamicFieldsModel.displayMargin = false;
        vm.quoteDynamicFieldsModel.defaultMarginValue = null;
        vm.quoteDynamicFieldsModel.marginApplicableType = null;
        vm.quoteDynamicFieldsModel.toolingQty = null;
        vm.quoteDynamicFieldsModel.toolingPrice = null;
        vm.autocompleteMarginType.keyColumnId = null;
      }
      else {
        vm.quoteDynamicFieldsModel.displayPercentage = false;
        vm.quoteDynamicFieldsModel.displayMargin = false;
      }
      if (vm.quoteDynamicFieldsModel.costingType === vm.QuoteDynamicFieldsType.NRE || vm.quoteDynamicFieldsModel.costingType === vm.QuoteDynamicFieldsType.RC || vm.quoteDynamicFieldsModel.costingType === vm.QuoteDynamicFieldsType.TOOL) {
        vm.quoteDynamicFieldsModel.toolingQty = 1;
        vm.quoteDynamicFieldsModel.toolingPrice = null;
      }
    };
    //check for quote decimal fields
    vm.OnlyNumbersWithFirstDot = (ev) => OnlyNumbersWithFirstDot(ev, ev.currentTarget, vm.quoteDynamicFieldsModel.marginApplicableType);
    //check for blur
    vm.ToDecimalDigit = (ev) => ToDecimalFourDigit(ev.currentTarget, false, vm.quoteDynamicFieldsModel.marginApplicableType);
    //check for applicable type
    vm.changeapplicableType = () => {
      var defaulttype = document.getElementById('defaultUnitValue');
      return ToDecimalFourDigit(defaulttype, false, vm.quoteDynamicFieldsModel.marginApplicableType);
    };
    //check unique record from server for dynamic
    vm.checkUniqueFieldName = () => {
      if (vm.quoteDynamicFieldsModel.fieldName) {
        const dynamicObjRecord = {
          id: vm.quoteDynamicFieldsModel.id,
          fieldName: vm.quoteDynamicFieldsModel.fieldName,
          quoteAttributeType: vm.quoteDynamicFieldsModel.quoteAttributeType
        };
        RFQSettingFactory.checkUniqueDynamicField().query({ dynamicObj: dynamicObjRecord }).$promise.then((response) => {
          if (response.status === CORE.ApiResponseTypeStatus.FAILED) {
            if (checkResponseHasCallBackFunctionPromise(response)) {
              response.alretCallbackFn.then(() => {
                setFocus('fieldName');
              });
            }
            vm.quoteDynamicFieldsModel.fieldName = null;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    /* Show History Popup */
    vm.openQuoteAttributeeHistoryPopup = (ev) => {
      const data = {
        id: vm.quoteDynamicFieldsModel.id,
        title: vm.historyactionButtonName,
        TableName: CORE.DATAENTRYCHANGE_AUDITLOG_TABLENAME.QUOTECHARGES_DYNAMIC_FIELDS_MST,
        EmptyMesssage: vm.isRFQPage ? CORE.COMMON_HISTORY.RFQ_QUOTE_ATTRIBUTE.HISTORY_EMPTY_MESSAGE : CORE.COMMON_HISTORY.SUPPLIER_QUOTE_ATTRIBUTE.HISTORY_EMPTY_MESSAGE,
        headerData: [{
          label: 'Type',
          value: vm.isRFQPage ? CORE.COMMON_HISTORY.RFQ_QUOTE_ATTRIBUTE.Type : CORE.COMMON_HISTORY.SUPPLIER_QUOTE_ATTRIBUTE.Type,
          displayOrder: 1,
          labelLinkFn: vm.goToQuoteAttributeList
        }, {
          label: vm.isRFQPage ? CORE.COMMON_HISTORY.RFQ_QUOTE_ATTRIBUTE.LABLE_NAME : CORE.COMMON_HISTORY.SUPPLIER_QUOTE_ATTRIBUTE.LABLE_NAME,
          value: oldFieldName,
          displayOrder: 2,
          labelLinkFn: vm.goToQuoteAttributeList
        }]
      };

      DialogFactory.dialogService(
        CORE.COMMON_HISTORY_POPUP_MODAL_CONTROLLER,
        CORE.COMMON_HISTORY_POPUP_MODAL_VIEW,
        ev,
        data).then(() => { }, (err) => BaseService.getErrorLog(err));
    };

    /* Goto Quote Attributes list page. */
    vm.goToQuoteAttributeList = () => {
      if (vm.isRFQPage) {
        BaseService.goToQuoteAttributeList();
      } else {
        BaseService.goToSupplierQuoteAttributelist();
      }
    };

    // popup form validation
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.AddQuoteDynamicFieldsForm);
    });

    vm.changeQuoteDetail = () => {
      if (!vm.quoteDynamicFieldsModel.isDaysRequire) {
        vm.quoteDynamicFieldsModel.defaultuomValue = null;
        vm.autocompleteUOMType.keyColumnId = null;
        vm.autocompleteAffectingType.keyColumnId = null;
        vm.autocompleteSelectionCriteriaType.keyColumnId = null;
      }
    };
  }
})();
