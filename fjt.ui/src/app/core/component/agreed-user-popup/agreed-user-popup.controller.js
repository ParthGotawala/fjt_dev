(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('AgreedUserPopupController', AgreedUserPopupController);
  /** @ngInject */
  function AgreedUserPopupController($mdDialog, data, AgreementFactory, CORE, CONFIGURATION, $timeout, BaseService, DialogFactory, $scope, $rootScope) {
    const vm = this;
    vm.data = data;
    vm.gridConfig = CORE.gridConfig;
    vm.LabelConstant = CORE.LabelConstant;
    vm.EmptyMesssage = CONFIGURATION.CONFIGURATION_EMPTYSTATE.AGREED_USER;
    const descriptionLabel = vm.data.templateType === CONFIGURATION.Agreement_Template_Type.AGREEMENT ? CONFIGURATION.Page_Name.AGREEMENT : CONFIGURATION.Page_Name.EMAIL;
    vm.headerdata = [];
    vm.isPrinted = true;
    vm.isDownload = true;
    vm.isUserSignup = vm.data.isUserSignup ? vm.data.isUserSignup : false;
    vm.loginUser = BaseService.loginUser;
    vm.userId = vm.loginUser.identityUserId;
    const isEnablePagination = vm.loginUser.uiGridPreference === CORE.UIGrid.UI_GRID_PAGING_PREFERENCE_TYPE.Pagination ? true : false;
    vm.popoverPlacement = 'left';

    // got to email template list
    const goToEmailTemplateList = () => BaseService.goToEmailTemplateList();

    // go to agreement template list
    const goToAgreementTemplateList = () => BaseService.goToAgreementTemplateList();

    // Show Agreement/email Content
    vm.showAgreemnetContent = (data, ev) => {
      const obj = {
        agreementContent: data.agreementContent,
        isTemplateView: true,
        templateLabel: vm.data.templateLabel,
        pageName: descriptionLabel,
        templateType: vm.templateType,
        latestVersion: data.version,
        lastPublishedDate: data.newpublishedDate,
        signature: data.imageURL,
        isArchieveVersion: true,
        isShowSignature: true,
        agreedDate: data.newagreedDate,
        agreedBy: data.userName,
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

    vm.sourceHeader = [
      {
        field: 'Action',
        cellClass: 'gridCellColor',
        displayName: 'Action',
        width: '120',
        cellTemplate: '<grid-action-view grid="grid" row="row"></grid-action-view>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        pinnedLeft: true,
        enableCellEdit: false
      },
      {
        field: '#',
        width: CORE.UI_GRID_COLUMN_WIDTH.INDEX_COLUMN,
        cellTemplate: CORE.UIGrid.ROW_NUM_CELL_TEMPLATE,
        enableFiltering: false,
        enableSorting: false,
        maxWidth: '80'
      },
      {
        field: 'agreedDate',
        displayName: CONFIGURATION.HEADER_INFORMATION.AGREED_ON,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false
      },
      {
        field: 'version',
        displayName: CONFIGURATION.HEADER_INFORMATION.VERSION,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD}}</div>',
        width: 100,
        enableFiltering: true
      }, {
        field: 'agreementContent',
        displayName: descriptionLabel,
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
        field: 'publishedDate',
        displayName: CONFIGURATION.HEADER_INFORMATION.PUBLISHED_DATE,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.CREATED_DATE,
        type: 'datetime',
        enableFiltering: false
      },
      {
        field: 'createdBy',
        displayName: CONFIGURATION.HEADER_INFORMATION.AGREED_BY,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.MODIFIEDBY,
        type: 'StringEquals',
        enableFiltering: true
      }];

    const initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        isPrint: true,
        pageName: CORE.PAGENAME_CONSTANT[41].PageName,
        SortColumns: [['version', 'DESC'], ['agreedDate', 'DESC']],
        SearchColumns: []
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
      exporterCsvFilename: 'Agreed User.csv',
      hideMultiDeleteButton: true,
      CurrentPage: CORE.PAGENAME_CONSTANT[41].PageName
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

    function setDataAfterGetAPICall(agreedType, isGetDataDown) {
      if (agreedType && agreedType.data.AgreedUserList) {
        if (!isGetDataDown) {
          vm.sourceData = agreedType.data.AgreedUserList;
          vm.currentdata = vm.sourceData.length;
        }
        else if (agreedType.data.AgreedUserList.length > 0) {
          vm.sourceData = vm.gridOptions.data = vm.gridOptions.data.concat(agreedType.data.AgreedUserList);
          vm.currentdata = vm.gridOptions.currentItem = vm.gridOptions.data.length;
        }
        if (vm.sourceData && vm.sourceData.length > 0) {
          _.each(vm.sourceData, (item) => item.isShowAgreedUser = false);
        }
        // must set after new data comes
        vm.totalSourceDataCount = agreedType.data.Count;
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

    /* retrieve Agreed Users list*/
    vm.loadData = () => {
      vm.isHideDelete = true;
      vm.pagingInfo.agreementTypeID = vm.data.agreementTypeID;
      vm.pagingInfo.userID = vm.data.isUserSignup ? vm.data.userID : null;
      BaseService.setPageSizeOfGrid(vm.pagingInfo, vm.gridOptions);
      vm.cgBusyLoading = AgreementFactory.getAgreedUserList().query(vm.pagingInfo).$promise.then((agreedType) => {
        if (agreedType.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          setDataAfterGetAPICall(agreedType, false);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /* load more data on mouse scroll */
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = AgreementFactory.getAgreedUserList().query(vm.pagingInfo).$promise.then((agreedType) => {
        setDataAfterGetAPICall(agreedType, true);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.Download = (obj) => {
      vm.cgBusyLoading = AgreementFactory.getAgreementTemplateDetails(obj).then((res) => {
        if (res.data.byteLength > 0) {
          const blob = new Blob([res.data], {
            type: 'application/pdf'
          });
          const fileName = obj.agreementName + '_' + obj.version + '_' + obj.createdBy + '.pdf';
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

    //single prin
    vm.printRecord = (row) => {
      vm.PrintDocument(row.entity);
    };

    // Handle Print for Signle and Multiple
    vm.PrintDocument = (data) => {
      let selectedIDs = [];
      if (data) {
        selectedIDs.push(data.userAgreementID);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((Item) => Item.userAgreementID);
        }
      }
      if (selectedIDs && selectedIDs.length > 0) {
        const obj = {
          userAgreementID: selectedIDs,
          isViewSignature: true,
          isFromPrint: true,
          isDraftversion: false
        };
        vm.Download(obj);
      }
    };

    //multiple prints
    $scope.$on('PrintDocument', () => {
      vm.PrintDocument();
    });

    vm.onDownload = (data) => {
      const obj = {
        userAgreementID: data.entity.userAgreementID,
        isViewSignature: true,
        isFromPrint: false,
        isDraftversion: false,
        agreementName: vm.data.templateLabel,
        version: data.entity.version,
        createdBy: data.entity.createdBy
      };
      if (obj) {
        vm.Download(obj);
      }
    };

    //close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
    });

    vm.headerdata.push({
      value: vm.data.templateLabel,
      valueLinkFn: vm.data.templateType === CONFIGURATION.Agreement_Template_Type.EMAIL ? goToEmailTemplateList : goToAgreementTemplateList,
      label: CONFIGURATION.HEADER_INFORMATION.NAME,
      displayOrder: 1
    }, {
      value: vm.data.latestVersion,
      label: CONFIGURATION.HEADER_INFORMATION.PUBLISHED_VERSION,
      displayOrder: 2
    }, {
      value: vm.data.lastPublishedDate,
      label: CONFIGURATION.HEADER_INFORMATION.PUBLISHED_DATE,
      displayOrder: 3
    });

    vm.cancel = () => {
      $mdDialog.cancel();
    };
  }
})();
