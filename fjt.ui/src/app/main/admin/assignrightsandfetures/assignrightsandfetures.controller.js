(function () {
  'use strict';

  angular.module('app.admin.assignrightsandfetures')
    .controller('assignRightsAndFeturesController', assignRightsAndFeturesController);

  /** @ngInject */
  function assignRightsAndFeturesController($timeout, $scope, CORE ,CertificateStandardFactory, NotificationFactory, TRANSACTION,
    RolePagePermisionFactory, RoleFactory, UserFactory, BaseService, DialogFactory, USER, $q, $stateParams, RawdataCategoryFactory, CONFIGURATION) {
        var vm = this;
        vm.isUpdatable = true;
        vm.view = true;
        vm.identityUserId = $scope.identityUserId;
        vm.roleId = $scope.roleId;
        vm.employeeName = $scope.employeeName;
        vm.pageName = $scope.pageName;
        vm.userProfilePage = CORE.USER_PROFILE_LABEL;
        vm.EmployeePage = USER.ADMIN_EMPLOYEE_LABEL;
        vm.RolePage = USER.ADMIN_USER_ROLE_LABEL;
        vm.PageRightsRole = USER.ADMIN_PAGERIGHT_ROLE_LABEL;
        vm.PageRightsUser = USER.ADMIN_PAGERIGHT_USER_LABEL;
        vm.RoleEmptyMesssage = USER.ADMIN_EMPTYSTATE.ROLE;
        vm.PageEmptyMesssage = USER.ADMIN_EMPTYSTATE.PAGE_DETAIL;
        vm.FeatureEmptyMesssage = USER.ADMIN_EMPTYSTATE.FEATURE;
        vm.dbViewEmptyMessage = CONFIGURATION.CONFIGURATION_EMPTYSTATE.CHARTRAWDATACATEGORY;
        vm.isHideDelete = true;
        vm.loginUser = BaseService.loginUser;
        vm.userId = vm.loginUser.userid;
        vm.selectEmployeeId = $scope.employeeId;
        vm.isSelectedPageOrFeature = [];
        vm.selectedRoleList = [];
        vm.userRoleList = [];
        vm.isAllPermissionRight = false;
        vm.isAllPageRight = false;
        vm.isAllFeatureRight = false;
        vm.lastRoll;
        vm.selectedPageorFeature = {};
        vm.currentRole = {};
        vm.currentRole.roleId = vm.roleId;
        vm.popup = {
          logout_user: false
        };
        vm.AllPages = [];
        vm.selectedFeature = [];
        vm.selectedPages = [];
        vm.isViewOnly = $scope.isViewOnly ? $scope.isViewOnly : false;
        vm.isAssignRightsMulitpleUser = false;
        vm.AssignRightsandFeaturesRole = USER.ADMIN_ASSIGNRIGHTSANDFETURES_ROLE_LABEL;
        vm.AssignRightsandFeaturesUser= USER.ADMIN_ASSIGNRIGHTSANDFETURES_USER_LABEL;
        vm.constantAssignRightsAndFeatures = CORE.AssignRightsAndFeatures;
        vm.permissionsTabName = vm.constantAssignRightsAndFeatures.PERMISSIONS;
        vm.featuresTabName = vm.constantAssignRightsAndFeatures.FEATURES;
        vm.rid = $stateParams.id ? $stateParams.id : null;
        vm.currentTab = vm.constantAssignRightsAndFeatures.PERMISSIONS;
        vm.isSearch = false;
        vm.isFeatureSearch = false;
        //Added by JAY SOLANKI for display button text conditionally
        if(vm.currentTab === vm.constantAssignRightsAndFeatures.PERMISSIONS){
          vm.selectAndAssign = vm.constantAssignRightsAndFeatures.PagePermissionToUser;
        }

        vm.roles = [];
        /*Used to set the count of each row of selected pages count*/
        vm.selectedPageCount = {
          selectedReadOnlyMenuCount: 0,
          selectedReadAndWriteMenuCount: 0,
          selectedIsActiveMenuCount: 0,
          selectedBookmarkMenuCount: 0,
          selectedShowInHomePageMenuCount: 0,
          selectedFeturesAndRightsCount: 0
        };

        vm.pages = [];
        // List for multiple selection of pages rights
        vm.pageSourceHeader = [
        {
          field: 'isPageAccess',
          // cellClass: 'gridCellColor',
          width: '75',
          maxWidth: '75',
          headerCellTemplate: '<md-checkbox class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" ng-model="grid.appScope.$parent.vm.isAllPageRight" \
          ng-change="grid.appScope.$parent.vm.checkAllRight(\'Page\', grid.appScope.$parent.vm.isAllPageRight)"></md-checkbox>',
          cellTemplate: '<div class ="ui-grid-cell-contents text-center" style="overflow:initial">'
          + '<md-checkbox '
          + 'ng-model="row.entity.isPageChecked" '
          + 'ng-change="grid.appScope.$parent.vm.checkRight(\'PermissionActive\', row.entity)" '
          + 'ng-checked="row.entity.isPageChecked==\'1\'"></md-checkbox> '
          +'</div>',
          enableFiltering: false,
          enableSorting: false,
          exporterSuppressExport: true,
          pinnedLeft: false,
          allowCellFocus: false,
          enableColumnMoving: false,
          manualAddedCheckbox: true
        },
        {
          field: 'Action',
          cellClass: 'gridCellColor layout-align-center-center',
          displayName: 'Action',
          width: '90',
          cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
          enableFiltering: false,
          enableSorting: false,
          exporterSuppressExport: true,
          enableCellEdit: false
        },
        {
          field: 'menuName',
          width: '84%',
          displayName: 'Page',
          cellTemplate: `<div class="ui-grid-cell-contents text-left" ng-if="(row.entity.pageRoute && row.entity.isAllowAsHomePage)" ng-click="grid.appScope.$parent.vm.redirectToPage(row.entity)">
                            <md-icon role="img" md-font-icon="{{row.entity.iconClass}}" class="material-icons mat-icon"></md-icon>&nbsp;&nbsp;
                                <span ng-class="{'underline': (row.entity.pageRoute && row.entity.isAllowAsHomePage)}">
                                  {{COL_FIELD}}
                                </span>
                        </div>
                        <div class="ui-grid-cell-contents text-left" ng-if="!(row.entity.pageRoute && row.entity.isAllowAsHomePage)">
                            <md-icon role="img" md-font-icon="{{row.entity.iconClass}}" class="material-icons mat-icon"></md-icon>&nbsp;&nbsp;
                                <span> {{COL_FIELD}} </span>
                        </div>`,
          enableCellEdit: false
        }];

         // List for multiple selection of feature rights
        vm.featureSourceHeader = [
        {
            field: 'isActive',
            width: '75',
            maxWidth: '75',
            headerCellTemplate: '<md-checkbox class ="ui-grid-cell-contents cm-all-mfg-grid-checkbox" ng-model="grid.appScope.$parent.vm.isAllFeatureRight" \
            ng-change="grid.appScope.$parent.vm.checkAllRight(\'Feature\', grid.appScope.$parent.vm.isAllFeatureRight)"></md-checkbox>',
            cellTemplate: '<div class ="ui-grid-cell-contents text-center" style="overflow:initial">'
            + '<md-checkbox '
            + 'ng-model="row.entity.isActive" '
            + 'ng-change="grid.appScope.$parent.vm.checkRight(\'Feature\', row.entity)" '
            + 'ng-checked="row.entity.isActive==\'1\'"></md-checkbox> '
            +'</div>',
            enableFiltering: false,
            enableSorting: false,
            exporterSuppressExport: true,
            pinnedLeft: false,
            allowCellFocus: false,
            enableColumnMoving: false,
            manualAddedCheckbox: true
          },
          {
            field: 'Action',
            cellClass: 'gridCellColor layout-align-center-center',
            displayName: 'Action',
            width: '90',
            cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
            enableFiltering: false,
            enableSorting: false,
            exporterSuppressExport: true,
            // pinnedLeft: true,
            enableCellEdit: false
          },
          {
            field: 'featureName',
            width: '84%',
            displayName: 'Feature',
            cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
            enableCellEdit: false
        }];

        /* Redirect To Page */
        vm.redirectToPage = (page) => {
          if (!page.popupFunName) {
            if (page && page.pageRoute) {
              if (page.paramDet) {
                BaseService.openInNew(page.pageRoute, eval(page.paramDet));
              }
              else {
                BaseService.openInNew(page.pageRoute);
              }
            }
          }
          else {
            vm.openPopup(page.popupFunName);
          }
        };

        /* open directly accessible popup */
        vm.openPopup = (popupFunName) => {
          BaseService[popupFunName].call();
        };

        // Set the value on page is initialize
        const initPageInfo = () => {
          vm.pagingInfo = {
            Page: 0,
            SortColumns: [['accessLevel', 'ASC']],
            SearchColumns: []
          };
          vm.rightsPagingInfo = {
            Page: 0,
            SortColumns: [['menuName', 'ASC']],
            SearchColumns: []
          };
          vm.featurePagingInfo = {
            Page: 0,
            SortColumns: [['featureName', 'ASC']],
            SearchColumns: []
          };

          if (!vm.rightsPagingInfo.RoleId && !vm.isRoleShow) {
            vm.rightsPagingInfo.TabName = vm.permissionsTabName;
            vm.rightsPagingInfo.RoleId = vm.roleId;
          }
        };

        initPageInfo();

        // Set the value for option of Page Grid
        vm.pageGridOptions = {
          showColumnFooter: false,
          enableRowHeaderSelection: false,
          enableFullRowSelection: false,
          enableRowSelection: false,
          multiSelect: true,
          filterOptions: vm.rightsPagingInfo.SearchColumns,
          exporterMenuCsv: true,
          exporterCsvFilename: 'Page rights.csv',
          hideMultiDeleteButton: true
        };

        // Set the value for option of Feature Grid
        vm.featureGridOptions = {
          showColumnFooter: false,
          enableRowHeaderSelection: false,
          enableFullRowSelection: false,
          enableRowSelection: false,
          multiSelect: true,
          filterOptions: vm.featurePagingInfo.SearchColumns,
          exporterMenuCsv: true,
          exporterCsvFilename: 'features rights.csv',
          hideMultiDeleteButton: true
        };
        //set the value option of standard Grid

        // Get the All page list
        vm.getPageList = () => {
          vm.rightsPagingInfo.RoleId = vm.loginUser.defaultLoginRoleID;
          vm.rightsPagingInfo.UserId = vm.userId;
          if (vm.rightsPagingInfo && vm.rightsPagingInfo.RoleId || vm.rightsPagingInfo.RoleId === 0) {
            vm.rightsPagingInfo.Page = 0;
            // vm.rightsPagingInfo.isShowDefault = (vm.pageName === vm.AssignRightsandFeaturesRole) ? 1 : 0;
            vm.rightsPagingInfo.isShowDefault = (vm.showDefaultRights) ? 1 : 0;
            vm.cgBusyLoading = RolePagePermisionFactory.pagePermission(vm.rightsPagingInfo).query().$promise.then((pageRights) => {
              vm.pages = [];
              if (vm.rightsPagingInfo.SearchColumns && vm.rightsPagingInfo.SearchColumns.length === 0) {
                vm.AllPages = pageRights.data.pages;
              }
              _.map(pageRights.data.pages, (data) => {
                data.isActive = data.isActive === 1 ? true : false;
                data.hasDatailData = data.rightsCount === 1 ? true : false;
                data.isPageChecked = false;
                if (data.isDisplay) {
                  vm.pages.push(data);
                  $scope.isPageChange = false;
                }
              });
              vm.totalPageDataCount = vm.pages.length;
              vm.pagesCurrentdata = vm.pages.length;
              vm.isUpdatebleForNoRowForPermissions = (vm.totalPageDataCount > 0);
              
              if(vm.rightsPagingInfo.SearchColumns.length > 0){
                vm.isSearch = true;
                vm.checkAllRight('Page', false);
              } else {
                vm.isSearch = false;
              }
              if (vm.totalPageDataCount === 0) {
                if (vm.rightsPagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
                  vm.isPageNoDataFound = false;
                  vm.pageEmptyState = 0;
                }
                else {
                  vm.isPageNoDataFound = true;
                  vm.pageEmptyState = null;
                }
              }
              else {
                vm.isPageNoDataFound = false;
                vm.pageEmptyState = null;
              }
              bindSelectedPagePermission();
              $timeout(() => {
                vm.resetPageSourceGrid();
                if (!vm.pageGridOptions.enablePaging && vm.totalPageDataCount === vm.pagesCurrentdata) {
                  return vm.pageGridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
                }
              });
            }).catch((error) => BaseService.getErrorLog(error));
          }
        };

        function bindSelectedPagePermission() {
          if (vm.rightsPagingInfo.isShowDefault && vm.showDefaultRights) {
            vm.selectedPages = [];
            _.filter(vm.pages, (item) => item.userID = vm.userId);
            _.each(vm.pages, (objPage) => {
              if (objPage.isPageChecked) {
                objPage.isDefaultActive = objPage.isPageChecked === 1 ? true : false;/*Used this key to highlight default rights*/
              }
            });
            vm.selectedPages = vm.pages;
          } else {
            if (vm.pages && vm.pages.length > 0 && vm.selectedPages && vm.selectedPages.length > 0) {
              _.each(vm.pages, (objPage) => {
                const isselectedPage = _.find(vm.selectedPages, (objselectedPage) => objselectedPage.pageID === objPage.pageID);
                if (isselectedPage) {                
                  objPage.isPageChecked = isselectedPage.isPageChecked;
                }
              });
            }
          }
          const checkFalsePermission = _.some(vm.pages, (data) => !data.isPageChecked);
          if (!checkFalsePermission && vm.pages && vm.pages.length > 0) {
            vm.isAllPageRight = true;
          } else {
            vm.isAllPageRight = false;
          }

        /*Used to set selected pages count with each column*/

          vm.selectedPageCount.selectedIsActiveMenuCount = _.filter(vm.pages, (item) => item.isPageChecked).length;
        };

        // Get the page list after scroll
        vm.getPageDataDown = () => {
          vm.rightsPagingInfo.Page = vm.rightsPagingInfo.Page + 1;
          vm.cgBusyLoading = RolePagePermisionFactory.pagePermission(vm.rightsPagingInfo).query().$promise.then((pageRights) => {
            vm.pages = vm.pages.concat(pageRights.data.pages);
            vm.pagesCurrentdata = vm.pages.length;
            _.map(pageRights.data.pages, (data) => {
              data.isPageChecked = data.isPageChecked === 1 ? true : false;
              data.hasDatailData = data.rightsCount === 1 ? true : false;
              data.isPageChecked = false;
              if (data.isDisplay) {
                vm.pages.push(data);
                $scope.isPageChange = false;
              }
            });
            bindSelectedPagePermission();
            $timeout(() => {
              vm.resetPageSourceGrid();
              return vm.pageGridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalPageDataCount !== vm.pagesCurrentdata ? true : false);
            });
          }).catch((error) => BaseService.getErrorLog(error));
        };

        // Get the All feature list
        function bindSelectedFeature() {
          if (vm.featurePagingInfo.isShowDefault && vm.showDefaultRights) {
            vm.selectedFeature = vm.features;
            highlightFeaturesRights();
          } else {
            if (vm.features && vm.features.length > 0 && vm.selectedFeature && vm.selectedFeature.length > 0) {
              _.each(vm.features, (objFeature) => {
                const isselectedFeature = _.find(vm.selectedFeature, (objselectedFeature) => objselectedFeature.featureID === objFeature.featureID);
                if (isselectedFeature) {
                  objFeature.isActive = isselectedFeature.isActive;
                }
              });
            }
          }
          const checkFalseFeature = _.some(vm.features, (data) => !data.isActive);
          if (!checkFalseFeature && vm.features && vm.features.length > 0) {
            vm.isAllFeatureRight = true;
          } else {
            vm.isAllFeatureRight = false;
          }
          vm.selectedPageCount.selectedFeturesAndRightsCount = _.filter(vm.features, (item) => item.isActive).length;
        }
        // Get the All feature list
        vm.getFeatureList = () => {
          vm.featurePagingInfo.RoleId = vm.loginUser.defaultLoginRoleID;
          vm.rightsPagingInfo.UserId = vm.userId;
          if (vm.featurePagingInfo && vm.featurePagingInfo.RoleId || vm.featurePagingInfo.RoleId === 0) {
            vm.featurePagingInfo.Page = 0;
            vm.featurePagingInfo.isShowDefault = 0;
            vm.cgBusyLoading = RolePagePermisionFactory.pagePermission(vm.featurePagingInfo).query().$promise.then((featureRights) => {
              //after filter clear get all featuredata
              vm.features = [];
              vm.features = featureRights.data.features;
              vm.totalFeatureDataCount = featureRights.data.Count;
              vm.isUpdatebleForNoRowForFeatures = (vm.totalFeatureDataCount > 0);
              _.map(vm.features, (data) => {
                data.hasDatailData = data.rightsCount === 1 ? true : false;
              });
              vm.featuresCurrentdata = vm.features.length;
              if(vm.featurePagingInfo.SearchColumns.length > 0){
                vm.isFeatureSearch = true;
                vm.checkAllRight('Feature', false);
              } else {
                vm.isFeatureSearch = false;
              }
              if (vm.totalFeatureDataCount === 0) {
                if (vm.featurePagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
                  vm.isFeatureNoDataFound = false;
                  vm.featureEmptyState = 0;
                }
                else {
                  vm.isFeatureNoDataFound = true;
                  vm.featureEmptyState = null;
                }
              }
              else {
                vm.isFeatureNoDataFound = false;
                vm.featureEmptyState = null;
              }

              bindSelectedFeature();

              $timeout(() => {
                vm.resetFeatureSourceGrid();
                if (!vm.featureGridOptions.enablePaging && vm.totalFeatureDataCount === vm.featuresCurrentdata) {
                  return vm.featureGridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
                }
              });
            }).catch((error) => BaseService.getErrorLog(error));
          }
        };

        // Get the feature list after scroll
        vm.getFeatureDataDown = () => {
          vm.featurePagingInfo.Page = vm.featurePagingInfo.Page + 1;
          vm.cgBusyLoading = RolePagePermisionFactory.pagePermission(vm.featurePagingInfo).query().$promise.then((featureRights) => {
            vm.features = vm.features.concat(featureRights.data.features);
            vm.featuresCurrentdata = vm.features.length;
            _.map(vm.features, (data) => {
              data.hasDatailData = data.rightsCount === 1 ? true : false;
            });
            bindSelectedFeature();
            $timeout(() => {
              vm.resetFeatureSourceGrid();
              return vm.featureGridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalFeatureDataCount !== vm.featuresCurrentdata ? true : false);
            });
          }).catch((error) => BaseService.getErrorLog(error));
        };

        // Call when change the permission/featuare tab
        vm.onTabChanges = (TabName) => {
          vm.isStandardTab = false;
          vm.isDataSourceTab = false;
          vm.isFeatureTab = false;
          vm.isPermissionTab = false;
          vm.selectedStandard = [];
          vm.selectedDataSource = [];
          vm.selectedFeature = [];
          vm.selectedPages = [];
          vm.showDefaultRights = false;
          if (!TabName || TabName === vm.permissionsTabName) {
            vm.currentTab = vm.permissionsTabName;
            vm.isPermissionTab = true;
            vm.selectAndAssign = vm.constantAssignRightsAndFeatures.PagePermissionToUser;
          } else if (!TabName || TabName === vm.featuresTabName) {
            vm.currentTab = vm.featuresTabName;
            vm.isFeatureTab = true;
              vm.selectAndAssign = vm.constantAssignRightsAndFeatures.FeatureRightToUser;
          }
          $scope.isRightChange = false;
          $scope.isFeatureChange = false;
        };

      // Call function when check checkbox of particular right of page
      vm.checkRight = (rightName, row) => {
        if (row) {
          if (rightName === vm.constantAssignRightsAndFeatures.RightForPermissionActive) {
            if (row.isPageChecked) {
              const checkFalsePermission = _.some(vm.pages, (data) => !data.isPageChecked);
              if (!checkFalsePermission) {
                vm.isAllPageRight = true;
              }
            } else {
              vm.isAllPageRight = false;
            }
            vm.showDefaultRights = false;
            $scope.isRightChange = true;
            const isPageAdded = _.find(vm.selectedPages, (objPage) => objPage.pageID === row.pageID);
            if (isPageAdded) {
              isPageAdded.isPageChecked = row.isPageChecked;
            } else {
              vm.selectedPages.push(row);
            }
            if (row.isPageChecked) {
              vm.pageGridOptions.gridApi.selection.selectRow(row);
            } else {
              vm.pageGridOptions.gridApi.selection.unSelectRow(row);
            }
            vm.selectedPageCount.selectedIsActiveMenuCount = _.filter(vm.pages, (item) => item.isPageChecked).length;
          } else if (rightName === vm.constantAssignRightsAndFeatures.RightForFeature) {
            if (row.isActive) {
              const checkFalseFeature = _.some(vm.features, (data) => !data.isActive);
              if (!checkFalseFeature) {
                vm.isAllFeatureRight = true;
              } else {
                vm.isAllFeatureRight = false;
              }
            } else {
              vm.isAllFeatureRight = false;
            }
            $scope.isFeatureChange = true;
            const isFeatureAdded = _.find(vm.selectedFeature, (objFeature) => objFeature.featureID === row.featureID);
            if (isFeatureAdded) {
              isFeatureAdded.isActive = row.isActive;
            } else {
              vm.selectedFeature.push(row);
            }
            if (row.isActive) {
              vm.featureGridOptions.gridApi.selection.selectRow(row);
            } else {
              vm.featureGridOptions.gridApi.selection.unSelectRow(row);
            }
            vm.selectedPageCount.selectedFeturesAndRightsCount = _.filter(vm.features, (item) => item.isActive).length;
          }
        }
      };
      
      /* reset filter */
      vm.resetAllFilter = () => {
        if (vm.currentTab === vm.constantAssignRightsAndFeatures.PERMISSIONS) {
          vm.selectedPages = [];
          vm.pageGridOptions.gridApi.grid.clearAllFilters();
          vm.pageGridOptions.clearSelectedRows();
        } else {
          vm.selectedFeature = [];
          vm.featureGridOptions.gridApi.grid.clearAllFilters();
          vm.featureGridOptions.clearSelectedRows();
        }
      };

        // Call function when check all check box of right
        vm.checkAllRight = (rightName, isChecked) => {
          if (rightName === vm.constantAssignRightsAndFeatures.RightForPage) {
            if (vm.rightsPagingInfo.SearchColumns && vm.rightsPagingInfo.SearchColumns.length > 0) {
              _.filter(vm.pages, (objPage) => {
                objPage.isPageChecked = isChecked;
                if(isChecked){
                  vm.pageGridOptions.gridApi.selection.selectRow(objPage);
                } else {
                  vm.pageGridOptions.clearSelectedRows();
                }
                const isPageAdded = _.find(vm.selectedPages, (objSelectedPage) => objSelectedPage.pageID === objPage.pageID);
                if (isPageAdded) {
                  isPageAdded.isPageChecked = objPage.isPageChecked;
                } else {
                  vm.selectedPages.push(objPage);
                }
              });
            } else {
              _.each(vm.pages, (objPage) => {
                objPage.isPageChecked = isChecked;
                if(isChecked){
                  vm.pageGridOptions.gridApi.selection.selectRow(objPage);
                } else {
                  vm.pageGridOptions.clearSelectedRows();
                }
                const isPageAdded = _.find(vm.selectedPages, (objSelectedPage) => objSelectedPage.pageID === objPage.pageID);
                if (isPageAdded) {
                  isPageAdded.isPageChecked = objPage.isPageChecked;
                } else {
                  vm.selectedPages.push(objPage);
                }
              });
            }
            $scope.isRightChange = true;
            vm.selectedPageCount.selectedFeturesAndRightsCount = _.filter(vm.pages, (item) => item.isPageChecked).length;
          }
          else if (rightName === vm.constantAssignRightsAndFeatures.RightForFeature) {
            if (vm.featurePagingInfo.SearchColumns && vm.featurePagingInfo.SearchColumns.length > 0) {
              _.filter(vm.features, (objFeature) => {
                objFeature.isActive = isChecked;
                if(isChecked){
                  vm.featureGridOptions.gridApi.selection.selectRow(objFeature);
                } else {
                  vm.featureGridOptions.clearSelectedRows();
                }
                const isFeatureAdded = _.find(vm.selectedFeature, (objSelectedFeature) => objSelectedFeature.featureID === objFeature.featureID);
                if (isFeatureAdded) {
                  isFeatureAdded.isActive = objFeature.isActive;
                } else {
                  vm.selectedFeature.push(objFeature);
                }
              });
            } else {
              _.each(vm.features, (objFeature) => {
                objFeature.isActive = isChecked;
                if(isChecked){
                  vm.featureGridOptions.gridApi.selection.selectRow(objFeature);
                } else {
                  vm.featureGridOptions.clearSelectedRows();
                }
                const isFeatureAdded = _.find(vm.selectedFeature, (objSelectedFeature) => objSelectedFeature.featureID === objFeature.featureID);
                if (isFeatureAdded) {
                  isFeatureAdded.isActive = objFeature.isActive;
                } else {
                  vm.selectedFeature.push(objFeature);
                }
              });
            }
            $scope.isFeatureChange = true;
            vm.selectedPageCount.selectedFeturesAndRightsCount = _.filter(vm.features, (item) => item.isActive).length;
          }
        };

        // Call when change tab for show confirmation alert for save changes
        vm.isStepValid = function (step) {
          switch (step) {
            case 0: {
              if ($scope.isRightChange) {
                return showWithoutSavingAlertTab();
              }
              else {
                vm.pageGridOptions.gridApi.grid.clearAllFilters();
                return true;
              }
              break;
            }
            case 1: {
              if ($scope.isFeatureChange) {
                return showWithoutSavingAlertTab();
              }
              else {
                vm.featureGridOptions.gridApi.grid.clearAllFilters();
                return true;
              }
              break;
            }
          }
        };

        // Function of confirmation alert of change tab
        const showWithoutSavingAlertTab = () => {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE_FOR_TAB);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON_FOR_TAB,
            canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
          };
          return DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              if ($scope.isRightChange) {
                vm.selectedPages = [];
                vm.pageGridOptions.gridApi.grid.clearAllFilters();
              }
              if ($scope.isFeatureChange) {
                vm.selectedFeature = [];
                vm.featureGridOptions.gridApi.grid.clearAllFilters();
              }
              return true;
            }
          }).catch((error) => BaseService.getErrorLog(error));
        };

        /*Used to show default rights and feature role wise*/
        vm.onShowDefaultRights = (msWizard) => {
          if (vm.showDefaultRights) {
            if (vm.currentTab === vm.permissionsTabName) {
              vm.rightsPagingInfo.isShowDefault = vm.showDefaultRights ? 1 : 0;
              $scope.isRightChange = true;
              vm.getPageList();
            } else if (vm.currentTab === vm.featuresTabName) {
              vm.featurePagingInfo.isShowDefault = vm.showDefaultRights ? 1 : 0;
              $scope.isFeatureChange = true;
              vm.getFeatureList();
            }
          }
          else {
            if (msWizard.selectedIndex === 0) {
              vm.selectedPages = [];
              vm.getPageList();
            } else {
              vm.selectedFeature = [];
              vm.getFeatureList();
            }
          }
        };

        const highlightFeaturesRights = () => {
          // _.filter(vm.features, (item) => {
          //   item.isDefaultActive = item.isActive === 1 ? true : false; /*Used this key to highlight default rights*/
          // });
          if (vm.features.length > 0) {
            const checkFalseFeature = _.some(vm.features, (data) => !data.isActive);
            if (!checkFalseFeature) {
              vm.isAllFeatureRight = true;
            } else {
              vm.isAllFeatureRight = false;
            }
          } else {
            vm.isAllFeatureRight = false;
          }

          vm.selectedPageCount.selectedFeturesAndRightsCount = _.filter(vm.features, (item) => item.isActive).length;
        };

        /* Update Assign page or feature rights */
        vm.updateRecord = (row, event) => {
          const selectedpagesorfeatures = [];
          vm.data = {};
          vm.selectedPageorFeature = {};
          // Object with get all details and send to ASSIGNRIGHTSANDFEATURES_POPUP
          vm.data = {
            employeeId:  vm.loginUser.employee.id,
            selectedCurrentRole: vm.currentRole,
            selectedCriteria : vm.currentTab,
            userId: vm.userId,
            isActionSelected: vm.constantAssignRightsAndFeatures.EDIT,
            isFrom: vm.constantAssignRightsAndFeatures.Action
          };
          if(vm.currentTab === vm.constantAssignRightsAndFeatures.PERMISSIONS){
            if(row.entity){
              selectedpagesorfeatures.push(row.entity);
              vm.selectedPageorFeature.pageOrFeatureId = row.entity.pageID;
              vm.selectedPageorFeature.pageOrFeatureName = row.entity.menuName;
              vm.data.selectedFeatureOrPage = selectedpagesorfeatures;
              vm.data.selectedPageOrFeature= vm.selectedPageorFeature;
              vm.data.titleForPopupHeader = vm.constantAssignRightsAndFeatures.PagePermissionToUser;
            }
          } else {
            if(row.entity){
              selectedpagesorfeatures.push(row.entity);
              vm.selectedPageorFeature.pageOrFeatureId = row.entity.featureID;
              vm.selectedPageorFeature.pageOrFeatureName = row.entity.featureName;
              vm.data.selectedFeatureOrPage = selectedpagesorfeatures;
              vm.data.selectedPageOrFeature= vm.selectedPageorFeature;
              vm.data.titleForPopupHeader = vm.constantAssignRightsAndFeatures.FeatureRightToUser;
            }
          }

          //OPEN Popup for get employee list which is based for everythinsg
          //1. Selected Pages (View / Mulitple selected)
          //2. Selected Features (View / Mulitple selected)
          if(vm.data.selectedFeatureOrPage && vm.data.selectedFeatureOrPage.length > 0){
            DialogFactory.dialogService(
                CORE.ASSIGNRIGHTSANDFEATURES_POPUP_CONTROLLER,
                CORE.ASSIGNRIGHTSANDFEATURES_POPUP_VIEW,
                event,
                vm.data).then(() => { // Success Section
                },(data) => {
                  if (data) {
                    if(vm.currentTab === vm.constantAssignRightsAndFeatures.PERMISSIONS){
                      vm.getPageList();
                      vm.pages = [];
                      vm.selectedPages = [];
                      $scope.isRightChange = false;
                      vm.isAllPageRight = false;
                    }else{
                      vm.getFeatureList();
                      vm.features = [];
                      vm.selectedFeature = [];
                      $scope.isFeatureChange = false;
                      vm.isAllFeatureRight = false;
                    }
                  }
                }, (error) => {
                    BaseService.getErrorLog(error);
                });
          }
        };

        vm.viewRecord = (row, event) => {
          const selectedpagesorfeatures = [];
          vm.data = {};
          vm.selectedPageorFeature = {};
          vm.data = {
            employeeId:  vm.loginUser.employee.id,
            selectedCurrentRole: vm.currentRole,
            selectedCriteria : vm.currentTab,
            userId: vm.userId,
            isActionSelected: vm.constantAssignRightsAndFeatures.VIEW,
            isFrom: vm.constantAssignRightsAndFeatures.Action
          };
          if(vm.currentTab === vm.constantAssignRightsAndFeatures.PERMISSIONS){
            if(row.entity){
              selectedpagesorfeatures.push(row.entity);
              vm.selectedPageorFeature.pageOrFeatureId = row.entity.pageID;
              vm.selectedPageorFeature.pageOrFeatureName = row.entity.menuName;
              vm.data.selectedFeatureOrPage = selectedpagesorfeatures;
              vm.data.selectedPageOrFeature= vm.selectedPageorFeature;
              vm.data.titleForPopupHeader = vm.constantAssignRightsAndFeatures.PagePermissionToUser;
            }
          } else {
            if(row.entity){
              selectedpagesorfeatures.push(row.entity);
              vm.selectedPageorFeature.pageOrFeatureId = row.entity.featureID;
              vm.selectedPageorFeature.pageOrFeatureName = row.entity.featureName;
              vm.data.selectedFeatureOrPage = selectedpagesorfeatures;
              vm.data.selectedPageOrFeature= vm.selectedPageorFeature;
              vm.data.titleForPopupHeader = vm.constantAssignRightsAndFeatures.FeatureRightToUser;
            }
          }

          //OPEN Popup for get employee list which is based for everythinsg
          //1. Selected Pages (View / Mulitple selected)
          //2. Selected Features (View / Mulitple selected)
          if(vm.data.selectedFeatureOrPage && vm.data.selectedFeatureOrPage.length > 0){
            DialogFactory.dialogService(
                CORE.ASSIGNRIGHTSANDFEATURES_POPUP_CONTROLLER,
                CORE.ASSIGNRIGHTSANDFEATURES_POPUP_VIEW,
                event,
                vm.data).then(() => { // Success Section
            }, (error) => {
                BaseService.getErrorLog(error);
            });
          }
        };

        // Added By JAY SOLANKI
        // Function for send selected pages or features to show popup
        //  of employees which is used for give multiple rights or remove rights
        vm.assignFeatureOrPage = (event) => {
          const selectedpagesorfeatures = [];
          vm.data = {};
          vm.selectedPageorFeature = {};
          vm.data = {
            employeeId: vm.loginUser.employee.id,
            selectedPageOrFeature: vm.selectedPageorFeature,
            selectedCurrentRole: vm.currentRole,
            selectedCriteria : vm.currentTab,
            userId: vm.userId,
            isActionSelected: vm.constantAssignRightsAndFeatures.CHECKMARK,
            isFrom: vm.constantAssignRightsAndFeatures.MultipleSelected
          };
          // Condition for Permission/Pages or Features on Tab selection
          if(vm.currentTab === vm.constantAssignRightsAndFeatures.PERMISSIONS){
              const selectedpagesorfeatures = _.filter(vm.pages, (element) => element.isPageChecked === true);
              vm.data.titleForPopupHeader = vm.constantAssignRightsAndFeatures.PagePermissionToUser;
              vm.data.selectedFeatureOrPage = selectedpagesorfeatures;
          }else{
              const selectedpagesorfeatures = _.filter(vm.features, (element) => element.isActive === true);
              vm.data.titleForPopupHeader = vm.constantAssignRightsAndFeatures.FeatureRightToUser;
              vm.data.selectedFeatureOrPage = selectedpagesorfeatures;
          }

          //OPEN Popup for get employee list which is based for everythinsg
          //1. Selected Pages (View / Mulitple selected)
          //2. Selected Features (View / Mulitple selected)
          if(vm.data.selectedFeatureOrPage && vm.data.selectedFeatureOrPage.length > 0){
            DialogFactory.dialogService(
                CORE.ASSIGNRIGHTSANDFEATURES_POPUP_CONTROLLER,
                CORE.ASSIGNRIGHTSANDFEATURES_POPUP_VIEW,
                event,
                vm.data).then(() => {
                },(data) => {
                  vm.resetAllFilter();
                  if (data) {
                    if(vm.currentTab === vm.constantAssignRightsAndFeatures.PERMISSIONS){
                      vm.getPageList();
                      vm.pages = [];
                      vm.selectedPages = [];
                      $scope.isRightChange = false;
                      vm.isAllPageRight = false;
                    } else {
                      vm.getFeatureList();
                      vm.features = [];
                      vm.selectedFeature = [];
                      $scope.isFeatureChange = false;
                      vm.isAllFeatureRight = false;
                    }
                  }
                }, (error) => {
                    BaseService.getErrorLog(error);
                });
          }else{
            NotificationFactory.information(TRANSACTION.SAVE_ON_NOCHANGES);
            return;
          }
        };

        vm.addRole = () => {
          BaseService.goToRoleAddUpdate(0);
        };

    }
})();
