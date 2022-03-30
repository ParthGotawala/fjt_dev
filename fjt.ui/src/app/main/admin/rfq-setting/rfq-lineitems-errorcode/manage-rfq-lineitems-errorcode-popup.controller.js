(function () {
  'use strict';
  angular
    .module('app.admin.rfqsetting')
    .controller('ManageRFQLineitemsErrorcodePopupController', ManageRFQLineitemsErrorcodePopupController);
  /** @ngInject */
  function ManageRFQLineitemsErrorcodePopupController($scope, $mdColorPicker, $mdDialog, $q, $filter, data, CORE, RFQTRANSACTION, USER, DialogFactory, RFQSettingFactory, BaseService, ImportBOMFactory) {
    const vm = this;
    vm.systemVariableList = [];
    $scope.selectedErrorCodeList = [];
    vm.SearchErrorCodeText = null;
    vm.SelectAllError = false;
    let _errorCodeLegendList = [];
    vm.taToolbar = CORE.Toolbar;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.EmptyMesssagePart = USER.ADMIN_EMPTYSTATE.RRQ_LINEITEMS_ERRORCODE;
    vm.logicCategoryList = _.sortBy(CORE.LogicCategoryDropdown, 'value');
    vm.descriptionMaxLength = _maxLengthForDescription;
    vm.historyactionButtonName = `${CORE.PageName.RFQLineItemErrorCode} History`;
    const categoryName = data && data.logicID ? _.find(vm.logicCategoryList, (item) => item.id === data.logicID) : null;

    vm.errorCodeModel = {};
    if (data) {
      vm.oldErrorCode = data.errorCode;
      vm.errorCodeModel = {
        id: data.id,
        errorCode: data.errorCode,
        logicID: data.logicID,
        errorColor: data.errorColor,
        description: data.description,
        org_description: data.org_description,
        systemVariable: data.systemVariable,
        displayName: data.displayName,
        narrative: data.narrative,
        isExternalIssue: data.isExternalIssue ? true : false,
        isResearchStatus: data.isResearchStatus ? true : false,
        isAssemblyLevelError: data.isAssemblyLevelError ? true : false,
        isAllowToEngrApproved: data.isAllowToEngrApproved,
        displayOrder: data.displayOrder
      };
    }
    const initautoComplete = () => {
      vm.autoCompleteCategory = {
        columnName: 'value',
        keyColumnName: 'id',
        keyColumnId: data === null ? null : data.logicID,
        inputName: 'logicCategory',
        placeholderName: 'Logic Category',
        isRequired: true,
        isAddnew: false,
        isDisabled: vm.errorCodeModel.id ? true : false
      };
    };

    function checkErrorCode() {
      vm.errorCodeModel.logicID = vm.autoCompleteCategory.keyColumnId;
      if (vm.errorCodeModel.logicID === 14) {
        vm.errorCodeModel.errorColor = '';
      }

      _.each(vm.categoryList, (item) => {
        var mappingDeatils = _.find(vm.categoryMappingList, { 'categoryID': item.id });
        if (!mappingDeatils && item.isChecked) {
          vm.categoryMappingList.push({ id: 0, categoryID: item.id, errorCodeId: vm.errorCodeModel.id });
        }
        else if (mappingDeatils && !item.isChecked) {
          if (mappingDeatils.id === 0) {
            _.remove(vm.categoryMappingList, { 'categoryID': item.id });
          }
          else {
            mappingDeatils.isDeleted = true;
          }
        }
      });
      vm.errorCodeModel.categoryMappingList = vm.categoryMappingList;
      vm.errorCodeModel.selectedErrorCodeList = _.map($scope.selectedErrorCodeList, 'id');
      vm.cgBusyLoading = RFQSettingFactory.saverfqlineErrorCode().save(vm.errorCodeModel).$promise.then((response) => {
        if (response && response.data) {
          BaseService.currentPagePopupForm = [];
          $mdDialog.hide(vm.errorCodeModel);
        } else {
          if (checkResponseHasCallBackFunctionPromise(response)) {
            response.alretCallbackFn.then(() => {
              BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.ErrorcodeForm);
            });
          }
        }
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });
    };

    function checkCopyErrorCode() {
      if ($scope.selectedErrorCodeList && $scope.selectedErrorCodeList.length > 0) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.RESTRICT_CONF_TEXT);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT,
          multiple: true
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            checkErrorCode();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        checkErrorCode();
      }
    }

    vm.saveErrorCode = () => {
      if (BaseService.focusRequiredField(vm.ErrorcodeForm)) {
        return;
      }
      if (vm.ErrorcodeForm.$invalid && !vm.isChange) {// || !vm.checkFormDirty(vm.ErrorcodeForm)
        BaseService.focusRequiredField(vm.ErrorcodeForm);
        return;
      }

      vm.isSubmit = false;
      if (!vm.ErrorcodeForm.$valid) {
        vm.isSubmit = true;
        return;
      }
      if (data && data.id && vm.oldErrorCode !== vm.errorCodeModel.errorCode) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.ERRORCODE_VALIDATION);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT,
          multiple: true
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            checkCopyErrorCode();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        checkCopyErrorCode();
      }
    };

    vm.addVariable = function (variable) {
      $scope.$broadcast('textatcaret', variable);
      $('#description').focus();
    };

    init();
    function init() {
      vm.cgBusyLoading = $q.all([getRFQLineItemssystemVariable(), getErrorCodeCategory(), getErrorCodeCategoryMapping(), getErroCodeList()]).then(() => {
        initautoComplete();

        // Merged Item static added for line merge step
        if (vm.autoCompleteCategory.keyColumnId === 14) {
          vm.systemVariableList.push({
            name: '<% Merged Item %>',
            isDisplay: true
          });
        }
        vm.systemVariableList = _.sortBy(vm.systemVariableList, 'name');
        _.each(vm.categoryList, (item) => {
          item.isChecked = false;
          const mappingDeatils = _.find(vm.categoryMappingList, { 'categoryID': item.id });
          if (mappingDeatils) {
            item.isChecked = true;
          }
        });
      }).catch((error) => BaseService.getErrorLog(error));
    }

    function getRFQLineItemssystemVariable() {
      return RFQSettingFactory.getRFQLineItemssystemVariable().query().$promise.then((res) => {
        if (res.data) {
          vm.systemVariableList = res.data.map((item) => ({ name: '<% ' + item.name + ' %>' }));
          return res.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    function getErrorCodeCategory() {
      return RFQSettingFactory.getErrorCodeCategory().query().$promise.then((response) => {
        if (response.data) {
          vm.categoryList = response.data;
          return response.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    function getErrorCodeCategoryMapping() {
      return RFQSettingFactory.getErrorCodeCategoryMapping().query({ errorCodeID: vm.errorCodeModel.id }).$promise.then((response) => {
        if (response.data) {
          vm.categoryMappingList = response.data;
          return response.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    function getErroCodeList() {
      return ImportBOMFactory.getErrorCode().query({}).$promise.then((response) => {
        _errorCodeLegendList = vm.errorCodeLegendList = [];
        if (response && response.data) {
          _.each(response.data, (item) => {
            if (item.id !== vm.errorCodeModel.id) {
              vm.errorCodeLegendList.push(item);
            }
          });
          _errorCodeLegendList = vm.errorCodeLegendList;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.getColor = ($event, error) => {
      // Show button in case of Line Merge but not allow to open popup ng-Disabled is not working because this button take default disabled color.
      var errorColor = error.errorColor;
      var color = CORE.DEFAULT_STANDARD_CLASS_COLOR;
      if (error.logicID === 14) {
        return;
      }

      if (errorColor) {
        const rgbColor = new tinycolor(errorColor).toRgb();
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
        vm.color = new tinycolor(color).toHex();
        if (vm.errorCodeModel.errorColor !== '#' + vm.color) {
          vm.isChange = true;
          vm.ErrorcodeForm.$$controls[0].$setDirty();
        }
        vm.errorCodeModel.errorColor = '#' + vm.color;
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /*
       * Author :  Jignesh Kalasariya
       * Purpose : Search Error Code
       */
    vm.SearchErrorCode = (list, searchText) => {
      if (!searchText) {
        vm.SearchErrorCodeText = null;
        vm.errorCodeLegendList = _errorCodeLegendList;
        vm.FilterOperation = true;
        return;
      }
      vm.errorCodeLegendList = $filter('filter')(_errorCodeLegendList, { displayName: searchText });
      vm.FilterErrorCodeList = vm.errorCodeLegendList.length > 0;
    };
    vm.AddToSelectedErrorcode = () => {
      $scope.selectedErrorCodeList = $filter('filter')(_errorCodeLegendList, { selected: true });
    };

    //select/deselected all error code.
    vm.SelectAllErrorCode = () => {
      vm.SelectAllError = !vm.SelectAllError;
      _.each(vm.errorCodeLegendList, (em) => {
        if (vm.SelectAllError) {
          em.selected = true;
        } else {
          em.selected = false;
        }
      });
      $scope.selectedErrorCodeList = $filter('filter')(_errorCodeLegendList, { selected: true });
      vm.ErrorcodeForm.$$controls[0].$setDirty();
    };

    vm.SelectAllErrorFn = function () {
      let isAllErrorSelected = false;
      if (vm.errorCodeLegendList && vm.errorCodeLegendList.length) {
        isAllErrorSelected = _.some(vm.errorCodeLegendList, (item) => item.selected === true);
      }
      vm.SelectAllError = isAllErrorSelected ? true : false;
      return isAllErrorSelected;
    };

    vm.cancel = () => {
      // Check vm.isChange flag for color picker dirty object
      const isdirty = vm.checkFormDirty(vm.ErrorcodeForm) || vm.isChange;
      if (isdirty) {
        const data = {
          form: vm.ErrorcodeForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    // copy message to clipboard
    vm.copyTextToClipBoard = () => {
      var $temp = $('<input>');
      $('body').append($temp);
      $temp.val(vm.errorCodeModel.org_description).select();
      document.execCommand('copy');
      $temp.remove();

      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.DISCRIPTION_COPY_TO_CLIPBORD);
      const alertModel = {
        messageContent: messageContent
      };
      DialogFactory.messageAlertDialog(alertModel);
    };

    /* Show History Popup */
    vm.openErrorCodeHistoryPopup = (ev) => {
      const data = {
        id: vm.errorCodeModel.id,
        title: vm.historyactionButtonName,
        TableName: CORE.DATAENTRYCHANGE_AUDITLOG_TABLENAME.RFQ_LINEITEMS_ERRORCODE,
        EmptyMesssage: CORE.COMMON_HISTORY.RFQ_LINEITEMS_ERRORCODE.HISTORY_EMPTY_MESSAGE,
        headerData: [{
          label: 'Logic Category',
          value: categoryName.value,
          displayOrder: 1,
          labelLinkFn: vm.goToRFQLineitemsErrorcodeList
        }, {
          label: 'Error Code',
          value: vm.errorCodeModel.errorCode,
          displayOrder: 2,
          labelLinkFn: vm.goToRFQLineitemsErrorcodeList
        }]
      };

      DialogFactory.dialogService(
        CORE.COMMON_HISTORY_POPUP_MODAL_CONTROLLER,
        CORE.COMMON_HISTORY_POPUP_MODAL_VIEW,
        ev,
        data).then(() => { }, (err) => BaseService.getErrorLog(err));
    };

    /* Goto BOM Error Code list page. */
    vm.goToRFQLineitemsErrorcodeList = () => BaseService.goToRFQLineitemsErrorcodeList();

    // Check Form Dirty state on state change and reload browser
    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.ErrorcodeForm];
    });
  }
})();
