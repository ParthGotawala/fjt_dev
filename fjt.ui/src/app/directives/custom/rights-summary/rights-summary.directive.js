(function () {
  'use sctrict';
  angular
    .module('app.core')
    .directive('rightsSummary', rightsSummary);

  /** @ngInject */
  function rightsSummary($timeout, BaseService, RolePagePermisionFactory, DialogFactory, USER, CORE) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        userId: '=',
        employeeId: '=',
        identityUserId: '=?',
      },
      templateUrl: 'app/directives/custom/rights-summary/rights-summary.html',
      controller: rightsSummaryCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function rightsSummaryCtrl($scope) {
      var vm = this;
      vm.userId = $scope.userId;
      vm.identityUserId = $scope.identityUserId;
      vm.employeeId = $scope.employeeId;
      vm.PageEmptyMesssage = USER.ADMIN_EMPTYSTATE.PAGE_DETAIL;
      vm.FeatureEmptyMesssage = USER.ADMIN_EMPTYSTATE.FEATURE;
      vm.loginUser = BaseService.loginUser;
      vm.permissionsTabName = 'Permissions';
      vm.featuresTabName = 'Features';
      vm.currentTab = vm.permissionsTabName;
      let isPageList = true;
      vm.popup = {
        logout_user: false
      };

      // Call when change the permission/featuare tab
      vm.onTabChanges = (tabName) => {
        if (tabName === vm.permissionsTabName) {
          vm.currentTab = vm.permissionsTabName;
          vm.isFeatureNoDataFound = false;
        } else if (tabName === vm.featuresTabName) {
          vm.currentTab = vm.featuresTabName;
          vm.isPermissionNoDataFound = false;
        }
        isPageList = vm.currentTab === vm.permissionsTabName ? true : false;
      };

      /* Grid Headers for permissions tab */
      vm.sourceHeaderPermission = [{
        field: 'Apply',
        displayName: 'Select',
        width: '75',
        headerCellTemplate: '<md-checkbox class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" ng-model="grid.appScope.$parent.vm.Apply" \
                      ng-change="grid.appScope.$parent.vm.applyAll(grid.appScope.$parent.vm.Apply)"></md-checkbox>',
        cellTemplate: '<div class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" style="overflow:initial"><md-checkbox  ng-disabled="row.entity.isDisabledDelete"  ng-model="row.entity.isRecordSelectedForRemove" \
                      ng-change="grid.appScope.$parent.vm.setRemovePermission(row.entity)"></md-checkbox></div>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: false,
        enableColumnMoving: false,
        manualAddedCheckbox: true
      }, {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
        enableFiltering: false,
        enableSorting: false
      }, {
        field: 'menuName',
        displayName: 'Page',
          cellTemplate: '<div class="ui-grid-cell-contents"><md-icon role="img" md-font-icon="{{row.entity.iconClass}}" class="material-icons mat-icon"></md-icon>&nbsp;&nbsp;{{COL_FIELD}}</div>',
        width: '400'
      }, {
        field: 'roleList',
        displayName: 'Roles',
        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" ng-repeat="item in row.entity.roleListArray track by $index">{{item}} <br/></div>',
        width: '350'
      }
      ];

      /* Grid Headers for permisssions tab */
      vm.sourceHeaderFeature = [{
        field: 'Apply',
        displayName: 'Select',
        width: '75',
        headerCellTemplate: '<md-checkbox class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" ng-model="grid.appScope.$parent.vm.Apply" \
                      ng-change="grid.appScope.$parent.vm.applyAll(grid.appScope.$parent.vm.Apply)"></md-checkbox>',
        cellTemplate: '<div class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" style="overflow:initial"><md-checkbox  ng-disabled="row.entity.isDisabledDelete"  ng-model="row.entity.isRecordSelectedForRemove" \
                      ng-change="grid.appScope.$parent.vm.setRemoveFeature(row.entity)"></md-checkbox></div>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: false,
        enableColumnMoving: false,
        manualAddedCheckbox: true
      }, {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
        enableFiltering: false,
        enableSorting: false
      }, {
        field: 'featureName',
        displayName: 'Feature',
        cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
        width: '400'
      }, {
        field: 'roleList',
        displayName: 'Roles',
        cellTemplate: '<div style="overflow: hidden" class="ui-grid-cell-contents" ng-repeat="item in row.entity.roleListArray track by $index">{{item}} <br/></div>',
        width: '350'
      }
      ];

      /* set pagingInfo */
      const initPageInfo = () => {
        vm.pagingInfoPermission = {
          Page: 0,
          SortColumns: [],
          SearchColumns: [],
          userId: vm.userId,
          isPermissionTab: true
        };
        vm.pagingInfoFeature = {
          Page: 0,
          SortColumns: [],
          SearchColumns: [],
          userId: vm.userId,
          isPermissionTab: false
        };
      };
      initPageInfo();

      /* Set the value for option of Permission Grid */
      vm.gridOptionsPermission = {
        showColumnFooter: false,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: true,
        filterOptions: vm.pagingInfoPermission.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'Page Rights Summary.csv',
          CurrentPage: 'Page Rights Summary'
      };

      /* Set the value for option of Feature Grid */
      vm.gridOptionsFeature = {
        showColumnFooter: false,
        enableRowHeaderSelection: false,
        enableFullRowSelection: false,
        enableRowSelection: false,
        multiSelect: true,
        filterOptions: vm.pagingInfoFeature.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'Features Right Summary.csv',
        CurrentPage: 'Features Right Summary'
      };

      /* retrieve Page Rights Summary list*/
      vm.loadPermissionData = () => {
        vm.Apply = false;
        vm.cgBusyLoading = RolePagePermisionFactory.getRightsSummary().query(vm.pagingInfoPermission).$promise.then((pageRights) => {
          if (pageRights && pageRights.data && pageRights.data.pageList) {
            _.each(pageRights.data.pageList, (item) => {
              item.roleListArray = item.roleList ? item.roleList.split(',') : null;
            });
            vm.sourceDataPermission = pageRights.data.pageList;
            vm.currentDataPermission = vm.sourceDataPermission.length;
            vm.totalPermissionDataCount = pageRights.data.Count;

            if (!vm.gridOptionsPermission.enablePaging) {
              vm.gridOptionsPermission.gridApi.infiniteScroll.resetScroll();
            }
            vm.gridOptionsPermission.clearSelectedRows();
            if (vm.totalPermissionDataCount === 0) {
              if (vm.pagingInfoPermission.SearchColumns.length > 0) {
                vm.isPermissionNoDataFound = false;
                vm.PermissionEmptyState = 0;
              }
              else {
                vm.isPermissionNoDataFound = true;
                vm.PermissionEmptyState = null;
              }
            }
            else {
              vm.isPermissionNoDataFound = false;
              vm.PermissionEmptyState = null;
            }
            $timeout(() => {
              vm.resetSourceGridPermission();
              if (!vm.gridOptionsPermission.enablePaging && vm.totalPermissionDataCount === vm.currentDataPermission) {
                return vm.gridOptionsPermission.gridApi.infiniteScroll.dataLoaded(false, false);
              }
            });
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* retrieve Feature Rights Summary list*/
      vm.loadFeatureData = () => {
        vm.Apply = false;
        vm.cgBusyLoading = RolePagePermisionFactory.getRightsSummary().query(vm.pagingInfoFeature).$promise.then((featureRights) => {
          if (featureRights && featureRights.data && featureRights.data.featuresList) {
            _.each(featureRights.data.featuresList, (item) => {
              item.roleListArray = item.roleList ? item.roleList.split(',') : null;
            });
            vm.sourceDataFeature = featureRights.data.featuresList;
            vm.currentDataFeature = vm.sourceDataFeature.length;
            vm.totalFeatureDataCount = featureRights.data.Count;

            if (!vm.gridOptionsFeature.enablePaging) {
              vm.gridOptionsFeature.gridApi.infiniteScroll.resetScroll();
            }
            vm.gridOptionsFeature.clearSelectedRows();
            if (vm.totalFeatureDataCount === 0) {
              if (vm.pagingInfoFeature.SearchColumns.length > 0) {
                vm.isFeatureNoDataFound = false;
                vm.FeatureEmptyState = 0;
              }
              else {
                vm.isFeatureNoDataFound = true;
                vm.FeatureEmptyState = null;
              }
            }
            else {
              vm.isFeatureNoDataFound = false;
              vm.FeatureEmptyState = null;
            }
            $timeout(() => {
              vm.resetSourceGridFeature();
              if (!vm.gridOptionsFeature.enablePaging && vm.totalFeatureDataCount === vm.currentDataFeature) {
                return vm.gridOptionsFeature.gridApi.infiniteScroll.dataLoaded(false, false);
              }
            });
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* select all checkbox (for both permission/feature grid) */
      vm.applyAll = (applyAll) => {
        if (applyAll) {
          isPageList ? _.map(vm.sourceDataPermission, selectPermission) : _.map(vm.sourceDataFeature, selectFeature);
        } else {
          isPageList ? _.map(vm.sourceDataPermission, unselectPermission) : _.map(vm.sourceDataFeature, unselectfeature);
        }
      };

      /* Permission grid row set select/unselect */
      const selectPermission = (row) => {
        row.isRecordSelectedForRemove = true;
        vm.gridOptionsPermission.gridApi.selection.selectRow(row);
      };
      const unselectPermission = (row) => {
        row.isRecordSelectedForRemove = false;
        vm.gridOptionsPermission.clearSelectedRows();
      };
      vm.setRemovePermission = (row) => {
        var totalItem = vm.sourceDataPermission;
        var selectItem = _.filter(vm.sourceDataPermission, (data) => data.isRecordSelectedForRemove === true);
        if (row.isRecordSelectedForRemove) {
          vm.gridOptionsPermission.gridApi.selection.selectRow(row);
        } else {
          vm.gridOptionsPermission.gridApi.selection.unSelectRow(row);
        }
        if (totalItem.length === selectItem.length) {
          vm.Apply = true;
        } else {
          vm.Apply = false;
        }
      };

      /* Permission grid row set select/unselect */
      const selectFeature = (row) => {
        row.isRecordSelectedForRemove = true;
        vm.gridOptionsFeature.gridApi.selection.selectRow(row);
      };
      const unselectfeature = (row) => {
        row.isRecordSelectedForRemove = false;
        vm.gridOptionsFeature.clearSelectedRows();
      };
      vm.setRemoveFeature = (row) => {
        var totalItem = vm.sourceDataFeature;
        var selectItem = _.filter(vm.sourceDataFeature, (data) => data.isRecordSelectedForRemove === true);
        if (row.isRecordSelectedForRemove) {
          vm.gridOptionsFeature.gridApi.selection.selectRow(row);
        } else {
          vm.gridOptionsFeature.gridApi.selection.unSelectRow(row);
        }
        if (totalItem.length === selectItem.length) {
          vm.Apply = true;
        } else {
          vm.Apply = false;
        }
      };

      /* delete request list */
      vm.deleteRecord = (row) => {
        let selectedIDs = [];
        if (row) {
          selectedIDs.push(isPageList ? row.pageID : row.featureID);
        } else {
          vm.selectedRows = isPageList ? vm.selectedRowsListPermission : vm.selectedRowsListFeature;
          if (vm.selectedRows.length > 0) {
            selectedIDs = vm.selectedRows.map((item) => isPageList ? item.pageID : item.featureID);
          }
        }
        if (selectedIDs) {
          if (vm.loginUser && vm.loginUser.userid === vm.userId) {
            showInformationForReLoginOfCurrentUser(selectedIDs);
          } else {
            showInformationForSendNotificationOfOtherUser(selectedIDs);
          }
        };
      };

      /* delete multiple records frfom grid */
      vm.deleteMultipleData = () => {
        vm.deleteRecord();
      };

      /* Function of show information popup for send notification of other user and delete rights */
      const showInformationForSendNotificationOfOtherUser = (selectedIDs) => {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.CHANGE_PERMISSION_SEND_NOTIFICATION);
        const buttonsList = [{ name: 'Cancel' }, // cancel button
        { name: CORE.MESSAGE_CONSTANT.BUTTON_FOR_Continue }, // continue btn
        { name: CORE.MESSAGE_CONSTANT.BUTTON_FOR_SEND_NOTIFICATION } // sendNotification btn
        ];
        const data = {
          messageContent: messageContent,
          buttonsList: buttonsList
        };
        return DialogFactory.dialogService(
          CORE.MULTIPLE_BUTTONS_DIALOG_POPUP_CONTROLLER,
          CORE.MULTIPLE_BUTTONS_DIALOG_POPUP_VIEW,
          null,
          data).then(() => { // Empty
          },
            (response) => {
              if (response === buttonsList[0].name) {
                // cancel
                isPageList ? vm.loadPermissionData() : vm.loadFeatureData();
              } else if (response === buttonsList[1].name) {
                // continue - do not notify
                confirmDelete(selectedIDs);
              } else {
                // send notification
                confirmDelete(selectedIDs);
                sendNotificationAllActiveSession();
              }
            }, (err) => BaseService.getErrorLog(err));
      };

      /* Function of show information popup for logout of current userand delete rights */
      const showInformationForReLoginOfCurrentUser = (selectedIDs) => {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.CHANGE_PERMISSION_LOGOUT);
        const buttonsList = [{ name: 'Cancel' }, // cancel button
        { name: CORE.MESSAGE_CONSTANT.BUTTON_FOR_Continue }, // continue btn
        { name: CORE.MESSAGE_CONSTANT.BUTTON_FOR_LOGOUT } // logout btn
        ];
        const data = {
          messageContent: messageContent,
          buttonsList: buttonsList
        };
        return DialogFactory.dialogService(
          CORE.MULTIPLE_BUTTONS_DIALOG_POPUP_CONTROLLER,
          CORE.MULTIPLE_BUTTONS_DIALOG_POPUP_VIEW,
          null,
          data).then(() => { // Empty
          },
            (response) => {
              if (response === buttonsList[0].name) {
                // cancel
                isPageList ? vm.loadPermissionData() : vm.loadFeatureData();
              } else if (response === buttonsList[2].name) {
                // logout
                confirmDelete(selectedIDs);
                BaseService.logoutWithOperationConfirmation(vm);
              } else {
                // continue
                confirmDelete(selectedIDs);
              }
            }, (err) => BaseService.getErrorLog(err));
      };

      /* calling api for deleting records */
      const confirmDelete = (selectedIDs) => {
        const objIDs = {
          userId: vm.userId,
          identityUserId: vm.identityUserId,
          pageIDList: isPageList ? selectedIDs : null,
          featureIDList: isPageList ? null : selectedIDs,
          isActive: false
        };
        vm.cgBusyLoading = RolePagePermisionFactory.deleteRolesRights().query(objIDs).$promise.then((res) => {
          if (res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            isPageList ? vm.loadPermissionData() : vm.loadFeatureData();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* Function for send notification when user change the other user role-right-permiddion */
      const sendNotificationAllActiveSession = () => {
        RolePagePermisionFactory.sendNotificationOfRightChanges().query({ id: vm.employeeId }).$promise.then(() => { // Empty
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* refresh page summary */
      vm.refreshPageSummary = () => {
        vm.loadPermissionData();
      };

      /* refresh feature summary */
      vm.refreshFeatureSummary = () => {
        vm.loadFeatureData();
      };
    }
  }
})();
