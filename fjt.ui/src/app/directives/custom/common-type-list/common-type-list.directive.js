(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('commonTypeList', commonTypeList);

  /** @ngInject */
  function commonTypeList(CORE, USER, BaseService, $timeout, RFQSettingFactory, $state, DialogFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        tableName: '=?',
        moduleName: '=?',
        isDisable: '=?',
        isChangeFromPopup: '=?',
        applyAsCommonCallbackFn: '='
      },
      templateUrl: 'app/directives/custom/common-type-list/common-type-list.html',
      controller: commonListCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function commonListCtrl($scope) {
      var vm = this;
      vm.tableName = CORE.TABLE_NAME;
      vm.RoHSTitle = CORE.RFQ_SETTING.RoHS;
      vm.searchAndSelectToUpdate = CORE.SEARCH_SELECT_TO_UPDATE_HINT;
      vm.PartStatus = CORE.RFQ_SETTING.PartStatus;
      vm.debounceTime = CORE.DEBOUNCE_TIME_INTERVAL;
      const isChangeFromPopup = $scope.isChangeFromPopup ? $scope.isChangeFromPopup : false;
      vm.isUpdatable = true;
      vm.aliasDetail = [];
      vm.loginUser = BaseService.loginUser;
      const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

      //empty state messages for dynamic fields
      //Mounting Type/Functional Type/Connector type/UOM/RoHS
      if ($scope.tableName === vm.tableName.RFQ_MOUNTINGTYPE) {
        vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.MOUNTING_TYPE;
      } else if ($scope.tableName === vm.tableName.RFQ_PARTTYPE) {
        vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.PART_TYPE;
      } else if ($scope.tableName === vm.tableName.RFQ_CONNECTERTYPE) {
        vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.CONNECTER_TYPE;
      } else if ($scope.tableName === vm.tableName.UOM) {
        vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.UNIT_OF_MEASUREMENT;
      } else if ($scope.tableName === vm.tableName.RFQ_ROHS) {
        vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.ROHS;
      } else if ($scope.tableName === vm.tableName.COMPONENT_PARTSTATUS) {
        vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.PART_STATUS;
      } else if ($scope.tableName === vm.tableName.COUNTRY) {
        vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.COUNTRY;
      } else if ($scope.tableName === vm.tableName.RFQ_PACKAGECASETYPE) {
        vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.PACKAGE_CASE_TYPE;
      }

      vm.CustomSearchTypeForList = CORE.CustomSearchTypeForList;
      vm.allCommonModel = { searchText: null, searchType: CORE.CustomSearchTypeForList.Contains };
      vm.isHideDelete = true;
      vm.tableName = $scope.tableName;
      vm.moduleName = $scope.moduleName;
      vm.isDisable = $scope.isDisable;
      const colorColumn = {
        field: 'colorCode',
        displayName: 'Color ',
        cellTemplate: '<span class="label-box label-colorCode cm-mt-grid-color" style="background-color:{{COL_FIELD}}" ng-show="row.entity.colorCode">\
                                      </span><span class="label-box black-500-fg cm-mt-grid-color" ng-show="!row.entity.colorCode" style="border-color:gray">\
                                      </span>',
        width: '80',
        enableFiltering: false
      };
      vm.sourceHeader = [
        {
          field: '#',
          width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
          cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'name',
          width: '250',
          displayName: 'Name',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableFiltering: true,
          enableSorting: true
        },
        {
          field: 'aliaslist',
          width: '350',
          displayName: 'Alias',
          cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" ng-repeat="item in row.entity.aliaslist">\
                      <div layout="row" class="cm-custom-chips" >\
                       <span class="mr-5 pt-2">{{ item.aliasName }} </span>\
                       <md-chips ng-repeat="source in item.sourceDetails" >\
                           <md-chip>{{source}}</md-chip>\
                        </md-chips>\
                      </div>\
                    </div> ',
          enableFiltering: true,
          enableSorting: true
        }
      ];

      if ($scope.tableName === CORE.TABLE_NAME.RFQ_MOUNTINGTYPE || $scope.tableName === CORE.TABLE_NAME.COMPONENT_PARTSTATUS) {
        vm.sourceHeader.splice(2, 0, colorColumn);
      }
      if ($scope.tableName === CORE.TABLE_NAME.RFQ_ROHS) {
        vm.sourceHeader.push({
          field: 'category',
          width: '200',
          displayName: 'Category',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableFiltering: true,
          enableSorting: true
        }, {
          field: 'parentRoHS',
          displayName: 'Parent RoHS',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '200'
        }, {
          field: 'RoHSPeers',
          displayName: 'Allowed RoHS Peers',
          cellTemplate: ' <div style="overflow: hidden; width:auto;" class="ui-grid-cell-contents layout-wrap"> '
            + ' <span class="label-box margin-left-2 mb-5 label-primary" '
            + ' ng-repeat="objrohsPeer in row.entity.rohsPeerlist track by $index">{{objrohsPeer}}</span> '
            + ' </div> ',
          width: '200'
        }, {
          field: 'rohsParentList',
          displayName: 'Allowed RoHS Children',
          cellTemplate: '<div style="overflow: hidden; width:auto;" class="ui-grid-cell-contents layout-wrap"> '
            + ' <span class="label-box margin-left-2 mb-5 label-primary" '
            + ' ng-repeat="objrohsParent in row.entity.rohsParents track by $index">{{objrohsParent}}</span> '
            + ' </div> ',
          width: '200'
        });
      }
      vm.sourceHeader.unshift(
        {
          field: 'Apply',
          displayName: 'Select',
          width: '75',
          cellTemplate: '<div class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox"><md-checkbox ng-model="row.entity.isRecordSelectedForUpdate" \
                            ng-change="grid.appScope.$parent.vm.setCommonTypeOrUpdate(row.entity)"></md-checkbox></div>',
          enableFiltering: false,
          enableSorting: false,
          exporterSuppressExport: true,
          enableColumnMoving: false,
          manualAddedCheckbox: true,
          pinnedLeft: false
        });

      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [['name', 'ASC']],
          SearchColumns: [],
          ptablename: vm.tableName,
          mouduleName: vm.moduleName,
          SearchText: vm.allCommonModel.searchText
        };
      };

      initPageInfo();

      vm.gridOptions = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: false,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: false,
        filterOptions: vm.pagingInfo.SearchColumns,
        exporterMenuCsv: false,
        exporterCsvFilename: stringFormat('{0}.csv', vm.moduleName)
      };

      function setDataAfterGetAPICall(commonType, isGetDataDown) {
        if (commonType && commonType.data.types) {
          bindData(commonType.data.types);
          if (!isGetDataDown) {
            vm.sourceData = commonType.data.types;
            vm.currentdata = vm.sourceData.length;
          }
          else if (commonType.data.types.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(commonType.data.types);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }
          // must set after new data comes
          vm.totalSourceDataCount = commonType.data.Count;
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
            if (!isGetDataDown) {
              if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount === vm.currentdata) {
                return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
              }
            }
            else {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount !== vm.currentdata ? true : false);
            }
          });
        }
      }

      //get list for all common type
      vm.loadData = () => {
        if (vm.allCommonModel.searchText) {
          setExternalSearchFilter();
        }
        vm.pagingInfo.SearchText = vm.allCommonModel.searchText;
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        vm.cgBusyLoading = RFQSettingFactory.getCommonTypeList().query(vm.pagingInfo).$promise.then((commonType) => {
          if (commonType.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            setDataAfterGetAPICall(commonType, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      //get data down
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = RFQSettingFactory.getCommonTypeList().query(vm.pagingInfo).$promise.then((commonType) => {
          setDataAfterGetAPICall(commonType, true);
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.searchCommonData = (isReset) => {
        if (isReset) {
          vm.allCommonModel.searchText = null;
          initPageInfo();
          vm.gridOptions.gridApi.grid.clearAllFilters();
        }
        else {
          vm.pagingInfo.Page = CORE.UIGrid.Page();
          setExternalSearchFilter();
        }
        vm.loadData();
      };

      const setExternalSearchFilter = () => {
        /* to avoid duplicate filter data adding in list */
        if (vm.pagingInfo.SearchColumns.length > 0) {
          _.remove(vm.pagingInfo.SearchColumns, (item) => item.isExternalSearch);
        }
        if (vm.allCommonModel.searchType === CORE.CustomSearchTypeForList.Exact) {
          vm.pagingInfo.SearchColumns.push({ ColumnName: 'name', SearchString: vm.allCommonModel.searchText, ColumnDataType: 'StringEquals', isExternalSearch: true });
          vm.pagingInfo.SearchColumns.push({ ColumnName: 'aliaslist', SearchString: vm.allCommonModel.searchText, ColumnDataType: 'StringEquals', isExternalSearch: true });
          if ($scope.tableName === CORE.TABLE_NAME.RFQ_ROHS) {
            vm.pagingInfo.SearchColumns.push({ ColumnName: 'category', SearchString: vm.allCommonModel.searchText, ColumnDataType: 'StringEquals', isExternalSearch: true });
          }
        }
        else if (vm.allCommonModel.searchType === CORE.CustomSearchTypeForList.Contains) {
          vm.pagingInfo.SearchColumns.push({ ColumnName: 'name', SearchString: vm.allCommonModel.searchText, ColumnDataType: null, isExternalSearch: true });
          vm.pagingInfo.SearchColumns.push({ ColumnName: 'aliaslist', SearchString: vm.allCommonModel.searchText, ColumnDataType: null, isExternalSearch: true });
          if ($scope.tableName === CORE.TABLE_NAME.RFQ_ROHS) {
            vm.pagingInfo.SearchColumns.push({ ColumnName: 'category', SearchString: vm.allCommonModel.searchText, ColumnDataType: null, isExternalSearch: true });
          }
        }
      };

      //bind data
      const bindData = (commonDetail) => {
        _.each(commonDetail, (item) => {
          var aliasDetails = [];
          var split = item.aliaslist ? item.aliaslist.split('##') : null;
          _.each(split, (aliasitem) => {
            vm.aliasDetail = aliasitem ? aliasitem.split('@@@') : null;
            const aliasName = vm.aliasDetail[0] ? vm.aliasDetail[0] : null;
            const sourceDetails = vm.aliasDetail[1] ? vm.aliasDetail[1].split('#$#') : null;
            aliasDetails.push({
              aliasName: aliasName,
              sourceDetails: sourceDetails
            });
            item.aliaslist = aliasDetails ? aliasDetails : null;
          });

          if ($scope.tableName === CORE.TABLE_NAME.RFQ_ROHS) {
            if (item.RoHSPeers) {
              let rohsPeer = [];
              rohsPeer = item.RoHSPeers.split('@@@');
              item.rohsPeerlist = rohsPeer;
              item.RoHSPeers = _.map(rohsPeer).toString();
            }
            if (item.rohsParentList) {
              let rohsParents = [];
              rohsParents = item.rohsParentList.split('@@@');

              item.rohsParents = rohsParents;
              item.rohsParentList = _.map(rohsParents).toString();
            }
          }
        });
      };


      //vm.updateRecord = (row, ev) => {
      //    if (row.entity) {
      //        var model = {
      //            title: CORE.MESSAGE_CONSTANT.CONFIRMATION,
      //            textContent: stringFormat(CORE.MESSAGE_CONSTANT.CONFIRMATION_COMMON_TYPE, stringFormat("\"<b>{0}</b>\" {1}", row.entity.name, vm.moduleName)),
      //            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
      //            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      //        };
      //        DialogFactory.confirmDiolog(model).then((yes) => {
      //            if (yes) {
      //                vm.selectedrow = row.entity;
      //                $scope.$emit('updateType', vm.selectedrow);
      //            }
      //        }, () => {
      //        });
      //    }
      //}

      vm.setCommonTypeOrUpdate = (row) => {
        if (!row.isRecordSelectedForUpdate) {  /* unselect check box case */
          row.isRecordSelectedForUpdate = false;
          vm.gridOptions.clearSelectedRows();
          return;
        }
        /* select check box case */
        const confObj = {
          messageContent: '',
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        if (isChangeFromPopup) { /* from popup allowed to set/update information inside popup */
          confObj.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WANT_TO_EDIT_RECORD);
          DialogFactory.messageConfirmDialog(confObj).then((yes) => {
            if (yes) {
              row.isRecordSelectedForUpdate = false;
              vm.gridOptions.clearSelectedRows();
              $scope.applyAsCommonCallbackFn(row, true);
            }
          }, () => {
            row.isRecordSelectedForUpdate = false;
            vm.gridOptions.clearSelectedRows();
          }).catch((error) => BaseService.getErrorLog(error));
        }
        else {
          $scope.applyAsCommonCallbackFn(row, true);
          vm.gridOptions.clearSelectedRows();
        }
      };

      vm.changeSearchType = () => {
        vm.loadData();
      };
    }
  }
})();
