(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('userSignupAgreement', userSignupAgreement);

  /** @ngInject */
  function userSignupAgreement(BaseService, CORE, DialogFactory, CONFIGURATION, AgreementFactory, USER, $rootScope) {
    var directive = {
      restrict: 'E',
      scope: {
        userID: '=?'
      },
      templateUrl: 'app/directives/custom/user-signup-agreement/user-signup-agreement.html',
      controller: userSignUpAgreementListCtrl,
      controllerAs: 'vm'
    };
    return directive;

    
    /** @ngInject */
    /**
    * Controller for view data of User Agreement
    *
    * @param
    */
    function userSignUpAgreementListCtrl($scope, $timeout) {
      var vm = this;
      vm.isHideDelete = true;
      vm.isDownload = true;
      vm.isPrinted = true;
      vm.EmptyMesssage = USER.ADMIN_EMPTYSTATE.USER_SIGNUP_AGREEMENT;
      vm.gridConfig = CORE.gridConfig;
      vm.LabelConstant = CORE.LabelConstant;
      vm.templateStatus = CORE.SalesOrderStatusGridHeaderDropdown;
      vm.isArchieveVersion = true;
      vm.loginUser = BaseService.loginUser;
      vm.userID = vm.loginUser.identityUserId;
      vm.userName = vm.loginUser.employee.initialName;
      const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;
      vm.templateType = CONFIGURATION.Agreement_Template_Type.AGREEMENT;
      vm.popoverPlacement = 'left';

      // Show Agreement Content
      vm.showAgreemnetContent = (data, ev) => {
        const obj = {
          agreementContent: data.agreementContent,
          isTemplateView: true,
          templateLabel: data.agreementName,
          pageName: CONFIGURATION.Page_Name.AGREEMENT,
          templateType: data.templateType,
          latestVersion: data.version,
          lastPublishedDate: data.newpublishedDate,
          signature: data.imageURL,
          isArchieveVersion: true,
          isShowSignature: true,
          agreedDate: data.agreedDate,
          agreedBy: vm.userName,
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

      vm.sourceHeader = [{
        field: 'Action',
        cellClass: 'gridCellColor',
        displayName: 'Action',
        width: '150',
        cellTemplate: '<grid-action-view grid="grid" row="row" hidden;padding:1px !important; overflow: hidden; white-space: nowrap; number-of-action-button="3"></grid-action-view>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: false
      }, {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false,
        maxWidth: '80'
      }, {
        field: 'agreementName',
        displayName: CONFIGURATION.HEADER_INFORMATION.NAME,
        cellTemplate: '<div class="ui-grid-cell-contents text-left cm-white-space-normal">{{COL_FIELD}}</div>',
        width: '400',
        maxWidth: '500'
      }, {
        field: 'agreementContent',
        displayName: 'Agreement',
        cellTemplate: '<md-button class="md-warn md-hue-1 mt-0 ml-40" ng-click="grid.appScope.$parent.vm.showAgreemnetContent(row.entity, $event)">View</md-button>',
        width: '200',
        enableFiltering: false,
        exporterSuppressExport: true
      }, {
        field: 'imageURL',
        width: 120,
        displayName: 'Signature',
        cellTemplate: '<div class="ui-grid-cell-contents">'
          + '<img class="width-70 height-25 image-popover" ng-src="{{COL_FIELD}}"'
          + ' uib-popover-template="\'imagePreviewTemplate.html\'" '
          + ' popover-trigger="\'mouseenter\'" '
          + ' popover-append-to-body ="true" '
          + ' popover-class= "width-400 height-400 cm-center-screen-location cm-component-img" '
          + ' popover-placement="{{grid.appScope.$parent.vm.popoverPlacement}}" '
          + ' /> </div>',
        exporterSuppressExport: true,
        enableFiltering: false,
        enableSorting: false,
        allowCellFocus: false
      }, {
        field: 'version',
        displayName: CONFIGURATION.HEADER_INFORMATION.PUBLISHED_VERSION,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
        width: '180'
      }, {
        field: 'agreedDate',
        displayName: CONFIGURATION.HEADER_INFORMATION.AGREED_ON,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false
      }, {
        field: 'createdby',
        displayName: CONFIGURATION.HEADER_INFORMATION.AGREED_BY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }];

      const initPageInfo = () => {
        vm.pagingInfo = {
          Page: CORE.UIGrid.Page(),
          SortColumns: [['agreementID', 'ASC']],
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
        exporterCsvFilename: 'User Agreeement.csv',
        CurrentPage: CORE.PAGENAME_CONSTANT[37].PageName
      };

      //Show signature on hover
      function setPopover() {
        $('.image-popover').on('mouseenter', (e) => {
          vm.popoverPlacement = (e.view.innerWidth / 2);
          if (vm.popoverPlacement < e.clientX) {
            vm.popoverPlacement = 'left';
          }
          else {
            vm.popoverPlacement = 'right';
          }
        });
      };
      $rootScope.$on(CORE.GRID_COL_PINNED_AND_VISIBLE_CHANGE, () => {
        setPopover();
      });

      function setDataAfterGetAPICall(template, isGetDataDown) {
        if (template && template.data.AgreementUserList) {
          if (!isGetDataDown) {
            vm.sourceData = template.data.AgreementUserList;
            vm.currentdata = vm.sourceData.length;
          }
          else if (template.data.AgreementUserList.length > 0) {
            vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(template.data.AgreementUserList);
            vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
          }
          // must set after new data comes
          vm.totalSourceDataCount = template.data.Count;
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

      /* retrieve Template list */
      vm.getuserData = () => {
        vm.pagingInfo.userID = vm.userID;
        BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
        vm.cgBusyLoading = AgreementFactory.retriveUserSignUpAgreementList().query(vm.pagingInfo).$promise.then((template) => {
          if (template.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            setDataAfterGetAPICall(template, false);;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      /* load more data on mouse scroll */
      vm.getDataDown = () => {
        vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
        vm.cgBusyLoading = AgreementFactory.retriveUserSignUpAgreementList().query(vm.pagingInfo).$promise.then((template) => {
          if (template) { setDataAfterGetAPICall(template, true); }
        }).catch((error) => BaseService.getErrorLog(error));
      };

      // Archieve Version popup
      vm.openArchieveVersionPopup = (row, ev) => {
        const obj = {
          pageName: CORE.USER_PROFILE_SIGNUP_AGREEMENT_LABEL,
          agreementTypeID: row.entity.agreementTypeID,
          templateType: row.entity.templateType,
          templateLabel: row.entity.agreementName,
          latestVersion: row.entity.latestversion,
          lastPublishedDate: row.entity.headerpublishedDate,
          userID: vm.userID,
          isUserSignup: true
        };
        DialogFactory.dialogService(
          CORE.AGREED_USER_POPUP_CONTROLLER,
          CORE.AGREED_USER_POPUP_VIEW,
          ev,
          obj).then(() => {
          }, (error) => {
            BaseService.getErrorLog(error);
          });
      };

      // Handle Print for user agreement
      vm.printRecord = (data) => {
        const obj = {
          userAgreementID: data.entity.userAgreementID,
          isViewSignature: true,
          isFromPrint: true,
          isDraftversion: false
        };
        if (obj) {
          vm.Download(obj);
        }
      };

      // Download user agreement
      vm.onDownload = (data) => {
        const obj = {
          userAgreementID: data.entity.userAgreementID,
          isViewSignature: true,
          isFromPrint: false,
          isDraftversion: false,
          agreementName: data.entity.agreementName,
          version: data.entity.version
        };
        if (obj) {
          vm.Download(obj);
        }
      };

      // user agreement PDF for download and print functionality
      vm.Download = (obj) => {
        vm.cgBusyLoading = AgreementFactory.getAgreementTemplateDetails(obj).then((res) => {
          if (res.data.byteLength > 0) {
            const blob = new Blob([res.data], {
              type: 'application/pdf'
            });
            const fileName = obj.agreementName + '_' + obj.version + '.pdf';
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', fileName);
            if (obj.isFromPrint) {
              window.open(link);
            } else {
              document.body.appendChild(link);
              $timeout(() => {
                link.click();
                document.body.removeChild(link);
              });
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      };
    }
  }
})();
