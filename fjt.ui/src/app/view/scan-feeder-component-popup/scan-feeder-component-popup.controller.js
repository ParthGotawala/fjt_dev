(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('ScanFeederComponentController', ScanFeederComponentController);

  /** @ngInject */
  function ScanFeederComponentController($scope, $mdDialog, data, BaseService, TRAVELER, CORE, $timeout, $filter, USER,
    CONFIGURATION, WORKORDER, BinFactory, WorkorderOperationEquipmentFeederFactory, WorkorderTransactionUMIDFactory, MasterFactory, WorkorderOperationFactory,
    DialogFactory, NotificationFactory, RFQTRANSACTION, TRANSACTION, ReceivingMaterialFactory, socketConnectionService) {
    const vm = this;
    const loginUserDetails = BaseService.loginUser;
    vm.selectedFeederList = [];
    vm.allocatedUMIDList = [];
    vm.data = data || {};
    vm.isHideDelete = true;
    vm.isSalesDelete = false;
    vm.isFeederStatus = true;
    vm.isViewChangeHistory = vm.data.isVerify ? false : true;
    vm.isViewVerificationHistory = (vm.data.isVerify ? true : false);
    vm.gridConfig = CORE.gridConfig;
    vm.title = stringFormat('Machine Setup[{0} Feeder & UMID]', vm.data.isVerify ? 'Verify' : 'Scan');
    vm.isShowLight = true;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.UMID_MAX_LENGTH = CORE.UMID_MAX_LENGTH;
    const statusHeader = CORE.StatusOptionsGridHeaderDropdown;
    vm.NoteDisbaleReplacePart = angular.copy(TRAVELER.NOTE_REPLACE_PART);
    vm.LabelConstant = CORE.LabelConstant;
    vm.DefaultDateFormat = _dateTimeDisplayFormat;
    const feederMappingObj = angular.copy(WORKORDER.FEEDER_COLUMN_MAPPING);
    vm.ScanStatusOptionsGridHeaderDropdown = CORE.ScanStatusOptionsGridHeaderDropdown;
    vm.verificationType = CORE.VerificationType;
    vm.changeReelType = CORE.ChangeReelType;
    vm.DateFormatArray = _dateDisplayFormat;
    vm.rowFieldData = 'AllocatedStock';
    vm.stockType = 'ALL';
    vm.isUIDDisable = false;
    vm.isWHBinDisable = false;
    vm.EmptyMesssageUMID = TRANSACTION.TRANSACTION_EMPTYSTATE.RECEIVINGMATERIAL;
    vm.showUMIDEmptyState = false;
    let old_umidOld = null;
    let old_umidNew = null;
    let old_umid = null;
    let old_feederLocation = null;
    const errorMesg = vm.data.isDisableScan ? stringFormat(angular.copy(TRAVELER.SCAN_DISABLE), '<b>Start/Resume Activity</b>') : null;
    let WHBinData = {};

    vm.sumObj = {};
    //$scope.splitPaneProperties = {};
    const loginUserDet = BaseService.loginUser;


    /*Used to goto equipment list*/
    vm.goToEquipmentList = () => {
      BaseService.goToEquipmentWorkstationList();
    };


    /*Move to equipment page*/
    vm.goToManageEquipmentWorkstation = (equip) => {
      BaseService.goToManageEquipmentWorkstation(equip.eqpID);
    };

    vm.goToComponentUMIDList = (partId, mfgType) => {
      BaseService.goToComponentUMIDList(partId, mfgType);
    };


    // Go to  manufacturer of scanned UMID
    vm.goToManufacturer = (id) => {
      BaseService.goToManufacturer(id);
    };

    const clearFields = () => {
      vm.feederDetails = null;
      vm.umidDetails = null;
      vm.oldUMIDDetails = null;
      vm.newUMIDDetails = null;
      vm.isWHBinDisable = false;
      old_umid = null;
      old_umidOld = null;
      old_umidNew = null;
      old_feederLocation = null;
      vm.feederScan.errorText = errorMesg;
      vm.feederScan.isConfirmed = false;
      vm.selectedFeederList = [];
      vm.allocatedUMIDList = [];
      if (vm.gridOptions) {
        vm.gridOptions.clearSelectedRows();
      }
    };

    // reset all fields and ui
    vm.resetAll = () => {
      // code for set default scan type in local storage
      let ScanTypeValue = getLocalStorageValue('ScanType');
      if (!ScanTypeValue) {
        setLocalStorageValue('ScanType', { type: vm.verificationType.FeederFirst });
      }
      ScanTypeValue = getLocalStorageValue('ScanType');

      // if verify popup than hide change reel option.
      // if default is set for change reel than change type incase of verify
      if (vm.data.isVerify && ScanTypeValue.type === vm.verificationType.ReplacePart) {
        ScanTypeValue.type = vm.verificationType.FeederFirst;
      }
      vm.feederScan = {
        type: ScanTypeValue.type,
        checkKitAllocation: true,
        reelChangeType: vm.changeReelType.ZeroOut.Type,
        errorText: errorMesg,
        toBinID: CORE.SystemGenratedWarehouseBin.bin.EmptyBin.id,
        emptyBin: CORE.SystemGenratedWarehouseBin.bin.EmptyBin.name
      };
      clearFields();
      if (vm.ScanFeederDetailsForm) {
        vm.ScanFeederDetailsForm.$setPristine();
        vm.ScanFeederDetailsForm.$setUntouched();
      }
      // code for set default scan type in local storage
    };
    vm.resetAll();

    // change feeder type
    vm.changeFeederType = () => {
      vm.feederScan = { type: vm.feederScan.type, checkKitAllocation: true, errorText: errorMesg };
      setLocalStorageValue('ScanType', { type: vm.feederScan.type });
      vm.feederScan.reelChangeType = vm.changeReelType.ZeroOut.Type;
      vm.feederScan.toBinID = CORE.SystemGenratedWarehouseBin.bin.EmptyBin.id;
      vm.feederScan.emptyBin = CORE.SystemGenratedWarehouseBin.bin.EmptyBin.name;
      clearFields();
    };

    // change reel consumption type
    vm.changeConsumptionType = () => {
      //vm.feederScan.toBinID = 0;
      //let temp_binID = angular.copy(vm.oldUMIDDetails.binID);
      //vm.oldUMIDDetails.binID = null;
      //$timeout(() => {
      //    vm.oldUMIDDetails.binID = temp_binID;
      //},0);
    };

    vm.goToComponentBOM = () => {
      BaseService.goToComponentBOM(vm.data.partID);
      return false;
    };

    vm.goToKitList = () => {
      BaseService.goToKitList(null, null, null);
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

    vm.ImportFeederFile = (event) => {
      vm.data.equipment.isOnline = vm.data.isOnline;
      const data = {
        equipment: vm.data.equipment,
        woID: vm.data.woID,
        opID: vm.data.opID,
        woOPID: vm.data.woOPID,
        eqpID: vm.data.equipment.eqpID,
        woOpEqpID: vm.data.woOpEqpID,
        isOnline: vm.data.isOnline,
        feederCount: vm.data.equipment.feederCount,
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
        isCustom: vm.data.isCustom,
        isTraveler: true,
        isFeeder: true,
        lineID: vm.data.lineID,
        salesOrderMstIDs: vm.data.salesOrderMstIDs,
        salesOrderDetID: vm.data.salesOrderDetID,
        salesOrderNumber: vm.data.salesOrderNumber,
        poNumber: vm.data.poNumber,
        SOPOQtyValues: vm.data.SOPOQtyValues,
        soMRPQty: vm.data.soMRPQty,
        soPOQty: vm.data.soPOQty
      };
      DialogFactory.dialogService(
        WORKORDER.WORKORDER_VIEW_FEEDER_DETAILS_CONTROLLER,
        WORKORDER.WORKORDER_VIEW_FEEDER_DETAILS_VIEW,
        event,
        data).then(() => {
          vm.resetAll();
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        }, () => {
          vm.resetAll();
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.headerdata = [];
    vm.headerdata.push({
      label: 'Equipment Name', value: vm.data.equipment.assetName, displayOrder: 1, labelLinkFn: vm.goToEquipmentList,
      valueLinkFn: vm.goToManageEquipmentWorkstation,
      valueLinkFnParams: { eqpID: vm.data.equipment.eqpID },
      isCopy: false
    });

    // vm.headerdata.push({ label: 'Equipment Name', value: vm.data.equipment.assetName, displayOrder: 1 });
    vm.headerdata.push({
      label: vm.LabelConstant.Workorder.WO, value: vm.data.woNumber, displayOrder: 2, labelLinkFn: vm.goToWorkorderList,
      valueLinkFn: vm.goToWorkorderDetails,
      valueLinkFnParams: { woID: vm.data.woID },
      isCopy: false
    });
    vm.headerdata.push({
      label: vm.LabelConstant.Workorder.Version, value: vm.data.woVersion, displayOrder: 3
    });

    // operation name
    vm.data.opFullName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, vm.data.opName, vm.data.opNumber);

    vm.EmptyMesssage = WORKORDER.WORKORDER_EMPTYSTATE.WORKORDER_OPERATION_EQUIPMENT_FEEDER_DETAILS;
    vm.sourceHeader = [
      {
        field: 'action',
        cellClass: 'layout-align-center-center align-vertical',
        displayName: 'Action',
        width: 110,
        cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
        enableFiltering: false,
        enableSorting: false,
        enableCellEdit: false,
        exporterSuppressExport: true,
        enableColumnMenus: false,
        enableRowSelection: false,
        enableFullRowSelection: false,
        multiSelect: false
      },
      {
        field: '#',
        width: '70',
        cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
        enableFiltering: false,
        enableSorting: false,
        enableCellEdit: false,
        allowCellFocus: false
      },
      {
        field: 'placementType',
        displayName: 'Placement Type',
        width: 110,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
        enableCellEdit: false,
        enableCellEditOnFocus: false
      },
      {
        field: 'feederStatus',
        displayName: 'Feeder Status',
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">' +
          '<span class="label-box" \
                                                        ng-class="{\'label-success\':row.entity.feederStatus == \'Active\', \
                                                        \'label-warning\':row.entity.feederStatus == \'Inactive\'}"> \
                                                            {{ COL_FIELD }}' +
          '</span>' +
          '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: statusHeader
        },
        ColumnDataType: 'StringEquals',
        width: 140,
        enableCellEdit: false
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
        allowCellFocus: false,
        enableCellEdit: false
      },
      {
        field: 'feederLocation',
        displayName: feederMappingObj.Feeder.Name,
        width: 150,
        cellTemplate: '<div class="ui-grid-cell-contents" ng-style="{\'text-decoration-line\':!row.entity.isActive?\'line-through\':\'none\'}"><span>{{COL_FIELD}}</span><copy-text ng-if="row.entity.feederLocation" label="row.entity.feederLocation" text="row.entity.feederLocation"></copy-text></div>',
        enableCellEdit: false,
        allowCellFocus: false
      },
      {
        field: 'umid',
        displayName: 'UMID',
        width: 180,
        cellTemplate: '<div class="ui-grid-cell-contents"> ' +
          '<a class="cm-text-decoration" ng-click="grid.appScope.$parent.vm.goToUMIDDetail(row.entity.refsidid)">{{COL_FIELD}}</a> ' +
          '<copy-text ng-if="row.entity.umid" label="row.entity.umid" text="row.entity.umid"></copy-text></div>',
        enableCellEdit: false,
        allowCellFocus: false
      }, {
        field: 'PIDCode',
        displayName: vm.LabelConstant.MFG.PID,
        enableCellEdit: false,
        cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link ng-class="{\'text-double-line-through\':row.entity.restrictPermission}"  ng-style="{\'text-decoration-line\':row.entity.isRestricted?\'line-through\':\'\'}"\
                                        component-id="row.entity.mfgPNID" \
                                        label="grid.appScope.$parent.vm.LabelConstant.MFG.PID" \
                                        value="row.entity.PIDCode" \
                                        is-copy="true" \
                                        is-mfg="true" \
                                        mfg-label="grid.appScope.$parent.vm.LabelConstant.MFG.MFGPN" \
                                        mfg-value="row.entity.mfgPN" \
                                        rohs-icon="row.entity.rohsIcon" \
                                        rohs-status="row.entity.rohsName" \
                                        is-custom-part="row.entity.isCustom"\
                                        is-copy-ahead-label="true"\
                                        is-search-digi-key="true" \
                                        is-search-findchip="true"></common-pid-code-label-link></div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.PID,
        allowCellFocus: false
      },
      {
        field: 'custPN',
        displayName: 'CPN(Component)',
        width: CORE.UI_GRID_COLUMN_WIDTH.PID,
        cellTemplate: '<div class= "ui-grid-cell-contents" > <common-pid-code-label-link \
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
        allowCellFocus: false
      },
      {
        field: 'mfgPNDescription',
        displayName: 'MPN Description',
        width: 400,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        enableCellEdit: false,
        allowCellFocus: false
      },
      {
        field: 'alternateParts',
        displayName: 'Alternate Part',
        width: 400,
        cellTemplate: '<alternative-component-details is-expand="false" ng-click="$event.stopPropagation();" row-data="row.entity"></alternative-component-details>',
        enableCellEdit: false
      },
      {
        field: 'totalallocatedUMID',
        displayName: 'Allocated UMID(s)',
        width: 100,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"><a  ng-class="{\'cursor-not-allow color-black\':row.entity.totalallocatedUMID==0,\'cursor-pointer underline\':row.entity.totalallocatedUMID>0}" ng-click="grid.appScope.$parent.vm.allocateUMID(row.entity,$event)">{{COL_FIELD}}<md-tooltip md-direction="top" ng-if="row.entity.totalallocatedUMID>0">View Allocated UMID(s)</md-tooltip></a></div>',
        enableCellEdit: false,
        allowCellFocus: false
      },
      {
        field: 'setupComment',
        displayName: 'Setup Comment',
        width: 400,
        cellTemplate: '<div class="ui-grid-cell-contents" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}">{{COL_FIELD}}</div>',
        validators: { required: false },
        enableCellEdit: false,
        enableCellEditOnFocus: false
      },
      {
        field: 'binName',
        displayName: 'Bin',
        width: 150,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        enableCellEdit: false,
        allowCellFocus: false
      },
      {
        field: 'lineID',
        displayName: 'Line Item',
        width: 90,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        enableCellEdit: false,
        allowCellFocus: false
      },
      {
        field: 'expiryDate',
        displayName: vm.LabelConstant.UMIDManagement.DateOfExpiration,
        width: 120,
        //cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD | date:grid.appScope.$parent.vm.DateFormatArray}}</div>',
        cellTemplate: '<div class="ui-grid-cell-contents" ng-class="{\'color-red\':row.entity.isPartExpired }" \
                             style="text-align:center">{{row.entity.expiryDate | date:grid.appScope.$parent.vm.DateFormatArray}}</div>',
        enableCellEdit: false,
        enableFiltering: false,
        allowCellFocus: false,
        type: 'date'
      },
      {
        field: 'refDesig',
        displayName: vm.LabelConstant.BOM.REF_DES,
        width: 120,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        enableCellEdit: false
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
        enableCellEdit: false
      },
      {
        field: 'partUOM',
        displayName: 'UOM',
        width: 120,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        enableCellEdit: false
      },
      {
        field: 'verifiedBy',
        displayName: 'Verified By',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        enableCellEdit: false,
        allowCellFocus: false
      },
      {
        field: 'verifiedOn',
        displayName: 'Verified On',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
        enableCellEdit: false,
        allowCellFocus: false,
        type: 'datetime',
        enableSorting: true,
        enableFiltering: false
      },
      {
        field: 'scannedBy',
        displayName: 'Added By',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        enableCellEdit: false,
        allowCellFocus: false
      }, {
        field: 'updatedAt',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.UPDATED_DATE,
        type: 'datetime',
        enableSorting: true,
        enableFiltering: false,
        allowCellFocus: false
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
        transactionType: CORE.TransactionType.Feeder
      };
    };
    initPageInfo();

    vm.gridOptions = {
      showColumnFooter: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      enableCellEdit: true,
      enableCellEditOnFocus: true,
      exporterCsvFilename: 'Work Order Transaction Feeder UMID Details.csv',
      hideAddNew: true
    };

    //format alternate part list (all in new line) of grid Data
    const formatAlternatePartsOfGridData = (mfglist) => {
      _.each(mfglist, (item) => {
        item.alternatePartListWithNewLine = item.alternateParts ? item.alternateParts.split('@@@@') : null;
        item.alternateParts = item.alternateParts ? item.alternateParts.replace(/@@@@/g, ', ') : null;
      });
    };

    /* retrieve feeder details list*/
    vm.loadData = () => {
      let s_index = 0;
      if (vm.pagingInfo.SortColumns.length === 0 && vm.pagingInfo.SearchColumns.length === 0) {
        initPageInfo(); //added to initalize pageinfo as on load issue generated
      }
      vm.cgBusyLoading = WorkorderTransactionUMIDFactory.umid_transaction(vm.pagingInfo).query({
        id: null
      }).$promise.then((response) => {
        if (response && response.data && response.data.feeder) {
          vm.sourceData = response.data.feeder;
          _.map(vm.sourceData, (item) => {
            item.alternatePartsGrid = getPIDsFromString(item.alternateParts ? item.alternateParts.split('###').join(',') : null);
          });
          vm.sourceLineItems = response.data.lineItems;
          const todayDate = new Date().setHours(0, 0, 0, 0);
          _.each(vm.sourceData, (s) => {
            s.isDisableChangeDetails = (s.reelChangeCount === 0);
            s.isDisableVerificationDetails = vm.data.isVerify ? (s.reelVerificationCount === 0) : true;
            s.isDisabledShowLight = true;
            s.index = s_index++;
            s.isShowLight = false;
            s.rohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, s.rohsIcon);
            s.custPNrohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, s.custPNrohsIcon);
            if (s.expiryDate) {
              if (new Date(s.expiryDate) < todayDate) {
                s.isPartExpired = true;
              }
            }
          });
          vm.totalSourceDataCount = response.data.Count;
          formatAlternatePartsOfGridData(response.data.feeder);
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
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // on cancel popup
    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.ScanFeederDetailsForm);
      if (isdirty) {
        const data = {
          form: vm.ScanFeederDetailsForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        vm.resetAll();
        $mdDialog.cancel();
      }
    };


    const sucessMessgae = (errorMessage, res) => {
      errorMessage = _.filter(res.data.errorObjList, (itemObj) => itemObj.isMessage);
      errorMessage = errorMessage.map((item) => item.errorText).join('<br/>');
      vm.feederScan.successText = errorMessage;
      vm.feederScan.isSuccess = true;
      if (vm.data.isVerify) {
        NotificationFactory.success(TRAVELER.FEEDER.VERIFIED);
      } else {
        NotificationFactory.success(TRAVELER.FEEDER.SCANNED);
      }
      vm.selectedFeederList = [];
      vm.allocatedUMIDList = [];
      vm.feederScan.checkKitAllocation = true;
      vm.feederScan.isConfirmed = false;
      vm.feederScan.umid = null;
      vm.feederScan.feederLocation = null;
      //const oldSuccessText = vm.feederScan.successText;
      //vm.resetAll();
      //vm.feederScan.successText = errorMesg ? errorMesg : oldSuccessText;
      $scope.$applyAsync();
    };

    // update image path
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

    // lock if any error in scan
    const lockScreen = (e) => {
      // refactor code and make common - vaibhav, if require than will comment to skip authentication
      const obj = {
        uidVerificationDet: vm.uidVerificationDet,
        feederScan: vm.feederScan
      };
      // lock screen
      localStorage.setItem('UnlockFeederDetail', JSON.stringify(obj));

      DialogFactory.dialogService(
        TRAVELER.FEEDER_SCAN_FAILED_MODAL_CONTROLLER,
        TRAVELER.FEEDER_SCAN_FAILED_MODAL_VIEW,
        e,
        obj).then(() => {
          localStorage.removeItem('UnlockFeederDetail');
          if (vm.feederScan.feederLocation && !vm.feederScan.umid) {
            setFocusByName('feederLocation');
          }
          else if (vm.feederScan.feederLocation && vm.feederScan.umid) {
            setFocusByName('umid');
          }
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    // feeder first - validation
    vm.validateFeederDetails = (e, authenticationApprovedDet) => {
      const feederObj = {
        feederLocation: vm.feederScan.feederLocation || null,
        UMID: vm.feederScan.umid || null,
        partID: vm.data.partID || null,
        woOpEqpID: vm.data.woOpEqpID || null,
        woOPID: vm.data.woOPID || null,
        woTransID: vm.data.woTransID || null,
        employeeId: vm.data.employeeId || null,
        checkKitAllocation: vm.feederScan.checkKitAllocation || false,
        verificationType: vm.verificationType.FeederFirst,
        isVerify: vm.data.isVerify || false,
        isConfirmed: vm.feederScan.isConfirmed || false,
        woID: vm.data.woID,
        transactionType: CORE.TransactionType.Feeder,
        authenticationApprovedDet: authenticationApprovedDet
      };
      vm.cgBusyLoading = WorkorderTransactionUMIDFactory.validateScanFeederFirst().query({ feederObj: feederObj }).$promise.then((res) => {
        let errorMessage = [];
        let confirmationMessage = [];
        vm.feederScan.isSuccess = false;
        vm.feederScan.errorText = null;
        if (res.data && res.data.errorObjList && res.data.errorObjList.length > 0) {
          // display error message on screen
          errorMessage = _.filter(res.data.errorObjList, (itemObj) => itemObj.isFeederError || itemObj.isUMIDError);
          if (errorMessage.length > 0) {
            errorMessage = errorMessage.map((item) => item.errorText).join('<br/>');
            vm.feederScan.errorText = errorMessage;

            if (res.data && res.data.uidVerificationDet.length > 0) {
              vm.uidVerificationDet = _.first(res.data.uidVerificationDet);
            }
            if (res.data.umidDetails && res.data.umidDetails.length > 0 && vm.uidVerificationDet) {
              const umidID = _.first(res.data.umidDetails);
              vm.uidVerificationDet.umidID = umidID.refsidid ? umidID.refsidid : null;
            }
            lockScreen(e);
          }

          // display confirmation message on screen
          confirmationMessage = _.filter(res.data.errorObjList, (itemObj) => itemObj.isConfirmation);

          if (confirmationMessage.length > 0) {
            confirmationMessage = confirmationMessage.map((item) => item.errorText).join('<br/>');
            askForPermission(e, vm.verificationType.FeederFirst, res);
          }
        } else {
          if (vm.feederScan.feederLocation && !vm.feederScan.umid) {
            setFocusByName('umid');
          }
        }

        if (res.data && res.data.feederDetails && res.data.feederDetails.length > 0) {
          vm.feederDetails = _.first(res.data.feederDetails);
          updateImagePath(vm.feederDetails);
          if (res.data.allocatedUMIDList.length > 0) {
            vm.sumObj = {};
            vm.getFooterAllocationTotal(res.data.allocatedUMIDList);
            vm.getFooterFreeUnitsTotal(res.data.allocatedUMIDList);
            vm.getFooterAllocatedUnitTotal(res.data.allocatedUMIDList);
            vm.allocatedUMIDList = res.data.allocatedUMIDList;
            vm.showUMIDEmptyState = false;
          } else {
            vm.allocatedUMIDList = [];
            vm.showUMIDEmptyState = true;
            vm.EmptyMesssageUMID.NOUMIDALLOCATEDMESSAGE = stringFormat(vm.EmptyMesssageUMID.NOUMIDALLOCATEDMESSAGE, vm.feederDetails.PIDCode);
          }
        } else {
          vm.allocatedUMIDList = [];
        }
        if (res.data && res.data.umidDetails && res.data.umidDetails.length > 0) {
          vm.umidDetails = _.first(res.data.umidDetails);
          // CORE.MEASUREMENT_TYPES.COUNT
          vm.umidDetails.pkgQty = (vm.umidDetails.umidUOMClassID === CORE.MEASUREMENT_TYPES.COUNT.ID ? vm.umidDetails.pkgQt : $filter('unit')(vm.umidDetails.pkgQty));
          updateImagePath(vm.umidDetails);
          checkExpiryDateValidation(vm.umidDetails, errorMessage, confirmationMessage);
          if (errorMessage.length === 0 && confirmationMessage.length === 0) {
            if (vm.feederScan.umid && vm.feederScan.feederLocation) {
              vm.showUMIDEmptyState = false;
              sucessMessgae(errorMessage, res);
            }
          }
          $timeout(() => {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            vm.gridOptions.clearSelectedRows();
          }, 0);
        }

        if (vm.feederDetails && res.data && res.data.umidDetails.length === 0) {
          // set selected row by index
          const findRow = _.find(vm.sourceData, (row) => row.feederLocation === vm.feederDetails.feederLocation);
          if (findRow) {
            vm.gridOptions.clearSelectedRows();
            vm.gridOptions.gridApi.selection.selectRow(vm.gridOptions.data[findRow.index]);
            vm.gridOptions.gridApi.cellNav.scrollToFocus(vm.sourceData[findRow.index]);
          }
        }
        if (vm.feederScan.feederLocation && !vm.feederScan.umid) {
          vm.umidDetails = null;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const checkExpiryDateValidation = (umidDetails, errorMessage, confirmationMessage) => {
      if (errorMessage.length === 0 && confirmationMessage.length === 0) {
        // check for expiry date added or not
        if (umidDetails.expiryDate) {
          const dayDiff = date_diff_indays(new Date(), new Date(umidDetails.expiryDate));

          // logic to get higher date from system level and part level for alert
          let getHigherDays = null;
          if (vm.ExpireDaysLeft && umidDetails.alertExpiryDays) {
            getHigherDays = parseInt(vm.ExpireDaysLeft) > parseInt(umidDetails.alertExpiryDays) ? parseInt(vm.ExpireDaysLeft) : parseInt(umidDetails.alertExpiryDays);
          }
          else if (!vm.ExpireDaysLeft) {
            getHigherDays = parseInt(umidDetails.alertExpiryDays);
          }
          else if (!umidDetails.alertExpiryDays) {
            getHigherDays = parseInt(vm.ExpireDaysLeft);
          }

          if (vm.ExpireDaysLeft && dayDiff <= getHigherDays) {
            umidDetails.expiryDateText = stringFormat(TRAVELER.EXPIRYDAYALERT, $filter('date')(new Date(umidDetails.expiryDate), vm.DateFormatArray), dayDiff);
            //res.data.errorObjList.push({ errorText: stringFormat(TRAVELER.EXPIRYDAYALERT, dayDiff), isMessage: true, isUMIDError: false, isFeederError: false, isConfirmation: false });
          }
        }
      }
    };

    // find with alternate part
    const findWithAlternatePart = (data) => {
      if (data.PIDCode === vm.umidDetails.PIDCode) {
        return true;
      }
      else if (data.alternateParts) {
        //MICROCH+93LC46AX-E/SN@@@93LC46AX-E/SN@@@7919@@@rohs-big.png@@@RoHS@@@0@@@1@@@1
        //###
        //3M+8KH3-0734-0250@@@8KH3-0734-0250@@@7921@@@rohs-big.png@@@RoHS@@@0@@@1@@@1
        return _.includes(data.alternateParts, '###' + vm.umidDetails.PIDCode + '@@@');
      }
      return false;
    };

    // UMID First - validate UMID Details
    vm.validateUMIDDetails = (e, authenticationApprovedDet) => {
      const umidObj = {
        feederLocation: vm.feederScan.feederLocation || null,
        UMID: vm.feederScan.umid || null,
        partID: vm.data.partID || null,
        woOpEqpID: vm.data.woOpEqpID || null,
        woOPID: vm.data.woOPID || null,
        woTransID: vm.data.woTransID || null,
        employeeId: vm.data.employeeId || null,
        checkKitAllocation: vm.feederScan.checkKitAllocation || false,
        verificationType: vm.verificationType.UMIDFirst,
        isVerify: vm.data.isVerify || false,
        isConfirmed: vm.feederScan.isConfirmed || false,
        woID: vm.data.woID,
        transactionType: CORE.TransactionType.Feeder,
        authenticationApprovedDet: authenticationApprovedDet
      };
      vm.cgBusyLoading = WorkorderTransactionUMIDFactory.validateScanUMIDFirst().query({ umidObj: umidObj }).$promise.then((res) => {
        //vm.feederScan.checkKitAllocation = true;
        let errorMessage = [];
        let confirmationMessage = [];
        vm.feederScan.isSuccess = false;
        if (res.data && res.data.errorObjList && res.data.errorObjList.length > 0) {
          // display error message on screen
          errorMessage = _.filter(res.data.errorObjList, (itemObj) => itemObj.isFeederError || itemObj.isUMIDError);
          vm.feederScan.errorText = null;
          if (errorMessage.length > 0) {
            errorMessage = errorMessage.map((item) => item.errorText).join('<br/>');
            vm.feederScan.errorText = errorMessage;

            if (res.data && res.data.uidVerificationDet.length > 0) {
              vm.uidVerificationDet = _.first(res.data.uidVerificationDet);
            }

            if (res.data.umidDetails && res.data.umidDetails.length > 0 && vm.uidVerificationDet) {
              const umidID = _.first(res.data.umidDetails);
              vm.uidVerificationDet.umidID = umidID.refsidid ? umidID.refsidid : null;
            }
            lockScreen(e);
          }

          // display confirmation message on screen
          confirmationMessage = _.filter(res.data.errorObjList, (itemObj) => itemObj.isConfirmation);
          if (confirmationMessage.length > 0) {
            confirmationMessage = confirmationMessage.map((item) => item.errorText).join('<br/>');
            askForPermission(e, vm.verificationType.UMIDFirst, res);
          }
        } else {
          if (vm.feederScan.umid && !vm.feederScan.feederLocation) {
            setFocusByName('feederLocation');
          }
        }
        if (res.data && res.data.umidDetails && res.data.umidDetails.length > 0) {
          vm.umidDetails = _.first(res.data.umidDetails);
          // CORE.MEASUREMENT_TYPES.COUNT
          //vm.umidDetails.pkgQty = $filter('unit')(vm.umidDetails.pkgQty);
          vm.umidDetails.pkgQty = (vm.umidDetails.umidUOMClassID === CORE.MEASUREMENT_TYPES.COUNT.ID ? vm.umidDetails.pkgQt : $filter('unit')(vm.umidDetails.pkgQty));
          updateImagePath(vm.umidDetails);
          checkExpiryDateValidation(vm.umidDetails, errorMessage, confirmationMessage);
        }
        if (res.data && res.data.feederDetails && res.data.feederDetails.length > 0) {
          vm.feederDetails = _.first(res.data.feederDetails);
          updateImagePath(vm.feederDetails);
          if (errorMessage.length === 0 && confirmationMessage.length === 0) {
            if (vm.feederScan.umid && vm.feederScan.feederLocation) {
              vm.showUMIDEmptyState = false;
              sucessMessgae(errorMessage, res);
            }
          }
          $timeout(() => {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            vm.gridOptions.clearSelectedRows();
          }, 0);
        }
        if (vm.umidDetails && res.data.feederDetails.length === 0) {
          // set selected row by index
          vm.selectedFeederList = _.filter(vm.sourceData, (row) => findWithAlternatePart(row));
          if (vm.selectedFeederList.length > 0) {
            vm.gridOptions.clearSelectedRows();
            _.each(vm.selectedFeederList, (row) => {
              vm.gridOptions.gridApi.selection.selectRow(vm.gridOptions.data[row.index]);
              vm.gridOptions.gridApi.cellNav.scrollToFocus(vm.sourceData[row.index], vm.sourceHeader[0]);
            });
          } else {
            vm.selectedFeederList = [];
          }
        } else {
          vm.selectedFeederList = [];
        }
        if (vm.feederScan.umid && !vm.feederScan.feederLocation) {
          vm.feederDetails = null;
          setFocus('feederLocation');
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };


    const askForPermission = (e, type, res) => {
      let umidDet;
      if (res.data && res.data.umidDetails && res.data.umidDetails.length > 0) {
        umidDet = vm.umidDetails = _.first(res.data.umidDetails);
        // CORE.MEASUREMENT_TYPES.COUNT
        // vm.umidDetails.pkgQty = $filter('unit')(vm.umidDetails.pkgQty);
        vm.umidDetails.pkgQty = (vm.umidDetails.umidUOMClassID === CORE.MEASUREMENT_TYPES.COUNT.ID ? vm.umidDetails.pkgQt : $filter('unit')(vm.umidDetails.pkgQty));
      }
      if (res.data && res.data.newUMIDDetails && res.data.newUMIDDetails.length > 0) {
        umidDet = vm.newUMIDDetails = _.first(res.data.newUMIDDetails);
        // CORE.MEASUREMENT_TYPES.COUNT
        vm.newUMIDDetails.pkgQty = $filter('unit')(vm.newUMIDDetails.pkgQty);
      }
      let msgText = '';
      if (umidDet.partLevelRestrictUSEwithpermission) {
        msgText = CORE.MESSAGE_CONSTANT.RESTRICT_WITH_PERMISSION.RESTRICT_WITH_PERMISSION_AT_PART_MASTER;
      }
      else if (umidDet.partLevelRestrictPackagingUseWithpermission) {
        msgText = CORE.MESSAGE_CONSTANT.RESTRICT_WITH_PERMISSION.RESTRICT_WITH_PACKAGING_ALIAS_WITH_PERMISSION_AT_PART_MASTER;
      } else if (umidDet.rfqLevelRestrictCPNUseWithPermissionStep
        || umidDet.lineLevelRestrictUseWithPermissionStep
        || umidDet.lineLevelRestrictUseInBOMWIThPermissionStep
        || umidDet.lineLevelRestrictUseInBOMExcludingAliasWithPermissionStep) {
        msgText = CORE.MESSAGE_CONSTANT.RESTRICT_WITH_PERMISSION.RESTRICT_WITH_PERMISSION_AT_BOM;
      } else if (res.data && res.data.errorObjList.length > 0) {
        msgText = _.first(res.data.errorObjList).errorText;
      }
      const data = {
        featureName: CORE.FEATURE_NAME.AllowRestrictWithPermission,
        isAllowSaveDirect: false,
        isFromTravelerScan: true,
        msgObject: {
          msgText: stringFormat(msgText, umidDet.PIDCode)
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
              approvalReason: resOfAuthData.approvalReason,
              confirmationType: CORE.Generic_Confirmation_Type.MACHINE_SETUP_SCAN,
              createdBy: loginUserDetails.userid,
              updatedBy: loginUserDetails.userid
            };

            const authenticationApprovedDet = angular.copy(_restrictPartAuthenticationDet);
            authenticationApprovedDet.transactionType = stringFormat(CORE.MESSAGE_CONSTANT.GENERIC_AUTHENTICATION_REASON.MACHINE_SETUP_SCAN,
              vm.data.PIDCode, vm.data.woNumber, vm.data.opFullName);
            authenticationApprovedDet.woOPID = vm.data.woOPID;
            vm.feederScan.checkKitAllocation = true;
            vm.feederScan.isConfirmed = true;
            if (type === vm.verificationType.FeederFirst) {
              vm.validateFeederDetails(e, authenticationApprovedDet);
            }
            else if (type === vm.verificationType.UMIDFirst) {
              vm.validateUMIDDetails(e, authenticationApprovedDet);
            }
            else if (type === vm.verificationType.ReplacePart) {
              vm.validateChangeReelDetails(e, authenticationApprovedDet);
            }
          }
        }, () => {// cancel  section
        }).catch((error) => BaseService.getErrorLog(error));
    };

    // Replace Part - validate UMID Details
    vm.validateChangeReelDetails = (e, authenticationApprovedDet) => {
      const umidObj = {
        feederLocation: vm.feederScan.feederLocation || null,
        OldUMID: vm.feederScan.umidOld || null,
        NewUMID: vm.feederScan.umidNew || null,
        partID: vm.data.partID || null,
        woOpEqpID: vm.data.woOpEqpID || null,
        woOPID: vm.data.woOPID || null,
        woTransID: vm.data.woTransID || null,
        employeeId: vm.data.employeeId || null,
        checkKitAllocation: vm.feederScan.checkKitAllocation || false,
        verificationType: vm.verificationType.ReplacePart,
        reelChangeType: vm.feederScan.reelChangeType,
        toBinID: vm.feederScan.toBinID,
        isVerify: vm.data.isVerify || false,
        isConfirmed: vm.feederScan.isConfirmed || false,
        woID: vm.data.woID,
        transactionType: CORE.TransactionType.Feeder,
        authenticationApprovedDet: authenticationApprovedDet
      };
      vm.cgBusyLoading = WorkorderTransactionUMIDFactory.validateScanChangeReel().query({ umidObj: umidObj }).$promise.then((res) => {
        //vm.feederScan.checkKitAllocation = true;
        let errorMessage = [];
        let confirmationMessage = [];
        vm.feederScan.isSuccess = false;
        if (res.data && res.data.errorObjList && res.data.errorObjList.length > 0) {
          // display error message on screen
          errorMessage = _.filter(res.data.errorObjList, (itemObj) => itemObj.isFeederError || itemObj.isUMIDError);
          vm.feederScan.errorText = null;
          if (errorMessage.length > 0) {
            errorMessage = errorMessage.map((item) => item.errorText).join('<br/>');
            vm.feederScan.errorText = errorMessage;

            if (res.data && res.data.uidVerificationDet.length > 0) {
              vm.uidVerificationDet = _.first(res.data.uidVerificationDet);
            }

            if (res.data.umidDetails && res.data.umidDetails.length > 0 && vm.uidVerificationDet) {
              const umidID = _.first(res.data.umidDetails);
              vm.uidVerificationDet.umidID = umidID.refsidid ? umidID.refsidid : null;
            }
            lockScreen(e);
          }

          // display confirmation message on screen
          confirmationMessage = _.filter(res.data.errorObjList, (itemObj) => itemObj.isConfirmation);
          if (confirmationMessage.length > 0) {
            confirmationMessage = confirmationMessage.map((item) => item.errorText).join('<br/>');
            askForPermission(e, vm.verificationType.ReplacePart, res);
          }
        } else {
          if (vm.feederScan.umidOld && !vm.feederScan.feederLocation && !vm.feederScan.umidNew) {
            if (vm.feederScan.reelChangeType !== vm.changeReelType.ZeroOut.Type) {
              setFocusByName('ScanWHBin');
            } else {
              setFocusByName('umidNew');
            }
            //setFocusByName('feederLocation');
          }
          else {
            setFocusByName('feederLocation');
          }
        }

        if (res.data && res.data.oldUMIDDetails && res.data.oldUMIDDetails.length > 0) {
          vm.oldUMIDDetails = _.first(res.data.oldUMIDDetails);
          updateImagePath(vm.oldUMIDDetails);

          if (_.isNumber(vm.oldUMIDDetails.feederActiveStatus) && !vm.oldUMIDDetails.feederActiveStatus) {
            vm.feederScan.errorText = CORE.MESSAGE_CONSTANT.FEEDER_INACTIVE;
          } else {
            // filter old umid from list
            vm.allocatedUMIDList = _.filter(res.data.allocatedUMIDList, (item) => item.uid !== vm.feederScan.umidOld);
            if (res.data.allocatedUMIDList.length > 0) {
              vm.sumObj = {};
              vm.getFooterAllocationTotal(vm.allocatedUMIDList);
              vm.getFooterFreeUnitsTotal(vm.allocatedUMIDList);
              vm.getFooterAllocatedUnitTotal(vm.allocatedUMIDList);
            }
          }
        }
        else {
          vm.allocatedUMIDList = [];
        }
        if (res.data && res.data.feederDetails && res.data.feederDetails.length > 0) {
          vm.feederDetails = _.first(res.data.feederDetails);
          updateImagePath(vm.feederDetails);
          if (errorMessage.length === 0 && confirmationMessage.length === 0) {
            if (vm.feederScan.umidOld && vm.feederScan.feederLocation && vm.feederScan.umidNew) {
              vm.showUMIDEmptyState = false;
              sucessMessgae(errorMessage, res);
            }
          }
          $timeout(() => {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            vm.gridOptions.clearSelectedRows();
          }, 0);
        }

        if (res.data && res.data.newUMIDDetails && res.data.newUMIDDetails.length > 0) {
          vm.newUMIDDetails = _.first(res.data.newUMIDDetails);
          updateImagePath(vm.newUMIDDetails);
          checkExpiryDateValidation(vm.newUMIDDetails, errorMessage, confirmationMessage);
        }
        if ((vm.feederScan.umidOld || vm.feederScan.feederLocation) && !vm.feederScan.umidNew) {
          vm.newUMIDDetails = null;
        }
      }).catch((error) => BaseService.getErrorLog(error));
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
      //vm.selectedFeederList = [];
      //vm.allocatedUMIDList = [];
      old_umid = old_umid || angular.copy(vm.feederScan.umid);
      old_umidOld = old_umidOld || angular.copy(vm.feederScan.umidOld);
      old_umidNew = old_umidNew || angular.copy(vm.feederScan.umidNew);
      old_feederLocation = old_feederLocation || angular.copy(vm.feederScan.feederLocation);
      if (old_feederLocation && old_feederLocation !== vm.feederScan.feederLocation) {
        old_feederLocation = vm.feederScan.feederLocation;
        vm.feederDetails = null;
        vm.feederScan.errorText = null;
        vm.feederScan.isConfirmed = false;
        vm.allocatedUMIDList = [];
      }
      else if (old_umid && old_umid !== vm.feederScan.umid) {
        old_umid = vm.feederScan.umid;
        vm.umidDetails = null;
        vm.feederScan.errorText = null;
        vm.feederScan.isConfirmed = false;
        vm.selectedFeederList = [];
      }
      else if (old_umidOld && old_umidOld !== vm.feederScan.umidOld) {
        old_umidOld = vm.feederScan.umidOld;
        vm.oldUMIDDetails = null;
        vm.feederScan.errorText = null;
        vm.feederScan.isConfirmed = false;
      }
      else if (old_umidNew && old_umidNew !== vm.feederScan.umidNew) {
        old_umidNew = vm.feederScan.umidNew;
        vm.newUMIDDetails = null;
        vm.feederScan.errorText = null;
        vm.feederScan.isConfirmed = false;
      }
      localStorage.removeItem('UnlockFeederDetail');
      if (parseInt(e.keyCode) === 13) {
        vm.feederScan.errorText = '';
        if (vm.feederScan.type === vm.verificationType.FeederFirst) {
          vm.feederDetails = null;
          vm.UMIDDetails = null;
          if (vm.feederScan.feederLocation) {
            vm.validateFeederDetails(e);
          } else {
            // case will not come but incase no feeder entered than display invalid
            invalidAlert('Feeder Location');
          }
        }
        else if (vm.feederScan.type === vm.verificationType.UMIDFirst) {
          vm.feederDetails = null;
          vm.UMIDDetails = null;
          if (vm.feederScan.umid) {
            vm.validateUMIDDetails(e);
          } else {
            // case will not come but incase umid entered selected than display invalid
            invalidAlert('UMID');
          }
        }
        else if (vm.feederScan.type === vm.verificationType.ReplacePart) {
          if (vm.data.isOnline) {
            if (vm.feederScan.umidOld && vm.feederScan.toBinID === CORE.SystemGenratedWarehouseBin.bin.EmptyBin.id && vm.feederScan.ScanWHBin) {
              const model = {
                messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INVALID_BIN_TYPE_ENTER),
                multiple: true
              };
              DialogFactory.messageAlertDialog(model).then(() => {
                vm.feederScan.ScanWHBin = null;
                setFocus('ScanWHBin');
              });
            } else if (vm.feederScan.umidOld && !vm.ScanFeederDetailsForm.feederLocation.$viewValue && !vm.feederScan.umidNew) {
              // feeder location should not invalid if blank
              vm.oldUMIDDetails = null;
              vm.feederDetails = null;
              vm.validateChangeReelDetails(e);
            }
            else if (vm.feederScan.umidOld && (vm.oldUMIDDetails && vm.oldUMIDDetails.feederActiveStatus)
              && vm.feederScan.umidNew && vm.feederScan.umidOld === vm.feederScan.umidNew) {
              // case will not come but incase umid entered selected than display invalid
              invalidAlert('UMID');
            }
            else if (vm.feederScan.umidOld && (vm.oldUMIDDetails && vm.oldUMIDDetails.feederActiveStatus)
              && vm.feederScan.umidNew && vm.feederScan.umidOld !== vm.feederScan.umidNew && !vm.ScanFeederDetailsForm.feederLocation.$viewValue) {
              vm.oldUMIDDetails = null;
              vm.feederDetails = null;
              vm.validateChangeReelDetails(e);
            }
            else if (vm.feederScan.umidOld && (vm.oldUMIDDetails && vm.oldUMIDDetails.feederActiveStatus)
              && vm.feederScan.umidNew && vm.feederScan.umidOld !== vm.feederScan.umidNew && vm.ScanFeederDetailsForm.feederLocation.$viewValue) {
              if (!vm.ScanFeederDetailsForm.feederLocation.$error.invalid && !vm.ScanFeederDetailsForm.feederLocation.$error.required
                && !vm.ScanFeederDetailsForm.feederLocation.$error.pattern) {
                vm.oldUMIDDetails = null;
                vm.feederDetails = null;
                vm.validateChangeReelDetails(e);
              }
            }
          } else {
            invalidAlert('OLD UMID');
          }
        } else {
          // case will not come byt incase no feeder type selected than display invalid
          const alertModel = {
            title: CORE.MESSAGE_CONSTANT.INVALID,
            textContent: CORE.MESSAGE_CONSTANT.INVALID,
            multiple: true
          };
          DialogFactory.alertDialog(alertModel);
        }
      }
    };

    const invalidAlert = (fieldName) => {
      const alertModel = {
        title: CORE.MESSAGE_CONSTANT.INVALID,
        textContent: stringFormat(CORE.MESSAGE_CONSTANT.INVALID_DYNAMIC, fieldName),
        multiple: true
      };
      DialogFactory.alertDialog(alertModel);
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
        }, () => {// cancel section
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

    // view feeder details
    vm.showChangeFeederDetails = (row, event) => {
      vm.data.equipment.isOnline = vm.data.isOnline;
      const data = {
        equipment: vm.data.equipment,
        woID: vm.data.woID,
        opID: vm.data.opID,
        woOPID: vm.data.woOPID,
        eqpFeederID: row.entity.eqpFeederID,
        eqpID: vm.data.equipment.eqpID,
        woOpEqpID: vm.data.woOpEqpID,
        feederCount: vm.data.equipment.feederCount,
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
        isTraveler: true
      };
      DialogFactory.dialogService(
        TRAVELER.TRAVELER_CHANGE_FEEDER_DETAILS_CONTROLLER,
        TRAVELER.TRAVELER_CHANGE_FEEDER_DETAILS_VIEW,
        event,
        data).then(() => { // return section
        }, (err) => BaseService.getErrorLog(err));
    };

    // view feeder verification details
    vm.showVerificationDetails = (row, event) => {
      vm.data.equipment.isOnline = vm.data.isOnline;
      const data = {
        equipment: vm.data.equipment,
        woID: vm.data.woID,
        opID: vm.data.opID,
        woOPID: vm.data.woOPID,
        woTransUMIDDetID: row.entity.id,
        eqpFeederID: row.entity.eqpFeederID,
        eqpID: vm.data.equipment.eqpID,
        woOpEqpID: vm.data.woOpEqpID,
        feederCount: vm.data.equipment.feederCount,
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
        transactionType: CORE.TransactionType.Feeder
      };
      DialogFactory.dialogService(
        TRAVELER.TRAVELER_VERIFICATION_FEEDER_DETAILS_CONTROLLER,
        TRAVELER.TRAVELER_VERIFICATION_FEEDER_DETAILS_VIEW,
        event,
        data).then(() => { // return  section
        }, (err) => BaseService.getErrorLog(err));
    };
    // on change of umid
    $scope.$watch('vm.feederScan.umid', (newVal, oldVal) => {
      if (newVal !== oldVal) {
        vm.feederScan.checkKitAllocation = true;
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


    // go to umid list
    vm.goToUMIDList = () => {
      BaseService.goToUMIDList();
    };

    // go to bin list
    vm.goToBinList = () => {
      BaseService.goToBinList();
    };

    // go to Manage UMID
    vm.goToUMIDDetail = (id) => BaseService.goToUMIDDetail(id);

    //select feeder
    vm.setFeederLocation = (item) => {
      var keyEvent = jQuery.Event('keydown');
      vm.feederScan.feederLocation = item.feederLocation;
      keyEvent.keyCode = 13;
      vm.scanLabel(keyEvent);
    };


    //select feeder
    vm.setAllocatedUMID = (item) => {
      var keyEvent = jQuery.Event('keydown');
      vm.feederScan.umid = item.umid;
      keyEvent.keyCode = 13;
      vm.scanLabel(keyEvent);
    };

    // umid transfer
    vm.uidTranfer = (event, data) => {
      data.uid = null;
      data.transactionID = vm.transactionID;
      if (vm.feederScan.type === vm.verificationType.FeederFirst || vm.feederScan.type === vm.verificationType.UMIDFirst) {
        data.uid = vm.feederScan.umid;
      }
      else if (vm.feederScan.type === vm.verificationType.ReplacePart) {
        data.uid = vm.feederScan.umidOld;
      }
      DialogFactory.dialogService(
        TRANSACTION.UID_TRANSFER_CONTROLLER,
        TRANSACTION.UID_TRANSFER_VIEW,
        event,
        data).then(() => {
        }, (transfer) => {
          if (transfer) {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            vm.gridOptions.clearSelectedRows();
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    //get footer allocation total
    vm.getFooterAllocationTotal = (list) => {
      let sum = 0;
      sum = _.sumBy(list, (data) => {
        if (data.convertedUnit) {
          return data.convertedUnit;
        } else {
          return 0;
        }
      });
      vm.sumObj.sumOfAllocationUnit = sum;
    };

    //get footer allocation unit total
    vm.getFooterAllocatedUnitTotal = (list) => {
      const sum = _.sumBy(list, (data) => {
        if (data.allocatedUnit) {
          return data.allocatedUnit;
        } else {
          return 0;
        }
      });
      vm.sumObj.sumOfAllocatedUnit = sum;
    };
    //get footer free units total
    vm.getFooterFreeUnitsTotal = (list) => {
      const sum = _.sumBy(list, (data) => {
        if (data.FreeToShare) {
          return data.FreeToShare;
        } else {
          return 0;
        }
      });
      vm.sumObj.sumOfFreeUnit = sum;
    };

    //// reset partition
    //vm.resetPartition = () => {
    //    $scope.splitPaneProperties.firstComponentSize = 450;
    //    $scope.splitPaneProperties.lastComponentSize = 300;
    //}


    //update status active or inactive
    vm.changeFeederStatus = (row, ev) => {
      var objFeeder;
      var feederList;
      var list;

      if (row.eqpFeederID) {
        row.id = row.eqpFeederID;
      }
      if (row.isActive) {
        const obj = {
          objdata: row
        };
        DialogFactory.dialogService(
          WORKORDER.WORKORDER_STATUS_FEEDER_DETAILS_CONTROLLER,
          WORKORDER.WORKORDER_STATUS_FEEDER_DETAILS_VIEW,
          ev,
          obj).then(() => {
          }, (data) => {
            if (data && !data.isActive) {
              objFeeder = angular.copy(row);
              feederList = [];
              list = _.filter(vm.sourceLineItems, (source) => source.eqpFeederID === objFeeder.id);
              _.each(list, (feederLine) => {
                var obj = {
                  rfqLineItemID: feederLine.rfqLineItemID,
                  lineID: feederLine.lineID
                };
                feederList.push(obj);
              });
              objFeeder.id = null;
              objFeeder.feederLocation = data.feederLocation;
              objFeeder.feederList = feederList;
              objFeeder.placementType = row.placementType === WORKORDER.FEEDER_PLACEMENT_TYPE[0].value ? WORKORDER.FEEDER_PLACEMENT_TYPE[0].Key : WORKORDER.FEEDER_PLACEMENT_TYPE[1].Key;
              vm.cgBusyLoading = WorkorderOperationEquipmentFeederFactory.feeder().save({
                id: null
              }, objFeeder).$promise.then((res) => {
                if (res.data) {
                  BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                  vm.gridOptions.clearSelectedRows();
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
            else {
              BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            }
          }, (err) => BaseService.getErrorLog(err));
      }
      else {
        //if already inactive
        const obj = {
          title: CORE.MESSAGE_CONSTANT.PUBLISHTEMPLATE_CONFIRM,
          textContent: stringFormat(WORKORDER.FEEDER_STATUS_INACTIVE_ACTIVE),
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.confirmDiolog(obj).then((yes) => {
          if (yes) {
            const feederInfo = {
              isActive: true,
              placementType: WORKORDER.FEEDER_PLACEMENT_TYPE[0].Key
            };
            vm.cgBusyLoading = WorkorderOperationEquipmentFeederFactory.feeder().update({
              id: row.id
            }, feederInfo).$promise.then((res) => {
              if (res.data) {
                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => { // cancelc section
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    getAccessLevelForDeleteAlias();
    //  check and get accesslevel for delete customer/mfg/supplier alias : DELETEROLEACCESS key used right now
    function getAccessLevelForDeleteAlias() {
      vm.cgBusyLoading = MasterFactory.getAcessLeval().query({ access: CORE.ROLE_ACCESS.FeederStatusAccess }).$promise.then((response) => {
        if (response && response.data) {
          vm.isAllowUpdateStatus = false;
          const currentLoginUserRole = _.find(loginUserDet.roles, (item) => item.id === loginUserDet.defaultLoginRoleID);
          if (currentLoginUserRole && currentLoginUserRole.accessLevel <= response.data.accessLevel) {
            vm.isAllowUpdateStatus = true;
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    //Scan warehouse/bin
    vm.scanWHBin = (e) => {
      $timeout(() => scanWHBin(e), true);
      ///** Prevent enter key submit event */
      //preventInputEnterKeyEvent(e);
    };

    const scanWHBin = (e) => {
      if (parseInt(e.keyCode) === 13 && vm.feederScan.ScanWHBin) {
        vm.cgBusyLoading = BinFactory.getBinDetailByName().query({ name: vm.feederScan.ScanWHBin }).$promise.then((res) => {
          if (res && res.data && res.data.responseMessage) {
            vm.cgBusyLoading = false;
            const model = {
              title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
              textContent: res.data.responseMessage,
              multiple: true
            };
            return DialogFactory.alertDialog(model).then((yes) => {
              if (yes) {
                vm.feederScan.ScanWHBin = null;
                if (vm.feederScan.reelChangeType !== vm.changeReelType.ZeroOut.Type) {
                  setFocusByName('ScanWHBin');
                } else {
                  setFocusByName('umidNew');
                }
              }
            }, () => { // cancel section
            }).catch((error) => BaseService.getErrorLog(error));
          } else if (res && res.data) {
            WHBinData = res.data;
            vm.feederScan.toBinID = WHBinData.id;
            vm.isWHBinDisable = true;
            const typeScan = WHBinData && WHBinData.WarehouseID ? TRANSACTION.TypeWHBin.Bin : TRANSACTION.TypeWHBin.Warehouse;
            if (typeScan === TRANSACTION.TypeWHBin.Bin) {
              vm.feederScan.toWarehouse = WHBinData.warehousemst.Name;
              vm.feederScan.toBin = WHBinData.Name;
              vm.feederScan.toDepartment = WHBinData.warehousemst.parentWarehouseMst.Name;
              setFocusByName('umidNew');
            } else {
              WHBinData = {};
              vm.isWHBinDisable = false;
              vm.feederScan.ScanWHBin = null;
              if (vm.feederScan.reelChangeType !== vm.changeReelType.ZeroOut.Type) {
                setFocusByName('ScanWHBin');
              } else {
                setFocusByName('umidNew');
              }
            }
          } else {
            vm.cgBusyLoading = false;
            const model = {
              title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
              textContent: TRANSACTION.SCAN_WH_BIN_NOT_FOUND,
              multiple: true
            };
            return DialogFactory.alertDialog(model).then((yes) => {
              if (yes) {
                vm.feederScan.ScanWHBin = null;
                if (vm.feederScan.reelChangeType !== vm.changeReelType.ZeroOut.Type) {
                  setFocusByName('ScanWHBin');
                } else {
                  setFocusByName('umidNew');
                }
              }
            }, () => {// Cancel  section
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    // go to warehouse list
    vm.goToWHList = () => {
      BaseService.goToWHList();
    };

    // go to bin list
    vm.goToBinList = () => {
      BaseService.goToBinList();
    };

    // Change Equipment Status
    vm.ChangeEquipmentStatus = () => {
      let pendingUMIDCnt = 0;
      const obj = {
        woID: vm.data.woID,
        opID: vm.data.opID,
        woTransID: vm.data.woTransID,
        transactionType: CORE.TransactionType.Feeder,
        woOpEqpID: vm.data.woOpEqpID
      };
      // check only if equipment is offline and changing to online
      if (!vm.data.isOnline) {
        vm.cgBusyLoading = WorkorderTransactionUMIDFactory.getPendingVerificationUMIDCount().query(obj).$promise.then((resCnt) => {
          if (resCnt && resCnt.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            if (resCnt.data && resCnt.data.pendingList.length > 0) {
              pendingUMIDCnt = _.sumBy(resCnt.data.pendingList, (item) => item.cnt);
            } else {
              pendingUMIDCnt = -1;
            }

            if (pendingUMIDCnt > 0) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.EQUIP_ONLINEPENDING_VERIFY_UMID);
              messageContent.message = stringFormat(messageContent.message, pendingUMIDCnt);
              const model = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              DialogFactory.messageConfirmDialog(model).then((yes) => {
                if (yes) {
                  updateEquipmentStatus();
                }
              }, () => { // no section
              }).catch((error) => BaseService.getErrorLog(error));
            } else if (resCnt.data && resCnt.data.totalScanned.length === 0) {
              const obj = {
                messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.FEEDER_NOT_LOADED),
                multiple: true
              };
              DialogFactory.messageAlertDialog(obj);
            }
            else {
              updateEquipmentStatus();
            }
          }
        });
      } else { // if bringing equipment to offline no need to check pending
        updateEquipmentStatus();
      }
    };

    // Update Equipment Status - Bring Offline / Online
    const updateEquipmentStatus = () => {
      var objs = {
        isOnline: vm.data.isOnline,
        partID: vm.data.partID,
        equipment: vm.data.equipment,
        woID: vm.data.woID,
        opID: vm.data.opID,
        woOPID: vm.data.woOPID,
        eqpID: vm.data.equipment.eqpID,
        woOpEqpID: vm.data.woOpEqpID,
        employeeId: vm.data.employeeId
      };
      objs.isOnline = !vm.data.isOnline;

      //  changeEquipmentStatusDetails
      vm.cgBusyLoading = WorkorderOperationFactory.changeEquipmentStatusDetails().query({ operationObj: objs }).$promise.then((res) => {
        if (res.data) {
          // check for data and error
          vm.data.isOnline = objs.isOnline;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /*Used to open UMID*/
    vm.viewUMIDHistoryPopup = (ev) => {
      const popUpHeaderData = {
        equipmentName: vm.data.equipment.assetName,
        wo: vm.data.woNumber,
        version: vm.data.woVersion,
        eqpID: vm.data.equipment.eqpID
      };
      const umidData = { isScanUMIDOnly: false, isScanFeederFirstAndUMIDFirstAndChangeReel: true, woOPID: vm.data.woOPID ? vm.data.woOPID : null, headerData: popUpHeaderData };
      DialogFactory.dialogService(
        TRAVELER.SCAN_UMID_VIEW_HISTORY_MODAL_CONTROLLER,
        TRAVELER.SCAN_UMID_VIEW_HISTORY_MODAL_VIEW,
        ev,
        umidData).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    function notificationReceiveListener(message) { $timeout(notificationReceive(message)); }

    function notificationReceive(message) {
      switch (message.event) {
        case CORE.NOTIFICATION_MESSAGETYPE.EQUIPMENT_ONLINE.TYPE:
        case CORE.NOTIFICATION_MESSAGETYPE.EQUIPMENT_OFFLINE.TYPE: {
          if (vm.data.woOpEqpID === message.data.operationObj.woOpEqpID) {
            vm.data.isOnline = message.data.operationObj.isOnline;
          }
          break;
        }
      }
    }
    // [S] Socket Listeners
    function connectSocket() {
      socketConnectionService.on('message:receive', notificationReceiveListener);
    }
    connectSocket();

    socketConnectionService.on('reconnect', () => {
      connectSocket();
    });
    function removeSocketListener() {
      socketConnectionService.removeListener('message:receive', notificationReceiveListener);
    }
    // on disconnect socket.io
    socketConnectionService.on('disconnect', () => removeSocketListener());

    $scope.$on('$destroy', () => {
      // Remove socket listeners
      removeSocketListener();
    });
    // [E] Socket Listeners

    // check form dirty
    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };
    //open popup for search of part
    vm.openSearchPartPopup = (ev) => {
      DialogFactory.dialogService(
        CORE.SEARCH_COLLECT_PART_MODAL_CONTROLLER,
        CORE.SEARCH_COLLECT_PART_MODAL_VIEW,
        ev,
        vm.data).then(() => { // return section
        }, () => { // cancel section
        }, (err) => BaseService.getErrorLog(err));
    };

    //on load submit form
    angular.element(() => {
      //check load
      BaseService.currentPagePopupForm.push(vm.ScanFeederDetailsForm);
    });

    // go to transfer bulk material option
    vm.goToTransferMaterial = () => {
      BaseService.goToTransferMaterial();
    };
    //open allocate umid list
    // kit allocation popup
    vm.allocateUMID = (row, event) => {
      if (row && row.totalallocatedUMID > 0) {
        vm.data.feederLocation = row.feederLocation;
        DialogFactory.dialogService(
          CORE.ALLOCATE_FEEDER_UMID_MODAL_CONTROLLER,
          CORE.ALLOCATE_FEEDER_UMID_MODAL_VIEW,
          event,
          vm.data).then(() => {
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      }
    };
    $scope.$on('transferMaterial', (event, transactionID) => {
      vm.transactionID = transactionID;
    });
  }
})();
