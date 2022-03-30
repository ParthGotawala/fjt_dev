(function () {
  'use strict';

  angular
    .module('app.workorder')
    .controller('WorkorderGenerateSerialPopupController', WorkorderGenerateSerialPopupController);

  /** @ngInject */
  function WorkorderGenerateSerialPopupController($scope, $timeout, $mdDialog, WORKORDER, CORE, TRAVELER, DialogFactory,
    data, BaseService, WorkorderSerialMstFactory, SerialNumberConfigurationFactory, ReceivingMaterialFactory, GenericCategoryFactory, $q, USER) {
    const vm = this;
    vm.isDeleteFeatureBased = true;
    vm.showUMIDHistory = true;
    vm.actionButtonName = 'Serial# Transaction History';
    vm.woNumber = data.woNumber;
    vm.LabelConstant = CORE.LabelConstant;
    vm.woID = data.woID;
    vm.gridConfig = CORE.gridConfig;
    vm.serialType = CORE.SERIAL_TYPE.MANUFACTURE;
    const buildQty = data.buildQty;
    vm.SerialTypeLabel = CORE.SerialTypeLabel;
    vm.prodStatus = CORE.productStatus;
    vm.productStatusFilter = angular.copy(CORE.productStatusFilter);
    vm.productStatusFilter.splice(1, 0, { id: 'Idle', value: 'Idle' });
    vm.woInfo = {};
    vm.woInfo = data;
    vm.woInfo.isRevisedWO = data.isRevisedWO || false;
    let filterSerialType = {};
    vm.serialTypeData = CORE.SERIAL_TYPE;
    vm.assyDateCodeFormats = CORE.AssyDateCodeFormats;
    vm.Message = stringFormat(WORKORDER.REVISED_WO_NOTE, stringFormat('{0}-{1}', vm.woNumber, data.woVersion));
    vm.PREFIX_OR_SUFFIX_REQUIRED_MESSAGE = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.PREFIX_OR_SUFFIX_REQUIRED_MESSAGE;
    vm.loginUser = BaseService.loginUser;
    const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
    vm.WorkorderSerialNoConst = CORE.WorkorderSerialNo;
    vm.spaceNotAllowed = false;
    vm.EmptyMesssage = WORKORDER.WORKORDER_EMPTYSTATE.WORKORDER_SERIAL;
    vm.EmptyMesssageForMapProdSerials = WORKORDER.WORKORDER_EMPTYSTATE.WORKORDER_MAPPED_PRODUCT_SERIAL;
    vm.WaitWhileLoadMessage = WORKORDER.WORKORDER_EMPTYSTATE.LOADDETAILS;

    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.SERIALS_MORETHAN_BUILD_QTY_MSG = WORKORDER.SERIALS_MORETHAN_BUILD_QTY_MSG;
    vm.assemblyAllLabelConstant = CORE.LabelConstant.Assembly;
    vm.MFGLabelConstant = CORE.LabelConstant.MFG;
    const CategoryTypeObjList = angular.copy(CORE.CategoryType);
    vm.restrictLikOperatoreWildCardChar = CORE.restrictLikOperatoreWildCardChar;
    //go to manage part number
    vm.goToAssyMaster = () => {
        BaseService.goToComponentDetailTab(null, vm.woInfo.partID);
      return false;
    };
    //go to assy list
    vm.goToAssyList = () => {
        BaseService.goToPartList();
      return false;
    };

    //redirect to work order list
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    };
    //redirect to work order details
    vm.goToWorkorderDetails = () => {
      BaseService.goToWorkorderDetails(vm.woID);
      return false;
    };
    //go to workorder
    vm.getoWorkOrder = () => {
      BaseService.goToWorkorderDetails(vm.woInfo.terminateWOID);
    };
    vm.headerdata = [
      {
        label: CORE.LabelConstant.Workorder.WO, value: vm.woNumber, displayOrder: 1, labelLinkFn: vm.goToWorkorderList,
        valueLinkFn: vm.goToWorkorderDetails
      },
      {
        label: CORE.LabelConstant.Assembly.ID,
        value: vm.woInfo.PIDCode,
        displayOrder: 2,
        labelLinkFn: vm.goToAssyList,
        valueLinkFn: vm.goToAssyMaster,
        valueLinkFnParams: null,
        isCopy: true,
        isCopyAheadLabel: false,
        imgParms: {
          imgPath: vm.woInfo.rohsIcon,
          imgDetail: vm.woInfo.rohsName
        }
      },
      { label: CORE.LabelConstant.Assembly.NickName, value: vm.woInfo.nickName, displayOrder: 3 },
      { label: CORE.LabelConstant.Workorder.BuildQty, value: vm.woInfo.buildQty ? vm.woInfo.buildQty : 0, displayOrder: 4 }
    ];



    vm.radioButtonGroup = {
      PrefixorSuffix: {
        array: WORKORDER.WorkOrderRadioGroup.PrefixorSuffix
      }
    };

    /************************** On Load ******************************/
    const filterCategory = {
      ColumnDataType: 'Number',
      ColumnName: 'woID',
      SearchString: vm.woID
    };

    // reset serial type on reset button click
    const resetSerialTypeFilter = () => {
      filterSerialType = {
        ColumnDataType: 'Number',
        ColumnName: 'serialType',
        SearchString: vm.serialType
      };
    };

    const initModelData = () => {
      vm.workorderSerialModel = {
        PrefixorSuffix: true,
        PreSuffix: null,
        noofDigit: null,
        numOfSerialsToGenerate: null,
        dateCode: null,
        dateCodeFormat: null
      };
    };

    //checkWoOpTrackBySerial();

    /************************** On Page Load ******************************/

    /************************* Tab 0 and 1 - Serial# ***************************/
    const initSourceHeader = () => {
      vm.sourceHeader = [{
        field: 'Action',
        cellClass: 'gridCellColor',
        displayName: 'Action',
        width: '85',
        cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: true
      }, {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false
      }, {
        field: 'SerialNo',
        displayName: vm.serialType === CORE.SERIAL_TYPE.MANUFACTURE ? vm.SerialTypeLabel.MFRSerial.Label : vm.SerialTypeLabel.FinalSerial.Label,
        cellTemplate: '<div class="ui-grid-cell-contents text-left"><span>{{COL_FIELD}}</span>\
                            <copy-text text="row.entity.SerialNo" ng-if="row.entity.SerialNo"></copy-text></div>',
        width: 600
      }, {
        field: 'dateCode',
        displayName: 'Assy Date Code',
        width: 100
      }, {
        field: 'dateCodeFormat',
        displayName: 'Assy Date Code Format',
        width: 100
      }, {
        field: 'terminatedWorkOrder',
        displayName: stringFormat('From {0}', CORE.LabelConstant.Workorder.WO),
        width: 150,
        visible: vm.woInfo.isRevisedWO
      }, {
        field: 'opName',
        displayName: 'Current ' + vm.LabelConstant.Operation.OP,
        width: 250
      }, {
        field: 'currStatus',
        displayName: 'Current OP Status of ' + (vm.serialType === CORE.SERIAL_TYPE.MANUFACTURE ? vm.SerialTypeLabel.MFRSerial.Label : vm.SerialTypeLabel.FinalSerial.Label),
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.productStatusFilter
        },
        ColumnDataType: 'StringEquals',
        width: 200
      }, {
        field: 'updatedAt',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false
      }, {
        field: 'updatedBy',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }, {
        field: 'updatedByRole',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }, {
        field: 'createdAt',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_SCANNEDON,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false
      }, {
        field: 'createdBy',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_SCANNEDBY,
        enableFiltering: true,
        enableSorting: true,
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY
      }, {
        field: 'createByRole',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_SCANNEDBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }
      ];
    };
    const initPageInfo = () => {
      vm.pagingInfo = {
        // Page: CORE.UIGrid.Page(),
        SortColumns: [['ID', 'DESC']],
        SearchColumns: [],
        isPrint: true,
        pageName: CORE.PAGENAME_CONSTANT[47].PageName
      };
    };
    initPageInfo();

    const initAutoComplete = () => {
      vm.autoCompleteSeparator = {
        columnName: 'gencCategoryDisplayName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: null,
        inputName: CategoryTypeObjList.BarcodeSeparator.Name,
        placeholderName: CategoryTypeObjList.BarcodeSeparator.Title,
        addData: { headerTitle: CategoryTypeObjList.BarcodeSeparator.Title },
        isRequired: false,
        isAddnew: true,
        callbackFn: getGenericCategoryList,
        onSelectCallbackFn: selectGenericCategory
      };
    };

    // get barcode separator list
    const getGenericCategoryList = () => {
      const listObj = {
        GencCategoryType: [CategoryTypeObjList.BarcodeSeparator.Name],
        isActive: true
      };
      return GenericCategoryFactory.getSelectedGenericCategoryList().query({ listObj: listObj }).$promise.then((genericCategories) => {
        vm.separatorList = genericCategories.data;
        _.each(genericCategories.data, (item) => {
          item.gencCategoryDisplayName = item.gencCategoryCode ? stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.gencCategoryCode, item.gencCategoryName) : item.gencCategoryName;
        });
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // select barcode separator
    const selectGenericCategory = (item) => {
      if (item) {
        vm.workorderSerialModel.barcodeSeparatorID = item.gencCategoryID;
        vm.workorderSerialModel.barcodeSepCode = item.gencCategoryCode;
        vm.workorderSerialModel.barcodeSepValue = item.gencCategoryName;
      }
      else {
        vm.workorderSerialModel.barcodeSeparatorID = null;
        vm.workorderSerialModel.barcodeSepCode = null;
        vm.workorderSerialModel.barcodeSepValue = null;
      }
      // vm.GenerateStartEndNumber();
    };

    const initPromise = [getGenericCategoryList()];
    vm.cgBusyLoading = $q.all(initPromise).then(() => {
      initAutoComplete();
    }).catch((error) => BaseService.getErrorLog(error));

    vm.gridOptions = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      showColumnFooter: false,
      enableRowHeaderSelection: true,
      enableFullRowSelection: false,
      enableRowSelection: true,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      hideMultiDeleteButton: true,
      exporterCsvFilename: 'Work Order Serial#.csv'
    };
    function bindGridData() {
      _.each(vm.sourceData, (data) => {
        const selectedProdStatus = _.find(vm.prodStatus, (item) => item.id === data.currStatus);
        if (selectedProdStatus) {
          data.currStatus = selectedProdStatus.status;
        }
        if (!vm.enableDeleteOperation) {
          data.isDisabledDelete = true;
        }
      });
    }
    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setGridOptionsAfterGetData = (workorderSerials, isGetDataDown) => {
      if (workorderSerials && workorderSerials.data && workorderSerials.data.workorderSerialsList) {
        if (!isGetDataDown) {
          vm.sourceData = workorderSerials.data.workorderSerialsList;
          vm.currentdata = vm.sourceData.length;
        }
        else if (workorderSerials.data.workorderSerialsList.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(workorderSerials.data.workorderSerialsList);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        // must set after new data comes
        vm.totalSourceDataCount = workorderSerials.data.Count;
        bindGridData();
        if (!vm.gridOptions.enablePaging) {
          if (!isGetDataDown) {
            vm.gridOptions.gridApi.infiniteScroll.resetScroll();
          }
          else {
            vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
          }
        }
        if (!isGetDataDown) {
          vm.gridOptions.clearSelectedRows();
        }
        if (vm.totalSourceDataCount === 0) {
          if (vm.pagingInfo.SearchColumns.length > 2 || !_.isEmpty(vm.SearchMode)) {
            vm.isNoDataFound = false;
            vm.emptyState = 0;
          }
          else {
            vm.isNoDataFound = true;
            vm.emptyState = null;
          }
          /* start - set control's property */
          vm.isDisablePrefixorSuffix = false;
          vm.isDisablePreSuffix = false;
          vm.isDisableNoOfDigit = false;
          /* end - set model value and control's property */
        }
        else {
          vm.isNoDataFound = false;
          vm.emptyState = null;
          if (!vm.workorderSerialModel) {
            initModelData();
          }
          if (!vm.workorderSerialModel.configurationId) {
            /* start - set model value and control's property */
            //vm.workorderSerialModel.PrefixorSuffix = vm.sourceData[0].PrefixorSuffix;
            vm.isDisablePrefixorSuffix = true;
            // vm.workorderSerialModel.PreSuffix = vm.sourceData[0].PreSuffix;
            vm.workorderSerialModel.prefix = vm.sourceData[0].prefix;
            vm.workorderSerialModel.suffix = vm.sourceData[0].suffix;
            vm.isDisablePreSuffix = true;
            vm.workorderSerialModel.noofDigit = vm.sourceData[0].noofDigit;
            const maxNumber = Math.max.apply(Math, vm.sourceData.map((o) => o.serialIntVal));
            vm.workorderSerialModel.startNumber = maxNumber + 1;
          } else {
            vm.workorderSerialModel.startNumber = vm.workorderSerialModel.lastMaxNumber + 1;
          }
          vm.isDisableNoOfDigit = true;
          /* end - set model value and control's property */
        }
        $timeout(() => {
          if (!isGetDataDown) {
            vm.resetSourceGrid();
            if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          }
          else {
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
          }
        });
      }
    };
    /* retrieve work order serials list */
    vm.loadData = () => {
      vm.enableDeleteOperation = BaseService.checkFeatureRights(CORE.FEATURE_NAME.DeleteSerialNo);
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      resetSerialTypeFilter();
      vm.pagingInfo.SearchColumns.push(filterCategory);
      vm.pagingInfo.SearchColumns.push(filterSerialType);
      vm.pagingInfo.woID = vm.woID ? vm.woID : null;
      vm.pagingInfo.serialType = vm.serialType ? vm.serialType : vm.serialType;
      vm.cgBusyLoading = WorkorderSerialMstFactory.retriveWorkorderSerialsList().query(vm.pagingInfo).$promise.then((workorderSerials) => {
        if (workorderSerials && workorderSerials.data) {
          vm.gridOptions.hideMultiDeleteButton = !vm.enableDeleteOperation;
          //Following is commented as in all case need to  show button enabled as it is feature based . changed on 05/07/2021
          //vm.isDisbleReset = workorderSerials.data.isSerialsUsedInWOProcess;
          setGridOptionsAfterGetData(workorderSerials, false);
          if (vm.woInfo.isRevisedWO && vm.sourceData.length > 0) {
            vm.headerdata.push({
              label: stringFormat('From {0}', CORE.LabelConstant.Workorder.WO),
              value: vm.sourceData.length > 0 ? vm.sourceData[0].terminatedWorkOrder : '',
              displayOrder: 0,
              valueLinkFnParams: vm.woInfo.terminateWOID,
              valueLinkFn: vm.getoWorkOrder
            });
          }
          checkAllowedNoOfSerialsToAdd();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.pagingInfo.SearchColumns.push(filterCategory);
      vm.pagingInfo.SearchColumns.push(filterSerialType);
      vm.pagingInfo.woID = vm.woID ? vm.woID : null;
      vm.pagingInfo.serialType = vm.serialType ? vm.serialType : vm.serialType;
      vm.cgBusyLoading = WorkorderSerialMstFactory.retriveWorkorderSerialsList().query(vm.pagingInfo).$promise.then((workorderSerials) => {
        if (workorderSerials && workorderSerials.data) {
          setGridOptionsAfterGetData(workorderSerials, true);
          checkAllowedNoOfSerialsToAdd();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const checkAllowedNoOfSerialsToAdd = () => {
      vm.allowedSerialsToAdd = parseInt(buildQty - vm.totalSourceDataCount);
    };

    /* generate serials and add into table and return all to display in grid */
    vm.generateSerials = () => {
      if (vm.serialType === CORE.SERIAL_TYPE.PACKING) {
        if (vm.finalProductSerial && vm.finalProductSerial.$invalid) {
          BaseService.focusRequiredField(vm.finalProductSerial);
          return;
        }
      }
      else if (vm.serialType === CORE.SERIAL_TYPE.MANUFACTURE) {
        if (vm.mfgSerial && vm.mfgSerial.$invalid) {
          BaseService.focusRequiredField(vm.mfgSerial);
          return;
        }
      }

      vm.workorderSerialModel.suffix = vm.workorderSerialModel.suffix ? vm.workorderSerialModel.suffix : null;
      vm.workorderSerialModel.prefix = vm.workorderSerialModel.prefix ? vm.workorderSerialModel.prefix : null;

      if (!vm.workorderSerialModel.suffix && !vm.workorderSerialModel.prefix) {
        const model = {
          messageContent: angular.copy(vm.PREFIX_OR_SUFFIX_REQUIRED_MESSAGE),
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        return;
      }
      resetSerialTypeFilter();
      vm.pagingInfo.SearchColumns.push(filterCategory);
      vm.pagingInfo.SearchColumns.push(filterSerialType);

      const totalSerialToApply = parseInt(vm.workorderSerialModel.numOfSerialsToGenerate) + parseInt(vm.totalSourceDataCount || 0);

      if ((totalSerialToApply.toString()).length > vm.workorderSerialModel.noofDigit) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.WORKORDER_SERIAL_VALIDATION);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        return;
      }
      else {
        const defaultValue = '9';
        const endRangeLimit = parseInt(defaultValue.padStart(vm.workorderSerialModel.noofDigit, 9));
        const noofDigit = vm.workorderSerialModel && vm.workorderSerialModel.noofDigit ? vm.workorderSerialModel.noofDigit : 0;
        const numOfSerialsToGenerate = vm.workorderSerialModel && vm.workorderSerialModel.numOfSerialsToGenerate ? vm.workorderSerialModel.numOfSerialsToGenerate : 0;
        const startNumber = vm.workorderSerialModel && vm.workorderSerialModel.startNumber ? vm.workorderSerialModel.startNumber : 0;

        const endnumber = (startNumber + (numOfSerialsToGenerate - (numOfSerialsToGenerate ? 1 : 0))).toString().padStart(noofDigit, 0);

        if (endnumber > endRangeLimit) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SERIAL_NO_LIMIT_EXISTS);
          messageContent.message = stringFormat(messageContent.message, endRangeLimit + 1, vm.workorderSerialModel.noofDigit);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
          return;
        }
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SERIAL_NUMBER_COUNT);
        messageContent.message = stringFormat(messageContent.message, vm.workorderSerialModel.numOfSerialsToGenerate, vm.startNumber, vm.endNumber);
        const modelAlert = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT,
          multiple: true
        };
        return DialogFactory.messageConfirmDialog(modelAlert).then(() => {
          generateSerialsNo();
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    function generateSerialsNo() {
      const workorderSerialInfo = {
        woID: vm.woID,
        PrefixorSuffix: vm.workorderSerialModel.PrefixorSuffix,
        dateCode: vm.workorderSerialModel.dateCode,
        dateCodeFormat: vm.workorderSerialModel.dateCodeFormat && vm.workorderSerialModel.dateCodeFormat !== 'null' ? vm.workorderSerialModel.dateCodeFormat : null,
        noofDigit: vm.workorderSerialModel.noofDigit,
        numOfSerialsToGenerate: vm.workorderSerialModel.numOfSerialsToGenerate,
        currStatus: vm.workorderSerialModel.currStatus ? vm.workorderSerialModel.currStatus : 'Idle',
        buildQty: buildQty,
        serialType: vm.serialType,
        woNumber: vm.woNumber,
        prefix: vm.workorderSerialModel.prefix,
        suffix: vm.workorderSerialModel.suffix,
        configurationId: vm.workorderSerialModel.configurationId,
        startNumber: vm.workorderSerialModel.startNumber,
        prefixLock: vm.workorderSerialModel.prefixLock,
        suffixLock: vm.workorderSerialModel.suffixLock,
        isConsecutiveNumber: vm.workorderSerialModel.isConsecutiveNumber,
        serialNoSeparator: vm.workorderSerialModel.barcodeSepValue || '',
        barcodeSeparatorID: vm.workorderSerialModel.barcodeSeparatorID
      };
      vm.cgBusyLoading = WorkorderSerialMstFactory.workorder_serialmst().save(workorderSerialInfo).$promise.then((res) => {
        retriveConfiguration();
        if (res.status === CORE.ApiResponseTypeStatus.FAILED) {
          if (res.errors && res.errors.data && res.errors.data.isLimitExists) {
            vm.loadData();
          }
        } else if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.loadData();
          vm.workorderSerialModel.numOfSerialsToGenerate = null;
          // Selected Tab is Work order Serial#
          if (vm.mfgSerial) {
            vm.mfgSerial.$setPristine();
            vm.mfgSerial.$setUntouched();
          }
          vm.startNumber = null;
          vm.endNumber = null;
          // Selected Tab is Final Product Serial#
          if (vm.finalProductSerial) {
            vm.finalProductSerial.$setPristine();
            vm.finalProductSerial.$setUntouched();
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }
    /**Used to validate max size*/
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.GenerateStartEndNumber = () => {
      var noofDigit = vm.workorderSerialModel && vm.workorderSerialModel.noofDigit ? vm.workorderSerialModel.noofDigit : 0;
      var numOfSerialsToGenerate = vm.workorderSerialModel && vm.workorderSerialModel.numOfSerialsToGenerate ? vm.workorderSerialModel.numOfSerialsToGenerate : 0;
      var startNumber = vm.workorderSerialModel && vm.workorderSerialModel.startNumber ? vm.workorderSerialModel.startNumber : 0;
      var separator = '';
      var number = startNumber.toString().padStart(noofDigit, 0);
      var endNumber = (startNumber + (numOfSerialsToGenerate - (numOfSerialsToGenerate ? 1 : 0))).toString().padStart(noofDigit, 0);
      var prefix = vm.workorderSerialModel && vm.workorderSerialModel.prefix ? vm.workorderSerialModel.prefix : '';
      var suffix = vm.workorderSerialModel && vm.workorderSerialModel.suffix ? vm.workorderSerialModel.suffix : '';
      if (vm.autoCompleteSeparator) {
        separator = vm.workorderSerialModel.barcodeSepValue || '';
      }
      vm.startNumber = prefix + number + separator + suffix;
      vm.endNumber = prefix + endNumber + separator + suffix;
      vm.serialNumberLength = vm.startNumber ? vm.startNumber.length : 0;
    };

    /* delete all serial# of work order */
    vm.resetSerials = () => {
      if (!vm.isDisbleReset) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.CONFIRM_BEFORE_RESET_SERIAL);
        messageContent.message = stringFormat(messageContent.message, vm.serialType === CORE.SERIAL_TYPE.PACKING ? vm.SerialTypeLabel.FinalSerial.Label : vm.SerialTypeLabel.MFRSerial.Label);
        const modelAlert = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT,
          multiple: true
        };
        return DialogFactory.messageConfirmDialog(modelAlert).then(() => {
          // ask for password verfication-popup
          DialogFactory.dialogService(
            CORE.MANAGE_PASSWORD_POPUP_CONTROLLER,
            CORE.MANAGE_PASSWORD_POPUP_VIEW,
            null, {
            isValidate: true
          }).then((data) => {
            if (data) {
              // Delete records after password verified
              const deleteObj = {
                woID: vm.woID,
                serialType: vm.serialType,
                serialObj: { woNumber: vm.woNumber },
                PIDCode: vm.woInfo.PIDCode
              };
              vm.cgBusyLoading = WorkorderSerialMstFactory.workorder_serialmst().delete(deleteObj).$promise.then(() => {
                vm.workorderSerialModel.PrefixorSuffix = true,
                  vm.workorderSerialModel.PreSuffix = null,
                  vm.workorderSerialModel.noofDigit = null,
                  vm.workorderSerialModel.numOfSerialsToGenerate = null,
                  vm.workorderSerialModel.dateCode = null;
                // Selected Tab is Work order Serial#
                if (vm.mfgSerial) {
                  vm.mfgSerial.$setPristine();
                  vm.mfgSerial.$setUntouched();
                }
                // Selected Tab is Final Product Serial#
                if (vm.finalProductSerial) {
                  vm.finalProductSerial.$setPristine();
                  vm.finalProductSerial.$setUntouched();
                }
                retriveConfiguration();
                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                vm.gridOptions.clearSelectedRows();
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => { // password verification cancel
          }, (err) => BaseService.getErrorLog(err));
        }, () => { // confirmation cancel
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.cancel = () => {
      // let isDirty = false;
      if (BaseService.checkFormDirty(vm.mfgSerial)) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else if (BaseService.checkFormDirty(vm.finalProductSerial)) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else if (BaseService.checkFormDirty(vm.mappingSerials)) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    vm.onTabChanges = (msWizard) => {
      // reset start & end number as same model used in both tab
      vm.startNumber = null;
      vm.endNumber = null;
      vm.isHideDelete = false;
      // Final product Serial#
      if (msWizard.selectedIndex === 0) {
        vm.isPrinted = true;
        initPageInfo();
        vm.serialType = CORE.SERIAL_TYPE.PACKING;
        retriveConfiguration();
        getSerialsData();
        setFocusByName('Prefix');
        initSourceHeader();
        if (vm.gridOptions.gridApi) {
          vm.gridOptions.gridApi.grid.clearAllFilters();
        }
      }
      // MFR Serial#
      else if (msWizard.selectedIndex === 1) {
        vm.isPrinted = true;
        initPageInfo();
        initModelData();
        vm.serialType = CORE.SERIAL_TYPE.MANUFACTURE;
        getSerialsData();
        setFocusByName('Prefix');
        initSourceHeader();
        if (vm.gridOptions.gridApi) {
          vm.gridOptions.gridApi.grid.clearAllFilters();
        }
      }
      // Serial# Mapping
      else if (msWizard.selectedIndex === 2) {
        vm.isPrinted = false;
        initModelData();
        vm.clearMapSerialsData();
        initPageInfo();
        setFocusByName('mfgSerial');
        if (vm.gridOptionsForMapProdSerials.gridApi) {
          vm.gridOptionsForMapProdSerials.gridApi.grid.clearAllFilters();
        }
      }
    };

    function retriveConfiguration() {
      if (vm.serialType === CORE.SERIAL_TYPE.PACKING) {
        const reqeustModel = {
          partId: vm.woInfo.PIDCode,
          nickname: vm.woInfo.nickName
        };

        vm.cgBusyLoading = SerialNumberConfigurationFactory.retriveConfiguration(reqeustModel).query().$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            if (response.data && Array.isArray(response.data.configurationList) && response.data.configurationList.length > 0) {
              const detail = response.data.configurationList[0];
              if (!vm.workorderSerialModel) {
                initModelData();
              }
              vm.workorderSerialModel.prefix = detail.prefix;
              vm.workorderSerialModel.suffix = detail.suffix;
              vm.workorderSerialModel.configurationId = detail.id;
              vm.workorderSerialModel.noofDigit = detail.noofDigits;
              vm.workorderSerialModel.dateCode = detail.assyDateCode;
              vm.workorderSerialModel.lastMaxNumber = detail.lastMaxNumber;
              vm.workorderSerialModel.startNumber = detail.lastMaxNumber > 0 ? detail.lastMaxNumber + 1 : detail.startNumber;
              vm.workorderSerialModel.dateCodeFormat = detail.assyDateCodeFormat && detail.assyDateCodeFormat !== 'null' ? detail.assyDateCodeFormat : null;
              vm.workorderSerialModel.prefixLock = detail.prefixLock;
              vm.workorderSerialModel.suffixLock = detail.suffixLock;
              vm.workorderSerialModel.isConsecutiveNumber = detail.isConsecutiveNumber;
              vm.workorderSerialModel.barcodeSeparatorID = detail.barcodeSeparatorID;
              vm.workorderSerialModel.barcodeSeparatorLock = detail.barcodeSeparatorLock;
              if (vm.autoCompleteSeparator) {
                vm.autoCompleteSeparator.keyColumnId = detail.barcodeSeparatorID;
              }
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    }

    const getSerialsData = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.pagingInfo.SearchColumns = [];
      //vm.loadData();
    };
    /* delete data for Final Product serial# and MFR Serial# */
    vm.deleteRecord = (row) => {
      let selectedIDs = [];
      if (row) {
        selectedIDs.push(row.ID);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((item) => item.ID);
        }
      }
      const messageContentLabel = (vm.serialType === CORE.SERIAL_TYPE.PACKING) ? vm.SerialTypeLabel.FinalSerial.Label : vm.SerialTypeLabel.MFRSerial.Label;
      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, messageContentLabel, selectedIDs.length);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };

        DialogFactory.messageConfirmDialog(obj).then(() => {
          // ask for password verfication-popup
          DialogFactory.dialogService(
            CORE.MANAGE_PASSWORD_POPUP_CONTROLLER,
            CORE.MANAGE_PASSWORD_POPUP_VIEW,
            null, {
            isValidate: true
          }).then((data) => {
            if (data) {
              // delete record after password verified
              const deleteObj = {
                IDList: selectedIDs,
                isMultipleDelete: (selectedIDs.length > 0) ? true : false,
                woID: vm.woID,
                serialType: vm.serialType,
                serialObj: {
                  woNumber: vm.woNumber
                },
                PIDCode: vm.woInfo.PIDCode
              };
              // vm.cgBusyLoading = WorkorderSerialMstFactory.deleteProductSerialMapping().save({ deleteObj: deleteObj }).$promise.then((res) => {
              vm.cgBusyLoading = WorkorderSerialMstFactory.workorder_serialmst().delete(deleteObj).$promise.then((res) => {
                if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                  BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                  vm.gridOptions.clearSelectedRows();
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => { // password cancel
          }, (err) => BaseService.getErrorLog(err));
        }, () => { // confirmation cancel
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        //show validation message no data selected
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, messageContentLabel);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
      }
    };
    /* delete multiple data for Final Product serial# and MFR Serial# */
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };

    /* *****************  Mapping Final Product Serial# ****************** */

    const initMapProductSerialModelData = () => {
      vm.mapProductSerialModel = {
        productSerialNumber: null,
        mfgSerialNumber: null
      };
    };

    vm.loadMappedProductSerialsData = () => {
      vm.pagingInfoForMapProdSerials.Page = CORE.UIGrid.Page();
      vm.pagingInfoForMapProdSerials.SearchColumns = [];
      initMapProductSerialModelData();
      //$timeout(() => {
      //    vm.isLoadMappedProductSerial = true;
      //}, 0);
    };

    vm.SerialTypeLabel = CORE.SerialTypeLabel;

    vm.sourceHeaderForMapProdSerials = [{
      field: 'Action',
      cellClass: 'gridCellColor',
      displayName: 'Action',
      width: '60',
      cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
      enableFiltering: false,
      enableSorting: false,
      exporterSuppressExport: true,
      pinnedLeft: true
    }, {
      field: '#',
      width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
      cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference !== \'P\'">\
      <span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span>\
      </div>\
      <div class="ui-grid-cell-contents grid-cell-text-right" ng-if="grid.appScope.$parent.vm.loginUser.uiGridPreference === \'P\'">\
      <span><b>{{(grid.appScope.$parent.vm.pagingInfoForMapProdSerials.pageSize * (grid.appScope.$parent.vm.pagingInfoForMapProdSerials.Page - 1)) + (grid.renderContainers.body.visibleRowCache.indexOf(row) + 1)}}</b></span>\
      </div>',
      enableFiltering: false,
      enableSorting: false
    }, {
      field: 'mfgSerialNo',
      displayName: vm.SerialTypeLabel.MFRSerial.Label,
      width: 300
    },
    {
      field: 'SerialNo',
      displayName: vm.SerialTypeLabel.FinalSerial.Label,
      width: 300
    }, {
      field: 'MappingopName',
      displayName: 'Mapping ' + vm.LabelConstant.Operation.OP,
      width: 250
    }, {
      field: 'mappingByEmp',
      displayName: 'Mapping By',
      width: 150
    }, {
      field: 'mappingOnDate',
      displayName: 'Mapping On',
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
      type: 'datetime',
      enableFiltering: false
    }, {
      field: 'updatedAt',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
      type: 'datetime',
      enableFiltering: false
    }, {
      field: 'updatedby',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
      type: 'StringEquals',
      enableFiltering: true
    }, {
      field: 'updatedbyRole',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
      type: 'StringEquals',
      enableFiltering: true
    }, {
      field: 'createdAt',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
      type: 'datetime',
      enableFiltering: false
    }, {
      field: 'createdby',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
      type: 'StringEquals',
      enableFiltering: true
    }, {
      field: 'createdbyRole',
      displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
      cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
      type: 'StringEquals',
      enableFiltering: true
    }];

    vm.pagingInfoForMapProdSerials = {
      Page: CORE.UIGrid.Page(),
      SortColumns: [['ID', 'DESC']],
      SearchColumns: [],
      isPrint: false
    };

    vm.gridOptionsForMapProdSerials = {
      enablePaging: isEnablePagination,
      enablePaginationControls: isEnablePagination,
      showColumnFooter: false,
      enableRowHeaderSelection: true,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: true,
      filterOptions: vm.pagingInfoForMapProdSerials.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'MappedProductSerialList.csv'
    };

    // to set data in grid after data is retrived from API in loadData() and getDataDown() function
    const setDataAfterGetAPICall = (workorderSerials, isGetDataDown) => {
      if (workorderSerials && workorderSerials.data && workorderSerials.data.mappedProductSerialsList) {
        if (!isGetDataDown) {
          vm.sourceDataForMapProdSerials = workorderSerials.data.mappedProductSerialsList;
          vm.currentdataForMapProdSerials = vm.sourceDataForMapProdSerials.length;
        }
        else if (workorderSerials.data.mappedProductSerialsList.length > 0) {
          vm.sourceDataForMapProdSerials = vm.gridOptionsForMapProdSerials.data = vm.gridOptionsForMapProdSerials.data.concat(workorderSerials.data.mappedProductSerialsList);
          vm.currentdataForMapProdSerials = vm.gridOptionsForMapProdSerials.currentItem = vm.gridOptionsForMapProdSerials.data.length;
        }
        // must set after new data comes
        vm.totalSourceDataCountForMapProdSerials = workorderSerials.data.Count;
        if (!vm.gridOptionsForMapProdSerials.enablePaging) {
          if (!isGetDataDown) {
            vm.gridOptionsForMapProdSerials.gridApi.infiniteScroll.resetScroll();
          }
          else {
            vm.gridOptionsForMapProdSerials.gridApi.infiniteScroll.saveScrollPercentage();
          }
        }
        if (!isGetDataDown) {
          vm.gridOptionsForMapProdSerials.clearSelectedRows();
        }
        if (vm.totalSourceDataCountForMapProdSerials === 0) {
          if (vm.pagingInfoForMapProdSerials.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
            vm.isNoDataFoundForMapProdSerials = false;
            vm.emptyStateForMapProdSerials = 0;
          }
          else {
            vm.isNoDataFoundForMapProdSerials = true;
            vm.emptyStateForMapProdSerials = null;
          }
        }
        else {
          vm.isNoDataFoundForMapProdSerials = false;
          vm.emptyStateForMapProdSerials = null;
        }
        $timeout(() => {
          if (!isGetDataDown) {
            vm.resetSourceGridForMapProdSerials();
            if (!vm.gridOptionsForMapProdSerials.enablePaging && vm.totalSourceDataCountForMapProdSerials === vm.currentdataForMapProdSerials) {
              return vm.gridOptionsForMapProdSerials.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          }
          else {
            return vm.gridOptionsForMapProdSerials.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCountForMapProdSerials !== vm.currentdataForMapProdSerials ? true : false);
          }
        });
      }
    };
    /* retrieve mapped work order serials list */
    vm.loadDataForMapProdSerials = () => {
      BaseService.setPageSizeOfGrid(vm.pagingInfoForMapProdSerials, vm.gridOptionsForMapProdSerials);
      vm.pagingInfoForMapProdSerials.woID = vm.woID ? vm.woID : null;
      vm.cgBusyLoading = WorkorderSerialMstFactory.retrieveAllMappedFinalProductSerialsList().query(vm.pagingInfoForMapProdSerials).$promise.then((workorderSerials) => {
        if (workorderSerials && workorderSerials.data) {
          // Allow to delete only from work order operation
          vm.isHideDelete = !vm.woInfo.isAllowFinalSerialMapping;
          setDataAfterGetAPICall(workorderSerials, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getDataDownForMapProdSerials = () => {
      vm.pagingInfoForMapProdSerials.Page = vm.pagingInfoForMapProdSerials.Page + 1;
      // vm.pagingInfo.serialType = vm.serialType ? vm.serialType : vm.serialType;
      vm.cgBusyLoading = WorkorderSerialMstFactory.retrieveAllMappedFinalProductSerialsList().query(vm.pagingInfoForMapProdSerials).$promise.then((workorderSerials) => {
        if (workorderSerials && workorderSerials.data) {
          setDataAfterGetAPICall(workorderSerials, true);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* check mfr serial# valid for mapping */
    vm.checkMFGSerialValid = () => {
      if (!vm.woInfo.isAllowFinalSerialMapping) {
        const model = {
          messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.MAPPING_SERIAL_NO_NOT_ALLOW),
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        return;
      }
      if (!vm.mapProductSerialModel.mfgSerialNumber) {
        return;
      }
      vm.isMFGSerialValidForMap = false;
      const mfgSerialInfo = {
        woID: vm.woID,
        mfgSerialNumber: vm.mapProductSerialModel.mfgSerialNumber
      };
      vm.cgBusyLoading = WorkorderSerialMstFactory.checkMFGSerialValid().save(mfgSerialInfo).$promise.then((res) => {
        if (res && res.data && res.data.mfgSerialRes) {
          vm.isMFGSerialValidForMap = res.data.mfgSerialRes.isValidForMapping;
          $timeout(() => {
            angular.element(document.getElementById('finalProductSerial')).focus();
          }, 0);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* check product serial# valid for mapping */
    vm.checkProductSerialValidAndSave = () => {
      if (!vm.woInfo.isAllowFinalSerialMapping) {
        const model = {
          messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.MAPPING_SERIAL_NO_NOT_ALLOW),
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        return;
      }
      if (!vm.mapProductSerialModel.productSerialNumber || !vm.mapProductSerialModel.mfgSerialNumber) {
        return;
      }
      //vm.isProductSerialValidForMap = false;
      const productSerialMappingInfo = {
        woID: vm.woID,
        woOPID: vm.woInfo ? vm.woInfo.woOPID : null,
        mfgSerialNumber: vm.mapProductSerialModel.mfgSerialNumber,
        productSerialNumber: vm.mapProductSerialModel.productSerialNumber
      };

      ///* uncomment only if Map button uncomment from ui */
      vm.cgBusyLoading = WorkorderSerialMstFactory.saveProductSerialMapping().save(productSerialMappingInfo).$promise.then((res) => {
        if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          reloadProductSerialMappingData();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const reloadProductSerialMappingData = () => {
      vm.clearMapSerialsData();
      vm.pagingInfoForMapProdSerials.Page = CORE.UIGrid.Page();
      vm.pagingInfoForMapProdSerials.SearchColumns = [];
      vm.loadDataForMapProdSerials();
    };

    /* for clear text box model values */
    vm.clearMapSerialsData = () => {
      $timeout(() => {  // STATIC CODE - timeout to reset form
        if (vm.mappingSerials) {
          vm.mappingSerials.$setPristine();
          vm.mappingSerials.$setUntouched();
        }
        initMapProductSerialModelData();
      }, 0);
      vm.isMFGSerialValidForMap = false;
    };

    /* remove product mapping serial# */
    vm.deleteRecordForMapProdSerials = (row) => {
      let selectedIDs = [];
      if (row) {
        selectedIDs.push(row.ID);
      } else {
        vm.selectedRows = vm.selectedRowsListForMapProdSerials;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((item) => item.ID);
        }
      }
      if (selectedIDs) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Product serial# mapping', selectedIDs.length);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };

        DialogFactory.messageConfirmDialog(obj).then((response) => {
          if (response) {
            const deleteObj = {
              deleteSerialIDsMapping: selectedIDs
            };
            vm.cgBusyLoading = WorkorderSerialMstFactory.deleteProductSerialMapping().save({ deleteObj: deleteObj }).$promise.then((res) => {
              if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                BaseService.reloadUIGrid(vm.gridOptionsForMapProdSerials, vm.pagingInfoForMapProdSerials, initPageInfo, vm.loadDataForMapProdSerials);
                vm.gridOptionsForMapProdSerials.clearSelectedRows();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        //show validation message no data selected
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, 'Product serial# mapping');
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
      }
    };

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleDataForMapProdSerials = () => {
      vm.deleteRecordForMapProdSerials();
    };

    /* fun to check form dirty on tab change */
    vm.isStepValid = function (step) {
      let isDirty = false;
      //if (vm.woInfo.isOperationTrackBySerialNo) {
      switch (step) {
        case 0: {
          isDirty = BaseService.checkFormDirty(vm.finalProductSerial);
          if (isDirty) {
            return showWithoutSavingAlertforTabChange(step);
          } else {
            return true;
          }
        }
        case 1: {
          isDirty = BaseService.checkFormDirty(vm.mfgSerial);
          if (isDirty) {
            return showWithoutSavingAlertforTabChange(step);
          } else {
            return true;
          }
        }
        case 2: {
          isDirty = vm.mappingSerials.$dirty;
          if (isDirty) {
            return showWithoutSavingAlertforTabChange(step);
          } else {
            return true;
          }
        }
      }
    };

    /* Show save alert popup when performing tab change*/
    function showWithoutSavingAlertforTabChange(step) {
      const obj = {
        messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE),
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      return DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          if (step === 0) {
            vm.finalProductSerial.$setPristine();
            vm.finalProductSerial.$setUntouched();
            return true;
          } else if (step === 1) {
            vm.mfgSerial.$setPristine();
            vm.mfgSerial.$setUntouched();
            return true;
          } else if (step === 2) {
            vm.mappingSerials.$setPristine();
            vm.mappingSerials.$setUntouched();
            return true;
          }
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    }

    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    vm.checkAssyDateCode = () => {
      var isValid = false;
      isValid = !BaseService.validateDateCode(vm.workorderSerialModel.dateCodeFormat, vm.workorderSerialModel.dateCode);
      if (vm.serialType === CORE.SERIAL_TYPE.PACKING) {
        vm.finalProductSerial.dateCode.$setValidity('invalidDateCode', isValid);
        //vm.finalProductSerial.dateCode.$error.invalidDateCode === isValid;
      }
      else {
        vm.mfgSerial.dateCode.$setValidity('invalidDateCode', isValid);
        //vm.mfgSerial.dateCode.$error.invalidDateCode === isValid;
      }
    };

    // view serial# history
    vm.UMIDHistory = (rowData, ev) => {
      var dataObj = {
        serialNoid: rowData.ID,
        serialNo: rowData.SerialNo,
        woID: data.woID,
        woNumber: data.woNumber,
        woVersion: data.woVersion
      };
      DialogFactory.dialogService(
        TRAVELER.SERIAL_NUMBER_TRANS_HISTORY_CONTROLLER,
        TRAVELER.SERIAL_NUMBER_TRANS_HISTORY_VIEW,
        ev,
        dataObj).then(() => {
        }, () => {
        }, (error) => BaseService.getErrorLog(error));
    };

    // print serial num for Final Product Serial# and MFR Serial#
    vm.printRecord = (row, ev) => {
      $scope.PrintDocument(row, ev);
    };
    $scope.PrintDocument = (row) => {
      vm.rowData = {};
      if (row && row.entity) {
        vm.rowData = row.entity;
      } else {
        vm.rowData.selectedRecord = row;
      }
      vm.rowData.pageName = WORKORDER.WORKORDER_SERIAL_NUMBER_LABEL;
      DialogFactory.dialogService(CORE.PRINT_BARCODE_LABEL_MODAL_CONTROLLER, CORE.PRINT_BARCODE_LABEL_MODAL_VIEW, event, vm.rowData).then(() => {
      }, (printerDetailList) => {
        if (printerDetailList) {
          const printList = [];
          let printObj;
          _.each(printerDetailList, (data) => {
            printObj = {
              'count': 1,
              'reqName': 'Print',
              'numberOfPrint': data.noPrint,
              'PrinterName': data.PrinterName,
              'ServiceName': data.ServiceName,
              'printType': data.printType,
              'pageName': WORKORDER.WORKORDER_SERIAL_NUMBER_LABEL,
              'mfgPN': vm.woInfo.mfgPN, // assy#
              'PIDCode': vm.woInfo.PIDCode, // assyID
              'nickName': vm.woInfo.nickName,
              'SerialNo': data.SerialNo,
              'woNumber': vm.woNumber,
              'dateCode': data.dateCode,
              // 'packaging': null,
              'mfgPNDescription': vm.woInfo.mfgPNDescription ? vm.woInfo.mfgPNDescription : null,
              'rohs': vm.woInfo.rohsName ? vm.woInfo.rohsName : null,
              'partPackage': vm.woInfo.partPackage ? vm.woInfo.partPackage : null,
              'userCode': null
            };
            printList.push(printObj);
          });
          vm.cgBusyLoading = ReceivingMaterialFactory.printLabelTemplate().query({ printObj: printList }).$promise.then(() => {
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }, (err) => BaseService.getErrorLog(err));
    };

    // Navigate to Barcode Seprator List
    vm.goToBarcodeSeparatorsList = () => {
      vm.goToBarcodeSeparatorsList = () => {
        const genCategory = _.find(CORE.Category_Type, (data) => data.categoryType === CORE.CategoryType.BarcodeSeparator.Name);
        BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_BARCODE_SEPARATOR_STATE, { categoryTypeID: genCategory.categoryTypeID });
      };
    };

    //multiple prints
    $scope.$on('PrintDocument', (name, data) => {
      $scope.PrintDocument(data.data, data.ev);
    });
  }
})();
