(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('SupplierQuotePartPriceDetailPopupController', SupplierQuotePartPriceDetailPopupController);

  /** @ngInject */
  function SupplierQuotePartPriceDetailPopupController($scope, $q, $state, data, $timeout, CORE, $mdDialog, DialogFactory, USER, $filter, SupplierQuoteFactory, BaseService) {
    const vm = this;
    vm.supplierQuotePartPrice = data;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.LabelConstant = CORE.LabelConstant;
    vm.partCostingPriceFetchNote = CORE.SUPPLIER_QUOTE_PART_PRICE_FETCH_INTO_PART_COSTING_NOTE;
    vm.supplierQuoteStatus = CORE.SUPPLIER_QUOTE_STATUS;
    vm.headerdata = [];
    vm.goToSupplierList = () => {
      BaseService.goToSupplierList();
    };
    vm.goToSupplierDetail = () => {
      BaseService.goToSupplierDetail(vm.headerDetails.supplier_quote_mst.mfgCodemst.id);
    };
    vm.goToSupplierQuoteList = () => {
      BaseService.goToSupplierQuoteList();
    };
    vm.goToSupplierQuoteDetail = () => {
        BaseService.goToSupplierQuoteWithPartDetail(vm.headerDetails.supplier_quote_mst.id);
    };
    vm.GoToQuoteAttributelist = () => {
      BaseService.goToQuoteAttributeList();
    };
    vm.goToManufacturerList = () => {
      BaseService.goToManufacturerList();
    };
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };

    vm.goToSupplierPartList = () => {
      BaseService.goToSupplierPartList();
    };
    vm.goToManufacturer = () => {
      BaseService.goToManufacturer(vm.headerDetails.component.mfgCodemst.id);
    };
    vm.goToComponentDetailTab = () => {
      BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG, vm.headerDetails.component.id, USER.PartMasterTabs.Detail.Name);
    };
    vm.goToSupplierComponentDetailTab = () => {
      BaseService.goToComponentDetailTab(CORE.MFG_TYPE.DIST, vm.headerDetails.supplierComponent.id, USER.PartMasterTabs.Detail.Name);
    };

    vm.getSupplierQuotePartPriceHeaderDetails = () => {
      vm.cgBusyLoading = SupplierQuoteFactory.getSupplierQuotePartPriceHeaderDetails().query({ id: vm.supplierQuotePartPrice.supplierQuotePartDetailId }).$promise.then((response) => {
        if (response && response.data) {
          vm.headerDetails = response.data;
          vm.headerDetails.mfgCodeName = BaseService.getMfgCodeNameFormat(vm.headerDetails.component.mfgCodemst.mfgCode, vm.headerDetails.component.mfgCodemst.mfgName);
          vm.headerDetails.supplier_quote_mst.quoteStatus = vm.headerDetails.supplier_quote_mst.quoteStatus === vm.supplierQuoteStatus.PUBLISHED ? vm.supplierQuoteStatus.PUBLISHED_LABEL : vm.supplierQuoteStatus.DRAFT_LABEL;
          vm.headerdata = [
            {
              label: vm.LabelConstant.SupplierQuote.Supplier,
              value: vm.headerDetails.supplier_quote_mst.mfgCodemst.mfgName,
              displayOrder: 1,
              labelLinkFn: vm.goToSupplierList,
              valueLinkFn: vm.goToSupplierDetail
            },
            {
              label: vm.LabelConstant.SupplierQuote.Quote,
              value: vm.headerDetails.supplier_quote_mst.quoteNumber,
              displayOrder: 2,
              labelLinkFn: vm.goToSupplierQuoteList,
              valueLinkFn: vm.goToSupplierQuoteDetail
            },
            {
              label: vm.LabelConstant.MFG.MFG,
              value: vm.headerDetails.mfgCodeName,
              displayOrder: 3,
              labelLinkFn: vm.goToManufacturerList,
              valueLinkFn: vm.goToManufacturer
            },
            {
              label: vm.LabelConstant.MFG.MFGPN,
              value: vm.headerDetails.component.mfgPN,
              displayOrder: 4,
              labelLinkFn: vm.goToPartList,
              valueLinkFn: vm.goToComponentDetailTab,
              isCopy: true,
              isCopyAheadLabel: true,
              imgParms: {
                imgPath: vm.rohsImagePath + vm.headerDetails.component.rfq_rohsmst.rohsIcon,
                imgDetail: vm.headerDetails.component.rfq_rohsmst.name
              }
            }, {
              label: vm.LabelConstant.SupplierQuote.QuoteStatus,
              value: vm.headerDetails.supplier_quote_mst.quoteStatus,
              displayOrder: 5
            }];

          if (vm.headerDetails.supplierComponent) {
            vm.headerdata.push(
              {
                label: vm.LabelConstant.MFG.SupplierPN,
                value: vm.headerDetails.supplierComponent.PIDCode,
                displayOrder: 5,
                labelLinkFn: vm.goToSupplierPartList,
                valueLinkFn: vm.goToSupplierComponentDetailTab,
                isCopy: true,
                isCopyAheadLabel: true,
                isAssy: true,
                imgParms: {
                  imgPath: vm.rohsImagePath + vm.headerDetails.component.rfq_rohsmst.rohsIcon,
                  imgDetail: vm.headerDetails.component.rfq_rohsmst.name
                }
              }
            );
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getSupplierQuotePartPriceHeaderDetails();

    const showWithoutSavingAlert = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      return DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          SupplierQuoteFactory.isPricingChange = false;
          BaseService.currentPageFlagForm.pop();
          $mdDialog.hide(data);
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.cancel = () => {
      if (SupplierQuoteFactory.isPricingChange) {
        showWithoutSavingAlert();
      } else {
        SupplierQuoteFactory.isPricingChange = false;
        BaseService.currentPageFlagForm.pop();
        $mdDialog.hide(data);
      }
    };
    angular.element(() => {
      BaseService.currentPageFlagForm = [SupplierQuoteFactory.isPricingChange];
    });
  }
})();
