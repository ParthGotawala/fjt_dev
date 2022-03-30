(function () {
  'use strict';

  angular
    .module('app.transaction.kitAllocation')
    .controller('UpdateKitMrpQtyPopUpController', UpdateKitMrpQtyPopUpController);

  function UpdateKitMrpQtyPopUpController($mdDialog, DialogFactory, CORE, BaseService, data, USER, CONFIGURATION, SalesOrderFactory, TRANSACTION) {
    const vm = this;
    const lineDetail = data;
    vm.LabelConstant = CORE.LabelConstant;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.updateQtyModel = {};
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.Kit_Release_Status = TRANSACTION.KIT_RELEASE_STATUS;

    vm.goToSalesOrderList = () => {
      BaseService.goToSalesOrderList();
      return false;
    };

    vm.goToSalesOrderDetails = (data) => {
      BaseService.goToManageSalesOrder(data.id);
      return false;
    };

    vm.goToAssemblyList = () => {
        BaseService.goToPartList();
      return false;
    };

    vm.goToAssemblyDetails = (data) => {
        BaseService.goToComponentDetailTab(null, data.partID);
      return false;
    };

    const getSalesOrderDetailById = () => {
      if (lineDetail) {
        vm.cgBusyLoading = SalesOrderFactory.getSalesOrderDetailById().query({ id: lineDetail.salesOrderDetail }).$promise.then((res) => {
          if (res && res.data) {
            vm.updateQtyModel = res.data;

            vm.headerdata = [];
            vm.headerdata.push(
              {
                label: vm.LabelConstant.SalesOrder.PO,
                value: vm.updateQtyModel.salesOrderMst.poNumber,
                displayOrder: 1,
                labelLinkFn: vm.goToSalesOrderList,
                valueLinkFn: vm.goToSalesOrderDetails,
                valueLinkFnParams: { id: vm.updateQtyModel.salesOrderMst.id }
              },
              {
                label: vm.LabelConstant.SalesOrder.SO,
                value: vm.updateQtyModel.salesOrderMst.salesOrderNumber,
                displayOrder: 2,
                labelLinkFn: vm.goToSalesOrderList,
                valueLinkFn: vm.goToSalesOrderDetails,
                valueLinkFnParams: { id: vm.updateQtyModel.salesOrderMst.id }
              },
              {
                label: vm.LabelConstant.Assembly.PIDCode,
                value: vm.updateQtyModel.componentAssembly.PIDCode,
                displayOrder: 3,
                labelLinkFn: vm.goToAssemblyList,
                valueLinkFn: vm.goToAssemblyDetails,
                valueLinkFnParams: { partID: vm.updateQtyModel.componentAssembly.id },
                isCopy: true,
                isCopyAheadLabel: false,
                isAssy: true,
                imgParms: {
                  imgPath: stringFormat('{0}{1}{2}', _configWebUrl, USER.ROHS_BASE_PATH, vm.updateQtyModel.componentAssembly.rfq_rohsmst.rohsIcon),
                  imgDetail: vm.updateQtyModel.componentAssembly.rfq_rohsmst.name
                }
              },
              {
                label: 'Kit Number',
                value: vm.updateQtyModel.kitNumber,
                displayOrder: 4
              },
              {
                label: vm.LabelConstant.SalesOrder.POQTY,
                value: vm.updateQtyModel.qty,
                displayOrder: 5
              }
            );
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    const getDataKey = () => SalesOrderFactory.getDataKey().query().$promise.then((dataKey) => {
      if (dataKey) {
        vm.dataKey = dataKey.data;
        _.each(vm.dataKey, (item) => {
          if (item.key === CONFIGURATION.SETTING.POvsMRPQtyTolerancePer) {
            vm.POvsMRPQtyTolerancePer = item.values;
            return vm.POvsMRPQtyTolerancePer;
          }
        });
      }
    }).catch((error) => BaseService.getErrorLog(error));

    getSalesOrderDetailById();
    getDataKey();

    vm.changeQty = () => {
      if (vm.updateQtyModel.mrpQty && vm.updateQtyModel.qty) {
        const data = {};
        data.POvsMRPQtyTolerancePer = vm.POvsMRPQtyTolerancePer;
        data.listAssabelyDetail = vm.updateQtyModel;
        data.listAssabelyDetail.salesOrderId = vm.updateQtyModel.salesOrderMst.id;
        data.listAssabelyDetail.PIDCode = vm.updateQtyModel.componentAssembly.PIDCode;
        data.listAssabelyDetail.mfgPN = vm.updateQtyModel.componentAssembly.mfgPN;
        data.listAssabelyDetail.rohsIcon = stringFormat('{0}{1}', vm.rohsImagePath, vm.updateQtyModel.componentAssembly.rfq_rohsmst.rohsIcon);
        data.listAssabelyDetail.rohsText = vm.updateQtyModel.componentAssembly.rfq_rohsmst.name;
        data.salesOrderNumber = vm.updateQtyModel.salesOrderMst.salesOrderNumber;
        data.revision = vm.updateQtyModel.salesOrderMst.revision;
        data.listAssabelyDetail.isOpenInOtherWindow = true;
        vm.updateQtyModel.kitQty = vm.updateQtyModel.kitQty ? vm.updateQtyModel.kitQty : vm.updateQtyModel.mrpQty;
        //here check formula for po qty more then and less than 25%
        //vm.POvsMRPQtyTolerancePer system configuration variable

        const toleranceQtypercentage = parseFloat(vm.updateQtyModel.qty) * vm.POvsMRPQtyTolerancePer / 100;
        const toleranceQtymore = toleranceQtypercentage + parseFloat(vm.updateQtyModel.qty);
        const toleranceQtyless = parseFloat(vm.updateQtyModel.qty) - toleranceQtypercentage;
        if ((parseFloat(vm.updateQtyModel.mrpQty) > toleranceQtymore || parseFloat(vm.updateQtyModel.mrpQty) < toleranceQtyless)) {
          DialogFactory.dialogService(
            CORE.TOLERANCE_QTY_CONFIRMATION_MODAL_CONTROLLER,
            CORE.TOLERANCE_QTY_CONFIRMATION_MODAL_VIEW,
            null,
            data).then((data) => {
              if (data) {
                setFocus('updateKitQty');
              } else {
                setFocus('mrpQty');
                vm.updateQtyModel.mrpQty = null;
              }
            }, (err) => BaseService.getErrorLog(err));
        };
      }
    };

    vm.saveQty = (isUpdateKitMrp) => {
      if (BaseService.focusRequiredField(vm.formUpdateKitMrpQty)) {
        return;
      }

      if (vm.updateQtyModel) {
        const saveObj = {
          id: vm.updateQtyModel.id,
          mrpQty: vm.updateQtyModel.mrpQty,
          poQty: vm.updateQtyModel.qty,
          kitQty: vm.updateQtyModel.kitQty,
          partID: vm.updateQtyModel.partID,
          PIDCode: vm.updateQtyModel.componentAssembly.PIDCode,
          kiNumber: vm.updateQtyModel.kitNumber,
          isUpdateKitMrp: isUpdateKitMrp ? isUpdateKitMrp : (vm.updateQtyModelCopy.kitQty !== vm.updateQtyModel.kitQty ? false : true)
        };

        vm.cgBusyLoading = SalesOrderFactory.updateKitMrpQty().query(saveObj).$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            if (response.data) {
              const errorResData = response.data;
              if (response.data.messageTypeCode === 1) {
                const model = {
                  messageContent: errorResData.messageContent,
                  multiple: true
                };
                DialogFactory.messageAlertDialog(model).then((yes) => {
                  if (yes) {
                    setFocus('updateKitQty');
                  }
                }, () => {
                }).catch((error) => BaseService.getErrorLog(error));
              } else if (response.data.messageTypeCode === 2) {
                const model = {
                  messageContent: errorResData.messageContent,
                  btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
                  canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                };
                DialogFactory.messageConfirmDialog(model).then(() => {
                  vm.saveQty(true);
                }, () => {
                  setFocus('updateKitQty');
                }).catch((error) => BaseService.getErrorLog(error));
              }
            } else {
              vm.formUpdateKitMrpQty.$setPristine();
              BaseService.currentPagePopupForm = [];
              $mdDialog.cancel(saveObj);
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.updateQtyModelCopy = _.clone(vm.updateQtyModel);
    vm.checkDirtyObject = {
      oldModelName: vm.updateQtyModelCopy,
      newModelName: vm.updateQtyModel
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      if (checkDirty) {
        vm.checkDirty = true;
      }
      return vm.checkDirty;
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.formUpdateKitMrpQty, vm.checkDirtyObject);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        vm.formUpdateKitMrpQty.$setPristine();
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel();
      }
    };

    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.formUpdateKitMrpQty];
    });
  }
})();
