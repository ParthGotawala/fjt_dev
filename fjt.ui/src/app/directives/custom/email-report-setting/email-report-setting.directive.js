(function () {
  'use strict';
  angular
    .module('app.core')
    .directive('emailReportSetting', emailReportSetting);

  /** @ngInject */
  function emailReportSetting() {
    const directive = {
      restrict: 'E',
      replace: true,
      scope: {
        reportId: '=?',
        customerId: '=?',
        companyName: '=?',
        customerType: '=?',
        isCompany: '=',
        refTableName: '=?'
      },
      templateUrl: 'app/directives/custom/email-report-setting/email-report-setting.html',
      controller: EmailReportSettingCntrl,
      controllerAs: 'vm',
      link: function () {
      }
    };
    return directive;


    /** @ngInject */
    /**
    * Controller for email report setting
    *
    * @param
    */
    function EmailReportSettingCntrl($scope, $stateParams, $mdDialog, $timeout, $state, USER, CORE, DialogFactory, BaseService, ReportMasterFactory) {
      const vm = this;
      vm.isUpdatable = true;
      vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
      vm.entityName = CORE.AllEntityIDS.Assembly.Name;
      vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.EMAIL_REPORT_SETTING;
      vm.customerTypeConst = CORE.CUSTOMER_TYPE;
      vm.DateTimeFormat = _dateTimeDisplayFormat;
      vm.customerID = $scope.customerId;
      vm.reportID = $scope.reportId;
      vm.companyName = $scope.companyName;
      vm.customerType = $scope.customerType;
      //vm.isCompany = $scope.isCompany;
      vm.loginUser = BaseService.loginUser;
      const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;

      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [['id', 'DESC']],
          SearchColumns: [],
          customerID: vm.customerID,
          reportID: vm.reportID
        };
      };

      initPageInfo();

      vm.gridOptions = {
        enablePaging: isEnablePagination,
        enablePaginationControls: isEnablePagination,
        showColumnFooter: false,
        enableRowHeaderSelection: true,
        enableFullRowSelection: false,
        enableRowSelection: true,
        multiSelect: true,
        filterOptions: vm.pagingInfo.SearchColumns,
        enableCellEdit: false,
        enableCellEditOnFocus: false,
        exporterCsvFilename: null,
        exporterMenuCsv: false,
        enableGrouping: false,
        enableColumnMenus: true
      };

      vm.sourceHeader = [
        {
          field: 'Action',
          cellClass: 'gridCellColor',
          displayName: 'Action',
          width: '70',
          cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
          enableFiltering: false,
          enableSorting: false,
          exporterSuppressExport: true,
          pinnedLeft: true
        },
        {
          field: '#',
          width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
          cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
          enableFiltering: false,
          enableSorting: false
        }, {
          field: 'name',
          displayName: 'Report Name',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableFiltering: true,
          enableSorting: true,
          width: '700'
        },
        {
          field: 'scheduleName',
          displayName: 'Schedule',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableFiltering: true,
          enableSorting: true,
          width: '150'
        },
        {
          field: 'recordCount',
          displayName: 'Number of Persons',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableFiltering: false,
          width: '150',
          enableSorting: true
        }
      ];
      // to set data in grid after data is retrived from API in loadData() and getDataDown() function
      const setDataAfterGetAPICall = (response, isGetDataDown) => {
        if (response && response.data && response.data.EmailSettings) {
          if (!isGetDataDown) {
            vm.sourceData = response.data.EmailSettings;
            vm.currentdata = vm.sourceData.length;
          }
          else if (response.data.EmailSettings.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(response.data.EmailSettings);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }
          // must set after new data comes
          vm.totalSourceDataCount = response.data.Count;
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
      vm.loadData = () => {
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        vm.cgBusyLoading = ReportMasterFactory.retriveCustomerReportList().query(vm.pagingInfo).$promise.then((response) => {
          if (response && response.data) {
            setDataAfterGetAPICall(response, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* load more data on mouse scroll */
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = ReportMasterFactory.retriveCustomerReportList().query(vm.pagingInfo).$promise.then((response) => {
          if (response && response.data) {
            setDataAfterGetAPICall(response, true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      $scope.$on('$destroy', () => $mdDialog.hide(false, {
        closeAll: true
      }));

      vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

      vm.openAddEmailSettingPopup = (id) => {
        var _dummyEvent;
        return DialogFactory.dialogService(
          CORE.ADD_EDIT_EMAIL_REPORT_SETTING_MODAL_CONTROLLER,
          CORE.ADD_EDIT_EMAIL_REPORT_SETTING_MODAL_VIEW,
          _dummyEvent, {
          id: id,
          customerID: vm.customerID,
          reportID: vm.reportID,
          companyName: vm.companyName
        }).then(() => {
          vm.loadData();
        }, () => {
          // Empty
        });
      };


      vm.updateRecord = (row) => {
        if (row && row.entity) {
          vm.openAddEmailSettingPopup(row.entity.id);
        }
      };

      /* delete email report setting*/
      vm.deleteRecord = (data) => {
        let selectedIDs = [];
        if (data) {
          selectedIDs.push(data.id);
        } else {
          vm.selectedRows = vm.selectedRowsList;
          if (vm.selectedRows.length > 0) {
            selectedIDs = vm.selectedRows.map((item) => item.id);
          }
        }
        if (selectedIDs) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, 'E-mail report setting', selectedIDs.length);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          const objIDs = {
            id: selectedIDs,
            CountList: false
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.cgBusyLoading = ReportMasterFactory.deleteCustomerReport().query({ listObj: objIDs }).$promise.then((data) => {
                if (data.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                  BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                  vm.gridOptions.clearSelectedRows();
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => { // empty
          }).catch((error) => BaseService.getErrorLog(error));
        }
        else {
          //show validation message no data selected
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
          messageContent.message = stringFormat(messageContent.message, 'E-mail report setting');
          const alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel);
        }
      };
      /* Remove multiple email report setting*/
      vm.deleteMultipleData = () => {
        vm.deleteRecord();
      };
    }
  }
})();
