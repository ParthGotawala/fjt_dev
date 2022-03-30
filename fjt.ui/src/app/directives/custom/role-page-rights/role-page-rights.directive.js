(function () {
  'use sctrict';
  angular
    .module('app.core')
    .directive('rolePageRights', rolePageRights);

  /** @ngInject */
  function rolePageRights(
    $filter, $timeout, CORE, UserPagePermisionFactory, PageDetailFactory, CertificateStandardFactory, NotificationFactory, FeatureDetailFactory,
    RolePagePermisionFactory, RoleFactory, UserFactory, BaseService, DialogFactory, USER, $mdDialog, $q, $state, $rootScope,
    EmployeeFactory, $stateParams, RawdataCategoryFactory, CONFIGURATION) {

    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        userId: '=?',
        roleId: '=?',
        role: '=?',
        pageName: "=",
        isEdit: "=?",
        roleObj: "=?",
        selectedRole: '=?',
        isRightChange: "=",
        isFeatureChange: "=",
        isStandardChange: "=",
        isDbViewDataSourceChange: "=",
        employeeId: "=",
        isViewOnly: "=?"
      },
      templateUrl: 'app/directives/custom/role-page-rights/role-page-rights.html',
      controller: rolePageRightsCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function rolePageRightsCtrl($scope, $element, $attrs, $timeout, CORE) {
      var vm = this;
      vm.userId = $scope.userId;
      vm.roleId = $scope.roleId;
      vm.IsEdit = $scope.isEdit;
      vm.pageName = $scope.pageName;
      vm.userProfilePage = CORE.USER_PROFILE_LABEL;
      vm.EmployeePage = USER.ADMIN_EMPLOYEE_LABEL;
      vm.RolePage = USER.ADMIN_USER_ROLE_LABEL;
      vm.PageRightsRole = USER.ADMIN_PAGERIGHT_ROLE_LABEL;
      vm.PageRightsUser = USER.ADMIN_PAGERIGHT_USER_LABEL;
      vm.RoleEmptyMesssage = USER.ADMIN_EMPTYSTATE.ROLE;
      vm.PageEmptyMesssage = USER.ADMIN_EMPTYSTATE.PAGE_DETAIL;
      vm.FeatureEmptyMesssage = USER.ADMIN_EMPTYSTATE.FEATURE;
      vm.StandardEmpltyMessage = USER.ADMIN_EMPTYSTATE.CERTIFICATE_STANDARD;
      vm.dbViewEmptyMessage = CONFIGURATION.CONFIGURATION_EMPTYSTATE.CHARTRAWDATACATEGORY;
      vm.isHideDelete = true;
      vm.loginUser = BaseService.loginUser;
      vm.identityUserId = vm.loginUser.identityUserId;
      vm.selectEmployeeId = $scope.employeeId;

      vm.permissionsTabName = 'Permissions';
      vm.featuresTabName = 'Features';
      vm.standardTabName = 'Allow To Select Standards'
      vm.dbViewDataSourceTabName = 'Report/Widget Data Source'
      vm.rid = $stateParams.id ? $stateParams.id : null;
      vm.currentTab = vm.permissionsTabName;
      vm.userRoleList = [];
      vm.isAllPermissionRight = false;
      vm.isAllRWRight = false;
      vm.isAllRORight = false;
      vm.isAllBookmarkRight = false;
      vm.isAllFeatureRight = false;
      vm.isAllStandardRight = false;
      vm.isAllDbViewChecked = false;
      vm.lastRoll;
      vm.currentRoleId = vm.roleId;
      vm.popup = {
        logout_user: false,
      }

      vm.isViewOnly = $scope.isViewOnly ? $scope.isViewOnly : false;

      let Allpromise = [];
      let paramTabname;
      let SaveRoleRightFeature = {
        RoleList: [],
        PageList: [],
        FeatureList: [],
        DbViewDataSourceList: []
      };
      let DeleteOldRole = {};
      let oldUserRoleList = [];
      let isOldRoleDeleted = false;
      let isFirstTimeCallRoll = false;
      let isFirstTimeCallPage = false;
      let isFirstTimeCallFeature = false;
      let isFirstTimeCallStandard = false;
      let isFirstTimeCallDbViewDataSource = false;
      let lastDeleteRole = {};
      let SavePageFeature = {
        PageList: [],
        FeatureList: [],
        standardList: [],
        DbViewDataSourceList: []
      };
      let isSaveData = false;

      vm.roles = [];
      let oldRoles = [];
      /*Used to set the count of each row of selected pages count*/
      vm.selectedPageCount = {
        selectedReadOnlyMenuCount: 0,
        selectedReadAndWriteMenuCount: 0,
        selectedIsActiveMenuCount: 0,
        selectedBookmarkMenuCount: 0,
        selectedShowInHomePageMenuCount: 0,
        selectedFeturesAndRightsCount: 0
      }

      let allRolePageList = [];
      let searchedPages = [];
      let searchedPagesFatures = [];
      vm.pageRightsRole = "Page Rights Role";
      vm.roleSourceHeader = [
        {
          field: 'Action',
          cellClass: 'gridCellColor',
          displayName: 'Action',
          minWidth: '90',
          cellTemplate: `<div class="center cm-role-checkbox">`
            + `<label class="cm-radio">`
            + `<input ui-grid-checkbox type="checkbox" ng-model="row.entity.isRoleChecked" class="cm-role-checkbox" ng-change="grid.appScope.$parent.vm.roleCheckedAlert(row.entity)" ng-disabled="!grid.appScope.$parent.vm.isUpdatable">`
            + `<span class="checkmark"></span>`
            + `</label>`
            + `</div>`,
          enableFiltering: false,
          enableSorting: false,
          exporterSuppressExport: false,
          pinnedLeft: false,
          enableCellEdit: false,
          width: '90'
        },
        {
          field: 'name',
          width: '*',
          displayName: 'Role',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableCellEdit: false,
          minWidth: '120',
        }
      ]

      /*set background color for default rights*/
      /*vm.setDefaultFeatureColor = (fromType, entity) => {
          if (vm.showDefaultRights) {
              if (fromType == "RO") {
                  return entity.RO;
              } else if (fromType == "RW") {
                  return entity.RW;
              } else if (fromType == "isActive") {
                  return entity.isActive;
              } else if (fromType == "IsShortcut") {
                  return entity.IsShortcut;
              } else {
                  return false;
              }
          } else {
              return false;
          }
      }*/

      vm.pages = [];
      let AllPages = [];
      let oldPages = [];
      let AllActivePage = [];
      vm.pageSourceHeader = [
        {
          field: 'menuName',
          width: '40%',
          displayName: 'Page',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableCellEdit: false,
          minWidth: '320',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer">Total item selected: </div>'
        },
        {
          field: 'RO',
          cellClass: 'gridCellColor',
          displayName: 'Read Only',
          width: '15%',
          cellTemplate: `<div class="center cm-role-checkbox" ng-class="{\'highlight-cell\': row.entity.isDefaultRO}">`
            + `<label class="cm-radio">`
            + `<input ui-grid-checkbox type="checkbox"`
            + `ng-model="row.entity.RO" class="cm-role-checkbox"`
            + `ng-checked="row.entity.RO=='1'"`
            + `ng-change="grid.appScope.$parent.vm.checkRight('RO', row.entity)"`
            + `ng-disabled="!grid.appScope.$parent.vm.isUpdatable">`
            + `<span class="checkmark"></span>`
            + `</label>`
            + `</div>`,
          filterHeaderTemplate: `<div class="center cm-role-checkbox">`
            + `<label class="cm-radio">`
            + `<input ui-grid-checkbox type="checkbox"`
            + `ng-model="grid.appScope.$parent.vm.isAllRORight"`
            + `ng-change="grid.appScope.$parent.vm.checkAllRight('RO', grid.appScope.$parent.vm.isAllRORight)" class="cm-role-checkbox"`
            + `ng-disabled="!grid.appScope.$parent.vm.isUpdatable">`
            + `<span class="checkmark"></span>`
            + `</label>`
            + `</div>`,
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer" >Total: {{grid.appScope.$parent.vm.selectedPageCount.selectedReadOnlyMenuCount}}</div>',
          enableSorting: false,
          exporterSuppressExport: false,
          pinnedLeft: false,
          enableCellEdit: false,
        },
        {
          field: 'RW',
          cellClass: 'gridCellColor',
          displayName: 'Read + Write',
          width: '15%',
          cellTemplate: `<div class="center cm-role-checkbox" ng-class="{\'highlight-cell\': row.entity.isDefaultRW}">`
            + `<label class="cm-radio">`
            + `<input ui-grid-checkbox type="checkbox"`
            + `ng-model="row.entity.RW" class="cm-role-checkbox"`
            + `ng-checked="row.entity.RW=='1'"`
            + `ng-change="grid.appScope.$parent.vm.checkRight('RW', row.entity)"`
            + `ng-disabled="!grid.appScope.$parent.vm.isUpdatable">`
            + `<span class="checkmark"></span>`
            + `</label>`
            + `</div>`,
          filterHeaderTemplate: `<div class="center cm-role-checkbox">`
            + `<label class="cm-radio">`
            + `<input ui-grid-checkbox type="checkbox"`
            + `ng-model="grid.appScope.$parent.vm.isAllRWRight"`
            + `ng-change="grid.appScope.$parent.vm.checkAllRight('RW', grid.appScope.$parent.vm.isAllRWRight)" class="cm-role-checkbox"`
            + `ng-disabled="!grid.appScope.$parent.vm.isUpdatable">`
            + `<span class="checkmark"></span>`
            + `</label>`
            + `</div>`,
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer" >Total: {{grid.appScope.$parent.vm.selectedPageCount.selectedReadAndWriteMenuCount}}</div>',
          enableSorting: false,
          exporterSuppressExport: false,
          pinnedLeft: false,
          enableCellEdit: false,
        },
        {
          field: 'isActive',
          cellClass: 'gridCellColor',
          displayName: 'Permission',
          width: '15%',
          cellTemplate: `<div class="center cm-role-checkbox" ng-class="{\'highlight-cell\': row.entity.isDefaultActive}">`
            + `<label class="cm-radio">`
            + `<input ui-grid-checkbox type="checkbox"`
            + `ng-model="row.entity.isActive" class="cm-role-checkbox"`
            + `ng-checked="row.entity.isActive=='1'"`
            + `ng-change="grid.appScope.$parent.vm.checkRight('PermissionActive', row.entity)"`
            + `ng-disabled="!grid.appScope.$parent.vm.isUpdatable">`
            + `<span class="checkmark"></span>`
            + `</label>`
            + `</div>`,
          filterHeaderTemplate: `<div class="center cm-role-checkbox">`
            + `<label class="cm-radio">`
            + `<input ui-grid-checkbox type="checkbox"`
            + `ng-model="grid.appScope.$parent.vm.isAllPermissionRight"`
            + `ng-change="grid.appScope.$parent.vm.checkAllRight('PermissionActive', grid.appScope.$parent.vm.isAllPermissionRight)" class="cm-role-checkbox"`
            + `ng-disabled="!grid.appScope.$parent.vm.isUpdatable">`
            + `<span class="checkmark"></span>`
            + `</label>`
            + `</div>`,
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer" >Total: {{grid.appScope.$parent.vm.selectedPageCount.selectedIsActiveMenuCount}}</div>',
          enableSorting: false,
          exporterSuppressExport: false,
          pinnedLeft: false,
          enableCellEdit: false,
        },
        {
          field: 'IsShortcut',
          cellClass: 'gridCellColor',
          displayName: 'Bookmark',
          width: '15%',
          cellTemplate: `<div class="center cm-role-checkbox" ng-class="{\'highlight-cell\': row.entity.isDefaultIsShortcut}">`
            + `<label class="cm-radio">`
            + `<input ui-grid-checkbox type="checkbox"`
            + `ng-model="row.entity.IsShortcut" class="cm-role-checkbox"`
            + `ng-checked="row.entity.IsShortcut=='1'"`
            + `ng-disabled="!row.entity.isActive || !grid.appScope.$parent.vm.isUpdatable"`
            + `ng-change="grid.appScope.$parent.vm.checkRight('Bookmark', row.entity)">`
            + `<span class="checkmark"></span>`
            + `</label>`
            + `</div>`,
          filterHeaderTemplate: `<div class="center cm-role-checkbox">`
            + `<label class="cm-radio">`
            + `<input ui-grid-checkbox type="checkbox"`
            + `ng-model="grid.appScope.$parent.vm.isAllBookmarkRight"`
            + `ng-disabled="!grid.appScope.$parent.vm.isAllPermissionRight || !grid.appScope.$parent.vm.isUpdatable"`
            + `ng-change="grid.appScope.$parent.vm.checkAllRight('Bookmark', grid.appScope.$parent.vm.isAllBookmarkRight)" class="cm-role-checkbox">`
            + `<span class="checkmark"></span>`
            + `</label>`
            + `</div>`,
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer" >Total: {{grid.appScope.$parent.vm.selectedPageCount.selectedBookmarkMenuCount}}</div>',
          enableSorting: false,
          exporterSuppressExport: false,
          pinnedLeft: false,
          enableCellEdit: false,
        },

      ]

      vm.features = [];
      let oldFeatures = [];
      vm.featureSourceHeader = [
        {
          field: 'featureName',
          width: '84%',
          displayName: 'Feature',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableCellEdit: false,
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer" >Total features selected: </div>',
        },
        {
          field: 'isActive',
          cellClass: 'gridCellColor',
          displayName: 'Feature Access',
          width: '16%',
          cellTemplate: `<div class="center cm-role-checkbox" ng-class="{\'highlight-cell\': row.entity.isDefaultActive}">`
            + `<label class="cm-radio">`
            + `<input ui-grid-checkbox type="checkbox"`
            + `ng-model="row.entity.isActive" class="cm-role-checkbox"`
            + `ng-checked="row.entity.isActive=='1'"`
            + `ng-change="grid.appScope.$parent.vm.checkRight('Feature', row.entity)"`
            + `ng-disabled="!grid.appScope.$parent.vm.isUpdatable">`
            + `<span class="checkmark"></span>`
            + `</label>`
            + `</div>`,
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer" >Total: {{grid.appScope.$parent.vm.selectedPageCount.selectedFeturesAndRightsCount}}</div>',
          filterHeaderTemplate: `<div class="center cm-role-checkbox">`
            + `<label class="cm-radio">`
            + `<input ui-grid-checkbox type="checkbox"`
            + `ng-model="grid.appScope.$parent.vm.isAllFeatureRight"`
            + `ng-change="grid.appScope.$parent.vm.checkAllRight('Feature', grid.appScope.$parent.vm.isAllFeatureRight)" class="cm-role-checkbox"`
            + `ng-disabled="!grid.appScope.$parent.vm.isUpdatable">`
            + `<span class="checkmark"></span>`
            + `</label>`
            + `</div>`,
          enableSorting: false,
          exporterSuppressExport: false,
          pinnedLeft: false,
          enableCellEdit: false,
        },
      ]

      let oldStandard = [];
      vm.standard = [];
      vm.standardSourceHeader = [
        {
          field: 'fullName',
          width: '84%',
          displayName: 'Standard',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableCellEdit: false,
        },
        {
          field: 'roleID',
          cellClass: 'gridCellColor',
          displayName: 'Standard Access',
          width: '16%',
          cellTemplate: `<div class="center cm-role-checkbox">`
            + `<label class="cm-radio">`
            + `<input ui-grid-checkbox type="checkbox"`
            + `ng-model="row.entity.standardCheck" class="cm-role-checkbox"`
            + `ng-checked="row.entity.standardCheck == '1'"`
            + `ng-change="grid.appScope.$parent.vm.checkRight('Standard', row.entity)"`
            + `ng-disabled="!grid.appScope.$parent.vm.isUpdatable">`
            + `<span class="checkmark"></span>`
            + `</label>`
            + `</div>`,
          filterHeaderTemplate: `<div class="center cm-role-checkbox">`
            + `<label class="cm-radio">`
            + `<input ui-grid-checkbox type="checkbox"`
            + `ng-model="grid.appScope.$parent.vm.isAllStandardRight"`
            + `ng-change="grid.appScope.$parent.vm.checkAllRight('Standard', grid.appScope.$parent.vm.isAllStandardRight)" class="cm-role-checkbox"`
            + `ng-disabled="!grid.appScope.$parent.vm.isUpdatable">`
            + `<span class="checkmark"></span>`
            + `</label>`
            + `</div>`,
          enableSorting: false,
          exporterSuppressExport: false,
          pinnedLeft: false,
          enableCellEdit: false,
        },
      ]


      if ($scope.pageName == vm.EmployeePage) {
        vm.isRoleShow = true;
        vm.isStandardShow = false;
        vm.isDbViewDataSourceShow = false;
        vm.isUpdatable = true;
      } else if ($scope.pageName == vm.userProfilePage) {
        vm.isRoleShow = true;
        vm.isStandardShow = false;
        vm.isDbViewDataSourceShow = false;
        vm.isUpdatable = false;
      } else if ($scope.pageName == vm.RolePage) {
        vm.isRoleShow = false;
        vm.isStandardShow = true;
        vm.isDbViewDataSourceShow = true;
        vm.isUpdatable = true;
      } else if ($scope.pageName == vm.PageRightsRole) {
        vm.isRoleShow = false;
        vm.isStandardShow = true;
        vm.isDbViewDataSourceShow = true;
        vm.isUpdatable = true;
      } else if ($scope.pageName == vm.PageRightsUser) {
        vm.isRoleShow = true;
        vm.isStandardShow = false;
        vm.isDbViewDataSourceShow = false;
        vm.isUpdatable = true;
      }

      // Set the value on page is initialize
      let initPageInfo = () => {
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
        vm.standardPagingInfo = {
          Page: 0,
          SortColumns: [['fullName', 'ASC']],
          SearchColumns: [],
          roleId: vm.roleId
        };

        if (!vm.rightsPagingInfo.RoleId && !vm.isRoleShow) {
          vm.rightsPagingInfo.TabName = vm.permissionsTabName;
          vm.rightsPagingInfo.RoleId = vm.roleId;
        }
      }

      initPageInfo();

      // Set the value for option of Role Grid
      vm.roleGridOptions = {
        showColumnFooter: false,
        enableRowHeaderSelection: false,
        enableFullRowSelection: true,
        enableRowSelection: true,
        multiSelect: false,
        filterOptions: vm.pagingInfo.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'Page rights.csv',
          hideMultiDeleteButton: true
      };

      // Set the value for option of Page Grid
      vm.pageGridOptions = {
        showColumnFooter: true,
        enableRowHeaderSelection: false,
        enableFullRowSelection: true,
        enableRowSelection: true,
        multiSelect: false,
        filterOptions: vm.rightsPagingInfo.SearchColumns,
        exporterMenuCsv: true,
          exporterCsvFilename: 'Page rights.csv',
          hideMultiDeleteButton: true
      };

      // Set the value for option of Feature Grid
      vm.featureGridOptions = {
        showColumnFooter: true,
        enableRowHeaderSelection: false,
        enableFullRowSelection: true,
        enableRowSelection: true,
        multiSelect: false,
        filterOptions: vm.featurePagingInfo.SearchColumns,
        exporterMenuCsv: true,
          exporterCsvFilename: 'features rights.csv',
          hideMultiDeleteButton: true
      };
      //set the value option of standard Grid

      vm.standardGridOptions = {
        showColumnFooter: false,
        enableRowHeaderSelection: false,
        enableFullRowSelection: true,
        enableRowSelection: true,
        multiSelect: false,
          filterOptions: vm.standardPagingInfo.SearchColumns,
          hideMultiDeleteButton: true
      };

      //Get The All Standard List
      vm.getstandardList = () => {
        if (vm.isStandardShow) {
          if (vm.standardPagingInfo && (vm.standardPagingInfo.RoleId || vm.standardPagingInfo.RoleId == 0)) {
            vm.standardPagingInfo.Page = 0;
            if (isFirstTimeCallStandard) {

              let searchString;
              if (vm.standardPagingInfo.SearchColumns && vm.standardPagingInfo.SearchColumns.length > 0)
                searchString = vm.standardPagingInfo.SearchColumns[0].SearchString;

              //let withoutSearchStandard = vm.standard;
              if (!searchString) {
                vm.standard = vm.allStandardData;
              } else {
                vm.standard = _.filter(oldStandard, (data) => {
                  if (data.fullName.toUpperCase().includes(searchString ? searchString.toUpperCase() : ""))
                    return data;
                });
              }
              vm.advanceSearchStandard = angular.copy(vm.standard);
              let stCount = vm.standard.length;

              if (stCount > 0) {
                let checkFalseStandard = _.some(vm.advanceSearchStandard, function (data) {
                  return !data.standardCheck;
                });
                if (!checkFalseStandard) {
                  vm.isAllStandardRight = true;
                } else {
                  vm.isAllStandardRight = false;
                }
              } else {
                vm.isAllStandardRight = false;
              }

              if (!vm.standardGridOptions.enablePaging) {
                vm.standardCurrentdata = vm.standard.length;
                // vm.standardGridOptions.gridApi.infiniteScroll.resetScroll();
              }
              vm.standardGridOptions.clearSelectedRows();
              let standardCount = vm.standard.length;

              // for apply sorting on data after all fiters are done
              let sortbystandardArray;
              if (vm.standardPagingInfo.SortColumns && vm.standardPagingInfo.SortColumns.length > 0) {
                sortbystandardArray = vm.standardPagingInfo.SortColumns[0];
              }
              if (sortbystandardArray && sortbystandardArray.length > 0) {
                let sortbyFieldname = sortbystandardArray[0];
                let sorttype = sortbystandardArray[1];

                vm.standard = _.orderBy(vm.standard, sortbyFieldname, sorttype);
              }

              if (standardCount == 0) {
                if (vm.standardPagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
                  vm.isStandardNoDataFound = false;
                  vm.standardEmptyState = 0;
                }
                else {
                  vm.isStandardNoDataFound = true;
                  vm.standardEmptyState = null;
                }
              }
              else {
                vm.isStandardNoDataFound = false;
                vm.standardEmptyState = null;
              }

              $timeout(() => {
                vm.resetStandardSourceGrid();
                //vm.standard = withoutSearchStandard;
                if (!vm.standardGridOptions.enablePaging && vm.totalStandardDataCount == vm.standardCurrentdata) {
                  return vm.standardGridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
                }
              });
            }
            else {
              return CertificateStandardFactory.retriveCertificateStandardsList().query(vm.standardPagingInfo).$promise.then((standards) => {
                vm.sourceData = standards.data.standards;
                vm.allStandardData = standards.data.standards;
                vm.standard = [];
                _.each(vm.sourceData, function (item) {
                  if (item.isActive == true) {
                    if (item.roleID == vm.roleId) {
                      item.standardCheck = true;
                    }
                    else {
                      item.standardCheck = false;
                    }
                    vm.standard.push(item);
                  }
                })

                vm.totalStandardDataCount = vm.standard.length;

                oldStandard = angular.copy(vm.standard);

                if (!vm.standardGridOptions.enablePaging) {
                  vm.standardCurrentdata = vm.standard.length;
                  vm.standardGridOptions.gridApi.infiniteScroll.resetScroll();
                }
                vm.standardGridOptions.clearSelectedRows();
                if (vm.totalStandardDataCount == 0) {
                  if (vm.standardPagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
                    vm.isStandardNoDataFound = false;
                    vm.standardEmptyState = 0;
                  }
                  else {
                    vm.isStandardNoDataFound = true;
                    vm.standardEmptyState = null;
                  }
                }
                else {
                  vm.isStandardNoDataFound = false;
                  vm.standardEmptyState = null;
                }

                let checkFalsestandard = _.some(vm.standard, function (data) {
                  return !data.standardCheck;
                });
                if (!checkFalsestandard) {
                  vm.isAllStandardRight = true;
                } else {
                  vm.isAllStandardRight = false;
                }

                isFirstTimeCallStandard = true;

                $timeout(() => {
                  vm.resetStandardSourceGrid();
                  if (!vm.standardGridOptions.enablePaging && vm.totalSourceDataCount == vm.standardCurrentdata) {
                    return vm.standardGridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
                  }
                });
              }).catch((error) => {
                return BaseService.getErrorLog(error);
              });
            }
          }
        }
      }

      vm.getStandardDataDown = () => {
        vm.standardPagingInfo.Page = vm.standardPagingInfo.Page + 1;
        vm.cgBusyLoading = CertificateStandardFactory.retriveCertificateStandardsList().query(vm.standardPagingInfo).$promise.then((standard) => {
          //vm.standard = vm.standard.concat(standard.data);
          _.each(standard.data, function (item) {
            if (item.isActive == true) {
              if (item.roleID == vm.roleId) {
                item.standardCheck = true;
              }
              else {
                item.standardCheck = false;
              }
              vm.standard.push(item);
            }
          })
          vm.standaedCurrentdata = vm.standard.length;
          vm.standardGridOptions.gridApi.infiniteScroll.saveScrollPercentage();
          //setUserRoleCheckbox();
          $timeout(() => {
            vm.resetStandardSourceGrid();
            return vm.standardGridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalStandardDataCount != vm.standaedCurrentdata ? true : false);
          });

        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      function getrole() {
        return RoleFactory.retriveRolesList().query(vm.pagingInfo).$promise.then((roles) => {
          if (roles.status == CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.roles = roles.data.roles;
            vm.totalRoleDataCount = roles.data.Count;
            oldRoles = angular.copy(vm.roles);
            isFirstTimeCallRoll = true;
            if (vm.userRoleList && vm.userRoleList.length > 0 && vm.roles && vm.roles.length > 0) {
              _.map(vm.userRoleList, function (data) {
                _.map(vm.roles, function (item) {
                  if (data.roleId == item.id) {
                    return item.isRoleChecked = true;
                  }
                });
              });
              let RoleselesctedData = _.filter(vm.roles, function (data) {
                if ((data.isActive) || data.isRoleChecked && !data.isActive) {
                  return data;
                }
              });
              if (RoleselesctedData.length > 0) {
                vm.roles = RoleselesctedData;
              }
              let checkAnyRoleSelected = _.filter(vm.roles, function (data) {
                if (data.isRoleChecked) {
                  return data;
                }
              });

              if (checkAnyRoleSelected && checkAnyRoleSelected.length > 0) {
                vm.lastRoll = null;
                getRoleSelectedRow(checkAnyRoleSelected[0]);

              }
            } else {
              if (vm.roles.length > 0) {
                var activeRoles = _.filter(vm.roles, function (Role) {
                  if (Role.isActive)
                    return Role;
                });
                vm.roles = activeRoles;
              }
              vm.pages = [];
              vm.isPageNoDataFound = true;

              vm.features = [];
              vm.isFeatureNoDataFound = true;

              vm.currentRoleId = null;

              $scope.isRightChange = false;
              $scope.isFeatureChange = false;
            }
            vm.rolesCurrentdata = vm.roles.length;
            $timeout(() => {
              vm.resetSourceGrid();
              if (!vm.roleGridOptions.enablePaging && vm.totalRoleDataCount == vm.rolesCurrentdata) {
                return vm.roleGridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
              }
            });

          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      // Get the All role list
      vm.getRoleList = () => {
        if (vm.isRoleShow) {
          if (isFirstTimeCallRoll) {
            let searchString;
            if (vm.pagingInfo.SearchColumns && vm.pagingInfo.SearchColumns.length > 0)
              searchString = vm.pagingInfo.SearchColumns[0].SearchString;
            if (searchString) {
              let withoutSearchRole = vm.roles;
              vm.roles = _.filter(vm.roles, (data) => {
                if (data.name.toUpperCase().includes(searchString ? searchString.toUpperCase() : ""))
                  return data;
              });

              if (!vm.roleGridOptions.enablePaging) {
                vm.rolesCurrentdata = vm.roles.length;
                vm.roleGridOptions.gridApi.infiniteScroll.resetScroll();
              }
              vm.roleGridOptions.clearSelectedRows();
              let roleCount = vm.roles.length;
              if (roleCount == 0) {
                if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
                  vm.isRoleNoDataFound = false;
                  vm.roleEmptyState = 0;
                }
                else {
                  vm.isRoleNoDataFound = true;
                  vm.roleEmptyState = null;
                }
              }
              else {
                vm.isRoleNoDataFound = false;
                vm.roleEmptyState = null;
              }

              $timeout(() => {
                vm.resetSourceGrid();
                vm.roles = withoutSearchRole;
                if (!vm.roleGridOptions.enablePaging && vm.totalRoleDataCount == vm.rolesCurrentdata) {
                  return vm.roleGridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
                }
              });
            } else {
              vm.pagingInfo.Page = 0;
              getrole();
            }
          } else {
            return RoleFactory.retriveRolesList().query(vm.pagingInfo).$promise.then((roles) => {
              if (roles.status == CORE.ApiResponseTypeStatus.SUCCESS) {
                return $q.resolve(roles.data);
              } else {
                return $q.resolve({});
              }
            }).catch((error) => {
              return BaseService.getErrorLog(error);
            });
          }
        }
      }

      // Get the role list after scroll
      vm.getRoleDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = RoleFactory.retriveRolesList().query(vm.pagingInfo).$promise.then((roles) => {
          vm.roles = vm.roles.concat(roles.data.roles);
          vm.rolesCurrentdata = vm.roles.length;
          vm.roleGridOptions.gridApi.infiniteScroll.saveScrollPercentage();
          //setUserRoleCheckbox();
          $timeout(() => {
            vm.resetSourceGrid();
            return vm.roleGridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalRoleDataCount != vm.rolesCurrentdata ? true : false);
          });

        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      };

      // Get the All page list
      vm.getPageList = () => {
        if (vm.rightsPagingInfo && vm.rightsPagingInfo.RoleId || vm.rightsPagingInfo.RoleId == 0) {
          vm.rightsPagingInfo.Page = 0;
          if (isFirstTimeCallPage) {
            let searchString;
            /*Used to stored selected searched pages*/
            _.each(vm.pages, (item => {
              searchedPages.push(item);
            }))
            if (vm.rightsPagingInfo.SearchColumns && vm.rightsPagingInfo.SearchColumns.length > 0)
              searchString = vm.rightsPagingInfo.SearchColumns[0].SearchString;

            //let withoutSearchPage = vm.pages;
            if (!searchString) {
              vm.pages = vm.allPagesData;
            }

            vm.pages = _.filter(angular.copy(oldPages), (data) => {
              if (data.menuName.toUpperCase().includes(searchString ? searchString.toUpperCase() : ""))
                return data;
            });

            if (searchedPages) {
              _.each(searchedPages, (itemSearchedPages) => {
                _.filter(vm.pages, (itemPages) => {
                  if (itemPages.pageID == itemSearchedPages.pageID) {
                    itemPages.RO = itemSearchedPages.RO;
                    itemPages.RW = itemSearchedPages.RW;
                    itemPages.isActive = itemSearchedPages.isActive;
                    itemPages.IsShortcut = itemSearchedPages.IsShortcut;
                    //itemPages.IsShowInHomePage = itemSearchedPages.IsShowInHomePage;
                  }
                });
              });
            }

            //vm.advanceSearchPages = angular.copy(vm.pages);
            vm.advanceSearchPages = null;
            let pageCount = vm.pages.length;
            /*Used to check and un check check boxes*/
            vm.checkUnCheckAllRights(vm.pages);


            // for apply sorting on data after all filter done
            let sortbyPageArray;
            if (vm.rightsPagingInfo.SortColumns && vm.rightsPagingInfo.SortColumns.length > 0) {
              sortbyPageArray = vm.rightsPagingInfo.SortColumns[0];
            }
            if (sortbyPageArray && sortbyPageArray.length > 0) {
              let sortbyFieldname = sortbyPageArray[0];
              let sorttype = sortbyPageArray[1];

              vm.pages = _.orderBy(vm.pages, sortbyFieldname, sorttype);
            }


            if (!vm.pageGridOptions.enablePaging) {
              vm.pagesCurrentdata = vm.pages.length;
            }
            vm.pageGridOptions.clearSelectedRows();

            if (pageCount == 0) {
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
            /*Used to check mark pages on UI Grid*/
            if (allRolePageList && allRolePageList.length > 0) {
              _.each(allRolePageList, (rolePageItem) => {
                _.filter(vm.pages, (item) => {
                  if ((item.pageID == rolePageItem.pageID) && item.isDisplay) {
                    item.RO = rolePageItem.RO == 1 ? true : false;
                    item.RW = rolePageItem.RW == 1 ? true : false;
                    item.isActive = rolePageItem.isActive == 1 ? true : false;
                    item.IsShortcut = rolePageItem.IsShortcut == 1 ? true : false;
                    //item.IsShowInHomePage = rolePageItem.IsShowInHomePage == 1 ? true : false;
                  }
                })
              })
            }
            /*Used to set selected pages count with each column*/
            vm.selectedPageCount.selectedReadOnlyMenuCount = _.filter(vm.pages, (item) => { return item.RO && item.isDisplay }).length;
            vm.selectedPageCount.selectedReadAndWriteMenuCount = _.filter(vm.pages, (item) => { return item.RW && item.isDisplay }).length;
            vm.selectedPageCount.selectedIsActiveMenuCount = _.filter(vm.pages, (item) => { return item.isActive && item.isDisplay }).length;
            vm.selectedPageCount.selectedBookmarkMenuCount = _.filter(vm.pages, (item) => { return item.IsShortcut && item.isDisplay }).length;

            $timeout(() => {
              vm.resetPageSourceGrid();
              //vm.pages = withoutSearchPage;
              if (!vm.pageGridOptions.enablePaging && vm.totalPageDataCount == vm.pagesCurrentdata) {
                return vm.pageGridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
              }
            });

          } else {
            vm.rightsPagingInfo.isShowDefault = (vm.showDefaultRights || vm.pageName == vm.RolePage || vm.pageName == vm.pageRightsRole) ? 1 : 0;
            vm.cgBusyLoading = RolePagePermisionFactory.pagePermission(vm.rightsPagingInfo).query().$promise.then((pageRights) => {
              AllPages = pageRights.data.pages;
              vm.pages = [];
              _.map(AllPages, function (data) {
                data.RO = data.RO == 1 ? true : false;
                data.RW = data.RW == 1 ? true : false;
                data.isActive = data.isActive == 1 ? true : false;
                data.IsShortcut = data.IsShortcut == 1 ? true : false;
                //data.IsShowInHomePage = data.IsShowInHomePage == 1 ? true : false;

                if (data.isDisplay) {
                  vm.pages.push(data);
                }
              });
              vm.allPagesData = vm.pages;
              vm.totalPageDataCount = vm.pages.length;
              oldPages = angular.copy(vm.pages);
              if (!vm.pageGridOptions.enablePaging) {
                vm.pagesCurrentdata = vm.pages.length;
                vm.pageGridOptions.gridApi.infiniteScroll.resetScroll();
              }
              vm.pageGridOptions.clearSelectedRows();
              if (vm.totalPageDataCount == 0) {
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

              let checkFalseRO = _.some(vm.pages, function (data) {
                return !data.RO;
              });
              if (!checkFalseRO) {
                vm.isAllRORight = true;
              } else {
                vm.isAllRORight = false;
              }

              let checkFalseRW = _.some(vm.pages, function (data) {
                return !data.RW;
              });
              if (!checkFalseRW) {
                vm.isAllRWRight = true;
              } else {
                vm.isAllRWRight = false;
              }

              let checkFalsePermission = _.some(vm.pages, function (data) {
                return !data.isActive;
              });
              if (!checkFalsePermission) {
                vm.isAllPermissionRight = true;
              } else {
                vm.isAllPermissionRight = false;
              }

              let checkFalseBookmark = _.some(vm.pages, function (data) {
                return !data.IsShortcut;
              });
              if (!checkFalseBookmark) {
                vm.isAllBookmarkRight = true;
              } else {
                vm.isAllBookmarkRight = false;
              }



              /*Used to set selected pages count with each column*/
              vm.selectedPageCount.selectedReadOnlyMenuCount = _.filter(vm.pages, (item) => { return item.RO }).length;
              vm.selectedPageCount.selectedReadAndWriteMenuCount = _.filter(vm.pages, (item) => { return item.RW }).length;
              vm.selectedPageCount.selectedIsActiveMenuCount = _.filter(vm.pages, (item) => { return item.isActive }).length;
              vm.selectedPageCount.selectedBookmarkMenuCount = _.filter(vm.pages, (item) => { return item.IsShortcut }).length;
              //vm.selectedPageCount.selectedShowInHomePageMenuCount = _.filter(vm.pages, (item) => { return item.IsShowInHomePage }).length;
              isFirstTimeCallPage = true;

              $timeout(() => {
                vm.resetPageSourceGrid();
                if (!vm.pageGridOptions.enablePaging && vm.totalPageDataCount == vm.pagesCurrentdata) {
                  return vm.pageGridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
                }
              });

            }).catch((error) => {
              return BaseService.getErrorLog(error);
            });
          }
        }
      }

      // Get the page list after scroll
      vm.getPageDataDown = () => {
        vm.rightsPagingInfo.Page = vm.rightsPagingInfo.Page + 1;
        vm.cgBusyLoading = RolePagePermisionFactory.pagePermission(vm.rightsPagingInfo).query().$promise.then((pageRights) => {
          vm.pages = vm.pages.concat(pageRights.data.pages);
          vm.pagesCurrentdata = vm.pages.length;
          vm.pageGridOptions.gridApi.infiniteScroll.saveScrollPercentage();
          $timeout(() => {
            vm.resetPageSourceGrid();
            return vm.pageGridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalPageDataCount != vm.pagesCurrentdata ? true : false);
          });
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      };

      // Get the All feature list
      vm.getFeatureList = () => {
        if (vm.featurePagingInfo && vm.featurePagingInfo.RoleId || vm.featurePagingInfo.RoleId == 0) {
          vm.featurePagingInfo.Page = 0;
          if (isFirstTimeCallFeature) {
            let searchString;

            _.each(vm.features, (item => {
              searchedPagesFatures.push(item);
            }))
            if (vm.featurePagingInfo.SearchColumns && vm.featurePagingInfo.SearchColumns.length > 0)
              searchString = vm.featurePagingInfo.SearchColumns[0].SearchString;

            //let withoutSearchFeature = vm.features;
            if (!searchString) {
              vm.features = vm.allFeatureData;
            }

            vm.features = _.filter(angular.copy(oldFeatures), (data) => {
              if (data.featureName.toUpperCase().includes(searchString ? searchString.toUpperCase() : ""))
                return data;
            });

            /*Used to set check mark searched pages*/
            if (searchedPagesFatures) {
              _.each(searchedPagesFatures, (itemSearchedPages) => {
                _.filter(vm.features, (itemPages) => {
                  if (itemPages.featureID == itemSearchedPages.featureID) {
                    itemPages.isActive = itemSearchedPages.isActive;
                  }
                });
              });
            }

            vm.advanceSearchFeature = angular.copy(vm.features);
            let featureCount = vm.features.length;

            if (featureCount > 0) {
              let checkFalseFeature = _.some(vm.advanceSearchFeature, function (data) {
                return !data.isActive;
              });
              if (!checkFalseFeature) {
                vm.isAllFeatureRight = true;
              } else {
                vm.isAllFeatureRight = false;
              }
            } else {
              vm.isAllFeatureRight = false;
            }

            // for apply sorting on data 
            let sortbyfeatureArray;
            if (vm.featurePagingInfo.SortColumns && vm.featurePagingInfo.SortColumns.length > 0) {
              sortbyfeatureArray = vm.featurePagingInfo.SortColumns[0];
            }
            if (sortbyfeatureArray && sortbyfeatureArray.length > 0) {
              let sortbyFieldname = sortbyfeatureArray[0];
              let sorttype = sortbyfeatureArray[1];

              vm.features = _.orderBy(vm.features, sortbyFieldname, sorttype);
            }

            if (!vm.featureGridOptions.enablePaging) {
              vm.featuresCurrentdata = vm.features.length;
              // vm.featureGridOptions.gridApi.infiniteScroll.resetScroll();
            }
            vm.featureGridOptions.clearSelectedRows();

            if (featureCount == 0) {
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
            /*Used to highlight default rights*/
            highlightFeaturesRights(allRolePageList);
            $timeout(() => {
              vm.resetFeatureSourceGrid();
              //    vm.features = withoutSearchFeature;
              if (!vm.featureGridOptions.enablePaging && vm.totalFeatureDataCount == vm.featuresCurrentdata) {
                return vm.featureGridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
              }
            });
          } else {
            vm.featurePagingInfo.isShowDefault = vm.showDefaultRights || vm.pageName == vm.RolePage || vm.pageName == vm.pageRightsRole ? 1 : 0;
            vm.cgBusyLoading = RolePagePermisionFactory.pagePermission(vm.featurePagingInfo).query().$promise.then((featureRights) => {
              //after filter clear get all featuredata
              vm.allFeatureData = featureRights.data.features;
              vm.features = featureRights.data.features;
              vm.totalFeatureDataCount = featureRights.data.Count;

              _.map(vm.features, function (data) {
                data.isActive = data.isActive == 1 ? true : false;
              });

              oldFeatures = angular.copy(vm.features);

              if (!vm.featureGridOptions.enablePaging) {
                vm.featuresCurrentdata = vm.features.length;
                vm.featureGridOptions.gridApi.infiniteScroll.resetScroll();
              }
              vm.featureGridOptions.clearSelectedRows();
              if (vm.totalFeatureDataCount == 0) {
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

              let checkFalseFeature = _.some(vm.features, function (data) {
                return !data.isActive;
              });
              if (!checkFalseFeature) {
                vm.isAllFeatureRight = true;
              } else {
                vm.isAllFeatureRight = false;
              }

              isFirstTimeCallFeature = true;
              /*Used to highlight default rights*/
              highlightFeaturesRights(vm.allFeatureData);
              $timeout(() => {
                vm.resetFeatureSourceGrid();
                if (!vm.featureGridOptions.enablePaging && vm.totalFeatureDataCount == vm.featuresCurrentdata) {
                  return vm.featureGridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
                }
              });

            }).catch((error) => {
              return BaseService.getErrorLog(error);
            });
          }
        }
      }

      // Get the feature list after scroll
      vm.getFeatureDataDown = () => {
        vm.featurePagingInfo.Page = vm.featurePagingInfo.Page + 1;
        vm.cgBusyLoading = RolePagePermisionFactory.pagePermission(vm.featurePagingInfo).query().$promise.then((featureRights) => {
          vm.features = vm.features.concat(featureRights.data.features);
          vm.featuresCurrentdata = vm.features.length;
          vm.featureGridOptions.gridApi.infiniteScroll.saveScrollPercentage();
          $timeout(() => {
            vm.resetFeatureSourceGrid();
            return vm.featureGridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalFeatureDataCount != vm.featuresCurrentdata ? true : false);
          });
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      };


      // Show confirmation popup when check/uncheck role check box
      vm.roleCheckedAlert = (row) => {
        vm.pageGridOptions.gridApi.grid.clearAllFilters();
        if (vm.userRoleList && vm.userRoleList.length > 0 && (!$scope.isRightChange && !$scope.isFeatureChange) && (_.isNull(vm.lastRoll) || _.isUndefined(vm.lastRoll))) {
          roleChecked(row);
        } else if (vm.userRoleList && vm.userRoleList.length > 0 && (!$scope.isRightChange && !$scope.isFeatureChange) && vm.lastRoll) {
          roleChecked(row);
        } else if (vm.userRoleList && vm.userRoleList.length > 0 && (!$scope.isRightChange || !$scope.isFeatureChange)) {
          showWithoutSavingAlertRole(row, 'checkbox', vm.lastRoll);
        } else if (vm.userRoleList && vm.userRoleList.length > 0 && ($scope.isRightChange || $scope.isFeatureChange)) {
          showWithoutSavingAlertRole(row, 'checkbox', vm.lastRoll);
        } else if (vm.userRoleList && vm.userRoleList.length == 0 && ($scope.isRightChange || $scope.isFeatureChange)) {
          showWithoutSavingAlertRole(row, 'checkbox', vm.lastRoll);
        } else {
          roleChecked(row);
        }
      }

      // call when check/uncheck role check box
      let roleChecked = (row) => {
        if (row && row.id && row.isRoleChecked) {
          vm.isAllPermissionRight = false;
          vm.isAllRWRight = false;
          vm.isAllRORight = false;
          vm.isAllBookmarkRight = false;
          vm.isAllFeatureRight = false;
          vm.showDefaultRights = false;
          if (vm.lastRoll && vm.lastRoll.id != row.id) {
            vm.lastRoll.isRoleChecked = false;
          }

          vm.currentRoleId = row.id;
          vm.currentRole = row;
          vm.lastRoll = row;

          if (vm.currentRoleId && vm.currentRoleId != null)
            getPageListByRole(vm.currentTab, vm.userId, vm.currentRoleId);
        } else if (!row.isRoleChecked) {
          vm.isAllPermissionRight = false;
          vm.isAllRWRight = false;
          vm.isAllRORight = false;
          vm.isAllBookmarkRight = false;
          vm.isAllFeatureRight = false;
          vm.showDefaultRights = false;
          let isDeleteOldRole = _.some(vm.userRoleList, function (data) {
            return data.roleId == row.id;
          })

          if (isDeleteOldRole) {
            showConfirmationForOldRoleDelete(row);
          } else {

            let checkAnyRoleSelected = _.filter(vm.roles, function (data) {
              if (data.isRoleChecked) {
                return data;
              }
            });

            if (checkAnyRoleSelected && checkAnyRoleSelected.length > 0) {
              let isEdit = _.some(vm.userRoleList, function (data) {
                return data.roleId == row.id;
              })
              if (isEdit) {
                $scope.isRightChange = false;
                $scope.isFeatureChange = false;
              }
              getRoleSelectedRow(checkAnyRoleSelected[0]);
            } else {
              vm.pages = [];
              vm.isPageNoDataFound = true;

              vm.features = [];
              vm.isFeatureNoDataFound = true;

              vm.currentRoleId = null;

              $scope.isRightChange = false;
              $scope.isFeatureChange = false;
            }
          }
        }
      }

      // Show confirmation popup when select other role
      vm.getRoleSelectedRowAlert = (row) => {
        if (row) {
          vm.pageGridOptions.gridApi.grid.clearAllFilters();
          let isEdit = _.some(vm.userRoleList, function (data) {
            return data.roleId == row.id;
          })
          if (isEdit && (!$scope.isRightChange && !$scope.isFeatureChange)) {
            getRoleSelectedRow(row);
          } else {
            if (vm.currentRole && vm.currentRole.id != row.id && row.isRoleChecked) {
              if (vm.userRoleList && vm.userRoleList.length > 0) {
                showWithoutSavingAlertRole(row, 'selectrole', vm.lastRoll);
              }
            }
          }
        }
      }

      // call when select other role 
      let getRoleSelectedRow = (row) => {
        if (row && row.id && row.isRoleChecked) {
          vm.currentRoleId = row.id;
          vm.currentRole = row;
          vm.showDefaultRights = false;
          if (vm.lastRoll) {
            vm.lastRoll.isRoleChecked = false;
          }

          if (vm.currentRoleId && vm.currentRoleId != null)
            getPageListByRole(vm.currentTab, vm.userId, vm.currentRoleId);
        }
      }

      // Get the particular role wise page and feature particular tab, user, role
      let getPageListByRole = (tabName, userId, roleId) => {
        if (!tabName || tabName == vm.permissionsTabName) {
          vm.features = [];
          let isEdit = _.some(vm.userRoleList, function (data) {
            return data.roleId == roleId;
          })

          if (isEdit) {
            $scope.isRightChange = false;
            $scope.isFeatureChange = false;
          } else {
            $scope.isRightChange = true;
            $scope.isFeatureChange = false;
          }

          if (!vm.isRoleShow) {
            $scope.isRightChange = false;
            $scope.isFeatureChange = false;
          }

          if (isOldRoleDeleted) {
            $scope.isRightChange = true;
            $scope.isFeatureChange = false;
            isOldRoleDeleted = false;
          }

          vm.rightsPagingInfo.TabName = tabName;
          vm.rightsPagingInfo.UserId = userId;
          vm.rightsPagingInfo.SearchColumns = [];
          vm.rightsPagingInfo.Page = 0;
          vm.rightsPagingInfo.isShowDefault = 0;
          if (!vm.rightsPagingInfo.RoleId && !vm.isRoleShow) {
            vm.rightsPagingInfo.RoleId = 0;
          } else {
            vm.rightsPagingInfo.RoleId = roleId;
          }
          isFirstTimeCallPage = false;
          vm.getPageList();
        } else if (!tabName || tabName == vm.featuresTabName) {
          vm.pages = [];
          let isEdit = _.some(vm.userRoleList, function (data) {
            return data.roleId == roleId;
          })

          if (isEdit) {
            $scope.isRightChange = false;
            $scope.isFeatureChange = false;
          } else {
            $scope.isRightChange = false;
            $scope.isFeatureChange = true;
          }

          if (!vm.isRoleShow) {
            $scope.isRightChange = false;
            $scope.isFeatureChange = false;
          }

          if (isOldRoleDeleted) {
            $scope.isRightChange = false;
            $scope.isFeatureChange = true;
            isOldRoleDeleted = false;
          }

          vm.featurePagingInfo.TabName = tabName;
          vm.featurePagingInfo.UserId = userId;
          vm.featurePagingInfo.Page = 0;
          vm.featurePagingInfo.SearchColumns = [];
          if (!vm.featurePagingInfo.RoleId && !vm.isRoleShow) {
            vm.featurePagingInfo.RoleId = vm.roleId;
          } else {
            vm.featurePagingInfo.RoleId = roleId;
          }
          isFirstTimeCallFeature = false;
          vm.getFeatureList();
        }
        else if (tabName == vm.dbViewDataSourceTabName) {
          vm.pages = [];
          vm.features = [];
          vm.standard = [];



          $scope.isRightChange = false;
          $scope.isFeatureChange = false;
          $scope.isStandardChange = false;
          $scope.isDbViewDataSourceChange = false;



          vm.pagingInfoForDbViewDataSource.TabName = tabName;
          vm.pagingInfoForDbViewDataSource.UserId = userId;
          vm.pagingInfoForDbViewDataSource.Page = 0;
          vm.pagingInfoForDbViewDataSource.SearchColumns = [];
          if (!vm.pagingInfoForDbViewDataSource.RoleId && !vm.isRoleShow) {
            vm.pagingInfoForDbViewDataSource.RoleId = vm.roleId;
          } else {
            vm.pagingInfoForDbViewDataSource.RoleId = roleId;
          }
          isFirstTimeCallDbViewDataSource = false;
          vm.loadDataForDbViewDataSource();
        }
        else {
          vm.pages = [];
          vm.features = [];
          let isEdit = _.some(vm.userRoleList, function (data) {
            return data.roleId == roleId;
          })

          if (isEdit) {
            $scope.isRightChange = false;
            $scope.isFeatureChange = false;
            $scope.isStandardChange = false;
            $scope.isDbViewDataSourceChange = false;
          } else {
            $scope.isRightChange = false;
            $scope.isFeatureChange = false;
            $scope.isStandardChange = false;
            $scope.isDbViewDataSourceChange = false;
          }

          if (!vm.isRoleShow) {
            $scope.isRightChange = false;
            $scope.isFeatureChange = false;
            $scope.isStandardChange = false;
            $scope.isDbViewDataSourceChange = false;
          }

          if (isOldRoleDeleted) {
            $scope.isRightChange = false;
            $scope.isFeatureChange = false;
            $scope.isStandardChange = true;
            $scope.isDbViewDataSourceChange = false;
            isOldRoleDeleted = false;
          }

          vm.standardPagingInfo.TabName = tabName;
          vm.standardPagingInfo.UserId = userId;
          vm.standardPagingInfo.Page = 0;
          vm.standardPagingInfo.SearchColumns = [];
          if (!vm.standardPagingInfo.RoleId && !vm.isRoleShow) {
            vm.standardPagingInfo.RoleId = vm.roleId;
          } else {
            vm.standardPagingInfo.RoleId = roleId;
          }
          isFirstTimeCallStandard = false;
          vm.getstandardList();
        }
      }

      // Call when change the permission/featuare tab
      vm.onTabChanges = (TabName) => {
        vm.pageGridOptions.gridApi.grid.clearAllFilters();
        vm.featureGridOptions.gridApi.grid.clearAllFilters();
        vm.showDefaultRights = false;
        if (!TabName || TabName == vm.permissionsTabName) {
          vm.currentTab = vm.permissionsTabName;
        } else if (!TabName || TabName == vm.featuresTabName) {
          vm.currentTab = vm.featuresTabName;
        }
        else if (!TabName || TabName == vm.standardTabName) {
          vm.currentTab = vm.standardTabName;
          isFirstTimeCallStandard = false;
          vm.standardGridOptions.gridApi.grid.clearAllFilters();
          vm.getstandardList();
        }
        else if (TabName == vm.dbViewDataSourceTabName) {
          vm.currentTab = vm.dbViewDataSourceTabName;
          isFirstTimeCallDbViewDataSource = false;
          vm.gridOptionsForDbViewDataSource.gridApi.grid.clearAllFilters();
          vm.loadDataForDbViewDataSource();
        }

        if ((vm.currentRoleId || vm.currentRoleId == 0) && vm.currentRoleId != null) {
          getPageListByRole(vm.currentTab, vm.userId, vm.currentRoleId);
        } else {
          $scope.isRightChange = false;
          $scope.isFeatureChange = false;
          $scope.isDbViewDataSourceChange = false;
        }
      }


      // On edit time get old selected role value
      let getRolesByUser = () => {
        return RoleFactory.getRolesByUser().query({ id: vm.userId }).$promise.then((userRole) => {
          if (userRole.status == CORE.ApiResponseTypeStatus.SUCCESS) {
            $scope.selectedRole = userRole.data;
            return $q.resolve(userRole.data);
          } else {
            return $q.resolve({});
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      // Check the role check box by old role and get the selected page
      let setUserRoleCheckbox = (afterSave) => {
        isFirstTimeCallRoll = false;
        vm.cgBusyLoading = $q.all(Allpromise).then(function (response) {
          if (response[0]) {
            vm.userRoleList = response[0];
            oldUserRoleList = angular.copy(vm.userRoleList);
            if (vm.userRoleList && (vm.userRoleList.length == 1 || vm.userRoleList.length == 0) && isSaveData) {
              if (vm.userRoleList.length == 0) {
                vm.currentRole = null;
              }
              setAsDefaultRole();
              isSaveData = false;
            }
          }
          if (response[1]) {
            vm.roles = response[1].roles;
            vm.totalRoleDataCount = response[1].Count;
            oldRoles = angular.copy(vm.roles);
            isFirstTimeCallRoll = true;

            if (!vm.roleGridOptions.enablePaging) {
              vm.rolesCurrentdata = vm.roles.length;
              vm.roleGridOptions.gridApi.infiniteScroll.resetScroll();
            }
            vm.roleGridOptions.clearSelectedRows();
            if (vm.totalRoleDataCount == 0) {
              if (vm.pagingInfo.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
                vm.isRoleNoDataFound = false;
                vm.roleEmptyState = 0;
              }
              else {
                vm.isRoleNoDataFound = true;
                vm.roleEmptyState = null;
              }
            }
            else {
              vm.isRoleNoDataFound = false;
              vm.roleEmptyState = null;
            }

            $timeout(() => {
              vm.resetSourceGrid();
              if (!vm.roleGridOptions.enablePaging && vm.totalRoleDataCount == vm.rolesCurrentdata) {
                return vm.roleGridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
              }
            });
          }
          if (vm.userRoleList && vm.userRoleList.length > 0 && vm.roles && vm.roles.length > 0) {
            _.map(vm.userRoleList, function (data) {
              _.map(vm.roles, function (item) {
                if (data.roleId == item.id) {
                  return item.isRoleChecked = true;
                }
              });
            });
            let RoleselesctedData = _.filter(vm.roles, function (data) {
              if ((data.isActive) || data.isRoleChecked && !data.isActive) {
                return data;
              }
            });
            if (RoleselesctedData.length > 0) {
              vm.roles = RoleselesctedData;
            }
            let checkAnyRoleSelected = _.filter(vm.roles, function (data) {
              if (data.isRoleChecked) {
                return data;
              }
            });

            if (checkAnyRoleSelected && checkAnyRoleSelected.length > 0) {
              vm.lastRoll = null;
              if (afterSave && vm.currentRole) {
                getRoleSelectedRow(vm.currentRole.isDeleted ? checkAnyRoleSelected[0] : vm.currentRole);
              } else {
                getRoleSelectedRow(checkAnyRoleSelected[0]);
              }
            }
          } else {
            if (vm.roles.length > 0) {
              var activeRoles = _.filter(vm.roles, function (Role) {
                if (Role.isActive)
                  return Role;
              });
              vm.roles = activeRoles;
            }
            vm.pages = [];
            vm.isPageNoDataFound = true;

            vm.features = [];
            vm.isFeatureNoDataFound = true;

            vm.currentRoleId = null;

            $scope.isRightChange = false;
            $scope.isFeatureChange = false;
          }
        });
      }

      // call getRolesByUser and pageList promise function
      if (vm.isRoleShow) {
        Allpromise.push(getRolesByUser(), vm.getRoleList(true));
        setUserRoleCheckbox(false);
      }

      if (vm.currentRoleId) {
        getPageListByRole(vm.currentTab, 0, vm.currentRoleId);
      }

      // Call function when check all check box of right
      vm.checkRight = (rightName, row) => {
        if (row) {
          if (rightName == 'RO') {
            if (row.RO) {

              let checkFalseRO = _.some(vm.pages, function (data) {
                return !data.RO;
              });
              //if (!checkFalseRO || filterFalseRO == false) {
              if (!checkFalseRO) {
                vm.isAllRORight = true;
                $scope.isRightChange = true;
                $scope.isFeatureChange = false;
              } else {
                $scope.isRightChange = true;
                $scope.isFeatureChange = false;
              }
            } else {
              $scope.isRightChange = true;
              $scope.isFeatureChange = false;
              vm.isAllRORight = false;
            }
            vm.selectedPageCount.selectedReadOnlyMenuCount = _.filter(vm.pages, (item) => { return item.RO }).length;
          } else if (rightName == 'RW') {
            if (row.RW) {

              let checkFalseRW = _.some(vm.pages, function (data) {
                return !data.RW;
              });
              if (!checkFalseRW) {
                vm.isAllRWRight = true;
                $scope.isRightChange = true;
                $scope.isFeatureChange = false;
              } else {
                $scope.isRightChange = true;
                $scope.isFeatureChange = false;
              }
            } else {
              $scope.isRightChange = true;
              $scope.isFeatureChange = false;
              vm.isAllRWRight = false;
            }
            vm.selectedPageCount.selectedReadAndWriteMenuCount = _.filter(vm.pages, (item) => { return item.RW }).length;
          } else if (rightName == 'PermissionActive') {
            if (row.isActive) {

              let checkFalsePermission = _.some(vm.pages, function (data) {
                return !data.isActive;
              });
              if (!checkFalsePermission) {
                vm.isAllPermissionRight = true;
                $scope.isRightChange = true;
                $scope.isFeatureChange = false;
              } else {
                $scope.isRightChange = true;
                $scope.isFeatureChange = false;
              }
            } else {
              $scope.isRightChange = true;
              $scope.isFeatureChange = false;
              vm.isAllPermissionRight = false;
              row.IsShortcut = false;
              //row.IsShowInHomePage = false;
              vm.isAllBookmarkRight = false;
              //vm.IsShowInHomePage = false;
            }
            vm.selectedPageCount.selectedIsActiveMenuCount = _.filter(vm.pages, (item) => { return item.isActive }).length;
          } else if (rightName == 'Bookmark') {
            if (row.IsShortcut) {

              let checkFalseBookmark = _.some(vm.pages, function (data) {
                return !data.IsShortcut;
              });
              if (!checkFalseBookmark) {
                vm.isAllBookmarkRight = true;
                $scope.isRightChange = true;
                $scope.isFeatureChange = false;
              } else {
                $scope.isRightChange = true;
                $scope.isFeatureChange = false;
              }
            } else {
              $scope.isRightChange = true;
              $scope.isFeatureChange = false;
              vm.isAllBookmarkRight = false;
            }
            vm.selectedPageCount.selectedBookmarkMenuCount = _.filter(vm.pages, (item) => { return item.IsShortcut }).length;
          } else if (rightName == 'Feature') {
            if (row.isActive) {

              let checkFalseFeature = _.some(vm.features, function (data) {
                return !data.isActive;
              });
              if (!checkFalseFeature) {
                vm.isAllFeatureRight = true;
                $scope.isRightChange = false;
                $scope.isFeatureChange = true;
              } else {
                $scope.isRightChange = false;
                $scope.isFeatureChange = true;
                // vm.isAllFeatureRight = true;
              }
            } else {
              $scope.isRightChange = false;
              $scope.isFeatureChange = true;
              vm.isAllFeatureRight = false;
            }
            vm.selectedPageCount.selectedFeturesAndRightsCount = _.filter(vm.features, (item) => { return item.isActive }).length;
          }
          else if (rightName == 'Standard') {
            if (row.standardCheck) {

              let checkFalseStandard = _.some(vm.standard, function (data) {
                return !data.standardCheck;
              });
              if (!checkFalseStandard) {
                vm.isAllStandardRight = true;
                $scope.isRightChange = false;
                $scope.isFeatureChange = false;
                $scope.isStandardChange = true;
                $scope.isDbViewDataSourceChange = false;
              } else {
                $scope.isRightChange = false;
                $scope.isFeatureChange = false;
                $scope.isStandardChange = true;
                $scope.isDbViewDataSourceChange = false;
              }
            } else {
              $scope.isRightChange = false;
              $scope.isFeatureChange = false;
              $scope.isStandardChange = true;
              $scope.isDbViewDataSourceChange = false;
              vm.isAllStandardRight = false;
              vm.isAllDbViewChecked = false
            }
          }
          else if (rightName == vm.dbViewDataSourceTabName) {
            if (row.isDBViewAccessChecked) {

              let checkFalsesDBViewDataSource = _.some(vm.sourceDataForDbViewDataSource, function (data) {
                return !data.isDBViewAccessChecked;
              });
              if (!checkFalsesDBViewDataSource) {
                vm.isAllDbViewChecked = true;
                $scope.isRightChange = false;
                $scope.isFeatureChange = false;
                $scope.isStandardChange = false;
                $scope.isDbViewDataSourceChange = true;
              } else {
                $scope.isRightChange = false;
                $scope.isFeatureChange = false;
                $scope.isStandardChange = false;
                $scope.isDbViewDataSourceChange = true;
                vm.isAllDbViewChecked = false;
              }
            } else {
              $scope.isRightChange = false;
              $scope.isFeatureChange = false;
              $scope.isStandardChange = false;
              $scope.isDbViewDataSourceChange = true;
              vm.isAllDbViewChecked = false;
            }
          }
        }
      }

      // Call function when check checkbox of particular right of page
      vm.checkAllRight = (rightName, isChecked) => {
        if (rightName == 'RO') {
          if (vm.advanceSearchPages && vm.advanceSearchPages.length > 0) {
            _.filter(vm.advanceSearchPages, (searchPage) => {
              let findSearchPage = _.find(vm.pages, (allPages) => { return allPages.pageName == searchPage.pageName });
              if (findSearchPage) {
                findSearchPage.RO = isChecked;
              }
            });
          } else {
            _.map(vm.pages, function (data) {
              data.RO = isChecked;
            });
          }

          $scope.isRightChange = true;
          $scope.isFeatureChange = false;
          vm.selectedPageCount.selectedReadOnlyMenuCount = _.filter(vm.pages, (item) => { return item.RO }).length;
        } else if (rightName == 'RW') {
          if (vm.advanceSearchPages && vm.advanceSearchPages.length > 0) {
            _.filter(vm.advanceSearchPages, (searchPage) => {
              let findSearchPage = _.find(vm.pages, (allPages) => { return allPages.pageName == searchPage.pageName });
              if (findSearchPage) {
                findSearchPage.RW = isChecked;
              }
            });
          } else {
            _.map(vm.pages, function (data) {
              data.RW = isChecked;
            });
          }

          $scope.isRightChange = true;
          $scope.isFeatureChange = false;
          vm.selectedPageCount.selectedReadAndWriteMenuCount = _.filter(vm.pages, (item) => { return item.RW }).length;
        } else if (rightName == 'PermissionActive') {
          if (vm.advanceSearchPages && vm.advanceSearchPages.length > 0) {
            _.filter(vm.advanceSearchPages, (searchPage) => {
              let findSearchPage = _.find(vm.pages, (allPages) => { return allPages.pageName == searchPage.pageName });
              if (findSearchPage) {
                findSearchPage.isActive = isChecked;
                if (!isChecked) {
                  findSearchPage.IsShortcut = false;
                  findSearchPage.IsAllShowInHomePage = false;
                }
              }
            });

            if (!isChecked) {
              vm.isAllBookmarkRight = false;
              //vm.IsAllShowInHomePage = false;
            }
          } else {
            _.map(vm.pages, function (data) {
              data.isActive = isChecked;
              if (!isChecked) {
                data.IsShortcut = false;
                //data.IsShowInHomePage = false;
              }
            });

            if (!isChecked) {
              vm.isAllBookmarkRight = false;
              //vm.IsAllShowInHomePage = false;
              vm.selectedPageCount.selectedBookmarkMenuCount = 0;
              vm.selectedPageCount.selectedShowInHomePageMenuCount = 0;
            }
          }

          $scope.isRightChange = true;
          $scope.isFeatureChange = false;
          vm.selectedPageCount.selectedIsActiveMenuCount = _.filter(vm.pages, (item) => { return item.isActive }).length;
        } else if (rightName == 'Bookmark') {
          if (vm.advanceSearchPages && vm.advanceSearchPages.length > 0) {
            _.filter(vm.advanceSearchPages, (searchPage) => {
              let findSearchPage = _.find(vm.pages, (allPages) => { return allPages.pageName == searchPage.pageName });
              if (findSearchPage) {
                findSearchPage.IsShortcut = isChecked;
              }
            });
          } else {
            _.map(vm.pages, function (data) {
              data.IsShortcut = isChecked;
            });
          }

          $scope.isRightChange = true;
          $scope.isFeatureChange = false;
          vm.selectedPageCount.selectedBookmarkMenuCount = _.filter(vm.pages, (item) => { return item.IsShortcut }).length;
        } else if (rightName == 'Feature') {
          if (vm.advanceSearchFeature && vm.advanceSearchFeature.length > 0) {
            _.filter(vm.advanceSearchFeature, (searchPage) => {
              let findSearchFeature = _.find(vm.features, (allFeature) => { return allFeature.featureName == searchPage.featureName });
              if (findSearchFeature) {
                findSearchFeature.isActive = isChecked;
              }
            });
          } else {
            _.map(vm.features, function (data) {
              data.isActive = isChecked;
            });
          }

          $scope.isRightChange = false;
          $scope.isFeatureChange = true;
          vm.selectedPageCount.selectedFeturesAndRightsCount = _.filter(vm.features, (item) => { return item.isActive }).length;
        }
        else if (rightName == 'Standard') {
          if (vm.advanceSearchStandard && vm.advanceSearchStandard.length > 0) {
            _.filter(vm.advanceSearchStandard, (searchPage) => {
              let findSearchStandard = _.find(vm.standard, (allstandard) => { return allstandard.fullName == searchPage.fullName });
              if (findSearchStandard) {
                findSearchStandard.standardCheck = isChecked;
              }
            });
          } else {
            _.map(vm.standard, function (data) {
              data.standardCheck = isChecked;
            });
          }
          $scope.isRightChange = false;
          $scope.isFeatureChange = false;
          $scope.isStandardChange = true;
          $scope.isDbViewDataSourceChange = false;
        }
        else if (rightName == vm.dbViewDataSourceTabName) {
          if (vm.advanceSearchDbViewDataSource && vm.advanceSearchDbViewDataSource.length > 0) {
            _.filter(vm.advanceSearchDbViewDataSource, (searchPage) => {
              let findSearchDbView = _.find(vm.sourceDataForDbViewDataSource, (allstandard) => { return allstandard.name == searchPage.name });
              if (findSearchDbView) {
                findSearchDbView.isDBViewAccessChecked = isChecked;
              }
            });
          } else {
            _.map(vm.sourceDataForDbViewDataSource, function (data) {
              data.isDBViewAccessChecked = isChecked;
            });
          }
          $scope.isRightChange = false;
          $scope.isFeatureChange = false;
          $scope.isStandardChange = false;
          $scope.isDbViewDataSourceChange = true;
        }

      }

      // Call when change tab for show confirmation alert for save changes
      vm.isStepValid = function (step) {
        switch (step) {
          case 0: {
            if ($scope.isRightChange)
              return showWithoutSavingAlertTab();
            else
              return true;
            break;
          }
          case 1: {
            if ($scope.isFeatureChange)
              return showWithoutSavingAlertTab();
            else
              return true;
            break;
          }
          case 2: {
            if ($scope.isStandardChange)
              return showWithoutSavingAlertTab();
            else
              return true;
            break;
          }
          case 3: {
            if ($scope.isDbViewDataSourceChange)
              return showWithoutSavingAlertTab();
            else
              return true;
            break;
          }
        }
      }

      // Function of confirmation alert of change tab
      let showWithoutSavingAlertTab = () => {

        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE_FOR_TAB);
        let obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON_FOR_TAB,
          canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
        };
        return DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes)
            return true;
        }, (cancel) => {
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      /*Function of confirmation alert of change role*/
      let showWithoutSavingAlertRole = (row, ActionControl, lastRoll) => {

        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.WITHOUT_SAVING_ALERT_BODY_MESSAGE_FOR_ROLE);
        let obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON_FOR_ROLE,
          canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
        };
        return DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            if (ActionControl == 'checkbox') {
              roleChecked(row);
            }
            else {
              getRoleSelectedRow(row);
            }
          }
        }, (cancel) => {
          if (ActionControl == 'checkbox') {
            row.isRoleChecked = !row.isRoleChecked;
          } else {
            if (lastRoll)
              lastRoll.isSelected = true;
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      // Function of get confirmation of old role
      let showConfirmationForOldRoleDelete = (row) => {

        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.CONFIRMATION_FOR_DELETE_ROLE);
        messageContent.message = stringFormat(messageContent.message, row.name);
        let obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.DeleteRoleRight(row);

            vm.currentRoleId = null;
            vm.showDefaultRights = false;
          }
        }, (cancel) => {
          row.isRoleChecked = true;
          if (row) {
            let isEdit = _.some(vm.userRoleList, function (data) {
              return data.roleId == row.id;
            })
            if (isEdit) {
              $scope.isRightChange = false;
              $scope.isFeatureChange = false;
            }
            getRoleSelectedRow(row);
          } else {
            vm.pages = [];
            vm.isPageNoDataFound = true;

            vm.features = [];
            vm.isFeatureNoDataFound = true;

            vm.currentRoleId = null;

            $scope.isRightChange = false;
            $scope.isFeatureChange = false;
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      // Function of show information popup for logout of current user after save
      let showInformationForReLoginOfCurrentUser = () => {

        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.CHANGE_PERMISSION_LOGOUT);
        let obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_LOGOUT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_Continue
        };
        return DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            Allpromise = [];
            Allpromise.push(getRolesByUser(), vm.getRoleList(true));
            setUserRoleCheckbox(true);
            BaseService.logoutWithOperationConfirmation(vm);
          }
        }, (cancel) => {
          if ($scope.pageName == vm.PageRightsRole) {
            if (vm.currentTab == vm.permissionsTabName) {
              isFirstTimeCallPage = false;
              vm.getPageList();
            } else {
              isFirstTimeCallFeature = false;
              vm.getFeatureList();
            }
          } else {
            Allpromise = [];
            Allpromise.push(getRolesByUser(), vm.getRoleList(true));
            setUserRoleCheckbox(true);
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      // Function of show information popup for send notification of other user after save
      let showInformationForSendNotificationOfOtherUser = () => {

        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.CHANGE_PERMISSION_SEND_NOTIFICATION);
        let obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_SEND_NOTIFICATION,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_Continue
        };
        return DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            if ($scope.pageName == vm.PageRightsRole) {
              if (vm.currentTab == vm.permissionsTabName) {
                isFirstTimeCallPage = false;
                vm.getPageList();
              } else {
                isFirstTimeCallFeature = false;
                vm.getFeatureList();
              }
            } else {
              Allpromise = [];
              Allpromise.push(getRolesByUser(), vm.getRoleList(true));
              setUserRoleCheckbox(true);
            }
            sendNotificationAllActiveSession();
          }
        }, (cancel) => {
          if ($scope.pageName == vm.PageRightsRole) {
            if (vm.currentTab == vm.permissionsTabName) {
              isFirstTimeCallPage = false;
              vm.getPageList();
            } else {
              isFirstTimeCallFeature = false;
              vm.getFeatureList();
            }
          } else {
            Allpromise = [];
            Allpromise.push(getRolesByUser(), vm.getRoleList(true));
            setUserRoleCheckbox(true);
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      let SaveRoleRight = $scope.$on('SaveRoleRight', (event) => { vm.SaveRoleRight() });

      let SaveRoleFeature = $scope.$on('SaveRoleFeature', (event) => { vm.SaveRoleFeature(event) });

      // Function for save role - right - feature
      vm.SaveRoleRight = () => {
        if (vm.userRoleList && vm.userRoleList.length > 0) {
          let selectRole = _.filter(vm.roles, (data) => { return data.isRoleChecked });
          let newRole = selectRole;
          _.each(vm.userRoleList, (item) => {
            newRole = _.reject(newRole, (data) => {
              if (data.id == item.roleId)
                return data;
            });
          });
          SaveRoleRightFeature.RoleList = newRole;

          if (SaveRoleRightFeature.RoleList && SaveRoleRightFeature.RoleList.length > 0) {
            if (vm.pages && vm.pages.length > 0) {
              let activeParentPages = _.filter(vm.pages, (data) => { return data.isActive });
              _.filter(activeParentPages, function (data) {
                AllActivePage.push(data);
                getChildPages([data]);
              });
              SaveRoleRightFeature.PageList = AllActivePage;
            }
            SaveRoleRightFeature.FeatureList = _.filter(vm.features, (data) => { return data.isActive });
          } else {
            let changePageList = _.filter(_.map(oldPages, (obj, index) => {
              var isEqual = angular.equals(obj, vm.pages[index]);
              if (!isEqual) {
                return vm.pages[index];
              }
            }), (item) => { return item; });

            let activeParentPages = changePageList;
            _.filter(activeParentPages, function (data) {
              AllActivePage.push(data);
              getChildPages([data]);
            });
            SaveRoleRightFeature.PageList = AllActivePage;

            let changeFeatureList = _.filter(_.map(oldFeatures, (obj, index) => {
              var isEqual = angular.equals(obj, vm.features[index]);
              if (!isEqual) {
                return vm.features[index];
              }
            }), (item) => { return item; });
            SaveRoleRightFeature.FeatureList = changeFeatureList;
          }

        } else {
          SaveRoleRightFeature.RoleList = _.filter(vm.roles, (data) => { return data.isRoleChecked });
          if (vm.pages && vm.pages.length > 0) {
            let activeParentPages = _.filter(vm.pages, (data) => { return data.isActive });
            _.filter(activeParentPages, function (data) {
              AllActivePage.push(data);
              getChildPages([data]);
            });
            SaveRoleRightFeature.PageList = AllActivePage;
          }
          if (vm.features && vm.features.length > 0)
            SaveRoleRightFeature.FeatureList = _.filter(vm.features, (data) => { return data.isActive });
        }

        SaveRoleRightFeature.userId = vm.userId; 
        SaveRoleRightFeature.identityUserId = vm.identityUserId; 
        vm.cgBusyLoading = RolePagePermisionFactory.saveRoleRightPage().save(SaveRoleRightFeature).$promise.then((objRoleRightFeature) => {
          if (objRoleRightFeature) {
            if (objRoleRightFeature.status == CORE.ApiResponseTypeStatus.SUCCESS) {
              vm.roleGridOptions.gridApi.grid.clearAllFilters();
              vm.pageGridOptions.gridApi.grid.clearAllFilters();
              vm.featureGridOptions.gridApi.grid.clearAllFilters();
              AllActivePage = [];
              SaveRoleRightFeature = {
                RoleList: [],
                DeleteRoleList: [],
                PageList: [],
                FeatureList: [],
              };
              isSaveData = true;
              vm.showDefaultRights = false;
              //vm.advanceSearchPages = angular.copy(vm.pages);
              if (vm.loginUser && vm.loginUser.userid == vm.userId) {
                showInformationForReLoginOfCurrentUser();
              } else {
                showInformationForSendNotificationOfOtherUser();
              }
              $scope.$emit("savedRoleRight", true)
            }
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
        isFirstTimeCallPage = false;
        //vm.getPageList();
      }

      // Function for delete role
      vm.DeleteRoleRight = (deleteRole) => {
        DeleteOldRole = deleteRole;
        DeleteOldRole.userId = vm.userId;
        DeleteOldRole.identityUserId = vm.identityUserId;
        vm.cgBusyLoading = RolePagePermisionFactory.deleteRoleRight().save(DeleteOldRole).$promise.then((objDeleteRole) => {
          if (objDeleteRole) {
            if (objDeleteRole.status == CORE.ApiResponseTypeStatus.SUCCESS) {
              isFirstTimeCallRoll = false;
              $scope.isRightChange = false;
              $scope.isFeatureChange = false;
              AllActivePage = [];
              isSaveData = true;
              if (vm.currentRole)
                vm.currentRole.isDeleted = 1;

              if (vm.loginUser && vm.loginUser.userid == vm.userId) {
                showInformationForReLoginOfCurrentUser();
              } else {
                showInformationForSendNotificationOfOtherUser();
              }
            }
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      // Function for save role 
      vm.SaveRoleFeature = (event) => {
        if (event) {
          event.preventDefault();
          //event.stopPropagation();
        }
        if (vm.roleId == 0) {
          if (vm.pages && vm.pages.length > 0) {
            let activeParentPages = _.filter(vm.pages, (data) => { return data.isActive });
            _.filter(activeParentPages, function (data) {
              AllActivePage.push(data);
              getChildPages([data]);
            });
            SavePageFeature.PageList = AllActivePage;
          }
          if (vm.features && vm.features.length > 0)
            SavePageFeature.FeatureList = _.filter(vm.features, (data) => { return data.isActive });
          if (vm.standard && vm.standard.length > 0) {
            SavePageFeature.standardList = _.filter(vm.standard, (item) => { return item.roleID });
          }
          if (vm.sourceDataForDbViewDataSource && vm.sourceDataForDbViewDataSource.length > 0) {
            SavePageFeature.DbViewDataSourceList = _.filter(vm.sourceDataForDbViewDataSource, (item) => { return item.roleID });
          }
        } else {
          let changePageList = _.filter(_.map(angular.copy(oldPages), (obj, index) => {
            var isEqual = angular.equals(obj, vm.pages[index]);
            if (!isEqual) {
              return vm.pages[index];
            }
          }), (item) => { return item; });

          let activeParentPages = changePageList;
          //copy of object for find changeFeatureList withought grid refresh 
          oldPages = angular.copy(vm.pages);
          _.filter(activeParentPages, function (data) {
            AllActivePage.push(data);
            getChildPages([data]);
          });
          SavePageFeature.PageList = AllActivePage;

          let changeFeatureList = _.filter(_.map(angular.copy(oldFeatures), (obj, index) => {
            var isEqual = angular.equals(obj, vm.features[index]);
            if (!isEqual) {
              return vm.features[index];
            }
          }), (item) => { return item; });
          //copy of object for find changeFeatureList withought grid refresh 
          oldFeatures = angular.copy(vm.features);
          SavePageFeature.FeatureList = changeFeatureList;


          let changeStandardList = _.filter(_.map(angular.copy(oldStandard), (obj, index) => {
            var isEqual = angular.equals(obj, vm.standard[index]);
            if (!isEqual) {
              return vm.standard[index];
            }
          }), (item) => { return item; });
          SavePageFeature.standardList = changeStandardList;
          //copy of object for find changeStandardList value withought grid refresh 
          oldStandard = angular.copy(vm.standard);

          /* save DB View data source */
          let changedDbViewDataSourceList = _.filter(_.map(angular.copy(oldDbViewDataSource), (obj, index) => {
            var isEqual = angular.equals(obj, vm.sourceDataForDbViewDataSource[index]);
            if (!isEqual) {
              return vm.sourceDataForDbViewDataSource[index];
            }
          }), (item) => { return item; });
          SavePageFeature.DbViewDataSourceList = changedDbViewDataSourceList;
          //copy of object for find changedDbViewDataSourceList value withought grid refresh 
          oldDbViewDataSource = angular.copy(vm.sourceDataForDbViewDataSource);
        }


        if ($scope.pageName == vm.RolePage) {
          if (vm.IsEdit) {
            updateRole(vm.roleId);
          } else {
            addRole();
          }
        }

        if ($scope.pageName == vm.PageRightsRole) {
          SavePageFeatureRecord(vm.roleId);
        }
        //vm.getPageList();
      }


      $scope.$on('$destroy', function () {
        SaveRoleFeature();
      });

      // Function for add new role
      let addRole = () => {
        const addObj = $scope.roleObj;
        return vm.cgBusyLoading = RoleFactory.role().save(addObj).$promise.then((res) => {
          if (res && res.data) {
            vm.createMessage = res.data.message;
            vm.roleId = res.data.data.id;
            vm.isAdd = true;
            SavePageFeatureRecord(vm.roleId, vm.isAdd);
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      // Function for update old role
      let updateRole = (rolId) => {
        const updateObj = $scope.roleObj;
        return vm.cgBusyLoading = RoleFactory.role().update({ id: rolId }, updateObj).$promise.then((role) => {
          if (role && role.data) {
            vm.roleId = role.data.data.id;
            vm.updateMessage = role.data.message;
            vm.isAdd = false;
            SavePageFeatureRecord(vm.roleId, vm.isAdd);
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      };

      // Function call by SaveRoleFeature when save page - feature page without role
      let SavePageFeatureRecord = (roleId, isAdd) => {
        SavePageFeature.roleId = roleId;
        if (SavePageFeature && (SavePageFeature.FeatureList.length > 0 || SavePageFeature.PageList.length > 0
          || SavePageFeature.standardList.length > 0 || SavePageFeature.DbViewDataSourceList.length > 0)) {
          return vm.cgBusyLoading = RoleFactory.SaveRoleFeature().save(SavePageFeature).$promise.then((objPageFeature) => {
            if (objPageFeature && objPageFeature.data) {
              if (objPageFeature.status == CORE.ApiResponseTypeStatus.SUCCESS) {
                isFirstTimeCallFeature = false;
                AllActivePage = [];
                if (vm.currentTab == vm.permissionsTabName) {
                  //Add for toaster message dispaly tab wise using NotificationFactory
                  if (objPageFeature.data.isPageList)
                    NotificationFactory.success(CORE.MESSAGE_CONSTANT.SAVE_ROLE_PERMISSION);
                  $scope.isRightChange = false;
                  isFirstTimeCallPage = false;
                  vm.pageGridOptions.gridApi.grid.clearAllFilters();
                  //vm.getPageList();
                }
                else if (vm.currentTab == vm.featuresTabName) {
                  //Add for toaster message dispaly tab wise using NotificationFactory
                  if (objPageFeature.data.isFeatureList)
                    NotificationFactory.success(CORE.MESSAGE_CONSTANT.SAVE_FEATURE_PERMISSION);
                  $scope.isFeatureChange = false;
                  vm.featureGridOptions.gridApi.grid.clearAllFilters();
                }
                else if (vm.currentTab == vm.dbViewDataSourceTabName) {
                  //Add for toaster message dispaly tab wise using NotificationFactory
                  if (objPageFeature.data.isDbViewDataSourceList)
                    NotificationFactory.success(CORE.MESSAGE_CONSTANT.SAVE_DBVIEW_PERMISSION);
                  $scope.isDbViewDataSourceChange = false;
                  vm.gridOptionsForDbViewDataSource.gridApi.grid.clearAllFilters();
                  vm.loadDataForDbViewDataSource();
                }
                else {
                  //Add for toaster message dispaly tab wise using NotificationFactory
                  if (objPageFeature.data.isstandardList)
                    NotificationFactory.success(CORE.MESSAGE_CONSTANT.SAVE_STANDARD_PERMISSION);
                  $scope.isStandardChange = false;
                  vm.standardGridOptions.gridApi.grid.clearAllFilters();
                  vm.getstandardList();
                }

                SavePageFeature = {
                  PageList: [],
                  FeatureList: [],
                  standardList: [],
                  DbViewDataSourceList: []
                };
                if ($scope.pageName == vm.RolePage) {
                  vm.rid = vm.roleId;
                  // setUserRoleCheckbox();

                  $scope.$emit("setrolepermissionFrom", vm.rid);
                  //$state.go(USER.ADMIN_USER_ROLE_STATE);
                }

                if ($scope.pageName == vm.PageRightsRole) {
                  $scope.isRightChange = false;
                  $scope.isFeatureChange = false;
                  $scope.isStandardChange = false;
                  if (vm.loginUser && vm.loginUser.userid == vm.userId) {
                    showInformationForReLoginOfCurrentUser();
                  } else {
                    showInformationForSendNotificationOfOtherUser();
                  }
                }
              }
            }
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        }
        else {
          AllActivePage = [];
          if ($scope.pageName == vm.RolePage) {

            //$state.go(USER.ADMIN_USER_ROLE_STATE);
            vm.rid = vm.roleId;
            //setUserRoleCheckbox();

            $scope.$emit("setroleFrom", vm.rid);
            if (vm.currentTab == vm.permissionsTabName) {
              $scope.isRightChange = false;
              isFirstTimeCallPage = false;
              vm.pageGridOptions.gridApi.grid.clearAllFilters();
            }
            else if (vm.currentTab == vm.featuresTabName) {
              $scope.isFeatureChange = false;
              vm.featureGridOptions.gridApi.grid.clearAllFilters();
            }
            else if (vm.currentTab == vm.dbViewDataSourceTabName) {
              $scope.isDbViewDataSourceChange = false;
              vm.gridOptionsForDbViewDataSource.gridApi.grid.clearAllFilters();
              vm.loadDataForDbViewDataSource();
            }
            else {
              $scope.isStandardChange = false;
              vm.standardGridOptions.gridApi.grid.clearAllFilters();
              vm.getstandardList();
            }

          }

          if ($scope.pageName == vm.PageRightsRole) {
            $scope.isRightChange = false;
            $scope.isFeatureChange = false;
            $scope.isStandardChange = false;

            if (vm.currentTab == vm.permissionsTabName) {
              vm.pageGridOptions.gridApi.grid.clearAllFilters();
            } else if (vm.currentTab == vm.featuresTabName) {
              vm.featureGridOptions.gridApi.grid.clearAllFilters();
            }
            else {
              vm.standardGridOptions.gridApi.grid.clearAllFilters();
            }

            if (vm.loginUser && vm.loginUser.userid == vm.userId) {
              showInformationForReLoginOfCurrentUser();
            } else {
              showInformationForSendNotificationOfOtherUser();
            }
          }
        }
      }

      // Function for get all child page of parent page for save perent related child page
      let getChildPages = (parenPage) => {
        _.filter(parenPage, (item) => {
          let chilePageList = _.filter(AllPages, (matchData) => {
            if (matchData.parentPageID == item.pageID && !matchData.isDisplay) {
              matchData.RO = item.RO;
              matchData.RW = item.RW;
              matchData.isActive = item.isActive;
              matchData.IsShortcut = item.IsShortcut;
              AllActivePage.push(matchData);
              return matchData;
            }
          });

          if (chilePageList && chilePageList.length > 0) {
            getChildPages(chilePageList);
          };
        });
      }

      // Function for update the default role field of user table when first role selected
      let setAsDefaultRole = () => {
        let userObject = {
          id: vm.userId,
          defaultLoginRoleID: vm.userRoleList[0] ? vm.userRoleList[0].roleId : null
        }

        UserFactory.updateUserByDefaultRole().query({ userObj: userObject }).$promise.then((updateRole) => {
          if (updateRole.status == CORE.ApiResponseTypeStatus.SUCCESS) {

          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      /************************** [S] - Section for DB View Data Source ****************************/
      let oldDbViewDataSource = [];
      vm.sourceDataForDbViewDataSource = [];

      vm.pagingInfoForDbViewDataSource = {
        Page: 0,
        SortColumns: [['name', 'ASC']],
        SearchColumns: [],
        roleId: vm.roleId
      };

      vm.gridOptionsForDbViewDataSource = {
        showColumnFooter: false,
        enableRowHeaderSelection: false,
        enableFullRowSelection: true,
        enableRowSelection: true,
        multiSelect: false,
          filterOptions: vm.pagingInfoForDbViewDataSource.SearchColumns,
          hideMultiDeleteButton: true
      };

      vm.sourceHeaderForDbViewDataSource = [
        {
          field: 'name',
          width: '84%',
          displayName: 'Data Source',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableCellEdit: false,
        },
        {
          field: 'roleID',
          cellClass: 'gridCellColor',
          displayName: 'Data Source Access',
          width: '16%',
          cellTemplate: `<div class="center cm-role-checkbox">`
            + `<label class="cm-radio">`
            + `<input ui-grid-checkbox type="checkbox"`
            + `ng-model="row.entity.isDBViewAccessChecked" class="cm-role-checkbox"`
            + `ng-checked="row.entity.isDBViewAccessChecked == '1'"`
            + `ng-change="grid.appScope.$parent.vm.checkRight(grid.appScope.$parent.vm.dbViewDataSourceTabName, row.entity)"`
            + `ng-disabled="!grid.appScope.$parent.vm.isUpdatable">`
            + `<span class="checkmark"></span>`
            + `</label>`
            + `</div>`,
          filterHeaderTemplate: `<div class="center cm-role-checkbox">`
            + `<label class="cm-radio">`
            + `<input ui-grid-checkbox type="checkbox"`
            + `ng-model="grid.appScope.$parent.vm.isAllDbViewChecked"`
            + `ng-change="grid.appScope.$parent.vm.checkAllRight(grid.appScope.$parent.vm.dbViewDataSourceTabName, grid.appScope.$parent.vm.isAllDbViewChecked)" class="cm-role-checkbox"`
            + `ng-disabled="!grid.appScope.$parent.vm.isUpdatable">`
            + `<span class="checkmark"></span>`
            + `</label>`
            + `</div>`,
          enableSorting: false,
          exporterSuppressExport: false,
          pinnedLeft: false,
          enableCellEdit: false,
        },
      ]

      //Get The All db view list for accessing widget/reports
      vm.loadDataForDbViewDataSource = () => {
        if (vm.isDbViewDataSourceShow) {
          if (vm.pagingInfoForDbViewDataSource && (vm.pagingInfoForDbViewDataSource.RoleId || vm.pagingInfoForDbViewDataSource.RoleId == 0)) {
            vm.pagingInfoForDbViewDataSource.Page = 0;
            if (isFirstTimeCallDbViewDataSource) {

              let searchString;
              if (vm.pagingInfoForDbViewDataSource.SearchColumns && vm.pagingInfoForDbViewDataSource.SearchColumns.length > 0)
                searchString = vm.pagingInfoForDbViewDataSource.SearchColumns[0].SearchString;

              //let withoutSearchStandard = vm.sourceDataForDbViewDataSource;
              if (!searchString) {
                vm.sourceDataForDbViewDataSource = vm.allDbViewDataSourceData;
              } else {
                vm.sourceDataForDbViewDataSource = _.filter(oldDbViewDataSource, (data) => {
                  if (data.name.toUpperCase().includes(searchString ? searchString.toUpperCase() : ""))
                    return data;
                });
              }
              vm.advanceSearchDbViewDataSource = angular.copy(vm.sourceDataForDbViewDataSource);
              let dvdsCount = vm.sourceDataForDbViewDataSource.length;

              if (dvdsCount > 0) {
                let checkFalseDbViewDataSource = _.some(vm.advanceSearchDbViewDataSource, function (data) {
                  return !data.isDBViewAccessChecked;
                });
                if (!checkFalseDbViewDataSource) {
                  vm.isAllDbViewChecked = true;
                } else {
                  vm.isAllDbViewChecked = false;
                }
              } else {
                vm.isAllDbViewChecked = false;
              }

              if (!vm.gridOptionsForDbViewDataSource.enablePaging) {
                vm.currentdataForDbViewDataSource = vm.sourceDataForDbViewDataSource.length;
                // vm.gridOptionsForDbViewDataSource.gridApi.infiniteScroll.resetScroll();
              }
              vm.gridOptionsForDbViewDataSource.clearSelectedRows();
              let dbViewDataSourceDataCount = vm.sourceDataForDbViewDataSource.length;

              // for apply sorting on data after all fiters are done
              let sortbyDbViewDataSourceArray;
              if (vm.pagingInfoForDbViewDataSource.SortColumns && vm.pagingInfoForDbViewDataSource.SortColumns.length > 0) {
                sortbyDbViewDataSourceArray = vm.pagingInfoForDbViewDataSource.SortColumns[0];
              }
              if (sortbyDbViewDataSourceArray && sortbyDbViewDataSourceArray.length > 0) {
                let sortbyFieldname = sortbyDbViewDataSourceArray[0];
                let sorttype = sortbyDbViewDataSourceArray[1];

                vm.sourceDataForDbViewDataSource = _.orderBy(vm.sourceDataForDbViewDataSource, sortbyFieldname, sorttype);
              }

              if (dbViewDataSourceDataCount == 0) {
                if (vm.pagingInfoForDbViewDataSource.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
                  vm.isDbViewDataSourceNoDataFound = false;
                  vm.emptyStateForDbViewDataSource = 0;
                }
                else {
                  vm.isDbViewDataSourceNoDataFound = true;
                  vm.emptyStateForDbViewDataSource = null;
                }
              }
              else {
                vm.isDbViewDataSourceNoDataFound = false;
                vm.emptyStateForDbViewDataSource = null;
              }

              $timeout(() => {
                vm.resetSourceGridForDbViewDataSource();
                //vm.sourceDataForDbViewDataSource = withoutSearchStandard;
                if (!vm.gridOptionsForDbViewDataSource.enablePaging && vm.totalSourceDataCountForDbViewDataSource == vm.currentdataForDbViewDataSource) {
                  return vm.gridOptionsForDbViewDataSource.gridApi.infiniteScroll.dataLoaded(false, false);
                }
              });
            }
            else {
              return RawdataCategoryFactory.rawdatacategorylist(vm.pagingInfoForDbViewDataSource).query().$promise.then((rawdatacategory) => {
                let sourceDataOfDbViews = rawdatacategory.data.Chart_Rawdata_Category;
                vm.allDbViewDataSourceData = rawdatacategory.data.Chart_Rawdata_Category;
                vm.sourceDataForDbViewDataSource = [];
                _.each(sourceDataOfDbViews, function (item) {
                  if (item.isAccessByDefinedRole) {
                    //if (item.roleID == vm.roleId) {
                    item.isDBViewAccessChecked = true;
                  }
                  else {
                    item.isDBViewAccessChecked = false;
                  }
                  vm.sourceDataForDbViewDataSource.push(item);
                  //}
                })

                vm.totalSourceDataCountForDbViewDataSource = vm.sourceDataForDbViewDataSource.length;

                oldDbViewDataSource = angular.copy(vm.sourceDataForDbViewDataSource);

                if (!vm.gridOptionsForDbViewDataSource.enablePaging) {
                  vm.currentdataForDbViewDataSource = vm.sourceDataForDbViewDataSource.length;
                  vm.gridOptionsForDbViewDataSource.gridApi.infiniteScroll.resetScroll();
                }
                vm.gridOptionsForDbViewDataSource.clearSelectedRows();
                if (vm.totalSourceDataCountForDbViewDataSource == 0) {
                  if (vm.pagingInfoForDbViewDataSource.SearchColumns.length > 0 || !_.isEmpty(vm.SearchMode)) {
                    vm.isDbViewDataSourceNoDataFound = false;
                    vm.emptyStateForDbViewDataSource = 0;
                  }
                  else {
                    vm.isDbViewDataSourceNoDataFound = true;
                    vm.emptyStateForDbViewDataSource = null;
                  }
                }
                else {
                  vm.isDbViewDataSourceNoDataFound = false;
                  vm.emptyStateForDbViewDataSource = null;
                }

                let isAnyDbViewInNotSelectedMode = _.some(vm.sourceDataForDbViewDataSource, function (data) {
                  return !data.isDBViewAccessChecked;
                });

                if (isAnyDbViewInNotSelectedMode) {
                  vm.isAllDbViewChecked = false;
                }
                else {
                  vm.isAllDbViewChecked = true;
                }

                isFirstTimeCallDbViewDataSource = true;

                $timeout(() => {
                  vm.resetSourceGridForDbViewDataSource();
                  if (!vm.gridOptionsForDbViewDataSource.enablePaging && vm.totalSourceDataCountForDbViewDataSource == vm.currentdataForDbViewDataSource) {
                    return vm.gridOptionsForDbViewDataSource.gridApi.infiniteScroll.dataLoaded(false, false);
                  }
                });
              }).catch((error) => {
                return BaseService.getErrorLog(error);
              });
            }
          }
        }
      }

      vm.getDataDownForDbViewDataSource = () => {
        vm.pagingInfoForDbViewDataSource.Page = vm.pagingInfoForDbViewDataSource.Page + 1;

        vm.cgBusyLoading = RawdataCategoryFactory.rawdatacategorylist(vm.pagingInfoForDbViewDataSource).query().$promise.then((rawdatacategory) => {

          _.each(rawdatacategory.data.Chart_Rawdata_Category, function (item) {
            if (item.isAccessByDefinedRole) {
              item.isDBViewAccessChecked = true;
            }
            else {
              item.isDBViewAccessChecked = false;
            }
            vm.sourceDataForDbViewDataSource.push(item);
          })
          vm.currentdataForDbViewDataSource = vm.sourceDataForDbViewDataSource.length;
          vm.gridOptionsForDbViewDataSource.gridApi.infiniteScroll.saveScrollPercentage();
          //setUserRoleCheckbox();
          $timeout(() => {
            vm.resetSourceGridForDbViewDataSource();
            return vm.gridOptionsForDbViewDataSource.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCountForDbViewDataSource != vm.currentdataForDbViewDataSource ? true : false);
          });

        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      /*Used to show default rights and feature role wise*/
      vm.onShowDefaultRights = (msWizard) => {
        if (vm.showDefaultRights) {
          let roleObj = {
            tabName: msWizard.selectedIndex == 0 ? vm.permissionsTabName : vm.featuresTabName,
            roleId: vm.currentRoleId
          }

          if (vm.currentTab == vm.permissionsTabName) {
            vm.rightsPagingInfo.isShowDefault = vm.showDefaultRights ? 1 : 0;
          } else if (vm.currentTab == vm.featuresTabName) {
            vm.featurePagingInfo.isShowDefault = vm.showDefaultRights ? 1 : 0;
          }

          vm.cgBusyLoading = RolePagePermisionFactory.pagePermission(vm.currentTab == vm.permissionsTabName ? vm.rightsPagingInfo : vm.featurePagingInfo).query().$promise.then((pageRights) => {
            vm.isAllRORight = false;

            allRolePageList = msWizard.selectedIndex == 0 ? pageRights.data.pages : pageRights.data;
            if (msWizard.selectedIndex == 0) {
              $scope.isRightChange = true;
              _.each(allRolePageList, (rolePageItem) => {
                _.filter(vm.pages, (item) => {
                  if ((item.pageID == rolePageItem.pageID) && item.isDisplay) {
                    item.RO = rolePageItem.RO == 1 ? true : false;
                    item.isDefaultRO = rolePageItem.RO == 1 ? true : false; /*Used this key to highlight default rights*/
                    item.RW = rolePageItem.RW == 1 ? true : false;
                    item.isDefaultRW = rolePageItem.RW == 1 ? true : false; /*Used this key to highlight default rights*/
                    item.isActive = rolePageItem.isActive == 1 ? true : false;
                    item.isDefaultActive = rolePageItem.isActive == 1 ? true : false;/*Used this key to highlight default rights*/
                    item.IsShortcut = rolePageItem.IsShortcut == 1 ? true : false;
                    item.isDefaultIsShortcut = rolePageItem.IsShortcut == 1 ? true : false;/*Used this key to highlight default rights*/

                  }
                })
              })
              vm.checkUnCheckAllRights(allRolePageList);
              vm.selectedPageCount.selectedReadOnlyMenuCount = _.filter(allRolePageList, (item) => { return item.RO && item.isDisplay }).length;
              vm.selectedPageCount.selectedReadAndWriteMenuCount = _.filter(allRolePageList, (item) => { return item.RW && item.isDisplay }).length;
              vm.selectedPageCount.selectedIsActiveMenuCount = _.filter(allRolePageList, (item) => { return item.isActive && item.isDisplay }).length;
              vm.selectedPageCount.selectedBookmarkMenuCount = _.filter(allRolePageList, (item) => { return item.IsShortcut && item.isDisplay }).length;
              //vm.selectedPageCount.selectedShowInHomePageMenuCount = _.filter(allRolePageList, (item) => { return item.IsShowInHomePage && item.isDisplay }).length;
            }
            else {
              $scope.isFeatureChange = true;
              highlightFeaturesRights(allRolePageList);
            }
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        }
        else {
          if (msWizard.selectedIndex == 0) {
            isFirstTimeCallPage = false;
            vm.getPageList();
          } else {
            isFirstTimeCallFeature = false;
            vm.getFeatureList();
          }
        }
      }

      let highlightFeaturesRights = (allRolePageList) => {
        _.each(allRolePageList.features, function (featuresItem) {
          _.filter(vm.features, function (item) {
            if (featuresItem.featureID == item.featureID) {
              item.isActive = featuresItem.isActive == 1 ? true : false;
              item.isDefaultActive = featuresItem.isActive == 1 ? true : false; /*Used this key to highlight default rights*/
            }
          });
        });

        if (vm.features.length > 0) {
          let checkFalseFeature = _.some(vm.features, function (data) {
            return !data.isActive;
          });
          if (!checkFalseFeature) {
            vm.isAllFeatureRight = true;
          } else {
            vm.isAllFeatureRight = false;
          }
        } else {
          vm.isAllFeatureRight = false;
        }

        vm.selectedPageCount.selectedFeturesAndRightsCount = _.filter(vm.features, (item) => { return item.isActive }).length;
      }

      vm.checkUnCheckAllRights = (pages) => {
        if (pages.length > 0) {
          let checkFalseRO = _.some(pages, function (data) {
            return !data.RO;
          });
          if (!checkFalseRO) {
            vm.isAllRORight = true;
          } else {
            vm.isAllRORight = false;
          }

          let checkFalseRW = _.some(pages, function (data) {
            return !data.RW;
          });
          if (!checkFalseRW) {
            vm.isAllRWRight = true;
          } else {
            vm.isAllRWRight = false;
          }

          let checkFalsePermission = _.some(pages, function (data) {
            return !data.isActive;
          });
          if (!checkFalsePermission) {
            vm.isAllPermissionRight = true;
          } else {
            vm.isAllPermissionRight = false;
          }

          let checkFalseBookmark = _.some(pages, function (data) {
            return !data.IsShortcut;
          });
          if (!checkFalseBookmark) {
            vm.isAllBookmarkRight = true;
          } else {
            vm.isAllBookmarkRight = false;
          }


        } else {
          vm.isAllRORight = false;
          vm.isAllRWRight = false;
          vm.isAllPermissionRight = false;
          vm.isAllBookmarkRight = false;
        }
      }

      /************************** [E] - Section for DB View Data Source ************************************/

      // Function for send notification when user change the other user role-right-permiddion
      let sendNotificationAllActiveSession = () => {
        RolePagePermisionFactory.sendNotificationOfRightChanges().query({ id: vm.selectEmployeeId }).$promise.then((response) => {
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }

      vm.addRole = () => {
        BaseService.goToRoleAddUpdate(0);
      };

    }
  }
})();
