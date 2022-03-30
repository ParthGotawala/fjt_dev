(function () {
  'use strict';

  angular
    .module('app.operation.operations')
    .controller('DuplicateOperationPopupController', DuplicateOperationPopupController);

  /** @ngInject */
  function DuplicateOperationPopupController($mdDialog, $scope, $q, data, CORE, OperationFactory, BaseService, RFQTRANSACTION, $mdColorPicker, OPERATION, DialogFactory, GenericCategoryFactory, USER,
    GenericCategoryConstant, ComponentFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.OperationMasterTabs = OPERATION.OperationMasterTabs;
    vm.OperationType = CORE.CategoryType.OperationType;
    vm.maxLengthForDescription = _maxLengthForDescription;
    let oldOperatationNumber = '';
    vm.duplicateOperation = {};
    vm.fromOperation = {};

    // header data for duplicate operation popup.
    const configureHeaderdata = () => {
      vm.headerdata = [{
        label: `From ${vm.LabelConstant.Operation.OP}`,
        value: stringFormat('({0}) {1}', vm.fromOperation.opNumber, vm.fromOperation.opName),
        displayOrder: 1,
        labelLinkFn: vm.goToOperationList,
        valueLinkFn: vm.goToManageOperation,
        valueLinkFnParams: vm.fromOperation.opID
      }];
    };

    // Retrive operation information.
    const operationDetail = (opID) => {
      vm.cgBusyLoading = OperationFactory.operation().query({ id: opID }).$promise.then((operation) => {
        if (operation && operation.data) {
          operation.data.opNumberText = convertToThreeDecimal(operation.data.opNumber);
          vm.fromOperation = operation.data;
          vm.duplicateOperation = angular.copy(operation.data);
          vm.duplicateOperation.fromOpID = opID;
          vm.duplicateOperation.opID = null;
          vm.duplicateOperation.opNumberText = null;
          vm.duplicateOperation.colorCode = null;
          configureHeaderdata();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    if (data && data.opID) {
      operationDetail(data.opID);
    };

    // Copy Option For Operation.
    vm.CopyOption = [
      { Name: vm.OperationMasterTabs.DoDont.DisplayName, ParamName: 'pIsCopyDoDont', Section: 1 },
      { Name: vm.OperationMasterTabs.Documents.DisplayName, ParamName: 'pIsCopyDocuments', Section: 1 },
      { Name: vm.OperationMasterTabs.DataFields.DisplayName, ParamName: 'pIsCopyDataFields', Section: 1 },
      { Name: CORE.LabelConstant.SuppliesMaterialsAndTools.MenuName, ParamName: 'pIsCopyParts', Section: 2 },
      { Name: CORE.LabelConstant.Equipment.MenuName, ParamName: 'pIsCopyEquipments', Section: 2 },
      { Name: CORE.LabelConstant.Personnel.MenuName, ParamName: 'pIsCopyEmployees', Section: 2 },
      { Name: vm.OperationMasterTabs.Templates.DisplayName, ParamName: 'pIsCopyTemplates', Section: 2 }
    ];

    // Get Operation type list
    const getOperationTypeList = () => {
      const GencCategoryType = [];
      GencCategoryType.push(vm.OperationType.Name);
      const listObj = {
        GencCategoryType: GencCategoryType,
        isActive: true
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((genericCategories) => {
        if (genericCategories && genericCategories.data) {
          vm.OperationTypeList = _.filter(genericCategories.data, (item) => item.parentGencCategoryID === null && item.categoryType === vm.OperationType.Name);
          if (vm.fromOperation.operationTypeID) {
            const operationType = _.find(vm.OperationTypeList, (operationType) => operationType.gencCategoryID === vm.fromOperation.operationTypeID);
            vm.fromOperation.operationType = operationType ? operationType.gencCategoryName : null;
          }
        }
        return $q.resolve(vm.OperationTypeList);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // Get parent operation list
    const getParentOperationList = () => {
      const filter = {};
      if (vm.duplicateOperation.opID) {
        filter.excludeOpID = vm.duplicateOperation.opID;
      }
      return OperationFactory.getOperationList().query(filter).$promise.then((operation) => {
        if (operation && operation.data) {
          vm.ParentOperationList = _.filter(operation.data, (item) => !item.parentOPID);
          _.each(vm.ParentOperationList, (item) => {
            item.opName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, item.opName, item.opNumber);
          });
          if (vm.fromOperation.parentOPID) {
            const parentOP = _.find(vm.ParentOperationList, (operation) => operation.opID === vm.fromOperation.parentOPID);
            vm.fromOperation.parentOPName = parentOP ? parentOP.opName : null;
          }
        }
        return $q.resolve(vm.ParentOperationList);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // get mounting type list
    const getMountingTypeList = () => ComponentFactory.getMountingTypeList().query().$promise.then((res) => {
      vm.mountingTypeList = res && res.data ? res.data : [];
      if (vm.fromOperation.mountingTypeID && !vm.fromOperation.mountingType) {
        const mountingType = _.find(vm.mountingTypeList, (mountingType) => mountingType.id === vm.fromOperation.mountingTypeID);
        vm.fromOperation.mountingType = mountingType ? mountingType.name : null;
      }
      return vm.mountingTypeList;
    }).catch((error) => BaseService.getErrorLog(error));

    // get selected operation type object on select of autocomplete icon
    const getSelectedOperationType = (obj) => {
      if (obj && obj.gencCategoryName === GenericCategoryConstant.OPERATION_TYPE.INSPECTION_PROCESS.gencCategoryName) {
        vm.duplicateOperation.qtyControl = true;
        vm.IsInspectionProcess = true;
        vm.duplicateOperation.isRework = false;
        vm.duplicateOperation.isMoveToStock = false;
        vm.duplicateOperation.isPlacementTracking = false;
        vm.duplicateOperation.isAllowMissingPartQty = false;
      }
      else {
        vm.IsInspectionProcess = false;
      }
    };

    // Configure Autocomplete
    const initAutoComplete = () => {
      vm.autoCompleteOperationType = {
        columnName: 'gencCategoryName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.duplicateOperation.operationTypeID ? vm.duplicateOperation.operationTypeID : null,
        inputName: vm.OperationType.Name,
        placeholderName: vm.OperationType.Title,
        addData: { headerTitle: vm.OperationType.Title },
        isRequired: true,
        isAddnew: true,
        callbackFn: getOperationTypeList,
        onSelectCallbackFn: getSelectedOperationType
      };

      vm.autoCompleteParentOperation = {
        columnName: 'opName',
        keyColumnName: 'opID',
        keyColumnId: vm.duplicateOperation.parentOPID ? vm.duplicateOperation.parentOPID : null,
        inputName: 'ParentOperation',
        placeholderName: 'Parent Operation',
        isRequired: false,
        isAddnew: false,
        callbackFn: getParentOperationList
      };

      vm.autoCompleteMountingType = {
        columnName: 'name',
        keyColumnName: 'id',
        controllerName: USER.ADMIN_MOUNTING_TYPE_ADD_UPDATE_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_MOUNTING_TYPE_ADD_UPDATE_MODAL_VIEW,
        keyColumnId: vm.duplicateOperation.mountingTypeID ? vm.duplicateOperation.mountingTypeID : null,
        inputName: 'Mounting Type',
        placeholderName: 'Mounting Type',
        isRequired: true,
        isAddnew: true,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_MOUNTING_TYPE_STATE],
          pageNameAccessLabel: CORE.PageName.mounting_type
        },
        callbackFn: getMountingTypeList
      };
    };

    const autoComplete = () => {
      const autocompletePromise = [getOperationTypeList(), getParentOperationList(), getMountingTypeList()];
      vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
        initAutoComplete();
      }).catch((error) => BaseService.getErrorLog(error));
    };
    autoComplete();

    // Go to operation list page.
    vm.goToOperationList = () => BaseService.goToOperationList();

    // Go to manage operation page.
    vm.goToManageOperation = (operationID) => BaseService.goToManageOperation(operationID);

    // Get radio button values in Transaction Level Setting
    vm.radioButtonGroup = {
      qtyControl: {
        array: CORE.OperationRadioGroup.qtyControl,
        checkDisable: () => (vm.duplicateOperation.isMoveToStock || vm.IsInspectionProcess),
        onChange: () => {
          if (vm.duplicateOperation.qtyControl) {
            //vm.duplicateOperation.isPreProgrammingComponent = false;
          } else {
            vm.duplicateOperation.isIssueQty = vm.duplicateOperation.isRework = false;
            vm.duplicateOperation.isLoopOperation = false;
            vm.duplicateOperation.isAllowMissingPartQty = vm.duplicateOperation.isAllowBypassQty = false;
          }
        }
      },
      isRework: {
        array: CORE.OperationRadioGroup.isRework,
        checkDisable: () => (vm.duplicateOperation.isMoveToStock || vm.IsInspectionProcess || !vm.duplicateOperation.qtyControl),
        onChange: () => {
          if (vm.duplicateOperation.isRework) {
            vm.duplicateOperation.isIssueQty = true;
            vm.duplicateOperation.isAllowMissingPartQty = vm.duplicateOperation.isAllowBypassQty = false;
          }
          else {
            vm.duplicateOperation.isLoopOperation = false;
          }
        }
      },
      isIssueQty: {
        array: CORE.OperationRadioGroup.isIssueQty,
        checkDisable: () => vm.duplicateOperation.isRework || !vm.duplicateOperation.qtyControl,
        onChange: () => {
        }
      },
      isTeamOperation: {
        array: CORE.OperationRadioGroup.isTeamOperation,
        onChange: () => {
        }
      }
    };

    // Set required field for Flux Type
    const setFluxTypeValue = () => {
      if (!vm.duplicateOperation.isNoClean && !vm.duplicateOperation.isWaterSoluble && !vm.duplicateOperation.isFluxNotApplicable) {
        vm.duplicateOperationForm.fluxType.$setValidity('isFluxTypeRequired', false);
      } else {
        vm.duplicateOperationForm.fluxType.$setValidity('isFluxTypeRequired', true);
      }
    };

    // Get CheckBox values in Transaction Level Setting
    vm.checkboxButtonGroup = {
      isAllowMissingPartQty: {
        checkDisable: () => vm.duplicateOperation.isRework || vm.IsInspectionProcess || !vm.duplicateOperation.qtyControl || vm.duplicateOperation.isMoveToStock
      },
      isAllowBypassQty: {
        checkDisable: () => vm.duplicateOperation.isRework || !vm.duplicateOperation.qtyControl || vm.duplicateOperation.isMoveToStock
      },
      fluxType: {
        checkDisable: () => vm.duplicateOperation.isFluxNotApplicable,
        onChange: () => {
          if (vm.duplicateOperation.isFluxNotApplicable === true) {
            vm.duplicateOperation.isNoClean = false;
            vm.duplicateOperation.isWaterSoluble = false;
          }
          setFluxTypeValue();
        }
      }
    };

    //Use color picker to set color for the operation.
    vm.getColor = (colorCode, $event) => {
      let color = CORE.DEFAULT_STANDARD_CLASS_COLOR;
      if (colorCode) {
        const rgbColor = new tinycolor(colorCode).toRgb();
        color = stringFormat(RFQTRANSACTION.RGB_COLOR_FORMAT, rgbColor.r, rgbColor.g, rgbColor.b);
      }
      $mdColorPicker.show({
        value: color,
        genericPalette: true,
        $event: $event,
        mdColorHistory: false,
        mdColorAlphaChannel: false,
        mdColorSliders: false,
        mdColorGenericPalette: false,
        mdColorMaterialPalette: false
      }).then((color) => {
        const selectedColor = new tinycolor(color).toHex();
        if (vm.duplicateOperation.colorCode !== '#' + selectedColor) {
          vm.isChange = true;
        }
        vm.duplicateOperation.colorCode = '#' + selectedColor;
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //convert operation# to 3 decimal place value.
    vm.convertThreeDecimal = () => {
      vm.duplicateOperation.opNumberText = convertToThreeDecimal(vm.duplicateOperation.opNumberText);
      if (parseFloat(vm.duplicateOperation.opNumberText) === 0) {
        vm.duplicateOperationForm.opNumber.$setValidity('invalid', false);
      } else {
        vm.duplicateOperationForm.opNumber.$setValidity('invalid', true);
        if (oldOperatationNumber !== vm.duplicateOperation.opNumberText) {
          if (vm.duplicateOperationForm && vm.duplicateOperationForm.opNumber.$dirty && vm.duplicateOperation.opNumberText) {
            vm.cgBusyLoading = OperationFactory.checkDuplicateOpNumber().query({
              opNumber: vm.duplicateOperation.opNumberText
            }).$promise.then((res) => {
              vm.cgBusyLoading = false;
              oldOperatationNumber = angular.copy(vm.duplicateOperation.opNumberText);
              if (res && res.status === CORE.ApiResponseTypeStatus.EMPTY && res.errors && res.errors.data && res.errors.data.isDuplicateOpNumber) {
                displayOperationNumberNameUniqueMessage();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }
      }
    };

    // Update radio button selection in Transaction Level Setting on change of check-box selection from Operation Detail
    vm.setAllSettings = () => {
      if (vm.duplicateOperation.isMoveToStock) {
        vm.duplicateOperation.qtyControl = true;
        vm.duplicateOperation.isRework = false;
        vm.duplicateOperation.isLoopOperation = false;
        vm.duplicateOperation.isAllowMissingPartQty = vm.duplicateOperation.isAllowBypassQty = false;
      }
    };

    // Update radio button selection in Transaction Level Setting on change of check-box selection from Operation Detail
    vm.loopOperationChanged = () => {
      if (vm.duplicateOperation.isLoopOperation) {
        vm.duplicateOperation.isRework = true;
        vm.duplicateOperation.isIssueQty = true;
        vm.duplicateOperation.qtyControl = true;
        vm.duplicateOperation.isAllowMissingPartQty = vm.duplicateOperation.isAllowBypassQty = false;
      }
    };

    // Display OperationNumber Unique Message.
    const displayOperationNumberNameUniqueMessage = () => {
      oldOperatationNumber = '';
      vm.duplicateOperation.opNumberText = null;
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.MUST_UNIQUE_GLOBAL);
      messageContent.message = stringFormat(messageContent.message, vm.LabelConstant.Operation.OP);
      const obj = {
        messageContent: messageContent,
        multiple: true
      };
      DialogFactory.messageAlertDialog(obj).then(() => {
        setFocus('operationNumber');
      });
    };

    // Duplicate operation based on popup Details.
    vm.copyOperation = (isCheckUnique) => {
      vm.saveDisable = true;
      if (vm.duplicateOperationForm.$invalid) {
        BaseService.focusRequiredField(vm.duplicateOperationForm);
        vm.saveDisable = false;
        return;
      }
      const duplicateOperationDetailObj = _.chain(vm.CopyOption).keyBy('ParamName').mapValues('isChecked').value();
      vm.duplicateOperation.opNumber = vm.duplicateOperation.opNumberText;
      vm.duplicateOperation.isCheckUnique = isCheckUnique;
      const operationDetails = angular.merge({}, vm.duplicateOperation, duplicateOperationDetailObj);
      operationDetails.operationTypeID = vm.autoCompleteOperationType ? vm.autoCompleteOperationType.keyColumnId : null;
      operationDetails.parentOPID = vm.autoCompleteParentOperation ? vm.autoCompleteParentOperation.keyColumnId : null;
      operationDetails.mountingTypeID = vm.autoCompleteMountingType ? vm.autoCompleteMountingType.keyColumnId : null;

      vm.cgBusyLoading = OperationFactory.operation().save(operationDetails).$promise.then((res) => {
        if (res && res.data) {
          if (res.data.opID) {
            BaseService.goToManageOperation(res.data.opID);
            BaseService.currentPagePopupForm.pop();
            $mdDialog.hide(res.data);
          }
          else {
            if (res.data.fieldName) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.UNIQUE_CONFIRM_MESSAGE);
              messageContent.message = stringFormat(messageContent.message, res.data.fieldName);
              const obj = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_CREATENEW_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              DialogFactory.messageConfirmDialog(obj).then((yes) => {
                if (yes) {
                  vm.copyOperation(false);
                  vm.isChange = false;
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }
        }
        vm.saveDisable = false;
      }).catch((error) => {
        vm.saveDisable = false;
        return BaseService.getErrorLog(error);
      });
    };

    // Select all Operation Tabs.
    vm.changeSelectAll = () => {
      _.each(vm.CopyOption, (item) => {
        item.isChecked = vm.selectAll;
      });
      vm.selectChange();
    };

    // Select all operation tab by section.
    vm.selectBySection = (section, selectedValue) => {
      _.each(vm.CopyOption, (item) => {
        if (item.Section === section) {
          item.isChecked = selectedValue;
        }
      });
      vm.selectChange();
    };

    // Change in any checkBox of operation tabs.
    vm.selectChange = () => {
      const checkedOption = _.filter(vm.CopyOption, (item) => item.isChecked);

      const firstSectionCount = _.filter(vm.CopyOption, (item) => item.Section === 1);
      const selectedFirstSection = _.filter(vm.CopyOption, (item) => item.Section === 1 && item.isChecked);

      const secondSectionCount = _.filter(vm.CopyOption, (item) => item.Section === 2);
      const selectedSecondSection = _.filter(vm.CopyOption, (item) => item.Section === 2 && item.isChecked);

      vm.selectFirstSection = firstSectionCount.length === selectedFirstSection.length;
      vm.selectSecondSection = secondSectionCount.length === selectedSecondSection.length;
      vm.selectAll = checkedOption.length === vm.CopyOption.length;
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    // go to operation type list page
    vm.goToOperationType = () => BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_OPTYPE_STATE, {});

    // go to operation list page
    vm.goToOperation = () => BaseService.openInNew(OPERATION.OPERATION_OPERATIONS_STATE, {});

    //go to mounting type
    vm.goToMountingTypeList = () => {
      BaseService.openInNew(USER.ADMIN_MOUNTING_TYPE_STATE, {});
    };

    // Close popup.
    vm.cancel = () => {
      if (vm.duplicateOperationForm.$dirty || vm.isChange) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.duplicateOperationForm);
    });
  }
})();
