(function () {
  'use strict';

  angular
    .module('app.rfqtransaction')
    .controller('ManagePartCostingApiPopupController', ManagePartCostingApiPopupController);

  /** @ngInject */
  function ManagePartCostingApiPopupController($mdDialog, $filter, CORE, RFQTRANSACTION,
    data, PartCostingFactory, BaseService, DialogFactory, PRICING, CONFIGURATION, MasterFactory) {
    const vm = this;
    vm.currentData = _.clone(data);
    vm.lineitemsheaderNoAddedList = [];
    const SupplierApis = _.clone(CORE.Suppliers_Api);
    vm.buttonTitle = RFQTRANSACTION.PART_COSTING.CHECK_ALL;
    vm.externalLink = CORE.EXTERNALAPI;
    vm.checked = true;
    vm.cancel = (data) => {
      $mdDialog.cancel(data);
    };
    vm.customprice = data.customprice;
    vm.isPurchaseApi = data.isPurchaseApi ? data.isPurchaseApi : false;

    vm.exact = false;
    vm.cgBusyLoading = PartCostingFactory.getSupplierList().query({ isPricing: true }).$promise.then((suppliers) => {
      _.each(suppliers.data, (item) => {
        var obj = _.find(SupplierApis, (supp) => parseInt(supp.ID) === item.id);
        if (obj) {
          item.Image = obj.ID === -6 ? stringFormat(obj.Image, WebsiteBaseUrl) : obj.Image;
        }
        else {
          item.Image = '';
        }
        if (data.lineItemList.length > 0) {
          const objDate = _.find(data.lineItemList[0].autoPricingStatus, (status) => parseInt(status.pricingSupplierID) === item.id);
          if (objDate && objDate.statusChangeDate) {
            item.lastPricedDate = $filter('date')(new Date(objDate.statusChangeDate), _dateTimeDisplayFormat);
          }
          else {
            item.lastPricedDate = 'None';
          };
        }
        else {
          item.lastPricedDate = 'None';
        }
      });
      vm.Suppliers = _.sortBy(suppliers.data, (o) => o.mfgName);
    }).catch((error) => BaseService.getErrorLog(error));
    checkAccessToken();
    //check digikey token status
    function checkAccessToken() {
      PartCostingFactory.checkAccessToken().query().$promise.then((suppliers) => {
        vm.digikeytokenexpire = (suppliers && suppliers.data && suppliers.data.status && suppliers.status !== 'SUCCESS') ? true : false;
      });
    }

    //generate token
    vm.generateToken = (ev) => {
      const data = {
        appID: PRICING.APP_DK_TYPE.FJTV3,
        isNewVersion: true
      };
      DialogFactory.dialogService(
        CORE.DIGIKEY_VERIFICATION_MODAL_CONTROLLER,
        CORE.DIGIKEY_VERIFICATION_MODAL_VIEW,
        ev,
        data).then(() => {
          vm.digikeytokenexpire = false;
        }, (err) => BaseService.getErrorLog(err));
    };
    //check uncheck all checkbox for api pricing suppliers
    vm.checkUncheckAll = (ischecked) => {
      _.each(vm.Suppliers, (item) => {
        if (item.isSupplierEnable) {
          item.isChecked = ischecked;
        }
      });
      vm.buttonTitle = ischecked ? RFQTRANSACTION.PART_COSTING.UNCHECK_ALL : RFQTRANSACTION.PART_COSTING.CHECK_ALL;
      vm.checked = !ischecked;
    };
    //check for button checkall/uncheckall
    vm.checkAll = () => {
      if (_.find(vm.Suppliers, (api) => !api.isChecked)) {
        vm.buttonTitle = RFQTRANSACTION.PART_COSTING.CHECK_ALL;
        vm.checked = true;
      }
      else {
        vm.buttonTitle = RFQTRANSACTION.PART_COSTING.UNCHECK_ALL;
        vm.checked = false;
      }
    };
    //enable/disable submit button for api price
    vm.disableButton = () => _.find(vm.Suppliers, (api) => api.isChecked);
    //send pricing request for selected api
    vm.getPricing = () => {
      const obj = {
        title: CORE.MESSAGE_CONSTANT.PUBLISHTEMPLATE_CONFIRM,
        textContent: RFQTRANSACTION.PRICING.PRICE_UPDATE_CONFIRM,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.confirmDiolog(obj).then((yes) => {
        if (yes) {
          const selectedLineItem = [];
          _.each(data.lineItemList, (item) => {
            if (item.isPurchase) {
              const prcObj = {};
              prcObj.id = vm.isPurchaseApi ? item.rfqLineItemsId : item.id;
              prcObj.rfqAssyID = vm.isPurchaseApi ? item.refSalesOrderDetId : item.rfqAssyID;
              item.status = PRICING.PRICING_STATUS.SendRequest;
              item.pricingList = prcObj.pricingList = _.filter(vm.Suppliers, (detail) => detail.isChecked);
              selectedLineItem.push(prcObj);
            }
          });
          // progress bar
          if (selectedLineItem.length > 0) {
            const consolidateIds = _.map(selectedLineItem, 'id');
            vm.cgBusyLoading = MasterFactory.getSelectedGlobalSettingKeyValues().query({ allKeys: [CONFIGURATION.SETTING.DKVersion] }).$promise.then((response) => {
              if (response.data) {
                _.each(response.data, (item) => {
                  switch (item.key) {
                    case CONFIGURATION.SETTING.DKVersion:
                      _DkVersion = item.values;
                      break;
                  }
                });
                const selectSupplierList = _.filter(vm.Suppliers, (detail) => detail.isChecked);
                vm.cgBusyLoading = PartCostingFactory.getPricingFromApis().query({ pricingApiObj: { pricingApiList: selectedLineItem, isCustomPrice: vm.customprice, consolidateIds: consolidateIds, isPurchaseApi: vm.isPurchaseApi, DKVersion: _DkVersion, selectSupplierList: selectSupplierList } }).$promise.then((res) => {
                  if (res.status !== 'FAILED') {
                    data.UpdatePricingStatus(data.lineItemList);
                    vm.cancel(data.lineItemList);
                  }
                }).catch((error) => BaseService.getErrorLog(error));
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
          else {
            vm.cancel(data);
          }
        }
      }, () => {
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //open supplier link in new tab
    vm.supplierApiCall = (ID) => {
      var supplierObj = _.find(SupplierApis, (supplier) => supplier.ID == ID);
      if (supplierObj && supplierObj.Partlink && vm.currentData.lineItemList.length === 1 && vm.currentData.lineItemList[0].mfgComponents.length === 1) {
        const mfgPN = vm.currentData.lineItemList[0].mfgComponents[0].split('@@@');
        const mfgComopnent = mfgPN[22];
        BaseService.openURLInNew(stringFormat(supplierObj.Partlink, mfgComopnent));
      }
      else if (supplierObj) {
        BaseService.openURLInNew(supplierObj.link);
      }
    };
  }
})();
