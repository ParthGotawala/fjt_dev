(function () {
  'use strict';

  angular
    .module('app.transaction.transferstock')
    .controller('TransferEmptyBinPopupController', TransferEmptyBinPopupController);

  /** @ngInject */
  function TransferEmptyBinPopupController($mdDialog, $q, $timeout, data, BaseService, CORE, TRANSACTION, TransferStockFactory, BinFactory, DialogFactory, WarehouseBinFactory) {
    const vm = this;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.transferStockMessages = CORE.MESSAGE_CONSTANT.TRANSFER_STOCK;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.warehouseType = TRANSACTION.warehouseType;
    vm.isConfirmation = data && typeof data.isConfirmation != 'undefined' ? data.isConfirmation : true;
    vm.transferItemDet = data;
    vm.scanAndSearch = {
      scanWarehouse: null
    };

    vm.tranferTo = {
      deptID: null,
      whID: null
    };

    vm.goToKitList = (kitDetail) => {
      if (kitDetail) {
        BaseService.goToKitList(kitDetail.refSalesOrderDetID, kitDetail.assyID, null);
      }
      else {
        BaseService.goToKitList();
      }
    };

    vm.headerData = [{
      label: 'Kit',
      labelLinkFn: vm.goToKitList,
      value: vm.transferItemDet.sourceModelName,
      valueLinkFn: vm.goToKitList,
      valueLinkFnParams: { assyID: vm.transferItemDet.stockDetail.assyID, refSalesOrderDetID: vm.transferItemDet.stockDetail.refSalesOrderDetID },
      displayOrder: 1
    }];


    vm.emptyBinWHList = _.uniqBy(vm.transferItemDet.emptyBinWHList, 'warehouseID');

    var whNameList = _.uniq(_.map(vm.emptyBinWHList, (item) => { return `${item.warehouseName} [Empty Bin: ${item.emptyBin}]`; })).join(", ");
    var whNameListWithoutEmptyBin = _.uniq(_.map(vm.emptyBinWHList, 'warehouseName')).join(", ");

    vm.confirmationMessage = stringFormat(vm.transferStockMessages.TRANSFER_KIT_WITH_EMPTY_BIN_CONFIRMATION, whNameList, vm.transferItemDet.sourceModelName, vm.transferItemDet.deptTransferToName);
    vm.confirmationMessageForTransferWH = stringFormat(vm.transferStockMessages.TRANSFER_WH_WITH_EMPTY_BIN_CONFIRMATION, whNameList, whNameListWithoutEmptyBin, vm.transferItemDet.deptTransferToName);

    let initSearchAutoComplete = () => {
      vm.autoCompleteToDept = {
        columnName: 'Name',
        keyColumnName: 'ID',
        keyColumnId: vm.transferItemDet && vm.transferItemDet.transferFromDept && vm.transferItemDet.transferFromDept.ID ? vm.transferItemDet.transferFromDept.ID : null,
        inputName: 'fromDept',
        placeholderName: 'Department',
        isRequired: true,
        isAddnew: false,
        isDisabled: true,
        callbackFn: getDeptList,
        onSelectCallbackFn: (item) => {
          vm.tranferTo.deptID = item ? item.ID : null;
        }
      };
    };

    /* Retrieve list of active department for search */
    let getDeptList = () => {
      vm.deptList = [];
      return BinFactory.getAllWarehouse({ isDepartment: true }).query().$promise.then((deptlist) => {
        vm.deptList = deptlist.data;
        return $q.resolve(vm.deptList);
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    let active = () => {
      var autocompletePromise = [getDeptList()];
      vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
        initSearchAutoComplete();
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    active();

    /* Scan warehouse to transfer stock */
    vm.scanWarehouse = ($event, isEnter) => {
      $timeout(function () {
        if (isEnter) {
          if ($event.keyCode == 13) {
            if (vm.scanAndSearch.scanWarehouse) {
              setFocus('btnTransferBin');
            }
          }
        } else {
          vm.searchWarehouse();
        }
      });
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent($event);
    };

    /* Search detail of scan warehouse to transfer stock */
    vm.searchWarehouse = () => {
      if (vm.scanAndSearch.scanWarehouse) {
        WarehouseBinFactory.getWarehouseDetailByName().query({ name: vm.scanAndSearch.scanWarehouse }).$promise.then((response) => {
          let messageContent = null;
          if (response && response.data) {
            if (_.find(vm.emptyBinWHList, { warehouseID: response.data.id })) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.EMPTY_BIN_NOT_TRANSFER_IN_SAME_KIT_WH);
            }
            else if (response.data.warehouseType != vm.warehouseType.ShelvingCart.key) {
              let WHType = BaseService.getWarehouseType(response.data.warehouseType);
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.EMPTY_BIN_NOT_TRANSFER_OTHER_THEN_SHELVING_CART);
              messageContent.message = stringFormat(messageContent.message, WHType);
            }
            else if (response.data.allMovableBin != 1) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.EMPTY_BIN_NOT_TRANSFER_TO_PERMANENT_BIN_WH);
            }
            else {
              vm.transferToWH = response.data;
              vm.autoCompleteToDept.keyColumnId = vm.transferToWH.parentWHID;
              setFocus('btnTransferBin');
            }
          }
          else {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.EMPTY_BIN_NOT_TRANSFER_TO_PERMANENT_BIN_WH);
          }
          if (messageContent) {
            var model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.scanAndSearch.scanWarehouse = null;
                vm.autoCompleteToDept.keyColumnId = null;
                vm.transferToWH = null;
                
                setFocus('scanWarehouse');
              }
            }).catch((error) => {
              return BaseService.getErrorLog(error);
            });
          }
        }).catch((error) => {
        });
      }
      else {
        vm.transferToWH = null;
      }
    };

    vm.transferBin = ($event) => {
      $event.preventDefault();
      $event.stopPropagation();

      if (vm.transferEmptyBinForm.$invalid) {
        BaseService.focusRequiredField(vm.transferEmptyBinForm);
        return;
      }

      let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.EMPTY_BIN_TRANSFER_CONFIRMATION);
      messageContent.message = stringFormat(messageContent.message, vm.scanAndSearch.scanWarehouse, vm.transferToWH.parentWarehouseMst.Name);

      let objConfirmation = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT,
        multiple: true
      };
      DialogFactory.messageConfirmDialog(objConfirmation).then((yes) => {
        if (yes) {
          vm.tranferEmptyBinToWH();
        }
      }, (cancel) => {
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    vm.tranferEmptyBinToWH = () => {
      vm.cgBusyLoading = TransferStockFactory.tranferEmptyBinToWH().query({
        warehouseIDs: _.uniq(_.map(vm.emptyBinWHList, 'warehouseID')).join(","),
        transferToWHID: vm.transferToWH.id
      }).$promise.then((res) => {
        if (res && res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
          BaseService.currentPagePopupForm = [];
          $mdDialog.hide({
            transferToWH: vm.transferToWH,
            transferDetail: data,
            action: TRANSACTION.TRANSFER_EMPTY_BIN_ACTION.TRANSFER_EMPTY_BIN
          });
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    vm.transferStock = ($event) => {
      BaseService.currentPagePopupForm = [];

      $mdDialog.hide({
        transferToWH: vm.transferToWH,
        transferDetail: data,
        action: TRANSACTION.TRANSFER_EMPTY_BIN_ACTION.CONTINUE
      });
    };

    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.transferEmptyBinForm);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    }

    // Check Form Dirty state on state change and reload browser
    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.transferEmptyBinForm];
    });

    vm.goToWHList = () => {
      BaseService.goToWHList();
    };

    vm.transferBinConfirmation = ($event) => {
      vm.isConfirmation = false;
      setFocus('scanWarehouse');
    };

    if (!vm.isConfirmation) {
      vm.transferBinConfirmation();
    }
  }
})();
