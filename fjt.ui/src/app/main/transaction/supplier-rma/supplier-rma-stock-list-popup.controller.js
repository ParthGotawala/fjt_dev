(function () {
  'use strict';

  angular
    .module('app.transaction.supplierRMA')
    .controller('SupplierRMAStockPopUpController', SupplierRMAStockPopUpController);

  function SupplierRMAStockPopUpController($mdDialog, $timeout, DialogFactory, CORE, USER, TRANSACTION, BaseService, data, PackingSlipFactory, BinFactory) {
    const vm = this;
    vm.rmaLineDetail = data;
    vm.LabelConstant = CORE.LabelConstant;
    vm.RMAStockStatus = TRANSACTION.RMAStockStatus;
    vm.packingSlipReceivedStatus = TRANSACTION.PackingSlipReceivedStatus;
    vm.headerdata = [];
    vm.query = {
      order: ''
    };
    vm.totalAvailableQty = 0;
    vm.totalShipementQty = 0;
    vm.isAllSelect = false;
    vm.anySelect = false;
    vm.isDisable = true;

    let saveStockList = [];

    vm.goToPackingSlipList = () => {
      BaseService.goToPackingSlipList();
    };

    vm.goToManagePackingSlipDetail = () => {
      BaseService.goToManagePackingSlipDetail(vm.rmaLineDetail.packingSlipId);
    };

    vm.goToInvoiceList = () => {
      BaseService.goToSupplierInvoiceList();
    };

    vm.invoiceDetail = () => {
      BaseService.goToSupplierInvoiceDetail(null, vm.rmaLineDetail.invoiceId);
    };

    vm.goToPackaging = () => {
      BaseService.goToPackaging();
    };
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };
    vm.goToComponentDetail = () => {
      BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG, vm.rmaLineDetail.mfrPnId, USER.PartMasterTabs.Detail.Name);
    };

    vm.headerdata.push(
      {
        label: vm.LabelConstant.SupplierInvoice.PackingSlipNumber,
        value: vm.rmaLineDetail.packingSlipNumber,
        displayOrder: 1,
        labelLinkFn: vm.goToPackingSlipList,
        valueLinkFn: vm.goToManagePackingSlipDetail,
        isCopy: true
      },
      {
        label: vm.LabelConstant.SupplierInvoice.InvoiceNumber,
        value: vm.rmaLineDetail.invoiceNumber,
        displayOrder: 2,
        labelLinkFn: vm.goToInvoiceList,
        valueLinkFn: vm.invoiceDetail,
        isCopy: true
      },
      {
        label: vm.LabelConstant.MFG.PID,
        value: vm.rmaLineDetail.PIDCode,
        displayOrder: 3,
        labelLinkFn: vm.goToPartList,
        valueLinkFn: vm.goToComponentDetail,
        isCopy: true,
        isCopyAheadLabel: true,
        imgParms: {
          imgPath: vm.rmaLineDetail.rohsIcon !== null ? stringFormat(CORE.RoHSImageFormat, CORE.WEB_URL, USER.ROHS_BASE_PATH, vm.rmaLineDetail.rohsIcon) : null,
          imgDetail: vm.rmaLineDetail.rohsName
        },
        isCopyAheadOtherThanValue: true,
        copyAheadLabel: vm.LabelConstant.MFG.MFGPN,
        copyAheadValue: vm.rmaLineDetail.mfgPN
      },
      {
        label: vm.LabelConstant.UMIDManagement.Packaging,
        value: vm.rmaLineDetail.packagingName,
        displayOrder: 4,
        labelLinkFn: vm.goToPackaging
      }
    );

    const getSupplierRMAStockList = (isRefresh) => {
      vm.cgBusyLoading = PackingSlipFactory.getSupplierRMAStockList().query({
        rmaDetailId: vm.rmaLineDetail.rmaDetailId,
        packingSlipId: vm.rmaLineDetail.packingSlipId,
        packingSlipDetailId: vm.rmaLineDetail.packingSlipDetailId,
        partId: vm.rmaLineDetail.mfrPnId,
        packagingId: vm.rmaLineDetail.packagingId
      }).$promise.then((stockList) => {
        if (stockList && stockList.data && stockList.data.length > 0) {
          vm.stockList = stockList.data;

          _.map(vm.stockList, (data) => {
            data.isSelect = data.stockId ? true : false;
            data.isNotValidShipmentQty = false;
            data.rmaId = vm.rmaLineDetail.rmaId;
            data.packingSlipId = vm.rmaLineDetail.packingSlipId;
            data.packingSlipDetId = vm.rmaLineDetail.packingSlipDetailId;
            data.orgAvailableQty = data.stockId ? CalcSumofArrayElement([data.availableQty, data.shipmentQty], _unitFilterDecimal) : angular.copy(data.availableQty);

            const checkAnyNotSelect = _.some(vm.stockList, (data) => !data.isSelect);
            if (checkAnyNotSelect) {
              vm.isAllSelect = false;
            } else {
              vm.isAllSelect = true;
            }
            checkAnyError();
          });

          if (vm.stockList.length === 1 && data.rmaStockDetailList.length === 0) {
            data.rmaStockDetailList = vm.stockList;
            _.map(data.rmaStockDetailList, (data) => {
              data.isSelect = true;
            });
          }

          if (vm.rmaLineDetail.rmaDetailId && vm.stockList.length === 1 && data.rmaStockDetailList.length === 0) {
            _.map(data.rmaStockDetailList, (data) => {
              data.isSelect = true;
              data.orgAvailableQty = data.stockId ? CalcSumofArrayElement([data.availableQty, data.shipmentQty], _unitFilterDecimal) : angular.copy(data.availableQty);

              if (data.umidId) {
                data.availableQty = CalcSumofArrayElement([data.orgAvailableQty, (data.availableQtyAtRMA * -1)], _unitFilterDecimal);
              } else {
                data.availableQty = CalcSumofArrayElement([data.orgAvailableQty, (data.shipmentQty * -1)], _unitFilterDecimal);
              }
              data.shipmentQty = angular.copy(data.availableQty);
              data.availableQty = 0;
              vm.formSupplierRMAStock.$setDirty();
            });
          }

          const selectedRecord = _.filter(data.rmaStockDetailList, (data) => data.isSelect);
          _.map(selectedRecord, (data) => {
            const selectUIMID = _.find(vm.stockList, (item) => item.umidId && item.umidId === data.umidId);
            if (selectUIMID) {
              selectUIMID.isSelect = true;
              if (!isRefresh) {
                selectUIMID.shipmentQty = data.shipmentQty || CalcSumofArrayElement([data.orgAvailableQty, (data.shipmentQty * -1)], _unitFilterDecimal);
              }
              /**commented stock Id contidion due to bellow case date 02-04-2021
               * 1.non UMID stock available Qty=550, create RMA for 200 QTY save it in DB
               * 2. next time in edit mode available Qty Shows 350 and RMA Qty 200, which is correct
               * 3. now update RMA qty 200 to 500 save only from popup, not from main page
               * 4. open opup again, now it will show available Qty 350 and RMA qty 500, which is wrong
               * 5. now if you change RMA qty then it show correct calculation*/
              //if (!selectUIMID.stockId) {
              selectUIMID.availableQty = CalcSumofArrayElement([selectUIMID.orgAvailableQty, (selectUIMID.availableQtyAtRMA * -1)], _unitFilterDecimal);
              //}
            } else {
              const selectPendingUIMID = _.find(vm.stockList, (item) => !data.umidId && data.partId === item.partId && data.binId === item.binId && data.packagingId === item.packagingId);
              if (selectPendingUIMID) {
                selectPendingUIMID.isSelect = true;
                if (!isRefresh) {
                  selectPendingUIMID.shipmentQty = data.shipmentQty || CalcSumofArrayElement([data.orgAvailableQty, (data.shipmentQty * -1)], _unitFilterDecimal);
                }
                //if (!selectPendingUIMID.stockId) {
                selectPendingUIMID.availableQty = CalcSumofArrayElement([selectPendingUIMID.orgAvailableQty, (selectPendingUIMID.shipmentQty * -1)], _unitFilterDecimal);
                //}
              }
            }
          });

          const checkAnyNotSelect = _.some(vm.stockList, (data) => !data.isSelect);
          if (checkAnyNotSelect) {
            vm.isAllSelect = false;
          } else {
            vm.isAllSelect = true;
          }
          checkAnyError();
          getFooterTotal();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    getSupplierRMAStockList();

    vm.refreshData = () => {
      if (vm.formSupplierRMAStock.$dirty) {
        const obj = {
          messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.BARCODE_MESSAGE_LOST,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.formSupplierRMAStock.$setPristine();
            vm.formSupplierRMAStock.$setUntouched();
            getSupplierRMAStockList();
          }
        }, () => false);
      } else {
        data.rmaStockDetailList = [];
        getSupplierRMAStockList();
      }
    };

    vm.goToUMIDManagement = (item) => BaseService.goToUMIDDetail(item.umidId);

    vm.selectStock = (item) => {
      if (item.isSelect) {
        //item.shipmentQty = angular.copy(item.availableQty);
        item.shipmentQty = Math.ceil(item.availableQty);
        item.availableQty = 0;
        item.isSelect = true;
        item.transferBinId = null;
        item.transferBinName = null;
        item.transferWarehouseId = null;
        item.transferWarehouseName = null;
        item.transferParentWarehouseId = null;
        item.transferParentWarehouseName = null;
        getFooterTotal();
      } else {
        if (item.type === 'U') {
          item.availableQty = item.availableQtyAtRMA;
        } else {
          item.availableQty = CalcSumofArrayElement([(item.availableQty || 0), item.shipmentQty], _unitFilterDecimal);
        }
        item.shipmentQty = 0;
        getFooterTotal();
        //vm.totalAvailableQty = CalcSumofArrayElement([vm.totalAvailableQty, item.availableQty]);
        //vm.totalShipementQty = CalcSumofArrayElement([vm.totalShipementQty, (item.shipmentQty * -1)], 0);
      }

      const checkAnyNotSelect = _.some(vm.stockList, (data) => !data.isSelect);
      if (checkAnyNotSelect) {
        vm.isAllSelect = false;
      } else {
        vm.isAllSelect = true;
      }
      checkAnyError();
    };

    vm.inputShipmentQty = (item) => {
      if (item.isSelect) {
        if (item.shipmentQty > item.orgAvailableQty || !item.shipmentQty) {
          item.isNotValidShipmentQty = true;
        } else {
          item.isNotValidShipmentQty = false;
        }

        item.availableQty = CalcSumofArrayElement([item.orgAvailableQty, (item.shipmentQty * -1)], _unitFilterDecimal);
        item.availableQty = item.availableQty > 0 ? item.availableQty : 0;

        getFooterTotal();
      }
      checkAnyError();
    };

    vm.selectAllStock = () => {
      if (vm.isAllSelect) {
        _.map(vm.stockList, (data) => {
          if (!data.isSelect) {
            //data.shipmentQty = angular.copy(data.availableQty);
            data.shipmentQty = Math.ceil(data.availableQty);
            data.availableQty = 0;
          }
          data.isSelect = true;
          data.transferBinId = null;
          data.transferBinName = null;
          data.transferWarehouseId = null;
          data.transferWarehouseName = null;
          data.transferParentWarehouseId = null;
          data.transferParentWarehouseName = null;
        });
      } else {
        _.map(vm.stockList, (data) => {
          data.isSelect = false;
          //data.availableQty = CalcSumofArrayElement([(data.availableQty || 0), data.shipmentQty], _unitFilterDecimal);
          if (data.type === 'U') {
            data.availableQty = data.availableQtyAtRMA;
          } else {
            data.availableQty = CalcSumofArrayElement([(data.availableQty || 0), data.shipmentQty], _unitFilterDecimal);
          }

          data.shipmentQty = 0;
        });
        vm.isDisable = true;
      }

      getFooterTotal();
      checkAnyError();
    };

    const checkAnyError = () => {
      const checkAnySelect = _.some(vm.stockList, (data) => data.isSelect || (!data.isSelect && data.stockId));
      const checkNotValid = _.some(vm.stockList, (data) => data.isNotValidShipmentQty);
      if (checkAnySelect && !checkNotValid) {
        vm.isDisable = false;
      } else {
        vm.isDisable = true;
      }
    };

    const getFooterTotal = () => {
      vm.totalAvailableQty = CalcSumofArrayElement(_.map(vm.stockList, (data) => data.availableQty), _unitFilterDecimal);
      vm.totalShipementQty = CalcSumofArrayElement(_.map(vm.stockList, (data) => data.isSelect && data.shipmentQty), _unitFilterDecimal);
    };

    vm.scanBin = ($event, isEnter, item, index) => {
      $timeout(() => {
        if (isEnter) {
          if ($event.keyCode === 13) {
            $event.preventDefault();
            $event.stopPropagation();
            if (item.transferBinName) {
              setFocus('btnCancel');
            }
          }
        } else {
          vm.getLocationBinDetail(item, index);
        }
      });
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent($event);
    };

    vm.getLocationBinDetail = (item, index) => {
      if (item.transferBinName) {
        item.transferBinId = null;
        BinFactory.getBinDetailByName().query({
          name: item.transferBinName
        }).$promise.then((response) => {
          if (response && response.data) {
            if (response.data.warehousemst && response.data.warehousemst.parentWarehouseMst) {
              PackingSlipFactory.checkBinContainSamePSAndPart().query({
                packingSlipId: vm.rmaLineDetail.packingSlipId,
                partId: vm.rmaLineDetail.mfrPnId,
                binId: response.data.id
              }).$promise.then((ValidationResponse) => {
                if (ValidationResponse && ValidationResponse.data) {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BIN_CONTAIN_SAME_PS_PART);
                  messageContent.message = stringFormat(messageContent.message, response.data.Name, ValidationResponse.data.component.PIDCode, ValidationResponse.data.packing_slip_material_receive.packingSlipNumber, ValidationResponse.data.packing_slip_material_receive.mfgCodemst.mfgCodeName);
                  const model = {
                    messageContent: messageContent,
                    multiple: true
                  };
                  DialogFactory.messageAlertDialog(model).then((yes) => {
                    if (yes) {
                      item.transferBinId = item.transferBinName = item.transferWarehouseId = item.transferWarehouseName = item.transferParentWarehouseId = item.transferParentWarehouseName = null;
                      setFocus('transferBinName_' + index);
                    }
                  }).catch((error) => BaseService.getErrorLog(error));
                } else {
                  item.transferBinId = response.data.id;
                  item.transferBinName = response.data.Name;
                  item.transferWarehouseName = response.data.warehousemst.Name;
                  item.transferWarehouseId = response.data.warehousemst.id;
                  item.transferParentWarehouseName = response.data.warehousemst.parentWarehouseMst.Name;
                  item.transferParentWarehouseId = response.data.warehousemst.parentWarehouseMst.id;
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }
          else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SCAN_VALID_BIN);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                item.transferBinId = item.transferBinName = item.transferWarehouseId = item.transferWarehouseName = item.transferParentWarehouseId = item.transferParentWarehouseName = null;
                setFocus('transferBinName_' + index);
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        item.transferBinId = item.transferBinName = item.transferWarehouseId = item.transferWarehouseName = item.transferParentWarehouseId = item.transferParentWarehouseName = null;
      }
    };

    vm.saveStockDetail = () => {
      if (BaseService.focusRequiredField(vm.formSupplierRMAStock)) {
        return;
      }

      _.map(vm.stockList, (data) => {
        if (data.isSelect && !data.stockId) {
          data.transactionAction = 'Add';
        } else if (data.isSelect && data.stockId) {
          data.transactionAction = 'Edit';
        } else if (!data.isSelect && data.stockId) {
          data.transactionAction = 'Delete';
        }
      });

      saveStockList = _.filter(vm.stockList, (data) => data.transactionAction);
      BaseService.currentPagePopupForm = [];
      $mdDialog.cancel(saveStockList);
    };

    vm.cancel = () => {
      if (vm.formSupplierRMAStock.$dirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        vm.formSupplierRMAStock.$setPristine();
        vm.formSupplierRMAStock.$setUntouched();
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel();
      }
    };

    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.formSupplierRMAStock];
    });
  }
})();
