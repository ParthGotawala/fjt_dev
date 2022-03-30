(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('ChangeUMIDInitialCountController', ChangeUMIDInitialCountController);

  function ChangeUMIDInitialCountController($mdDialog, $timeout, CORE, DialogFactory, BaseService, data, ReceivingMaterialFactory, ComponentFactory, $q, $scope,
    $window, USER, $filter, TRANSACTION) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.UMID_MAX_LENGTH = CORE.UMID_MAX_LENGTH;
    vm.isUIDDisable = false;
    vm.LabelConstant = CORE.LabelConstant;
    vm.popupRawData = data;
    vm.MEASUREMENT_TYPES_COUNT = CORE.MEASUREMENT_TYPES.COUNT;

    vm.checkDirtyObject = {
      columnName: [],
      oldModelName: null,
      newModelName: null
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.cancel = () => {
      // Check vm.isChange flag for color picker dirty object
      const isdirty = vm.checkFormDirty(vm.formChangeUMIDInitQty, vm.checkDirtyObject);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        vm.formChangeUMIDInitQty.$setPristine();
        BaseService.currentPagePopupForm = [];
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    vm.UMIDDetail = {
      uid: vm.popupRawData ? vm.popupRawData.uid : null
    };

    vm.scanUID = ($event) => {
      $timeout(() => {
        if ($event.keyCode === 13 && vm.UMIDDetail.uid) {
          scanUID();
        }
      }, true);
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent($event);
    };

    function scanUID() {
      vm.cgBusyLoading = ReceivingMaterialFactory.get_Component_Sid_ByUID().query({ id: vm.UMIDDetail.uid }).$promise.then((res) => {
        if (res && res.data) {
          const isSpliUID = res.data.parentUIDId && res.data.fromUIDId ? true : false;
          if (isSpliUID) {
            vm.isUIDDisable = false;
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_ALLOWED_CHANGE_INITIAL_QTY_FOR_SPLIT_UMID);
            messageContent.message = stringFormat(messageContent.message, vm.UMIDDetail.uid);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.UMIDDetail.uid = null;
                setFocus('uid');
              }
            }, () => {

            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            vm.UMIDDetail = res.data;
            vm.isUIDDisable = true;
            if (vm.UMIDDetail && vm.UMIDDetail.component) {
              vm.UMIDDetail.Warehouse = vm.UMIDDetail.binMst && vm.UMIDDetail.binMst.warehousemst ? vm.UMIDDetail.binMst.warehousemst.Name : null;
              vm.UMIDDetail.bin = vm.UMIDDetail.binMst ? vm.UMIDDetail.binMst.Name : null;
              vm.UMIDDetail.binId = vm.UMIDDetail.binMst ? vm.UMIDDetail.binMst.id : null;
              vm.UMIDDetail.department = vm.UMIDDetail.binMst && vm.UMIDDetail.binMst.warehousemst && vm.UMIDDetail.binMst.warehousemst.parentWarehouseMst ? vm.UMIDDetail.binMst.warehousemst.parentWarehouseMst.Name : null;
              vm.UMIDDetail.componentID = vm.UMIDDetail.component.id;
              vm.UMIDDetail.mfgType = vm.UMIDDetail.component.mfgCodemst ? vm.UMIDDetail.component.mfgCodemst.mfgType : null;
              vm.UMIDDetail.componentUnit = vm.UMIDDetail.component.unit;
              vm.UMIDDetail.mfrPN = vm.UMIDDetail.component.mfgPN;
              vm.UMIDDetail.minimum = vm.UMIDDetail.component.minimum;
              vm.UMIDDetail.packagingName = vm.UMIDDetail.packagingmst && vm.UMIDDetail.packagingmst.name ? vm.UMIDDetail.packagingmst.name : null;
              vm.UMIDDetail.sourceName = vm.UMIDDetail.packagingmst && vm.UMIDDetail.packagingmst.sourceName ? vm.UMIDDetail.packagingmst.sourceName : null;
              vm.UMIDDetail.packagingId = vm.UMIDDetail.packagingmst && vm.UMIDDetail.packagingmst.id ? vm.UMIDDetail.packagingmst.id : null;
              vm.UMIDDetail.uomClassID = vm.UMIDDetail.component && vm.UMIDDetail.component.UOMs && vm.UMIDDetail.component.UOMs.measurementType && vm.UMIDDetail.component.UOMs.measurementType.id ? vm.UMIDDetail.component.UOMs.measurementType.id : null;

              vm.headerData = [{
                label: vm.LabelConstant.MFG.PID,
                value: vm.UMIDDetail.component.PIDCode,
                displayOrder: 1,
                labelLinkFn: vm.goToPartList,
                valueLinkFn: vm.goToPartDetail,
                valueLinkFnParams: vm.UMIDDetail.componentID,
                isCopy: true,
                isCopyAheadLabel: true,
                imgParms: {
                  imgPath: vm.UMIDDetail.component.rfq_rohsmst && vm.UMIDDetail.component.rfq_rohsmst.rohsIcon ? stringFormat('{0}{1}{2}', CORE.WEB_URL, USER.ROHS_BASE_PATH, vm.UMIDDetail.component.rfq_rohsmst.rohsIcon) : null,
                  imgDetail: vm.UMIDDetail.component.rfq_rohsmst.name
                },
                isCopyAheadOtherThanValue: true,
                copyAheadLabel: vm.LabelConstant.MFG.MFGPN,
                copyAheadValue: vm.UMIDDetail.component.mfgPN
              }];

              getAutoCompleteData();
              getPendingPackingSlipDetails();

              setFocus('initialPkgQty');
            }
            else {
              setFocus('uid');
            }
          }
        }
        else {
          vm.isUIDDisable = false;
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SCAN_UID_NOT_FOUND);
          messageContent.message = stringFormat(messageContent.message, vm.UMIDDetail.uid);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          return DialogFactory.messageAlertDialog(model).then((yes) => {
            if (yes) {
              vm.UMIDDetail.uid = null;
              setFocus('uid');
            }
          }, () => {

          }).catch((error) => BaseService.getErrorLog(error));
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    if (vm.popupRawData && vm.UMIDDetail.uid) {
      scanUID(vm.popupRawData.uid);
    }


    const setFormValidation = () => {
      if (vm.UMIDDetail.uomClassID === vm.MEASUREMENT_TYPES_COUNT.ID && (vm.UMIDDetail.initialPkgQty % 1 !== 0)) {
        $scope.$applyAsync(() => {
          vm.formChangeUMIDInitQty.initialPkgQty.$setValidity('decimalNumber', false);
        });
      } else {
        vm.formChangeUMIDInitQty.initialPkgQty.$setValidity('decimalNumber', true);
      }
    };

    // get packing slip details if umid exists with same criteria of packing slip
    const getPendingPackingSlipDetails = () => {
      const packingslipdetails = {
        id: vm.UMIDDetail.id,
        uid: vm.UMIDDetail.uid,
        packagingId: vm.UMIDDetail.packagingId,
        partId: vm.UMIDDetail.componentID,
        binId: vm.UMIDDetail.binId
      };
      vm.cgBusyLoading = ReceivingMaterialFactory.getSameCriteriaUMIDPackingSlipDetails().query(packingslipdetails).$promise.then((response) => {
        if (response && response.data) {
          if (response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.pendingPackingSlipData = response.data.pendingPackingSlipList;
            vm.packingSlipData = response.data.packingSlipList;
          } else {
            const errorResData = response.data;
            const model = {
              messageContent: errorResData.messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then(() => {
              if (vm.popupRawData.currentState === TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_STATE) {
                vm.formChangeUMIDInitQty.$setPristine();
                vm.formChangeUMIDInitQty.$setUntouched();
                BaseService.currentPagePopupForm = [];
                $mdDialog.hide();
              } else {
                vm.UMIDDetail = {};
                vm.headerData = [];
                vm.isUIDDisable = false;
                setFocus('uid');
                vm.formChangeUMIDInitQty.$setPristine();
                vm.formChangeUMIDInitQty.$setUntouched();
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // get packing slip details if umid exists with same criteria of packing slip
    vm.checkUMIDQty = () => {
      if (!vm.formChangeUMIDInitQty.$valid) {
        BaseService.focusRequiredField(vm.formChangeUMIDInitQty);
        return;
      }

      if ((vm.UMIDDetail.stockInventoryType === TRANSACTION.InventoryType[0].value || vm.UMIDDetail.stockInventoryType === TRANSACTION.InventoryType[2].value) && vm.UMIDDetail.initialPkgUnits) {
        const umidDetails = {
          stockInventoryType: vm.UMIDDetail.stockInventoryType,
          woID: vm.UMIDDetail.woID,
          packingSlipDetID: vm.packingSlipData.packingSlipDetID
        };
        vm.cgBusyLoading = ReceivingMaterialFactory.getUMIDDetailsForManageStock().query(umidDetails).$promise.then((response) => {
          if (response && response.data && response.status === CORE.ApiResponseTypeStatus.SUCCESS && response.data.umidDetails) {
            const manageReponse = response.data.umidDetails;
            const maxQtyToCreate = vm.UMIDDetail.orgPkgUnit + manageReponse.availableQty;
            if (manageReponse.availableQty > 0 || vm.UMIDDetail.initialPkgUnits > maxQtyToCreate) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.UMID_STOCK_NOT_EXITS);
              messageContent.message = stringFormat(messageContent.message, manageReponse.availableQty, maxQtyToCreate);
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              return DialogFactory.messageAlertDialog(model).then((yes) => {
                if (yes) {
                  setFocus('initialPkgQty');
                  vm.UMIDDetail.initialPkgQty = null;
                  vm.UMIDDetail.initialPkgUnits = null;
                  return;
                }
              });
            } else {
              vm.checkInitialCountAndPackaging();
            }
          } else {
            vm.checkInitialCountAndPackaging();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.checkInitialCountAndPackaging();
      }
    };

    /* unit drop-down fill up */
    const getUomlist = () => ComponentFactory.getUOMsList().query().$promise.then((res) => {
      vm.uomlist = res.data;
      return res.data;
    }).catch((error) => BaseService.getErrorLog(error));

    const getAutoCompleteData = () => {
      const autocompletePromise = [getUomlist()];
      vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
        initAutoComplete();
      }).catch((error) => BaseService.getErrorLog(error));
    };

    function initAutoComplete() {
      vm.autoCompleteuom = {
        columnName: 'unitName',
        keyColumnName: 'id',
        keyColumnId: vm.UMIDDetail ? vm.UMIDDetail.uom : null,
        inputName: 'UOM',
        placeholderName: 'UOM',
        isRequired: true,
        isAddnew: false,
        callbackFn: getUomlist,
        onSelectCallbackFn: (item) => {
          vm.originalUOM = item;
        }
      };
    };

    const validateSameCountentered = () => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_ALLOW_SAME_AS_INITIAL_COUNT);
      messageContent.message = stringFormat(messageContent.message, $filter('unit')(vm.UMIDDetail.initialPkgQty), $filter('unit')(vm.UMIDDetail.orgqty));
      const model = {
        messageContent: messageContent,
        multiple: true
      };
      DialogFactory.messageAlertDialog(model).then(() => {
        setFocus('initialPkgQty');
        vm.UMIDDetail.initialPkgQty = null;
        vm.UMIDDetail.initialPkgUnits = null;
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.changeInitialPkgQty = () => {
      setFormValidation();
      if (vm.UMIDDetail.initialPkgQty === vm.UMIDDetail.orgqty) {
        validateSameCountentered();
      } else {
        if (vm.UMIDDetail.initialPkgQty && vm.UMIDDetail.componentUnit) {
          vm.UMIDDetail.initialPkgUnits = vm.UMIDDetail.initialPkgQty * vm.UMIDDetail.componentUnit;
        } else {
          vm.UMIDDetail.initialPkgUnits = null;
        }
      }
    };

    vm.checkInitialCountAndPackaging = () => {
      if (vm.pendingPackingSlipData) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_ALLOWED_CHANGE_INITIAL_QTY_HAVING_SAME_PACKINGSLIP);
        messageContent.message = stringFormat(messageContent.message, vm.pendingPackingSlipData.binName, vm.pendingPackingSlipData.pidCode, vm.pendingPackingSlipData.packaging, vm.pendingPackingSlipData.packingSlipNumber, vm.pendingPackingSlipData.mfgCodeName);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model).then(() => {
          setFocus('initialPkgQty');
        }).catch((error) => BaseService.getErrorLog(error));
      } else if (vm.UMIDDetail.sourceName === TRANSACTION.Packaging.TapeAndReel && parseFloat(vm.UMIDDetail.minimum) !== parseFloat(vm.UMIDDetail.initialPkgQty)) {
        if (vm.UMIDDetail.stockInventoryType === TRANSACTION.InventoryType[0].value) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.ERROR_INITIAL_POPUP_TR_UMID_COUNT);
          messageContent.message = stringFormat(messageContent.message, vm.UMIDDetail.mfrPN, vm.UMIDDetail.packagingName);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
          return;
        }
        else if (vm.UMIDDetail.stockInventoryType === TRANSACTION.InventoryType[1].value) {
          if (parseFloat(vm.UMIDDetail.minimum) > parseFloat(vm.UMIDDetail.initialPkgQty)) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CONFIRMATION_INITIAL_POPUP_TR_UMID_COUNT);
            messageContent.message = stringFormat(messageContent.message, vm.UMIDDetail.mfrPN, vm.UMIDDetail.packagingName);
            const model = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_Continue,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_CANCEL
            };
            DialogFactory.messageConfirmDialog(model).then(() => {
              vm.updateInitialCount();
            }, () => {
              setFocus('initialPkgQty');
            }).catch((error) => BaseService.getErrorLog(error));
          }
          else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.EXISTING_STK_COUNT_NOT_MORE_THAN_SPQ);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then(() => {
              setFocus('initialPkgQty');
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }
      } else {
        vm.updateInitialCount();
      }
    };

    vm.updateInitialCount = () => {
      if ((vm.UMIDDetail.initialPkgQty || 0) - (vm.UMIDDetail.orgqty || 0) + (vm.UMIDDetail.pkgQty || 0) < 0) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INITIAL_COUNT_GREATER_THAN_CONSUMED);
        messageContent.message = stringFormat(messageContent.message, $filter('unit')(vm.UMIDDetail.initialPkgQty), $filter('unit')((vm.UMIDDetail.orgqty || 0) - (vm.UMIDDetail.pkgQty || 0)));
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        return DialogFactory.messageAlertDialog(model).then((yes) => {
          if (yes) {
            vm.UMIDDetail.initialPkgQty = null;
            setFocus('initialPkgQty');
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      }

      /* Get allocated kit for selected UMID*/
      vm.cgBusyLoading = ReceivingMaterialFactory.getAllocatedKitByUID().query({ id: vm.UMIDDetail.id }).$promise.then((response) => {
        vm.allocatedKitList = response.data;
        confirmationToChangeInitialCount();
      }).catch((error) => BaseService.getErrorLog(error));
    };

    function saveInitialCount() {
      var UMIDDet = {
        id: vm.UMIDDetail.id,
        orgQty: vm.UMIDDetail.initialPkgQty,
        orgPkgUnit: vm.UMIDDetail.initialPkgUnits,
        initialQtyChangeRemark: vm.UMIDDetail.initialQtyChangeRemark
      };

      vm.cgBusyLoading = ReceivingMaterialFactory.updateInitialQty().query(UMIDDet).$promise.then((response) => {
        if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          if (response.data) {
            const errorResData = response.data;
            const model = {
              messageContent: errorResData.messageContent,
              multiple: true
            };
            if (response.data.messageTypeCode === 1) {
              DialogFactory.messageAlertDialog(model).then(() => {
                if (vm.popupRawData.currentState === TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_STATE) {
                  vm.formChangeUMIDInitQty.$setPristine();
                  BaseService.currentPagePopupForm = [];
                  $mdDialog.hide(true);
                } else {
                  vm.UMIDDetail = {};
                  vm.isUIDDisable = false;
                  setFocus('uid');
                  vm.headerData = [];
                  vm.formChangeUMIDInitQty.$setPristine();
                  vm.formChangeUMIDInitQty.$setUntouched();
                }
              }, () => {
              }).catch((error) => BaseService.getErrorLog(error));
            } else {
              return DialogFactory.messageAlertDialog(model);
            }
          } else {
            vm.formChangeUMIDInitQty.$setPristine();
            BaseService.currentPagePopupForm = [];
            $mdDialog.hide(true);
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    function confirmationToChangeInitialCount() {
      let messageContent;
      if (vm.UMIDDetail.initialPkgQty === vm.UMIDDetail.orgqty) {
        validateSameCountentered();
      } else {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INITIAL_COUNT_CONFIRMATION);
        messageContent.message = stringFormat(messageContent.message, $filter('unit')(vm.UMIDDetail.initialPkgQty), $filter('unit')(vm.UMIDDetail.initialPkgUnits), vm.originalUOM.unitName);
        const message = angular.copy(messageContent.message);

        if (vm.allocatedKitList && vm.allocatedKitList.length > 0) {
          const AllocatedKits = _.map(vm.allocatedKitList, (item) => `(${item.salesorderdetatil.salesOrderMst.poNumber}, ${item.salesorderdetatil.salesOrderMst.salesOrderNumber}, ${item.AssemblyDetail.PIDCode})`).join(', ');
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INITIAL_COUNT_CONFIRMATION_FOR_KIT_ALLOCATION);
          messageContent.message = stringFormat(messageContent.message, AllocatedKits, message);
        }
      }
      const model = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(model).then(() => {
        saveInitialCount();
      }, () => {
        setFocus('initialPkgQty');
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /** Redirect to part master page */
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };

    vm.goToPartDetail = () => {
      BaseService.goToComponentDetailTab(CORE.MFG_TYPE.MFG, vm.UMIDDetail.componentID, USER.PartMasterTabs.Detail.Name);
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.formChangeUMIDInitQty];
    });
  }
})();
