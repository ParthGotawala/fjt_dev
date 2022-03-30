(function () {
  'use strict';

  angular
    .module('app.transaction')
    .controller('SalesOrderCommissionPopupController', SalesOrderCommissionPopupController);

  /** @ngInject */
  function SalesOrderCommissionPopupController($mdDialog, $filter, $timeout, CORE, data, BaseService) {
    const vm = this;
    vm.EmptyMesssage = CORE.EMPTYSTATE.SALES_COMMISSION;
    vm.LabelConstant = CORE.LabelConstant;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.amountInputStep = _amountInputStep;
    vm.unitPriceInputStep = _unitPriceInputStep;
    vm.dataSalesOrderDetailId = data.salesOrderDetailId;
    vm.salesCommissionDeltedIds = [];
    vm.transType = data.transType || null;
    vm.isAssembly = data.isAssembly;
    vm.refDetId = data.refDetId;
    vm.invoiceType = CORE.TRANSACTION_TYPE.INVOICE;
    vm.isDisableEntry = data.isDisableSalesComm || data.salesOrderDisable === 2 || false; //used from invoice page
    vm.isLegacyPO = data.isLegacyPO;

    function setDisplayValues(data) {
      if (data && data.length) {
        _.each(data, (item) => {
          item.extendedCommissionValueDisplay = $filter('amount')(item.extendedCommissionValue);
          item.org_commissionPercentageDisplay = parseFloat(item.org_commissionPercentage);
          item.org_commissionValueDisplay = $filter('unitPrice')(item.org_commissionValue);
          item.extendedOrgCommissionValueDisplay = $filter('amount')(item.extendedOrgCommissionValue);
          item.org_unitPriceDisplay = $filter('amount')(item.org_unitPrice);
        });
      }
    }
    //cancel sales commision forms
    vm.cancel = () => {
      if (vm.salesCommissionFormDet.$dirty) {
        const data = {
          form: vm.salesCommissionFormDet
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };


    //save sales commission detail
    vm.saveSalesCommissionDetail = () => {
      if (BaseService.focusRequiredField(vm.salesCommissionFormDet)) {
        return;
      }
      if (vm.dataSalesOrderDetailId || vm.refDetId) {
        if (!vm.save) {
          vm.save = true;
          BaseService.currentPagePopupForm.pop();
          vm.save = false;
          $mdDialog.cancel({ isSaved: true, salesCommissionList: vm.salesCommissionList, salesCommissionDeltedIds: vm.salesCommissionDeltedIds });
        }
      }
      else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel({ salesCommissionList: vm.salesCommissionList, salesCommissionDeltedIds: vm.salesCommissionDeltedIds });
      }
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
          label: vm.LabelConstant.SalesOrder.QuoteTurnTime,
          value: data.quoteTurnTime,
          valueLinkFn: vm.gotoQuoteSummary,
          displayOrder: 9,
          isCopy: false,
          copyParams: null,
          imgParms: null
        }
      );
    };


    vm.salesCommissionList = data.salesCommissionList;
    setDisplayValues(vm.salesCommissionList);
    bindHeaderData();


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
    vm.totalOrgCommission = () => {
      const actualtotalCommission = _.sumBy((_.filter(vm.salesCommissionList, (list) => list.org_commissionValue)), (sum) => sum.org_commissionValue);
      return parseFloat((actualtotalCommission ? actualtotalCommission : 0)).toFixed(_unitPriceFilterDecimal);
    };
    //get extended commission
    vm.totalExtendedOrgCommissionDollar = () => {
      const actualtotalCommission = _.sumBy((_.filter(vm.salesCommissionList, (list) => list.extendedOrgCommissionValue)), (sum) => sum.extendedOrgCommissionValue);
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
        item.commissionValue = roundUpNum(((item.commissionPercentage * item.unitPrice) / 100), _unitPriceFilterDecimal);
        //calculate extended price
        item.extendedCommissionValue = multipleUnitValue(item.commissionValue, data.qty, _amountFilterDecimal);
        item.extendedCommissionValueDisplay = $filter('amount')(item.extendedCommissionValue);
      } else {
        item.commissionValue = 0;
        item.extendedCommissionValue = 0;
        item.extendedCommissionValueDisplay = $filter('amount')(0);
      }
      setOrgCommissionValuesForNewRows(item);
    };

    function setOrgCommissionValuesForNewRows(item) {
      if (item.id < 0) {
        item.org_commissionPercentage = item.commissionPercentage;
        item.org_commissionPercentageDisplay = parseFloat(item.org_commissionPercentage);

        item.org_commissionValue = item.commissionValue;
        item.org_commissionValueDisplay = $filter('unitPrice')(item.org_commissionValue);

        item.extendedOrgCommissionValue = multipleUnitValue(item.org_commissionValue, item.qty, _amountFilterDecimal);
        item.extendedOrgCommissionValueDisplay = $filter('amount')(item.extendedOrgCommissionValue);

        item.org_unitPrice = item.unitPrice;
        item.org_unitPriceDisplay = $filter('amount')(item.org_unitPrice);
      }
    }

    //calculate margin dollar and margin percentage base on profit
    vm.changeCommission = (item) => {
      if (item.commissionValue && item.unitPrice) {
        let commission = item.commissionValue ? item.commissionValue : 0;
        if (commission > item.unitPrice) {
          commission = item.unitPrice;
        }
        item.commissionValue = commission;
        //calculate commission from percentage
        item.commissionPercentage = roundUpNum(((item.commissionValue * 100) / item.unitPrice), _amountFilterDecimal);

        //calculate extended price
        item.extendedCommissionValue = multipleUnitValue(item.commissionValue, data.qty, _amountFilterDecimal);
        item.extendedCommissionValueDisplay = $filter('amount')(item.extendedCommissionValue);
      } else {
        item.commissionValue = 0;
        item.commissionPercentage = 0;
        item.extendedCommissionValue = 0;
        item.extendedCommissionValueDisplay = $filter('amount')(0);
      }
      setOrgCommissionValuesForNewRows(item);
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    // popup form validation
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.salesCommissionFormDet);
      $timeout(() => {
        focusOnFirstEnabledFormField(vm.salesCommissionFormDet);
      }, _configTimeout);
    });
  }
})();

