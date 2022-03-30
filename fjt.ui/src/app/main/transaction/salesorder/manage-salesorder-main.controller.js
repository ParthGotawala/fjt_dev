(function () {
  'use strict';

  angular
    .module('app.transaction.salesorder')
    .controller('ManageSalesOrderMainController', ManageSalesOrderMainController);

  /** @ngInject */
  function ManageSalesOrderMainController($filter, $state, TRANSACTION, BaseService, CORE, SalesOrderFactory, DialogFactory, $scope, $timeout, CONFIGURATION, PackingSlipFactory, $location) {
    const vm = this;
    vm.salesOrderID = parseInt($state.params.sID);
    vm.WoStatus = _.filter(CORE.WoStatus, (item) => item.ID === 0 || item.ID === 1);
    vm.documentstate = TRANSACTION.TRANSACTION_SALESORDER_DOCUMENT_STATE;
    vm.isPrintDisable = false;
    vm.isDownloadDisabled = false;
    vm.DefaultDateFormat = _dateDisplayFormat;
    active();
    function active() {
      tablist();
      const item = $filter('filter')(vm.tabList, { state: $state.current.name }, true);

      if (item[0]) {
        vm.activeTab = item[0].id;
        vm.title = item[0].title;
      }
      else {
        vm.activeTab = 0;
        vm.title = vm.tabList[0].title;
        $state.go(TRANSACTION.TRANSACTION_SALESORDER_DETAIL_STATE, { sID: vm.salesOrderID });
      }
    }
    function tablist() {
      vm.tabList = [
        { id: 0, title: TRANSACTION.TRANSACTION_SALESORDER_DETAIL_LABEL, state: TRANSACTION.TRANSACTION_SALESORDER_DETAIL_STATE, src: TRANSACTION.TRANSACTION_SALESORDER_DETAIL_STATE, viewsrc: 'details', isDisabled: false },
        { id: 1, title: TRANSACTION.TRANSACTION_SALESORDER_DOCUMENT_LABEL, state: TRANSACTION.TRANSACTION_SALESORDER_DOCUMENT_STATE, src: TRANSACTION.TRANSACTION_SALESORDER_DOCUMENT_STATE, viewsrc: 'documents', isDisabled: vm.salesOrderID ? false : true },
        { id: 2, title: TRANSACTION.TRANSACTION_SALESORDER_MISC_LABEL, state: TRANSACTION.TRANSACTION_SALESORDER_MISC_STATE, src: TRANSACTION.TRANSACTION_SALESORDER_MISC_STATE, viewsrc: 'misc', isDisabled: vm.salesOrderID ? false : true }
      ];
    };

    vm.onTabChanges = (item) => {
      const Params = { sID: vm.salesOrderID };
      vm.title = item.title;
      $state.go(item.src, Params);
    };

    //go back to list page
    vm.goBack = () => {
      BaseService.setLatestLoginUserLocalStorageDet();

      if ((vm.frmSalesOrder && (vm.frmSalesOrder.$dirty && vm.frmSalesOrder.$invalid))) {
        vm.isChanged = true;
      }
      if (BaseService.checkFormDirty(vm.frmSalesOrder) || vm.isChanged) {
        showWithoutSavingAlertforGoback();
      }
      else {
        $state.go(TRANSACTION.TRANSACTION_SALESORDER_STATE);
      }
    };

    //get all packing slip number details
    const getSalesOrderMstDbList = (searchObj) => SalesOrderFactory.getSalesOrderMstNumber().query(searchObj).$promise.
      then((soNumberComp) => {
        if (soNumberComp && soNumberComp.data) {
          if (searchObj.soID) {
            $timeout(() => {
              if (vm.autoCompleteSalesOrder && vm.autoCompleteSalesOrder.inputName) {
                $scope.$broadcast(vm.autoCompleteSalesOrder.inputName, soNumberComp.data[0]);
              }
            });
          }
          return soNumberComp.data;
        }
        else {
          return [];
        }
      }).catch((error) => BaseService.getErrorLog(error));


    const selectSONumber = (item) => {
      if (item) {
        vm.soNumber = item.salesOrderNumber;
        vm.poNumber = item.poNumber;
        vm.customerCode = item.mfgCode;
        vm.customerID = item.customerID;
        vm.customerName = stringFormat('({0}) {1}', item.mfgCode, item.mfgName);
        if (item.id !== vm.salesOrderID) {
          if ((vm.frmSalesOrder && (vm.frmSalesOrder.$dirty && vm.frmSalesOrder.$invalid))) {
            showWithoutSavingAlertforGoback(item);
          } else {
            vm.salesOrderID = item.id;
            $state.go(TRANSACTION.TRANSACTION_SALESORDER_DETAIL_STATE, { sID: item.id }, { reload: true, inherit: false});
          }
        }
        $timeout(() => {
          $scope.$broadcast(vm.autoCompleteSalesOrder.inputName, null);
        }, true);
      }
    };
    vm.autoCompleteSalesOrder = {
      columnName: 'salescolumn',
      keyColumnName: 'id',
      keyColumnId: null,
      inputName: 'SO#',
      placeholderName: 'SO#',
      isRequired: false,
      callbackFn: function (obj) {
        const searchObj = {
          soID: obj.id,
          searchString: null
        };
        return getSalesOrderMstDbList(searchObj);
      },
      onSelectCallbackFn: selectSONumber,
      onSearchFn: function (query) {
        const searchObj = {
          soID: null,
          searchString: query
        };
        return getSalesOrderMstDbList(searchObj);
      }
    };
    //add new sales Order
    vm.addSalesorder = (openInSameTab) => {
      const tabObj = { openInSameTab: openInSameTab };
      var isDirty = (vm.frmSalesOrder ? vm.frmSalesOrder.$dirty : false) || (vm.salesOrderDetForm ? vm.salesOrderDetForm.$dirty : false);
      if (tabObj && tabObj.openInSameTab && isDirty) {
        return showWithoutSavingAlertforGoback({ id: 0 });
      }
      else {
        checkSalesOrder(tabObj);
      }
    };
    //check sales order
    const checkSalesOrder = (tabObj) => {
      if (tabObj && tabObj.openInSameTab) {
        vm.salesOrderID = 0;
        if (vm.autoCompleteSalesOrder) { $scope.$broadcast(vm.autoCompleteSalesOrder.inputName, null); }
        vm.soNumber = null;
        vm.customerID = null;
        vm.customerCode = null;
        vm.customerName = null;
        vm.poNumber = null;
        vm.soDate = null;
        vm.poDate = null;
        vm.activeTab = 0;
        vm.title = vm.tabList[0].title;
        vm.tabList[1].isDisabled = true;
        vm.tabList[2].isDisabled = true;
      }
      BaseService.goToManageSalesOrder(0, tabObj);
    };
    /*
    * Author : Champak
    * Purpose :Show save alert popup on go back
    */
    function showWithoutSavingAlertforGoback(item) {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          if (vm.frmSalesOrder) {
            vm.frmSalesOrder.$setPristine();
          }
          BaseService.currentPageForms = [];
          BaseService.currentPageFlagForm = [];
          if (!item) {
            $state.go(TRANSACTION.TRANSACTION_SALESORDER_STATE);
          }
          else {
            vm.salesOrderID = item.id;
            vm.salesOrderID = item.refSalesOrderID || 0;
            if (!item.id) {
              if (vm.autoCompleteSalesOrder) { $scope.$broadcast(vm.autoCompleteSalesOrder.inputName, null); }
              vm.soNumber = null;
              vm.customerCode = null;
              vm.customerID = null;
              vm.customerName = null;
              vm.poNumber = null;
              vm.soDate = null;
              vm.poDate = null;
              vm.activeTab = 0;
              vm.title = vm.tabList[0].title;
              vm.tabList[1].isDisabled = true;
              vm.tabList[2].isDisabled = true;
            }
            // $state.transitionTo($state.$current, { id: resp.data.insertedRefundMstID }, { location: true, inherit: true, notify: false });
            $state.go(TRANSACTION.TRANSACTION_SALESORDER_DETAIL_STATE, { sID: item.id }, { reload: true, inherit: false });
          }
        }
      }, () => {
        if (item && vm.salesOrderID === 0) { $scope.$broadcast(vm.autoCompleteSalesOrder.inputName, null); }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    /* fun to check form dirty on tab change */
    vm.isStepValid = function () {
      var isDirty = (vm.frmSalesOrder ? vm.frmSalesOrder.$dirty : false) || (vm.salesOrderDetForm ? vm.salesOrderDetForm.$dirty : false);
      if (isDirty) {
        return showWithoutSavingAlertforTabChange();
      } else {
        return true;
      }
    };
    vm.getSalesStatus = (statusID) => BaseService.getWoStatus(statusID);
    vm.getWoStatusClassName = (statusID) => BaseService.getWoStatusClassName(statusID);
    /* Show save alert popup when performing tab change*/
    function showWithoutSavingAlertforTabChange() {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      return DialogFactory.messageConfirmDialog(obj).then(() => {
        if (vm.frmSalesOrder) {
          vm.frmSalesOrder.$setPristine();
        }
        if (vm.salesOrderDetForm) {
          vm.salesOrderDetForm.$setPristine();
        }
        return true;
      }, () => 1).catch((error) => BaseService.getErrorLog(error));
    }

    const getDataKey = () => SalesOrderFactory.getDataKey().query().$promise.then((dataKey) => {
      if (dataKey) {
        vm.dataKey = dataKey.data;
      }
    }).catch((error) => BaseService.getErrorLog(error));
    getDataKey();

    //print sales order report
    vm.printRecord = (isDownload) => {
      let dataKeyvalue;
      _.each(vm.dataKey, (item) => {
        if (item.key === CONFIGURATION.SETTING.TermsAndCondition) {
          return dataKeyvalue = item.values;
        }
      });
      if (vm.sourceData && (vm.sourceData.length === 0)) {
        const obj = {
          multiple: true,
          messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SALES_ORDER_REPORT_GENERATE)
        };
        DialogFactory.messageAlertDialog(obj);
        return;
      } else {
        if (isDownload) {
          vm.isDownloadDisabled = true;
        } else {
          vm.isPrintDisable = true;
        }
        const salesOrderReportDetails = {
          id: vm.salesOrderID,
          termsAndCondition: dataKeyvalue,
          SOData: {
            soNumber: vm.soNumber,
            revision: vm.revision,
            customerCode: vm.customerCode,
            statusName: CORE.WOSTATUS.DRAFT === parseInt(vm.status) ? `-${vm.getSalesStatus(vm.status).toUpperCase()}` : ''
          }
        };
        SalesOrderFactory.salesOrderReport(salesOrderReportDetails).then((response) => {
          const SOData = response.config.data.SOData;
          if (isDownload) {
            vm.isDownloadDisabled = false;
          } else {
            vm.isPrintDisable = false;
          }
          BaseService.downloadReport(response, stringFormat('{0}-{1}-{2}-{3}{4}', CORE.REPORT_SUFFIX.SALES_ORDER, SOData.soNumber, SOData.revision, SOData.customerCode, SOData.statusName), isDownload, true);
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    //check disable
    vm.checkDisable = (state) => {
      if (vm.tabList[0].state !== state && !vm.salesOrderID) {
        return false;
      }
      if (BaseService.loginUserPageList && BaseService.loginUserPageList.length > 0) {
        const tab = _.filter(BaseService.loginUserPageList, (a) => a.PageDetails && a.PageDetails.pageRoute === state);
        if (tab && tab.length > 0 && tab[0].isActive) {
          return true;
        } else { return false; };
      } else { return true; }
    };

    const getSalesOrderHeaderWorkingStatus = () => {
      vm.cgBusyLoading = SalesOrderFactory.getSalesOrderHeaderWorkingStatus().query({ id: vm.salesOrderID }).$promise.then((res) => {
        if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          vm.salesOrderWorkStatus = res.data.SOWorkingStatus[0];
          if (vm.salesOrderWorkStatus === CORE.SalesOrderDetStatus.INPROGRESS) {
            vm.salesOrderWorkStatusText = CORE.SalesOrderDetStatusText.INPROGRESS;
          } else if (vm.salesOrderWorkStatus === CORE.SalesOrderDetStatus.CANCELED) {
            vm.salesOrderWorkStatusText = CORE.SalesOrderDetStatusText.CANCELED;
          } else {
            vm.salesOrderWorkStatusText = CORE.SalesOrderDetStatusText.COMPLETED;
          }
          if (vm.salesOrderWorkStatus === CORE.SalesOrderDetStatus.COMPLETED || vm.salesOrderWorkStatus === CORE.SalesOrderDetStatus.CANCELED) {
            vm.isDisable = true;
          } else { vm.isDisable = false; }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    getSalesOrderHeaderWorkingStatus();
    const bindAutoComplete = $scope.$on('SalesOrderAutocomplete', () => {
      const searchObj = {
        soID: vm.salesOrderID,
        searchString: null
      };
      getSalesOrderMstDbList(searchObj);
      getSalesOrderHeaderWorkingStatus();
    });
    $scope.$on('$destroy', () => {
      bindAutoComplete();
      bindDocuments();
    });
    // get salesorder document count
    const getSalesOrderDocumentCount = () => {
      if (vm.salesOrderID) {
        vm.cgBusyLoading = PackingSlipFactory.getPackingSlipDocumentCount().query({
          id: vm.salesOrderID,
          type: CORE.AllEntityIDS.SalesOrder.Name
        }).$promise.then((response) => {
          vm.documentCount = response.data;
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.documentCount = 0;
      }
    };
    getSalesOrderDocumentCount();
    // go to sales order list
    vm.goToSalesOrder = () => {
      BaseService.goToSalesOrderList();
    };
    // go to customer list page
    vm.goTocustomerList = () => {
      BaseService.goToCustomerList();
    };
    // go to customer detail
    vm.goTocustomerDetail = () => {
      BaseService.goToCustomer(vm.customerID);
    };
    const searchObj = {
      soID: vm.salesOrderID,
      searchString: null
    };
    getSalesOrderMstDbList(searchObj);
    //on for document
    const bindDocuments = $scope.$on('documentCount', () => {
      getSalesOrderDocumentCount();
    });

    vm.salesCommissionDetail = () => {
      BaseService.exportSalesCommissionDetail(vm.salesOrderID, null, true, vm.soNumber, null);
    };
    // open popup for duplicate sales order
    vm.createDuplicateSO = (event) => {
      vm.isDuplicateSObtnDisabled = true;
      vm.checkPartStatusOfSalesOrder().then((response) => {
        if (response && response.mfgParts && response.mfgParts.partStatus === CORE.PartStatusList.InActiveInternal) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.SO_CONTAINST_INACTIVE_PART);
          messageContent.message = stringFormat(messageContent.message, vm.redirectToSOAnchorTag(vm.salesOrderID, vm.soNumber));
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.openDuplicateSOpopup(event, true);
            }
          }, () => vm.isDuplicateSObtnDisabled = false)
            .catch((error) => BaseService.getErrorLog(error));
        } else {
          vm.openDuplicateSOpopup(event);
        }
      });
    };
    vm.openDuplicateSOpopup = (event, IsUserAwareOfPartStatus) => {
      const data = {
        salesID: vm.salesOrderID,
        status: parseInt(vm.status) ? CORE.PO_WORKING_STATUS.PUBLISH : CORE.PO_WORKING_STATUS.DRAFT,
        IsUserAwareOfPartStatus: IsUserAwareOfPartStatus,
        soNumber: vm.soNumber,
        companyName: vm.customerName
      };
      DialogFactory.dialogService(
        TRANSACTION.DUPLICATE_SO_POPUP_CONTROLLER,
        TRANSACTION.DUPLICATE_SO_POPUP_VIEW,
        event,
        data).then(() => {
        }, (res) => {
            vm.isDuplicateSObtnDisabled = false;
            if (res) {
            BaseService.goToManageSalesOrder(res.id, false);
          }
        }, (err) => BaseService.getErrorLog(err));
    };
  }
})();
