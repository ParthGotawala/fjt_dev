(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('SplitUIDPopUpController', SplitUIDPopUpController);

  function SplitUIDPopUpController($mdDialog, $timeout, CORE, TRANSACTION, DialogFactory, BaseService, $scope, data, $state, ReceivingMaterialFactory, $q, ManufacturerFactory, USER, BinFactory, PartCostingFactory, KitAllocationFactory) {
    const vm = this;
    vm.currentState = $state.current.name;
    vm.data = data;
    vm.isEdit = vm.data && vm.data.uid ? true : false;
    vm.modelSplitUID = vm.data || {};
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.UMID_MAX_LENGTH = CORE.UMID_MAX_LENGTH;
    vm.LabelConstant = CORE.LabelConstant;
    vm.CORE_SystemGenratedWarehouseBin = CORE.SystemGenratedWarehouseBin;
    vm.dateTimeDisplayFormat = _dateTimeDisplayFormat;
    vm.InventoryType = TRANSACTION.InventoryType;
    vm.Kit_Release_Status = CORE.Kit_Release_Status;
    const loginUser = BaseService.loginUser;
    const defaultRoleDetails = _.find(loginUser.roles, { id: loginUser.defaultLoginRoleID });
    vm.headerData = [];
    vm.isUIDDisable = false;
    vm.isEdit = false;
    vm.focusPackaginAuto = false;
    vm.accessLevelDetail = {};
    vm.MEASUREMENT_TYPES_COUNT = CORE.MEASUREMENT_TYPES.COUNT;

    vm.stringFormat = (message, label) => stringFormat(message, label);

    function getAccessLevel() {
      return ManufacturerFactory.getAcessLeval().query({ access: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS }).$promise.then((response) => {
        if (response && response.data) {
          vm.accessLevelDetail.accessRole = response.data.name;
          vm.accessLevelDetail.accessLevel = response.data.accessLevel;
          vm.accessLevelDetail.allowAccess = false;
          vm.accessLevelDetail.isValidate = true;
          if (defaultRoleDetails.accessLevel <= response.data.accessLevel) {
            vm.accessLevelDetail.allowAccess = true;
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }
    getAccessLevel();

    // Scan UMID
    vm.scanUID = ($event) => {
      $timeout(() => {
        if ($event.keyCode === 13) {
          scanUID($event);
        }
      }, true);
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent($event);
    };

    if (vm.modelSplitUID.uid) {
      scanUID();
    }

    function scanUID() {
      if (vm.modelSplitUID.uid) {
        vm.cgBusyLoading = ReceivingMaterialFactory.get_Component_Sid_ByUID().query({ id: vm.modelSplitUID.uid }).$promise.then((response) => {
          if (response && response.data) {
            vm.modelSplitUID = {
              id: response.data.id,
              uid: response.data.uid,
              fromUIDId: response.data.fromUIDId,
              fromUID: response.data.fromUID,
              parentUIDId: response.data.parentUIDId,
              parentUID: response.data.parentUID,
              prefix: response.data.prefix,
              spq: response.data.spq,
              pkgQty: response.data.pkgQty,
              pkgUnit: response.data.pkgUnit,
              orgQty: response.data.orgqty,
              orgPkgUnit: response.data.orgPkgUnit,
              mfgPNDescription: response.data.component ? response.data.component.mfgPNDescription : null,
              mfgCodeId: response.data.component && response.data.component.mfgCodemst ? response.data.component.mfgCodemst.id : null,
              mfgCode: response.data.component && response.data.component.mfgCodemst ? response.data.component.mfgCodemst.mfgCode : null,
              mfgName: response.data.component && response.data.component.mfgCodemst ? response.data.component.mfgCodemst.mfgName : null,
              mfgType: response.data.component && response.data.component.mfgCodemst ? response.data.component.mfgCodemst.mfgType : null,
              mfgPNId: response.data.component ? response.data.component.id : null,
              PIDCode: response.data.component ? response.data.component.PIDCode : null,
              mfgPN: response.data.component ? response.data.component.mfgPN : null,
              rfq_rohsmst: response.data.component && response.data.component.rfq_rohsmst,
              rohsIcon: response.data.component && response.data.component.rfq_rohsmst ? response.data.component.rfq_rohsmst.rohsIcon : null,
              rohsName: response.data.component && response.data.component.rfq_rohsmst ? response.data.component.rfq_rohsmst.name : null,
              uom: response.data.component && response.data.component.UOMs ? response.data.component.UOMs.id : null,
              uomName: response.data.component && response.data.component.UOMs ? response.data.component.UOMs.unitName : null,
              packaging: response.data.packagingmst ? response.data.packagingmst.name : null,
              packagingId: response.data.packagingmst ? response.data.packagingmst.id : null,
              binName: response.data.binMst ? response.data.binMst.Name : null,
              warehouseName: response.data.binMst && response.data.binMst.warehousemst ? response.data.binMst.warehousemst.Name : null,
              deptName: response.data.binMst && response.data.binMst.warehousemst && response.data.binMst.warehousemst.parentWarehouseMst ? response.data.binMst.warehousemst.parentWarehouseMst.Name : null,
              binID: response.data.binMst ? response.data.binMst.id : null,
              warehouseID: response.data.binMst && response.data.binMst.warehousemst ? response.data.binMst.warehousemst.id : null,
              deptID: response.data.binMst && response.data.binMst.warehousemst && response.data.binMst.warehousemst.parentWarehouseMst ? response.data.binMst.warehousemst.parentWarehouseMst.id : null,
              uomClassID: response.data.component && response.data.component.UOMs && response.data.component.UOMs.measurementType && response.data.component.UOMs.measurementType.id ? response.data.component.UOMs.measurementType.id : null,
              mountingType: response.data.component && response.data.component.rfqMountingType ? response.data.component.rfqMountingType.name : '-',
              partPackage: response.data.component && response.data.component.rfq_packagecasetypemst ? response.data.component.rfq_packagecasetypemst.name : response.data.component.partPackage ? response.data.component.partPackage : '-',
              imageURL: BaseService.getPartMasterImageURL(response.data.component && response.data.component.documentPath ? response.data.component.documentPath : null, response.data.component && response.data.component.imageURL ? response.data.component.imageURL : null)
            };
            vm.modelSplitUID.mfg = vm.modelSplitUID.mfg ? vm.modelSplitUID.mfg : BaseService.getMfgCodeNameFormat(vm.modelSplitUID.mfgCode, vm.modelSplitUID.mfgName);
            vm.isUIDDisable = true;
            vm.isEdit = true;
            getKitDetail();
            setFocus('splitPkgQty');
            vm.modelSplitUID.splitPackaging = vm.modelSplitUID.packaging;
            vm.modelSplitUID.splitPackagingId = vm.modelSplitUID.packagingId;
            if (vm.autoPackaging) {
              vm.autoPackaging.keyColumnId = vm.modelSplitUID.splitPackagingId;
            }
            vm.headerData = [{
              label: vm.LabelConstant.MFG.MFG,
              value: vm.modelSplitUID.mfg,
              displayOrder: 1,
              labelLinkFn: vm.goToManufacturerList,
              valueLinkFn: vm.goToManufacturer,
              valueLinkFnParams: vm.modelSplitUID.mfgcodeID,
              isCopy: true
            },
            {
              label: vm.LabelConstant.MFG.MPNCPN,
              value: vm.modelSplitUID.mfgPN,
              displayOrder: 2,
              labelLinkFn: vm.goToPartList,
              valueLinkFn: vm.goToComponentDetailTab,
              isCopy: true,
              imgParms: {
                imgPath: vm.modelSplitUID.rohsIcon !== null ? stringFormat(CORE.RoHSImageFormat, CORE.WEB_URL, USER.ROHS_BASE_PATH, vm.modelSplitUID.rohsIcon) : null,
                imgDetail: vm.modelSplitUID.rohsName
              }
            },
            {
              label: vm.LabelConstant.MFG.PID,
              value: vm.modelSplitUID.PIDCode,
              displayOrder: 3,
              labelLinkFn: vm.goToPartList,
              valueLinkFn: vm.goToComponentDetailTab,
              isCopy: true,
              isCopyAheadLabel: true,
              imgParms: {
                imgPath: vm.modelSplitUID.rohsIcon !== null ? stringFormat(CORE.RoHSImageFormat, CORE.WEB_URL, USER.ROHS_BASE_PATH, vm.modelSplitUID.rohsIcon) : null,
                imgDetail: vm.modelSplitUID.rohsName
              },
              isCopyAheadOtherThanValue: true,
              copyAheadLabel: vm.LabelConstant.MFG.MFGPN,
              copyAheadValue: vm.modelSplitUID.mfgPN
            }];
          }
          else {
            vm.cgBusyLoading = false;
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SCAN_UID_NOT_FOUND);
            messageContent.message = stringFormat(messageContent.message, vm.modelSplitUID.uid);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.uidTransfer.ScanUID = null;
                setFocus('ScanUID');
              }
            }, () => {

            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    }

    // Invoke when change split units
    vm.changeSplitUnit = () => {
      if (vm.modelSplitUID.splitPkgUnit !== null && vm.modelSplitUID.splitPkgUnit > 0) {
        vm.modelSplitUID.splitPkgQty = convertUnitWithDecimalPlace((vm.modelSplitUID.splitPkgUnit * vm.modelSplitUID.pkgQty) / vm.modelSplitUID.pkgUnit);
      } else {
        vm.modelSplitUID.splitPkgQty = null;
      }
      setMinMaxNumber();
    };

    // Invoke when change split count
    vm.changeSplitQty = () => {
      if (vm.modelSplitUID.splitPkgQty !== null && vm.modelSplitUID.splitPkgQty > 0) {
        vm.modelSplitUID.splitPkgUnit = convertUnitWithDecimalPlace((vm.modelSplitUID.splitPkgQty * vm.modelSplitUID.pkgUnit) / vm.modelSplitUID.pkgQty);
      } else {
        vm.modelSplitUID.splitPkgUnit = null;
      }
      setMinMaxNumber();
    };

    const setMinMaxNumber = () => {
      if (vm.modelSplitUID.splitPkgQty !== null && vm.modelSplitUID.splitPkgQty === 0) {
        $scope.$applyAsync(() => {
          vm.splitUIDForm.splitPkgQty.$setValidity('minNumber', false);
        });
        vm.splitUIDForm.splitPkgQty.$setValidity('maxNumber', true);
        vm.splitUIDForm.splitPkgQty.$setValidity('decimalNumber', true);
      } else if (vm.modelSplitUID.splitPkgQty && vm.modelSplitUID.splitPkgQty >= vm.modelSplitUID.pkgQty) {
        $scope.$applyAsync(() => {
          vm.splitUIDForm.splitPkgQty.$setValidity('maxNumber', false);
        });
        vm.splitUIDForm.splitPkgQty.$setValidity('minNumber', true);
        vm.splitUIDForm.splitPkgQty.$setValidity('decimalNumber', true);
      } else if (vm.modelSplitUID.uomClassID === vm.MEASUREMENT_TYPES_COUNT.ID && (vm.modelSplitUID.splitPkgQty % 1 !== 0)) {
        $scope.$applyAsync(() => {
          vm.splitUIDForm.splitPkgQty.$setValidity('decimalNumber', false);
        });
      } else {
        vm.splitUIDForm.splitPkgQty.$setValidity('maxNumber', true);
        vm.splitUIDForm.splitPkgQty.$setValidity('minNumber', true);
        vm.splitUIDForm.splitPkgQty.$setValidity('decimalNumber', true);
      }
      if (vm.modelSplitUID.splitPkgUnit !== null && vm.modelSplitUID.splitPkgUnit === 0) {
        $scope.$applyAsync(() => {
          vm.splitUIDForm.splitPkgUnit.$setValidity('minNumber', false);
        });
        vm.splitUIDForm.splitPkgUnit.$setValidity('maxNumber', true);
        vm.splitUIDForm.splitPkgUnit.$setValidity('decimalNumber', true);
      } else if (vm.modelSplitUID.splitPkgUnit && vm.modelSplitUID.splitPkgUnit >= vm.modelSplitUID.pkgUnit) {
        $scope.$applyAsync(() => {
          vm.splitUIDForm.splitPkgUnit.$setValidity('maxNumber', false);
        });
        vm.splitUIDForm.splitPkgUnit.$setValidity('minNumber', true);
        vm.splitUIDForm.splitPkgUnit.$setValidity('decimalNumber', true);
      } else if (vm.modelSplitUID.uomClassID === vm.MEASUREMENT_TYPES_COUNT.ID && (vm.modelSplitUID.splitPkgUnit % 1 !== 0)) {
        $scope.$applyAsync(() => {
          vm.splitUIDForm.splitPkgUnit.$setValidity('decimalNumber', false);
        });
      } else {
        vm.splitUIDForm.splitPkgUnit.$setValidity('maxNumber', true);
        vm.splitUIDForm.splitPkgUnit.$setValidity('minNumber', true);
        vm.splitUIDForm.splitPkgUnit.$setValidity('decimalNumber', true);
      }
    };

    // Scan warehouse/bin
    vm.scanBin = ($event) => {
      $timeout(() => {
        if ($event.keyCode === 13) {
          getCurrentBinDetail($event);
        }
      }, true);
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent($event);
    };

    const getCurrentBinDetail = () => {
      if (vm.modelSplitUID.splitBinName) {
        vm.modelSplitUID.splitBin = null;
        let messageContent;
        BinFactory.getBinDetailByName().query({
          name: vm.modelSplitUID.splitBinName
        }).$promise.then((response) => {
          if (response && response.data && response.data.id < 0 && (response.data.warehousemst && response.data.id !== vm.CORE_SystemGenratedWarehouseBin.bin.EmptyBin.id)) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SCAN_VALID_BIN);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model, callBackFunction);
          } else if (response && response.data && response.data.warehousemst && vm.modelSplitUID.deptID !== response.data.warehousemst.parentWHID && response.data.warehousemst.parentWarehouseMst && response.data.warehousemst.parentWarehouseMst.Name) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_ALLOW_DIFFRENT_DEPARTMENT_FOR_SPLITUMID);
            messageContent.message = stringFormat(messageContent.message, vm.modelSplitUID.deptName, vm.modelSplitUID.splitBinName, response.data.warehousemst.parentWarehouseMst.Name);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model, callBackFunction);
          } else if (response && response.data && response.data.warehousemst && TRANSACTION.warehouseType.SmartCart.key === response.data.warehousemst.warehouseType && CORE.InoautoCart === response.data.warehousemst.cartMfr) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_ALLOWED_INAUTO_BIN);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model, callBackFunction);
          } else if (response && response.data) {
            const objToBin = response.data;
            vm.modelSplitUID.splitBin = objToBin.id;
            vm.modelSplitUID.splitWarehouse = objToBin.WarehouseID;
            vm.modelSplitUID.splitWarehouseName = objToBin.warehousemst ? objToBin.warehousemst.Name : null;
            vm.modelSplitUID.splitDept = objToBin.warehousemst ? objToBin.warehousemst.parentWHID : null;
            vm.modelSplitUID.splitDeptName = objToBin.warehousemst && objToBin.warehousemst.parentWarehouseMst ? objToBin.warehousemst.parentWarehouseMst.Name : null;
            if (response && response.data && response.data.Name === vm.modelSplitUID.binName) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.TRANSFER_INTO_SAME_BIN);
              messageContent.message = stringFormat(messageContent.message, vm.modelSplitUID.splitBinName);
              const model = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              DialogFactory.messageConfirmDialog(model).then(() => {
                vm.focusPackaginAuto = true;
              }, () => {
                callBackFunction();
              }).catch((error) => BaseService.getErrorLog(error));
            } else {
              vm.focusPackaginAuto = true;
            }
          } else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SCAN_VALID_BIN);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model, callBackFunction);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        callBackFunction();
      }
    };

    function callBackFunction() {
      vm.modelSplitUID.splitBinName = vm.modelSplitUID.splitBin = vm.modelSplitUID.splitWarehouse = vm.modelSplitUID.splitDept = vm.modelSplitUID.splitWarehouseName = vm.modelSplitUID.splitDeptName = null;
      setFocus('splitBinName');
    }

    /** Get packaging for material detail*/
    const getPackaging = () => PartCostingFactory.getPackaging().query().$promise.then((packaging) => {
      if (packaging && packaging.data) {
        vm.packagingList = packaging.data;
      }
      return vm.packagingList;
    }).catch((error) => BaseService.getErrorLog(error));

    const initAutoComplete = () => {
      vm.autoPackaging = {
        columnName: 'name',
        keyColumnName: 'id',
        controllerName: CORE.MANAGE_PACKAGING_TYPE_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_PACKAGING_TYPE_MODAL_VIEW,
        keyColumnId: vm.modelSplitUID && vm.modelSplitUID.splitPackagingId ? vm.modelSplitUID.splitPackagingId : null,
        addData: {
          popupAccessRoutingState: [USER.ADMIN_PACKAGING_TYPE_STATE],
          pageNameAccessLabel: CORE.PageName.packaging_type
        },
        inputName: 'Packaging',
        placeholderName: 'Packaging',
        isRequired: true,
        isAddnew: true,
        callbackFn: getPackaging,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.autoPackaging.keyColumnId = item.id;
            vm.modelSplitUID.splitPackagingId = item.id;
            vm.modelSplitUID.splitPackaging = item.name;
          }
        }
      };
    };

    const getAutoComplete = () => {
      const autocompletePromise = [getPackaging()];
      vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
        initAutoComplete();
      }).catch((error) => BaseService.getErrorLog(error));
    };
    getAutoComplete();

    function getKitDetail() {
      vm.cgBusyLoading = KitAllocationFactory.getAllocatedKitForUMID({ umidId: vm.modelSplitUID.id }).query().$promise.then((res) => {
        if (res && res.data) {
          vm.allocatedToKit = res.data || [];
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    function UIDTransfer() {
      const afterSplitPkgUnit = vm.modelSplitUID.pkgUnit - vm.modelSplitUID.splitPkgUnit;
      const afterSplitPkgQty = vm.modelSplitUID.pkgQty - vm.modelSplitUID.splitPkgQty;
      const componentSidStk = {
        id: vm.modelSplitUID.id,
        isSplitUID: true,
        prefix: vm.modelSplitUID.prefix,
        splitPkgQty: vm.modelSplitUID.splitPkgQty,
        splitPkgUnit: vm.modelSplitUID.splitPkgUnit,
        inventoryType: vm.InventoryType[3].value,
        splitPackagingId: vm.modelSplitUID.splitPackagingId,
        countApprovalHistoryData: vm.countApprovalData || null,
        isKitAllocation: vm.allocatedToKit.length > 0 ? true : false,
        uom: vm.modelSplitUID.uom,
        pkgQty: afterSplitPkgQty,
        pkgUnit: afterSplitPkgUnit,
        binID: vm.modelSplitUID.splitBin,
        fromBinID: vm.modelSplitUID.binID,
        fromWHID: vm.modelSplitUID.warehouseID,
        fromParentWHID: vm.modelSplitUID.deptID
      };
      vm.cgBusyLoading = ReceivingMaterialFactory.createSplitUMID().query(componentSidStk).$promise.then((res) => {
        if (res.data && res.data.umidDetail) {
          vm.saveBtnDisableFlag = false;
          vm.splitUIDForm.$setPristine();
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SPLIT_UMID_CREATION);
          messageContent.message = stringFormat(messageContent.message, res.data.umidDetail.uid);
          const model = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_Continue
          };
          DialogFactory.messageAlertDialog(model).then(() => {
            $mdDialog.hide(res.data.umidDetail);
          }, () => {
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }).catch((error) => {
        vm.saveBtnDisableFlag = false;
        return BaseService.getErrorLog(error);
      });
    }

    // Manage deallocation approval history
    const countApprovalHistory = (totalAllocated) => {
      const deallocatedKit = _.orderBy(vm.allocatedToKit, [(o) => o.promiseShipDate || ''], ['desc']);
      const kitDetails = {
        deallocatedKit: deallocatedKit,
        accessLevelDetail: vm.accessLevelDetail,
        UMID: vm.modelSplitUID.uid,
        consumedUnit: vm.modelSplitUID.splitPkgUnit,
        uom: vm.modelSplitUID.uomName,
        uomClassID: vm.modelSplitUID.uomClassID,
        consumedQty: vm.modelSplitUID.splitPkgQty,
        currentUnit: vm.modelSplitUID.pkgUnit,
        currentQty: vm.modelSplitUID.pkgQty,
        consumedKit: [],
        mfgCode: vm.modelSplitUID.mfgCode,
        mfgPN: vm.modelSplitUID.mfgPN,
        rfq_rohsmst: vm.modelSplitUID.rfq_rohsmst,
        mfgCodeID: vm.modelSplitUID.mfgCodeId,
        mfgType: vm.modelSplitUID.mfgType,
        componentID: vm.modelSplitUID.mfgPNId,
        umidId: vm.modelSplitUID.id,
        selectedKitName: _.map(deallocatedKit, 'kitName').join(','),
        isKitSelected: false,
        isFromSplitUMID: true
      };
      DialogFactory.dialogService(
        TRANSACTION.UID_TRANSFER_DEALLOCATION_VERIFACTION_CONTROLLER,
        TRANSACTION.UID_TRANSFER_DEALLOCATION_VERIFACTION_VIEW,
        null,
        kitDetails).then((data) => {
          if (data) {
            let deallocatedKitName = '';
            let AccessConsumedUnit = totalAllocated - vm.modelSplitUID.splitPkgUnit;
            if (AccessConsumedUnit > 0) {
              const deallocatedKitDocDateDescOrderList = _.orderBy(deallocatedKit, 'promiseShipDate', 'desc');
              _.map(deallocatedKitDocDateDescOrderList, (item) => {
                if (AccessConsumedUnit > 0) {
                  AccessConsumedUnit = AccessConsumedUnit - item.allocatedUnit;
                  deallocatedKitName = deallocatedKitName ? deallocatedKitName.concat(',', item.kitName) : item.kitName;
                }
              });
            }
            // Call Transfer Stock API > Need to set this data for parameter
            vm.countApprovalData = data || null;
            vm.countApprovalData.deallocatedKitDesc = deallocatedKitName;
            UIDTransfer();
          }
        }, () => {
          vm.countApprovalData = null;
          vm.saveBtnDisableFlag = false;
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.save = () => {
      if (vm.modelSplitUID.id) {
        vm.saveBtnDisableFlag = true;

        if (BaseService.focusRequiredField(vm.splitUIDForm)) {
          vm.saveBtnDisableFlag = false;
          return;
        }
        if (!vm.modelSplitUID.splitBin) {
          let messageContent = null;
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RE_ENTER_BIN);
          messageContent.message = stringFormat(messageContent.message, 'To Bin', 'To Bin');

          const model = {
            messageContent: messageContent,
            multiple: true
          };
          return DialogFactory.messageAlertDialog(model).then((yes) => {
            if (yes) {
              vm.saveBtnDisableFlag = false;
              callBackFunction();
            }
          }, () => {
          }).catch((error) => {
            vm.saveBtnDisableFlag = false;
            return BaseService.getErrorLog(error);
          });
        }

        if (vm.allocatedToKit && vm.allocatedToKit.length > 0) {
          const totalAllocated = _.sumBy(vm.allocatedToKit, 'allocatedUnit');
          const freeToAllocate = vm.modelSplitUID.pkgUnit - vm.modelSplitUID.splitPkgUnit;
          // if split unit more than free to allocate then have to perform deallocation for from umid
          if (vm.modelSplitUID.splitPkgUnit && totalAllocated > freeToAllocate) {
            countApprovalHistory(totalAllocated);
          } else {
            UIDTransfer();
          }
        } else {
          UIDTransfer();
        }
      }
    };

    // go to uom list page
    vm.goToUOMList = () => {
      BaseService.goToUOMList();
    };

    // go to bin list page
    vm.goToBinList = () => {
      BaseService.openInNew(TRANSACTION.TRANSACTION_BIN_STATE, {});
    };

    // go to WH list page
    vm.goToWHList = () => {
      BaseService.openInNew(TRANSACTION.TRANSACTION_WAREHOUSE_STATE, {});
    };

    // got o packaging type list
    vm.goToPackaging = () => {
      BaseService.goToPackaging();
    };

    // go to Manufacturer list page
    vm.goToManufacturerList = () => {
      BaseService.goToManufacturerList();
    };

    // go to part list page
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };

    // go to manufacturer edit page
    vm.goToManufacturer = () => {
      BaseService.goToManufacturer(vm.modelSplitUID.mfgCodeId);
    };

    // go to part master detail tab
    vm.goToComponentDetailTab = () => {
      BaseService.goToComponentDetailTab(vm.modelSplitUID.mfgType.toLowerCase(), vm.modelSplitUID.mfgPNId, USER.PartMasterTabs.Detail.Name);
    };

    // got kit list page
    vm.goToKitList = (data) => {
      BaseService.goToKitList(data.refSalesOrderDetID, data.assyID);
    };

    //go to mounting type list page
    vm.goToMountingTypeList = () => {
      BaseService.goToMountingTypeList();
    };

    //go to package case list page
    vm.goToPackageCaseTypeList = () => {
      BaseService.goToPackageCaseTypeList();
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    vm.cancel = () => {
      const isdirty = vm.splitUIDForm.$dirty;
      if (isdirty) {
        const data = {
          form: vm.splitUIDForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        $mdDialog.cancel();
      }
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    //on load submit form
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.splitUIDForm);
    });
  }
})();
