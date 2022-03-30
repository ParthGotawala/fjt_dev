

(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('BinTransferPopUpController', BinTransferPopUpController);

  function BinTransferPopUpController($scope, $state, $rootScope, $mdDialog, $timeout, data, CORE, TRANSACTION, PRICING, DialogFactory, BaseService, BinFactory) {
    const vm = this;
    vm.currentState = $state.current.name;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.screenName = TRANSACTION.UMID_STATUS_LIST_SCREEN.Bin_Transfer;
    vm.LabelConstant = CORE.LabelConstant;
    vm.binTransferModel = {};
    vm.assignUMIDList = [];
    vm.data = data;
    vm.verifiedFromBin = data && data.Name ? false : true;
    vm.toWarehouseInputName = 'scanShelvinCartWarehouse';
    vm.fromVerifyBinInputName = 'scanVerifyShelvinCartBin';
    let confirmContainKitValidation = false;
    let confirmUnAllocatedUMIDValidation = false;
    vm.enableUnallocatedUMIDTransfer = false;

    if (vm.currentState === TRANSACTION.TRANSACTION_TRANSFER_STOCK_STATE) {
      vm.category = CORE.UMID_History.Category.Xfer_Bulk_Material;
    } else if (vm.currentState === TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_LIST_STATE) {
      vm.category = CORE.UMID_History.Category.UMID_List;
    } else if (vm.currentState === TRANSACTION.TRANSACTION_BIN_STATE) {
      vm.category = CORE.UMID_History.Category.Bin;
    } else if (vm.currentState === TRANSACTION.TRANSACTION_KIT_ALLOCATION_STATE) {
      vm.category = CORE.UMID_History.Category.Kit_Allocation;
    } else if (vm.currentState === TRANSACTION.TRANSACTION_KIT_PREPARATION_STATE) {
      vm.category = CORE.UMID_History.Category.Kit_Preparation;
    }

    const getAllRights = () => {
      vm.enableUnallocatedUMIDTransfer = BaseService.checkFeatureRights(CORE.FEATURE_NAME.UnallocatedUMIDTransfer);
      if (vm.enableUnallocatedUMIDTransfer === null || vm.enableUnallocatedUMIDTransfer === undefined) {
        getAllRights(); //put for hard reload option as it will not get data from feature rights
      }
    };
    getAllRights();

    vm.scanBin = ($event) => {
      if (vm.binTransferModel && vm.binTransferModel.fromBin) {
        $timeout(() => {
          if ($event.keyCode === 13) {
            scanBin();
          }
        });
        /** Prevent enter key submit event */
        preventInputEnterKeyEvent($event);
      }
    };

    function scanBin() {
      if (vm.binTransferModel && vm.binTransferModel.fromBin) {
        vm.cgBusyLoading = BinFactory.getBinDetailByName().query({ name: vm.binTransferModel.fromBin }).$promise.then((res) => {
          let messageContent = null;
          if (res && res.data) {
            const scanBin = res.data;
            if (scanBin.warehousemst && scanBin.warehousemst.warehouseType !== TRANSACTION.warehouseType.ShelvingCart.key) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.OTHER_THAN_SHELVING_CART_NOT_TRANSFER);
              messageContent.message = stringFormat(messageContent.message, scanBin.warehousemst.Name || '');
            } else if (scanBin.isPermanentBin) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PERMANENT_BIN_NOT_TRANSFER);
              messageContent.message = stringFormat(messageContent.message, scanBin.Name || '');
            }
            else {
              setFocusByName(vm.data && vm.data.Name ? vm.fromVerifyBinInputName : vm.toWarehouseInputName);
              vm.binTransferModel.fromBinID = scanBin.id;
              vm.binTransferModel.fromWHId = scanBin.warehousemst.id;
              vm.binTransferModel.fromWarehouse = scanBin.warehousemst.Name;
              vm.binTransferModel.fromDepartmentId = scanBin.warehousemst.parentWarehouseMst.id;
              vm.binTransferModel.fromDepartment = scanBin.warehousemst.parentWarehouseMst.Name;
            }
          } else {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SCAN_VALID_BIN);
          }

          if (messageContent) {
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.binTransferModel.fromBin = null;
                setFocusByName(vm.toWarehouseInputName);
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    }

    vm.scanWH = ($event) => {
      if (vm.binTransferModel && vm.binTransferModel.toWarehouse) {
        $timeout(() => {
          if ($event.keyCode === 13) {
            scanWH();
          }
        });
        /** Prevent enter key submit event */
        preventInputEnterKeyEvent($event);
      }
    };

    function scanWH() {
      if (vm.binTransferModel && vm.binTransferModel.toWarehouse) {
        const obj = {
          whName: vm.binTransferModel.toWarehouse,
          fromWHId: vm.binTransferModel.fromWHId,
          fromBinID: vm.binTransferModel.fromBinID,
          fromBin: vm.binTransferModel.fromBin,
          fromDepartmentId: vm.binTransferModel.fromDepartmentId,
          fromDepartment: vm.binTransferModel.fromDepartment,
          allowValidationFlage: {
            confirmContainKitValidation: confirmContainKitValidation,
            confirmUnAllocatedUMIDValidation: confirmUnAllocatedUMIDValidation
          },
          unallocatedXferHistoryData: vm.unallocatedXferHistoryData || null
        };
        vm.cgBusyLoading = BinFactory.getWarehouseAndTransferBin().query(obj).$promise.then((res) => {
          let messageContent = null;
          let scanWarehouse = null;
          if (res && res.data) {
            scanWarehouse = res.data;
            if (scanWarehouse && scanWarehouse.messageContent) {
              messageContent = angular.copy(scanWarehouse.messageContent);
            } else {
              if (vm.data) {
                vm.formBinTransfer.$setPristine();
                BaseService.currentPagePopupForm = [];
                $mdDialog.cancel();
              }
              else {
                vm.binTransferModel.toDepartment = res.data.transferDetail && res.data.transferDetail[0] ? res.data.transferDetail[0].toParentWarehouseName : null;
                const objBin = {
                  frmwarehouse: vm.binTransferModel.fromWarehouse,
                  frmlocation: vm.binTransferModel.fromBin,
                  frmParentWarehouse: vm.binTransferModel.fromDepartment,
                  towarehouse: vm.binTransferModel.toWarehouse,
                  toparentWarehouse: vm.binTransferModel.toDepartment,
                  timestamp: new Date(),
                  index: vm.assignUMIDList.length + 1
                };
                vm.assignUMIDList.push(objBin);
                $rootScope.$emit(PRICING.EventName.RemoveUMIDFrmList, objBin);
                $scope.$broadcast(PRICING.EventName.ScannUMID, objBin);
                vm.resetDetail();
              }
            }
          } else {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SCAN_VALID_WAREHOUSE);
          }

          if (messageContent) {
            if (messageContent.messageType === CORE.DYNAMIC_MESSAGE_TYPE[1].messageType) {
              const model = {
                messageContent: messageContent,
                multiple: true
              };

              DialogFactory.messageAlertDialog(model).then((yes) => {
                if (yes) {
                  vm.binTransferModel.toWarehouse = null;
                  setFocusByName(vm.toWarehouseInputName);
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
            else if (messageContent.messageType === CORE.DYNAMIC_MESSAGE_TYPE[4].messageType) {
              if (scanWarehouse.validationType === TRANSACTION.TRANSFER_BIN_VALIDATION_TYPE.BINCONTAINKIT) {
                const model = {
                  messageContent: messageContent,
                  btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                  canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                };
                const kitList = BaseService.generateRedirectLinkForKit(scanWarehouse.kitName);
                const otherKitName = kitList.length > 0 ? _.map(kitList).join(', ') : '';
                messageContent.message = stringFormat(messageContent.message, obj.fromBin, obj.whName, otherKitName);

                DialogFactory.messageConfirmDialog(model).then((yes) => {
                  if (yes) {
                    if (scanWarehouse.validationType === TRANSACTION.TRANSFER_BIN_VALIDATION_TYPE.BINCONTAINKIT) {
                      confirmContainKitValidation = true;
                    }
                    scanWH();
                  }
                  else {
                    vm.binTransferModel.toWarehouse = null;
                    setFocusByName(vm.toWarehouseInputName);
                  }
                }, () => {
                  vm.binTransferModel.toWarehouse = null;
                  confirmContainKitValidation = false;
                  confirmUnAllocatedUMIDValidation = false;
                  setFocusByName(vm.toWarehouseInputName);
                }).catch((error) => BaseService.getErrorLog(error));
              } else if (scanWarehouse.validationType === TRANSACTION.TRANSFER_BIN_VALIDATION_TYPE.Unallocate) {
                if (vm.enableUnallocatedUMIDTransfer) {
                  vm.unallocatedXferHistoryData = {};
                  vm.unallocatedXferHistoryData.message = res.data.messageContent.message || null;

                  DialogFactory.dialogService(
                    TRANSACTION.TRANSFER_STOCK_UNALLOCATED_UMID_HISTORY_POPUP_CONTROLLER,
                    TRANSACTION.TRANSFER_STOCK_UNALLOCATED_UMID_HISTORY_POPUP_VIEW,
                    event,
                    vm.unallocatedXferHistoryData)
                    .then((data) => {
                      if (data) {
                        vm.unallocatedXferHistoryData = vm.unallocatedXferHistoryData = data || {};
                        vm.unallocatedXferHistoryData.category = vm.category ? vm.category : CORE.UMID_History.Category.Bin;
                        vm.unallocatedXferHistoryData.transactionType = CORE.UMID_History.Trasaction_Type.Bin_WH_Transfer;
                        vm.unallocatedXferHistoryData.transferFrom = vm.binTransferModel.fromBin;
                        vm.unallocatedXferHistoryData.transferTo = vm.binTransferModel.toWarehouse;
                        confirmUnAllocatedUMIDValidation = true;
                        scanWH();
                      } else {
                        vm.unallocatedXferHistoryData = null;
                      }
                    }, (err) => BaseService.getErrorLog(err));
                } else if (!vm.enableUnallocatedUMIDTransfer) {
                  messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_RIGHT_FOR_FEATURE);
                  messageContent.message = stringFormat(messageContent.message, CORE.FEATURE_NAME.UnallocatedUMIDTransfer);
                  const model = {
                    messageContent: messageContent,
                    multiple: true
                  };
                  DialogFactory.messageAlertDialog(model);
                }
              }
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    }

    vm.resetDetail = () => {
      vm.binTransferModel = {};
      vm.verifiedFromBin = vm.data && vm.data.Name ? false : true;
      confirmContainKitValidation = false;
      confirmUnAllocatedUMIDValidation = false;
      if (!vm.data) {
        setFocusByName('scanShelvinCartBin');
      }
      else {
        setTransferBinDefaultData();
      }
      $timeout(() => {
        vm.formBinTransfer.$setPristine();
        vm.formBinTransfer.$setUntouched();
      });
    };

    vm.goToBinList = () => {
      BaseService.openInNew(TRANSACTION.TRANSACTION_BIN_STATE, {});
    };

    vm.goToWHList = () => {
      BaseService.openInNew(TRANSACTION.TRANSACTION_WAREHOUSE_STATE, {});
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.binTransferModelCopy = _.clone(vm.binTransferModel);
    vm.checkDirtyObject = {
      oldModelName: vm.binTransferModelCopy,
      newModelName: vm.binTransferModel
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      if (checkDirty) {
        vm.checkDirty = true;
      }
      return vm.checkDirty;
    };

    vm.cancel = () => {
      const isdirty = vm.checkFormDirty(vm.formBinTransfer, vm.checkDirtyObject);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        vm.formBinTransfer.$setPristine();
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel();
      }
    };

    //scan and verify Bin
    vm.scanVerifyBin = ($event) => {
      if ($event.keyCode === 13) {
        /** Prevent enter key submit event */
        preventInputEnterKeyEvent($event);
        if (vm.binTransferModel.fromBin && vm.binTransferModel.verifyFromBin &&
          vm.binTransferModel.fromBin.toLowerCase() === vm.binTransferModel.verifyFromBin.toLowerCase()) {
          vm.verifiedFromBin = true;
          setFocusByName(vm.toWarehouseInputName);
        }
        else {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BIN_MISMATCH);
          messageContent.message = stringFormat(messageContent.message, vm.binTransferModel.fromBin, vm.binTransferModel.verifyFromBin);
          const alertModel = {
            messageContent: messageContent
          };
          return DialogFactory.messageAlertDialog(alertModel).then(() => {
            vm.binTransferModel.verifyFromBin = undefined;
            setFocusByName(vm.fromVerifyBinInputName);
          });
        }
      }
    };

    //set default data for pop up
    function setTransferBinDefaultData() {
      if (vm.data && vm.data.Name) {
        vm.binTransferModel.fromBin = vm.data.Name;
        scanBin();
      }
    }

    angular.element(() => {
      setTransferBinDefaultData();
    });
  }
})();
