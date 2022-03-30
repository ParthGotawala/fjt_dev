(function () {
  'use strict';

  angular
    .module('app.transaction.customerpacking')
    .controller('ManageCustomerPackingSlipMainController', ManageCustomerPackingSlipMainController);

  /** @ngInject */
  function ManageCustomerPackingSlipMainController($filter, $state, TRANSACTION, BaseService, CORE, CustomerPackingSlipFactory, DialogFactory, $scope, $timeout, CONFIGURATION, SalesOrderFactory, $q, DYNAMIC_REPORTS, ReportMasterFactory) {
    const vm = this;
    vm.packingId = parseInt($state.params.id);
    vm.salesOrderID = parseInt($state.params.sdetid);
    vm.packingSlipStatus = _.filter(CORE.CustomerPackingSlipStatus);
    vm.refCustInvoiceID = null;
    vm.shippedStatus = CORE.CustomerPackingSlipSubStatusID.Shipped;
    vm.loginUser = BaseService.loginUser;
    vm.isPrintDisable = false;
    vm.isDownloadDisabled = false;
    vm.transType = CORE.TRANSACTION_TYPE.PACKINGSLIP;
    vm.historyactionButtonName = CORE.LabelConstant.CustomerPackingSlip.HistoryButtonName;
    vm.entityId = CORE.AllEntityIDS.Customer_PackingSlip.ID;
    vm.entityName = CORE.AllEntityIDS.Customer_PackingSlip.Name;
    vm.userId = vm.loginUser.userid;
    vm.roleId = vm.loginUser.defaultLoginRoleID;
    vm.LabelConstant = CORE.LabelConstant;
    // reset header detail
    const resetHeaderDetail = () => {
      vm.customerName = '';
      vm.customerID = 0;
      vm.soNumber = '';
      vm.soID = 0;
      vm.poNumber = '';
      vm.invoiceNumber = '';
    };
    resetHeaderDetail();
    //vm.label = CORE.OPSTATUSLABLEPUBLISH;
    // active();
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
        $state.go(TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_DETAIL_STATE, { sdetid: vm.salesOrderID, id: vm.packingId });
      }
    }

    //get customer packing slip document count
    const getPackingSlipDocumentCount = () => CustomerPackingSlipFactory.getCustomerPackingSlipDocumentCount().query({ packingSlipId: $state.params.id }).$promise.then((res) => {
      if (res && res.data && res.data.length) {
        vm.packingslipDocumentCount = res.data[0].packingslipDocumentCount ? res.data[0].packingslipDocumentCount : 0;
      }
      return $q.resolve(res.data[0]);
    }).catch((error) => BaseService.getErrorLog(error));

    $scope.$on('documentCount', () => {
      $q.all([getPackingSlipDocumentCount()]).then(() => {
        vm.tabList[1].documentCount = vm.packingslipDocumentCount;
      });
    });
    // get document count and initialize tabs
    vm.cgBusyLoading = $q.all([getPackingSlipDocumentCount()]).then(() => {
      active();
      if (vm.packingId) {
        getCustomerPackingSlipDetail();
      }
      const searchobj = {
        transType: vm.transType
      };
      getPackingSlipNumberDetails(searchobj);
      // }
    }).catch((error) => BaseService.getErrorLog(error));


    function tablist() {
      vm.tabList = [
        { id: 0, title: TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_DETAIL_LABEL, state: TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_DETAIL_STATE, src: TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_DETAIL_STATE, viewsrc: 'details', isDisabled: false },
        { id: 1, title: TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_DOCUMENT_LABEL, state: TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_DOCUMENT_STATE, src: TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_DOCUMENT_STATE, viewsrc: 'documents', isDisabled: vm.packingId ? false : true, documentCount: vm.packingslipDocumentCount },
        { id: 2, title: TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_MISC_LABEL, state: TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_MISC_STATE, src: TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_MISC_STATE, viewsrc: 'misc', isDisabled: vm.packingId ? false : true }
      ];
    };

    vm.onTabChanges = (item) => {
      const Params = { id: vm.packingId, sdetid: vm.salesOrderID };
      vm.title = item.title;
      $state.go(item.src, Params);
    };

    //go back to list page
    vm.goBack = () => {
      BaseService.setLatestLoginUserLocalStorageDet();

      if ((vm.frmCustomerPackingSlip && (vm.frmCustomerPackingSlip.$dirty && vm.frmCustomerPackingSlip.$invalid))) {
        vm.isChanged = true;
      }
      if (BaseService.checkFormDirty(vm.frmCustomerPackingSlip) || vm.isChanged) {
        showWithoutSavingAlertforGoback();
      }
      else {
        $state.go(TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_STATE);
      }
    };
    //get customer packing slip status class
    vm.getPackingSlipStatusClassName = (statusID) => BaseService.getCustomerPackingSlipStatusClassName(statusID);
    //get customer packing slip status
    vm.getCustomerPackingSlipStatus = (statusID) => BaseService.getCustomerPackingSlipStatus(statusID);
    //get customer packing slip detail
    const getCustomerPackingSlipDetail = () => CustomerPackingSlipFactory.getPackingSlipDetailByID().query({ id: $state.params.id, transType: 'P' }).$promise.then((res) => {
      if (res && res.data) {
        vm.status = res.data.status;
        vm.subStatus = res.data.subStatus;
        vm.refCustInvoiceID = res.data.refCustInvoiceID;
        vm.packingSlip = res.data.packingSlipNumber;
        vm.custCode = res.data.mfgCodeMst.mfgCode;
        vm.packingSlipVersion = res.data.revision;
        vm.poType = res.data.poType;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    //get all packing slip number details
    const getPackingSlipNumberDetails = (searchobj) => CustomerPackingSlipFactory.getPackingSlipDetails().query(searchobj).$promise.then((res) => {
      if (res && res.data) {
        _.each(res.data, (det) => {
          det.inputColumnText = stringFormat('{0} {1} {2} | {3}', det.packingSlipNumber, det.soNumber ? `| ${det.soNumber}` : '|  ', det.poNumber ? `| ${det.poNumber}` : '|  ', det.customerFormatedName);
        });
        //vm.packingSlipList
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
        keyColumnId: null,
        inputName: 'Packing Slip#',
        placeholderName: 'Packing Slip#',
        isRequired: false,
        isAddnew: false,
        callbackFn: function (query) {
          const searchobj = {
            transType: vm.transType,
            searchQuery: query
          };
          return getPackingSlipNumberDetails(searchobj);
        },
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
        vm.packingSlip = item.packingSlipNumber;
        vm.custCode = item.mfgCode;
        if (item.id !== vm.packingId) {
          if ((vm.frmCustomerPackingSlip && (vm.frmCustomerPackingSlip.$dirty && vm.frmCustomerPackingSlip.$invalid))) {
            showWithoutSavingAlertforGoback(item);
          } else {
            vm.packingId = item.id;
            vm.salesOrderID = item.refSalesOrderID || 0;
            resetHeaderDetail();
            //tablist();
            $state.transitionTo(TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_DETAIL_STATE, { id: item.id, sdetid: item.refSalesOrderID || 0 }, { reload: true });
            // $state.transitionTo(TRANSACTION.TRANSACTION_CUSTOMER_INVOICE_DETAIL_STATE, { transType: vm.transType, id: item.id }, { reload: true });
          }
        }
        $timeout(() => {
          vm.autoCompletePackingSlip.keyColumnId = null;
        }, true);
      }
    };

    //add new customer packing
    vm.addcustomerPackingSlip = (openInSameTab) => {
      const tabObj = { openInSameTab: openInSameTab };
      var isDirty = (vm.frmCustomerPackingSlip ? vm.frmCustomerPackingSlip.$dirty : false) || (vm.customerPackingSlipDetForm ? vm.customerPackingSlipDetForm.$dirty : false);
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
        vm.packingSlip = null;
        vm.custCode = null;
        vm.packingSlipVersion = null;
        vm.activeTab = 0;
        vm.title = vm.tabList[0].title;
        vm.tabList[1].isDisabled = true;
        vm.tabList[2].isDisabled = true;
        resetHeaderDetail();
      }
      BaseService.goToManageCustomerPackingSlip(0, 0, tabObj);
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
          if (vm.frmCustomerPackingSlip) {
            vm.frmCustomerPackingSlip.$setPristine();
          }
          BaseService.currentPageForms = [];
          BaseService.currentPageFlagForm = [];
          if (!item) {
            $state.go(TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_STATE);
          }
          else {
            vm.packingId = item.id;
            vm.salesOrderID = item.refSalesOrderID || 0;
            if (!item.id) {
              if (vm.autoCompletePackingSlip) { vm.autoCompletePackingSlip.keyColumnId = null; }
              vm.packingSlip = null;
              vm.packingSlipVersion = null;
              vm.custCode = null;
              vm.activeTab = 0;
              vm.title = vm.tabList[0].title;
              vm.tabList[1].isDisabled = true;
              vm.tabList[2].isDisabled = true;
            }
            //tablist();
            resetHeaderDetail();
            $state.go(TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_DETAIL_STATE, { id: item.id, sdetid: item.refSalesOrderID || 0 }, {}, { reload: true });
          }
        }
      }, () => {
        if (item && vm.packingId === 0) { vm.autoCompletePackingSlip.keyColumnId = null; }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    /* fun to check form dirty on tab change */
    vm.isStepValid = function () {
      var isDirty = (vm.frmCustomerPackingSlip ? vm.frmCustomerPackingSlip.$dirty : false) || (vm.customerPackingSlipDetForm ? vm.customerPackingSlipDetForm.$dirty : false);
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
        if (vm.frmCustomerPackingSlip) {
          vm.frmCustomerPackingSlip.$setPristine();
        }
        if (vm.customerPackingSlipDetForm) {
          vm.customerPackingSlipDetForm.$setPristine();
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

    vm.goToManageCustomerPackingSlip = (parameterObj) => {
      if (parameterObj && parameterObj.customerslipId) {
        BaseService.goToManageCustomerPackingSlip(parameterObj.customerslipId, (parameterObj.refSalesOrderID || 0));
      }
    };

    // open Entity PopuP.
    vm.printRecordFromReportingTool = (isDownload) => {
      const reportName = stringFormat('{0}-{1}-{2}-{3}{4}', CORE.REPORT_SUFFIX.CUSTOMER_PACKINGSLIP, vm.packingSlip, vm.packingSlipVersion, vm.custCode, vm.packingSlipStatus[0].Name === vm.getCustomerPackingSlipStatus(vm.subStatus) ? `-${vm.packingSlipStatus[0].Name.toUpperCase()}` : '');
      if (isDownload) {
        vm.isDownloadDisabledReportingTool = true;
        const entityInfo = {
          entityId: vm.entityId
        };
        const promise = [getDefaultReportByEntity(entityInfo)];
        $q.all(promise).then(() => {
          if (vm.deafultEntityReport) {
            const parameterValueJson = stringFormat('{"{0}":"{1}"}', CORE.ReportParameterFilterDbColumnName.PackingSlipId, Number($state.params.id));
            const reportInfo = {
              id: vm.deafultEntityReport.id,
              parameterValueJson: parameterValueJson,
              reportName: reportName,
              createdBy: vm.userId.toString(),
              updatedBy: vm.userId.toString(),
              createByRoleId: vm.roleId,
              updateByRoleId: vm.roleId
            };
            downloadReport(reportInfo);
          }
        }).catch((error) => {
          vm.isDownloadDisabledReportingTool = false;
          BaseService.getErrorLog(error);
        });
      }
      else {
        const headerdata = [{
          value: vm.customerName,
          label: 'Customer',
          displayOrder: 1,
          labelLinkFn: vm.goToCustomerList,
          valueLinkFn: vm.goToCustomerDetail,
          valueLinkFnParams: { customerID: vm.customerID }
        }, {
          value: vm.packingSlip,
          label: 'Packing Slip#',
          displayOrder: 2,
          labelLinkFn: vm.goToCustomerPackingSlipList,
          valueLinkFn: vm.goToManageCustomerPackingSlip,
          valueLinkFnParams: { customerslipId: vm.packingId, refSalesOrderID: vm.salesOrderID }
        }];

        const packingslipDetails = {
          parameterValueJson: stringFormat('{"{0}":"{1}"}', CORE.ReportParameterFilterDbColumnName.PackingSlipId, Number($state.params.id)),
          entityId: vm.entityId,
          entityName: vm.entityName,
          reportName: reportName,
          skipFocusOnFirstElement: true,
          headerdata: headerdata
        };
        DialogFactory.dialogService(
          DYNAMIC_REPORTS.VIEW_ENTITY_REPORT_MODAL_CONTROLLER,
          DYNAMIC_REPORTS.VIEW_ENTITY_REPORT_MODAL_VIEW,
          null,
          packingslipDetails);
      }
    };

    // Download Report.
    function downloadReport(reportFilterDetails) {
      ReportMasterFactory.saveReportViewerParameter(reportFilterDetails).then((response) => {
        if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          ReportMasterFactory.downloadReport({ ParameterGuid: response.data }).then((downloadReportRes) => {
            vm.isDownloadDisabledReportingTool = false;
            BaseService.downloadReportFromReportingTool(downloadReportRes, reportFilterDetails.reportName, true);
          });
        }
        else {
          vm.isDownloadDisabledReportingTool = false;
        }
      }).catch((error) => {
        vm.isDownloadDisabledReportingTool = false;
        BaseService.getErrorLog(error);
      });
    }

    // get default report By entity.
    function getDefaultReportByEntity(searchObj) {
      vm.deafultEntityReport = null;
      return ReportMasterFactory.getDefaultReportByEntity().query({ listObj: searchObj }).$promise.then((response) => {
        if (response && response.status && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data) {
          vm.deafultEntityReport = response.data;
        }
        //return $q.resolve(response);
      }).catch((error) => BaseService.getErrorLog(error));
    }

    //print customer packingslip report
    vm.printRecord = (isDownload) => {
      if (isDownload) {
        vm.isDownloadDisabled = true;
      } else {
        vm.isPrintDisable = true;
      }
      const packingslipDetails = {
        id: $state.params.id,
        COFCReportDisclaimer: CORE.COFC_Report_Disclaimer,
        PACKINGSLIPReportDisclaimer: CORE.PACKINGSLIP_Report_Disclaimer,
        DECLARATIONOFRoHSCOMPLIANCE: CORE.DECLARATION_OF_RoHS_COMPLIANCE,
        RoHSReportDisclaimer: CORE.RoHS_Report_Disclaimer,
        PSData: {
          packingSlip: vm.packingSlip,
          packingSlipVersion: vm.packingSlipVersion,
          custCode: vm.custCode,
          statusName: CORE.CustomerPackingSlipSubStatusID.Draft === vm.subStatus ? `-${vm.getCustomerPackingSlipStatus(vm.subStatus).toUpperCase()}` : ''
        }
      };
      CustomerPackingSlipFactory.customerPackingSlipReport(packingslipDetails).then((response) => {
        const PSData = response.config.data.PSData;
        if (isDownload) {
          vm.isDownloadDisabled = false;
        } else {
          vm.isPrintDisable = false;
        }
        BaseService.downloadReport(response, stringFormat('{0}-{1}-{2}-{3}{4}', CORE.REPORT_SUFFIX.CUSTOMER_PACKINGSLIP, PSData.packingSlip, PSData.packingSlipVersion, PSData.custCode, PSData.statusName), isDownload, true);
      }).catch((error) => BaseService.getErrorLog(error));
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

    // to move at customer invoice page
    vm.viewCustomerInvoice = () => {
      BaseService.goToManageCustomerInvoice(vm.refCustInvoiceID);
    };

    // to move at customer invoice page
    vm.addCustomerInvoice = () => {
      BaseService.goToManageCustomerInvoice(0, { openInSameTab: false }, vm.packingSlip);
    };


    const bindAutoComplete = $scope.$on('CustomerPackingAutocomplete', () => {
      const searchobj = {
        transType: vm.transType
      };
      getPackingSlipNumberDetails(searchobj);
    });

    // Show Pending Customer Packing Slip Creation list pop up
    vm.viewSOPendingList = (ev) => {
      const data = {};
      if (vm.customerID) {
        data.customerId = vm.customerID;
        data.customerName = vm.customerName;
      }
      // this pop up is for view only
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_PENDING_CREATION_POPUP_CONTROLLER,
        TRANSACTION.TRANSACTION_CUSTOMER_PACKING_SLIP_PENDING_CREATION_POPUP_VIEW,
        ev,
        data).then(() => { // Success Section
        }, () => {// Cnacel Section
        });
    };

    // get class for Sale Order type
    vm.getPOTypeClassName = (classText) => {
      const poType = _.find(CORE.POType, (item) => item.Name === classText);
      return poType ? poType.ClassName : '';
    };

    //go to customer detail page
    vm.goToCustomerDetail = () => {
      BaseService.goToCustomer(vm.customerID);
    };
    // go to customer list page
    vm.goToCustomerList = () => {
      BaseService.goToCustomerList();
    };
    //go to sales order list page
    vm.goToSalesOrderList = () => {
      BaseService.goToSalesOrderList();
    };
    // go to sales order detail page
    vm.goToSalesOrderDetail = () => {
      BaseService.goToManageSalesOrder(vm.soID);
    };
    // go to invoice list
    vm.goToInvoiceList = () => {
      BaseService.goToCustomerInvoiceList();
    };
    // go to customer packing slip list
    vm.goToCustomerPackingSlipList = () => {
      BaseService.goToCustomerInvoicePackingSlipList();
    };
    $scope.$on('$destroy', () => {
      bindAutoComplete();
    });
  }
})();
