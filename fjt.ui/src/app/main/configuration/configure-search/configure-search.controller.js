(function () {
  'use strict';

  angular
    .module('app.configuration.configuresearch')
    .controller('ConfigureSearchController', ConfigureSearchController);

  /** @ngInject */
  function ConfigureSearchController(USER, $scope, CORE, ConfigureSearchFactory, BaseService, $timeout, DialogFactory, NotificationFactory, CONFIGURATION, $q, uiGridConstants) {
    const vm = this;
    //vm.isUpdatable = true;
    //vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.JOB_TYPE;
    //vm.StatusOptionsGridHeaderDropdown = CORE.StatusOptionsGridHeaderDropdown;
    vm.isHideDelete = true;
    vm.ADD_ENTERPRISE_WITH_DATE_RANGE_NOTES_LIST_PAGE = CORE.ADD_ENTERPRISE_WITH_DATE_RANGE_NOTES_LIST_PAGE;
    vm.selectedRowsList = [];
    vm.gridConfigureSearch = CORE.gridConfig.gridConfigureSearch;
    vm.isEditIntigrate = false;
    vm.sourceHeader = [
      {
        field: 'Action',
        cellClass: 'layout-align-center-center',
        displayName: 'Action',
        width: '100',
        cellTemplate:
          '<md-button class="md-primary grid-button md-icon-button bdrbtn md-button ng-scope md-default-theme md-ink-ripple" ng-click="grid.appScope.$parent.vm.AddTransaction(row.entity.entityID)">' +
          '<md-icon role="img" md-font-icon="icons-add-record" class="uigrid-icon margin-0"></md-icon>' +
          '<md-tooltip md-direction="top">Add into enterprise</md-tooltip></md-button>' +
          '<md-button class="md-primary grid-button md-icon-button bdrbtn md-button ng-scope md-default-theme md-ink-ripple" ng-click="grid.appScope.$parent.vm.RemoveTransaction(row.entity.TypeID)">' +
          '<md-icon role="img" md-font-icon="icons-remove-record" class="uigrid-icon margin-0"></md-icon>' +
          '<md-tooltip md-direction="top">Remove from enterprise</md-tooltip></md-button>' +
          '<md-button class="md-primary grid-button md-icon-button bdrbtn md-button ng-scope md-default-theme md-ink-ripple" ng-click="grid.appScope.$parent.vm.retriveCountTypeWise(row.entity.TypeID,row.entity.entityID)">' +
          '<md-icon role="img" md-font-icon="icons-refresh" class="uigrid-icon margin-0"></md-icon>' +
          '<md-tooltip md-direction="top">Refresh Count</md-tooltip></md-button>',
        //headerCellTemplate:
        //`<span style="float:left"/>
        //   	<span class="ui-icon ui-icon-close" style="float:left"/>
        //   	<span style="float:left" class ="ui-icon ui-icon-arrowthick-2-n-s"/>`,
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: true
      }, {
        field: '#',
        width: '70',
        cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
        enableFiltering: false,
        enableSorting: false,
      }, {
        field: 'displayName',
        displayName: 'Entity Name',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: '300',
        enableSorting: true,
        enableFiltering: true
      }, {
        field: 'searchDisplayOrder',
        displayName: 'Display Order',
        cellTemplate: CORE.DISPLAYORDER.CellTemplate,
        editableCellTemplate: CORE.DISPLAYORDER.EditableCellTemplate,
        //cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
        width: '200',
        enableCellEdit: true,
        enableSorting: true,
        enableFiltering: true
      }, {
        field: 'DatabaseCount',
        displayName: 'Q2C Database Count',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
        width: '200',
        cellClass: function (grid, row) {
          if (row.entity.DatabaseCount !== row.entity.EntepriseCount) {
            return 'cm-enterprise-db-count-mis-match-err';
          }
        },
        enableSorting: true,
        enableFiltering: true
      }, {
        field: 'EntepriseCount',
        displayName: 'Enterprise Count',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
        width: '170',
        enableSorting: true,
        enableFiltering: true,
        cellClass: function (grid, row) {
          if (row.entity.DatabaseCount !== row.entity.EntepriseCount) {
            return 'cm-enterprise-db-count-mis-match-err';
          }
        },
      }

    ];
    vm.isClientSideFilter = false;
    vm.AllEntityList = [];

    let initPageInfo = () => {
      vm.pagingInfo = {
        Page: 0,
        SortColumns: [['searchDisplayOrder', 'ASC']],
        SearchColumns: [],
      };
    }

    initPageInfo();

    vm.gridOptions = {
      showColumnFooter: false,
      enableRowHeaderSelection: true,
      enableFullRowSelection: false,
      enableRowSelection: true,
      multiSelect: true,
      filterOptions: vm.pagingInfo.SearchColumns,
      hideMultiDeleteButton: true,
      exporterMenuCsv: true,
      exporterCsvFilename: 'Configure Search.csv'
    };

    /* retrieve Users list*/
    vm.loadData = () => {
      if (!vm.isClientSideFilter || vm.pagingInfo.isReset) {
        vm.pagingInfo.SortColumns = [['searchDisplayOrder', 'ASC']];
        vm.pagingInfo.SearchColumns = [];
        vm.cgBusyLoading = ConfigureSearchFactory.retriveEntityList().query(vm.pagingInfo).$promise.then((enterPriseEntity) => {
          vm.pagingInfo.isReset = false;
          if (enterPriseEntity.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            _.each(enterPriseEntity.data.entityList, (entity) => {
              entity.EntepriseCount = 0;
              entity.DatabaseCount = 0;
            });
            vm.sourceData = enterPriseEntity.data.entityList;
            vm.AllEntityList = enterPriseEntity.data.entityList;
            vm.totalSourceDataCount = enterPriseEntity.data.entityList.length;
            vm.isClientSideFilter = true;
            _.each(vm.AllEntityList, (item) => {
              const entityDetail = JSON.parse(item.jsonObjOfEnterprise);
              item = Object.assign(item, entityDetail);
            });
            vm.retriveCountTypeWise(vm.AllEntityList.map((detail) => {
              const entityDetail = JSON.parse(detail.jsonObjOfEnterprise);
              return entityDetail.TypeID
            }), vm.AllEntityList.map((detail) => detail.entityID));
            if (!vm.gridOptions.enablePaging) {
              vm.currentdata = vm.sourceData.length;
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
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      } else {
        let searchString;
        let displayCountString;
        let databaseCountString;
        let enterpriseCountString;
        /*Used to stored selected searched pages*/
        _.each(vm.pages, ((item) => {
          searchedPages.push(item);
        }));
        if (vm.pagingInfo.SearchColumns && vm.pagingInfo.SearchColumns.length > 0) {
          searchString = vm.pagingInfo.SearchColumns.find((a) => a.ColumnName === 'displayName') ? vm.pagingInfo.SearchColumns.find((a) => a.ColumnName === 'displayName').SearchString : '';
          databaseCountString = vm.pagingInfo.SearchColumns.find((a) => a.ColumnName === 'DatabaseCount') ? vm.pagingInfo.SearchColumns.find((a) => a.ColumnName === 'DatabaseCount').SearchString : '';
          displayCountString = vm.pagingInfo.SearchColumns.find((a) => a.ColumnName === 'searchDisplayOrder') ? vm.pagingInfo.SearchColumns.find((a) => a.ColumnName === 'searchDisplayOrder').SearchString : '';
          enterpriseCountString = vm.pagingInfo.SearchColumns.find((a) => a.ColumnName === 'EntepriseCount') ? vm.pagingInfo.SearchColumns.find((a) => a.ColumnName === 'EntepriseCount').SearchString : '';
        }

        vm.sourceData = _.filter(angular.copy(vm.AllEntityList), (data) => {
          if (data.displayName.toUpperCase().includes(searchString ? searchString.toUpperCase() : '') &&
            data.DatabaseCount.toString().toUpperCase().includes(databaseCountString ? databaseCountString.toUpperCase() : '') &&
            data.searchDisplayOrder.toString().toUpperCase().includes(displayCountString ? displayCountString.toUpperCase() : '') &&
            data.EntepriseCount.toString().toUpperCase().includes(enterpriseCountString ? enterpriseCountString.toUpperCase() : '')) {
            return data;
          }
        });
        if (vm.pagingInfo.SortColumns.length > 0) {
          const column = [];
          const sortBy = [];
          _.each(vm.pagingInfo.SortColumns, (item) => {
            column.push(item[0]);
            sortBy.push(item[1]);
          });
          vm.sourceData = _.orderBy(vm.sourceData, column, _.uniq(sortBy));
        }
        vm.totalSourceDataCount = vm.sourceData.length;
        vm.isClientSideFilter = true;
        if (!vm.gridOptions.enablePaging) {
          vm.currentdata = vm.sourceData.length;
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
    };

    /* load more data on mouse scroll */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
    };

    vm.addMultipleEntityRecord = () => {
      let selectedIDs = [];
      vm.selectedRows = vm.selectedRowsList;
      if (vm.selectedRows.length > 0) {
        selectedIDs = vm.selectedRows.map((detail) => detail.entityID);
      }
      vm.AddTransaction(selectedIDs);
    };
    function cellEdit() {
      vm.isEditIntigrate = true;
      vm.gridOptions.gridApi.edit.on.afterCellEdit($scope, (rowEntity, colDef, newvalue, oldvalue) => {
        var obj = _.find(vm.sourceData, (item) => item.id === rowEntity.id);
        var index = vm.sourceData.indexOf(obj);
        if (colDef.field === 'searchDisplayOrder' && newvalue !== oldvalue) {
          if (!BaseService.setInvalidDisplayOrder(oldvalue, newvalue, index, (colDef.colInitIndex - 1), vm.gridOptions, vm.sourceData, vm.sourceHeader, rowEntity, 0)) {
            return;
          }
          const entityInfo = {
            searchDisplayOrder: newvalue,
            entityID: rowEntity.entityID,
            entityName: rowEntity.entityName
          };
          vm.cgBusyLoading = ConfigureSearchFactory.updateEntityDisplayOrder().query(entityInfo).$promise.then((res) => {
            if (res) {
              if (res.status === CORE.ApiResponseTypeStatus.FAILED) {
                rowEntity.searchDisplayOrder = oldvalue;
              }
              else if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                vm.isClientSideFilter = false;
                // vm.loadData();
                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
              }
            }
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        }
      });
    }
    vm.removeMultipleTypeRecord = () => {
      let selectedType = [];
      vm.selectedRows = vm.selectedRowsList;
      if (vm.selectedRows.length > 0) {
        selectedType = vm.selectedRows.map((detail) => {
          const entityDetail = JSON.parse(detail.jsonObjOfEnterprise);
          return entityDetail.TypeID
        });
      }
      vm.RemoveTransaction(selectedType);
    };

    vm.retriveCountTypeWise = (detailTypes, id) => {
      let detailModel = {};
      let selectedIDs = [];
      vm.selectedRows = vm.selectedRowsList;
      if (vm.selectedRows.length > 0) {
        selectedIDs = vm.selectedRows.map((detail) => detail.entityID);
      }
      if (detailTypes) {
        detailModel = { TypeName: Array.isArray(detailTypes) ? detailTypes : [detailTypes] };
      } else {
        detailModel = {
          TypeName: vm.selectedRows.map((detail) => {
            const entityDetail = JSON.parse(detail.jsonObjOfEnterprise);
            return entityDetail.TypeID
          })
        };
      }
      if (id || (Array.isArray(selectedIDs) && selectedIDs.length > 0)) {
        detailModel.ids = id ? (Array.isArray(id) ? id : [id]) : selectedIDs;
      } else {
        detailModel.ids = vm.AllEntityList.map((detail) => detail.entityID);
      }

      const getAllDataPromise = [getDbCount(detailModel), getElasticCount(detailModel)];

      vm.cgBusyLoading = $q.all(getAllDataPromise).then((response) => {
        if (response.length > 1) {
          const dbCountRes = response[0].status === CORE.ApiResponseTypeStatus.SUCCESS ? response[0].data : [];
          const enterPriseCountRes = response[1].isSuccess ? response[1].model : [];

          _.each(vm.sourceData, (item) => {
            const selectedType = _.some(detailModel.TypeName, (a) => a === item.TypeID);
            if (selectedType) {
              const databaseCount = dbCountRes.find((a) => a && a.typeID === item.TypeID);
              const enterPriseCount = enterPriseCountRes.find((a) => a && a.typeID === item.TypeID);
              item.DatabaseCount = databaseCount ? databaseCount.count : 0;
              item.EntepriseCount = enterPriseCount ? enterPriseCount.count : 0;
            }
          });
          _.each(vm.AllEntityList, (item) => {
            const selectedType = _.some(detailModel.TypeName, (a) => a === item.TypeID);
            if (selectedType) {
              const databaseCount = dbCountRes.find((a) => a && a.typeID === item.TypeID);
              const enterPriseCount = enterPriseCountRes.find((a) => a && a.typeID === item.TypeID);
              item.DatabaseCount = databaseCount ? databaseCount.count : 0;
              item.EntepriseCount = enterPriseCount ? enterPriseCount.count : 0;
            }
          });
          if ((Array.isArray(selectedIDs) && selectedIDs.length > 0)) {
            vm.gridOptions.clearSelectedRows();
          }
          vm.gridOptions.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        }
        // return $q.resolve(response);
      }).catch((error) => {
        BaseService.getErrorLog(error);
      });
    };

    function getElasticCount(typeList) {
      return ConfigureSearchFactory.retriveCountTypeWise().query(typeList).$promise.then((res) => {
        return $q.resolve(res);
      }).catch((error) => BaseService.getErrorLog(error));
    }

    function getDbCount(typeList) {
      return ConfigureSearchFactory.getModuleCount().query(typeList).$promise.then((res) => {
        return $q.resolve(res);
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    vm.AddTransaction = (detailIds) => {
      if (detailIds) {
        DialogFactory.dialogService(
          CONFIGURATION.ADD_ENTERPRISERECORD_POPUP_CONTROLLER,
          CONFIGURATION.ADD_ENTERPRISE_RECORD_POPUP_VIEW,
          event,
          detailIds)
          .then((response) => {
            if (response) {
              vm.cgBusyLoading = ConfigureSearchFactory.configureSearch().query(response).$promise.then((data) => {
                if (data.data && data.data.TotalCount > 0) {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_ALERT_MESSAGE);
                  const alertModel = {
                    messageContent: messageContent,
                    multiple: true
                  };
                  DialogFactory.messageAlertDialog(alertModel);
                }
                else {
                  if (Array.isArray(vm.pagingInfo.SearchColumns) && vm.pagingInfo.SearchColumns.length === 0) {
                    BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                    vm.gridOptions.clearSelectedRows();
                  }
                }
              }).catch((error) => {
                return BaseService.getErrorLog(error);
              });
            }
          }, () => {
          }, (err) => BaseService.getErrorLog(err));
      }
    };
    vm.RemoveTransaction = (detailTypes) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.REMOVE_TRANSACTION_CONFIRM_MESSAGE);
      messageContent.message = stringFormat(messageContent.message, Array.isArray(detailTypes) ? detailTypes.length : 1);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_TRANSACTION_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_TRANSACTION_CANCEL_TEXT
      };

      const detailModel = { TypeName: Array.isArray(detailTypes) ? detailTypes : [detailTypes] };

      DialogFactory.messageConfirmDialog(obj).then(() => {
        vm.cgBusyLoading = ConfigureSearchFactory.removeTypeWise().query(detailModel).$promise.then((response) => {
          if (response) {
            if (response.isSuccess) {
              BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
              vm.gridOptions.clearSelectedRows();
              NotificationFactory.success(response.message);
            } else if (response.message) {
              NotificationFactory.error(response.message);
            }
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }, (cancel) => {
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    // to remove all nullable Type/Id wise generated unused records
    vm.removeAllNullableDetails = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.COMMON_DELETE_CONFIRMATION);
      messageContent.message = stringFormat(messageContent.message, 'All empty records');
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_TRANSACTION_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_TRANSACTION_CANCEL_TEXT
      };

      DialogFactory.messageConfirmDialog(obj).then(() => {
        vm.cgBusyLoading = ConfigureSearchFactory.removeAllNullableRecords().query().$promise.then((response) => {
          if (response) {
            if (response.isSuccess) {
              if (Array.isArray(vm.pagingInfo.SearchColumns) && vm.pagingInfo.SearchColumns.length === 0) {
                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                vm.gridOptions.clearSelectedRows();
              }
              NotificationFactory.success(response.message);
            } else if (response.message) {
              NotificationFactory.error(response.message);
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };


    // Generate Json file for Data Tracking System Generete Entity
    vm.generateJSONFile = () => {
      vm.cgBusyLoading = ConfigureSearchFactory.generateJSONofEntity().query().$promise.then((response) => {
        if (response) {
          if (response.isSuccess) {
            BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            vm.gridOptions.clearSelectedRows();
            NotificationFactory.success(response.message);
          } else if (response.message) {
            NotificationFactory.error(response.message);
          }
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };
  }
})();
