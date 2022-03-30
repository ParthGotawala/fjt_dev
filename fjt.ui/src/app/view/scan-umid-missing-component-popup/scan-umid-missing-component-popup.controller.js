(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('ScanUMIDMissingComponentPopupController', ScanUMIDMissingComponentPopupController);

  /** @ngInject */
  function ScanUMIDMissingComponentPopupController($scope, $mdDialog, $filter, data, BaseService, TRAVELER, CORE, $timeout, USER,
    CONFIGURATION, WORKORDER, WorkorderTransactionUMIDFactory, MasterFactory,
    DialogFactory, NotificationFactory, RFQTRANSACTION, TRANSACTION) {
    const vm = this;
    const loginUserDetails = BaseService.loginUser;
    const IsPermanentDelete = CORE.IsPermanentDelete;
    vm.data = data;
    vm.isShowLight = true;
    vm.isHideDelete = true; // delete not allowed in case of missing part
    vm.isEditIntigrate = false;
    vm.IsShowEditMaterials = false;
    vm.showHistory;
    vm.isViewVerificationHistory = (vm.data.isVerify ? true : false);
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.UMID_MAX_LENGTH = CORE.UMID_MAX_LENGTH;
    vm.LabelConstant = CORE.LabelConstant;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    vm.ScanStatusOptionsGridHeaderDropdown = CORE.ScanStatusOptionsGridHeaderDropdown;
    vm.verificationType = CORE.VerificationType;
    const errorMesg = vm.data.isDisableScan ? stringFormat(angular.copy(TRAVELER.SCAN_DISABLE), '<b>Start/Resume Activity</b>') : null;
    vm.umidScan = {
      type: vm.verificationType.OnlyUMID, checkKitAllocation: true,
      isPlacementTracking: vm.data.isPlacementTracking ? vm.data.isPlacementTracking : false,
      saveUMIDDetails: false,
      errorText: errorMesg
    };
    vm.DateFormatArray = _dateDisplayFormat;
    vm.rowFieldData = 'AllocatedStock';
    vm.stockType = 'ALL';
    vm.title = stringFormat('{0} Missing Material', vm.data.isVerify ? 'Verify' : 'Scan');
    vm.InvalidRefDesMessage = stringFormat(CORE.MESSAGE_CONSTANT.INVALID_DYNAMIC, vm.LabelConstant.BOM.REF_DES);

    vm.goToComponentBOM = () => {
      BaseService.goToComponentBOM(vm.data.partID);
      return false;
    };
    /*
   * Author :  Vaibhav Shah
   * Purpose : go to assy list
   */
    vm.goToAssyList = () => {
      BaseService.goToPartList();
      return false;
    };

    /*
    * Author :  Vaibhav Shah
    * Purpose : go to manage part number
    */
    vm.goToAssyMaster = () => {
      BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG.toLowerCase(), vm.data.partID, USER.PartMasterTabs.Detail.Name);
      return false;
    };

    /*
     * Author :  Vaibhav Shah
     * Purpose : Work Order List
     */
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    };
    vm.goToWorkorderDetails = () => {
      BaseService.goToWorkorderDetails(vm.data.woID);
      return false;
    };

    /* redirect to employee(personnel) master */
    vm.goToPersonnelList = () => {
      BaseService.goToPersonnelList();
      return false;
    };

    // Go to  manufacturer of scanned UMID
    vm.goToManufacturer = (id) => {
      BaseService.goToManufacturer(id);
    };

    vm.headerdata = [];
    vm.headerdata.push({
      label: vm.LabelConstant.Workorder.WO, value: vm.data.woNumber, displayOrder: 1, labelLinkFn: vm.goToWorkorderList,
      valueLinkFn: vm.goToWorkorderDetails,
      valueLinkFnParams: { woID: vm.data.woID },
      isCopy: false
    });
    vm.headerdata.push({
      label: vm.LabelConstant.Workorder.Version, value: vm.data.woVersion, displayOrder: 3
    });

    // operation name
    vm.data.opFullName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, vm.data.opName, vm.data.opNumber);
    const initAutoComplete = () => {
      vm.autoCompleteEmployee = {
        columnName: 'name',
        keyColumnName: 'employeeID',
        keyColumnId: vm.data.employeeId,
        inputName: 'Personnel',
        placeholderName: 'Personnel',
        isRequired: false,
        onSelectCallbackFn: function (empItem) {
          if (vm.umidDetails && empItem) {
            setFocusByName('refdes');
          } else if (vm.umidDetails) {
            setFocusByName('Personnel');
          } else {
            setFocusByName('umid');
          }
        }
      };
    };
    if (vm.data.isTeamOperation) {
      initAutoComplete();
    }

    vm.EmptyMesssage = WORKORDER.WORKORDER_EMPTYSTATE.WORKORDER_OPERATION_UMID_DETAILS;

    // Check whether KIT return is done or not
    // Entry only allow through this popup if Complete Kit is return for given WO
    const checkKitReturnStatus = () => {
      let messageContent;
      if (vm.data.woID && vm.data.woSubStatus === CORE.WOSTATUS.COMPLETED_WITH_MISSING_PARTS) {
        const obj = { woID: vm.data.woID };
        vm.cgBusyLoading = WorkorderTransactionUMIDFactory.checkWOKitReutrn().query({ obj: obj }).$promise.then((response) => {
          if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            if (response.data && response.data.kitReturnCnt === 0) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SCAN_MISSING_PART_KIT_NOT_RETURN);
              messageContent.message = stringFormat(messageContent.message, vm.data.woNumber);
              vm.umidScan.errorText = messageContent.message;
              vm.data.isDisableScan = true;
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));;
      } else if (vm.data.woSubStatus !== CORE.WOSTATUS.COMPLETED_WITH_MISSING_PARTS) {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SCAN_MISSING_WRONG_WO_STATUS);
        messageContent.message = stringFormat(messageContent.message, vm.data.woNumber, CORE.WoStatus[8].Name);
        vm.umidScan.errorText = messageContent.message;
        vm.data.isDisableScan = true;
      }
    };

    if (!vm.data.isDisableScan) {
      checkKitReturnStatus();
    };

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['updatedAt', 'DESC']],
        SearchColumns: [],
        pageName: CORE.PAGENAME_CONSTANT[17].PageName,
        woOpEqpID: vm.data.woOpEqpID ? vm.data.woOpEqpID : null,
        woOPID: vm.data.woOPID ? vm.data.woOPID : null,
        woTransID: vm.data.woTransID ? vm.data.woTransID : null,
        isVerify: vm.data.isVerify ? true : false,
        transactionType: CORE.TransactionType.UMID
      };
    };
    initPageInfo();

    vm.gridOptions = {
      showColumnFooter: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: false,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      enableCellEdit: false,
      enableCellEditOnFocus: true,
      exporterCsvFilename: 'Work Order Transaction UMID Details.csv',
      hideAddNew: false
    };

    // common items
    const commonItems = [
      //{
      //  field: 'action',
      //  displayName: 'Action',
      //  width: 110,
      //  cellTemplate: `<grid-action-view grid="grid" row="row"></grid-action-view>`,
      //  enableFiltering: false,
      //  enableCellEdit: false,
      //  enableSorting: false,
      //  exporterSuppressExport: true,
      //},
      {
        field: '#',
        width: '70',
        cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
        enableFiltering: false,
        enableSorting: false,
        enableCellEdit: false,
        enableCellEditOnFocus: false,
        allowCellFocus: false
      }, {
        field: 'partUsedFrom',
        displayName: 'Part Used From',
        cellTemplate: '<div class="ui-grid-cell-contents">'
          + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.partUsedFrom != \'Work Order Part\',  \'label-warning\': row.entity.partUsedFrom == \'Work Order Part\'}"> \
                                {{ row.entity.partUsedFrom}}'
          + '</span>'
          + '</div>',
        width: 270,
        enableCellEdit: false,
        enableCellEditOnFocus: false,
        allowCellFocus: false
      },
      {
        field: 'isVerifiedConvertedValue',
        displayName: 'Verification Status',
        cellTemplate: '<div class="ui-grid-cell-contents">'
          + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.isVerified == true, \
                            \'label-warning\':row.entity.isVerified == false}"> \
                                {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.ScanStatusOptionsGridHeaderDropdown
        },
        ColumnDataType: 'StringEquals',
        width: 120,
        enableCellEditOnFocus: false
      },
      {
        field: 'updatedAt',
        displayName: 'Used On',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
        type: 'datetime',
        enableSorting: true,
        enableFiltering: false,
        enableCellEditOnFocus: false
      }, {
        field: 'scannedBy',
        displayName: 'Used By',
        width: 130,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        enableCellEdit: false,
        enableCellEditOnFocus: false
      },
      {
        field: 'umid',
        displayName: CORE.LabelConstant.TransferStock.UMID,
        width: 180,
        cellTemplate: '<div class="ui-grid-cell-contents">' +
          '<a class="cm-text-decoration" ng-click="grid.appScope.$parent.vm.goToUMIDDetail(row.entity.refsidid)">{{COL_FIELD}}</a> ' +
          '<copy-text ng-if="row.entity.umid" label="row.entity.umid" text="row.entity.umid"></copy-text></div > ',
        enableCellEdit: false,
        enableCellEditOnFocus: false,
        allowCellFocus: false
      }, {
        field: 'PIDCode',
        displayName: CORE.LabelConstant.MFG.PID,
        cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link ng-class="{\'text-double-line-through\':row.entity.restrictPermission}"  ng-style="{\'text-decoration-line\':row.entity.isRestricted?\'line-through\':\'\'}"\
                                        component-id="row.entity.refcompid" \
                                        label="grid.appScope.$parent.vm.LabelConstant.MFG.PID" \
                                        value="row.entity.PIDCode" \
                                        is-copy="true" \
                                        is-mfg="true" \
                                        mfg-label="grid.appScope.$parent.vm.LabelConstant.MFG.MFGPN" \
                                        mfg-value="row.entity.mfgPN" \
                                        rohs-icon="row.entity.rohsIcon" \
                                        rohs-status="row.entity.rohsName" \
                                        is-custom-part="row.entity.isCustom" \
                                        is-copy-ahead-label="true" \
                                        is-search-digi-key="true" \
                                        is-search-findchip="true"></common-pid-code-label-link></div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.PID,
        enableCellEdit: false,
        enableCellEditOnFocus: false,
        allowCellFocus: false
      },
      {
        field: 'custPN',
        displayName: 'CPN(Component)',
        width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
        cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                                component-id="row.entity.custPNID" \
                                                label="grid.appScope.$parent.vm.LabelConstant.MFG.PID" \
                                                value="row.entity.custPNPIDCode" \
                                                is-copy="true" \
                                                is-mfg="true" \
                                                mfg-label="grid.appScope.$parent.vm.LabelConstant.MFG.CPN" \
                                                mfg-value="row.entity.custPN" \
                                                rohs-icon="row.entity.custPNrohsIcon" \
                                                rohs-status="row.entity.custPNrohsName" \
                                                is-copy-ahead-label="true" \
                                                is-search-findchip="false" \
                                                is-custom-part="row.entity.custIsCustom"\
                                                is-search-digi-key="false"> \
                                    </common-pid-code-label-link></div>',
        enableCellEdit: false,
        enableCellEditOnFocus: false,
        allowCellFocus: false
      },
      {
        field: 'consumeQty',
        displayName: 'Consume Qty',
        width: 120,
        // cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD | unit}}</div>',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"  ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}">{{COL_FIELD}}</div>',
        type: 'number',
        enableCellEdit: false,
        enableCellEditOnFocus: false
      },
      {
        field: 'refDesig',
        displayName: vm.LabelConstant.BOM.REF_DES,
        width: 120,
        cellTemplate: '<div class="ui-grid-cell-contents"  ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}">{{COL_FIELD}}</div>',
        validators: { required: true },
        enableCellEdit: true,
        enableCellEditOnFocus: true,
        type: 'text',
        editableCellTemplate: '<div class="grid-edit-input"><form name="inputForm"><input capitalize type="INPUT_TYPE" ng-style="{\'background-color\':rowRenderIndex % 2==0?\'transparent !important\':\'#f3f3f3 !important\'}" ng-class="\'colt\' + col.uid" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}" ui-grid-editor ng-model="MODEL_COL_FIELD" style="width:100%;text-align:left;border:none;margin-left:-10px"></form></div>',
        cellEditableCondition: function (scope) {
          // allow to edit only if added in same transaction
          return (vm.IsShowEditMaterials && scope.row.entity.woTransID === vm.data.woTransID);
        }
      },
      {
        field: 'validRefDesig',
        displayName: 'LINE ' + vm.LabelConstant.BOM.REF_DES,
        width: 120,
        cellTemplate: '<div class="ui-grid-cell-contents"><span>{{COL_FIELD}}</span><copy-text ng-if="row.entity.validRefDesig" label="row.entity.validRefDesig" text="row.entity.validRefDesig"></copy-text></div>',
        allowCellFocus: false,
        enableCellEdit: false,
        enableCellEditOnFocus: false
      },
      {
        field: 'assyQty',
        displayName: 'Assy Qty',
        width: 120,
        // cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD | unit}}</div>',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"  ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}">{{COL_FIELD}}</div>',
        type: 'number',
        validators: { required: true },
        enableCellEdit: false,
        enableCellEditOnFocus: false
      }];
    const additionalDetails = [
      {
        field: 'mfgCode',
        displayName: CORE.LabelConstant.MFG.MFG,
        width: 120,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        enableCellEdit: false
      },
      {
        field: 'mfgPN',
        displayName: CORE.LabelConstant.MFG.MFGPN,
        width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
        cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link ng-if="row.entity.refcompid" \
                                    component-id="row.entity.refcompid" \
                                    label="grid.appScope.$parent.vm.LabelConstant.MFG.ID" \
                                    value="row.entity.mfgPN" \
                                    is-copy="true" \
                                    rohs-icon="row.entity.rohsIcon" \
                                    rohs-status="row.entity.rohsName" \
                                    is-custom-part="row.entity.isCustom" \
                                    is-search-digi-key="true"\
                                    is-search-findchip="true"></common-pid-code-label-link></div>',
        enableCellEdit: false,
        enableCellEditOnFocus: false,
        allowCellFocus: false
      },
      {
        field: 'mfgPNDescription',
        displayName: 'MPN Description',
        width: 400,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        enableCellEdit: false,
        enableCellEditOnFocus: false,
        allowCellFocus: false
      },
      //{
      //    field: 'alternateParts',
      //    displayName: 'Alternate Part',
      //    width: 400,
      //    cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
      //    enableCellEdit: false,
      //},
      {
        field: 'expiryDate',
        displayName: vm.LabelConstant.UMIDManagement.DateOfExpiration,
        width: 120,
        //cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD | date:grid.appScope.$parent.vm.DateFormatArray}}</div>',
        cellTemplate: '<div class="ui-grid-cell-contents" ng-class="{\'color-red\':row.entity.isPartExpired }" \
                             style="text-align:center">{{row.entity.expiryDate | date:grid.appScope.$parent.vm.DateFormatArray}}</div>',
        enableFiltering: false,
        enableCellEdit: false,
        enableCellEditOnFocus: false,
        allowCellFocus: false,
        type: 'date'
      },
      {
        field: 'pkgQty',
        displayName: vm.LabelConstant.KitAllocation.Count,
        width: 120,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD | unit}}</div>',
        enableCellEdit: false
      },
      {
        field: 'pkgUnit',
        displayName: vm.LabelConstant.KitAllocation.Units,
        width: 120,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD | unit}}</div>',
        enableCellEdit: false,
        enableCellEditOnFocus: false
      },
      {
        field: 'partUOM',
        displayName: 'UOM',
        width: 120,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        enableCellEdit: false,
        enableCellEditOnFocus: false
      },
      {
        field: 'verifiedBy',
        displayName: 'Verified By',
        width: 130,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        enableCellEdit: false,
        enableCellEditOnFocus: false
      },
      {
        field: 'verifiedOn',
        displayName: 'Verified On',
        width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
        enableCellEdit: false,
        enableSorting: true,
        type: 'datetime',
        enableFiltering: false,
        enableCellEditOnFocus: false
      },
      {
        field: 'approvedBy',
        displayName: 'Approved By',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        enableCellEdit: false,
        enableFiltering: false,
        allowCellFocus: false
      },
      {
        field: 'approvedOn',
        displayName: 'Approved On',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
        enableCellEdit: false,
        allowCellFocus: false,
        type: 'datetime',
        enableSorting: true,
        enableFiltering: false
      },
      {
        field: 'approvedReason',
        displayName: 'Approval Reason',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        enableSorting: true,
        enableFiltering: true,
        allowCellFocus: false
      }
    ];


    //keep watch to update directive value base on selection details
    $scope.$watch('vm.showHistory', (newValue, oldvalue) => {
      if (oldvalue !== newValue) {
        //if history than show common fields only
        //...will copy array items
        vm.sourceHeader = [];
        initPageInfo();
        if (newValue) {
          vm.sourceHeader = [...commonItems];
          vm.IsShowEditMaterials = true;
        }
        //if all than display all values
        else {
          vm.sourceHeader = [...commonItems, ...additionalDetails];
          vm.IsShowEditMaterials = false;
        }
      }
    });

    /* retrieve umid details list*/
    vm.loadData = () => {
      var index = 0;
      vm.cgBusyLoading = WorkorderTransactionUMIDFactory.umid_transaction(vm.pagingInfo).query({
        id: null
      }).$promise.then((response) => {
        if (response && response.data && response.data.feeder) {
          vm.sourceData = response.data.feeder;
          const todayDate = new Date().setHours(0, 0, 0, 0);
          _.each(vm.sourceData, (s) => {
            s.index = index + 1;
            s.rohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, s.rohsIcon);
            s.custPNrohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, s.custPNrohsIcon);
            if (s.expiryDate) {
              if (new Date(s.expiryDate) < todayDate) {
                s.isPartExpired = true;
              }
            }
            s.isShowLight = false;
          });
          vm.totalSourceDataCount = response.data.Count;
          if (!vm.gridOptions.enablePaging) {
            vm.currentdata = vm.sourceData ? vm.sourceData.length : null;
            vm.gridOptions.gridApi.infiniteScroll.resetScroll();
          }
          vm.gridOptions.clearSelectedRows();
          if (vm.totalSourceDataCount === 0) {
            if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
              vm.isNoDataFound = false;
              vm.emptyState = 0;
            }
            else {
              vm.isNoDataFound = true;
              vm.emptyState = null;
            }
          }
          else {
            vm.isNoDataFound = false;
            vm.emptyState = null;
          }
          $timeout(() => {
            vm.resetSourceGrid();
            if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          });
          if (vm.IsShowEditMaterials && !vm.isEditIntigrate) {
            cellEdit();
          } else {
            vm.isEditIntigrate = false;
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // reset all and getdata
    vm.resetAll = () => {
      vm.umidScan = {
        type: vm.verificationType.OnlyUMID, checkKitAllocation: true,
        isPlacementTracking: vm.data.isPlacementTracking ? vm.data.isPlacementTracking : false,
        saveUMIDDetails: false
      };
      vm.isUmidScanned = false;
      vm.umidDetails = null;
      vm.umidScan.successText = null;
      vm.umidScan.errorText = null;
      vm.umidScan.isConfirmed = false;
      if (vm.ScanMissingUMIDDetails) {
        vm.ScanMissingUMIDDetails.$setPristine();
        vm.ScanMissingUMIDDetails.$setUntouched();
      }
      setFocusByName('umid');
      vm.selectedbomLineItemList = [];
    };

    // close popup
    vm.cancel = () => {
      var isdirty = vm.checkFormDirty(vm.ScanMissingUMIDDetails);
      if (isdirty) {
        const data = {
          form: vm.ScanMissingUMIDDetails
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };
    let oldScanUMID = null;
    // umid scan - validation
    vm.validateUMIDDetails = (e, authenticationApprovedDet) => {
      const umidObj = {
        UMID: vm.umidScan.umid ? vm.umidScan.umid : null,
        partID: vm.data.partID ? vm.data.partID : null,
        woOPID: vm.data.woOPID ? vm.data.woOPID : null,
        woTransID: vm.data.woTransID ? vm.data.woTransID : null,
        employeeId: getEmployeeID(),
        checkKitAllocation: vm.umidScan.checkKitAllocation ? vm.umidScan.checkKitAllocation : false,
        verificationType: vm.verificationType.OnlyUMID,
        isVerify: vm.data.isVerify ? true : false,
        rfqLineItemsID: vm.umidScan.rfqLineItemsID ? vm.umidScan.rfqLineItemsID : null,
        isConfirmed: vm.umidScan.isConfirmed ? vm.umidScan.isConfirmed : false,
        woID: vm.data.woID,
        transactionType: CORE.TransactionType.UMID,
        authenticationApprovedDet: authenticationApprovedDet,
        isPlacementTracking: false, //vm.umidScan.isPlacementTracking ? vm.umidScan.isPlacementTracking : false,
        saveUMIDDetails: vm.umidScan.saveUMIDDetails ? vm.umidScan.saveUMIDDetails : false,
        refDesig: vm.umidScan.refdes ? vm.umidScan.refdes : null,
        assyQty: vm.umidScan.assyQty ? vm.umidScan.assyQty : null,
        consumeQty: vm.umidScan.consumeQty ? vm.umidScan.consumeQty : 0,
        umidAllocateStatus: vm.umidScan.umidAllocateStatus ? vm.umidScan.umidAllocateStatus : 0,
        createdBy: loginUserDetails.userid ? loginUserDetails.userid : null,
        createdByRoleId: loginUserDetails.defaultLoginRoleID
      };
      vm.cgBusyLoading = WorkorderTransactionUMIDFactory.validateScanMissingUMIDOnly().query({ umidObj: umidObj }).$promise.then((res) => {
        oldScanUMID = angular.copy(vm.umidScan.umid);
        let errorMessage = [];
        let confirmationMessage = [];
        vm.umidScan.isSuccess = false;

        if (res.data && res.data.umidAllocateStatus) {
          vm.umidScan.umidAllocateStatus = res.data.umidAllocateStatus[0].allocationStatus;
        } else {
          vm.umidScan.umidAllocateStatus = 0;
        }
        vm.isUmidScanned = true;
        if (res.data && res.data.umidDetails && res.data.umidDetails.length > 0) {
          vm.umidDetails = _.first(res.data.umidDetails);
          vm.umidDetails.pkgQty = (vm.umidDetails.umidUOMClassID === CORE.MEASUREMENT_TYPES.COUNT.ID ? vm.umidDetails.pkgQt : $filter('unit')(vm.umidDetails.pkgQty));
        }
        vm.umidScan.errorText = null;
        if (res.data && res.data.errorObjList && res.data.errorObjList.length > 0) {
          // vm.isUmidScanned = false;
          // display error message on screen
          errorMessage = _.filter(res.data.errorObjList, (itemObj) => itemObj.isUMIDError);
          if (errorMessage.length > 0) {
            // to hide pidcode details if umid details are not correct
            const findUMIDError = _.find(res.data.errorObjList, (itemObj) => itemObj.isUMIDError);
            if (!vm.umidScan.umid || findUMIDError) {
              vm.umidDetails = null;
            }
            errorMessage = errorMessage.map((item) => item.errorText).join('<br/>');
            vm.umidScan.errorText = errorMessage;

            if (res.data && res.data.uidVerificationDet.length > 0) {
              vm.uidVerificationDet = _.first(res.data.uidVerificationDet);
            }
            if (res.data.umidDetails && res.data.umidDetails.length > 0 && vm.uidVerificationDet) {
              const umidID = _.first(res.data.umidDetails);
              vm.uidVerificationDet.umidID = umidID.refsidid ? umidID.refsidid : null;
            }
            const obj = {
              uidVerificationDet: vm.uidVerificationDet,
              feederScan: vm.umidScan
            };
            // lock screen
            localStorage.setItem('UnlockFeederDetail', JSON.stringify(obj));

            DialogFactory.dialogService(
              TRAVELER.FEEDER_SCAN_FAILED_MODAL_CONTROLLER,
              TRAVELER.FEEDER_SCAN_FAILED_MODAL_VIEW,
              e,
              obj).then(() => {
                localStorage.removeItem('UnlockFeederDetail');
              }, () => {
              }, (err) => BaseService.getErrorLog(err));
          }

          // display confirmation message on screen
          confirmationMessage = _.filter(res.data.errorObjList, (itemObj) => itemObj.isConfirmation);

          if (confirmationMessage.length > 0) {
            const findRestrictErrorMessage = _.find(confirmationMessage, (restObj) => restObj.stringText1 === 'DUP');
            if (!findRestrictErrorMessage) {
              if (vm.umidDetails) {
                let msgText = '';
                if (vm.umidDetails.partLevelRestrictUSEwithpermission) {
                  msgText = CORE.MESSAGE_CONSTANT.RESTRICT_WITH_PERMISSION.RESTRICT_WITH_PERMISSION_AT_PART_MASTER;
                } else if (vm.umidDetails.partLevelRestrictPackagingUseWithpermission) {
                  msgText = CORE.MESSAGE_CONSTANT.RESTRICT_WITH_PERMISSION.RESTRICT_WITH_PACKAGING_ALIAS_WITH_PERMISSION_AT_PART_MASTER;
                } else if (vm.umidDetails.rfqLevelRestrictCPNUseWithPermissionStep
                  || vm.umidDetails.lineLevelRestrictUseWithPermissionStep
                  || vm.umidDetails.lineLevelRestrictUseInBOMWIThPermissionStep
                  || vm.umidDetails.lineLevelRestrictUseInBOMExcludingAliasWithPermissionStep) {
                  msgText = CORE.MESSAGE_CONSTANT.RESTRICT_WITH_PERMISSION.RESTRICT_WITH_PERMISSION_AT_BOM;
                } else if (res.data && res.data.errorObjList.length > 0) {
                  msgText = _.first(res.data.errorObjList).errorText;
                }
                const data = {
                  featureName: CORE.FEATURE_NAME.AllowRestrictWithPermission,
                  isAllowSaveDirect: false,
                  isFromTravelerScan: true,
                  msgObject: {
                    msgText: stringFormat(msgText, vm.umidDetails.PIDCode)
                  }
                };

                DialogFactory.dialogService(
                  CORE.RESTRICT_ACCESS_CONFIRMATION_MODAL_CONTROLLER,
                  CORE.RESTRICT_ACCESS_CONFIRMATION_MODAL_VIEW,
                  e, data).then((resOfAuthData) => {
                    if (resOfAuthData) {
                      const _restrictPartAuthenticationDet = {
                        refID: null,
                        refTableName: CORE.TABLE_NAME.WORKORDER_TRANS_UMID_DETAILS,
                        isAllowSaveDirect: false,
                        approveFromPage: vm.title,
                        approvedBy: resOfAuthData.approvedBy,
                        confirmationType: CORE.Generic_Confirmation_Type.UMID_SETUP_SCAN,
                        approvalReason: resOfAuthData.approvalReason,
                        createdBy: loginUserDetails.userid,
                        updatedBy: loginUserDetails.userid
                      };

                      const authenticationApprovedDet = angular.copy(_restrictPartAuthenticationDet);
                      authenticationApprovedDet.transactionType = stringFormat(CORE.MESSAGE_CONSTANT.GENERIC_AUTHENTICATION_REASON.UMID_SETUP_SCAN,
                        vm.data.PIDCode, vm.data.woNumber, vm.data.opFullName);
                      authenticationApprovedDet.woOPID = vm.data.woOPID;

                      vm.umidScan.checkKitAllocation = true;
                      vm.umidScan.isConfirmed = true;
                      vm.validateUMIDDetails(e, authenticationApprovedDet);
                    }
                  }, () => {
                  }).catch((error) => BaseService.getErrorLog(error));
              }
            } else {
              confirmationMessage = confirmationMessage.map((item) => item.errorText).join('<br/>');
              const obj = {
                title: CORE.MESSAGE_CONSTANT.CONFIRMATION,
                textContent: confirmationMessage,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              DialogFactory.confirmDiolog(obj).then((response) => {
                if (response) {
                  vm.umidScan.checkKitAllocation = true;
                  vm.umidScan.isConfirmed = true;
                  vm.validateUMIDDetails(e);
                }
              }, () => {
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }
        }
        if (vm.umidDetails) {
          updateImagePath(vm.umidDetails);
          checkExpiryDateValidation(errorMessage, confirmationMessage);
          vm.selectedbomLineItemList = [];
          if (res.data && res.data.bomLineItemDetails && res.data.bomLineItemDetails.length > 1) {
            vm.selectedbomLineItemList = res.data.bomLineItemDetails;
          } else {
            if (errorMessage.length === 0 && confirmationMessage.length === 0) {
              sucessMessgae(errorMessage, res);
            }
            $timeout(() => {
              BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
              vm.gridOptions.clearSelectedRows();
            });
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // check for expiry date validation
    const checkExpiryDateValidation = (errorMessage, confirmationMessage) => {
      if (errorMessage.length === 0 && confirmationMessage.length === 0) {
        // check for expiry date added or not
        if (vm.umidDetails.expiryDate) {
          const dayDiff = date_diff_indays(new Date(), new Date(vm.umidDetails.expiryDate));

          // logic to get higher date from system level and part level for alert
          let getHigherDays = null;
          if (vm.ExpireDaysLeft && vm.umidDetails.alertExpiryDays) {
            getHigherDays = parseInt(vm.ExpireDaysLeft) > parseInt(vm.umidDetails.alertExpiryDays) ? parseInt(vm.ExpireDaysLeft) : parseInt(vm.umidDetails.alertExpiryDays);
          }
          else if (!vm.ExpireDaysLeft) {
            getHigherDays = parseInt(vm.umidDetails.alertExpiryDays);
          }
          else if (!vm.umidDetails.alertExpiryDays) {
            getHigherDays = parseInt(vm.ExpireDaysLeft);
          }

          if (vm.ExpireDaysLeft && dayDiff <= getHigherDays) {
            vm.umidDetails.expiryDateText = stringFormat(TRAVELER.EXPIRYDAYALERT, $filter('date')(new Date(vm.umidDetails.expiryDate), vm.DateFormatArray), dayDiff);
            //res.data.errorObjList.push({ errorText: stringFormat(TRAVELER.EXPIRYDAYALERT, dayDiff), isMessage: true, isUMIDError: false, isFeederError: false, isConfirmation: false });
          }
        }
      }
    };

    // scan label
    vm.scanLabel = (e) => {
      if (!vm.data.isDisableScan) {
        $timeout(() => scanLabel(e), true);
      }
      ///** Prevent enter key submit event */
      //preventInputEnterKeyEvent(e);
    };

    const scanLabel = (e) => {
      localStorage.removeItem('UnlockFeederDetail');
      // do  changes only if enter pressed
      if (e.keyCode === 13) {
        oldScanUMID = oldScanUMID || angular.copy(vm.umidScan.umid);
        // set null lineItemsID if not match with new umid
        if (oldScanUMID && oldScanUMID !== vm.umidScan.umid) {
          oldScanUMID = vm.umidScan.umid;
          vm.umidScan.rfqLineItemsID = null;
          vm.umidDetails = null;
          vm.umidScan.errorText = null;
          vm.umidScan.isConfirmed = false;
        }
        if (vm.umidScan.umid) {
          vm.validateUMIDDetails(e);
        } else {
          // case will not come but incase no umid type selected than display invalid
          const alertModel = {
            title: CORE.MESSAGE_CONSTANT.INVALID,
            textContent: stringFormat(CORE.MESSAGE_CONSTANT.INVALID_DYNAMIC, 'UMID'),
            multiple: true
          };
          DialogFactory.alertDialog(alertModel);
        }
      }
    };

    // view assembly at glance from costing module
    vm.AssyAtGlance = (e) => {
      const obj = {
        partID: vm.data.partID,
        mfgPNDescription: vm.data.mfgPNDescription
      };
      DialogFactory.dialogService(
        RFQTRANSACTION.ASSEMBLY_AT_GLANCE_CONTROLLER,
        RFQTRANSACTION.ASSEMBLY_AT_GLANCE_VIEW,
        e,
        obj).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    // show cart location for feeder
    vm.showLight = () => {
      const alertModel = {
        title: 'Comming Soon',
        multiple: true
      };
      DialogFactory.alertDialog(alertModel);
    };

    // on change of umid
    $scope.$watch('vm.umidScan.umid', (newVal, oldVal) => {
      if (newVal !== oldVal) {
        vm.umidScan.checkKitAllocation = true;
        vm.umidScan.saveUMIDDetails = false;
        vm.umidScan.refdes = null;
        vm.umidScan.assyQty = null;
      }
    });
    /* called for max length validation */
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    const getSelectedGlobalSettingKeyValues = () => {
      //Get expire day and umid verification require values
      MasterFactory.getSelectedGlobalSettingKeyValues().query({ allKeys: [CONFIGURATION.SETTING.ExpireDaysLeft] }).$promise.then((response) => {
        if (response.data) {
          _.each(response.data, (item) => {
            switch (item.key) {
              case CONFIGURATION.SETTING.ExpireDaysLeft:
                vm.ExpireDaysLeft = item.values;
                break;
            }
          });
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    getSelectedGlobalSettingKeyValues();

    // umid transfer
    vm.uidTranfer = (event, data) => {
      data.uid = null;
      if (vm.umidScan.umid) {
        data.uid = vm.umidScan.umid;
      }
      DialogFactory.dialogService(
        TRANSACTION.UID_TRANSFER_CONTROLLER,
        TRANSACTION.UID_TRANSFER_VIEW,
        event,
        data).then(() => {
        }, (transfer) => {
          if (transfer) {
            // comming soon
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    const updateImagePath = (details) => {
      if (details) {
        if (!details.imageURL) {
          details.imageURL = CORE.WEB_URL + USER.COMPONENT_DEFAULT_IMAGE_PATH + 'profile.jpg';
        } else {
          if (!details.imageURL.startsWith('http://') && !details.imageURL.startsWith('https://')) {
            details.imageURL = BaseService.getPartMasterImageURL(details.documentPath, details.imageURL);
          }
        }
      }
    };

    // view umid verification details
    vm.showVerificationDetails = (row, event) => {
      var data = {
        equipment: null,
        woID: vm.data.woID,
        opID: vm.data.opID,
        woOPID: vm.data.woOPID,
        woTransUMIDDetID: row.entity.id,
        eqpFeederID: null,
        eqpID: null,
        woOpEqpID: null,
        feederCount: 0,
        partID: vm.data.partID,
        woNumber: vm.data.woNumber,
        woVersion: vm.data.woVersion,
        opName: vm.data.opName,
        opNumber: vm.data.opNumber,
        opVersion: vm.data.opVersion,
        PIDCode: vm.data.PIDCode,
        mfgPNDescription: vm.data.mfgPNDescription,
        nickName: vm.data.nickName,
        mfgPN: vm.data.mfgPN,
        rohsStatus: vm.data.name,
        name: vm.data.name,
        rohsIcon: vm.data.rohsIcon,
        isTraveler: true,
        transactionType: CORE.TransactionType.UMID
      };
      DialogFactory.dialogService(
        TRAVELER.TRAVELER_VERIFICATION_FEEDER_DETAILS_CONTROLLER,
        TRAVELER.TRAVELER_VERIFICATION_FEEDER_DETAILS_VIEW,
        event,
        data).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };

    // common function for success message
    const sucessMessgae = (errorMessage, res) => {
      errorMessage = _.filter(res.data.errorObjList, (itemObj) => itemObj.isMessage);
      errorMessage = errorMessage.map((item) => item.errorText).join('<br/>');
      if (vm.data.isVerify) {
        NotificationFactory.success(TRAVELER.UMID_VERIFIED_SUCCESSFULLY);
      } else {
        if (!errorMessage) {
          if (vm.data.isPlacementTracking) {
            setFocusByName('Personnel');
          }
          return;
        }
        NotificationFactory.success(errorMessage);
      }
      // vm.umidScan.errorText = errorMessage;
      vm.umidScan.successText = errorMessage;
      vm.umidScan.isSuccess = true;
      vm.umidScan.isConfirmed = false;
      //vm.umidScan.rfqLineItemsID = null;
      vm.umidScan.checkKitAllocation = true;
      vm.umidScan.saveUMIDDetails = false;
      $scope.$applyAsync();
    };


    //select feeder
    vm.setLineItemDetails = (item) => {
      var keyEvent = jQuery.Event('keydown');
      vm.umidScan.rfqLineItemsID = item.rfqLineItemsID;
      keyEvent.keyCode = 13;
      vm.scanLabel(keyEvent);
    };

    // go to umid list
    vm.goToUMIDList = () => {
      BaseService.goToUMIDList();
    };

    // go to Manage UMID
    vm.goToUMIDDetail = (id) => BaseService.goToUMIDDetail(id);

    /*Used to open UMID*/
    vm.viewUMIDHistoryPopup = (ev) => {
      const popUpHeaderData = {
        equipmentName: null,
        wo: vm.data.woNumber,
        version: vm.data.woVersion,
        eqpID: null
      };
      const data = { isScanUMIDOnly: true, woID: vm.data.woID, isScanFeederFirstAndUMIDFirstAndChangeReel: false, woOPID: vm.data.woOPID ? vm.data.woOPID : null, headerData: popUpHeaderData };
      DialogFactory.dialogService(
        TRAVELER.SCAN_UMID_VIEW_HISTORY_MODAL_CONTROLLER,
        TRAVELER.SCAN_UMID_VIEW_HISTORY_MODAL_VIEW,
        ev,
        data).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };


    // delete
    vm.deleteRecord = (workOrderTransUMID) => {
      let selectedIDs = [];
      if (workOrderTransUMID) {
        selectedIDs.push(workOrderTransUMID.id);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((workOrderTransItem) => workOrderTransItem.id);
        }
      }

      if (selectedIDs) {
        const obj = {
          title: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM, 'Scan material'),
          textContent: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM_MESSAGE, selectedIDs.length, 'Scan material'),
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        const objIDs = {
          id: selectedIDs,
          isPermanentDelete: IsPermanentDelete,
          CountList: false
        };
        DialogFactory.confirmDiolog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = WorkorderTransactionUMIDFactory.deleteWorkorderTransUMIDDetails().query({ objIDs: objIDs }).$promise.then((res) => {
              if (res && res.data) {
                if (res.data.length > 0 || res.data.transactionDetails) {
                  const data = {
                    TotalCount: res.data.transactionDetails[0].TotalCount,
                    pageName: CORE.PageName.workorder_transaction_umid_details
                  };
                  BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                    const objIDs = {
                      id: selectedIDs,
                      CountList: true
                    };
                    return WorkorderTransactionUMIDFactory.deleteWorkorderTransUMIDDetails().query({ objIDs: objIDs }).$promise.then((res) => {
                      let data = {};
                      data = res.data;
                      data.pageTitle = workOrderTransUMID ? vm.data.woNumber : null;
                      data.PageName = CORE.PageName.workorder_transaction_umid_details;
                      data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' Selected');
                      if (res.data) {
                        DialogFactory.dialogService(
                          USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                          USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                          ev,
                          data).then(() => {
                          }, () => {
                          });
                      }
                    }).catch((error) => BaseService.getErrorLog(error));
                  });
                }
                else {
                  BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                  vm.gridOptions.clearSelectedRows();
                }
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        //show validation message no data selected
        const alertModel = {
          title: USER.USER_ERROR_LABEL,
          textContent: stringFormat(USER.SELECT_ONE_LABEL, 'Scan material')
        };
        DialogFactory.alertDialog(alertModel);
      }
    };

    vm.goToKitList = () => {
      BaseService.goToKitList(null, null, null);
      return false;
    };

    // check form dirty
    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    //on load submit form
    angular.element(() => {
      //check load
      BaseService.currentPagePopupForm.push(vm.ScanMissingUMIDDetails);
    });

    ///* delete multiple data called from directive of ui-grid*/
    //vm.deleteMultipleData = () => {
    //  vm.deleteRecord();
    //}

    // save umid details
    vm.saveScanUMIDDetails = (e) => {
      if (vm.ScanMissingUMIDDetails.$invalid) {
        BaseService.focusRequiredField(vm.ScanMissingUMIDDetails);
        return false;
      }
      vm.umidScan.saveUMIDDetails = true;
      vm.validateUMIDDetails(e);
    };

    /** Validate Ref. Desg */
    vm.validateRefDesg = () => {
      vm.umidScan.errorText = '';
      if (vm.umidScan.refdes) {
        const refDesg_list = getDesignatorFromLineItem(vm.umidDetails ? vm.umidDetails.refDesig : [], vm.data.bomOddlyRefDesList);
        const entered_list = getDesignatorFromLineItem(vm.umidScan.refdes, vm.data.bomOddlyRefDesList);
        const notInList = _.difference(entered_list, refDesg_list);
        if (notInList.length > 0) {
          $scope.$applyAsync(() => {
            vm.ScanMissingUMIDDetails.refdes.$setValidity('invalidrefdesg', false);
          });
          return false;
        }
        vm.ScanMissingUMIDDetails.refdes.$setValidity('invalidrefdesg', true);
      }
    };

    const getEmployeeID = () => {
      let empID = null;
      if (vm.data.isTeamOperation && vm.autoCompleteEmployee && vm.autoCompleteEmployee.keyColumnId) {
        empID = vm.autoCompleteEmployee.keyColumnId;
      }
      else if (vm.data && vm.data.employeeId) {
        empID = vm.data.employeeId;
      }
      return empID;
    };

    // validate refdesg details
    const validateScanMaterialDetails = (colDef, rowEntity, isEdit) => {
      // let objFindDuplicate;
      if (isEdit) {
        //if (colDef.field == 'refDesig') {
        const refDesg_list = getDesignatorFromLineItem(rowEntity.validRefDesig, vm.data.bomOddlyRefDesList);
        const entered_list = getDesignatorFromLineItem(rowEntity.refDesig, vm.data.bomOddlyRefDesList);
        const notInList = _.difference(entered_list, refDesg_list);
        if (notInList.length > 0) {
          rowEntity.isRefDesValid = false;
          vm.gridOptions.gridApi.grid.validate.setInvalid(rowEntity, vm.sourceHeader[6]);
          const model = {
            title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
            textContent: vm.InvalidRefDesMessage,
            multiple: true
          };
          DialogFactory.alertDialog(model);
          return;
        } else {
          vm.gridOptions.gridApi.grid.validate.setValid(rowEntity, vm.sourceHeader[6]);
        }

        // number format
        if (!_.isNumber(rowEntity.assyQty)) {
          rowEntity.isAssyQtyValid = false;
          vm.gridOptions.gridApi.grid.validate.setInvalid(rowEntity, vm.sourceHeader[7]);
        } else {
          vm.gridOptions.gridApi.grid.validate.setValid(rowEntity, vm.sourceHeader[7]);
        }
        //}
        //if (colDef.field == 'assyQty') {
        //}
      }
    };

    // cell edit for qty and refdesig details in material used
    function cellEdit() {
      vm.isEditIntigrate = true;
      vm.gridOptions.gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newvalue, oldvalue) => {
        if (rowEntity.id) {
          if (colDef.field === 'refDesig' || colDef.field === 'assyQty') {
            if (newvalue !== oldvalue) {
              rowEntity.isRefDesValid = true;
              rowEntity.isAssyQtyValid = true;
              validateScanMaterialDetails(colDef, rowEntity, true);
            }
          }
          if (newvalue !== oldvalue && rowEntity.refDesig && rowEntity.isRefDesValid && rowEntity.isAssyQtyValid) {
            const col = colDef.field;
            const umidInfo = {
            };
            umidInfo[col] = newvalue;
            if (colDef.field === 'refDesig' || colDef.field === 'assyQty') {
              umidInfo.refDesig = rowEntity.refDesig;
              umidInfo.assyQty = rowEntity.assyQty;
            }
            vm.cgBusyLoading = WorkorderTransactionUMIDFactory.umid_transaction().update({
              id: rowEntity.id
            }, umidInfo).$promise.then((res) => {
              if (res.data) {
                vm.gridOptions.gridApi.grid.validate.setValid(rowEntity, vm.sourceHeader[6]);
                vm.gridOptions.gridApi.grid.validate.setValid(rowEntity, vm.sourceHeader[7]);
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        } else {
          // no case as of now
        }
      });
    };

    // go to transfer bulk material option
    vm.goToTransferMaterial = () => {
      BaseService.goToTransferMaterial();
    };
  }
})();
