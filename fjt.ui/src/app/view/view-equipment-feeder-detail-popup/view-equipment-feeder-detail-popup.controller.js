(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('ViewEquipmentFeederHistoryController', ViewEquipmentFeederHistoryController);

  /** @ngInject */
  function ViewEquipmentFeederHistoryController($scope, $mdDialog, data, BaseService, CORE, $timeout, USER,
    CONFIGURATION, WORKORDER, RFQTRANSACTION, WorkorderOperationEquipmentFactory,
    WorkorderOperationEquipmentFeederFactory, DialogFactory, ImportExportFactory, $filter, MasterFactory,
    socketConnectionService) {
    const vm = this;
    var _feederHeaders;
    vm.data = angular.copy(data);
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.LabelConstant = CORE.LabelConstant;
    vm.isQtyConfirmationlist = true;
    vm.actionButtonName = 'View Reason List';
    const feederMappingObj = angular.copy(WORKORDER.FEEDER_COLUMN_MAPPING);
    _feederHeaders = _.values(feederMappingObj);
    vm.setScrollClass = 'gridScrollHeight_Feeder';
    const statusHeader = CORE.StatusOptionsGridHeaderDropdown;
    const placementTypeStatus = CORE.FEEDER_PLACEMENT_TYPE;
    const loginUserDet = BaseService.loginUser;
    // operation name
    vm.data.opFullName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, vm.data.opName, vm.data.opNumber);
    let deleteAllandImport = true;
    vm.isFeederStatus = true;
    vm.productionPNRegEx = CORE.ProductionPNAllowedCharactersPattern;
    vm.inactivePartList = [];
    vm.goToComponentBOM = () => {
      BaseService.goToComponentBOM(vm.data.partID);
      return false;
    };

    /*Used to goto equipment list*/
    vm.goToEquipmentList = () => {
      BaseService.goToEquipmentWorkstationList();
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

    /*Move to equipment page*/
    vm.goToManageEquipmentWorkstation = (equip) => {
      BaseService.goToManageEquipmentWorkstation(equip.eqpID);
    };

    vm.headerdata = [];
    vm.headerdata.push({
      label: 'Equipment Name', value: vm.data.equipment.assetName, displayOrder: 1, labelLinkFn: vm.goToEquipmentList,
      valueLinkFn: vm.goToManageEquipmentWorkstation,
      valueLinkFnParams: { eqpID: vm.data.equipment.eqpID },
      isCopy: false
    });
    vm.headerdata.push({
      label: vm.LabelConstant.Workorder.WO, value: vm.data.woNumber, displayOrder: 2, labelLinkFn: vm.goToWorkorderList,
      valueLinkFn: vm.goToWorkorderDetails,
      valueLinkFnParams: { woID: vm.data.woID },
      isCopy: false
    });
    vm.headerdata.push({
      label: vm.LabelConstant.Workorder.Version, value: vm.data.woVersion, displayOrder: 3
    });


    // 1 - Action
    // 2 - #
    // 3 - Placement Type
    // 4 - Status
    // 5 - feederLocation
    // 6 - Edit Production PN
    // 7 - Production PN
    // 8 - Edit PIDCode
    // 9 - PIDCode
    // 10 - qty
    // 12 - feederDescription
    // 13 - setup comment
    // 14 - lineID
    // 15 - reason
    // 16 - supply
    // 17 - usedon
    // 18 - col1
    // 19 - col2
    // 20 - col3
    // 21 - col4


    vm.isEditIntigrate = false;
    vm.EmptyMesssage = WORKORDER.WORKORDER_EMPTYSTATE.WORKORDER_OPERATION_EQUIPMENT_FEEDER_DETAILS;
    vm.sourceHeader = [
      {
        field: 'Action',
        cellClass: 'layout-align-center-center',
        displayName: 'Action',
        width: '110',
        cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
        enableFiltering: false,
        enableSorting: false,
        enableCellEdit: false,
        exporterSuppressExport: true,
        enableColumnMenus: false,
        enableRowSelection: false,
        enableFullRowSelection: false,
        multiSelect: false,
        maxWidth: '250'
      },
      {
        field: '#',
        width: '60',
        cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
        enableFiltering: false,
        enableSorting: false,
        enableCellEdit: false,
        enableCellEditOnFocus: false,
        allowCellFocus: false
      },
      {
        field: 'placementType',
        displayName: 'Placement Type',
        width: 130,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        enableCellEdit: false,
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: placementTypeStatus
        },
        ColumnDataType: 'StringEquals',
        enableCellEditOnFocus: false,
        allowCellFocus: false
      },
      {
        field: 'feederStatus',
        displayName: 'Status',
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
        width: 100,
        enableCellEdit: false,
        enableCellEditOnFocus: false,
        allowCellFocus: false
      },
      {
        field: 'feederLocation',
        displayName: feederMappingObj.Feeder.Name,
        width: 90,
        cellTemplate: '<div class="ui-grid-cell-contents" ng-style="{\'text-decoration-line\':!row.entity.isActive?\'line-through\':\'none\'}" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}">{{COL_FIELD}}</div>',
        enableCellEdit: true,
        cellEditableCondition: function (scope) {
          return (scope.row.entity.isActive && vm.isAllowUpdateStatus && scope.row.entity.isApprovelineItems);
        }
        //editableCellTemplate: "<div style=\"height:100% !important;width:100% !important\" class=\"grid-edit-input\"><form name=\"inputForm\"><input style=\"height:100% !important;width:100% !important\"  type=\"INPUT_TYPE\" min=\"0\" max=\"9999999\" ng-style=\"{'background-color':rowRenderIndex % 2==0?'transparent !important':'#f3f3f3 !important'}\"   ng-class=\"'colt' + col.uid\" ui-grid-editor ng-model=\"MODEL_COL_FIELD\" style=\"width:100%;text-align:left;border:none;margin-left:-10px\"></form></div>",

      }, {
        field: 'productionPN',
        displayName: 'Edit ' + feederMappingObj.ProductionPN.Name,
        enableCellEdit: true,
        enableCellEditOnFocus: true,
        validators: { required: true },
        cellTemplate: '<div class="ui-grid-cell-contents"  ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}">{{COL_FIELD}}</div>',
        width: 210,
        cellEditableCondition: function (scope) {
          return (scope.row.entity.isActive && vm.isAllowUpdateStatus && scope.row.entity.isApprovelineItems);
        }
      },
      {
        field: 'productionPN',
        displayName: feederMappingObj.ProductionPN.Name,
        enableCellEdit: false,
        cellTemplate: '<div class="ui-grid-cell-contents"  ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}">{{COL_FIELD}}</div>',
        width: 210,
        enableCellEditOnFocus: false,
        allowCellFocus: false
      },
      {
        field: 'PIDCode',
        displayName: 'Edit ' + CORE.LabelConstant.MFG.PID,
        cellTemplate: '<div class="ui-grid-cell-contents"  ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.PID,
        enableCellEditOnFocus: true,
        enableCellEdit: true,
        validators: { required: true },
        cellEditableCondition: function (scope) {
          return (scope.row.entity.isActive && vm.isAllowUpdateStatus && scope.row.entity.isApprovelineItems);
        }
      },
      {
        field: 'PIDCode',
        displayName: CORE.LabelConstant.MFG.PID,
        enableCellEdit: false,
        cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link ng-class="{\'text-double-line-through\':row.entity.restrictPermission}"  ng-style="{\'text-decoration-line\':row.entity.isRestricted?\'line-through\':\'\'}"\
                                        component-id="row.entity.mfgPNID" \
                                        label="grid.appScope.$parent.vm.LabelConstant.MFG.ID" \
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
        enableCellEditOnFocus: false,
        allowCellFocus: false
      },
      {
        field: 'qty',
        displayName: feederMappingObj.Qty.Name,
        width: 70,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"  \
                                    ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" \
                                    title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}" \
                                    step="1">\
                                    {{COL_FIELD}}\
                            </div>',
        type: 'number',
        validators: { required: true },
        enableCellEdit: true,
        enableCellEditOnFocus: true,
        cellEditableCondition: function (scope) {
          return (scope.row.entity.isActive && vm.isAllowUpdateStatus && scope.row.entity.isApprovelineItems);
        }
      },
      {
        field: 'alternateParts',
        displayName: 'Alternate Part',
        width: 400,
        cellTemplate: '<alternative-component-details  is-expand="false" ng-click="$event.stopPropagation();" row-data="row.entity"></alternative-component-details>',
        enableCellEdit: false,
        visible: false
      },
      {
        field: 'feederDescription',
        displayName: feederMappingObj.Description.Name,
        width: 400,
        cellTemplate: '<div class="ui-grid-cell-contents" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}">{{COL_FIELD}}</div>',
        validators: { required: false },
        enableCellEdit: true,
        enableCellEditOnFocus: true,
        cellEditableCondition: function (scope) {
          return (scope.row.entity.isActive && vm.isAllowUpdateStatus && scope.row.entity.isApprovelineItems);
        }
      },
      {
        field: 'setupComment',
        displayName: 'Setup Comment',
        width: 400,
        cellTemplate: '<div class="ui-grid-cell-contents"  ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}">{{COL_FIELD}}</div>',
        validators: { required: false },
        enableCellEdit: true,
        enableCellEditOnFocus: true,
        cellEditableCondition: function (scope) {
          return (scope.row.entity.isActive && vm.isAllowUpdateStatus && scope.row.entity.isApprovelineItems);
        }
      },
      {
        field: 'lineID',
        displayName: 'Line Item',
        width: 120,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right"  ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}">{{COL_FIELD}}</div>',
        validators: { required: false },
        enableCellEdit: true,
        enableCellEditOnFocus: true,
        allowCellFocus: true,
        cellEditableCondition: function (scope) {
          return (scope.row.entity.isActive && vm.isAllowUpdateStatus && scope.row.entity.id && scope.row.entity.isApprovelineItems);
        }
      },
      {
        field: 'lineItemSelectReason',
        displayName: 'Reason',
        width: 400,
        cellTemplate: '<div class="ui-grid-cell-contents"  ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}">{{COL_FIELD}}</div>',
        enableCellEdit: true,
        enableCellEditOnFocus: true,
        cellEditableCondition: function (scope) {
          return (scope.row.entity.isActive && vm.isAllowUpdateStatus && scope.row.entity.isApprovelineItems);
        }
      },
      {
        field: 'supply',
        displayName: feederMappingObj.Supply.Name,
        width: 120,
        cellTemplate: '<div class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
        validators: { required: false },
        enableCellEdit: true,
        enableCellEditOnFocus: true,
        cellEditableCondition: function (scope) {
          return (scope.row.entity.isActive && vm.isAllowUpdateStatus && scope.row.entity.isApprovelineItems);
        }
      },
      {
        field: 'usedon',
        displayName: feederMappingObj.UsedOn.Name,
        width: 120,
        cellTemplate: '<div class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
        validators: { required: false },
        enableCellEdit: true,
        enableCellEditOnFocus: true,
        cellEditableCondition: function (scope) {
          return (scope.row.entity.isActive && vm.isAllowUpdateStatus && scope.row.entity.isApprovelineItems);
        }
      },
      {
        field: 'col1',
        displayName: feederMappingObj.Col1.Name,
        width: 100,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        validators: { required: false },
        enableCellEdit: true,
        enableCellEditOnFocus: true,
        cellEditableCondition: function (scope) {
          return (scope.row.entity.isActive && vm.isAllowUpdateStatus && scope.row.entity.isApprovelineItems);
        }
      },
      {
        field: 'col2',
        displayName: feederMappingObj.Col2.Name,
        width: 100,
        cellTemplate: '<div class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
        validators: { required: false },
        enableCellEdit: true,
        cellEditableCondition: function (scope) {
          return (scope.row.entity.isActive && vm.isAllowUpdateStatus && scope.row.entity.isApprovelineItems);
        }
      },
      {
        field: 'col3',
        displayName: feederMappingObj.Col3.Name,
        width: 100,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        validators: { required: false },
        enableCellEdit: true,
        enableCellEditOnFocus: true,
        cellEditableCondition: function (scope) {
          return (scope.row.entity.isActive && vm.isAllowUpdateStatus && scope.row.entity.isApprovelineItems);
        }
      },
      {
        field: 'col4',
        displayName: feederMappingObj.Col4.Name,
        width: 100,
        cellTemplate: '<div class="ui-grid-cell-contents" >{{COL_FIELD}}</div>',
        validators: { required: false },
        enableCellEdit: true,
        enableCellEditOnFocus: true,
        cellEditableCondition: function (scope) {
          return (scope.row.entity.isActive && vm.isAllowUpdateStatus && scope.row.entity.isApprovelineItems);
        }
      },
      {
        field: 'updatedAt',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false
      }, {
        field: 'updatedByName',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }, {
        field: 'updatedByRoleName',
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
      },
      {
        field: 'createdByName',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        enableSorting: true,
        enableFiltering: true
      }, {
        field: 'createdByRoleName',
        displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }
    ];


    vm.sourceHeader.unshift(
      {
        field: 'Apply',
        headerCellTemplate: '<md-checkbox class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" ng-model="grid.appScope.$parent.vm.Apply" \
                            ng-change="grid.appScope.$parent.vm.applyAll(grid.appScope.$parent.vm.Apply)"></md-checkbox>',
        width: '75',
        cellTemplate: '<div class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" style="overflow:initial"><md-checkbox ng-disabled="row.entity.isDisabledDelete"  ng-model="row.entity.isRecordSelectedForRemove" \
                            ng-change="grid.appScope.$parent.vm.setFeederLocationRemove(row.entity)"></md-checkbox></div>',
        enableFiltering: false,
        enableCellEdit: false,
        enableCellEditOnFocus: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: false,
        allowCellFocus: false,
        maxWidth: '80',
        enableColumnMoving: false,
        manualAddedCheckbox: true
      });

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['id', 'ASC']],
        SearchColumns: [],
        pageName: CORE.PAGENAME_CONSTANT[16].PageName
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
      exporterCsvFilename: 'Work Order Operation Equipment Feeder.csv',
      hideAddNew: false,
      CurrentPage: CORE.PAGENAME_CONSTANT[16].PageName
    };


    /* retrieve feeder details list*/
    vm.loadData = () => {
      let index = 0;
      let gridclientHeight;
      vm.cgBusyLoading = WorkorderOperationEquipmentFeederFactory.feeder(vm.pagingInfo).query({ id: null, woOpEqpID: vm.data.woOpEqpID }).$promise.then((response) => {
        if (response && response.data) {
          vm.sourceData = response.data.feeder;
          _.map(vm.sourceData, (item) => {
            item.alternatePartsGrid = getPIDsFromString(item.alternateParts ? item.alternateParts.split('###').join(',') : null);
          });
          _.each(vm.sourceData, (s) => {
            s.index = index++;
            s.rohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, s.rohsIcon);
          });
          vm.Apply = false;
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
          if (!vm.isEditIntigrate) {
            cellEdit();
          }
          vm.sourceLineItems = response.data.lineItems;
          if (_.find(vm.sourceData, (lineitem) => lineitem.isApprovelineItems === 0)) {
            loaddataLineItems();
          }
          else if (vm.ismultipleLines) {
            vm.ismultipleLines = false;
            $scope.splitPaneProperties.lastComponentSize = 0;
            gridclientHeight = document.getElementsByClassName('gridScrollHeight_Feeder');
            if (gridclientHeight && gridclientHeight.length > 0) {
              gridclientHeight[0].setAttribute('style', 'height:calc(100vh - 321px) !important;');
            }
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const setInvalidAndScroll = (rowEntity, colIndex, name, message, onlyValidation) => {
      if (!onlyValidation) {
        vm.gridOptions.gridApi.cellNav.scrollToFocus(vm.sourceData[rowEntity.index], vm.sourceHeader[colIndex]);
      }
      vm.gridOptions.gridApi.grid.validate.setInvalid(vm.sourceData[rowEntity.index], vm.sourceHeader[colIndex]);
      if (name) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.INVALID_DYNAMIC);
        messageContent.message = stringFormat(messageContent.message, name);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
      } else if (message) {
        const model = {
          messageContent: message,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
      }
    };

    // check PID allow in assembly or not
    const validateMFGPNWithAssembly = (colDef, rowEntity) => {
      var objLineMFGPN;
      // var lineId = '';
      var lineIds;
      var filterList = [];
      var list = [];
      var lineItemsIds;
      var invalid;
      var validatePartValue;
      var validatePartField;
      var validateCustPartField;
      let prodPNObj;

      if (colDef.field === 'productionPN') {
        validatePartValue = rowEntity.productionPN;
        validatePartField = 'productionPN';
        validateCustPartField = 'custProductionPN';
      } else if (colDef.field === 'PIDCode') {
        validatePartValue = rowEntity.PIDCode;
        validatePartField = 'PIDCode';
        validateCustPartField = 'custPIDCode';
      } else {
        validatePartValue = rowEntity.productionPN ? rowEntity.productionPN : rowEntity.PIDCode;
        validatePartField = rowEntity.productionPN ? 'productionPN' : 'PIDCode';
        validateCustPartField = rowEntity.productionPN ? 'custProductionPN' : 'custPIDCode';
      }

      if (rowEntity.id) {
        lineIds = (rowEntity && rowEntity.lineID) ? rowEntity.lineID.split(',') : [];
        lineIds = lineIds ? lineIds.map(Number) : [];
        if (rowEntity.productionPN && rowEntity.PIDCode) {
          prodPNObj = _.find(vm.assemblyPartList, (item) => item.productionPN === rowEntity.productionPN);
          // PIDObj = _.find(vm.assemblyPartList, (item) => item.PIDCode === rowEntity.PIDCode);
          if (prodPNObj && prodPNObj.PIDCode !== rowEntity.PIDCode) {
            if (colDef.field === 'productionPN') {
              rowEntity.PIDCode = null;
              setInvalidAndScroll(rowEntity, 6, feederMappingObj.ProductionPN.Name, null, true);
            }
            if (colDef.field === 'PIDCode') {
              rowEntity.productionPN = null;
              setInvalidAndScroll(rowEntity, 8, feederMappingObj.PID.Name, null, true);
            }
          } else if (!prodPNObj) {
            rowEntity.PIDCode = null;
            setInvalidAndScroll(rowEntity, 6, feederMappingObj.ProductionPN.Name, null, true);
          }
        } else if (!rowEntity.productionPN || !rowEntity.PIDCode) {
          if (colDef.field === 'productionPN' && !rowEntity.productionPN) {
            rowEntity.PIDCode = null;
            rowEntity.mfgPN = null;
            setInvalidAndScroll(rowEntity, 6, null, null, true);
          } else if (colDef.field === 'PIDCode' && !rowEntity.PIDCode) {
            rowEntity.productionPN = null;
            rowEntity.mfgPN = null;
            setInvalidAndScroll(rowEntity, 8, null, null, true);
          }
        }
        objLineMFGPN = _.filter(vm.assemblyPartList, (part) => validatePartValue && ((part[validatePartField] && (part[validatePartField].toUpperCase() === validatePartValue.toString().toUpperCase()))
          || (part[validateCustPartField] && (part[validateCustPartField].toUpperCase() === validatePartValue.toUpperCase())))
        );
        objLineMFGPN = objLineMFGPN.filter((e) => lineIds.includes(e.LineID));
        if (objLineMFGPN.length === 0) {
          objLineMFGPN = null;
        } else {
          filterList = angular.copy(objLineMFGPN);
          //logic need change here, if found multiple PN than what we have to do - Vaibhav Shah - 24/12/2019
          objLineMFGPN = objLineMFGPN[0];
        }
      } else {
        objLineMFGPN = _.filter(vm.assemblyPartList, (part) => validatePartValue && ((part[validatePartField] && (part[validatePartField].toUpperCase() === validatePartValue.toString().toUpperCase()))
          || (part[validateCustPartField] && (part[validateCustPartField].toUpperCase() === validatePartValue.toUpperCase()))));
        rowEntity.lineID = _.map(_.uniqBy(objLineMFGPN, 'LineID'), 'LineID').join();

        lineIds = rowEntity.lineID.split(',');
        lineIds = lineIds.map(Number);
        objLineMFGPN = objLineMFGPN.filter((e) => lineIds.includes(e.LineID));
        if (objLineMFGPN.length === 0) {
          objLineMFGPN = null;
        }
        else {
          filterList = angular.copy(objLineMFGPN);
          vm.gridOptions.gridApi.grid.validate.setValid(vm.sourceData[rowEntity.index], vm.sourceHeader[6]);
          vm.gridOptions.gridApi.grid.validate.setValid(vm.sourceData[rowEntity.index], vm.sourceHeader[8]);
          //logic need change here, if found multiple PN than what we have to do - Vaibhav Shah - 24/12/2019
          objLineMFGPN = objLineMFGPN[0];
        }
      }
      // check for MFG PN
      if (!objLineMFGPN) {
        rowEntity.mfgPNID = null;
        rowEntity.rfqLineItemsID = null;
        if (!rowEntity.id && colDef.field === 'productionPN') {
          setInvalidAndScroll(rowEntity, 6, feederMappingObj.ProductionPN.Name, stringFormat(WORKORDER.FEEDER.INVALID, stringFormat('{0}', feederMappingObj.ProductionPN.Name)));
        }
        if (!rowEntity.id && colDef.field === 'PID') {
          setInvalidAndScroll(rowEntity, 8, feederMappingObj.PID.Name, stringFormat(WORKORDER.FEEDER.INVALID, stringFormat('{0}', feederMappingObj.PID.Name)));
        }
        rowEntity.isMfgPNValid = false;
      } else {
        const isSupplyMaterialTool = _.find(CORE.COMPONENT_LOGICALGROUPID, (item) => item === objLineMFGPN.logicalGroupID);
        if (isSupplyMaterialTool) {
          // set invalid PID because it belongs to Supplies, Materials and Tools
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.PART_MUST_BE_OTHER_THAN_SMT);
          messageContent.message = stringFormat(messageContent.message, objLineMFGPN.logicalGroupName);
          setInvalidAndScroll(rowEntity, 6, null, messageContent);
        } else {
          // check if customer part than display customer pidcode in grid for machine setup and umid scan
          if (validatePartValue && objLineMFGPN.custPIDCode && (objLineMFGPN.custPIDCode.toUpperCase() === validatePartValue.toUpperCase())) {
            rowEntity.mfgPNID = objLineMFGPN.custPNID;
          } else {
            rowEntity.PIDCode = objLineMFGPN.PIDCode;
            rowEntity.productionPN = objLineMFGPN.productionPN;
            rowEntity.mfgPNID = objLineMFGPN.mfgPNID;
          }
          list = [];
          _.each(filterList, (feeder) => {
            var objFeeder = {
              rfqLineItemID: feeder.rfqLineItemsID,
              lineID: feeder.LineID,
              eqpFeederID: rowEntity.id
            };
            const duplicateLineFound = _.find(list, (fItem) => fItem.rfqLineItemID === feeder.rfqLineItemsID && fItem.lineID === feeder.LineID);
            if (!duplicateLineFound) {
              list.push(objFeeder);
            }
          });
          //rowEntity.lineID = objLineMFGPN.LineID;
          //rowEntity.refDesig = objLineMFGPN.refDesig;
          rowEntity.rfqLineItemsID = objLineMFGPN.rfqLineItemsID;
          rowEntity.filterList = list;
        }
      }
      // check from production PN format
      if (rowEntity.isMfgPNValid && rowEntity.productionPN && !new RegExp(vm.productionPNRegEx).test(rowEntity.productionPN.toString())) {
        rowEntity.isMfgPNValid = false;
        setInvalidAndScroll(rowEntity, 6, feederMappingObj.ProductionPN.Name, stringFormat(WORKORDER.FEEDER.INVALID, stringFormat('{0}', feederMappingObj.ProductionPN.Name)));
      }
      // check for qty
      if ((rowEntity && !rowEntity.qty) || (rowEntity.qty <= 0)) {
        setInvalidAndScroll(rowEntity, 10, null, null, true);
      } else {
        if (!_.isInteger(rowEntity.qty)) {
          setInvalidAndScroll(rowEntity, 10, null, null, true);
        }
      }
      if (objLineMFGPN && objLineMFGPN.partStatus === CORE.PartStatusList.InActiveInternal) {
        vm.inactivePartList.push(objLineMFGPN.PIDCode);
      }
      // check for lineID or refDesig
      if (!rowEntity.lineID) {
        setInvalidAndScroll(rowEntity, 14, null, null, true);
      }
      else {
        lineItemsIds = rowEntity.lineID.split(',');
        invalid = false;
        _.each(lineItemsIds, (ids) => {
          try {
            ids = parseInt(ids);
            const isexist = _.find(rowEntity.filterList, (fline) => fline.lineID === ids);
            if (!isexist) {
              invalid = true;
            }
          }
          catch (e) {
            invalid = true;
          }
        });
        if (invalid) {
          rowEntity.isMfgPNValid = false;
          setInvalidAndScroll(rowEntity, 14, 'Line Item', null, true);
        }
        else {
          vm.gridOptions.gridApi.grid.validate.setValid(vm.sourceData[rowEntity.index], vm.sourceHeader[12]);
        }
      }
      if (rowEntity.id && rowEntity.actualLineIds !== rowEntity.lineID && colDef.field !== 'lineItemSelectReason') {
        rowEntity.lineItemSelectReason = null;
        rowEntity.isMfgPNValid = false;
        setInvalidAndScroll(rowEntity, 15, null, null, true);
      }
      //else if (rowEntity.actualLineIds == rowEntity.lineID && !rowEntity.lineItemSelectReason)
      //    rowEntity.lineItemSelectReason=rowEntity.actualLineItemReason
      if (!rowEntity.lineItemSelectReason && rowEntity.id && rowEntity.actualLineIds !== rowEntity.lineID) {
        rowEntity.isMfgPNValid = false;
        setInvalidAndScroll(rowEntity, 15, null, null, true);
      }
    };

    // check no duplicate feeder details
    const validateFeederDetails = (colDef, rowEntity, isEdit) => {
      let objFindDuplicate;
      if (isEdit) {
        objFindDuplicate = _.find(vm.sourceData, (itemData) => (itemData.feederLocation === rowEntity.feederLocation) && itemData.id !== rowEntity.id);
      } else {
        objFindDuplicate = _.find(vm.sourceData, (itemData) => itemData.id && (itemData.feederLocation === rowEntity.feederLocation));
      }
      if (objFindDuplicate) {
        if (colDef.field === 'feederLocation') {
          setInvalidAndScroll(rowEntity, 5, feederMappingObj.Feeder.Name, CORE.MESSAGE_CONSTANT.FEEDER_MUST_BE_UNIQUE);
        }
        rowEntity.isFeederValid = false;
      }
    };

    // make field valid for grid
    const makeFieldValid = (rowEntity) => {
      vm.gridOptions.gridApi.grid.validate.setValid(vm.sourceData[rowEntity.index], vm.sourceHeader[6]);
      vm.gridOptions.gridApi.grid.validate.setValid(vm.sourceData[rowEntity.index], vm.sourceHeader[8]);
      vm.gridOptions.gridApi.grid.validate.setValid(vm.sourceData[rowEntity.index], vm.sourceHeader[14]);
      vm.gridOptions.gridApi.grid.validate.setValid(vm.sourceData[rowEntity.index], vm.sourceHeader[15]);
    };

    // check field invalid for grid
    const makeInvalidField = (rowEntity) => {
      if (rowEntity && !rowEntity.feederLocation) {
        setInvalidAndScroll(rowEntity, 5, null, null, true);
      }
      if (rowEntity && (!rowEntity.productionPN && !rowEntity.PIDCode)) {
        setInvalidAndScroll(rowEntity, 6, null, null, true);
        setInvalidAndScroll(rowEntity, 8, null, null, true);
        rowEntity.mfgPNID = null;
        rowEntity.productionPN = null;
        rowEntity.PIDCode = null;
        rowEntity.rfqLineItemsID = null;
      }
      if ((rowEntity && !rowEntity.qty) || (rowEntity.qty <= 0)) {
        setInvalidAndScroll(rowEntity, 10, null, null, true);
      } else {
        if (!_.isInteger(rowEntity.qty)) {
          setInvalidAndScroll(rowEntity, 10, null, null, true);
        }
      }
      //if (rowEntity && !rowEntity.lineID) {
      //    setInvalidAndScroll(rowEntity, 9, null, null, true);
      //} else {
      //    vm.gridOptions.gridApi.grid.validate.setValid(vm.sourceData[rowEntity.index], vm.sourceHeader[9]);
      //}
    };

    function cellEdit() {
      var feederInfo;
      let findPartObj;
      vm.isEditIntigrate = true;
      vm.gridOptions.gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newvalue, oldvalue) => {
        //check PIDCode exists in BOM or not
        if (colDef.field === 'productionPN') {
          rowEntity.productionPN = rowEntity.productionPN ? rowEntity.productionPN.toUpperCase() : rowEntity.productionPN;
        }
        if (colDef.field === 'PIDCode') {
          rowEntity.PIDCode = rowEntity.PIDCode ? rowEntity.PIDCode.toUpperCase() : rowEntity.PIDCode;
        }
        if (rowEntity.id) {
          if (colDef.field === 'feederLocation' || colDef.field === 'feederDescription'
            || colDef.field === 'qty' || colDef.field === 'supply' || colDef.field === 'usedon'
            || colDef.field === 'productionPN' || colDef.field === 'PIDCode'
            || colDef.field === 'setupComment' || colDef.field === 'lineID' || colDef.field === 'lineItemSelectReason') {
            if (newvalue !== oldvalue) {
              rowEntity.isFeederValid = true;
              rowEntity.isMfgPNValid = true;
              // if edit feeder details than check for feeder should not duplicate
              validateFeederDetails(colDef, rowEntity, true);
              // if edit PN than must belongs assembly
              if (rowEntity.productionPN || rowEntity.PIDCode) {
                validateMFGPNWithAssembly(colDef, rowEntity, true);
              }
            }
            else {
              makeInvalidField(rowEntity);
            }
          }
          if (newvalue !== oldvalue
            && rowEntity.feederLocation
            && rowEntity.PIDCode
            && rowEntity.productionPN
            && rowEntity.qty
            && (rowEntity.lineID)
            && _.isInteger(rowEntity.qty)
            && (rowEntity.qty > 0)
            && rowEntity.isFeederValid
            && rowEntity.isMfgPNValid
            && rowEntity.lineItemSelectReason) {
            const col = colDef.field;
            feederInfo = {
              //values: newvalue,
            };
            feederInfo[col] = newvalue;
            rowEntity.actualLineIds = rowEntity.lineID;
            feederInfo.feederList = [];
            if (colDef.field === 'productionPN' || colDef.field === 'PIDCode' || colDef.field === 'lineID' || colDef.field === 'lineItemSelectReason') {
              feederInfo.PIDCode = rowEntity.PIDCode;
              feederInfo.mfgPNID = rowEntity.mfgPNID;
              feederInfo.productionPN = rowEntity.productionPN;
              feederInfo.feederList = rowEntity.filterList;
            }
            vm.cgBusyLoading = WorkorderOperationEquipmentFeederFactory.feeder().update({
              id: rowEntity.id
            }, feederInfo).$promise.then((res) => {
              if (res && res.data) {
                makeFieldValid(rowEntity);
                //BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                //vm.gridOptions.clearSelectedRows();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        } else {
          if (colDef.field === 'feederLocation' || colDef.field === 'qty'
            || colDef.field === 'productionPN' || colDef.field === 'PIDCode' || colDef.field === 'setupComment') {
            if (newvalue !== oldvalue) {
              rowEntity.isFeederValid = true;
              rowEntity.isMfgPNValid = true;
              // if edit feeder details than check for feeder should not duplicate
              validateFeederDetails(colDef, rowEntity, false);
              // if entering new entry take  PIDCode of entered Production PN
              if (!rowEntity.PIDCode && rowEntity.productionPN) {
                findPartObj = _.find(vm.assemblyPartList, (item) => item.productionPN === rowEntity.productionPN);
                rowEntity.PIDCode = findPartObj && findPartObj.PIDCode ? findPartObj.PIDCode : null;
                if (!findPartObj) { setInvalidAndScroll(rowEntity, 6, null, null, true); }
              }
              // if entering new entry take  Production PN  of entered PIDCode
              if (!rowEntity.productionPN && rowEntity.PIDCode) {
                findPartObj = _.find(vm.assemblyPartList, (item) => item.productionPN === rowEntity.productionPN);
                rowEntity.productionPN = findPartObj && findPartObj.productionPN ? findPartObj.productionPN : null;
                if (!findPartObj) { setInvalidAndScroll(rowEntity, 8, null, null, true); }
              }
              // if edit PN /PIDCode than must belongs assembly
              if (rowEntity.productionPN || rowEntity.PIDCode) {
                validateMFGPNWithAssembly(colDef, rowEntity, true);
              }
            } else {
              makeInvalidField(rowEntity);
            }
          }
          // If all value available than save
          if (newvalue !== oldvalue
            && rowEntity.feederLocation
            && rowEntity.PIDCode
            && rowEntity.qty
            && (rowEntity.lineID)
            && _.isInteger(rowEntity.qty)
            && (rowEntity.qty > 0)
            && rowEntity.isFeederValid
            && rowEntity.isMfgPNValid) {
            const feederInfo = {
              feederLocation: rowEntity.feederLocation,
              qty: rowEntity.qty,
              PIDCode: rowEntity.PIDCode,
              woOpEqpID: vm.data.woOpEqpID,
              woID: vm.data.woID,
              opID: vm.data.opID,
              eqpID: vm.data.equipment.eqpID,
              woOPID: vm.data.woOPID,
              mfgPNID: rowEntity.mfgPNID,
              partID: vm.data.partID,
              feederList: rowEntity.filterList,
              feederDescription: rowEntity.feederDescription,
              setupComment: rowEntity.setupComment,
              placementType: WORKORDER.FEEDER_PLACEMENT_TYPE[0].Key,
              isApprovelineItems: rowEntity.filterList.length > 1 ? false : true,
              recommendedLineItem: rowEntity.filterList[0].lineID,
              systemrecommended: rowEntity.filterList[0].lineID,
              isActive: true
            };

            // confirm for inactive part here
            if (vm.inactivePartList && vm.inactivePartList.length > 0) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADD_INACTIVE_PART_CONFIRMATION);
              messageContent.message = stringFormat(messageContent.message, vm.inactivePartList.join(','));
              const obj = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              DialogFactory.messageConfirmDialog(obj).then((yes) => {
                if (yes) {// yes part
                  addFeederPartAfterConfirmation(rowEntity, feederInfo);
                }
              }, () => { // no part
                setInvalidAndScroll(rowEntity, 8, null, null, true);
                vm.inactivePartList = [];
                return;
              }).catch((error) => BaseService.getErrorLog(error));
            } else {
              addFeederPartAfterConfirmation(rowEntity, feederInfo);
            }
          } else {
            //vm.gridOptions.gridApi.cellNav.scrollToFocus(vm.sourceData[rowEntity.index], vm.sourceHeader[1]);
            // vm.gridOptions.gridApi.grid.validate.setInvalid(vm.sourceData[rowEntity.index], vm.sourceHeader[1]);
          }
        }
      });
    }
    // add entry for feeder part after inactive confirmation
    const addFeederPartAfterConfirmation = (rowEntity, feederInfo) => {
      vm.cgBusyLoading = WorkorderOperationEquipmentFeederFactory.feeder().save({
        id: rowEntity.id
      }, feederInfo).$promise.then((res) => {
        if (res && res.data) {
          makeFieldValid(rowEntity);
          BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
          vm.gridOptions.clearSelectedRows();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // Create model from array
    const generateModelPopup = (uploadedFeeder, feederHeaders) => {
      var feedermodel = [];
      var item;
      var modelRow;
      // loop through excel data and bind into model
      for (let i = 1, len = uploadedFeeder.length; i < len; i++) {
        item = uploadedFeeder[i];
        modelRow = {};
        uploadedFeeder[0].forEach((column, index) => {
          if (column == null) {
            return;
          }
          const obj = feederHeaders.find((x) => x.column && x.column.toUpperCase() === column.toUpperCase());
          if (!obj) {
            return;
          }
          const field = _feederHeaders.find((x) => x.Name === obj.header);
          if (field && !modelRow[field.Name]) {
            modelRow[field.Name] = item[index] ? item[index] : null;
          }
        });
        feedermodel.push(modelRow);
      };
      checkUploadedFeederPopup(feedermodel);
    };

    let isFileImportInvalid = false;
    //check for validation for fields after update

    function checkUploadedFeederPopup(parts) {
      var errorFeeder = [];
      var rfqLineItemList = [];
      var lineDetails;
      var validatePartField;
      var validateCustPartField;
      var validatePartValue;
      var validatePartFieldName;
      var partInvalid = false;
      isFileImportInvalid = false;
      _.each(parts, (item, index) => {
        var isDirty = false;
        var remark = '';
        var error = '';
        var objLineMFGPN;
        var isSupplyMaterialTool;
        var prodPNObj;
        validatePartValue = null;
        validatePartFieldName = null;
        validatePartField = '';
        validateCustPartField = '';
        partInvalid = false;
        // check qty must require and int while upload in equipment feeder
        if (!item[feederMappingObj.Qty.Name]) {
          error = stringFormat(WORKORDER.FEEDER.REQUIRED, feederMappingObj.Qty.Name);
          remark = stringFormat('{0},{1}', remark, error);
          isDirty = true;
        }
        else if (item[feederMappingObj.Qty.Name]) {
          try {
            item[feederMappingObj.Qty.Name] = parseInt(item[feederMappingObj.Qty.Name]);
            if (Number.isNaN(item[feederMappingObj.Qty.Name])) {
              error = stringFormat(WORKORDER.FEEDER.INVALID, feederMappingObj.Qty.Name);
              remark = stringFormat('{0},{1}', remark, error);
              isDirty = true;
            } else if (item[feederMappingObj.Qty.Name] <= 0) {
              error = stringFormat(WORKORDER.FEEDER.INVALID, feederMappingObj.Qty.Name);
              remark = stringFormat('{0},{1}', remark, error);
              isDirty = true;
            }
          } catch (err) {
            error = stringFormat(WORKORDER.FEEDER.INVALID, feederMappingObj.Qty.Name);
            remark = stringFormat('{0},{1}', remark, error);
            isDirty = true;
          }
        }


        // Check Feeder Require Field
        if (!item[feederMappingObj.Feeder.Name]) {
          error = stringFormat(WORKORDER.FEEDER.REQUIRED, feederMappingObj.Feeder.Name);
          remark = stringFormat('{0},{1}', remark, error);
          isDirty = true;
        }
        if (!deleteAllandImport) {
          const objFeeder = _.find(vm.sourceData, (feederDet) => item[feederMappingObj.Feeder.Name] === feederDet.feederLocation);
          if (objFeeder) {
            if (item[feederMappingObj.Feeder.Name]) {
              error = stringFormat(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DUPLICATE_ENTRY.message, feederMappingObj.Feeder.Name);
              remark = stringFormat('{0},{1}', remark, error);
              isDirty = true;
            }
          }
        }
        const objFeederDetails = _.find(parts, (feederDet, partIndex) => (item[feederMappingObj.Feeder.Name] === feederDet[feederMappingObj.Feeder.Name]
          && partIndex !== index));

        if (objFeederDetails) {
          if (item[feederMappingObj.Feeder.Name]) {
            error = stringFormat(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DUPLICATE_ENTRY.message, feederMappingObj.Feeder.Name);
            remark = stringFormat('{0},{1}', remark, error);
            isDirty = true;
          }
        }

        //check PID not added
        if (!item[feederMappingObj.ProductionPN.Name] && !item[feederMappingObj.PID.Name]) {
          error = stringFormat(WORKORDER.FEEDER.REQUIRED, feederMappingObj.ProductionPN.Name + ' or ' + feederMappingObj.PID.Name);
          remark = stringFormat('{0},{1}', remark, error);
          isDirty = true;
        }

        if (item[feederMappingObj.ProductionPN.Name] && item[feederMappingObj.PID.Name]) {
          prodPNObj = _.find(vm.assemblyPartList, (det) => det.productionPN === item[feederMappingObj.ProductionPN.Name]);
          if (prodPNObj && item[feederMappingObj.PID.Name] !== prodPNObj.PIDCode) {
            error = stringFormat('{0} and {1} mismatch.', feederMappingObj.ProductionPN.Name, feederMappingObj.PID.Name);
            remark = stringFormat('{0},{1}', remark, error);
            partInvalid = true;
            isDirty = true;
          } else if (!prodPNObj) {
            error = stringFormat(WORKORDER.FEEDER.INVALID, 'Production PN');
            remark = stringFormat('{0},{1}', remark, error);
            partInvalid = true;
            isDirty = true;
          }
        }
        // Check  ProductionPN in excel
        if (item[feederMappingObj.ProductionPN.Name] && !partInvalid) {
          validatePartValue = item[feederMappingObj.ProductionPN.Name];
          validatePartFieldName = feederMappingObj.ProductionPN.Name;
          validatePartField = 'productionPN';
          validateCustPartField = 'custProductionPN';
          objLineMFGPN = _.filter(vm.assemblyPartList, (partDtl) => validatePartValue && ((partDtl[validatePartField] && validatePartValue.toString().toUpperCase() === partDtl[validatePartField].toUpperCase())
            || (partDtl[validateCustPartField] && validatePartValue.toString().toUpperCase() === partDtl[validateCustPartField].toUpperCase())));

          if (objLineMFGPN.length === 0) {
            if (validatePartValue) {
              error = stringFormat(WORKORDER.FEEDER.INVALID, validatePartFieldName);
              remark = stringFormat('{0},{1}', remark, error);
              isDirty = true;
            }
          }
        }


        // separate PID case maintained to validate PID
        if (item[feederMappingObj.PID.Name] && !partInvalid) {
          validatePartValue = item[feederMappingObj.PID.Name];
          validatePartFieldName = feederMappingObj.PID.Name;
          validatePartField = 'PIDCode';
          validateCustPartField = 'custPIDCode';

          objLineMFGPN = _.filter(vm.assemblyPartList, (part) => validatePartValue && ((part[validatePartField] && validatePartValue.toString().toUpperCase() === part[validatePartField].toUpperCase())
            || (part[validateCustPartField] && validatePartValue.toString().toUpperCase() === part[validateCustPartField].toUpperCase())));

          if (objLineMFGPN.length === 0) {
            if (validatePartValue) {
              error = stringFormat(WORKORDER.FEEDER.INVALID, validatePartFieldName);
              remark = stringFormat('{0},{1}', remark, error);
              isDirty = true;
            }
          }
        }
        if (objLineMFGPN && objLineMFGPN.length > 0) {
          item['mfgPNID'] = objLineMFGPN[0].mfgPNID;
          _.each(objLineMFGPN, (lineItem) => {
            // set invalid PID because it belongs to Supplies, Materials and Tools
            //if (lineItem.logicalGroupID > 0) {
            isSupplyMaterialTool = _.find(CORE.COMPONENT_LOGICALGROUPID, (item) => item === lineItem.logicalGroupID);
            if (isSupplyMaterialTool) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.PART_MUST_BE_OTHER_THAN_SMT);
              messageContent.message = stringFormat(messageContent.message, lineItem.logicalGroupName);
              error = messageContent.message;
              remark = stringFormat('{0},{1}', remark, error);
              isDirty = true;
            } else {
              if (!_.find(rfqLineItemList, (listItem) => listItem.LineID === lineItem.LineID && listItem.rfqLineItemsID === lineItem.rfqLineItemsID && listItem.mfgPNID === lineItem.mfgPNID)) {
                if (lineItem.partStatus === CORE.PartStatusList.InActiveInternal) {
                  vm.inactivePartList.push(lineItem.PIDCode);
                }
                // added for customer part case - vaibhav - 24/12/2019
                if (validatePartValue && lineItem[validateCustPartField] && (lineItem[validateCustPartField].toUpperCase() === validatePartValue.toString().toUpperCase())) {
                  item['mfgPNID'] = lineItem.custPNID;
                  const objCustPNAlreadyAdded = _.find(rfqLineItemList, (rfqItem) => rfqItem.custPNID === lineItem.custPNID && rfqItem.LineID === lineItem.LineID && rfqItem.rfqLineItemsID === lineItem.rfqLineItemsID);
                  if (!objCustPNAlreadyAdded) {
                    rfqLineItemList.push(lineItem);
                  }
                } else {
                  // if part belongs to CPN part but uploaded as individual part than make CPNID as null
                  lineDetails = angular.copy(lineItem);
                  lineDetails.custPNID = null;
                  lineDetails.custPIDCode = null;
                  lineDetails.custPN = null;
                  lineDetails.isCPN = null;
                  rfqLineItemList.push(lineDetails);
                }
              }
            }
          });
        }

        if (isDirty) {
          item.Remark = remark.substring(1);
        }
        if (isDirty) {
          if (!isFileImportInvalid) {
            isFileImportInvalid = true;
          }
        }
        errorFeeder.push(item);
      });
      if (isFileImportInvalid && errorFeeder.length > 0) {
        exportFilePopup(errorFeeder, 'errorFeeder.xls');
      }
      else {
        saveExportFeederPopup(parts, rfqLineItemList);
      }
    }

    //save details of pricing in database
    const saveExportFeederPopup = (parts, rfqLineItemList) => {
      // check if delete all and import than first delete all feeder detais
      if (deleteAllandImport && vm.sourceData.length > 0) {
        const objIDs = { id: _.map(vm.sourceData, 'id'), isImportAndDelete: true };
        vm.cgBusyLoading = WorkorderOperationEquipmentFeederFactory.deleteFeederDetails().query({ objIDs: objIDs }).$promise.then((data) => {
          if (data.data && data.data.TotalCount > 0) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_ALERT_MESSAGE);
            const alertModel = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(alertModel);
          }
          else {
            //BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            //vm.gridOptions.clearSelectedRows();
            saveFeederDetails(parts, rfqLineItemList);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        // else append feeder detais
        saveFeederDetails(parts, rfqLineItemList);
      }
    };

    // save feeder details
    const saveFeederDetails = (parts, rfqLineItemList) => {
      var feederListForEquipment = [];
      // var ismultipleline = false;
      var objFeeder = {};
      _.each(parts, (item) => {
        objFeeder = {};
        objFeeder.woID = vm.data.woID;
        objFeeder.opID = vm.data.opID;
        objFeeder.eqpID = vm.data.equipment.eqpID;
        objFeeder.woOpEqpID = vm.data.woOpEqpID;
        objFeeder.woOPID = vm.data.woOPID;
        objFeeder.mfgPNID = item['mfgPNID'];
        //objFeeder.rfqLineItemsID = item['rfqLineItemsID'];
        objFeeder.partID = vm.data.partID;
        objFeeder.feederLocation = item[feederMappingObj.Feeder.Name];
        objFeeder.feederDescription = item[feederMappingObj.Description.Name];
        objFeeder.supply = item[feederMappingObj.Supply.Name];
        objFeeder.usedon = item[feederMappingObj.UsedOn.Name];
        objFeeder.qty = item[feederMappingObj.Qty.Name];
        objFeeder.placementType = WORKORDER.FEEDER_PLACEMENT_TYPE[0].Key;
        // objFeeder.lineID = item[feederMappingObj.LineID.Name];
        // objFeeder.refDesig = item[feederMappingObj.RefDesg.Name];
        objFeeder.col1 = item[feederMappingObj.Col1.Name];
        objFeeder.col2 = item[feederMappingObj.Col2.Name];
        objFeeder.col3 = item[feederMappingObj.Col3.Name];
        objFeeder.col4 = item[feederMappingObj.Col4.Name];
        objFeeder.feederCount = vm.data.feederCount;
        // added condition for custom part
        objFeeder.feederLineItemList = _.filter(rfqLineItemList, (list) => {
          if (item[feederMappingObj.PID.Name] && list.custPIDCode && (list.custPIDCode.toUpperCase() === item[feederMappingObj.PID.Name].toString().toUpperCase())) {
            return (list.custPNID && (list.custPNID === objFeeder.mfgPNID));
          } if (item[feederMappingObj.ProductionPN.Name] && list.custProductionPN && (list.custProductionPN.toUpperCase() === item[feederMappingObj.ProductionPN.Name].toString().toUpperCase())) {
            return (list.custPNID && (list.custPNID === objFeeder.mfgPNID));
          } else {
            return (list.mfgPNID && (list.mfgPNID === objFeeder.mfgPNID));
          }
        });
        objFeeder.isApprovelineItems = _.uniqBy(objFeeder.feederLineItemList, 'LineID').length > 1 ? false : true;
        if (objFeeder.feederLineItemList[0]) {
          objFeeder.recommendedLineItem = objFeeder.feederLineItemList[0].LineID;
          objFeeder.systemrecommended = objFeeder.feederLineItemList[0].LineID;
        }
        objFeeder.isActive = true;
        feederListForEquipment.push(objFeeder);
      });
      // check for inactive part in list
      if (vm.inactivePartList && vm.inactivePartList.length > 0) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.ADD_INACTIVE_PART_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, vm.inactivePartList.join(','));
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {// yes part
            saveFeederDetailAfterConfirmation(feederListForEquipment);
          }
        }, () => { // no part
          vm.inactivePartList = [];
          return;
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        saveFeederDetailAfterConfirmation(feederListForEquipment);
      }
    };

    //save feeder detail after taking confirmation
    const saveFeederDetailAfterConfirmation = (feederListForEquipment) => {
      vm.cgBusyLoading = WorkorderOperationEquipmentFactory.saveImportFeeder().query({ objFeeder: feederListForEquipment }).$promise.then(() => {
        // incase of multiple line while upload than no need to close popup
        if (vm.data.isTraveler && !vm.ismultipleLine) {
          vm.cancel();
        }
        vm.inactivePartList = [];
        BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        vm.gridOptions.clearSelectedRows();
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //export document for feeder
    const exportFilePopup = (feederList, name) => {
      // remove mfgPNID from list
      var blob;
      var link;
      var url;
      feederList = _.map(feederList, (e) => _.omit(e, ['mfgPNID', 'rfqLineItemsID']));
      vm.cgBusyLoading = ImportExportFactory.importFile(feederList).then((res) => {
        if (res.data && feederList.length > 0) {
          blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
          if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, name);
          } else {
            link = document.createElement('a');
            if (link.download !== undefined) {
              url = URL.createObjectURL(blob);
              link.setAttribute('href', url);
              link.setAttribute('download', name);
              link.style = 'visibility:hidden';
              document.body.appendChild(link);
              $timeout(() => {
                link.click();
                document.body.removeChild(link);
              });
            }
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // Column Mapping Common function
    const columnMappingPopup = (json) => {
      var data = {
        feederHeaders: _feederHeaders,
        excelHeaders: json[0],
        notquote: true
      };
      DialogFactory.dialogService(
        WORKORDER.WORKORDER_IMPORT_FEEDER_COLUMN_MAPPING_CONTROLLER,
        WORKORDER.WORKORDER_IMPORT_FEEDER_COLUMN_MAPPING_VIEW,
        vm.event,
        data).then((result) => {
          json[0] = result.excelHeaders;
          generateModelPopup(json, result.model);
        }, (err) => BaseService.getErrorLog(err));
    };
    // alert for bad file
    const alertBadFile = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_UPLOAD_FAIL_TEXT);
      var model = {
        messageContent: messageContent,
        multiple: true
      };
      DialogFactory.messageAlertDialog(model);
    };

    // alert upload file failed
    const alertUploadFailed = (e) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DYNAMIC_ERROR);
      messageContent.message = stringFormat(messageContent.message, e.stack);
      const model = {
        messageContent: messageContent,
        multiple: true
      };
      DialogFactory.messageAlertDialog(model);
      // console.log(e, e.stack);
    };

    //alert large file upload
    const alertUploadLarge = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RFQ.BOM_UPLOAD_FAIL_SIZE_TEXT);
      var model = {
        messageContent: messageContent,
        multiple: true
      };
      DialogFactory.messageAlertDialog(model);
    };

    //import feeder file
    vm.ImportFeederFile = (equipment, event) => {
      deleteAllandImport = false;
      vm.event = event;
      if (vm.sourceData.length > 0) {
        //ask for confirmation if records already exists
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.IMPORT_WITH_EXISTING_CONFIRM);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.IMPORT_BUTTON_APPEND_TEXT
        };
        if (!_.find(vm.sourceData, (item) => item.isDisabledDelete)) {
          obj.canbtnText = CORE.MESSAGE_CONSTANT.IMPORT_BUTTON_DELETE_TEXT;
        }

        data = obj;
        DialogFactory.dialogService(
          WORKORDER.IMPORT_CONFIRMATION_CONTROLLER,
          WORKORDER.IMPORT_CONFIRMATION_VIEW,
          event,
          data).then((result) => {
            if (result) {
              // delete and import feeder details
              deleteAllandImport = true;
              angular.element('#fi-excel').trigger('click');
            } else {
              // append and import feeder details
              angular.element('#fi-excel').trigger('click');
            }
          }, () => { //cancel section
          });
      } else {
        // feeder details
        angular.element('#fi-excel').trigger('click');
      }
    };

    //er options
    vm.erOptions = {
      workstart: function () {
      },
      workend: function () {
      },
      sheet: function (json, sheetnames, select_sheet_cb) {
        columnMappingPopup(json, sheetnames, select_sheet_cb);
      },
      badfile: function () {
        alertBadFile();
      },
      pending: function () {
        // console.log('Pending');
      },
      failed: function (e) {
        alertUploadFailed(e);
      },
      large: function () {
        alertUploadLarge();
      }
    };

    vm.cancel = () => {
      const objMissingRecord = _.find(vm.sourceData, (data) => (!data.feederLocation || !data.PIDCode || !data.qty) || (!data.lineID && !data.refDesig));

      if (objMissingRecord) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        $mdDialog.cancel();
      }
    };

    // delete feeder details
    vm.deleteRecord = (feeder) => {
      // remove locally
      if (feeder && !feeder.id) {
        vm.sourceData = _.filter(vm.sourceData, (item) => item.index !== feeder.index);
        return false;
      }

      // remove from db
      let selectedIDs = [];
      if (feeder) {
        selectedIDs.push(feeder.id);
      } else {
        vm.selectedRows = _.filter(vm.selectedRowsList, (fedID) => fedID.id);
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((feederItem) => feederItem.id);
        }
      }
      if (selectedIDs && selectedIDs.length > 0) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, 'Feeder Detail(s)', selectedIDs.length);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        const objIDs = {
          id: selectedIDs
        };
        DialogFactory.messageConfirmDialog(obj).then((resposne) => {
          if (resposne) {
            vm.cgBusyLoading = WorkorderOperationEquipmentFeederFactory.deleteFeederDetails().query({ objIDs: objIDs }).$promise.then((data) => {
              if (data.data && data.data.TotalCount > 0) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_ALERT_MESSAGE);
                const alertModel = {
                  messageContent: messageContent,
                  multiple: true
                };
                DialogFactory.messageAlertDialog(alertModel);
              }
              else {
                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                vm.gridOptions.clearSelectedRows();
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => { // cancel section
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        // get selected record for multiple delete and non-added rows
        if (vm.selectedRowsList.length > 0) {
          _.each(vm.selectedRowsList, (item) => {
            _.remove(vm.sourceData, (sourceData) => item.index === sourceData.index);
          });
          //vm.totalSourceDataCount
          $scope.$applyAsync();
          return false;
        } else {
          //show validation message no data selected
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE_LABEL);
          messageContent.message = stringFormat(messageContent.message, 'Feeder Detail(s)');
          const alertModel = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(alertModel);
        }
      }
    };

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    };


    // get assembly part list
    vm.GetAssemblyPartList = () => {
      vm.assemblyPartList = [];
      const objs = {
        partID: vm.data.partID
      };
      vm.cgBusyLoading = WorkorderOperationEquipmentFactory.getAssemblyPartListByAssyID().query({ obj: objs }).$promise.then((res) => {
        if (res.data && res.data.length > 0) {
          vm.assemblyPartList = res.data;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    vm.GetAssemblyPartList();

    $scope.$on('AddNew', () => {
      $scope.addNewParentRow();
    });


    //Add new row in parent ui grid
    $scope.addNewParentRow = () => {
      var findObj;
      var obj = {
        feederLocation: null,
        productionPN: null,
        PIDCode: null,
        feederDescription: null,
        lineID: null,
        refDesig: null,
        isActive: true,
        qty: null,
        supply: null,
        usedon: null,
        col1: null,
        col2: null,
        col3: null,
        col4: null,
        placementType: WORKORDER.FEEDER_PLACEMENT_TYPE[0].value,
        feederStatus: 'Active',
        isApprovelineItems: true
      };
      var lastIndex = _.last(vm.sourceData);
      if (lastIndex.feederLocation) {
        findObj = _.maxBy(vm.sourceData, 'index');
        if (findObj) {
          obj.index = findObj.index + 1;
          vm.sourceData.push(obj);
        }
      }
      vm.totalSourceDataCount = vm.sourceData.length;
      vm.currentdata = vm.totalSourceDataCount;
      vm.gridOptions.gridApi.expandable.collapseAllRows();
      $timeout(() => {
        vm.resetSourceGrid();
        vm.gridOptions.gridApi.cellNav.scrollToFocus(vm.sourceData[vm.sourceData.length - 1], vm.sourceHeader[5]);
      }, _configTimeout);
    };
    $scope.splitPaneProperties = {};

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
        obj).then(() => { //Success Section
        }, () => { //Cancel Section
        });
    };

    vm.LineItemssourceHeader = [
      {
        field: 'Action',
        cellClass: 'layout-align-center-center',
        displayName: 'Action',
        width: '300',
        cellTemplate: '<div layout="row"><md-button class="md-small-btn md-raised md-primary md-button md-ink-ripple text-white" ng-click="grid.appScope.$parent.vm.selectLineItem(row.entity,true)">All Lines</md-button><md-button class="md-small-btn md-raised md-primary md-button md-ink-ripple text-white" ng-click="grid.appScope.$parent.vm.selectLineItem(row.entity,false)">Recommended Line</md-button></div>',
        enableFiltering: false,
        enableSorting: false,
        enableCellEdit: false,
        allowCellFocus: false,
        enableCellEditOnFocus: false,
        exporterSuppressExport: true,
        enableColumnMenus: false,
        enableRowSelection: false,
        enableFullRowSelection: false,
        multiSelect: false,
        maxWidth: '500'
      },
      {
        field: '#',
        width: '70',
        cellTemplate: '<div class="ui-grid-cell-contents" ><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
        enableFiltering: false,
        enableSorting: false,
        enableCellEdit: false
      },

      {
        field: 'feederLocation',
        displayName: feederMappingObj.Feeder.Name,
        width: 180,
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        enableCellEdit: false
      }, {
        field: 'PIDCode',
        displayName: 'PID',
        enableCellEdit: false,
        cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link \
                                        component-id="row.entity.mfgPNID" \
                                        label="grid.appScope.$parent.vm.LabelConstant.MFG.ID" \
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
                                        is-search-findchip="true" ></common-pid-code-label-link></div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.PID
      },
      {
        field: 'lineID',
        displayName: 'Line Item',
        width: 120,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
        validators: { required: false },
        enableCellEdit: false,
        enableCellEditOnFocus: false
      },
      {
        field: 'recommended',
        displayName: 'Recommended Line Item',
        width: 140,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}">{{COL_FIELD}}</div>',
        enableCellEdit: true,
        validators: { required: true },
        enableCellEditOnFocus: false
      },
      {
        field: 'lineItemSelectReason',
        displayName: 'Reason',
        width: 400,
        cellTemplate: '<div class="ui-grid-cell-contents" style="width:100%" ng-class="{invalid:grid.validate.isInvalid(row.entity,col.colDef)}" title="{{grid.validate.getTitleFormattedErrors(row.entity,col.colDef)}}">{{COL_FIELD}}</div>',
        enableCellEdit: true,
        enableCellEditOnFocus: false
      }
    ];
    vm.LineItenpagingInfo = {
      Page: CORE.UIGrid.Page(),
      SortColumns: [['id', 'ASC']],
      SearchColumns: [],
      pageName: CORE.PAGENAME_CONSTANT[16].PageName
    };
    vm.LineItemgridOptions = {
      showColumnFooter: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: true,
      filterOptions: vm.LineItenpagingInfo.SearchColumns,
      exporterMenuCsv: false,
      enableCellEdit: true,
      enableCellEditOnFocus: true,
      hideAddNew: true,
      isHideDelete: true
    };

    function loaddataLineItems() {
      var column = [];
      var sortBy = [];
      var clientHeightChild;
      var gridchildclientHeight;
      vm.LineItemsetScrollClass = 'gridScrollHeight_Feeder_LineItem';
      vm.ismultipleLines = true;
      vm.LineItemloadData = () => {
        var lineItemList = [];
        const filterLineItem = _.filter(vm.sourceData, (flist) => flist.isApprovelineItems === 0);
        _.each(filterLineItem, (filter) => {
          var lineItemsList = _.filter(vm.sourceLineItems, (items) => items.eqpFeederID === filter.id);
          var recomId = 0;
          _.each(lineItemsList, (refLine) => {
            var recommended = _.find(_.differenceWith(vm.sourceData, filterLineItem, _.isEqual), (ids) => ids.id !== refLine.eqpFeederID && ids.lineID && ids.lineID.toUpperCase().includes((refLine.lineID && refLine.lineID.toString().toUpperCase())));
            if (!recommended) {
              if (!recomId) {
                recomId = refLine.lineID;
              }
            }
          });
          const objline = {
            feederLocation: filter.feederLocation,
            lineID: _.map(_.uniqBy(lineItemsList, 'lineID'), 'lineID').join(),
            recommended: recomId ? recomId : lineItemsList[0].lineID,
            PIDCode: filter.PIDCode,
            rohsIcon: filter.rohsIcon,
            partID: filter.partID,
            rohsName: filter.rohsName,
            eqpFeederID: filter.id,
            mfgPNID: filter.mfgPNID,
            mfgPN: filter.mfgPN,
            isCustom: filter.isCustom,
            isDisabledDelete: true,
            systemrecommended: recomId ? recomId : lineItemsList[0].lineID
          };
          lineItemList.push(objline);
        });
        vm.LineItemssourceData = lineItemList;

        if (vm.LineItenpagingInfo.SortColumns.length > 0) {
          column = [];
          sortBy = [];
          _.each(vm.LineItenpagingInfo.SortColumns, (item) => {
            column.push(item[0]);
            sortBy.push(item[1]);
          });
          vm.LineItemssourceData = _.orderBy(vm.LineItemssourceData, column, sortBy);
        }
        if (vm.LineItenpagingInfo.SearchColumns.length > 0) {
          _.each(vm.LineItenpagingInfo.SearchColumns, (item) => {
            vm.LineItemssourceData = $filter('filter')(vm.LineItemssourceData, { [item.ColumnName]: item.SearchString });
          });
          if (vm.LineItemssourceData.length === 0) {
            vm.LineItememptyState = 0;
          }
        }
        else {
          vm.LineItememptyState = null;
        }
        vm.LineItemtotalSourceDataCount = vm.LineItemssourceData.length;
        if (!vm.LineItemgridOptions.enablePaging) {
          vm.LineItemcurrentdata = vm.LineItemssourceData ? vm.LineItemssourceData.length : null;
        }
        if (vm.LineItemtotalSourceDataCount === 0) {
          if (vm.LineItenpagingInfo.SearchColumns.length > 0) {
            vm.LineItememptyState = 0;
          }
          else {
            vm.LineItememptyState = null;
          }
        }
        else {
          vm.LineItememptyState = null;
        }
        vm.listLineIdsItems = [];
        $timeout(() => {
          vm.LineitemsresetSourceGrid();
          vm.resetPartition();
          if (!vm.isEditIntigrateLoad) {
            cellLineItemEdit();
          }
          $timeout(() => {
            // added condition for console error if no eleement found
            if (document.getElementById('feeder-location-child')) {
              clientHeightChild = document.getElementById('feeder-location-child').clientHeight;
              gridchildclientHeight = document.getElementsByClassName('gridScrollHeight_Feeder_LineItem');
              clientHeightChild = clientHeightChild - 98;
              if (gridchildclientHeight && gridchildclientHeight.length > 0) {
                gridchildclientHeight[0].setAttribute('style', 'height:' + clientHeightChild + 'px !important;');
              }
            }
          });
          if (!vm.LineItemgridOptions.enablePaging && vm.LineItemtotalSourceDataCount === vm.LineItemcurrentdata) {
            vm.LineItemgridOptions.columnDefs[vm.LineItemgridOptions.columnDefs.length - 1].visible = false;
            return vm.LineItemgridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
          }
        });
      };
      vm.LineItemloadData();
    }

    function checkLIneItemChangedValidation(rowEntity) {
      var objSelectedLineItem = _.find(vm.sourceLineItems, (lineitem) => lineitem.eqpFeederID === parseInt(rowEntity.eqpFeederID) && lineitem.lineID === parseFloat(rowEntity.recommended));
      return objSelectedLineItem;
    }
    //INvalidate cell
    function InvalidateCellForLineItem(rowEntity, index) {
      vm.LineItemgridOptions.gridApi.grid.validate.setInvalid(rowEntity, vm.LineItemssourceHeader[index]);
      vm.LineItemgridOptions.gridApi.cellNav.scrollToFocus(rowEntity, vm.LineItemssourceHeader[index]);
    }
    //validate cell
    function validateCellForLineItem(rowEntity, index) {
      vm.LineItemgridOptions.gridApi.grid.validate.setValid(rowEntity, vm.LineItemssourceHeader[index]);
    }
    //editable option for line items merged
    function cellLineItemEdit() {
      var messageContent;
      vm.isEditIntigrateLoad = true;
      vm.LineItemgridOptions.gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newvalue, oldvalue) => {
        var objSelectedLineItem;
        if (newvalue !== oldvalue) {
          if (colDef.field === 'recommended' && rowEntity.recommended !== rowEntity.systemrecommended) {
            objSelectedLineItem = checkLIneItemChangedValidation(rowEntity);
            if (!objSelectedLineItem) {
              InvalidateCellForLineItem(rowEntity, 5);
              rowEntity.isInvalid = true;
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INVALID_LINEID);
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(model);
            }
            else {
              if (!rowEntity.lineItemSelectReason) {
                rowEntity.isInvalid = true;
                InvalidateCellForLineItem(rowEntity, 6);
              }
              else {
                rowEntity.isInvalid = false;
                validateCellForLineItem(rowEntity, 6);
                validateCellForLineItem(rowEntity, 5);
              }
            }
          }
          if (colDef.field === 'lineItemSelectReason' && rowEntity.recommended !== rowEntity.systemrecommended) {
            objSelectedLineItem = checkLIneItemChangedValidation(rowEntity);
            if (!objSelectedLineItem) {
              rowEntity.isInvalid = true;
              InvalidateCellForLineItem(rowEntity, 5);
            }
            else if (objSelectedLineItem && !rowEntity.lineItemSelectReason) {
              rowEntity.isInvalid = true;
              InvalidateCellForLineItem(rowEntity, 6);
            }
            else if (!objSelectedLineItem && rowEntity.lineItemSelectReason) {
              validateCellForLineItem(rowEntity, 6);
            }
            else if (objSelectedLineItem && rowEntity.lineItemSelectReason) {
              rowEntity.isInvalid = false;
              validateCellForLineItem(rowEntity, 6);
              validateCellForLineItem(rowEntity, 5);
            }
          }
          if (rowEntity.recommended === rowEntity.systemrecommended) {
            rowEntity.isInvalid = false;
            validateCellForLineItem(rowEntity, 6);
            validateCellForLineItem(rowEntity, 5);
          }
        }
      });
    }
    vm.resetPartition = () => {
      $scope.splitPaneProperties.firstComponentSize = 450;
      $scope.splitPaneProperties.lastComponentSize = 300;
    };

    vm.selectLineItem = (row, isAll) => {
      var objItem;
      var filterLines = [];
      if (!isAll && row.isInvalid) {
        return;
      }
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.FEEDER_STATUS_CHANGE);
      messageContent.message = stringFormat(messageContent.message, isAll ? 'All line items' : 'Recommended line item');
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          filterLines = [];
          if (!isAll) {
            filterLines = _.filter(vm.sourceLineItems, (lineitem) => lineitem.eqpFeederID === row.eqpFeederID);
            filterLines = _.filter(filterLines, (fline) => fline.lineID !== parseFloat(row.recommended));
          }
          objItem = {
            id: row.eqpFeederID,
            recommendedLineItem: parseFloat(row.recommended),
            isApprovelineItems: true,
            feederlineItems: [],
            systemrecommended: parseFloat(row.systemrecommended),
            lineItemSelectReason: row.lineItemSelectReason
          };
          objItem.feederlineItems = filterLines;
          const index = _.indexOf(vm.LineItemssourceData, row);
          vm.LineItemssourceData.splice(index, 1);
          updatefeederlocation(objItem, vm.LineItemssourceData.length > 0 ? false : true);
        }
      }, () => { // Cancel Section
      }).catch((error) => BaseService.getErrorLog(error));
    };
    // check if line have multiple line items

    function updatefeederlocation(LineItemList, islast) {
      var gridclientHeight;
      vm.cgBusyLoading = WorkorderOperationEquipmentFeederFactory.updateFeederMergedDetails().query({ objLineitem: LineItemList }).$promise.then(() => {
        if (islast) {
          vm.ismultipleLines = false;
          //$scope.splitPaneProperties.firstComponentSize = 320;
          $scope.splitPaneProperties.lastComponentSize = 0;
          gridclientHeight = document.getElementsByClassName('gridScrollHeight_Feeder');
          if (gridclientHeight && gridclientHeight.length > 0) {
            gridclientHeight[0].setAttribute('style', 'height:calc(100vh - 321px) !important;');
          }
        }
        BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
        vm.gridOptions.clearSelectedRows();
      }).catch((error) => BaseService.getErrorLog(error));
    }

    //apply all details
    vm.applyAll = (applyAll) => {
      if (applyAll) {
        _.map(vm.sourceData, selectFeeder);
      } else {
        _.map(vm.sourceData, unselectFeeder);
      }
    };

    const selectFeeder = (row) => {
      row.isRecordSelectedForRemove = row.isDisabledDelete ? false : true;
      if (row.isRecordSelectedForRemove) {
        vm.gridOptions.gridApi.selection.selectRow(row);
      }
    };

    const unselectFeeder = (row) => {
      row.isRecordSelectedForRemove = false;
      vm.gridOptions.clearSelectedRows();
    };

    vm.setFeederLocationRemove = (row) => {
      var totalItem = _.filter(vm.sourceData, (data) => !data.isDisabledDelete);
      var selectItem = _.filter(vm.sourceData, (data) => data.isRecordSelectedForRemove === true);
      if (row.isRecordSelectedForRemove) {
        vm.gridOptions.gridApi.selection.selectRow(row);
      } else {
        vm.gridOptions.gridApi.selection.unSelectRow(row);
      }
      if (totalItem.length === selectItem.length) {
        vm.Apply = true;
      } else {
        vm.Apply = false;
      }
    };


    //update status active or inactive
    vm.changeFeederStatus = (row, ev) => {
      var objFeeder;
      var feederList;
      var list;
      if (row.isActive) {
        const obj = {
          objdata: row
        };
        DialogFactory.dialogService(
          WORKORDER.WORKORDER_STATUS_FEEDER_DETAILS_CONTROLLER,
          WORKORDER.WORKORDER_STATUS_FEEDER_DETAILS_VIEW,
          ev,
          obj).then(() => { // Success Section
          }, (data) => {
            if (data && !data.isActive) {
              objFeeder = angular.copy(row);
              feederList = [];
              list = _.filter(vm.sourceLineItems, (source) => source.eqpFeederID === objFeeder.id);
              _.each(list, (feederLine) => {
                const obj = {
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
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.FEEDER_STATUS_INACTIVE_ACTIVE);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
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
        }, () => { // Cancel Section
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    getAccessLevelForDeleteAlias();
    //  check and get accesslevel for delete customer/mfg/supplier alias : DELETEROLEACCESS key used right now
    function getAccessLevelForDeleteAlias() {
      var currentLoginUserRole;
      vm.cgBusyLoading = MasterFactory.getAcessLeval().query({ access: CORE.ROLE_ACCESS.FeederStatusAccess }).$promise.then((response) => {
        if (response && response.data) {
          vm.isAllowUpdateStatus = false;
          currentLoginUserRole = _.find(loginUserDet.roles, (item) => item.id === loginUserDet.defaultLoginRoleID);
          if (currentLoginUserRole && currentLoginUserRole.accessLevel <= response.data.accessLevel) {
            vm.isAllowUpdateStatus = true;
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }
    //dynamic height increase for feeder location
    $scope.$watch('splitPaneProperties.firstComponentSize', () => {
      var gridclientHeight;
      var gridchildclientHeight;
      var clientHeight;
      var clientHeightChild;
      if (vm.ismultipleLines) {
        gridclientHeight = document.getElementsByClassName('gridScrollHeight_Feeder');
        clientHeight = $scope.splitPaneProperties.firstComponentSize - 48;
        if (gridclientHeight && gridclientHeight.length > 0) {
          gridclientHeight[0].setAttribute('style', 'height:' + clientHeight + 'px !important;');
        }
        //var clientHeightChild = document.getElementById('feeder-location-child').clientHeight;
        gridchildclientHeight = document.getElementsByClassName('gridScrollHeight_Feeder_LineItem');
        clientHeightChild = $scope.splitPaneProperties.lastComponentSize - 98;
        if (gridchildclientHeight && gridchildclientHeight.length > 0) {
          gridchildclientHeight[0].setAttribute('style', 'height:' + clientHeightChild + 'px !important;');
        }
      }
    });

    // View Quantity confirmation details for status change
    vm.viewQtyConfirmationlist = (row, $event) => {
      var data = {
        confirmationType: CORE.woQtyApprovalConfirmationTypes.ReasonChangeRequest,
        refTablename: CORE.AllEntityIDS.Workorder_FeederDetail.Name,
        refId: row.entity.id,
        woNumber: vm.data.woNumber,
        woVersion: vm.data.woVersion,
        PIDCode: row.entity.PIDCode,
        nickName: row.entity.nickName,
        rohsIcon: row.entity.rohsIcon,
        rohsName: row.entity.rohsName,
        partID: row.entity.mfgPNID,
        woID: row.entity.woID,
        feederLocation: row.entity.feederLocation
      };

      DialogFactory.dialogService(
        CORE.QTY_CONFIRMATION_LIST.CONTROLLER,
        CORE.QTY_CONFIRMATION_LIST.VIEW,
        $event,
        data).then(() => { // Success Section
        }, () => { // Cancel Section
        });
    };

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


    function notificationReceiveListener(message) { $timeout(notificationReceive(message)); }

    function notificationReceive(message) {
      switch (message.event) {
        case CORE.NOTIFICATION_MESSAGETYPE.EQUIPMENT_ONLINE.TYPE:
        case CORE.NOTIFICATION_MESSAGETYPE.EQUIPMENT_OFFLINE.TYPE: {
          if (vm.data.woOpEqpID === message.data.operationObj.woOpEqpID) {
            vm.data.equipment.isOnline = message.data.operationObj.isOnline;
          }
          break;
        }
      }
    }


    // on disconnect socket.io
    socketConnectionService.on('disconnect', () => {
      removeSocketListener();
    });

    $scope.$on('$destroy', () => {
      // Remove socket listeners
      removeSocketListener();
    });
    // [E] Socket Listeners
  }
})();

