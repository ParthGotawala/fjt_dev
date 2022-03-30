(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('archieveVersionList', archieveVersionList);

  /** @ngInject */
  function archieveVersionList(BaseService, CORE, CONFIGURATION, AgreementFactory, DialogFactory) {
    var directive = {
      restrict: 'E',
      scope: {
        agreementId: '=?',
        userId: '=?',
        isTemplateView: '=?',
        isViewSignature: '=?',
        templateType: '=?',
        pageName: '=?'
      },
      templateUrl: 'app/directives/custom/archieve-version-list/archieve-version-list.html',
      controller: archieveVersionListCtrl,
      controllerAs: 'vm'
    };
    return directive;


    /** @ngInject */
    /**
    * Controller for view data of Agreement & Email Template
    *
    * @param
    */
    function archieveVersionListCtrl($scope, $timeout) {
      var vm = this;
      vm.agreementID = $scope.agreementId;
      vm.isTemplateView = $scope.isTemplateView;
      vm.isViewSignature = $scope.isViewSignature;
      vm.templateType = $scope.templateType;
      vm.gridConfig = CORE.gridConfig;
      vm.LabelConstant = CORE.LabelConstant;
      vm.EmptyMesssage = CONFIGURATION.CONFIGURATION_EMPTYSTATE.ARCHIEVE_VERSION;
      const descriptionLabel = vm.templateType === CONFIGURATION.Agreement_Template_Type.AGREEMENT ? CONFIGURATION.Page_Name.AGREEMENT : CONFIGURATION.Page_Name.EMAIL;
      vm.loginUser = BaseService.loginUser;
      vm.userId = vm.loginUser.identityUserId;
      vm.userName = vm.loginUser.employee.initialName;
      vm.userRole = _.find(vm.loginUser.roles, (item) => item.id === vm.loginUser.defaultLoginRoleID);
      vm.roleName = vm.userRole.name;
      const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;

      // View Agreement/Email Template
      vm.showAgreemnetContent = (data, ev) => {
        const obj = {
          agreementContent: data.agreementContent,
          isTemplateView: true,
          templateLabel: data.agreementName,
          pageName: descriptionLabel,
          templateType: vm.templateType,
          latestVersion: data.version,
          lastPublishedDate: data.newpublishedDate,
          isArchieveVersion: true,
          isPublished: data.isPublished
        };
        if (obj) {
          DialogFactory.dialogService(
            CORE.AGREEMENT_MODAL_CONTROLLER,
            CORE.AGREEMENT_MODAL_VIEW,
            ev,
            obj).then(() => {
            }, (error) => {
              BaseService.getErrorLog(error);
            });
        }
      };

      // Show Signature
      vm.signatureContent = (object, ev) => {
        const obj = {
          title: CONFIGURATION.HEADER_INFORMATION.SIGNATURE,
          signatureContent: object.signaturevalue
        };
        const data = obj;
        DialogFactory.dialogService(
          CORE.SIGNATURE_MODAL_CONTROLLER,
          CORE.SIGNATURE_MODAL_VIEW,
          ev,
          data
        ).then(() => {

        }, (err) => {
          BaseService.getErrorLog(err);
        });
      };

      vm.sourceHeader = [
        {
          field: '#',
          width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
          cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
          enableFiltering: false,
          enableSorting: false,
          maxWidth: '80'
        }, {
          field: 'agreementContent',
          displayName: descriptionLabel,
          cellTemplate: '<md-button class="md-warn md-hue-1 mt-0 ml-40" ng-click="grid.appScope.$parent.vm.showAgreemnetContent(row.entity, $event)">View</md-button>',
          width: '200',
          enableFiltering: false,
          exporterSuppressExport: true
        },
        {
          field: 'version',
          displayName: CONFIGURATION.HEADER_INFORMATION.VERSION,
          cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
          width: 100,
          enableFiltering: true
        },
        {
          field: 'publishedDate',
          displayName: !vm.isViewSignature ? CONFIGURATION.HEADER_INFORMATION.PUBLISH_ON : CONFIGURATION.HEADER_INFORMATION.AGREED_ON,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
          type: 'datetime',
          enableFiltering: false
        },
        {
          field: 'updatedby',
          displayName: !vm.isViewSignature ? CONFIGURATION.HEADER_INFORMATION.PUBLISH_BY : CONFIGURATION.HEADER_INFORMATION.AGREED_BY,
          cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
          width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
          type: 'StringEquals',
          enableFiltering: true
        }];

      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [['version', 'DESC']],
          SearchColumns: []
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
        multiSelect: true,
        filterOptions: vm.pagingInfo.SearchColumns,
        exporterMenuCsv: true,
        exporterCsvFilename: 'Archived Versions.csv',
        CurrentPage: CORE.PAGENAME_CONSTANT[39].PageName
      };

      function setDataAfterGetAPICall(archievedType, isGetDataDown) {
        if (archievedType && archievedType.data.ArchieveList) {
          if (!isGetDataDown) {
            vm.sourceData = archievedType.data.ArchieveList;
            vm.currentdata = vm.sourceData.length;
          }
          else if (archievedType.data.ArchieveList.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(archievedType.data.ArchieveList);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }
          // must set after new data comes
          vm.totalSourceDataCount = archievedType.data.Count;
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

      /* retrieve Archieve Version list */
      vm.loadData = () => {
        vm.isHideDelete = true;
        vm.pagingInfo.agreementID = vm.agreementID;
        vm.pagingInfo.userID = vm.userID;
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        vm.cgBusyLoading = AgreementFactory.retriveArchieveVersionDetails().query(vm.pagingInfo).$promise.then((archievedType) => {
          if (archievedType.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            setDataAfterGetAPICall(archievedType, false);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* load more data on mouse scroll */
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = AgreementFactory.retriveArchieveVersionDetails().query(vm.pagingInfo).$promise.then((archievedType) => {
          setDataAfterGetAPICall(archievedType, true);
        }).catch((error) => BaseService.getErrorLog(error));
      };
    }
  }
})();
