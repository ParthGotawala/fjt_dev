(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('SupplierQuotePurchaseOrderPartPricePopupController', SupplierQuotePurchaseOrderPartPricePopupController);

  /** @ngInject */
  function SupplierQuotePurchaseOrderPartPricePopupController(data, CORE, $mdDialog, USER, BaseService, SupplierQuoteFactory, TRANSACTION) {
    const vm = this;
    vm.supplierQuotePartPrice = data;
    vm.supplierData = vm.supplierQuotePartPrice.supplierData;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.LabelConstant = CORE.LabelConstant;
    vm.supplierQuoteStatus = CORE.SUPPLIER_QUOTE_STATUS;
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.SUPPLIER_QUOTE_PURCHASE_ORDER;
    vm.headerdata = [];
    vm.goToManufacturerList = () => {
      BaseService.goToManufacturerList();
    };
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };

    // go to manufacturer edit page
    vm.goToManufacturer = () => {
      BaseService.goToManufacturer(vm.supplierQuotePartPrice.mfgCodeID);
    };

    // go to part master detail tab
    vm.goToComponentDetailTab = () => {
      BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG, vm.supplierQuotePartPrice.partID, USER.PartMasterTabs.Detail.Name);
    };

    // go to supplier list page
    vm.goToSupplierList = () => {
      BaseService.goToSupplierList();
    };

    // go to supplier detail tab
    vm.goToSupplierDetail = () => {
      BaseService.goToSupplierDetail(vm.supplierData.id);
    };

    // go to supplier quote list page
    vm.goToSupplierQuoteList = () => {
      BaseService.goToSupplierQuoteList();
    };

    // go to supplier quote detail tab
    vm.goToSupplierQuoteDetail = () => {
        BaseService.goToSupplierQuoteWithPartDetail(vm.supplierQuoteID);
    };

    // header details
    vm.headerdata = [
      {
        label: vm.LabelConstant.SupplierQuote.Supplier,
        value: vm.supplierData.mfgCodeName,
        displayOrder: 1,
        labelLinkFn: vm.goToSupplierList,
        valueLinkFn: vm.goToSupplierDetail
      },
      {
        label: vm.LabelConstant.MFG.MFG,
        value: vm.supplierQuotePartPrice.mfgName,
        displayOrder: 3,
        labelLinkFn: vm.goToManufacturerList,
        valueLinkFn: vm.goToManufacturer
      },
      {
        label: vm.LabelConstant.MFG.MFGPN,
        value: vm.supplierQuotePartPrice.mfgPN,
        displayOrder: 4,
        labelLinkFn: vm.goToPartList,
        valueLinkFn: vm.goToComponentDetailTab,
        isCopy: true,
        isAssy: vm.supplierQuotePartPrice.isCustom,
        imgParms: {
          imgPath: vm.rohsImagePath + vm.supplierQuotePartPrice.rohsIcon,
          imgDetail: vm.supplierQuotePartPrice.rohsName
        }
      }];

    // check and retrive supplier quote
    vm.retrieveSupplierQuotePartPricingDetails = () => {
      const supplierQuoteData = {
        partID: vm.supplierQuotePartPrice.partID,
        supplierID: vm.supplierData.id
      };
      vm.cgBusyLoading = SupplierQuoteFactory.retrieveSupplierQuotePricingDetailsByPartID().query(supplierQuoteData).$promise.then((response) => {
        if (response && response.data && response.data.pricingDetails && response.data.pricingDetails.length > 0) {
          vm.supplierQuotePricingDetails = response.data.pricingDetails;
          vm.supplierQuoteNumber = _.uniq(_.map(vm.supplierQuotePricingDetails, 'quoteNumber')).toString();
          vm.supplierQuoteID = _.uniq(_.map(vm.supplierQuotePricingDetails, 'supplierQuoteID'));
          vm.quoteStatus = _.uniq(_.map(vm.supplierQuotePricingDetails, 'quoteStatus')).toString() === vm.supplierQuoteStatus.PUBLISHED ? vm.supplierQuoteStatus.PUBLISHED_LABEL : vm.supplierQuoteStatus.DRAFT_LABEL;
          if (vm.supplierQuoteNumber) {
            vm.headerdata.push(
              {
                label: vm.LabelConstant.SupplierQuote.Quote,
                value: vm.supplierQuoteNumber,
                displayOrder: 2,
                labelLinkFn: vm.goToSupplierQuoteList,
                valueLinkFn: vm.goToSupplierQuoteDetail
              },
              {
                label: vm.LabelConstant.SupplierQuote.QuoteStatus,
                value: vm.quoteStatus,
                displayOrder: 5
              });
          }
          vm.isUpdateSupplierQuote = true;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    vm.retrieveSupplierQuotePartPricingDetails();

    // cancel popup
    vm.cancel = () => $mdDialog.hide();
  }
})();
