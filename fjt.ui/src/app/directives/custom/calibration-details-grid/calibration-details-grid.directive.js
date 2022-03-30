(function () {
  'use strict';

  angular
    .module('app.admin.calibrationdetails')
    .directive('calibrationDetailsGrid', calibrationDetailsGrid);

  /** @ngInject */
  function calibrationDetailsGrid($mdDialog, $q, $timeout, CORE, USER, DialogFactory, BaseService, CalibrationDetailsFactory) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        eqpId: '=?',
        equipmentAs: '=?',
        calibrationRequired: '=?',
        parentIsNoDataFound: '=?'
      },
      templateUrl: 'app/directives/custom/calibration-details-grid/calibration-details-grid.html',
      controller: calibrationDetailsListCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    // eslint-disable-next-line no-unused-vars
    function calibrationDetailsListCtrl($scope, $element, $attrs) {
      var vm = this;
      vm.eqpId = $scope.eqpId;
      vm.equipmentAs = $scope.equipmentAs;
      vm.calibrationRequired = $scope.calibrationRequired;
      vm.isUpdatable = true;
      vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.CALIBRATION_DETAILS;
      vm.gridConfig = CORE.gridConfig;
      vm.LabelConstant = angular.copy(CORE.LabelConstant);
      vm.DefaultDateFormat = _dateDisplayFormat;
      vm.calibrationFilterType = CORE.CalibrationFilterType;
      vm.calibrationFilterTypeModel = true;
      vm.loginUser = BaseService.loginUser;
      const isEnablePagination = (vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination) ? true : false;
      vm.equipmentType = CORE.EquipmentType;

      // init pagination details
      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          pageSize: CORE.UIGrid.ItemsPerPage(),
          SortColumns: [['assetName', 'DESC']],
          SearchColumns: [],
          eqpId: vm.eqpId
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
        exporterMenuCsv: true,
        exporterCsvFilename: 'Calibration Details.csv'
      };
      vm.isDisableDescription = (data) => data.eqpDescription ? false : true;
      vm.sourceHeader = [
        {
          field: 'Action',
          cellClass: 'layout-align-center-center',
          displayName: 'Action',
          width: 80,
          cellTemplate: '<grid-action-view grid="grid" row="row" number-of-action-button="5"></grid-action-view>',
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
          enableSorting: false,
          allowCellFocus: false
        },
        {
          field: 'equipmentAsConvertedValue',
          displayName: 'Category',
          cellTemplate: '<div class="ui-grid-cell-contents">'
            + '<span class="label-box" \
                            ng-class="{\'label-success\':row.entity.equipmentAs == \'E\', \
                            \'label-warning\':row.entity.equipmentAs == \'W\', \
                            \'label-primary\':row.entity.equipmentAs == \'S\'}"> \
                                 {{COL_FIELD}}'
            + '</span>'
            + '</div>',
          filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div my-custom-dropdown></div></div>',
          filter: {
            term: null,
            options: vm.equipmentType
          },
          ColumnDataType: 'StringEquals',
          width: '150'
        },
        {
          field: 'assetName',
          width: 200,
          displayName: 'Name',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToManageEquipment(row.entity.refEqpID);$event.preventDefault();">{{row.entity.assetName}}</a>\
                </div> '
        },
        {
          field: 'eqpMake',
          width: 200,
          displayName: 'Make',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'eqpModel',
          width: 130,
          displayName: 'Model',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>'
        },
        {
          field: 'calibrationDate',
          width: 170,
          displayName: 'Calibration Date',
          type: 'date',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'calibrationExpirationDate',
          displayName: 'Calibration Expiration Date',
          type: 'date',
          //cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
          cellTemplate: '<div class="ui-grid-cell-contents">'
            + '<span ng-class="{\'red\': (row.entity.calExpiryDateStatus === 1), \'blue\': (row.entity.calExpiryDateStatus === 2) }">'
            + '                                           {{COL_FIELD}}'
            + '</span>'
            + '</div > ',
          enableFiltering: false,
          enableSorting: false
        },
        {
          field: 'calibrationComments',
          width: 250,
          displayName: 'Calibration Comments',
          cellTemplate: '<div class="ui-grid-cell-contents text-left" layout="row">' +
            '<span class="cursor-pointer bom-header-wrap">{{ COL_FIELD }}</span> &nbsp;' +
            '<button class="md-primary grid-button md-icon-button" ng-if="row.entity.calibrationComments && row.entity.calibrationComments !== \'-\'" ng-click="grid.appScope.$parent.vm.showCalibrationComment(row.entity, $event, \'Calibration Comments\')">' +
            '<md-icon md-font-icon="icon icon-eye" class="s16"></md-icon>' +
            '<md-tooltip>View</md-tooltip>' +
            '</button>' +
            '</div>'
        },
        {
          field: 'assetNumber',
          displayName: 'Workstation/Asset#',
          width: '150'
        },
        {
          field: 'serialNumber',
          displayName: 'MFR Serial#',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: '200'
        }, {
          field: 'departmentName',
          displayName: 'Department',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToManageDepartment(row.entity.departmentID);$event.preventDefault();">{{row.entity.departmentName}}</a>\
                </div>',
          width: '130'
        }, {
          field: 'locationName',
          displayName: 'Geolocation',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                <a tabindex="-1" class="cm-text-decoration cursor-pointer" ng-mousedown="grid.appScope.$parent.vm.goToManageLocation(row.entity.locationTypeID);$event.preventDefault();">{{row.entity.locationName}}</a>\
                </div>',
          width: '130'
        },
        {
          field: 'eqpDescription',
          width: '120',
          displayName: 'Description',
          cellTemplate: '<md-button class="md-warn md-hue-1 margin-0" ng-disabled="grid.appScope.$parent.vm.isDisableDescription(row.entity)" ng-click="grid.appScope.$parent.vm.showEquipmentDescription(row.entity, $event)"> \
                                   View \
                                </md-button>',
          enableFiltering: false
        },
        {
          field: 'updatedAtValue',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODIFY_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          type: 'datetime',
          enableFiltering: false
        },
        {
          field: 'updatedbyValue',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          type: 'StringEquals',
          enableFiltering: true
        },
        {
          field: 'updatedbyRoleValue',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_MODYFYBY_ROLE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          type: 'StringEquals',
          enableFiltering: true
        },
        {
          field: 'createdAtValue',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATED_DATE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          type: 'datetime',
          enableFiltering: false
        }
        , {
          field: 'createdbyValue',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          type: 'StringEquals',
          enableFiltering: true
        },
        {
          field: 'createdbyRoleValue',
          displayName: vm.LabelConstant.COMMON.GRIDHEADER_CREATEDBY_ROLE,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
          type: 'StringEquals',
          enableFiltering: true
        }
      ];

      const setDisabledUpdate = (data) => {
        if (data && data.length > 0) {
          _.each(data, (item) => {
            item.isDisabledUpdate = item.isDisabledDelete = !item.id;
            item.isRowSelectable = item.id ? true : false;
            item.calibrationDate = item.calibrationDate ? BaseService.getUIFormatedDate(item.calibrationDate, vm.DefaultDateFormat) : item.calibrationDate;
            item.calibrationExpirationDate = item.calibrationExpirationDate ? BaseService.getUIFormatedDate(item.calibrationExpirationDate, vm.DefaultDateFormat) : item.calibrationExpirationDate;
          });
        }
      };

      // to set data in grid after data is retrived from API in loadData() and getDataDown() function
      const setDataAfterGetAPICall = (calibrationData, isGetDataDown) => {
        if (calibrationData && calibrationData.data && calibrationData.data.calibrationDetails) {
          if (!isGetDataDown) {
            setDisabledUpdate(calibrationData.data.calibrationDetails);
            vm.sourceData = calibrationData.data.calibrationDetails;
            vm.currentdata = vm.sourceData.length;
          }
          else if (calibrationData.data.calibrationDetails.length > 0) {
            setDisabledUpdate(calibrationData.data.calibrationDetails);
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(calibrationData.data.calibrationDetails);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }

          // must set after new data comes
          vm.totalSourceDataCount = calibrationData.data.Count;
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
            if (vm.pagingInfo.SearchColumns.length > 0) {
              vm.isNoDataFound = false;
              $scope.parentIsNoDataFound = false;
              vm.emptyState = 0;
            }
            else {
              vm.isNoDataFound = true;
              $scope.parentIsNoDataFound = true;
              vm.emptyState = null;
            }
          }
          else {
            vm.isNoDataFound = false;
            $scope.parentIsNoDataFound = false;
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

      /* to bind data in grid on load */
      vm.loadData = () => {
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        if (vm.pagingInfo.SortColumns.length === 0) {
          vm.pagingInfo.SortColumns = [['assetName', 'DESC']];
        }

        vm.pagingInfo.currentCalibrationDetail = vm.calibrationFilterTypeModel;
        $scope.$parent.vm.cgBusyLoading = CalibrationDetailsFactory.retrieveCalibrationDetailsList().query(vm.pagingInfo).$promise.then((calibrationData) => {
          if (calibrationData && calibrationData.data) {
            setDataAfterGetAPICall(calibrationData, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* to get data on scroll down in grid */
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = CalibrationDetailsFactory.retrieveCalibrationDetailsList().query(vm.pagingInfo).$promise.then((calibrationData) => {
          if (calibrationData && calibrationData.data) {
            setDataAfterGetAPICall(calibrationData, true);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* delete record*/
      vm.deleteRecord = (calibration) => {
        let selectedIDs = [];
        if (calibration) {
          selectedIDs.push(calibration.id);
        } else {
          vm.selectedRows = vm.selectedRowsList;
          if (vm.selectedRows.length > 0) {
            selectedIDs = vm.selectedRows.map((item) => item.id);
          }
        }

        if (selectedIDs) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
          messageContent.message = stringFormat(messageContent.message, CORE.PageName.CalibrationDetails, selectedIDs.length);

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
              vm.cgBusyLoading = CalibrationDetailsFactory.deleteCalibrationDetails().query({ objIDs: objIDs }).$promise.then((data) => {
                if (data && data.data && (data.data.length > 0 || data.data.transactionDetails)) {
                  const dataObj = {
                    TotalCount: data.data.transactionDetails[0].TotalCount,
                    pageName: CORE.PageName.CalibrationDetails
                  };
                  BaseService.deleteAlertMessageWithHistory(dataObj, (ev) => {
                    const IDs = {
                      id: selectedIDs,
                      CountList: true
                    };
                    return CalibrationDetailsFactory.deleteCalibrationDetails().query({
                      objIDs: IDs
                    }).$promise.then((res) => {
                      let data = {};
                      data = res.data;

                      data.pageTitle = calibration ? calibration.name : null;
                      data.PageName = CORE.PageName.CalibrationDetails;
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
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        }
        else {
          //show validation message no data selected
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
          messageContent.message = stringFormat(messageContent.message, 'part');
          const alertModel = {
            messageContent: messageContent
          };
          DialogFactory.messageAlertDialog(alertModel);
        }
      };

      /* Remove multiple record*/
      vm.deleteMultipleData = () => {
        vm.deleteRecord();
      };

      /* add edit record*/
      vm.addEditRecord = (data, ev) => {
        if (!data) {
          data = {};
        };
        const dataForPopup = angular.copy(data);
        dataForPopup.eqpId = vm.eqpId;
        dataForPopup.equipmentAs = vm.equipmentAs;

        const popUpData = { popupAccessRoutingState: [USER.ADMIN_MANAGE_CALIBRATION_DETAILS_POPUP_STATE], pageNameAccessLabel: CORE.PageName.CalibrationDetails };
        const isAccessPopUp = BaseService.checkRightToAccessPopUp(popUpData);
        if (isAccessPopUp) {
          DialogFactory.dialogService(
            USER.ADMIN_ADD_UPDATE_CALIBRATION_DETAILS_MODAL_CONTROLLER,
            USER.ADMIN_ADD_UPDATE_CALIBRATION_DETAILS_MODAL_VIEW,
            ev,
            dataForPopup).then(() => {
              BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            }, (err) => BaseService.getErrorLog(err));
        }
      };

      /* edit record*/
      vm.updateRecord = (row, ev) => {
        vm.addEditRecord(row.entity, ev);
      };

      vm.filterSelectionChange = () => {
        vm.pagingInfo.Page = vm.gridOptions.paginationCurrentPage = CORE.UIGrid.Page();
        vm.loadData();
      };

      $scope.$on(USER.CalibrationDetailListReloadBroadcast, () => {
        BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
      });

      // show calibration comments
      vm.showCalibrationComment = (row, ev) => {
        const PopupData = {
          title: 'Calibration Comments',
          description: row.calibrationComments,
          headerData: null
        };
        DialogFactory.dialogService(
          CORE.DESCRIPTION_MODAL_CONTROLLER,
          CORE.DESCRIPTION_MODAL_VIEW,
          ev,
          PopupData).then(() => {
          }, (err) => BaseService.getErrorLog(err));
      };

      // show internal comments
      vm.showEquipmentDescription = (row, ev) => {
        const PopupData = {
          title: 'Description',
          description: row.eqpDescription,
          headerData: null
        };
        DialogFactory.dialogService(
          CORE.DESCRIPTION_MODAL_CONTROLLER,
          CORE.DESCRIPTION_MODAL_VIEW,
          ev,
          PopupData).then(() => {
          }, (err) => BaseService.getErrorLog(err));
      };

      //go to manage equipment
      vm.goToManageEquipment = (id) => {
        BaseService.goToManageEquipmentWorkstation(id);
      };

      // go to department
      vm.goToManageDepartment = (id) => {
        BaseService.goToManageDepartment(id);
      };

      //go to location
      vm.goToManageLocation = (id) => {
        BaseService.goToGenericCategoryManageLocation(id);
      };
    }
  }
})();
