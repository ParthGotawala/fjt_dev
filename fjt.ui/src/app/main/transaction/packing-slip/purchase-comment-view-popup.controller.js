(function () {
  'use strict';
  angular
    .module('app.transaction.packingSlip')
    .controller('PurchaseCommentViewPopupController', PurchaseCommentViewPopupController);
  /** @ngInject */
  function PurchaseCommentViewPopupController($state, $mdDialog, $timeout, DialogFactory, CORE, USER, data, BaseService, PackingSlipFactory) {
    const vm = this;
    vm.DateFormatArray = _dateDisplayFormat;
    vm.rowData = data;
    vm.labelConstant = CORE.LabelConstant;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.isHideDelete = true;

    vm.sourceHeader = [
      {
        field: '#',
        width: '60',
        cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
        enableFiltering: false,
        enableSorting: false
      },
      {
        field: 'instruction',
        width: 480,
        displayName: 'Comment',
        enableFiltering: true,
        cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
          '<span class="cursor-pointer bom-header-wrap max-width-420">{{ COL_FIELD }}</span> &nbsp;' +
          '<button class="md-primary grid-button md-icon-button" ng-click="grid.appScope.$parent.vm.showDescription(row.entity)">' +
          '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
          '<md-tooltip>View</md-tooltip>' +
          '</button>' +
          '</div>'
      },
      {
        field: 'updatedAtValue',
        displayName: vm.labelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false
      }, {
        field: 'updatedbyValue',
        displayName: vm.labelConstant.COMMON.GRIDHEADER_MODYFYBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }, {
        field: 'updatedbyRoleValue',
        displayName: vm.labelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }, {
        field: 'createdbyRoleValue',
        displayName: vm.labelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }, {
        field: 'createdbyValue',
        displayName: vm.labelConstant.COMMON.GRIDHEADER_CREATEDBY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }, {
        field: 'createdAtValue',
        displayName: vm.labelConstant.COMMON.GRIDHEADER_CREATED_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false
      }
    ];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['instruction', 'ASC']],
        SearchColumns: [],
        partID: vm.rowData.partID,
        lineId: vm.rowData.id
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
      exporterCsvFilename: 'Purchasing and Incoming Inspection Comments.csv'
    };

    vm.loadData = () => {
      vm.cgBusyLoading = PackingSlipFactory.getPurchaseCommentList().query(vm.pagingInfo).$promise.then((res) => {
        if (res.data && res.data.comments) {
          vm.sourceData = res.data.comments;
          vm.totalSourceDataCount = res.data.comments.length;
          if (!vm.gridOptions.enablePaging) {
            vm.currentdata = vm.sourceData.length;
            vm.gridOptions.gridApi.infiniteScroll.resetScroll();
          }
          vm.gridOptions.clearSelectedRows();
          if (vm.totalSourceDataCount === 0) {
            if (vm.pagingInfo.SearchColumns.length > 0) {
              vm.isNoDataFound = false;
              vm.emptyState = 0;
            }
            else {
              if (vm.isNoDatainFilter) {
                vm.isNoDataFound = false;
                vm.emptyState = 0;
              } else {
                vm.isNoDataFound = true;
                vm.emptyState = null;
              }
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
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    //go to manage part number
    vm.goToAssyMaster = () => {
        BaseService.goToComponentDetailTab(null, vm.rowData.partID);
      return false;
    };
    //go to assy list
    vm.goToAssyList = () => {
        BaseService.goToPartList();
      return false;
    };
    //redirect to customer list
    vm.goToCustomerList = () => {
      BaseService.goToCustomerList();
      return false;
    };
    // go to customer
    vm.goToCustomer = () => {
      BaseService.goToCustomer(vm.rowData.mfgcodeID);
      return false;
    };

    vm.headerdata = [];
    vm.headerdata.push({
      label: vm.labelConstant.MFG.MFG,
      value: vm.rowData.mfgName,
      displayOrder: 1,
      labelLinkFn: vm.goToCustomerList,
      valueLinkFn: vm.goToCustomer,
      valueLinkFnParams: vm.rowData.mfgcodeID
    }, {
      label: vm.labelConstant.MFG.MFGPN,
      value: vm.rowData.mfgPN,
      displayOrder: 2,
      labelLinkFn: vm.goToAssyList,
      valueLinkFn: vm.goToAssyMaster,
      valueLinkFnParams: vm.rowData.partID,
      isCopy: true,
      isAssy: true,
      imgParms: {
        imgPath: vm.rohsImagePath + vm.rowData.rohsIcon,
        imgDetail: vm.rowData.rohsName
      }
    }
    );

    vm.showDescription = (object) => {
      const obj = {
        title: 'Comment',
        description: object.instruction
      };
      const data = obj;
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        null,
        data).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
