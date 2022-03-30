(function () {
  'use sctrict';
  angular
    .module('app.core')
    .directive('rolePageRightsNew', rolePageRightsNew);

  /** @ngInject */
  function rolePageRightsNew(CertificateStandardFactory, NotificationFactory,
    RolePagePermisionFactory, RoleFactory, UserFactory, BaseService, DialogFactory, USER, $q, $stateParams, RawdataCategoryFactory, CONFIGURATION, TRANSACTION) {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        userId: '=?',
        identityUserId: '=?',
        roleId: '=?',
        role: '=?',
        pageName: '=',
        isEdit: '=?',
        roleObj: '=?',
        selectedRole: '=?',
        isRightChange: '=',
        isFeatureChange: '=',
        isRoleChange: '=',
        isStandardChange: '=',
        //isHbChange: "=",
        isDbViewDataSourceChange: '=',
        employeeId: '=',
        isViewOnly: '=?',
        employeeName: '=?'
      },
      templateUrl: 'app/directives/custom/role-page-rights/role-page-rights-option2.html',
      controller: rolePageRightsNewCtrl,
      controllerAs: 'vm'
    };
    return directive;

    /** @ngInject */
    function rolePageRightsNewCtrl($scope, $timeout, CORE) {
      var vm = this;
      var oldUserRoleList = [];

      vm.userId = $scope.userId;
      vm.identityUserId = $scope.identityUserId;
      vm.roleId = $scope.roleId;
      vm.IsEdit = $scope.isEdit;
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
      vm.StandardEmpltyMessage = USER.ADMIN_EMPTYSTATE.CERTIFICATE_STANDARD;
      vm.dbViewEmptyMessage = CONFIGURATION.CONFIGURATION_EMPTYSTATE.CHARTRAWDATACATEGORY;
      vm.isHideDelete = true;
      vm.loginUser = BaseService.loginUser;
      vm.selectEmployeeId = $scope.employeeId;

      vm.selectedRoleList = [];
      vm.permissionsTabName = 'Permissions';
      vm.featuresTabName = 'Features';
      vm.standardTabName = 'Allow To Select Standards';
      vm.dbViewDataSourceTabName = 'Report/Widget Data Source';
      vm.rid = $stateParams.id ? $stateParams.id : null;
      vm.currentTab = vm.permissionsTabName;
      vm.userRoleList = [];
      vm.isAllPermissionRight = false;
      vm.isAllHBRight = false;
      vm.isAllRWRight = false;
      vm.isAllRORight = false;
      vm.isAllBookmarkRight = false;
      vm.isAllFeatureRight = false;
      vm.isAllStandardRight = false;
      vm.isAllDbViewChecked = false;
      vm.lastRoll;
      vm.currentRole = {};
      vm.currentRole.roleId = vm.roleId;
      vm.popup = {
        logout_user: false
      };
      vm.selectedStandard = [];
      vm.selectedDataSource = [];
      vm.selectedFeature = [];
      vm.selectedPages = [];
      vm.isViewOnly = $scope.isViewOnly ? $scope.isViewOnly : false;

      let Allpromise = [];
      let SaveRoleRightFeature = {
        RoleList: [],
        PageList: [],
        FeatureList: [],
        DbViewDataSourceList: []
      };
      let isFirstTimeCallRoll = false;
      let SavePageFeature = {
        PageList: [],
        FeatureList: [],
        standardList: [],
        DbViewDataSourceList: []
      };
      let isSaveData = false;

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

      // let allRolePageList = [];
      vm.pageRightsRole = 'Page Rights Role';
      vm.roleSourceHeader = [
        {
          field: 'Action',
          cellClass: 'gridCellColor',
          displayName: 'Action',
          minWidth: '80',
          cellTemplate: '<div class="center cm-role-checkbox">'
            + '<label class="cm-radio">'
            + '<input ui-grid-checkbox type="checkbox" ng-model="row.entity.isRoleChecked" ng-change="grid.appScope.$parent.vm.roleCheckedAlert()" class="cm-role-checkbox" ng-disabled="!grid.appScope.$parent.vm.isUpdatable">'
            + '<span class="checkmark"></span>'
            + '</label>'
            + '</div>'
            + '</div>',
          enableFiltering: false,
          enableSorting: false,
          exporterSuppressExport: false,
          pinnedLeft: false,
          enableCellEdit: false,
          width: '80'
        },
        {
          field: 'name',
          width: '*',
          displayName: 'Role',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableCellEdit: false,
          minWidth: '120'
        }, {
          field: 'accessLevel',
          width: 100,
          displayName: 'Access Level',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | number: 2}}</div>',
          enableCellEdit: false,
          minWidth: '100'
        }
      ];

      vm.pages = [];
      let AllPages = [];
      //let oldPages = [];
      let AllActivePage = [];
      vm.pageSourceHeader = [
        {
          field: 'menuName',
          width: '43%',
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
          enableCellEdit: false,
          minWidth: '320',
          footerCellTemplate: '<div layout="row" layout-align="end center" class="ui-grid-cell-contents summary-footer padding-right-0-imp">Total item selected: </div>'
        },
        {
          field: 'RO',
          cellClass: 'gridCellColor',
          displayName: 'Read Only',
          width: '170',
          cellTemplate: '<div class="center cm-role-checkbox" ng-class="{\'highlight-cell\': row.entity.isDefaultRO}">'
            + '<label class="cm-radio">'
            + '<input ui-grid-checkbox type="checkbox"'
            + 'ng-model="row.entity.RO" class="cm-role-checkbox"'
            + 'ng-checked="row.entity.RO==\'1\'"'
            + 'ng-change="grid.appScope.$parent.vm.checkRight(\'RO\', row.entity)"'
            + 'ng-disabled="!grid.appScope.$parent.vm.isUpdatable || (!row.entity.isReadOnlyDeveloped)">'
            + '<span class="checkmark"></span>'
            + '</label>'
            + '</div>',
          filterHeaderTemplate: '<div class="center cm-role-checkbox margin-left-2">'
            + '<label class="cm-radio">'
            + '<input ui-grid-checkbox type="checkbox"'
            + 'ng-model="grid.appScope.$parent.vm.isAllRORight"'
            + 'ng-change="grid.appScope.$parent.vm.checkAllRight(\'RO\', grid.appScope.$parent.vm.isAllRORight)" class="cm-role-checkbox"'
            + 'ng-disabled="!grid.appScope.$parent.vm.isUpdatable || !grid.appScope.$parent.vm.isUpdatebleForNoRowForPermissions">'
            + '<span class="checkmark"></span>'
            + '</label>'
            + '</div>',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer " layout-align="center center">{{grid.appScope.$parent.vm.selectedPageCount.selectedReadOnlyMenuCount}}</div>',
          enableSorting: false,
          exporterSuppressExport: false,
          pinnedLeft: false,
          enableCellEdit: false
        },
        {
          field: 'RW',
          cellClass: 'gridCellColor',
          displayName: 'Read + Write',
          width: '170',
          cellTemplate: '<div class="center cm-role-checkbox" ng-class="{\'highlight-cell\': row.entity.isDefaultRW}">'
            + '<label class="cm-radio">'
            + '<input ui-grid-checkbox type="checkbox"'
            + 'ng-model="row.entity.RW" class="cm-role-checkbox"'
            + 'ng-checked="row.entity.RW==\'1\'"'
            + 'ng-change="grid.appScope.$parent.vm.checkRight(\'RW\', row.entity)"'
            + 'ng-disabled="!grid.appScope.$parent.vm.isUpdatable">'
            + '<span class="checkmark"></span>'
            + '</label>'
            + '</div>',
          filterHeaderTemplate: '<div class="center cm-role-checkbox margin-left-2">'
            + '<label class="cm-radio">'
            + '<input ui-grid-checkbox type="checkbox"'
            + 'ng-model="grid.appScope.$parent.vm.isAllRWRight"'
            + 'ng-change="grid.appScope.$parent.vm.checkAllRight(\'RW\', grid.appScope.$parent.vm.isAllRWRight)" class="cm-role-checkbox"'
            + 'ng-disabled="!grid.appScope.$parent.vm.isUpdatable || !grid.appScope.$parent.vm.isUpdatebleForNoRowForPermissions">'
            + '<span class="checkmark"></span>'
            + '</label>'
            + '</div>',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer " layout-align="center center">{{grid.appScope.$parent.vm.selectedPageCount.selectedReadAndWriteMenuCount}}</div>',
          enableSorting: false,
          exporterSuppressExport: false,
          pinnedLeft: false,
          enableCellEdit: false
        },
        {
          field: 'isActive',
          cellClass: 'gridCellColor',
          displayName: 'Permission',
          width: '170',
          cellTemplate: '<div class="center cm-role-checkbox" ng-class="{\'highlight-cell\': row.entity.isDefaultActive}">'
            + '<label class="cm-radio">'
            + '<input ui-grid-checkbox type="checkbox"'
            + 'ng-model="row.entity.isActive" class="cm-role-checkbox"'
            + 'ng-checked="row.entity.isActive==\'1\'"'
            + 'ng-change="grid.appScope.$parent.vm.checkRight(\'PermissionActive\', row.entity)"'
            + 'ng-disabled="!grid.appScope.$parent.vm.isUpdatable">'
            + '<span class="checkmark"></span>'
            + '</label>'
            + '</div>',
          filterHeaderTemplate: '<div class="center cm-role-checkbox margin-left-2">'
            + '<label class="cm-radio">'
            + '<input ui-grid-checkbox type="checkbox"'
            + 'ng-model="grid.appScope.$parent.vm.isAllPermissionRight"'
            + 'ng-change="grid.appScope.$parent.vm.checkAllRight(\'PermissionActive\', grid.appScope.$parent.vm.isAllPermissionRight)" class="cm-role-checkbox"'
            + 'ng-disabled="!grid.appScope.$parent.vm.isUpdatable || !grid.appScope.$parent.vm.isUpdatebleForNoRowForPermissions">'
            + '<span class="checkmark"></span>'
            + '</label>'
            + '</div>',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer" layout-align="center center">{{grid.appScope.$parent.vm.selectedPageCount.selectedIsActiveMenuCount}}</div>',
          enableSorting: false,
          exporterSuppressExport: false,
          pinnedLeft: false,
          enableCellEdit: false
        },
        {
          field: 'IsShortcut',
          cellClass: 'gridCellColor',
          displayName: 'Bookmark',
          width: '15%',
          cellTemplate: '<div class="center cm-role-checkbox width-20" ng-class="{\'highlight-cell\': row.entity.isDefaultIsShortcut}">'
            + '<label class="cm-radio">'
            + '<input ui-grid-checkbox type="checkbox"'
            + 'ng-model="row.entity.IsShortcut" class="cm-role-checkbox"'
            + 'ng-checked="row.entity.IsShortcut==\'1\'"'
            + 'ng-disabled="!row.entity.isActive || !grid.appScope.$parent.vm.isUpdatable"'
            + 'ng-change="grid.appScope.$parent.vm.checkRight(\'Bookmark\', row.entity)">'
            + '<span class="checkmark" ng-class="{\'cursor-not-allow\':!row.entity.isActive || !grid.appScope.$parent.vm.isUpdatable}"></span>'
            + '</label>'
            + '</div>',
          filterHeaderTemplate: '<div class="center cm-role-checkbox margin-left-2">'
            + '<label class="cm-radio">'
            + '<input ui-grid-checkbox type="checkbox"'
            + 'ng-model="grid.appScope.$parent.vm.isAllBookmarkRight"'
            + 'ng-disabled="!grid.appScope.$parent.vm.isAllPermissionRight || !grid.appScope.$parent.vm.isUpdatable || !grid.appScope.$parent.vm.isUpdatebleForNoRowForPermissions"'
            + 'ng-change="grid.appScope.$parent.vm.checkAllRight(\'Bookmark\', grid.appScope.$parent.vm.isAllBookmarkRight)" class="cm-role-checkbox">'
            + '<span class="checkmark" ng-class="{\'cursor-not-allow\':!grid.appScope.$parent.vm.isAllPermissionRight || !grid.appScope.$parent.vm.isUpdatable}"></span>'
            + '</label>'
            + '</div>',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer margin-right-15" layout-align="center center">{{grid.appScope.$parent.vm.selectedPageCount.selectedBookmarkMenuCount}}</div>',
          enableSorting: false,
          exporterSuppressExport: false,
          pinnedLeft: false,
          enableCellEdit: false,
          visible: false
        },
        {
          field: 'isHelpBlog',
          cellClass: 'gridCellColor',
          displayName: 'Help Blog Permission',
          width: '170',
          cellTemplate: '<div class="center cm-role-checkbox" ng-class="{\'highlight-cell\': row.entity.isDefaultisHelpBlog}">'
            + '<label class="cm-radio">'
            + '<input ui-grid-checkbox type="checkbox"'
            + 'ng-model="row.entity.isHelpBlog" class="cm-role-checkbox"'
            + 'ng-checked="(row.entity.isHelpBlog==\'1\' || row.entity.isActive)"'
            + 'ng-change="grid.appScope.$parent.vm.checkRight(\'HelpBlog\', row.entity)"'
            + 'ng-disabled="(!grid.appScope.$parent.vm.isUpdatable || row.entity.isActive)">'
            + '<span class="checkmark" ng-class="{\'cursor-not-allow\':(!grid.appScope.$parent.vm.isUpdatable || row.entity.isActive)}"></span>'
            + '</label>'
            + '</div>',
          filterHeaderTemplate: '<div class="center cm-role-checkbox margin-left-2">'
            + '<label class="cm-radio">'
            + '<input ui-grid-checkbox type="checkbox"'
            + 'ng-model="grid.appScope.$parent.vm.isAllHBRight"'
            + 'ng-change="grid.appScope.$parent.vm.checkAllRight(\'HelpBlog\', grid.appScope.$parent.vm.isAllHBRight)" class="cm-role-checkbox"'
            + 'ng-disabled="!grid.appScope.$parent.vm.isUpdatable || !grid.appScope.$parent.vm.isUpdatebleForNoRowForPermissions">'
            + '<span class="checkmark" ng-class="{\'cursor-not-allow\':!grid.appScope.$parent.vm.isUpdatable || !grid.appScope.$parent.vm.isUpdatebleForNoRowForPermissions}"></span>'
            + '</label>'
            + '</div>',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer" layout-align="center center">{{grid.appScope.$parent.vm.selectedPageCount.selectedHBMenuCount}}</div>',
          enableSorting: false,
          exporterSuppressExport: false,
          pinnedLeft: false,
          enableCellEdit: false
        }
      ];

      vm.features = [];
      //let oldFeatures = [];
      vm.featureSourceHeader = [
        {
          field: 'featureName',
          width: '84%',
          displayName: 'Feature',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableCellEdit: false,
          footerCellTemplate: '<div layout="row" layout-align="end center" class="ui-grid-cell-contents summary-footer padding-right-0-imp">Total features selected: </div>'
        },
        {
          field: 'isActive',
          cellClass: 'gridCellColor',
          displayName: 'Feature Access',
          width: '140',
          cellTemplate: '<div class="center cm-role-checkbox width-20" ng-class="{\'highlight-cell\': row.entity.isDefaultActive}">'
            + '<label class="cm-radio">'
            + '<input ui-grid-checkbox type="checkbox"'
            + 'ng-model="row.entity.isActive" class="cm-role-checkbox"'
            + 'ng-checked="row.entity.isActive==\'1\'"'
            + 'ng-change="grid.appScope.$parent.vm.checkRight(\'Feature\', row.entity)"'
            + 'ng-disabled="!grid.appScope.$parent.vm.isUpdatable">'
            + '<span class="checkmark"></span>'
            + '</label>'
            + '</div>',
          footerCellTemplate: '<div class="ui-grid-cell-contents summary-footer" layout-align="center center">{{grid.appScope.$parent.vm.selectedPageCount.selectedFeturesAndRightsCount}}</div>',
          filterHeaderTemplate: '<div class="center cm-role-checkbox">'
            + '<label class="cm-radio">'
            + '<input ui-grid-checkbox type="checkbox"'
            + 'ng-model="grid.appScope.$parent.vm.isAllFeatureRight"'
            + 'ng-change="grid.appScope.$parent.vm.checkAllRight(\'Feature\', grid.appScope.$parent.vm.isAllFeatureRight)" class="cm-role-checkbox"'
            + 'ng-disabled="!grid.appScope.$parent.vm.isUpdatable || !grid.appScope.$parent.vm.isUpdatebleForNoRowForFeatures">'
            + '<span class="checkmark"></span>'
            + '</label>'
            + '</div>',
          enableSorting: false,
          exporterSuppressExport: false,
          pinnedLeft: false,
          enableCellEdit: false
        }
      ];

      //let oldStandard = [];
      vm.standard = [];
      vm.standardSourceHeader = [
        {
          field: 'fullName',
          width: '84%',
          displayName: 'Standard',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableCellEdit: false
        },
        {
          field: 'roleID',
          cellClass: 'gridCellColor',
          displayName: 'Standard Access',
          width: '16%',
          cellTemplate: '<div class="center cm-role-checkbox">'
            + '<label class="cm-radio">'
            + '<input ui-grid-checkbox type="checkbox"'
            + 'ng-model="row.entity.standardCheck" class="cm-role-checkbox"'
            + 'ng-checked="row.entity.standardCheck == \'1\'"'
            + 'ng-change="grid.appScope.$parent.vm.checkRight(\'Standard\', row.entity)"'
            + 'ng-disabled="!grid.appScope.$parent.vm.isUpdatable">'
            + '<span class="checkmark"></span>'
            + '</label>'
            + '</div>',
          filterHeaderTemplate: '<div class="center cm-role-checkbox">'
            + '<label class="cm-radio">'
            + '<input ui-grid-checkbox type="checkbox"'
            + 'ng-model="grid.appScope.$parent.vm.isAllStandardRight"'
            + 'ng-change="grid.appScope.$parent.vm.checkAllRight(\'Standard\', grid.appScope.$parent.vm.isAllStandardRight)" class="cm-role-checkbox"'
            + 'ng-disabled="!grid.appScope.$parent.vm.isUpdatable">'
            + '<span class="checkmark"></span>'
            + '</label>'
            + '</div>',
          enableSorting: false,
          exporterSuppressExport: false,
          pinnedLeft: false,
          enableCellEdit: false
        }
      ];


      if ($scope.pageName === vm.EmployeePage) {
        vm.isRoleShow = true;
        vm.isStandardShow = false;
        vm.isDbViewDataSourceShow = false;
        vm.isUpdatable = true;
      } else if ($scope.pageName === vm.userProfilePage) {
        vm.isRoleShow = true;
        vm.isStandardShow = false;
        vm.isDbViewDataSourceShow = false;
        vm.isUpdatable = false;
      } else if ($scope.pageName === vm.RolePage) {
        vm.isRoleShow = false;
        vm.isStandardShow = true;
        vm.isDbViewDataSourceShow = true;
        vm.isUpdatable = true;
      } else if ($scope.pageName === vm.PageRightsRole) {
        vm.isRoleShow = false;
        vm.isStandardShow = true;
        vm.isDbViewDataSourceShow = true;
        vm.isUpdatable = true;
      } else if ($scope.pageName === vm.PageRightsUser) {
        vm.isRoleShow = true;
        vm.isStandardShow = false;
        vm.isDbViewDataSourceShow = false;
        vm.isUpdatable = true;
      }

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
      };

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
        filterOptions: vm.standardPagingInfo.SearchColumns
      };

      // bind selected standards
      function bindSelectedStandard() {
        if (vm.standard && vm.standard.length > 0 && vm.selectedStandard && vm.selectedStandard.length > 0) {
          _.each(vm.standard, (objstd) => {
            const isselectedStd = _.find(vm.selectedStandard, (objselectedstd) => objselectedstd.certificateStandardID === objstd.certificateStandardID);
            if (isselectedStd) {
              objstd.standardCheck = isselectedStd.standardCheck;
            }
          });
        }
        const checkFalsestandard = _.some(vm.standard, (data) => !data.standardCheck);
        if (!checkFalsestandard && vm.standard && vm.standard.length > 0) {
          vm.isAllStandardRight = true;
        } else {
          vm.isAllStandardRight = false;
        }
      }

      //Get The All Standard List
      vm.getstandardList = () => {
        if (vm.standardPagingInfo && (vm.standardPagingInfo.RoleId || vm.standardPagingInfo.RoleId === 0)) {
          vm.standardPagingInfo.Page = 0;
          return CertificateStandardFactory.retriveCertificateStandardsList().query(vm.standardPagingInfo).$promise.then((standards) => {
            vm.sourceData = standards.data.standards;
            vm.allStandardData = standards.data.standards;
            vm.standard = [];
            _.each(vm.sourceData, (item) => {
              if (item.isActive === true) {
                if (item.roleID === vm.roleId) {
                  item.standardCheck = true;
                }
                else {
                  item.standardCheck = false;
                }
                vm.standard.push(item);
              }
            });

            vm.totalStandardDataCount = vm.standard.length;

            //  vm.standardGridOptions.clearSelectedRows();
            if (vm.totalStandardDataCount === 0) {
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
            vm.standardCurrentdata = vm.standard.length;
            bindSelectedStandard();
            $timeout(() => {
              vm.resetStandardSourceGrid();
              if (!vm.standardGridOptions.enablePaging && vm.totalStandardDataCount === vm.standardCurrentdata) {
                return vm.standardGridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
              }
            });
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      vm.getStandardDataDown = () => {
        vm.standardPagingInfo.Page = vm.standardPagingInfo.Page + 1;
        vm.cgBusyLoading = CertificateStandardFactory.retriveCertificateStandardsList().query(vm.standardPagingInfo).$promise.then((standard) => {
          _.each(standard.data, (item) => {
            if (item.isActive === true) {
              if (item.roleID === vm.roleId) {
                item.standardCheck = true;
              }
              else {
                item.standardCheck = false;
              }
              vm.standard.push(item);
            }
          });
          vm.standardCurrentdata = vm.standard.length;
          bindSelectedStandard();
          $timeout(() => {
            vm.resetStandardSourceGrid();
            if (!vm.standardGridOptions.enablePaging && vm.totalStandardDataCount === vm.standardCurrentdata) {
              return vm.standardGridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalStandardDataCount !== vm.standaedCurrentdata ? true : false);
            }
          });
        }).catch((error) => BaseService.getErrorLog(error));
      };

      function getrole(isResetRoleList) {
        const oldRoles = isResetRoleList ? null : angular.copy(vm.roles);
        return RoleFactory.retriveRolesList().query(vm.pagingInfo).$promise.then((roles) => {
          if (roles.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.roles = roles.data.roles;
            vm.totalRoleDataCount = roles.data.Count;
            isFirstTimeCallRoll = true;
            if (vm.userRoleList && vm.userRoleList.length > 0 && vm.roles && vm.roles.length > 0) {
              if (oldRoles && oldRoles.length > 0) {
                _.map(oldRoles, (data) => {
                  _.map(vm.roles, (item) => {
                    if (data.id === item.id) {
                      return item.isRoleChecked = data.isRoleChecked;
                    }
                  });
                });
              } else {
                _.map(vm.userRoleList, (data) => {
                  _.map(vm.roles, (item) => {
                    if (data.roleId === item.id) {
                      return item.isRoleChecked = true;
                    }
                  });
                });
              }
              const RoleselesctedData = _.filter(vm.roles, (data) => {
                if ((data.isActive) || data.isRoleChecked && !data.isActive) {
                  return data;
                }
              });
              if (RoleselesctedData.length > 0) {
                vm.roles = RoleselesctedData;
              }
            } else {
              if (vm.roles.length > 0) {
                const activeRoles = _.filter(vm.roles, (Role) => {
                  if (Role.isActive) {
                    return Role;
                  }
                });
                vm.roles = activeRoles;
              }
              vm.pages = [];
              vm.isPageNoDataFound = true;

              vm.features = [];
              vm.isFeatureNoDataFound = true;

              $scope.isRightChange = false;
              //$scope.isHbChange = false;
              $scope.isFeatureChange = false;
              $scope.isRoleChange = false;
            }
            vm.rolesCurrentdata = vm.roles.length;
            $timeout(() => {
              vm.resetSourceGrid();
              if (!vm.roleGridOptions.enablePaging && vm.totalRoleDataCount === vm.rolesCurrentdata) {
                return vm.roleGridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
              }
            });
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }

      // Get the All role list
      vm.getRoleList = () => {
        if (vm.isRoleShow) {
          if (isFirstTimeCallRoll) {
            let searchString;
            let searchAccessLevel;
            if (vm.pagingInfo.SearchColumns && vm.pagingInfo.SearchColumns.length > 0) {
              _.each(vm.pagingInfo.SearchColumns, (objSearch) => {
                if (objSearch.ColumnName === 'accessLevel') {
                  searchAccessLevel = objSearch.SearchString;
                } else {
                  searchString = objSearch.SearchString;
                }
              });
            }

            if (searchString || searchAccessLevel) {
              const withoutSearchRole = vm.roles;
              vm.roles = _.filter(vm.roles, (data) => {
                if (searchAccessLevel && searchString) {
                  if (data.name.toUpperCase().includes(searchString ? searchString.toUpperCase() : '') && data.accessLevel.toString().toUpperCase().includes(searchAccessLevel ? searchAccessLevel.toUpperCase() : '')) {
                    return data;
                  }
                } else if (searchAccessLevel && !searchString) {
                  if (data.accessLevel.toString().toUpperCase().includes(searchAccessLevel ? searchAccessLevel.toUpperCase() : '')) {
                    return data;
                  }
                } else if (!searchAccessLevel && searchString) {
                  if (data.name.toUpperCase().includes(searchString ? searchString.toUpperCase() : '')) {
                    return data;
                  }
                } else {
                  return data;
                }
              });

              if (!vm.roleGridOptions.enablePaging) {
                vm.rolesCurrentdata = vm.roles.length;
                vm.roleGridOptions.gridApi.infiniteScroll.resetScroll();
              }
              vm.roleGridOptions.clearSelectedRows();
              const roleCount = vm.roles.length;
              if (roleCount === 0) {
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
                if (!vm.roleGridOptions.enablePaging && vm.totalRoleDataCount === vm.rolesCurrentdata) {
                  return vm.roleGridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
                }
              });
            } else {
              vm.pagingInfo.Page = 0;
              getrole(false);
            }
          } else {
            return RoleFactory.retriveRolesList().query(vm.pagingInfo).$promise.then((roles) => {
              if (roles.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                return $q.resolve(roles.data);
              } else {
                return $q.resolve({});
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }
      };

      // Get the role list after scroll
      vm.getRoleDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = RoleFactory.retriveRolesList().query(vm.pagingInfo).$promise.then((roles) => {
          vm.roles = vm.roles.concat(roles.data.roles);
          vm.rolesCurrentdata = vm.roles.length;
          vm.roleGridOptions.gridApi.infiniteScroll.saveScrollPercentage();
          $timeout(() => {
            vm.resetSourceGrid();
            return vm.roleGridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalRoleDataCount !== vm.rolesCurrentdata ? true : false);
          });
        }).catch((error) => BaseService.getErrorLog(error));
      };

      function bindSelectedPagePermission() {
        if (vm.rightsPagingInfo.isShowDefault && vm.showDefaultRights) {
          vm.selectedPages = [];
          _.filter(vm.pages, (item) => item.userID = vm.userId);
          _.each(vm.pages, (objPage) => {
            if (objPage.RO || objPage.RW || objPage.isActive || objPage.IsShortcut) {
              objPage.isDefaultRO = objPage.RO === 1 ? true : false; /*Used this key to highlight default rights*/
              objPage.isDefaultRW = objPage.RW === 1 ? true : false; /*Used this key to highlight default rights*/
              objPage.isDefaultActive = objPage.isActive === 1 ? true : false;/*Used this key to highlight default rights*/
              objPage.isDefaultIsShortcut = objPage.IsShortcut === 1 ? true : false;/*Used this key to highlight default rights*/
              objPage.isDefaultisHelpBlog = objPage.isHelpBlog === 1 ? true : false;/*Used this key to highlight HB default rights*/
            }
          });
          vm.selectedPages = vm.pages;
        } else {
          if (vm.pages && vm.pages.length > 0 && vm.selectedPages && vm.selectedPages.length > 0) {
            _.each(vm.pages, (objPage) => {
              const isselectedPage = _.find(vm.selectedPages, (objselectedPage) => objselectedPage.pageID === objPage.pageID);
              if (isselectedPage) {
                objPage.RO = isselectedPage.RO;
                objPage.RW = isselectedPage.RW;
                objPage.isActive = isselectedPage.isActive;
                objPage.IsShortcut = isselectedPage.IsShortcut;
                objPage.isHelpBlog = isselectedPage.isHelpBlog;
              }
            });
          }
        }
        const checkFalseRO = _.some(vm.pages, (data) => !data.RO);
        if (!checkFalseRO && vm.pages && vm.pages.length > 0) {
          vm.isAllRORight = true;
        } else {
          vm.isAllRORight = false;
        }

        const checkFalseRW = _.some(vm.pages, (data) => !data.RW);
        if (!checkFalseRW && vm.pages && vm.pages.length > 0) {
          vm.isAllRWRight = true;
        } else {
          vm.isAllRWRight = false;
        }

        const checkFalsePermission = _.some(vm.pages, (data) => !data.isActive);
        if (!checkFalsePermission && vm.pages && vm.pages.length > 0) {
          vm.isAllPermissionRight = true;
        } else {
          vm.isAllPermissionRight = false;
        }

        const checkFalseisHelpBlog = _.some(vm.pages, (data) => !data.isHelpBlog);
        if (!checkFalseisHelpBlog && vm.pages && vm.pages.length > 0) {
          vm.isAllHBRight = true;
        } else {
          vm.isAllHBRight = false;
        }

        const checkFalseBookmark = _.some(vm.pages, (data) => !data.IsShortcut);
        if (!checkFalseBookmark && vm.pages && vm.pages.length > 0) {
          vm.isAllBookmarkRight = true;
        } else {
          vm.isAllBookmarkRight = false;
        }

        /*Used to set selected pages count with each column*/
        vm.selectedPageCount.selectedReadOnlyMenuCount = _.filter(vm.pages, (item) => item.RO).length;
        vm.selectedPageCount.selectedReadAndWriteMenuCount = _.filter(vm.pages, (item) => item.RW).length;
        vm.selectedPageCount.selectedIsActiveMenuCount = _.filter(vm.pages, (item) => item.isActive).length;
        vm.selectedPageCount.selectedBookmarkMenuCount = _.filter(vm.pages, (item) => item.IsShortcut).length;
        //vm.selectedPageCount.selectedShowInHomePageMenuCount = _.filter(vm.pages, (item) => { return item.IsShowInHomePage }).length;
        vm.selectedPageCount.selectedHBMenuCount = _.filter(vm.pages, (item) => item.isHelpBlog).length;
      };

      // Get the All page list
      vm.getPageList = () => {
        if (vm.rightsPagingInfo && vm.rightsPagingInfo.RoleId || vm.rightsPagingInfo.RoleId === 0) {
          vm.rightsPagingInfo.Page = 0;

          vm.rightsPagingInfo.isShowDefault = (vm.showDefaultRights || vm.pageName === vm.RolePage || vm.pageName === vm.pageRightsRole) ? 1 : 0;
          vm.cgBusyLoading = RolePagePermisionFactory.pagePermission(vm.rightsPagingInfo).query().$promise.then((pageRights) => {
            vm.pages = [];
            if (vm.rightsPagingInfo.SearchColumns && vm.rightsPagingInfo.SearchColumns.length === 0) {
              AllPages = pageRights.data.pages;
            }
            _.map(pageRights.data.pages, (data) => {
              data.RO = data.RO === 1 ? true : false;
              data.isReadOnlyDeveloped = data.isReadOnlyDeveloped === 1 ? true : false;
              data.RW = data.RW === 1 ? true : false;
              data.isActive = data.isActive === 1 ? true : false;
              data.IsShortcut = data.IsShortcut === 1 ? true : false;
              data.isHelpBlog = data.isHelpBlog === 1 ? true : false;
              if (data.isDisplay) {
                vm.pages.push(data);
              }
            });
            vm.totalPageDataCount = vm.pages.length;
            vm.pagesCurrentdata = vm.pages.length;
            vm.isUpdatebleForNoRowForPermissions = (vm.totalPageDataCount > 0);
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

      // Get the page list after scroll
      vm.getPageDataDown = () => {
        vm.rightsPagingInfo.Page = vm.rightsPagingInfo.Page + 1;
        vm.cgBusyLoading = RolePagePermisionFactory.pagePermission(vm.rightsPagingInfo).query().$promise.then((pageRights) => {
          vm.pages = vm.pages.concat(pageRights.data.pages);
          vm.pagesCurrentdata = vm.pages.length;
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
        if (vm.featurePagingInfo && vm.featurePagingInfo.RoleId || vm.featurePagingInfo.RoleId === 0) {
          vm.featurePagingInfo.Page = 0;
          vm.featurePagingInfo.isShowDefault = vm.showDefaultRights || vm.pageName === vm.RolePage || vm.pageName === vm.pageRightsRole ? 1 : 0;
          vm.cgBusyLoading = RolePagePermisionFactory.pagePermission(vm.featurePagingInfo).query().$promise.then((featureRights) => {
            //after filter clear get all featuredata
            vm.features = featureRights.data.features;
            vm.totalFeatureDataCount = featureRights.data.Count;
            vm.isUpdatebleForNoRowForFeatures = (vm.totalFeatureDataCount > 0);

            _.map(vm.features, (data) => {
              data.isActive = data.isActive === 1 ? true : false;
            });
            vm.featuresCurrentdata = vm.features.length;
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
          bindSelectedFeature();
          $timeout(() => {
            vm.resetFeatureSourceGrid();
            return vm.featureGridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalFeatureDataCount !== vm.featuresCurrentdata ? true : false);
          });
        }).catch((error) => BaseService.getErrorLog(error));
      };

      // Get the particular role wise page and feature particular tab, user, role
      const getPageListByRole = (tabName, userId, roleId, isRoleChecked) => {
        if (!tabName || tabName === vm.permissionsTabName) {
          vm.features = [];
          const isEdit = _.some(vm.userRoleList, (data) => data.roleId === roleId);

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

          vm.rightsPagingInfo.TabName = tabName;
          vm.rightsPagingInfo.UserId = userId;
          vm.rightsPagingInfo.SearchColumns = [];
          vm.rightsPagingInfo.Page = 0;
          vm.rightsPagingInfo.isShowDefault = 0;
          vm.showDefaultRights = isRoleChecked ? 1 : 0;
          if (!vm.rightsPagingInfo.RoleId && !vm.isRoleShow) {
            vm.rightsPagingInfo.RoleId = 0;
          } else {
            vm.rightsPagingInfo.RoleId = roleId;
          }
          // isFirstTimeCallPage = false;
          vm.getPageList();
        }
        else if (!tabName || tabName === vm.featuresTabName) {
          vm.pages = [];
          const isEdit = _.some(vm.userRoleList, (data) => data.roleId === roleId);

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

          vm.featurePagingInfo.TabName = tabName;
          vm.featurePagingInfo.UserId = userId;
          vm.featurePagingInfo.Page = 0;
          vm.featurePagingInfo.SearchColumns = [];
          vm.showDefaultRights = isRoleChecked ? 1 : 0;
          if (!vm.featurePagingInfo.RoleId && !vm.isRoleShow) {
            vm.featurePagingInfo.RoleId = vm.roleId;
          } else {
            vm.featurePagingInfo.RoleId = roleId;
          }
          vm.getFeatureList();
        }
        else if (tabName === vm.dbViewDataSourceTabName) {
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
          // isFirstTimeCallDbViewDataSource = false;
        }
        else {
          vm.pages = [];
          vm.features = [];
          const isEdit = _.some(vm.userRoleList, (data) => data.roleId === roleId);

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

          vm.standardPagingInfo.TabName = tabName;
          vm.standardPagingInfo.UserId = userId;
          vm.standardPagingInfo.Page = 0;
          vm.standardPagingInfo.SearchColumns = [];
          if (!vm.standardPagingInfo.RoleId && !vm.isRoleShow) {
            vm.standardPagingInfo.RoleId = vm.roleId;
          } else {
            vm.standardPagingInfo.RoleId = roleId;
          }
          // isFirstTimeCallStandard = false;
        }
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
        } else if (!TabName || TabName === vm.featuresTabName) {
          vm.currentTab = vm.featuresTabName;
          vm.isFeatureTab = true;
        }
        else if (!TabName || TabName === vm.standardTabName) {
          vm.currentTab = vm.standardTabName;
          vm.isStandardTab = true;
        }
        else if (TabName === vm.dbViewDataSourceTabName) {
          vm.currentTab = vm.dbViewDataSourceTabName;
          vm.isDataSourceTab = true;
        }
        if (vm.currentRole && vm.currentRole.roleId) {
          getPageListByRole(vm.currentTab, vm.userId, vm.currentRole.roleId);
        } else {
          $scope.isRightChange = false;
          $scope.isFeatureChange = false;
          $scope.isDbViewDataSourceChange = false;
        }
      };

      // On edit time get old selected role value
      const getRolesByUser = () => RoleFactory.getRolesByUser().query({ id: vm.userId }).$promise.then((userRole) => {
        if (userRole.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          $scope.selectedRole = userRole.data;
          return $q.resolve(userRole.data);
        } else {
          return $q.resolve({});
        }
      }).catch((error) => BaseService.getErrorLog(error));

      // Check the role check box by old role and get the selected page
      const setUserRoleCheckbox = () => {
        isFirstTimeCallRoll = false;
        vm.cgBusyLoading = $q.all(Allpromise).then((response) => {
          if (response[0]) {
            vm.userRoleList = response[0];
            oldUserRoleList = angular.copy(vm.userRoleList);
            if (vm.userRoleList && isSaveData) {
              if (vm.userRoleList.length === 0) {
                vm.currentRole = null;
              }
              setAsDefaultRole();
              isSaveData = false;
            }
          }
          if (response[1]) {
            vm.roles = response[1].roles;
            vm.totalRoleDataCount = response[1].Count;
            isFirstTimeCallRoll = true;

            if (!vm.roleGridOptions.enablePaging) {
              vm.rolesCurrentdata = vm.roles.length;
              vm.roleGridOptions.gridApi.infiniteScroll.resetScroll();
            }
            vm.roleGridOptions.clearSelectedRows();
            if (vm.totalRoleDataCount === 0) {
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
              if (!vm.roleGridOptions.enablePaging && vm.totalRoleDataCount === vm.rolesCurrentdata) {
                return vm.roleGridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
              }
            });
          }
          if (vm.userRoleList && vm.userRoleList.length > 0 && vm.roles && vm.roles.length > 0) {
            _.map(vm.userRoleList, (data) => {
              _.map(vm.roles, (item) => {
                if (data.roleId === item.id) {
                  return item.isRoleChecked = true;
                }
              });
            });
            const RoleselesctedData = _.filter(vm.roles, (data) => {
              if ((data.isActive) || data.isRoleChecked && !data.isActive) {
                return data;
              }
            });
            if (RoleselesctedData.length > 0) {
              vm.roles = RoleselesctedData;
            }
          } else {
            if (vm.roles.length > 0) {
              const activeRoles = _.filter(vm.roles, (Role) => {
                if (Role.isActive) {
                  return Role;
                }
              });
              vm.roles = activeRoles;
            }
            vm.pages = [];
            vm.isPageNoDataFound = true;

            vm.features = [];
            vm.isFeatureNoDataFound = true;

            $scope.isRightChange = false;
            $scope.isFeatureChange = false;
            $scope.isRoleChange = false;
          }
        });
      };

      // call getRolesByUser and pageList promise function
      if (vm.isRoleShow) {
        Allpromise.push(getRolesByUser(), vm.getRoleList(true));
        setUserRoleCheckbox();
      }

      // Call function when check checkbox of particular right of page
      vm.checkRight = (rightName, row) => {
        if (row) {
          if (rightName === 'RO') {
            if (row.RO) {
              const checkFalseRO = _.some(vm.pages, (data) => !data.RO);
              //if (!checkFalseRO || filterFalseRO == false) {
              if (!checkFalseRO) {
                vm.isAllRORight = true;
              }
            } else {
              vm.isAllRORight = false;
            }
            $scope.isRightChange = true;
            const isPageAdded = _.find(vm.selectedPages, (objPage) => objPage.pageID === row.pageID);
            if (isPageAdded) {
              isPageAdded.RO = row.RO;
            } else {
              vm.selectedPages.push(row);
            }
            vm.selectedPageCount.selectedReadOnlyMenuCount = _.filter(vm.pages, (item) => item.RO).length;
          }
          else if (rightName === 'RW') {
            if (row.RW) {
              const checkFalseRW = _.some(vm.pages, (data) => !data.RW);
              if (!checkFalseRW) {
                vm.isAllRWRight = true;
              }
            } else {
              vm.isAllRWRight = false;
            }
            $scope.isRightChange = true;
            const isPageAdded = _.find(vm.selectedPages, (objPage) => objPage.pageID === row.pageID);
            if (isPageAdded) {
              isPageAdded.RW = row.RW;
            } else {
              vm.selectedPages.push(row);
            }
            vm.selectedPageCount.selectedReadAndWriteMenuCount = _.filter(vm.pages, (item) => item.RW).length;
          }
          else if (rightName === 'PermissionActive') {
            if (row.isActive) {
              const checkFalsePermission = _.some(vm.pages, (data) => !data.isActive);
              if (!checkFalsePermission) {
                vm.isAllPermissionRight = true;
              }
            } else {
              vm.isAllPermissionRight = false;
              row.IsShortcut = false;
              vm.isAllBookmarkRight = false;
            }
            vm.showDefaultRights = false;
            $scope.isRightChange = true;
            const isPageAdded = _.find(vm.selectedPages, (objPage) => objPage.pageID === row.pageID);
            if (isPageAdded) {
              isPageAdded.isActive = row.isActive;
              isPageAdded.IsShortcut = row.IsShortcut;
            } else {
              vm.selectedPages.push(row);
            }
            vm.selectedPageCount.selectedIsActiveMenuCount = _.filter(vm.pages, (item) => item.isActive).length;
          }
          else if (rightName === 'Bookmark') {
            if (row.IsShortcut) {
              const checkFalseBookmark = _.some(vm.pages, (data) => !data.IsShortcut);
              if (!checkFalseBookmark) {
                vm.isAllBookmarkRight = true;
              }
            } else {
              vm.isAllBookmarkRight = false;
            }
            $scope.isRightChange = true;
            const isPageAdded = _.find(vm.selectedPages, (objPage) => objPage.pageID === row.pageID);
            if (isPageAdded) {
              isPageAdded.IsShortcut = row.IsShortcut;
            } else {
              vm.selectedPages.push(row);
            }
            vm.selectedPageCount.selectedBookmarkMenuCount = _.filter(vm.pages, (item) => item.IsShortcut).length;
          }
          else if (rightName === 'Feature') {
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
            vm.selectedPageCount.selectedFeturesAndRightsCount = _.filter(vm.features, (item) => item.isActive).length;
          }
          else if (rightName === 'Standard') {
            if (row.standardCheck) {
              const checkFalseStandard = _.some(vm.standard, (data) => !data.standardCheck);
              if (!checkFalseStandard) {
                vm.isAllStandardRight = true;
              }
            } else {
              vm.isAllStandardRight = false;
            }
            $scope.isStandardChange = true;
            const isStandardAdded = _.find(vm.selectedStandard, (objstd) => objstd.certificateStandardID === row.certificateStandardID);
            if (isStandardAdded) {
              isStandardAdded.standardCheck = row.standardCheck;
            } else {
              vm.selectedStandard.push(row);
            }
          }
          else if (rightName === 'HelpBlog') {
            if (row.isHelpBlog) {
              const checkFalseHB = _.some(vm.pages, (data) => !data.isHelpBlog);
              if (!checkFalseHB) {
                vm.isAllHBRight = true;
              }
            } else {
              vm.isAllHBRight = false;
            }
            //$scope.isHbChange = true;
            $scope.isRightChange = true;

            const isHBAdded = _.find(vm.selectedPages, (objPage) => objPage.pageID === row.pageID);
            if (isHBAdded) {
              isHBAdded.isHelpBlog = row.isHelpBlog;
            } else {
              vm.selectedPages.push(row);
            }
            vm.selectedPageCount.selectedHBMenuCount = _.filter(vm.pages, (item) => item.isHelpBlog).length;
          }
          else if (rightName === vm.dbViewDataSourceTabName) {
            if (row.isDBViewAccessChecked) {
              const checkFalseDataSource = _.some(vm.sourceDataForDbViewDataSource, (data) => !data.isDBViewAccessChecked);
              if (!checkFalseDataSource) {
                vm.isAllDbViewChecked = true;
              }
            } else {
              vm.isAllDbViewChecked = false;
            }
            $scope.isDbViewDataSourceChange = true;
            const isDtaSourceAdded = _.find(vm.selectedDataSource, (objstd) => objstd.chartRawDataCatID === row.chartRawDataCatID);
            if (isDtaSourceAdded) {
              isDtaSourceAdded.isDBViewAccessChecked = row.isDBViewAccessChecked;
            } else {
              vm.selectedDataSource.push(row);
            }
          }
        }
      };

      // Call function when check all check box of right
      vm.checkAllRight = (rightName, isChecked) => {
        if (rightName === 'RO') {
          if (vm.rightsPagingInfo.SearchColumns && vm.rightsPagingInfo.SearchColumns.length > 0) {
            _.filter(vm.pages, (objPage) => {
              objPage.RO = objPage.isReadOnlyDeveloped ? isChecked : false;
              const isPageAdded = _.find(vm.selectedPages, (objSelectedPage) => objSelectedPage.pageID === objPage.pageID);
              if (isPageAdded) {
                isPageAdded.RO = objPage.RO;
              } else {
                vm.selectedPages.push(objPage);
              }
            });
          } else {
            _.each(vm.pages, (objPage) => {
              objPage.RO = objPage.isReadOnlyDeveloped ? isChecked : false;
              const isPageAdded = _.find(vm.selectedPages, (objSelectedPage) => objSelectedPage.pageID === objPage.pageID);
              if (isPageAdded) {
                isPageAdded.RO = objPage.RO;
              } else {
                vm.selectedPages.push(objPage);
              }
            });
          }

          $scope.isRightChange = true;
          vm.selectedPageCount.selectedReadOnlyMenuCount = _.filter(vm.pages, (item) => item.RO).length;
        }
        else if (rightName === 'RW') {
          if (vm.rightsPagingInfo.SearchColumns && vm.rightsPagingInfo.SearchColumns.length > 0) {
            _.filter(vm.pages, (objPage) => {
              objPage.RW = isChecked;
              const isPageAdded = _.find(vm.selectedPages, (objSelectedPage) => objSelectedPage.pageID === objPage.pageID);
              if (isPageAdded) {
                isPageAdded.RW = objPage.RW;
              } else {
                vm.selectedPages.push(objPage);
              }
            });
          } else {
            _.each(vm.pages, (objPage) => {
              objPage.RW = isChecked;
              const isPageAdded = _.find(vm.selectedPages, (objSelectedPage) => objSelectedPage.pageID === objPage.pageID);
              if (isPageAdded) {
                isPageAdded.RW = objPage.RW;
              } else {
                vm.selectedPages.push(objPage);
              }
            });
          }

          $scope.isRightChange = true;
          vm.selectedPageCount.selectedReadAndWriteMenuCount = _.filter(vm.pages, (item) => item.RW).length;
        }
        else if (rightName === 'PermissionActive') {
          if (vm.rightsPagingInfo.SearchColumns && vm.rightsPagingInfo.SearchColumns.length > 0) {
            _.filter(vm.pages, (objPage) => {
              objPage.isActive = isChecked;
              const isPageAdded = _.find(vm.selectedPages, (objSelectedPage) => objSelectedPage.pageID === objPage.pageID);
              if (isPageAdded) {
                isPageAdded.isActive = objPage.isActive;
                if (!isPageAdded.isActive) {
                  isPageAdded.IsShortcut = false;
                  isPageAdded.IsAllShowInHomePage = false;
                }
              } else {
                vm.selectedPages.push(objPage);
              }
            });
            if (!isChecked) {
              vm.isAllBookmarkRight = false;
            }
          } else {
            _.each(vm.pages, (objPage) => {
              objPage.isActive = isChecked;
              const isPageAdded = _.find(vm.selectedPages, (objSelectedPage) => objSelectedPage.pageID === objPage.pageID);
              if (isPageAdded) {
                isPageAdded.isActive = objPage.isActive;
                if (!isPageAdded.isActive) {
                  isPageAdded.IsShortcut = false;
                  isPageAdded.IsAllShowInHomePage = false;
                }
              } else {
                vm.selectedPages.push(objPage);
              }
            });
            if (!isChecked) {
              vm.isAllBookmarkRight = false;
            }
          }

          $scope.isRightChange = true;
          vm.selectedPageCount.selectedIsActiveMenuCount = _.filter(vm.pages, (item) => item.isActive).length;
          vm.selectedPageCount.selectedBookmarkMenuCount = _.filter(vm.pages, (item) => item.IsShortcut).length;
        }
        else if (rightName === 'Bookmark') {
          if (vm.rightsPagingInfo.SearchColumns && vm.rightsPagingInfo.SearchColumns.length > 0) {
            _.filter(vm.pages, (objPage) => {
              objPage.IsShortcut = isChecked;
              const isPageAdded = _.find(vm.selectedPages, (objSelectedPage) => objSelectedPage.pageID === objPage.pageID);
              if (isPageAdded) {
                isPageAdded.IsShortcut = objPage.IsShortcut;
              } else {
                vm.selectedPages.push(objPage);
              }
            });
          } else {
            _.each(vm.pages, (objPage) => {
              objPage.IsShortcut = isChecked;
              const isPageAdded = _.find(vm.selectedPages, (objSelectedPage) => objSelectedPage.pageID === objPage.pageID);
              if (isPageAdded) {
                isPageAdded.IsShortcut = objPage.IsShortcut;
              } else {
                vm.selectedPages.push(objPage);
              }
            });
          }
          $scope.isRightChange = true;
          vm.selectedPageCount.selectedBookmarkMenuCount = _.filter(vm.pages, (item) => item.IsShortcut).length;
        }
        else if (rightName === 'Feature') {
          if (vm.featurePagingInfo.SearchColumns && vm.featurePagingInfo.SearchColumns.length > 0) {
            _.filter(vm.features, (objFeature) => {
              objFeature.isActive = isChecked;
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
        else if (rightName === 'Standard') {
          if (vm.standardPagingInfo.SearchColumns && vm.standardPagingInfo.SearchColumns.length > 0) {
            _.each(vm.standard, (objstd) => {
              objstd.standardCheck = isChecked;
              const isStandardAdded = _.find(vm.selectedStandard, (objSelectedStd) => objSelectedStd.certificateStandardID === objstd.certificateStandardID);
              if (isStandardAdded) {
                isStandardAdded.standardCheck = objstd.standardCheck;
              } else {
                vm.selectedStandard.push(objstd);
              }
            });
          } else {
            _.each(vm.standard, (objstd) => {
              objstd.standardCheck = isChecked;
              const isStandardAdded = _.find(vm.selectedStandard, (objSelectedStd) => objSelectedStd.certificateStandardID === objstd.certificateStandardID);
              if (isStandardAdded) {
                isStandardAdded.standardCheck = objstd.standardCheck;
              } else {
                vm.selectedStandard.push(objstd);
              }
            });
          }
          $scope.isStandardChange = true;
        }
        else if (rightName === 'HelpBlog') {
          if (vm.rightsPagingInfo.SearchColumns && vm.rightsPagingInfo.SearchColumns.length > 0) {
            _.filter(vm.pages, (objPage) => {
              objPage.isHelpBlog = objPage.isActive ? true : isChecked;
              const isPageAdded = _.find(vm.selectedPages, (objSelectedPage) => objSelectedPage.pageID === objPage.pageID);
              if (isPageAdded) {
                isPageAdded.isHelpBlog = objPage.isHelpBlog;
              } else {
                vm.selectedPages.push(objPage);
              }
            });
            if (!isChecked) {
              vm.isAllBookmarkRight = false;
            }
          } else {
            _.each(vm.pages, (objPage) => {
              objPage.isHelpBlog = objPage.isActive ? true : isChecked;;
              const isPageAdded = _.find(vm.selectedPages, (objSelectedPage) => objSelectedPage.pageID === objPage.pageID);
              if (isPageAdded) {
                isPageAdded.isHelpBlog = objPage.isHelpBlog;
              } else {
                vm.selectedPages.push(objPage);
              }
            });
            if (!isChecked) {
              vm.isAllBookmarkRight = false;
            }
          }

          //$scope.isHbChange = true;
          $scope.isRightChange = true;
          vm.selectedPageCount.selectedHBMenuCount = _.filter(vm.pages, (item) => item.isHelpBlog).length;
        }
        else if (rightName === vm.dbViewDataSourceTabName) {
          if (vm.pagingInfoForDbViewDataSource.SearchColumns && vm.pagingInfoForDbViewDataSource.SearchColumns.length > 0) {
            _.each(vm.sourceDataForDbViewDataSource, (objDTSource) => {
              objDTSource.isDBViewAccessChecked = isChecked;
              const isDTSourceAdded = _.find(vm.selectedDataSource, (objSelectedDTSource) => objSelectedDTSource.chartRawDataCatID === objDTSource.chartRawDataCatID);
              if (isDTSourceAdded) {
                isDTSourceAdded.isDBViewAccessChecked = objDTSource.isDBViewAccessChecked;
              } else {
                vm.selectedDataSource.push(objDTSource);
              }
            });
          } else {
            _.each(vm.sourceDataForDbViewDataSource, (objDTSource) => {
              objDTSource.isDBViewAccessChecked = isChecked;
              const isDTSourceAdded = _.find(vm.selectedDataSource, (objSelectedDTSource) => objSelectedDTSource.chartRawDataCatID === objDTSource.chartRawDataCatID);
              if (isDTSourceAdded) {
                isDTSourceAdded.isDBViewAccessChecked = objDTSource.isDBViewAccessChecked;
              } else {
                vm.selectedDataSource.push(objDTSource);
              }
            });
          }
          $scope.isDbViewDataSourceChange = true;
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
          case 2: {
            if ($scope.isStandardChange) {
              return showWithoutSavingAlertTab();
            }
            else {
              vm.standardGridOptions.gridApi.grid.clearAllFilters();
              return true;
            }
            break;
          }
          case 3: {
            if ($scope.isDbViewDataSourceChange) {
              return showWithoutSavingAlertTab();
            }
            else {
              vm.gridOptionsForDbViewDataSource.gridApi.grid.clearAllFilters();
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
            if ($scope.isStandardChange) {
              vm.selectedStandard = [];
              vm.standardGridOptions.gridApi.grid.clearAllFilters();
            }
            if ($scope.isDbViewDataSourceChange) {
              vm.selectedDataSource = [];
              vm.gridOptionsForDbViewDataSource.gridApi.grid.clearAllFilters();
            }
            return true;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      // Function of show information popup for logout of current user after save
      const showInformationForReLoginOfCurrentUser = () => {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.CHANGE_PERMISSION_LOGOUT);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_LOGOUT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_Continue
        };
        return DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            Allpromise = [];
            Allpromise.push(getRolesByUser(), vm.getRoleList(true));
            setUserRoleCheckbox();
            BaseService.logoutWithOperationConfirmation(vm);
          }
        }, () => {
          if ($scope.pageName === vm.PageRightsRole) {
            if (vm.currentTab === vm.permissionsTabName) {
              // isFirstTimeCallPage = false;
              vm.getPageList();
            } else {
              // isFirstTimeCallFeature = false;
              vm.getFeatureList();
            }
          } else {
            Allpromise = [];
            Allpromise.push(getRolesByUser(), vm.getRoleList(true));
            setUserRoleCheckbox();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      // Function of show information popup for send notification of other user after save
      const showInformationForSendNotificationOfOtherUser = () => {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.CHANGE_PERMISSION_SEND_NOTIFICATION);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_SEND_NOTIFICATION,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_Continue
        };
        return DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            if ($scope.pageName === vm.PageRightsRole) {
              if (vm.currentTab === vm.permissionsTabName) {
                // isFirstTimeCallPage = false;
                vm.getPageList();
              } else {
                // isFirstTimeCallFeature = false;
                vm.getFeatureList();
              }
            } else {
              Allpromise = [];
              Allpromise.push(getRolesByUser(), vm.getRoleList(true));
              setUserRoleCheckbox();
            }
            sendNotificationAllActiveSession();
          }
        }, () => {
          if ($scope.pageName === vm.PageRightsRole) {
            if (vm.currentTab === vm.permissionsTabName) {
              // isFirstTimeCallPage = false;
              vm.getPageList();
            } else {
              // isFirstTimeCallFeature = false;
              vm.getFeatureList();
            }
          } else {
            Allpromise = [];
            Allpromise.push(getRolesByUser(), vm.getRoleList(true));
            setUserRoleCheckbox();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      const SaveRoleRight = $scope.$on('SaveRoleRight', () => { vm.SaveRoleRight(); });

      const SaveRoleFeature = $scope.$on('SaveRoleFeature', (event) => { vm.SaveRoleFeature(event); });

      // Function for save role - right - feature
      vm.SaveRoleRight = () => {
        let activeParentPages = [];
        if (vm.userRoleList && vm.userRoleList.length > 0) {
          activeParentPages = vm.selectedPages;
          _.filter(activeParentPages, (data) => {
            AllActivePage.push(data);
            getChildPages([data]);
          });
          SaveRoleRightFeature.PageList = AllActivePage;
          SaveRoleRightFeature.FeatureList = vm.selectedFeature;
        } else {
          SaveRoleRightFeature.RoleList = _.filter(vm.roles, (data) => data.isRoleChecked);
          if (vm.selectedPages && vm.selectedPages.length > 0) {
            activeParentPages = vm.selectedPages;
            _.filter(activeParentPages, (data) => {
              AllActivePage.push(data);
              getChildPages([data]);
            });
            SaveRoleRightFeature.PageList = AllActivePage;
          }
          if (vm.selectedFeature && vm.selectedFeature.length > 0) {
            SaveRoleRightFeature.FeatureList = vm.selectedFeature;
          }
        }

        SaveRoleRightFeature.userId = vm.userId;
        SaveRoleRightFeature.identityUserId = vm.identityUserId;
        vm.cgBusyLoading = RolePagePermisionFactory.saveRoleRightPage().save(SaveRoleRightFeature).$promise.then((objRoleRightFeature) => {
          if (objRoleRightFeature) {
            if (objRoleRightFeature.status === CORE.ApiResponseTypeStatus.SUCCESS) {
              if (vm.currentTab === vm.permissionsTabName) {
                $scope.isRightChange = false;
                vm.pageGridOptions.gridApi.grid.clearAllFilters();
                vm.getPageList();
              }
              else if (vm.currentTab === vm.featuresTabName) {
                $scope.isFeatureChange = false;
                vm.selectedFeature = [];
                vm.featureGridOptions.gridApi.grid.clearAllFilters();
                vm.getFeatureList();
              }
              vm.roleGridOptions.gridApi.grid.clearAllFilters();
              AllActivePage = [];
              SaveRoleRightFeature = {
                RoleList: [],
                DeleteRoleList: [],
                PageList: [],
                FeatureList: []
              };
              isSaveData = true;
              vm.showDefaultRights = false;
              if (vm.loginUser && vm.loginUser.userid === vm.userId) {
                showInformationForReLoginOfCurrentUser();
              } else {
                showInformationForSendNotificationOfOtherUser();
              }
              $scope.$emit('savedRoleRight', true);
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
        // isFirstTimeCallPage = false;
      };

      vm.roleCheckedAlert = () => {
        const addDeleteRoleList = vm.roles.filter((item) => {
          if (item.isRoleChecked && !(_.some(oldUserRoleList, (oldUserRole) => oldUserRole.role.id === item.id))) {
            item.action = 'A';
            return item;
          }
          else if (_.some(oldUserRoleList, (oldUserRole) => oldUserRole.role.id === item.id) && !item.isRoleChecked) {
            item.action = 'D';
            return item;
          }
        });

        if (addDeleteRoleList && addDeleteRoleList.length > 0) {
          $scope.isRoleChange = true;
        } else {
          $scope.isRoleChange = false;
        }
      };

      const getSelectedRoleList = () => {
        getRolesByUser().then((res) => {
          if (res && res.length > 0) {
            vm.selectedRoleList = _.map(res, (item) => {
              const obj = {
                'roleId': item.roleId,
                'roleName': item.role.name
              };
              return obj;
            });
            vm.autoCompleteRoleList.keyColumnId = vm.autoCompleteRoleList.keyColumnId && _.some(vm.selectedRoleList, (item) => item.roleId === vm.autoCompleteRoleList.keyColumnId) ? vm.autoCompleteRoleList.keyColumnId : vm.selectedRoleList[0].roleId;
          }
        });
      };
      if (vm.pageName !== vm.RolePage && vm.pageName !== vm.pageRightsRole) {
        getSelectedRoleList();
      }

      /* Autocomplete for selected role list. */
      vm.autoCompleteRoleList = {
        columnName: 'roleName',
        keyColumnName: 'roleId',
        keyColumnId: null,
        inputName: 'roleId',
        placeholderName: 'Type here to search',
        callbackFn: getRolesByUser,
        onSelectCallbackFn: (item) => {
          if (item && item.roleId) {
            vm.currentRole = item;
            getPageListByRole(vm.currentTab, vm.userId, item.roleId);
          }
        }
      };

      /* Save User Roles. */
      vm.saveRoles = () => {
        const addDeleteRoleList = vm.roles.filter((item) => {
          // 'A' =  new Added role , 'D' = need to Delete Role.
          if (item.isRoleChecked && !(_.some(oldUserRoleList, (oldUserRole) => oldUserRole.role.id === item.id))) {
            item.action = 'A';
            return item;
          }
          else if (_.some(oldUserRoleList, (oldUserRole) => oldUserRole.role.id === item.id) && !item.isRoleChecked) {
            item.action = 'D';
            return item;
          }
        });
        const addRoleList = _.filter(addDeleteRoleList, (item) => item.action === 'A');
        const deleteRoleList = _.filter(addDeleteRoleList, (item) => item.action === 'D');
        const deleteRoleIdList = _.map(deleteRoleList, (item) => item.id);

        if ((addRoleList && addRoleList.length > 0) || (deleteRoleList && deleteRoleList.length > 0)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.CONFIRMATION_FOR_DELETE_ROLE);

          let tableData = '';
          addDeleteRoleList.sort((a, b) => a.accessLevel - b.accessLevel); // Sort by accessLevel.
          _.each(addDeleteRoleList, (item, i) => {
            tableData += '<tr class="border"><td class="pv-5 pl-10"> ' + (i + 1) + ' </td><td> ' + item.name + ' </td><td> ' + (item.action === 'A' ? 'Add' : 'Remove' + ' </td></tr> ');
          });
          messageContent.message = '<h2>' + messageContent.message + '</h2>' + '<table class="width-100p mt-10">' +
            '<thead class="border"><tr><th class="pv-5 pl-10">#</th><th>Role</th><th>Action</th></tr></thead><tbody>' + tableData + '</tbody>' + '</table>';

          const buttonsList = [
            { name: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT },
            { name: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT }
          ];

          const data = {
            messageContent: messageContent,
            buttonsList: buttonsList,
            buttonIndexForFocus: 0
          };

          DialogFactory.dialogService(
            CORE.MULTIPLE_BUTTONS_DIALOG_POPUP_CONTROLLER,
            CORE.MULTIPLE_BUTTONS_DIALOG_POPUP_VIEW,
            null,
            data).then(() => {
              // success block
            }, (response) => {
              if (response === buttonsList[1].name) {
                vm.updateRoleRight(addRoleList, deleteRoleIdList);
              }
              else {
                $scope.isRoleChange = false;
                getrole(true);
              }
            }, (err) => BaseService.getErrorLog(err));
        }
        else {
          // Static Notification : if possible need to do code re-factor.
          NotificationFactory.information(TRANSACTION.SAVE_ON_NOCHANGES);
        }
      };

      /* Save User Roles. */
      vm.updateRoleRight = (addRoleList, deleteRoleIdList) => {
        const manageRoleList = {
          addRoleList: addRoleList,
          deleteRoleIdList: deleteRoleIdList,
          userId: vm.userId,
          identityUserId: vm.identityUserId
        };
        vm.cgBusyLoading = RolePagePermisionFactory.updateRoleRight().save(manageRoleList).$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            $scope.isRoleChange = false;
            if (_.some(deleteRoleIdList, (item) => item === vm.currentRole.roleId)) {
              $scope.isRightChange = false;
              $scope.isFeatureChange = false;
            }
            getSelectedRoleList();
            vm.deleteRoleIdList = [];
            vm.addRoleIdList = [];
            isFirstTimeCallRoll = false;
            // AllActivePage = [];
            isSaveData = true;
            vm.isPageNoDataFound = false;
            if (vm.loginUser && vm.loginUser.userid === vm.userId) { //to update role
              const updatedRoleDetails = angular.copy(vm.loginUser);
              updatedRoleDetails.roles = _.filter(vm.roles, (data) => data.isRoleChecked);
                      /* only for debug purpose - [S]*/
const tractActivityLog = getLocalStorageValue('tractActivityLog');
if (tractActivityLog && Array.isArray(tractActivityLog)) {
  const obj = { time: new Date().toString().replace(/T/, ':').replace(/\.\w*/, '') , message: 'Set Loginuser: updateRoleRight' };
  tractActivityLog.push(obj);
  setLocalStorageValue('tractActivityLog', tractActivityLog);
}
/* [E]*/
              BaseService.setLoginUser(updatedRoleDetails);
              vm.loginUser = BaseService.loginUser;
            }

            if (vm.loginUser && vm.loginUser.userid === vm.userId) {
              showInformationForReLoginOfCurrentUser();
            } else {
              showInformationForSendNotificationOfOtherUser();
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      // Function for save role
      vm.SaveRoleFeature = (event) => {
        if (event) {
          event.preventDefault();
        }
        if (vm.roleId === 0) {
          if (vm.selectedPages && vm.selectedPages.length > 0) {
            const activeParentPages = vm.selectedPages;
            _.filter(activeParentPages, (data) => {
              AllActivePage.push(data);
              getChildPages([data]);
            });
            SavePageFeature.PageList = AllActivePage;
          }
          if (vm.selectedFeature && vm.selectedFeature.length > 0) {
            SavePageFeature.FeatureList = vm.selectedFeature;
          }
          if (vm.selectedStandard && vm.selectedStandard.length > 0) {
            SavePageFeature.standardList = vm.selectedStandard;
          }
          if (vm.selectedDataSource && vm.selectedDataSource.length > 0) {
            SavePageFeature.DbViewDataSourceList = vm.selectedDataSource;
          }
        } else {
          const activeParentPages = vm.selectedPages;
          _.filter(activeParentPages, (data) => {
            AllActivePage.push(data);
            getChildPages([data]);
          });
          SavePageFeature.PageList = AllActivePage;

          SavePageFeature.FeatureList = vm.selectedFeature;
          SavePageFeature.standardList = vm.selectedStandard;
          SavePageFeature.DbViewDataSourceList = vm.selectedDataSource;
        }


        if ($scope.pageName === vm.RolePage) {
          if (vm.IsEdit) {
            updateRole(vm.roleId);
          } else {
            addRole();
          }
        }

        if ($scope.pageName === vm.PageRightsRole) {
          SavePageFeatureRecord(vm.roleId);
        }
      };

      $scope.$on('$destroy', () => {
        SaveRoleFeature();
        SaveRoleRight();
      });

      // Function for add new role
      const addRole = () => {
        const addObj = $scope.roleObj;
        return vm.cgBusyLoading = RoleFactory.role().save(addObj).$promise.then((res) => {
          if (res && res.data) {
            vm.createMessage = res.data.message;
            vm.roleId = res.data.data.id;
            vm.isAdd = true;
            SavePageFeatureRecord(vm.roleId);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      // Function for update old role
      const updateRole = (rolId) => {
        const updateObj = $scope.roleObj;
        return vm.cgBusyLoading = RoleFactory.role().update({ id: rolId }, updateObj).$promise.then((role) => {
          if (role && role.data) {
            vm.roleId = role.data.data.id;
            vm.updateMessage = role.data.message;
            vm.isAdd = false;
            SavePageFeatureRecord(vm.roleId);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      // Function call by SaveRoleFeature when save page - feature page without role
      const SavePageFeatureRecord = (roleId) => {
        SavePageFeature.roleId = roleId;
        if (SavePageFeature && (SavePageFeature.FeatureList.length > 0 || SavePageFeature.PageList.length > 0
          || SavePageFeature.standardList.length > 0 || SavePageFeature.DbViewDataSourceList.length > 0)) {
          return vm.cgBusyLoading = RoleFactory.SaveRoleFeature().save(SavePageFeature).$promise.then((objPageFeature) => {
            if (objPageFeature && objPageFeature.data) {
              if (objPageFeature.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                // isFirstTimeCallFeature = false;
                AllActivePage = [];
                if (vm.currentTab === vm.permissionsTabName) {
                  //Add for toaster message dispaly tab wise using NotificationFactory
                  if (objPageFeature.data.isPageList) {
                    NotificationFactory.success(CORE.MESSAGE_CONSTANT.SAVE_ROLE_PERMISSION);
                  }
                  $scope.isRightChange = false;
                  // isFirstTimeCallPage = false;
                  vm.pageGridOptions.gridApi.grid.clearAllFilters();
                }
                else if (vm.currentTab === vm.featuresTabName) {
                  $scope.isFeatureChange = false;
                  vm.selectedFeature = [];
                  vm.featureGridOptions.gridApi.grid.clearAllFilters();
                  vm.getFeatureList();
                }
                else if (vm.currentTab === vm.dbViewDataSourceTabName) {
                  $scope.isDbViewDataSourceChange = false;
                  vm.selectedDataSource = [];
                  vm.gridOptionsForDbViewDataSource.gridApi.grid.clearAllFilters();
                  vm.loadDataForDbViewDataSource();
                }
                else {
                  $scope.isStandardChange = false;
                  vm.selectedStandard = [];
                  vm.standardGridOptions.gridApi.grid.clearAllFilters();
                  vm.getstandardList();
                }

                SavePageFeature = {
                  PageList: [],
                  FeatureList: [],
                  standardList: [],
                  DbViewDataSourceList: []
                };
                if ($scope.pageName === vm.RolePage) {
                  vm.rid = vm.roleId;

                  $scope.$emit('setrolepermissionFrom', vm.rid);
                }

                if ($scope.pageName === vm.PageRightsRole) {
                  $scope.isRightChange = false;
                  $scope.isFeatureChange = false;
                  $scope.isStandardChange = false;
                  if (vm.loginUser && vm.loginUser.userid === vm.userId) {
                    showInformationForReLoginOfCurrentUser();
                  } else {
                    showInformationForSendNotificationOfOtherUser();
                  }
                }
              }
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
        else {
          AllActivePage = [];
          if ($scope.pageName === vm.RolePage) {
            vm.rid = vm.roleId;

            $scope.$emit('setroleFrom', vm.rid);
            if (vm.currentTab === vm.permissionsTabName) {
              $scope.isRightChange = false;
              // isFirstTimeCallPage = false;
              vm.pageGridOptions.gridApi.grid.clearAllFilters();
            }
            else if (vm.currentTab === vm.featuresTabName) {
              $scope.isFeatureChange = false;
              vm.featureGridOptions.gridApi.grid.clearAllFilters();
            }
            else if (vm.currentTab === vm.dbViewDataSourceTabName) {
              $scope.isDbViewDataSourceChange = false;
              vm.gridOptionsForDbViewDataSource.gridApi.grid.clearAllFilters();
              vm.loadDataForDbViewDataSource();
            }
            else {
              $scope.isStandardChange = false;
            }
          }

          if ($scope.pageName === vm.PageRightsRole) {
            $scope.isRightChange = false;
            $scope.isFeatureChange = false;
            $scope.isStandardChange = false;

            if (vm.currentTab === vm.permissionsTabName) {
              vm.pageGridOptions.gridApi.grid.clearAllFilters();
            } else if (vm.currentTab === vm.featuresTabName) {
              vm.featureGridOptions.gridApi.grid.clearAllFilters();
            }
            else {
              vm.standardGridOptions.gridApi.grid.clearAllFilters();
            }

            if (vm.loginUser && vm.loginUser.userid === vm.userId) {
              showInformationForReLoginOfCurrentUser();
            } else {
              showInformationForSendNotificationOfOtherUser();
            }
          }
        }
      };

      // Function for get all child page of parent page for save perent related child page
      const getChildPages = (parenPage) => {
        _.filter(parenPage, (item) => {
          const chilePageList = _.filter(AllPages, (matchData) => {
            if (matchData.parentPageID === item.pageID && !matchData.isDisplay) {
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
      };

      // Function for update the default role field of user table when first role selected
      const setAsDefaultRole = () => {
        const defaultRole = vm.userRoleList ? (vm.userRoleList.reduce((min, p) => p.role.accessLevel < min.role.accessLevel ? p : min, vm.userRoleList[0])) : null;
        const userObject = {
          id: vm.userId,
          defaultLoginRoleID: defaultRole ? defaultRole.roleId : null
        };

        UserFactory.updateUserByDefaultRole().query({ userObj: userObject }).$promise.then(() => {
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /************************** [S] - Section for DB View Data Source ****************************/
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
        filterOptions: vm.pagingInfoForDbViewDataSource.SearchColumns
      };

      vm.sourceHeaderForDbViewDataSource = [
        {
          field: 'name',
          width: '84%',
          displayName: 'Data Source',
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          enableCellEdit: false
        },
        {
          field: 'roleID',
          cellClass: 'gridCellColor',
          displayName: 'Data Source Access',
          width: '16%',
          cellTemplate: '<div class="center cm-role-checkbox">'
            + '<label class="cm-radio">'
            + '<input ui-grid-checkbox type="checkbox"'
            + 'ng-model="row.entity.isDBViewAccessChecked" class="cm-role-checkbox"'
            + 'ng-checked="row.entity.isDBViewAccessChecked == \'1\'"'
            + 'ng-change="grid.appScope.$parent.vm.checkRight(grid.appScope.$parent.vm.dbViewDataSourceTabName, row.entity)"'
            + 'ng-disabled="!grid.appScope.$parent.vm.isUpdatable">'
            + '<span class="checkmark"></span>'
            + '</label>'
            + '</div>',
          filterHeaderTemplate: '<div class="center cm-role-checkbox">'
            + '<label class="cm-radio">'
            + '<input ui-grid-checkbox type="checkbox"'
            + 'ng-model="grid.appScope.$parent.vm.isAllDbViewChecked"'
            + 'ng-change="grid.appScope.$parent.vm.checkAllRight(grid.appScope.$parent.vm.dbViewDataSourceTabName, grid.appScope.$parent.vm.isAllDbViewChecked)" class="cm-role-checkbox"'
            + 'ng-disabled="!grid.appScope.$parent.vm.isUpdatable">'
            + '<span class="checkmark"></span>'
            + '</label>'
            + '</div>',
          enableSorting: false,
          exporterSuppressExport: false,
          pinnedLeft: false,
          enableCellEdit: false
        }
      ];

      function bindSelectedDataSource() {
        if (vm.sourceDataForDbViewDataSource && vm.sourceDataForDbViewDataSource.length > 0 && vm.selectedDataSource && vm.selectedDataSource.length > 0) {
          _.each(vm.sourceDataForDbViewDataSource, (objDTSource) => {
            const isselectedDTSource = _.find(vm.selectedDataSource, (objselectedDTSource) => objselectedDTSource.chartRawDataCatID === objDTSource.chartRawDataCatID);
            if (isselectedDTSource) {
              objDTSource.isDBViewAccessChecked = isselectedDTSource.isDBViewAccessChecked;
            }
          });
        }
        const isAnyDbViewInNotSelectedMode = _.some(vm.sourceDataForDbViewDataSource, (data) => !data.isDBViewAccessChecked);
        if (!isAnyDbViewInNotSelectedMode && vm.sourceDataForDbViewDataSource && vm.sourceDataForDbViewDataSource.length > 0) {
          vm.isAllDbViewChecked = true;
        }
        else {
          vm.isAllDbViewChecked = false;
        }
      }
      //Get The All db view list for accessing widget/reports
      vm.loadDataForDbViewDataSource = () => {
        if (vm.pagingInfoForDbViewDataSource && (vm.pagingInfoForDbViewDataSource.RoleId || vm.pagingInfoForDbViewDataSource.RoleId === 0)) {
          vm.pagingInfoForDbViewDataSource.Page = 0;
          return RawdataCategoryFactory.rawdatacategorylist(vm.pagingInfoForDbViewDataSource).query().$promise.then((rawdatacategory) => {
            const sourceDataOfDbViews = rawdatacategory.data.Chart_Rawdata_Category;
            vm.sourceDataForDbViewDataSource = [];
            _.each(sourceDataOfDbViews, (item) => {
              if (item.isAccessByDefinedRole) {
                item.isDBViewAccessChecked = true;
              }
              else {
                item.isDBViewAccessChecked = false;
              }
              vm.sourceDataForDbViewDataSource.push(item);
            });
            vm.totalSourceDataCountForDbViewDataSource = vm.sourceDataForDbViewDataSource.length;
            vm.currentdataForDbViewDataSource = vm.sourceDataForDbViewDataSource.length;

            if (vm.totalSourceDataCountForDbViewDataSource === 0) {
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
            bindSelectedDataSource();
            $timeout(() => {
              vm.resetSourceGridForDbViewDataSource();
              if (!vm.gridOptionsForDbViewDataSource.enablePaging && vm.totalSourceDataCountForDbViewDataSource === vm.currentdataForDbViewDataSource) {
                return vm.gridOptionsForDbViewDataSource.gridApi.infiniteScroll.dataLoaded(false, false);
              }
            });
          }).catch((error) => BaseService.getErrorLog(error));
        }
      };

      vm.getDataDownForDbViewDataSource = () => {
        vm.pagingInfoForDbViewDataSource.Page = vm.pagingInfoForDbViewDataSource.Page + 1;

        vm.cgBusyLoading = RawdataCategoryFactory.rawdatacategorylist(vm.pagingInfoForDbViewDataSource).query().$promise.then((rawdatacategory) => {
          _.each(rawdatacategory.data.Chart_Rawdata_Category, (item) => {
            if (item.isAccessByDefinedRole) {
              item.isDBViewAccessChecked = true;
            }
            else {
              item.isDBViewAccessChecked = false;
            }
            vm.sourceDataForDbViewDataSource.push(item);
          });
          vm.currentdataForDbViewDataSource = vm.sourceDataForDbViewDataSource.length;
          bindSelectedDataSource();
          $timeout(() => {
            vm.resetSourceGridForDbViewDataSource();
            return vm.gridOptionsForDbViewDataSource.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCountForDbViewDataSource !== vm.currentdataForDbViewDataSource ? true : false);
          });
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
        _.filter(vm.features, (item) => {
          item.isDefaultActive = item.isActive === 1 ? true : false; /*Used this key to highlight default rights*/
        });

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

      vm.checkUnCheckAllRights = (pages) => {
        if (pages.length > 0) {
          const checkFalseRO = _.some(pages, (data) => !data.RO);
          if (!checkFalseRO) {
            vm.isAllRORight = true;
          } else {
            vm.isAllRORight = false;
          }

          const checkFalseRW = _.some(pages, (data) => !data.RW);
          if (!checkFalseRW) {
            vm.isAllRWRight = true;
          } else {
            vm.isAllRWRight = false;
          }

          const checkFalsePermission = _.some(pages, (data) => !data.isActive);
          if (!checkFalsePermission) {
            vm.isAllPermissionRight = true;
          } else {
            vm.isAllPermissionRight = false;
          }

          const checkFalseBookmark = _.some(pages, (data) => !data.IsShortcut);
          if (!checkFalseBookmark) {
            vm.isAllBookmarkRight = true;
          } else {
            vm.isAllBookmarkRight = false;
          }

          const checkFalseHB = _.some(pages, (data) => !data.isHelpBlog);
          if (!checkFalseHB) {
            vm.isAllHBRight = true;
          } else {
            vm.isAllHBRight = false;
          }
        } else {
          vm.isAllRORight = false;
          vm.isAllRWRight = false;
          vm.isAllPermissionRight = false;
          vm.isAllHBRight = false;
          vm.isAllBookmarkRight = false;
        }
      };

      /************************** [E] - Section for DB View Data Source ************************************/

      // Function for send notification when user change the other user role-right-permiddion
      const sendNotificationAllActiveSession = () => {
        RolePagePermisionFactory.sendNotificationOfRightChanges().query({ id: vm.selectEmployeeId }).$promise.then(() => {
        }).catch((error) => BaseService.getErrorLog(error));
      };

      vm.addRole = () => {
        BaseService.goToRoleAddUpdate(0);
      };
    }
  }
})();
