(function () {
  'use strict';

  angular
    .module('app.transaction.customerinvoice')
    .controller('ManageCustomerInvoiceMainController', ManageCustomerInvoiceMainController);

  /** @ngInject */
  function ManageCustomerInvoiceMainController($filter, $state, TRANSACTION, BaseService, CORE, CustomerPackingSlipFactory, DialogFactory, $scope, $timeout, SalesOrderFactory, CONFIGURATION, $q) {
    const vm = this;
    vm.transType = $state.params.transType;
    vm.packingId = parseInt($state.params.id);
    vm.CORE = CORE;
    vm.packingSlipStatus = vm.transType === vm.CORE.TRANSACTION_TYPE.INVOICE ? vm.CORE.Customer_Invoice_SubStatus : vm.CORE.Customer_CrMemo_SubStatus;
    // vm.label = CORE.OPSTATUSLABLELOCK;
    vm.lableConstant = CORE.LabelConstant;
    vm.packingSlipMainObj = {};
    vm.status = vm.CORE.CUSTINVOICE_STATUS.DRAFT;
    vm.subStatus = (vm.transType === vm.CORE.TRANSACTION_TYPE.INVOICE) ? vm.CORE.CUSTINVOICE_SUBSTATUS.DRAFT : vm.CORE.CUSTCRNOTE_STATUS.DRAFT;
    vm.loginUser = BaseService.loginUser;
    vm.packinSlipType = 0;
    vm.isPrintDisable = false;
    vm.isDownloadDisabled = false;
    vm.custCreditNoteStatusConst = vm.CORE.CUSTCRNOTE_STATUS;
    vm.historyactionButtonName = (vm.transType === vm.CORE.TRANSACTION_TYPE.INVOICE) ? vm.CORE.LabelConstant.CustomerPackingInvoice.HistoryButtonName : vm.CORE.LabelConstant.CustomerCreditMemo.HistoryButtonName;

    //get customer invoice document data
    const getInvoiceDocumentCount = () => CustomerPackingSlipFactory.getInvoiceDocumentCount().query({ invoiceId: $state.params.id }).$promise.then((res) => {
      if (res && res.data && res.data.length) {
        vm.packingSlipType = res.data[0].packingSlipType;
        vm.invoiceDocumentCount = res.data[0].invoiceDocumentCount ? res.data[0].invoiceDocumentCount : 0;
        vm.packingslipDocumentCount = res.data[0].packingslipDocumentCount ? res.data[0].packingslipDocumentCount : 0;
      }
      return $q.resolve(res.data[0]);
    }).catch((error) => BaseService.getErrorLog(error));

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
        if (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) {
          $state.go(TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_DETAIL_STATE, { id: vm.packingId });
        } else if (vm.transType === CORE.TRANSACTION_TYPE.CREDITNOTE) {
          $state.go(TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_DETAIL_STATE, { id: vm.packingId });
        }
      }
    }

    // get document count and initialize tabs
    vm.cgBusyLoading = $q.all([getInvoiceDocumentCount()]).then(() => {
      active();
      if (vm.packingId) {
        getCustomerPackingSlipDetail();
      }
      const searchobj = {
        transType: vm.transType
      };
      getPackingSlipNumberDetails(searchobj);
      ///}
    }).catch((error) => BaseService.getErrorLog(error));


    function tablist() {
      if (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) {
        vm.tabList = [
          { id: 0, title: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_DETAIL_LABEL, state: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_DETAIL_STATE, src: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_DETAIL_STATE, viewsrc: 'details', isDisabled: false },
          { id: 1, title: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_DOCUMENT_LABEL, state: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_DOCUMENT_STATE, src: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_DOCUMENT_STATE, viewsrc: 'documents', isDisabled: vm.packingId ? false : true, documentCount: vm.invoiceDocumentCount }
        ];
        if (vm.packingSlipType !== 3) {
          vm.tabList.push({ id: 2, title: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_PACKINGSLIP_DOCUMENT_LABEL, state: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_PACKINGSLIP_DOCUMENT_STATE, src: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_PACKINGSLIP_DOCUMENT_STATE, viewsrc: 'packingdocument', isDisabled: vm.packingId ? false : true, documentCount: vm.packingslipDocumentCount });
        }
        vm.tabList.push({ id: 3, title: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_MISC_LABEL, state: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_MISC_STATE, src: TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_MISC_STATE, viewsrc: 'misc', isDisabled: vm.packingId ? false : true });
      } else if (vm.transType === CORE.TRANSACTION_TYPE.CREDITNOTE) {
        vm.tabList = [
          { id: 0, title: TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_DETAIL_LABEL, state: TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_DETAIL_STATE, src: TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_DETAIL_STATE, viewsrc: 'details', isDisabled: false },
          { id: 1, title: TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_DOCUMENT_LABEL, state: TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_DOCUMENT_STATE, src: TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_DOCUMENT_STATE, viewsrc: 'documents', isDisabled: vm.packingId ? false : true, documentCount: vm.invoiceDocumentCount }
          // { id: 2, title: TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_MISC_LABEL, state: TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_MISC_STATE, src: TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_MISC_STATE, viewsrc: 'misc', isDisabled: vm.packingId ? false : true, documentCount: null }
        ];
      }
    }

    vm.onTabChanges = (item) => {
      const Params = { transType: vm.transType, id: vm.packingId };
      vm.title = item.title;
      if (vm.packingId) {
        $state.go(item.src, Params);
      }
    };

    $scope.$on('documentCount', () => {
      $q.all([getInvoiceDocumentCount()]).then(() => {
        vm.tabList[1].documentCount = vm.invoiceDocumentCount;
        if (vm.transType === CORE.TRANSACTION_TYPE.INVOICE && vm.packingSlipType !== 3) {
          vm.tabList[2].documentCount = vm.packingslipDocumentCount;
        }
      });
    });

    //go back to list page
    vm.goBack = () => {
      BaseService.setLatestLoginUserLocalStorageDet();

      if ((vm.frmCustomerInvoice && (vm.frmCustomerInvoice.$dirty && vm.frmCustomerInvoice.$invalid))) {
        vm.isChanged = true;
      }
      if (BaseService.checkFormDirty(vm.frmCustomerInvoice) || vm.isChanged) {
        showWithoutSavingAlertforGoback();
      }
      else {
        if (vm.transType === vm.CORE.TRANSACTION_TYPE.INVOICE) {
          $state.go(TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_STATE);
        } else if (vm.transType === vm.CORE.TRANSACTION_TYPE.CREDITNOTE) {
          $state.go(TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_STATE);
        }
      }
    };
    //get customer invoice status class
    vm.getPackingSlipStatusClassName = (statusID) => BaseService.getCustInvStatusClassName(statusID, vm.transType);

    //get customer credit memo status class
    vm.getCrMemoStatusClassName = (statusID) => BaseService.getCustInvStatusClassName(statusID);

    //get customer invoice slip status
    vm.getCustomerInvoiceStatus = (statusID) => {
      const status = _.find(CORE.Customer_Invoice_SubStatus, (InvoiceStatus) => InvoiceStatus.ID === statusID);
      if (status) {
        return status.Name;
      }
    };

    //get customer credit memo status
    vm.getCustomerCreditMemoStatus = (statusID) => {
      const status = _.find(CORE.Customer_CrMemo_SubStatus, (dtlStatus) => dtlStatus.ID === statusID);
      if (status) {
        return status.Name;
      }
    };

    //get customer packing slip detail
    const getCustomerPackingSlipDetail = () => CustomerPackingSlipFactory.getPackingSlipDetailByID().query({ id: $state.params.id, transType: vm.transType }).$promise.then((res) => {
      if (res && res.data) {
        vm.status = res.data.status;
        vm.subStatus = res.data.subStatus;
        vm.packingSlipNumber = (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) ? res.data.invoiceNumber : res.data.creditMemoNumber;
        vm.custCode = res.data.mfgCodeMst.mfgCode;
        vm.poType = res.data.poType;
      }
    }).catch((error) => BaseService.getErrorLog(error));


    //get all packing slip number details
    const getPackingSlipNumberDetails = (searchObj) => CustomerPackingSlipFactory.getPackingSlipDetails().query(searchObj).$promise.then((res) => {
      if (res && res.data) {
        if (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) {
          _.each(res.data, (det) => {
            det.inputColumnText = stringFormat('{0} | {1}  {2}  {3} | {4}', det.invoiceNumber, det.packingSlipNumber, det.soNumber ? `| ${det.soNumber}` : '|  ', det.poNumber ? `|  ${det.poNumber}` : '|  ', det.customerFormatedName);
          });
        } else {
          _.each(res.data, (det) => {
            det.inputColumnText = stringFormat('{0} {1} | {3}', det.creditMemoNumber, det.poNumber ? `| ${det.poNumber}` : '|  ', det.customerFormatedName);
          });
        }
        if (!vm.autoCompletePackingSlip) { initAutocomplete(); }
        return res.data;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    //if (vm.packingId && vm.activeTab !== 0) {
    //  getCustomerPackingSlipDetail();
    //} else {
    //  getPackingSlipNumberDetails();
    //}

    const initAutocomplete = () => {
      vm.autoCompletePackingSlip = {
        columnName: 'inputColumnText',
        keyColumnName: 'id',
        keyColumnId: vm.packingId ? vm.packingId : null,
        inputName: vm.transType === 'I' ? 'Invoice#' : 'Credit Memo#',
        placeholderName: vm.transType === 'I' ? 'Invoice#' : 'Credit Memo#',
        isRequired: false,
        isAddnew: false,
        onSearchFn: function (query) {
          const searchobj = {
            transType: vm.transType,
            searchQuery: query
          };
          return getPackingSlipNumberDetails(searchobj);
        },
        onSelectCallbackFn: selectPackingSlip
      };
    };
    const selectPackingSlip = (item) => {
      if (item) {
        vm.packingSlipNumber = (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) ? item.invoiceNumber : item.creditMemoNumber;
        vm.custCode = item.mfgCode;
        if (item.id !== vm.packingId) {
          if ((vm.frmCustomerInvoice && (vm.frmCustomerInvoice.$dirty && vm.frmCustomerInvoice.$invalid))) {
            showWithoutSavingAlertforGoback(item);
          } else {
            vm.packingId = item.id;
            // tablist();
            // getInvoiceDocumentCount();
            if (vm.transType === 'I') {
              $state.transitionTo(TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_DETAIL_STATE, { transType: vm.transType, id: item.id }, { reload: true });
            } else {
              $state.transitionTo(TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_DETAIL_STATE, { transType: vm.transType, id: item.id }, { reload: true });
            }
          }
        }
        //$timeout(() => {
        //  vm.autoCompletePackingSlip.keyColumnId = null;
        //}, true);
      }
    };

    //add new customer invoice/credit memo
    vm.addcustomerInvoice = (openInSameTab) => {
      const tabObj = { openInSameTab: openInSameTab };
      var isDirty = (vm.frmCustomerInvoice ? vm.frmCustomerInvoice.$dirty : false) || (vm.invoiceDetailForm ? vm.invoiceDetailForm.$dirty : false);
      if (tabObj && tabObj.openInSameTab && isDirty) {
        return showWithoutSavingAlertforGoback({ id: 0, refSalesOrderID: 0 });
      }
      else {
        checkCustomerPackingSlip(tabObj);
      }
    };
    //check customer packing slip
    const checkCustomerPackingSlip = (tabObj) => {
      if (tabObj && tabObj.openInSameTab) {
        vm.packingId = 0;
        if (vm.autoCompletePackingSlip) { vm.autoCompletePackingSlip.keyColumnId = null; }
        vm.packingSlipType = 0;
        // tablist();
        vm.packingSlipMainObj.packingSlipNumber = null;
        vm.packingSlipNumber = null;
        vm.custCode = null;
        vm.activeTab = 0;
        vm.title = vm.tabList[0].title;
        // vm.tabList[1].isDisabled = true;
        vm.tabList[1].documentCount = 0;
      }
      if (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) {
        BaseService.goToManageCustomerInvoice(0, tabObj);
      } else {
        BaseService.goToCustomerCreditMemoDetail(0, tabObj);
      }
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
          if (vm.frmCustomerInvoice) {
            vm.frmCustomerInvoice.$setPristine();
          }
          BaseService.currentPageForms = [];
          BaseService.currentPageFlagForm = [];
          if (!item) {
            $state.go(TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_STATE);
          }
          else {
            vm.packingId = item.id;
            if (!item.id) {
              if (vm.autoCompletePackingSlip) { vm.autoCompletePackingSlip.keyColumnId = null; }
              vm.packingSlipNumber = null;
              vm.custCode = null;
              vm.activeTab = 0;
              vm.title = vm.tabList[0].title;
              vm.tabList[1].isDisabled = true;
              if (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) {
                vm.tabList[2].isDisabled = true;
              }
            }
            vm.autoCompletePackingSlip.keyColumnId = null;
            //tablist();
            if (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) {
              $state.transitionTo(TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_DETAIL_STATE, { transType: vm.transType, id: item.id }, { reload: true });
            } else {
              $state.transitionTo(TRANSACTION.TRANSACTION_CUSTOMER_CREDIT_NOTE_DETAIL_STATE, { transType: vm.transType, id: 0 }, { reload: true });
            }
          }
        }
      }, () => {
        if (item && vm.packingId === 0) { vm.autoCompletePackingSlip.keyColumnId = null; }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    /* fun to check form dirty on tab change */
    vm.isStepValid = function () {
      var isDirty = (vm.frmCustomerInvoice ? vm.frmCustomerInvoice.$dirty : false) || (vm.invoiceDetailForm ? vm.invoiceDetailForm.$dirty : false);
      if (isDirty) {
        return showWithoutSavingAlertforTabChange();
      } else {
        return true;
      }
    };

    /* Show save alert popup when performing tab change*/
    function showWithoutSavingAlertforTabChange() {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      return DialogFactory.messageConfirmDialog(obj).then(() => {
        if (vm.frmCustomerInvoice) {
          vm.frmCustomerInvoice.$setPristine();
        }
        if (vm.invoiceDetailForm) {
          vm.invoiceDetailForm.$setPristine();
        }
        return true;
      }, () => 1).catch((error) => BaseService.getErrorLog(error));
    }

    // Get Term and Condition from Data key for invoice report
    const getDataKey = () => SalesOrderFactory.getDataKey().query().$promise.then((dataKey) => {
      if (dataKey) {
        vm.dataKey = dataKey.data;
      }
    }).catch((error) => BaseService.getErrorLog(error));
    getDataKey();

    //print Customer Invoice report/ Credit Memo Report
    vm.printRecord = (isDownload) => {
      if (isDownload) {
        vm.isDownloadDisabled = true;
      } else {
        vm.isPrintDisable = true;
      }
      let dataKeyvalue;
      _.each(vm.dataKey, (item) => {
        if (item.key === CONFIGURATION.SETTING.TermsAndCondition) {
          return dataKeyvalue = item.values;
        }
      });
      const reportDetails = {
        id: vm.packingId,
        termsAndCondition: dataKeyvalue, //As per discussion with DP sir no need to show for invoice report but we need to get for future backup
        invoiceDisclaimer: CORE.Invoice_Report_Disclaimer,
        custData: {
          packingSlipNumber: vm.packingSlipNumber,
          revision: vm.packingSlipMainObj.revision,
          custCode: vm.custCode,
          statusName: CORE.CustCrNoteStatusGridHeaderDropdown[1].id === vm.subStatus ? `-${vm.getCustomerCreditMemoStatus(vm.subStatus).toUpperCase()}` : ''
        }
      };
      if (vm.transType === vm.CORE.TRANSACTION_TYPE.CREDITNOTE) {
        CustomerPackingSlipFactory.getCustomerCreditMemoReportDetails(reportDetails).then((response) => {
          const custData = response.config.data.custData;
          if (isDownload) {
            vm.isDownloadDisabled = false;
          } else {
            vm.isPrintDisable = false;
          }
          BaseService.downloadReport(response, stringFormat('{0}-{1}-{2}-{3}{4}', CORE.REPORT_SUFFIX.CUSTOMER_CREDIT_MEMO, custData.packingSlipNumber, custData.revision, custData.custCode, custData.statusName), isDownload, true);
        }).catch((error) => BaseService.getErrorLog(error));
      } else if (vm.transType === vm.CORE.TRANSACTION_TYPE.INVOICE) {
        CustomerPackingSlipFactory.getCustomerInvoiceReportDetails(reportDetails).then((response) => {
          const custData = response.config.data.custData;
          if (isDownload) {
            vm.isDownloadDisabled = false;
          } else {
            vm.isPrintDisable = false;
          }
          BaseService.downloadReport(response, stringFormat('{0}-{1}-{2}-{3}{4}', CORE.REPORT_SUFFIX.CUSTOMER_INVOICE, custData.packingSlipNumber, custData.revision, custData.custCode, custData.statusName), isDownload, true);
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };


    //check disable
    vm.checkDisable = (state) => {
      if (BaseService.loginUserPageList && BaseService.loginUserPageList.length > 0) {
        const tab = _.filter(BaseService.loginUserPageList, (a) => a.PageDetails && a.PageDetails.pageRoute === state);
        if (tab && tab.length > 0 && tab[0].isActive) {
          return true;
        } else { return false; };
      } else { return true; }
    };

    const bindAutoComplete = $scope.$on('CustomerPackingAutocomplete', () => {
      const searchobj = {
        transType: vm.transType
      };
      getPackingSlipNumberDetails(searchobj);
    });

    // get class for Sale Order type
    vm.getPOTypeClassName = (classText) => {
      const poType = _.find(CORE.POType, (item) => item.Name === classText);
      return poType ? poType.ClassName : '';
    };

    // goTo Packing Slip  List
    vm.goToPackingSlipList = () => {
      BaseService.goToCustomerPackingSlipList();
    };
    // goTo Packing Slip  Detail
    vm.goToPackingSlipDetails = () => {
      if (vm.packingSlipMainObj.packingSlipID) {
        BaseService.goToManageCustomerPackingSlip(vm.packingSlipMainObj.packingSlipID, vm.packingSlipMainObj.refSalesOrderId || 0);
      }
    };
    //go to manage customer
    vm.goToManageCustomer = () => {
      BaseService.goToCustomer(vm.packingSlipMainObj.customerId);
    };
    //go to customer list page
    vm.goToCustomerList = () => {
      BaseService.goToCustomerList();
    };
    vm.goToSalesOrderList = () => {
      BaseService.goToSalesOrderList();
    };
    // Go to customer invoice list
    vm.goToCustomerInvoiceList = () => {
      BaseService.goToCustomerInvoiceList();
    };
    //go to customer credit memo list page
    vm.goToCustomerCreditMemoList = () => {
      BaseService.goToCustomerCreditMemoList();
    };
    // Go to customer sales order manage page
    vm.goToManageSalesOrder = () => {
      if (vm.packingSlipMainObj.refSalesOrderId) {
        BaseService.goToManageSalesOrder(vm.packingSlipMainObj.refSalesOrderId);
      }
    };

    // set class for material staus
    vm.getMaterialStatusClass = () => {
      if (vm.packingSlipMainObj.packingSlipSubStatus === 5 && vm.subStatus === 4) {
        return 'label-warning';
      } else {
        return 'label-primary';
      }
    };

    //page load then it will add forms in page forms
    //angular.element(document).ready(() => {
    //  tablist();
    //});
    vm.goToAddPackingSlip = () => {
      BaseService.goToManageCustomerPackingSlip(0, 0);
    };

    // move at apply customer credit memo detail page
    vm.applyCustomerCreditMemo = () => {
      $state.go(TRANSACTION.TRANSACTION_APPLY_CUST_CREDIT_MEMO_TO_INV_MANAGE_DET_STATE, { ccmid: vm.packingId, pid: null });
    };
    vm.exportSalesCommission = () => {
      BaseService.exportSalesCommissionDetail(vm.packingId, null, false, vm.packingSlipNumber, null);
    };

    /* to get/apply class for customer credit memo refund status */
    vm.getCustCreditMemoRefundStatusClassName = (refundStatus) => BaseService.getCustCreditMemoRefundStatusClassName(refundStatus);

    $scope.$on('$destroy', () => {
      bindAutoComplete();
    });
  }
})();
