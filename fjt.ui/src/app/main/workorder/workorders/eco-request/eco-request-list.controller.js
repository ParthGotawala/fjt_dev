(function () {
  'use strict';

  angular
    .module('app.admin.eco')
    .controller('ECORequestListController', ECORequestListController);

  /** @ngInject */
  function ECORequestListController($state, $q, $stateParams, $mdDialog, $scope, WORKORDER, CORE, USER, ECORequestFactory, BaseService, $timeout
    , DialogFactory, WorkorderFactory) {  // eslint-disable-line func-names
    const vm = this;
    vm.requestType = WORKORDER.ECO_REQUEST_TYPE;
    vm.woID = $stateParams.woID;
    vm.partID = $stateParams.partID;
    vm.LabelConstant = CORE.LabelConstant;
    vm.isUpdatable = true;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.WOAllLabelConstant = CORE.LabelConstant.Workorder;
    vm.assemblyAllLabelConstant = CORE.LabelConstant.Assembly;
    vm.ECOEmptyMesssage = WORKORDER.WORKORDER_EMPTYSTATE.ECO_REQUEST_LIST;
    vm.DFMEmptyMesssage = WORKORDER.WORKORDER_EMPTYSTATE.DFM_REQUEST_LIST;
    vm.ecostatusheaderdropdown = CORE.ECORequestStatusGridHeaderDropdown;
    vm.ecofinalstatusheaderdropdown = CORE.ECORequestFinalStatusGridHeaderDropdown;
    vm.dfmfinalstatusheaderdropdown = CORE.DFMRequestFinalStatusGridHeaderDropdown;
    vm.defaultDateFormat = _dateDisplayFormat;
    if ($stateParams.requestType) {
      switch ($stateParams.requestType) {
        case vm.requestType.ECO.Name:
          vm.ecorequestType = vm.requestType.ECO.Value;
          break;
        case vm.requestType.DFM.Name:
          vm.ecorequestType = vm.requestType.DFM.Value;
          break;
      }
    }

    let getWorkorderDetails = () => {
      return WorkorderFactory.workorder().query({ id: vm.woID }).$promise.then((response) => {
        if (response && response.data) {
          return response.data;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    let getEcoRequestHeaderDetail = () => {
      return ECORequestFactory.getECOHeaderDetail().query({ partID: vm.partID, requestType: vm.ecorequestType }).$promise.then((response) => {
        if (response.data) {
          return response.data;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };
    var promises = [getEcoRequestHeaderDetail()];
    if (vm.woID)
      promises.push(getWorkorderDetails());
    vm.cgBusyLoading = $q.all(promises).then((responses) => {
      vm.headerdata = [];
      let assyDetail = responses && responses.length > 0 ? responses[0] : null;
      let WoDetail = responses && responses.length > 1 ? _.first(responses[1]) : null;
      if (assyDetail) {
        vm.headerdata.push({
          label: vm.assemblyAllLabelConstant.PIDCode,
          value: angular.copy(assyDetail.PIDCode),
          displayOrder: 3,
          labelLinkFn: vm.goToAssemblyList,
          valueLinkFn: vm.goToAssemblyDetails,
          valueLinkFnParams: { partID: assyDetail.id },
          isCopy: true,
          isCopyAheadLabel: false,
          isAssy: true,
          imgParms: {
            imgPath: vm.rohsImagePath + assyDetail.rfq_rohsmst.rohsIcon,
            imgDetail: assyDetail.rfq_rohsmst.name
          }
        }, {
          label: vm.assemblyAllLabelConstant.MFGPN,
          value: angular.copy(assyDetail.mfgPN),
          displayOrder: 3,
          labelLinkFn: vm.goToAssemblyList,
          valueLinkFn: vm.goToAssemblyDetails,
          valueLinkFnParams: { partID: assyDetail.id },
          isCopy: true,
          isCopyAheadLabel: false,
          isAssy: true,
          imgParms: {
            imgPath: vm.rohsImagePath + assyDetail.rfq_rohsmst.rohsIcon,
            imgDetail: assyDetail.rfq_rohsmst.name
          }
        });
      }

      if (WoDetail) {
        vm.isWoInSpecificStatusNotAllowedToChange = (WoDetail.woStatus === CORE.WOSTATUS.TERMINATED || WoDetail.woStatus === CORE.WOSTATUS.COMPLETED || WoDetail.woStatus === CORE.WOSTATUS.VOID) ? true : false;
        vm.headerdata.push({
          label: vm.WOAllLabelConstant.WO,
          value: angular.copy(WoDetail.woNumber),
          labelLinkFn: vm.gotoWorkorderlist,
          valueLinkFn: vm.goToWorkorderDetails,
          displayOrder: 1
        }, {
          label: vm.WOAllLabelConstant.Version,
          value: angular.copy(WoDetail.woVersion),
          displayOrder: 2
        });
      }
    })
    /*
    var searchColumn = {
        ColumnDataType: 'Number',
        ColumnName: 'woID',
        SearchString: vm.woID
    }

    //vm.dateFormat = _dateDisplayFormat;
    vm.sourceHeader = [
        {
            field: 'Action',
            cellClass: 'gridCellColor',
            displayName: 'Action',
            width: '120',
            cellTemplate: `<grid-action-view grid="grid" row="row"></grid-action-view>`,
            enableFiltering: false,
            enableSorting: false,
            exporterSuppressExport: true,
            pinnedLeft: true
        },
        {
            field: '#',
            width: '70',
            cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
            enableFiltering: false,
            enableSorting: false
        }, {
            field: 'ecoNumber',
            displayName: vm.pagingInfo.requestType == vm.requestType.ECO.Value ? vm.LabelConstant.Workorder.ECO : vm.LabelConstant.Workorder.DFM,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: 150
        }, {
            field: 'custECONumberConvertedValue',
            displayName: 'Request From',
            //cellTemplate: '<div class="ui-grid-cell-contents text-left">{{row.entity.custECONumber ? "CUSTOMER" : "FCA" }}</div>',
            width: 150,
            enableFiltering: false,
            enableSorting: false
        },
        {
            field: 'fullName',
            displayName: 'Initiate By',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{row.entity.fullName}}</div>',
        },
        {
            field: 'initiateDate',
            displayName: 'Date Initiated',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{row.entity.initiateDate | date:grid.appScope.$parent.vm.defaultDateFormat}}</div>',
            enableFiltering: false,
            type: 'date',
        }
    ];
    if (vm.pagingInfo && vm.requestType && vm.pagingInfo.requestType == vm.requestType.ECO.Value) {
        vm.sourceHeader.splice(5, 0, {
            field: 'fromPIDCode',
            displayName: 'From ' + vm.LabelConstant.Assembly.ID,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                            <a class="cm-text-decoration underline"\
                                ng-click="grid.appScope.$parent.vm.goToComponentDetail(\'mfg\',row.entity.fromPartID);"\
                                tabindex="-1">{{row.entity.fromPIDCode}}</a>\
                             <span ng-if="row.entity.toPartRoHSIcon">\
                                <img class="rohs-bom-image" ng-src="{{grid.appScope.$parent.vm.rohsImagePath}}{{row.entity.toPartRoHSIcon}}">\
                                    <md-tooltip>{{row.entity.toPartRoHSName}}</md-tooltip>\
                             </span>\
                             <copy-text ng-if="row.entity.toPIDCode" label="grid.appScope.$parent.vm.LabelConstant.Assembly.ID" text="row.entity.fromPIDCode">\
                             </copy-text>\
                            </div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
        }, {
            field: 'toPIDCode',
            displayName: 'To ' + vm.LabelConstant.Assembly.ID,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                            <a class="cm-text-decoration underline"\
                                ng-click="grid.appScope.$parent.vm.goToComponentDetail(\'mfg\',row.entity.toPartID);"\
                                tabindex="-1">{{row.entity.toPIDCode}}</a>\
                             <span ng-if="row.entity.toPartRoHSIcon">\
                                <img class="rohs-bom-image" ng-src="{{grid.appScope.$parent.vm.rohsImagePath}}{{row.entity.toPartRoHSIcon}}">\
                                    <md-tooltip>{{row.entity.toPartRoHSName}}</md-tooltip>\
                             </span>\
                             <copy-text ng-if="row.entity.toPIDCode" label="grid.appScope.$parent.vm.LabelConstant.Assembly.ID" text="row.entity.toPIDCode">\
                             </copy-text>\
                             </div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
        });
        vm.sourceHeader.push({
            field: 'finalstatusConvertedValue',
            displayName: 'Final Status',
            width: 150,
            cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
                    + '<span class="label-box" \
                        ng-class="{\'label-success\':COL_FIELD == grid.appScope.$parent.vm.ecofinalstatusheaderdropdown[2].value, \
                            \'label-warning\':COL_FIELD == grid.appScope.$parent.vm.ecofinalstatusheaderdropdown[1].value, \
                            \'label-danger\':COL_FIELD == grid.appScope.$parent.vm.ecofinalstatusheaderdropdown[3].value}"> \
                           {{ COL_FIELD }}'
                    + '</span>'
                    + '</div>',
            filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
            filter: {
                term: null,
                options: vm.ecofinalstatusheaderdropdown
            },
        }, {
            field: 'statusConvertedValue',
            displayName: 'Status',
            cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
                + '<span class="label-box" \
                        ng-class="{\'label-success\':COL_FIELD == grid.appScope.$parent.vm.ecostatusheaderdropdown[1].value, \
                            \'label-warning\':COL_FIELD == grid.appScope.$parent.vm.ecostatusheaderdropdown[2].value}"> \
                           {{ COL_FIELD }}'
                + '</span>'
                + '</div>',
            filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
            filter: {
                term: null,
                options: vm.ecostatusheaderdropdown
            },
            ColumnDataType: 'StringEquals',
        })
    }
    else if (vm.pagingInfo && vm.requestType && vm.pagingInfo.requestType == vm.requestType.DFM.Value) {
        vm.sourceHeader.splice(5, 0, {
            field: 'toPIDCode',
            displayName: vm.LabelConstant.Assembly.ID,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                            <a class="cm-text-decoration underline"\
                                ng-click="grid.appScope.$parent.vm.goToComponentDetail(\'mfg\',row.entity.toPartID);"\
                                tabindex="-1">{{row.entity.toPIDCode}}</a>\
                             <span ng-if="row.entity.toPartRoHSIcon">\
                                <img class="rohs-bom-image" ng-src="{{grid.appScope.$parent.vm.rohsImagePath}}{{row.entity.toPartRoHSIcon}}">\
                                    <md-tooltip>{{row.entity.toPartRoHSName}}</md-tooltip>\
                             </span>\
                             <copy-text ng-if="row.entity.toPIDCode" label="grid.appScope.$parent.vm.LabelConstant.Assembly.ID" text="row.entity.toPIDCode">\
                             </copy-text>\
                            </div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
        }, {
            field: 'toMFGPN',
            displayName: vm.LabelConstant.Assembly.MFGPN,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                            <a class="cm-text-decoration underline"\
                                ng-click="grid.appScope.$parent.vm.goToComponentDetail(\'mfg\',row.entity.toPartID);"\
                                tabindex="-1">{{row.entity.toMFGPN}}</a>\
                             <span ng-if="row.entity.toPartRoHSIcon">\
                                <img class="rohs-bom-image" ng-src="{{grid.appScope.$parent.vm.rohsImagePath}}{{row.entity.toPartRoHSIcon}}">\
                                    <md-tooltip>{{row.entity.toPartRoHSName}}</md-tooltip>\
                             </span>\
                             <copy-text ng-if="row.entity.toMFGPN" label="grid.appScope.$parent.vm.LabelConstant.Assembly.MFGPN" text="row.entity.toMFGPN">\
                             </copy-text>\</div>',
            width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
        }, {
            field: 'toNickName',
            displayName: vm.LabelConstant.Assembly.NickName,
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            width: 180,
        });
        vm.sourceHeader.push({
            field: 'finalstatusConvertedValue',
            displayName: 'Final Status',
            width: 180,
            cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
                    + '<span class="label-box" \
                        ng-class="{\'label-success\':COL_FIELD == grid.appScope.$parent.vm.dfmfinalstatusheaderdropdown[2].value, \
                            \'label-warning\':COL_FIELD == grid.appScope.$parent.vm.dfmfinalstatusheaderdropdown[1].value, \
                            \'label-danger\':COL_FIELD == grid.appScope.$parent.vm.dfmfinalstatusheaderdropdown[3].value}"> \
                           {{ COL_FIELD }}'
                    + '</span>'
                    + '</div>',
            filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
            filter: {
                term: null,
                options: vm.dfmfinalstatusheaderdropdown
            },
        }, {
            field: 'statusConvertedValue',
            displayName: 'Status',
            cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
                + '<span class="label-box" \
                        ng-class="{\'label-success\':COL_FIELD == grid.appScope.$parent.vm.ecostatusheaderdropdown[1].value, \
                            \'label-warning\':COL_FIELD == grid.appScope.$parent.vm.ecostatusheaderdropdown[2].value}"> \
                           {{ COL_FIELD }}'
                + '</span>'
                + '</div>',
            filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
            filter: {
                term: null,
                options: vm.ecostatusheaderdropdown
            },
            ColumnDataType: 'StringEquals',
        })
    }
   
    vm.gridOptions = {
        showColumnFooter: false,
        enableRowHeaderSelection: true,
        enableFullRowSelection: false,
        enableRowSelection: true,
        multiSelect: true,
        filterOptions: vm.pagingInfo.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: vm.pagingInfo.requestType == vm.requestType.DFM.Value ? 'DFM Request.csv' : 'ECO Request.csv',
    };

    /* retrieve Users list*/
    vm.loadData = () => {
      let woIDFilter = _.find(vm.pagingInfo.SearchColumns, (col) => { return col.ColumnName == "woID" });
      if (!woIDFilter)
        vm.pagingInfo.SearchColumns.push(searchColumn);

      vm.cgBusyLoading = ECORequestFactory.retriveECORequestsList().query(vm.pagingInfo).$promise.then((response) => {
        if (response && response.data) {
          vm.sourceData = response.data.ecoRequests;
          vm.totalSourceDataCount = response.data.Count;
          _.each(vm.sourceData, (item) => {
            item.initiateDate = BaseService.getUIFormatedDate(item.initiateDate, vm.defaultDateFormat);
          })
          if (!vm.gridOptions.enablePaging) {
            vm.currentdata = vm.sourceData.length;
            vm.gridOptions.gridApi.infiniteScroll.resetScroll();
          }
          vm.gridOptions.clearSelectedRows();
          if (vm.totalSourceDataCount == 0) {
            if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
              let filterCategoryType = _.find(vm.pagingInfo.SearchColumns, (col) => { return col.ColumnName == "woID" });
              if (vm.pagingInfo.SearchColumns.length == 1 && filterCategoryType) {
                vm.isNoDataFound = true;
                vm.emptyState = null;
              }
              else if (vm.pagingInfo.SearchColumns.length > 1 || !_.isEmpty(vm.SearchMode)) {
                vm.isNoDataFound = false;
                vm.emptyState = 0;
              }
              else {
                vm.isNoDataFound = true;
                vm.emptyState = null;
              }
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
            if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount == vm.currentdata) {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          });
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    /* load more data on mouse scroll */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.pagingInfo.SearchColumns.push(searchColumn);
      vm.cgBusyLoading = ECORequestFactory.retriveECORequestsList().query(vm.pagingInfo).$promise.then((response) => {
        if (response && response.data) {
          _.each(response.data.ecoRequests, (item) => {
            item.initiateDate = BaseService.getUIFormatedDate(item.initiateDate, vm.defaultDateFormat);
          })
          vm.sourceData = vm.sourceData.concat(response.data.ecoRequests);
          vm.currentdata = vm.sourceData.length;
          vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();

          $timeout(() => {
            vm.resetSourceGrid();
            return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount != vm.currentdata ? true : false);
          });
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    vm.fab = {
      Status: false,
    };

    /* delete ECO category Type list*/
    vm.deleteRecord = (ecoRequest) => {
      let ecoNumbers = null;
      let selectedIDs = [];
      if (ecoRequest) {
        selectedIDs.push(ecoRequest.ecoReqID);
        ecoNumbers = ecoRequest.ecoNumber;
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((item) => item.ecoReqID);
          ecoNumbers = vm.selectedRows.map((item) => item.ecoNumber);
        }
      }

      if (selectedIDs) {
        let obj = {
          title: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM, vm.pagingInfo.requestType == vm.requestType.ECO.Value ? "ECO request" : "DFM request"),
          textContent: stringFormat(CORE.MESSAGE_CONSTANT.DELETE_CONFIRM_MESSAGE, selectedIDs.length, vm.pagingInfo.requestType == vm.requestType.ECO.Value ? "ECO request" : "DFM request"),
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.confirmDiolog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = ECORequestFactory.deleteECORequest().delete({
              ecoReqID: selectedIDs,
              woNumber: vm.workOrder.woNumber,
              ecoNumber: ecoNumbers.toString(),
              requestType: vm.pagingInfo.requestType
            }).$promise.then(() => {
              BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
              vm.gridOptions.clearSelectedRows();
            }).catch((error) => {
              return BaseService.getErrorLog(error);
            });
          }
        }, (cancel) => {
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
    };

    vm.goToComponentDetail = (mfgType, partId) => {
      if (mfgType) {
        mfgType = mfgType.toLowerCase();
      }
      BaseService.goToComponentDetailTab(mfgType, partId, USER.PartMasterTabs.Detail.Name);
    };

    /* ECO Category TYPE VALUE*/
    vm.updateRecord = (row, ev) => {
      if (vm.ecorequestType == vm.requestType.ECO.Value) {
        //$state.go(WORKORDER.ECO_REQUEST_DETAIL_STATE, { requestType: WORKORDER.ECO_REQUEST_TYPE.ECO.Name, tabName: 'detail', woID: vm.woID, ecoReqID: row.entity.ecoReqID });
        $state.go(WORKORDER.ECO_REQUEST_DETAIL_STATE, { woID: vm.woID, ecoReqID: row.entity.ecoReqID });
      } else if (vm.ecorequestType == vm.requestType.DFM.Value) {
        $state.go(WORKORDER.DFM_REQUEST_DETAIL_STATE, { woID: vm.woID, ecoReqID: row.entity.ecoReqID });
      }
    };

    /* delete multiple data called from directive of ui-grid*/
    vm.deleteMultipleData = () => {
      vm.deleteRecord();
    }

    vm.addEcoRequestData = (partID, woID) => {
      // stop access if wo status in TERMINATED or COMPLETED or VOID
      if (vm.isWoInSpecificStatusNotAllowedToChange) {
        return;
      }
      if (vm.ecorequestType == vm.requestType.ECO.Value) {
        //$state.go(WORKORDER.ECO_REQUEST_DETAIL_STATE, { requestType: WORKORDER.ECO_REQUEST_TYPE.ECO.Name, tabName: 'detail', woID: vm.woID });
        $state.go(WORKORDER.ECO_REQUEST_DETAIL_STATE, { partID: partID, woID: vm.woID });
      } else if (vm.ecorequestType == vm.requestType.DFM.Value) {
        $state.go(WORKORDER.DFM_REQUEST_DETAIL_STATE, { partID: partID, woID: vm.woID });
      }
    }

    vm.goToAssemblyList = () => {
        BaseService.goToPartList();
      return false;
    }
    vm.goToAssemblyDetails = (data) => {
        BaseService.goToComponentDetailTab(null, data.partID);
      return false;
    }
    vm.gotoWorkorderlist = () => {
      BaseService.goToWorkorderList();
    }
    vm.goToWorkorderDetails = () => {
      BaseService.goToWorkorderDetails(vm.woID);
      return false;
    }
    $scope.$on('$destroy', function () {

      $mdDialog.hide(false, {
        closeAll: true
      });
    });
  }

})();
