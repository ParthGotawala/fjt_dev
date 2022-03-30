(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('ViewWOHaltResumeNotificationPopupController', ViewWOHaltResumeNotificationPopupController);

  /** @ngInject */
  function ViewWOHaltResumeNotificationPopupController($timeout, $mdDialog, CORE, data, BaseService, NotificationDirFactory, DialogFactory) {
    const vm = this;
    vm.holdResumeHistoryData = data;
    vm.isHideDelete = true;
    vm.LabelConstant = CORE.LabelConstant;
    vm.DateFormat = _dateTimeFullTimeDisplayFormat;
    vm.EmptyMesssage = CORE.EMPTYSTATE.COMMON_DATA_NOT_FOUND;
    vm.gridConfig = CORE.gridConfig;
    vm.SampleStatusGridHeaderDropdown = CORE.SampleStatusGridHeaderDropdown;
    vm.headerdata = [];
    vm.HaltResumePopUpConst = CORE.HaltResumePopUp;
    vm.woHaltResumeDetModel = {};
    
    let notiDataForResume = {
      refTable: vm.holdResumeHistoryData.refTableName,
      refTransID: vm.holdResumeHistoryData.refTransID,
      notificationCategory: vm.holdResumeHistoryData.notificationCategoryForResume,
      woID: vm.holdResumeHistoryData.woID
    }

    let notiDataForHalt = {
      refTable: vm.holdResumeHistoryData.refTableName,
      refTransID: vm.holdResumeHistoryData.refTransID,
      notificationCategory: vm.holdResumeHistoryData.notificationCategoryForHalt,
      woID: vm.holdResumeHistoryData.woID
    }

    // go to work order operation details page
    vm.goToWorkorderOperationDetails = () => {
      BaseService.goToWorkorderOperationDetails(vm.holdResumeHistoryData.woOPID);
      return false;
    }

    //redirect to work order list
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    }

    //redirect to work order details
    vm.goToWorkorderDetails = () => {
      BaseService.goToWorkorderDetails(vm.holdResumeHistoryData.woID);
      return false;
    }

    // go to sales order list
    vm.goToSalesOrderList = () => {
      BaseService.goToSalesOrderList();
      return false;
    };

    // redirect to part master details
    vm.goToAssyMaster = () => {
        BaseService.goToComponentDetailTab(null, vm.holdResumeHistoryData.partID);
      return false;
    };

    // redirect to part master list
    vm.goToAssy = () => {
        BaseService.goToPartList();
      return false;
    };

    /* display work order sales order all details while click on that link*/
    vm.showSalesOrderDetails = () => {
      let data = {
        poNumber: vm.holdResumeHistoryData.poNumber,
        salesOrderNumber: vm.holdResumeHistoryData.salesOrderNumber,
        soPOQty: vm.holdResumeHistoryData.soPOQty,
        soMRPQty: vm.holdResumeHistoryData.soMRPQty,
        lineID: vm.holdResumeHistoryData.lineID,
        salesOrderMstIDs: vm.holdResumeHistoryData.salesOrderMstIDs,
        SOPOQtyValues: vm.holdResumeHistoryData.SOPOQtyValues,
      }
      let _dummyEvent = null;
      DialogFactory.dialogService(
        CORE.WO_SO_HEADER_DETAILS_MODAL_CONTROLLER,
        CORE.WO_SO_HEADER_DETAILS_MODAL_VIEW,
        _dummyEvent,
        data).then(() => {

        }, ((result) => {

        }), (error) => {
          return BaseService.getErrorLog(error);
        });
    }

    vm.headerdata = [
      {
        label: 'Halt Type', value: vm.holdResumeHistoryData.haltTypeText,
        displayOrder: 1
      },
      {
        label: CORE.LabelConstant.Workorder.WO, value: vm.holdResumeHistoryData.woNumber,
        displayOrder: 2, labelLinkFn: vm.goToWorkorderList,
        valueLinkFn: vm.goToWorkorderDetails
      },
      {
        label: vm.LabelConstant.SalesOrder.PO,
        value: vm.holdResumeHistoryData.poNumber,
        displayOrder: 3,
        labelLinkFn: vm.goToSalesOrderList,
        valueLinkFn: vm.showSalesOrderDetails
      },
      {
        label: vm.LabelConstant.SalesOrder.SO,
        value: vm.holdResumeHistoryData.salesOrderNumber,
        displayOrder: 4,
        labelLinkFn: vm.goToSalesOrderList,
        valueLinkFn: vm.showSalesOrderDetails
      },
      {
        label: CORE.LabelConstant.Assembly.PIDCode,
        value: vm.holdResumeHistoryData.PIDCode,
        displayOrder: 5,
        labelLinkFn: vm.goToAssy,
        valueLinkFn: vm.goToAssyMaster,
        isCopy: true,
        imgParms: {
          imgPath: vm.holdResumeHistoryData.rohsIcon,
          imgDetail: vm.holdResumeHistoryData.rohsName
        }
      }];

  /******************************** [S] - resume action related all notification/receivers ***********************/

    let initPageInfoForResume = () => {
      vm.pagingInfoForResume = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [],
        SearchColumns: [],
      };
    }
    initPageInfoForResume();

    vm.sourceHeaderForResume = [
      {
        field: '#',
        width: '70',
        cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
        enableFiltering: false,
        enableSorting: false,
      },
      {
        field: 'receiverFullName',
        displayName: 'Receiver',
        width: 185,
      },
      {
        field: 'isReadText',
        displayName: 'Read',
        width: 100,
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.isRead == true, \
                            \'label-warning\':row.entity.isRead == false}"> \
                                {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.SampleStatusGridHeaderDropdown
        },
      },
      {
        field: 'isAckText',
        displayName: 'Ack',
        width: 100,
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.requestStatus == \'A\', \
                            \'label-warning\':row.entity.requestStatus != \'A\'}"> \
                                {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.SampleStatusGridHeaderDropdown
        },
      },
      {
        field: 'convertedNotiAckDate',
        displayName: 'Ack Date',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: 160,
        type: 'datetime',
        enableFiltering: false
      },
    ];

    vm.gridOptionsForResume = {
      showColumnFooter: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: false,
      filterOptions: vm.pagingInfoForResume.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'Resume Notification Receivers.csv',
    };

    // after first time getting data , user filter any receivers we add notificationID in filter parameter
    let setNotificationIDInFilterForResume = () => {
      notiDataForResume.notificationID = vm.sourceDataForResume && vm.sourceDataForResume.length > 0 ? vm.sourceDataForResume[0].notificationID : null;
    }

    vm.loadDataForResume = () => {
      setNotificationIDInFilterForResume();
      vm.cgBusyLoading = NotificationDirFactory.getNotificationWithReceiversByTableRefID(vm.pagingInfoForResume).query(notiDataForResume).$promise.then((resp) => {
        if (resp && resp.data && resp.status == CORE.ApiResponseTypeStatus.SUCCESS) {
          if (resp.data.isNotificationMstDetExists) {
            vm.sourceDataForResume = resp.data.notiReceivers;
            vm.totalSourceDataCountForResume = resp.data.Count;

            if (!vm.gridOptionsForResume.enablePaging) {
              vm.currentdataForResume = vm.sourceDataForResume.length;
              vm.gridOptionsForResume.gridApi.infiniteScroll.resetScroll();
            }
            vm.gridOptionsForResume.clearSelectedRows();
            if (vm.totalSourceDataCountForResume == 0) {
              if (vm.pagingInfoForResume.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
                vm.isNoDataFoundForResume = false;
                vm.emptyStateForResume = 0;
              }
              else {
                vm.isNoDataFoundForResume = true;
                vm.emptyStateForResume = null;
              }
            }
            else {
              vm.isNoDataFoundForResume = false;
              vm.emptyStateForResume = null;
            }
            $timeout(() => {
              vm.resetSourceGridForResume();
              if (!vm.gridOptionsForResume.enablePaging && vm.totalSourceDataCountForResume == vm.currentdataForResume) {
                return vm.gridOptionsForResume.gridApi.infiniteScroll.dataLoaded(false, false);
              }
            });
          }
          else {
            vm.isNoDataFoundForResume = true;
            vm.emptyStateForResume = null;
          }
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    vm.getDataDownForResume = () => {
      setNotificationIDInFilterForResume();
      vm.pagingInfoForResume.Page = vm.pagingInfoForResume.Page + 1;
      vm.cgBusyLoading = NotificationDirFactory.getNotificationWithReceiversByTableRefID(vm.pagingInfoForResume).query(notiDataForResume).$promise.then((resp) => {
        if (resp && resp.data && resp.status == CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.sourceDataForResume = vm.gridOptionsForResume.data = vm.gridOptionsForResume.data.concat(resp.data.notiReceivers);
          vm.currentdataForResume = vm.gridOptionsForResume.currentItem = vm.gridOptionsForResume.data.length;
          vm.gridOptionsForResume.gridApi.infiniteScroll.saveScrollPercentage();
          $timeout(() => {
            //vm.resetSourceGridForResume();
            return vm.gridOptionsForResume.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCountForResume != vm.currentdataForResume ? true : false);
          });
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

  /* ********************************** [E] - resume action related all notification/receivers ***************************** */

  /* ***************************** [S] - halt action related all notification/receivers ********************* */

    let initPageInfoForHalt = () => {
      vm.pagingInfoForHalt = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [],
        SearchColumns: [],
      };
    }
    initPageInfoForHalt();

    vm.sourceHeaderForHalt = [
      {
        field: '#',
        width: '70',
        cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
        enableFiltering: false,
        enableSorting: false,
      },
      {
        field: 'receiverFullName',
        displayName: 'Receiver',
        width: 185,
      },
      {
        field: 'isReadText',
        displayName: 'Read',
        width: 100,
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.isRead == true, \
                            \'label-warning\':row.entity.isRead == false}"> \
                                {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.SampleStatusGridHeaderDropdown
        },
      },
      {
        field: 'isAckText',
        displayName: 'Ack',
        width: 100,
        cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center">'
          + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.requestStatus == \'A\', \
                            \'label-warning\':row.entity.requestStatus != \'A\'}"> \
                                {{ COL_FIELD }}'
          + '</span>'
          + '</div>',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
        filter: {
          term: null,
          options: vm.SampleStatusGridHeaderDropdown
        },
      },
      {
        field: 'convertedNotiAckDate',
        displayName: 'Ack Date',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: 160,
        type: 'datetime',
        enableFiltering: false
      },
    ];

    vm.gridOptionsForHalt = {
      showColumnFooter: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: false,
      filterOptions: vm.pagingInfoForHalt.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'Halt Notification Receivers.csv',
    };

    // after first time getting data , user filter any receivers we add notificationID in filter parameter
    let setNotificationIDInFilterForHalt = () => {
      notiDataForHalt.notificationID = vm.sourceDataForHalt && vm.sourceDataForHalt.length > 0 ? vm.sourceDataForHalt[0].notificationID : null;
    }

    vm.loadDataForHalt = () => {
      setNotificationIDInFilterForHalt();
      vm.cgBusyLoading = NotificationDirFactory.getNotificationWithReceiversByTableRefID(vm.pagingInfoForHalt).query(notiDataForHalt).$promise.then((resp) => {
        if (resp && resp.data && resp.status == CORE.ApiResponseTypeStatus.SUCCESS) {
          if (resp.data.isNotificationMstDetExists) {
            vm.sourceDataForHalt = resp.data.notiReceivers;
            vm.totalSourceDataCountForHalt = resp.data.Count;

            if (!vm.gridOptionsForHalt.enablePaging) {
              vm.currentdataForHalt = vm.sourceDataForHalt.length;
              vm.gridOptionsForHalt.gridApi.infiniteScroll.resetScroll();
            }
            vm.gridOptionsForHalt.clearSelectedRows();
            if (vm.totalSourceDataCountForHalt == 0) {
              if (vm.pagingInfoForHalt.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
                vm.isNoDataFoundForHalt = false;
                vm.emptyStateForHalt = 0;
              }
              else {
                vm.isNoDataFoundForHalt = true;
                vm.emptyStateForHalt = null;
              }
            }
            else {
              vm.isNoDataFoundForHalt = false;
              vm.emptyStateForHalt = null;
            }
            $timeout(() => {
              vm.resetSourceGridForHalt();
              if (!vm.gridOptionsForHalt.enablePaging && vm.totalSourceDataCountForHalt == vm.currentdataForHalt) {
                return vm.gridOptionsForHalt.gridApi.infiniteScroll.dataLoaded(false, false);
              }
            });
          }
          else {
            vm.isNoDataFoundForHalt = true;
            vm.emptyStateForHalt = null;
          }
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    vm.getDataDownForHalt = () => {
      setNotificationIDInFilterForHalt();
      vm.pagingInfoForHalt.Page = vm.pagingInfoForHalt.Page + 1;
      vm.cgBusyLoading = NotificationDirFactory.getNotificationWithReceiversByTableRefID(vm.pagingInfoForHalt).query(notiDataForHalt).$promise.then((resp) => {
        if (resp && resp.data && resp.status == CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.sourceDataForHalt = vm.gridOptionsForHalt.data = vm.gridOptionsForHalt.data.concat(resp.data.notiReceivers);
          vm.currentdataForHalt = vm.gridOptionsForHalt.currentItem = vm.gridOptionsForHalt.data.length;
          vm.gridOptionsForHalt.gridApi.infiniteScroll.saveScrollPercentage();
          $timeout(() => {
            //vm.resetSourceGridForHalt();
            return vm.gridOptionsForHalt.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCountForHalt != vm.currentdataForHalt ? true : false);
          });
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

  /* *************************************** [E] - halt action related all notification/receivers ****************** */
  

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }

})();
