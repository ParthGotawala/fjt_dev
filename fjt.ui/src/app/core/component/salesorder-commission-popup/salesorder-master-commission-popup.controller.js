(function () {
  'use strict';

  angular
    .module('app.transaction')
    .controller('SalesOrderMasterCommissionPopupController', SalesOrderMasterCommissionPopupController);

  /** @ngInject */
  function SalesOrderMasterCommissionPopupController($mdDialog, $filter, $timeout, CORE, data, BaseService, SalesOrderFactory, DialogFactory, CustomerPackingSlipFactory, TRANSACTION) {
    const vm = this;
    vm.EmptyMesssage = CORE.EMPTYSTATE.SALES_COMMISSION;
    vm.LabelConstant = CORE.LabelConstant;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.quoteStatus = CORE.SC_QUOTE_STATUS;
    vm.amountInputStep = _amountInputStep;
    vm.unitPriceInputStep = _unitPriceInputStep;
    vm.dataSalesOrderDetailId = data.salesOrderDetailId;
    vm.salesCommissionDeltedIds = [];
    vm.transType = data.transType || null;
    vm.isAssembly = data.isAssembly;
    vm.masterData = angular.copy(data);
    vm.BlanketPODetails = TRANSACTION.BLANKETPOOPTIONDET;
    vm.refDetId = data.refDetId;
    vm.invoiceType = CORE.TRANSACTION_TYPE.INVOICE;
    vm.isDisableEntry = data.isDisableSalesComm || data.salesOrderDisable === 2 || false; //used from invoice page
    vm.isLegacyPO = data.isLegacyPO;

    //get sales commission details
    const getCommissionDetails = () => {
      const obj = {
        salesDetId: data.salesOrderDetailId,
        partID: data.partID
      };
      if (data.isFromList) {
        obj.refCustPackingSlipDetId = vm.refDetId;
        obj.transType = data.transType;
      }
      vm.cgBusyLoading = SalesOrderFactory.getSalesCommissionDetails().query(obj).$promise.then((sales) => {
        if (sales && sales.data) {
          setDisplayValues(sales.data);
          vm.copyCommission = angular.copy(sales.data);
          vm.salesCommissionList = _.orderBy(sales.data, ['type'], ['asc']);
          bindHeaderData();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //get sales commission quote status
    const getQuoteStatusForSalesCommission = () => {
      vm.cgBusyLoading = SalesOrderFactory.getQuoteStatusForSalesCommission().query({ rfqAssyID: data.rfqAssyID || null, partID: data.partID }).$promise.then((sales) => {
        if (sales && sales.data) {
          vm.quoteStatus = sales.data[0].quoteStatus;
          bindHeaderData();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    getQuoteStatusForSalesCommission();
    function setDisplayValues(data) {
      if (data && data.length) {
        _.each(data, (item) => {
          item.extendedCommissionValueDisplay = $filter('amount')(item.extendedCommissionValue);
          if (item.type !== TRANSACTION.SO_COMMISSION_ATTR.MISC.ID) {
            item.actualUnitPriceDisplay = $filter('amount')(item.unitPrice - item.commissionValue);
            item.actualQuotedPriceDisplay = $filter('amount')(item.quoted_unitPrice - item.quoted_commissionValue);
            item.quoted_commissionPercentageDisplay = angular.copy(item.quoted_commissionPercentage);
            item.quoted_commissionValueDisplay = $filter('unitPrice')(item.quoted_commissionValue);
            item.extendedQuotedCommissionValueDisplay = $filter('amount')(item.extendedQuotedCommissionValue);
            item.quoted_unitPriceDisplay = $filter('amount')(item.quoted_unitPrice);
          }
        });
      }
    }
    //cancel sales commision forms
    vm.cancel = () => {
      if (vm.salesCommissionForm.$dirty) {
        const data = {
          form: vm.salesCommissionForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };
    //refresh sales commission details
    vm.refreshsalesCommission = () => {
      getCommissionDetails();
    };

    //save sales commission detail
    vm.saveSalesCommissionDetail = () => {
      if (BaseService.focusRequiredField(vm.salesCommissionForm)) {
        return;
      }
      if (vm.dataSalesOrderDetailId || vm.refDetId) {
        if (!vm.save) {
          vm.save = true;
          const dataObj = {
            deletedComissionIds: (vm.salesCommissionDeltedIds) ? vm.salesCommissionDeltedIds : []
          };
          if (vm.transType === CORE.TRANSACTION_TYPE.INVOICE) {
            dataObj.partId = data.partID;
            dataObj.id = vm.refDetId;
            dataObj.transType = vm.transType;
            dataObj.invoiceId = data.refId;
            _.each(vm.salesCommissionList, (det) => {
              det.refCustPackingSlipDetID = vm.refDetId;
              if (det.type !== TRANSACTION.SO_COMMISSION_ATTR.MISC.ID) {
                dataObj.unitPrice = parseFloat(det.unitPrice);
              }
            });
            dataObj.salesCommissionList = vm.salesCommissionList;
            dataObj.revision = data.revision;
            const checkForStatus = (vm.transType === CORE.TRANSACTION_TYPE.INVOICE ? CORE.CUSTINVOICE_SUBSTATUS.DRAFT : CORE.CUSTCRNOTE_SUBSTATUS.DRAFT);
            if (dataObj.invoiceId && data.subStatus !== checkForStatus) {
              // const pageName = vm.transType === CORE.TRANSACTION_TYPE.INVOICE ? 'Customer Invoice' : 'Customer Credit Memo';
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.PUBLISHED_TRANS_UPDATE_REVISION_CONFIRMATION);
              messageContent.message = stringFormat(messageContent.message, 'Customer Invoice');
              const obj = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              DialogFactory.messageConfirmDialog(obj).then((yes) => {
                if (yes) {
                  dataObj.revision = parseInt(data.revision || 0) + 1;
                  saveCommissionFromCustInvoice(dataObj);
                }
              }, () => {
                saveCommissionFromCustInvoice(dataObj);
                // return;
              }).catch((error) => BaseService.getErrorLog(error));
            } else { // if only status change then no confirmation
              saveCommissionFromCustInvoice(dataObj);
            }
          } else {
            BaseService.currentPagePopupForm.pop();
            $mdDialog.cancel({ isSaved: true, salesCommissionList: vm.salesCommissionList, salesCommissionDeltedIds: vm.salesCommissionDeltedIds });
          }
        }
      }
      else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel({ salesCommissionList: vm.salesCommissionList, salesCommissionDeltedIds: vm.salesCommissionDeltedIds });
      }
    };
    // save commission detail updated from customer invoice page after revision
    const saveCommissionFromCustInvoice = (dataObj) => {
      vm.cgBusyLoading = CustomerPackingSlipFactory.saveSalesCommissionDetailsManual().query(dataObj).$promise.then((saveResp) => {
        BaseService.currentPagePopupForm.pop();
        vm.save = false;
        $mdDialog.cancel({ isSaved: true, data: saveResp.data.data, revision: saveResp.data.revision });
      }).catch((error) => {
        vm.save = false;
        return BaseService.getErrorLog(error);
      });
    };

    //link to go for part master list page
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };
    //go to part master
    vm.goToPartMaster = () => {
        BaseService.goToComponentDetailTab(null, data.partID);
    };

    vm.goToSalesOrderList = () => {
      BaseService.goToSalesOrderList();
      return false;
    };

    vm.goToManageSalesOrder = () => {
      BaseService.goToManageSalesOrder(data.soId);
      return false;
    };
    //go to employee list page
    vm.gotoEmployeeMasterList = () => {
        BaseService.goToPersonnelList();
      return false;
    };
    //go to employee master page
    vm.gotoEmployeeMaster = () => {
      BaseService.goToEmployeeProfile(data.salesCommissionTo);
      return false;
    };
    //go to rfq list page
    vm.gotoRfqList = () => {
      BaseService.goToRFQList();
      return;
    };
    //go to manage rfq list
    vm.gotoManageRfqList = () => {
      BaseService.goToRFQUpdate(data.quoteGroup, data.partID);
      return;
    };
    // go to manage customer invoice
    vm.goToManageCustomerInvoice = () => {
      BaseService.goToManageCustomerInvoice(data.refId);
      return;
    };
    // go to customer invoice list
    vm.goToCustomerInvoiceList = () => {
      BaseService.goToCustomerInvoiceList();
      return;
    };

    // go to Quote Summary
    vm.gotoQuoteSummary = () => {
      if (data.rfqAssyID) { BaseService.goToQuoteSummary(data.rfqAssyID); } else {
        BaseService.goToComponentSalesPriceMatrixTab(data.partID);
      }
    };

    const bindHeaderData = () => {
      vm.headerdata = [];
      vm.headerdata.push(
        {
          label: vm.LabelConstant.SalesOrder.PO,
          value: data.poNumber,
          displayOrder: 1,
          labelLinkFn: vm.goToSalesOrderList,
          valueLinkFn: vm.goToManageSalesOrder,
          valueLinkFnParams: null,
          isCopy: false,
          copyParams: null,
          imgParms: null
        },
        {
          label: vm.LabelConstant.CustomerPackingInvoice.CustomerInvoiceNumber,
          value: data.invoiceNumber,
          displayOrder: 2,
          labelLinkFn: vm.goToCustomerInvoiceList,
          valueLinkFn: vm.goToManageCustomerInvoice,
          valueLinkFnParams: null,
          isCopy: false,
          copyParams: null,
          imgParms: null
        },
        {
          label: vm.LabelConstant.SalesOrder.SO,
          value: data.salesOrderNumber,
          displayOrder: 3,
          labelLinkFn: vm.goToSalesOrderList,
          valueLinkFn: vm.goToManageSalesOrder,
          valueLinkFnParams: null,
          isCopy: false,
          copyParams: null,
          imgParms: null
        },
        {
          label: vm.LabelConstant.SalesOrder.Revision,
          value: data.version,
          displayOrder: 3
        },
        {
          label: vm.isAssembly ? vm.LabelConstant.Assembly.PIDCode : vm.LabelConstant.MFG.PID,
          value: data.PIDCode,
          displayOrder: 4,
          labelLinkFn: vm.goToPartList,
          valueLinkFn: vm.goToPartMaster,
          isCopy: true,
          isCopyAheadLabel: true,
          isAssy: vm.isAssembly,
          imgParms: {
            imgPath: data.rohsIcon,
            imgDetail: data.rohsComplientConvertedValue
          },
          isCopyAheadOtherThanValue: true,
          copyAheadLabel: vm.isAssembly ? vm.LabelConstant.Assembly.MFGPN : vm.LabelConstant.MFG.MFGPN,
          copyAheadValue: data.mfgPN
        },
        {
          label: vm.LabelConstant.SalesOrder.SalesCommissionTo,
          value: data.salesCommissionToName,
          displayOrder: 6,
          labelLinkFn: vm.gotoEmployeeMasterList,
          valueLinkFnParams: vm.gotoEmployeeMaster,
          isCopy: false,
          copyParams: null,
          imgParms: null
        },
        {
          label: vm.LabelConstant.SalesOrder.QuoteGroup,
          value: data.quoteGroup,
          displayOrder: 8,
          labelLinkFn: vm.gotoRfqList,
          valueLinkFn: vm.gotoManageRfqList,
          isCopy: false,
          copyParams: null,
          imgParms: null
        },
        {
          label: vm.LabelConstant.SalesOrder.QuoteNumber,
          value: data.quoteNumber,
          valueLinkFn: vm.gotoQuoteSummary,
          displayOrder: 9,
          isCopy: false,
          copyParams: null,
          imgParms: null
        },
        {
          label: vm.LabelConstant.SalesOrder.QuoteStatus,
          value: vm.quoteStatus,
          displayOrder: 10,
          isCopy: false,
          copyParams: null,
          imgParms: null
        },
        {
          label: vm.transType === CORE.TRANSACTION_TYPE.INVOICE ? 'Qty' : vm.isLegacyPO?'Open PO Qty': vm.LabelConstant.SalesOrder.POQTY,
          value: data.qty,
          displayOrder: 10,
          isCopy: false,
          copyParams: null,
          imgParms: null
        }
      );
      if (data.quoteTurnTime) {
        vm.headerdata.push({
          label: vm.LabelConstant.SalesOrder.QuoteTurnTime,
          value: data.quoteTurnTime,
          valueLinkFn: vm.gotoQuoteSummary,
          displayOrder: 9,
          isCopy: false,
          copyParams: null,
          imgParms: null
        });
      }
      if (data.blanketPOOption) {
        vm.headerdata.push({
          label: vm.LabelConstant.SalesOrder.BlanketPO,
          value: 'Yes',
          displayOrder: 10
        });
        vm.headerdata.push({
          label: vm.LabelConstant.SalesOrder.BlanketPOOption,
          value: vm.BlanketPODetails.USEBLANKETPO === data.blanketPOOption ? TRANSACTION.BLANKETPOOPTION[0].value : vm.BlanketPODetails.LINKBLANKETPO === data.blanketPOOption ? TRANSACTION.BLANKETPOOPTION[1].value : TRANSACTION.BLANKETPOOPTION[2].value,
          displayOrder: 10
        });
      }
      if (data.isLegacyPO) {
        vm.headerdata.push({
          label: vm.LabelConstant.SalesOrder.LegacyPo,
          value: 'Yes',
          displayOrder: 10
        });
      }
      if (data.isRmaPO) {
        vm.headerdata.push({
          label: vm.LabelConstant.SalesOrder.RMAPo,
          value: 'Yes',
          displayOrder: 10
        });
      }
    };

    if ((!data.salesOrderDetailId || !vm.refDetId) && !data.isFromList) {
      vm.salesCommissionList = _.orderBy(data.salesCommissionList, ['type'], ['asc']);
      setDisplayValues(vm.salesCommissionList);
      bindHeaderData();
    }
    else {
      getCommissionDetails();
    }

    //get total commission
    vm.totalActualCommission = () => {
      const totalCommission = _.sumBy((_.filter(vm.salesCommissionList, (list) => list.commissionValue)), (sum) => sum.commissionValue);
      return parseFloat((totalCommission ? totalCommission : 0)).toFixed(_unitPriceFilterDecimal);
    };
    //get total extended amount
    vm.totalExtendedCommissionDollar = () => {
      const totalCommission = _.sumBy((_.filter(vm.salesCommissionList, (list) => list.extendedCommissionValue)), (sum) => sum.extendedCommissionValue);
      return parseFloat((totalCommission ? totalCommission : 0)).toFixed(_amountFilterDecimal);
    };
    //get actual commission
    vm.totalQuotedCommission = () => {
      const actualtotalCommission = _.sumBy((_.filter(vm.salesCommissionList, (list) => list.quoted_commissionValue)), (sum) => sum.quoted_commissionValue);
      return parseFloat((actualtotalCommission ? actualtotalCommission : 0)).toFixed(_unitPriceFilterDecimal);
    };
    //get extended commission
    vm.totalExtendedQuotedCommissionDollar = () => {
      const actualtotalCommission = _.sumBy((_.filter(vm.salesCommissionList, (list) => list.extendedQuotedCommissionValue)), (sum) => sum.extendedQuotedCommissionValue);
      return parseFloat((actualtotalCommission ? actualtotalCommission : 0)).toFixed(_amountFilterDecimal);
    };

    //calculate margin dollar and margin percentage base on profit
    vm.changePercentage = (item) => {
      if (item.commissionPercentage && item.unitPrice) {
        let percentage = item.commissionPercentage ? item.commissionPercentage : 0;
        if (percentage > 100) {
          percentage = 100.00;
        }
        item.commissionPercentage = percentage;
        //calculate commission from percentage
        //item.commissionValue = roundUpNum(((item.commissionPercentage * item.unitPrice) / 100), _unitPriceFilterDecimal);
        item.commissionValue = roundUpNum((((100 / (100 + parseFloat(item.commissionPercentage))) * item.unitPrice) * parseFloat(item.commissionPercentage) / 100), _unitPriceFilterDecimal);
        //calculate extended price
        item.extendedCommissionValue = multipleUnitValue(item.commissionValue, data.qty, _amountFilterDecimal);
        item.extendedCommissionValueDisplay = $filter('amount')(item.extendedCommissionValue);
      } else {
        item.commissionValue = 0;
        item.extendedCommissionValue = 0;
        item.extendedCommissionValueDisplay = $filter('amount')(0);
      }
      item.actualUnitPriceDisplay = $filter('amount')(item.unitPrice - item.commissionValue);
      setQuotedCommissionValuesForNewRows(item);
    };

    function setQuotedCommissionValuesForNewRows(item) {
      if (item.id < 0) {
        item.quoted_commissionPercentageDisplay = angular.copy(item.quoted_commissionPercentage);
        item.quoted_commissionValueDisplay = $filter('unitPrice')(item.quoted_commissionValue);

        item.extendedQuotedCommissionValue = multipleUnitValue(item.quoted_commissionValue, item.quotedQty, _amountFilterDecimal);
        item.extendedQuotedCommissionValueDisplay = $filter('amount')(item.extendedQuotedCommissionValue);

        item.quoted_unitPriceDisplay = $filter('amount')(item.quoted_unitPrice);
      }
    }

    //calculate margin dollar and margin percentage base on profit
    vm.changeCommission = (item) => {
      if (item.commissionValue && item.unitPrice) {
        let commission = item.commissionValue ? item.commissionValue : 0;
        if (commission > (item.unitPrice / 2)) {
          commission = (item.unitPrice / 2);
        }
        item.commissionValue = commission;
        //calculate commission from percentage
        //item.commissionPercentage = roundUpNum(((item.commissionValue * 100) / item.unitPrice), _amountFilterDecimal);
        item.commissionPercentage = roundUpNum(((parseFloat(item.unitPrice) - (parseFloat(item.unitPrice) - parseFloat(item.commissionValue))) * 100 / (parseFloat(item.unitPrice) - parseFloat(item.commissionValue))), _amountFilterDecimal);

        //calculate extended price
        item.extendedCommissionValue = multipleUnitValue(item.commissionValue, data.qty, _amountFilterDecimal);
        item.extendedCommissionValueDisplay = $filter('amount')(item.extendedCommissionValue);
        item.actualUnitPriceDisplay = $filter('amount')(item.unitPrice - item.commissionValue);
      } else if (item.type === TRANSACTION.SO_COMMISSION_ATTR.MISC.ID) {
        const commission = item.commissionValue ? item.commissionValue : 0;
        item.commissionValue = commission;
        item.commissionPercentage = null;
        item.extendedCommissionValue = multipleUnitValue(item.commissionValue, data.qty, _amountFilterDecimal);
        item.extendedCommissionValueDisplay = $filter('amount')(item.extendedCommissionValue);
      } else {
        item.commissionValue = 0;
        item.commissionPercentage = 0;
        item.extendedCommissionValue = 0;
        item.extendedCommissionValueDisplay = $filter('amount')(0);
        item.actualUnitPriceDisplay = $filter('amount')(item.unitPrice - item.commissionValue);
      }
      if (item.type !== TRANSACTION.SO_COMMISSION_ATTR.MISC.ID) {
        setQuotedCommissionValuesForNewRows(item);
      }
    };

    vm.removeRow = (row) => {
      if (row) {
        const index = vm.salesCommissionList.indexOf(row);
        if (vm.salesCommissionList.length > 0) {
          const obj = {
            messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.PARTS.DELETE_SALES_COMMISSION_FROM_LIST_CONFIRMATION,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then(() => {
            vm.salesCommissionList.splice(index, 1);
            if (row.refSalesorderdetID > 0 && row.id > 0) {
              vm.salesCommissionDeltedIds.push({ id: row.id, refSalesorderdetID: row.refSalesorderdetID });
            }
            if (row.refCustPackingSlipDetID > 0 && row.id > 0) {
              vm.salesCommissionDeltedIds.push(row.id);
            }
            vm.salesCommissionForm.$setDirty();
            setFocusByName('saveBtn');
          }, () => {
            // cancel
            setFocusByName('commissionValue' + index);
          });
        }
      }
    };

    function addNewRow() {
      if (vm.salesCommissionForm &&
        vm.salesCommissionForm.$invalid &&
        BaseService.focusRequiredField(vm.salesCommissionForm)) {
        return;
      }

      let minId = -1;
      if (vm.salesCommissionList && vm.salesCommissionList.length > 0) {
        const item = _.min(_.sortBy(vm.salesCommissionList, 'id'), 'id');
        if (item && item.id <= 0) {
          minId = item.id - 1;
          if (minId === 0) {
            minId = -1;
          }
        }
      }
      const newRowObj = {
        id: minId,
        qty: data.qty,
        quotedQty: null,
        salesCommissionNotes: null,
        unitPrice: null,
        commissionPercentage: null,
        commissionValue: 0,
        extendedCommissionValueDisplay: '',
        quoted_unitPriceDisplay: null,
        quoted_commissionPercentageDisplay: null,
        quoted_commissionValueDisplay: null,
        extendedQuotedCommissionValueDisplay: null,
        fieldName: TRANSACTION.SO_COMMISSION_ATTR.MISC.FIELDNAME,
        partID: data.partID,
        typeName: TRANSACTION.SO_COMMISSION_ATTR.MISC.COMMISSIONCALCULATEDFROM,
        type: TRANSACTION.SO_COMMISSION_ATTR.MISC.ID,
        commissionCalculateFrom: TRANSACTION.SO_COMMISSION_ATTR.MISC.ID
      };

      vm.salesCommissionList.push(newRowObj);

      const index = vm.salesCommissionList.indexOf(newRowObj);
      if (index || index === 0) {
        $timeout(() => {
          setFocusByName('commissionValue' + index);
        });
      }
    };

    vm.addCommissionNewRow = (row, event, isAddNew, index) => {
      if (!event.originalEvent.altKey &&
        !event.originalEvent.ctrlKey &&
        !event.originalEvent.shiftKey && !vm.isDisableEntry) {
        if (event.originalEvent.keyCode === 9) {
          if (!row.id && (index || index === 0)) {
            if (vm.salesCommissionList && (vm.salesCommissionList.length - 1) === index) {
              addNewRow();
            }
          }
          else if (row.id && !vm.salesCommissionList || vm.salesCommissionList[vm.salesCommissionList.length - 1].id === row.id) {
            addNewRow();
          }
        }
        else if (isAddNew) {
          addNewRow();
        }
      }
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    // open sales commission child details
    vm.childCommissionDetails = (item, event) => {
      const masterCommission = angular.copy(vm.masterData);
      _.map(item.childSalesCommissionList, (d) => {
        d.commissionPercentage = parseFloat(d.commissionPercentage || 0) > 100 ? 100 : d.commissionPercentage;
        d.commissionValue = parseFloat((d.commissionPercentage * d.unitPrice / 100).toFixed(5));
        d.extendedCommissionValue = multipleUnitValue(d.commissionValue, item.qty, _amountFilterDecimal);
        d.extendedOrgCommissionValue = multipleUnitValue(d.org_commissionValue, item.quotedQty, _amountFilterDecimal);
        d.qty = item.qty;
        d.typeName = item.typeName;
        d.fieldName = item.fieldName;
        d.quotedQty = item.quotedQty;
      });
      masterCommission.salesCommissionID = item.id || null;
      masterCommission.salesCommissionList = item.childSalesCommissionList;
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_SALES_COMMISSION_CONTROLLER,
        TRANSACTION.TRANSACTION_SALES_COMMISSION_VIEW,
        event,
        masterCommission).then(() => {
        }, (data) => {
          if (data) {
            item.childSalesCommissionList = data.salesCommissionList;
            vm.salesCommissionForm.$setDirty();
          }
        }, (error) => BaseService.getErrorLog(error));
    };
    // popup form validation
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.salesCommissionForm);
      $timeout(() => {
        focusOnFirstEnabledFormField(vm.salesCommissionForm);
      }, _configTimeout);
    });
  }
})();

