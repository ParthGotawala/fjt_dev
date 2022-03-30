(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('IdenticalUMIDPopupController', IdenticalUMIDPopupController);

  function IdenticalUMIDPopupController($mdDialog, CORE, TRANSACTION, DialogFactory, data, $timeout, $state, ReceivingMaterialFactory, BinFactory, LabelTemplatesFactory, $q, $scope, USER, CONFIGURATION, BaseService) {
    const vm = this;
    vm.currentState = $state.current.name;
    vm.ReceivingMatirialTab = CORE.ReceivingMatirialTab;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.UMID_MAX_LENGTH = CORE.UMID_MAX_LENGTH;
    vm.LabelConstant = CORE.LabelConstant;
    vm.popupLabel = TRANSACTION.IDENTICAL_UMID_POPUP_LABEL;
    vm.CORE_SystemGenratedWarehouseBin = CORE.SystemGenratedWarehouseBin;
    vm.MFR_DATE_CODE_FORMAT_NOT_FOUND = angular.copy(TRANSACTION.MFR_DATE_CODE_FORMAT_NOT_FOUND);
    vm.SET_DATE_CODE_FORMAT_BUTTON = angular.copy(TRANSACTION.SET_DATE_CODE_FORMAT_BUTTON);
    vm.dateTimeDisplayFormat = _dateTimeDisplayFormat;
    vm.InventoryType = TRANSACTION.InventoryType;
    vm.isCallGeneratedUMIDDirective = false;
    const categoryTypeObjList = angular.copy(CORE.CategoryType);
    let getPrinterLocalStorageValue = getLocalStorageValue('Printer');
    let getPrintFormatLocalStorageValue = getLocalStorageValue('PrintFormateOfUMID');
    let objToBin;
    vm.headerData = [];
    vm.generatedUMIDList = [];
    vm.saveBtnDisableFlag = false;

    vm.pageInit = () => {
      vm.modelUID = {
        uidId: data.uidId || null,
        maxPossibleUMID: 0,
        uid: data.uid || null,
        uidQty: _maxUMID
      };
      vm.headerData = [];
      vm.uid = data ? data.uid : null;
      vm.uidId = data && data.uidId ? parseInt(data.uidId) : 0;
      vm.isUIDDisable = vm.uidId ? true : false;
      setInitialData();
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    const getNumberOfPrintsForUMID = (pid) => {
      vm.cgBusyLoading = ReceivingMaterialFactory.getNumberOfPrintsForUMID().query({ id: pid }).$promise.then((printDetails) => {
        if (printDetails.data) {
          const mslID = printDetails.data.mslID >= 2 ? 2 : 0;
          const numberOfPrintForUMID = printDetails.data.rfqMountingType.numberOfPrintForUMID ? printDetails.data.rfqMountingType.numberOfPrintForUMID : 1;
          vm.modelUID.noprint = (mslID && numberOfPrintForUMID) ? (mslID > numberOfPrintForUMID ? mslID : numberOfPrintForUMID) : numberOfPrintForUMID;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const getAutoCompleteData = () => LabelTemplatesFactory.getPrinterAndLabelTemplateData().query().$promise.then((autoCompleteData) => {
      vm.PrinterList = autoCompleteData.data.printer;
      vm.LabelTemplateList = autoCompleteData.data.labeltemplate;
      return $q.resolve(vm.LabelTemplateList);
    }).catch((error) => BaseService.getErrorLog(error));

    const initautoComplete = () => {
      vm.autoCompletePrinter = {
        columnName: 'gencCategoryName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.modelUID ? vm.modelUID.printerId : null,
        inputName: categoryTypeObjList.Printer.Name,
        inputId: 'printer',
        placeholderName: categoryTypeObjList.Printer.Title,
        addData: { headerTitle: categoryTypeObjList.Printer.Title },
        isRequired: true,
        isAddnew: true,
        callbackFn: getAutoCompleteData,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.modelUID.printerId = item.gencCategoryID;
            vm.modelUID.printerName = item.gencCategoryName;
          } else {
            vm.modelUID.printerName = null;
            vm.modelUID.printerId = null;
            $scope.$broadcast(vm.autoCompletePrinter ? vm.autoCompletePrinter.inputName : null, null);
          }
        }
      };

      vm.autoCompleteLabelTemplate = {
        columnName: 'Name',
        keyColumnName: 'id',
        keyColumnId: vm.modelUID ? vm.modelUID.printFormateId : null,
        inputName: vm.LabelConstant.LabelTemplate.Name,
        placeholderName: vm.LabelConstant.LabelTemplate.Title,
        isRequired: true,
        callbackFn: getAutoCompleteData,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.modelUID.printFormateId = item.id;
            vm.modelUID.printFormateName = item.Name;
          } else {
            $scope.$broadcast(vm.autoCompleteLabelTemplate ? vm.autoCompleteLabelTemplate.inputName : null, null);
            vm.modelUID.printFormateId = null;
            vm.modelUID.printFormateName = null;
          }
        }
      };
    };

    const setInitialData = () => {
      getPrinterLocalStorageValue = getLocalStorageValue('Printer');
      getPrintFormatLocalStorageValue = getLocalStorageValue('PrintFormateOfUMID');

      const autocompletePromise = [getUMIDDetailsById(), getAutoCompleteData()];
      vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
        if (getPrinterLocalStorageValue && getPrinterLocalStorageValue.Printer) {
          vm.modelUID.printerId = getPrinterLocalStorageValue.Printer.gencCategoryID;
          vm.modelUID.printerName = getPrinterLocalStorageValue.Printer.gencCategoryName;
        } else {
          vm.modelUID.printerId = null;
          vm.modelUID.printerName = null;
        }
        if (getPrintFormatLocalStorageValue && getPrintFormatLocalStorageValue.PrintFormate) {
          vm.modelUID.printFormateId = getPrintFormatLocalStorageValue.PrintFormate.id;
          vm.modelUID.printFormateName = getPrintFormatLocalStorageValue.PrintFormate.Name;
        } else {
          vm.modelUID.printFormateId = null;
          vm.modelUID.printFormateName = null;
        }
        initautoComplete();
        if (!vm.uidId) {
          setFocus('uid');
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // Scan UMID
    vm.scanUID = ($event) => {
      $timeout(() => {
        if ($event.keyCode === 13) {
          getUMIDDetailsById();
        }
      }, true);
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent($event);
    };

    const manageUMIDCreationValidation = (umidDetail, isFromScanUMID) => {
      const totalQty = vm.modelUID.uidQty * umidDetail.orgQty;
      const mfgCodePN = `${redirectToManufacturerDetail(umidDetail.mfgcodeID, umidDetail.mfgName)}${redirectToPartDetail(umidDetail.refcompid, umidDetail.mfgType, umidDetail.PIDCode)}`;
      if (umidDetail.isSplitUID) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SPLIT_UID_NOT_ALLOW);
        messageContent.message = stringFormat(messageContent.message, redirectToUMIDDetail(umidDetail.uidId, vm.modelUID.uid));
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model).then((yes) => {
          if (yes) {
            vm.isUIDDisable = false;
            vm.modelUID = {};
            setFocus('uid');
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
        vm.saveBtnDisableFlag = false;
        return 1;
      } else if (!isFromScanUMID) {
        if (umidDetail.hasLimitedShelfLife && (umidDetail.selfLifeDays === 0 || umidDetail.selfLifeDays === null)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SHELF_LIFE_DAYS_FOR_MOUNTING_GROUP_CHEMICAL_VALIDATION);
          const model = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_CANCEL
          };
          DialogFactory.messageConfirmDialog(model).then(() => {
            vm.goToComponentDetailTab(umidDetail.mfgType, umidDetail.refcompid);
            vm.modelUID.toBinName = vm.modelUID.warehouseName = vm.modelUID.parentWHName = null;
            setFocus('toBinName');
          }, () => {
            vm.modelUID.toBinName = vm.modelUID.warehouseName = vm.modelUID.parentWHName = null;
            setFocus('toBinName');
          }).catch((error) => BaseService.getErrorLog(error));
          vm.saveBtnDisableFlag = false;
          return 1;
        } else if (umidDetail.stockInventoryType === vm.InventoryType[0].value) {
          let messageContent;
          let isQtyValidation = false;
          if (umidDetail.packingSlipModeStatus === CORE.PackingSlipModeStatus[0].ID) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PS_POSTING_STATUS_NOT_ALLOW);
            messageContent.message = stringFormat(messageContent.message, 'create', vm.LabelConstant.UMIDManagement.UMID, redirectToPackingSlipDetail(umidDetail.packingSlipID, umidDetail.packingSlipNumber), mfgCodePN, umidDetail.packagingName, umidDetail.fromBinName);
          } else if (umidDetail.receivedStatus === TRANSACTION.PackingSlipReceivedStatus[0].value || umidDetail.receivedStatus === TRANSACTION.PackingSlipReceivedStatus[2].value) {
            const receivedStatus = umidDetail.receivedStatus === TRANSACTION.PackingSlipReceivedStatus[0].value ? TRANSACTION.PackingSlipReceivedStatus[0].value : TRANSACTION.PackingSlipReceivedStatus[2].value;
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PS_RECEIVED_STATUS_NOT_ALLOW_UMID);
            messageContent.message = stringFormat(messageContent.message, redirectToPackingSlipDetail(umidDetail.packingSlipID, umidDetail.packingSlipNumber), receivedStatus, mfgCodePN, umidDetail.packagingName, umidDetail.fromBinName);
          } else if (totalQty !== null && totalQty > 0 && (totalQty > umidDetail.BalanceQty || umidDetail.BalanceQty <= 0)) {
            isQtyValidation = true;
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BIN_NOT_HAVE_STOCK);
            const manageTotalQty = stringFormat('{0} x {1}', umidDetail.orgQty, vm.modelUID.uidQty);
            const identicalMessage = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.IDENTICAL_UMID_STOCK_NOT_EXISTS);
            messageContent.message = stringFormat(messageContent.message, umidDetail.fromBinName, mfgCodePN, umidDetail.BalanceQty, manageTotalQty, `<br />${identicalMessage.message}`);
          }
          if (messageContent) {
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                if (isQtyValidation) {
                  setFocus('uidQty');
                } else {
                  vm.modelUID.toBinName = vm.modelUID.warehouseName = vm.modelUID.parentWHName = null;
                  setFocus('toBinName');
                }
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
            vm.saveBtnDisableFlag = false;
            return 1;
          } else {
            return 0;
          }
        } else if (umidDetail.stockInventoryType === vm.InventoryType[2].value && (totalQty !== null && totalQty > 0 && (totalQty > umidDetail.BalanceQty || umidDetail.BalanceQty <= 0))) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BIN_NOT_HAVE_STOCK);
          const manageTotalQty = stringFormat('{0} x {1}', umidDetail.orgQty, vm.modelUID.uidQty);
          const identicalMessage = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.IDENTICAL_UMID_STOCK_NOT_EXISTS);
          messageContent.message = stringFormat(messageContent.message, umidDetail.fromBinName, mfgCodePN, umidDetail.woAvailableQty, manageTotalQty, `<br />${identicalMessage.message}`);
          if (messageContent) {
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                setFocus('uidQty');
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
            vm.saveBtnDisableFlag = false;
            return 1;
          } else {
            return 0;
          }
        } else {
          return 0;
        }
      }
    };

    const getUMIDDetailsById = () => {
      if (vm.modelUID.uid) {
        vm.cgBusyLoading = ReceivingMaterialFactory.getUMIDDetailsById().query({ id: null, uid: vm.modelUID.uid }).$promise.then((response) => {
          if (response && response.data && response.data.umidDetail) {
            const umidDetail = response.data.umidDetail;
            if (manageUMIDCreationValidation(umidDetail, true)) {
              return;
            } else {
              vm.modelUID.uidId = umidDetail.uidId;
              vm.modelUID.uid = umidDetail.uid;
              vm.modelUID.orgQty = umidDetail.orgQty;
              vm.modelUID.orgPkgUnit = umidDetail.orgPkgUnit;
              vm.modelUID.pkgQty = umidDetail.pkgQty;
              vm.modelUID.pkgUnit = umidDetail.pkgUnit;
              vm.modelUID.componentUnit = umidDetail.componentUnit;
              vm.modelUID.prefix = umidDetail.prefix;
              vm.modelUID.uidPrefix = umidDetail.uidPrefix;
              vm.modelUID.sealDate = umidDetail.sealDate;
              vm.modelUID.cpn = umidDetail.cpn;
              vm.modelUID.RefCPNMFGPNID = umidDetail.RefCPNMFGPNID;
              vm.modelUID.mfgAvailabel = umidDetail.mfgAvailabel;
              vm.modelUID.uidAssyID = umidDetail.uidAssyID;
              vm.modelUID.receiveMaterialType = umidDetail.receiveMaterialType;
              vm.modelUID.refSupplierPartId = umidDetail.refSupplierPartId;
              vm.modelUID.pcbPerArray = umidDetail.pcbPerArray;
              vm.modelUID.customerConsign = umidDetail.customerConsign;
              vm.modelUID.spq = umidDetail.spq;
              vm.modelUID.uom = umidDetail.uom;
              vm.modelUID.dateCode = umidDetail.dateCode;
              vm.modelUID.fromDateCodeFormat = umidDetail.fromDateCodeFormat;
              vm.modelUID.dateCodeFormatID = umidDetail.dateCodeFormatID;
              vm.modelUID.packaging = umidDetail.packaging;
              vm.modelUID.specialNote = umidDetail.specialNote;
              vm.modelUID.mfrDateCodeFormatID = umidDetail.mfrDateCodeFormatID;
              vm.modelUID.mfrDateCode = umidDetail.mfrDateCode;
              vm.modelUID.woID = umidDetail.woID;
              vm.modelUID.unitName = umidDetail.unitName;
              vm.modelUID.woNumber = umidDetail.woNumber;
              vm.modelUID.customerID = umidDetail.customerID;
              vm.modelUID.scanlabel = umidDetail.scanlabel;
              vm.modelUID.costCategoryID = umidDetail.costCategoryID;
              vm.modelUID.costCategoryName = umidDetail.costCategoryName;
              vm.modelUID.lotCode = umidDetail.lotCode;
              vm.modelUID.nickName = umidDetail.nickName;
              vm.modelUID.isCustom = umidDetail.isCustom;
              vm.modelUID.imageURL = umidDetail.imageURL;
              vm.modelUID.externalPartPackage = umidDetail.externalPartPackage;
              vm.modelUID.mountingTypeID = umidDetail.mountingTypeID;
              vm.modelUID.uidRohsStatusID = umidDetail.uidRohsStatusID;
              vm.modelUID.umidRohsName = umidDetail.umidRohsName;
              vm.modelUID.umidRohsIcon = umidDetail.umidRohsIcon;
              vm.modelUID.rohsStatusID = umidDetail.rohsStatusID;
              vm.modelUID.packingSlipID = umidDetail.packingSlipID;
              vm.modelUID.packingSlipSerialNumber = umidDetail.packingSlipSerialNumber;
              vm.modelUID.packingSlipNumber = umidDetail.packingSlipNumber;
              vm.modelUID.returnQty = umidDetail.returnQty;
              vm.modelUID.InQty = umidDetail.InQty;
              vm.modelUID.packingSlipDetID = umidDetail.packingSlipDetID;
              vm.modelUID.receivedStatus = umidDetail.receivedStatus;
              vm.modelUID.packingSlipModeStatus = umidDetail.packingSlipModeStatus;
              vm.modelUID.binID = umidDetail.binID;
              vm.modelUID.currentBinName = umidDetail.currentBinName;
              vm.modelUID.toBinName = angular.copy(umidDetail.currentBinName);
              vm.modelUID.fromBinName = umidDetail.fromBinName;
              vm.modelUID.rohsIcon = umidDetail.rohsIcon;
              vm.modelUID.rohsName = umidDetail.rohsName;
              vm.modelUID.refcompid = umidDetail.refcompid;
              vm.modelUID.mfgCodeName = umidDetail.mfgCodeName;
              vm.modelUID.mfgCode = umidDetail.mfgCode;
              vm.modelUID.mfgName = umidDetail.mfgName;
              vm.modelUID.mfgType = umidDetail.mfgType;
              vm.modelUID.PIDCode = umidDetail.PIDCode;
              vm.modelUID.mfgPN = umidDetail.mfgPN;
              vm.modelUID.mfgcodeID = umidDetail.mfgcodeID;
              vm.modelUID.fromBin = umidDetail.fromBin;
              vm.modelUID.fromBin = umidDetail.fromBin;
              vm.modelUID.fromWarehouse = umidDetail.fromWarehouse;
              vm.modelUID.fromDepartment = umidDetail.fromDepartment;
              vm.modelUID.mfgPNDescription = umidDetail.mfgPNDescription;
              vm.modelUID.stockInventoryType = umidDetail.stockInventoryType;
              vm.modelUID.cofcCode = umidDetail.cofcCode;
              vm.modelUID.uomClassID = umidDetail.uomClassID;
              vm.modelUID.packagingName = umidDetail.packagingName;
              vm.modelUID.selfLifeDays = umidDetail.selfLifeDays || 0;
              vm.modelUID.shelfLifeAcceptanceDays = umidDetail.shelfLifeAcceptanceDays || 0;
              vm.modelUID.maxShelfLifeAcceptanceDays = umidDetail.maxShelfLifeAcceptanceDays || 0;
              vm.modelUID.mountingType = umidDetail.mountingTypeName || null;
              vm.modelUID.hasLimitedShelfLife = umidDetail.hasLimitedShelfLife;
              vm.modelUID.mslLevel = umidDetail.mslLevel;
              vm.modelUID.BalanceQty = umidDetail.BalanceQty;
              vm.modelUID.UMIDCreatedQty = umidDetail.UMIDCreatedQty;
              vm.modelUID.isSplitUID = umidDetail.isSplitUID;
              vm.modelUID.currentWHName = umidDetail.currentWHName;
              vm.modelUID.currentParentWHName = umidDetail.currentParentWHName;
              vm.modelUID.isReservedStock = umidDetail.isReservedStock;
              vm.modelUID.custAssyPN = umidDetail.custAssyPN;
              vm.modelUID.woAvailableQty = umidDetail.woAvailableQty;
              if (umidDetail.levelRating && umidDetail.time) {
                vm.modelUID.mslLevel = stringFormat('{0} ({1})', componentDetail.component_mslmst.levelRating, componentDetail.component_mslmst.time);
              }
              vm.modelUID.uidQty = _maxUMID;
              if (vm.modelUID.stockInventoryType === vm.InventoryType[0].value) {
                vm.modelUID.stockInventoryTypeValue = vm.InventoryType[0].Name;
                vm.modelUID.maxPossibleUMID = roundUpNum(convertUnitWithDecimalPlace(vm.modelUID.BalanceQty / vm.modelUID.orgQty)) < _maxUMID ? roundUpNum(convertUnitWithDecimalPlace(vm.modelUID.BalanceQty / vm.modelUID.orgQty)) : _maxUMID;
              } else if (vm.modelUID.stockInventoryType === vm.InventoryType[1].value) {
                vm.modelUID.stockInventoryTypeValue = vm.InventoryType[1].Name;
              } else if (vm.modelUID.stockInventoryType === vm.InventoryType[2].value) {
                vm.modelUID.stockInventoryTypeValue = vm.InventoryType[2].Name;
                vm.modelUID.maxPossibleUMID = roundUpNum(convertUnitWithDecimalPlace(vm.modelUID.woAvailableQty / vm.modelUID.orgQty)) < _maxUMID ? roundUpNum(convertUnitWithDecimalPlace(vm.modelUID.woAvailableQty / vm.modelUID.orgQty)) : _maxUMID;
              } else {
                vm.modelUID.stockInventoryTypeValue = vm.InventoryType[3].Name;
              }
              vm.modelUID.receiveMaterialTypeName = vm.modelUID.customerConsign ? vm.ReceivingMatirialTab.CPNReceive.title : vm.ReceivingMatirialTab.PartToStock.title;

              setFocus('uidQty');
              if (vm.modelUID.refcompid) {
                getNumberOfPrintsForUMID(vm.modelUID.refcompid);
                vm.getCurrentBinDetail();
              }
              vm.uid = angular.copy(vm.modelUID.uid);
              vm.uidId = angular.copy(vm.modelUID.uidId);
              vm.isUIDDisable = vm.uidId ? true : false;
              vm.headerData = [{
                label: vm.LabelConstant.UMIDManagement.UMID,
                value: vm.modelUID.uid,
                displayOrder: 1,
                labelLinkFn: vm.goToUMIDList,
                valueLinkFn: vm.goToUMIDDetail,
                isCopy: true
              },
              {
                label: vm.LabelConstant.MFG.MFG,
                value: vm.modelUID.mfgCodeName,
                displayOrder: 2,
                labelLinkFn: vm.goToMFGList,
                valueLinkFn: vm.goToManufacturerDetail,
                valueLinkFnParams: vm.modelUID.mfgcodeID,
                isCopy: true
              },
              {
                label: vm.LabelConstant.MFG.MPNCPN,
                value: vm.modelUID.mfgPN,
                displayOrder: 3,
                labelLinkFn: vm.goToPartList,
                valueLinkFn: vm.goToComponentDetailTab,
                isCopy: true,
                imgParms: {
                  imgPath: vm.modelUID.rohsIcon !== null ? stringFormat(CORE.RoHSImageFormat, CORE.WEB_URL, USER.ROHS_BASE_PATH, vm.modelUID.rohsIcon) : null,
                  imgDetail: vm.modelUID.rohsName
                }
              },
              {
                label: vm.LabelConstant.MFG.PID,
                value: vm.modelUID.PIDCode,
                displayOrder: 4,
                labelLinkFn: vm.goToPartList,
                valueLinkFn: vm.goToComponentDetailTab,
                isCopy: true,
                isCopyAheadLabel: true,
                imgParms: {
                  imgPath: vm.modelUID.rohsIcon !== null ? stringFormat(CORE.RoHSImageFormat, CORE.WEB_URL, USER.ROHS_BASE_PATH, vm.modelUID.rohsIcon) : null,
                  imgDetail: vm.modelUID.rohsName
                },
                isCopyAheadOtherThanValue: true,
                copyAheadLabel: vm.LabelConstant.MFG.MFGPN,
                copyAheadValue: vm.modelUID.mfgPN
              },
              {
                label: vm.LabelConstant.UMIDManagement.InventoryType,
                value: vm.modelUID.stockInventoryTypeValue,
                displayOrder: 5
              }];
              vm.copyModelUID = angular.copy(vm.modelUID);
            }
          } else {
            vm.cgBusyLoading = false;
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SCAN_UID_NOT_FOUND);
            messageContent.message = stringFormat(messageContent.message, vm.modelUID.uid);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.isUIDDisable = false;
                vm.modelUID.uid = null;
                setFocus('uid');
              }
            }, () => {

            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.pageInit();

    // Invoke when umid qty is entered
    vm.changeUMIDQty = () => {
      if (!vm.isCallQty && _maxUMID < vm.modelUID.uidQty) {
        vm.isCallQty = true;
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NO_OF_UMID_MORE_THAN_CONFIGURED);
        messageContent.message = stringFormat(messageContent.message, redirectToSettingDataKey(_maxUMID));
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        return DialogFactory.messageAlertDialog(model).then((yes) => {
          if (yes) {
            vm.isCallQty = false;
            vm.modelUID.uidQty = null;
            setFocus('uidQty');
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        $timeout(() => {
          vm.formIdenticalUMID.$$controls[0].$setDirty();
        });
      }
    };

    vm.manageFocus = (event, controlName) => {
      switch (controlName) {
        case 'toBinName':
          if (vm.autoCompletePrinter.keyColumnId && vm.autoCompleteLabelTemplate.keyColumnId && ((!event.shiftKey && event.keyCode === 9) || event.keyCode === 13)) {
            setFocus('saveIdenticalBtn');
          }
          break;
        case 'printer':
          if ((!event.shiftKey && event.keyCode === 9) || event.keyCode === 13) {
            if (vm.autoCompleteLabelTemplate.keyColumnId) {
              setFocus('saveIdenticalBtn');
            }
          }
          break;
        default:
          break;
      }
    };

    vm.onBlurCallbackFn = ($event) => vm.manageFocus($event, 'printer');

    // Check validation for transfer into same bin or not
    const checkBinValidation = () => {
      let messageContent;
      if (vm.modelUID.fromBin && vm.modelUID.binID === vm.modelUID.fromBin) {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.FROM_AND_TO_BIN_UMID_CREATION_VALIDATION);
      } else if (objToBin.id === vm.CORE_SystemGenratedWarehouseBin.bin.EmptyBin.id || objToBin.id === vm.CORE_SystemGenratedWarehouseBin.bin.OpeningBin.id) {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SCAN_VALID_BIN);
      } else if ((vm.modelUID.stockInventoryType === vm.InventoryType[0].value) && (objToBin && objToBin.warehousemst && objToBin.warehousemst.parentWHID !== vm.modelUID.fromDepartment)) {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.FROM_TO_DEPT_SAME);
      }
      if (messageContent) {
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        return DialogFactory.messageAlertDialog(model).then((yes) => {
          if (yes) {
            vm.modelUID.toBinName = vm.modelUID.binID = vm.modelUID.orgRecBin = vm.modelUID.orgRecWarehouse = vm.modelUID.orgRecDepartment = vm.modelUID.warehouseName = vm.modelUID.parentWHName = null;
            setFocus('toBinName');
            return false;
          }
        }, () => {
          vm.modelUID.toBinName = vm.modelUID.binID = vm.modelUID.orgRecBin = vm.modelUID.orgRecWarehouse = vm.modelUID.orgRecDepartment = vm.modelUID.warehouseName = vm.modelUID.parentWHName = null;
          setFocus('toBinName');
          return false;
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        return true;
      }
    };

    // Scan To bin
    vm.scanBin = ($event, callback) => {
      $timeout(() => {
        if ($event.keyCode === 13 || $event.keyCode === 9) {
          callback();
          vm.manageFocus($event, 'toBinName');
        }
      });
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent($event);
    };

    vm.getCurrentBinDetail = () => {
      if (vm.modelUID.toBinName) {
        vm.modelUID.binID = null;
        BinFactory.getBinDetailByName().query({
          name: vm.modelUID.toBinName
        }).$promise.then((response) => {
          if (response && response.data) {
            objToBin = response.data;
            vm.modelUID.binID = response.data.id;
            if (checkBinValidation()) {
              vm.modelUID.binID = objToBin.id;
              vm.modelUID.orgRecBin = objToBin.id;
              vm.modelUID.orgRecWarehouse = objToBin.WarehouseID;
              vm.modelUID.orgRecDepartment = objToBin.warehousemst ? objToBin.warehousemst.parentWHID : null;
              vm.modelUID.warehouseName = objToBin.warehousemst ? objToBin.warehousemst.Name : null;
              vm.modelUID.parentWHName = objToBin.warehousemst && objToBin.warehousemst.parentWarehouseMst ? objToBin.warehousemst.parentWarehouseMst.Name : null;
            }
          } else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SCAN_VALID_BIN);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.modelUID.toBinName = vm.modelUID.binID = vm.modelUID.orgRecBin = vm.modelUID.orgRecWarehouse = vm.modelUID.orgRecDepartment = vm.modelUID.warehouseName = vm.modelUID.parentWHName = null;
                setFocus('toBinName');
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.modelUID.toBinName = vm.modelUID.binID = vm.modelUID.orgRecBin = vm.modelUID.orgRecWarehouse = vm.modelUID.orgRecDepartment = vm.modelUID.warehouseName = vm.modelUID.parentWHName = null;
      }
    };

    // manage all vaidation before save
    vm.SaveUMID = () => {
      const componentSidStockDetails = {
        uid: vm.modelUID.uid,
        refcompid: vm.modelUID.refcompid,
        PIDCode: vm.modelUID.PIDCode,
        scanlabel: vm.modelUID.scanlabel,
        pkgQty: vm.modelUID.orgQty,
        orgQty: vm.modelUID.orgQty,
        pkgUnit: vm.modelUID.orgPkgUnit,
        orgPkgUnit: vm.modelUID.orgPkgUnit,
        isinStk: true,
        costCategoryID: vm.modelUID.costCategoryID,
        lotCode: vm.modelUID.lotCode,
        dateCode: vm.modelUID.dateCode,
        fromDateCodeFormat: vm.modelUID.fromDateCodeFormat,
        dateCodeFormatID: vm.modelUID.dateCodeFormatID,
        nickName: vm.modelUID.nickName,
        prefix: vm.modelUID.prefix,
        uidPrefix: vm.modelUID.uidPrefix,
        customerID: vm.modelUID.customerID,
        pcbPerArray: vm.modelUID.pcbPerArray,
        sealDate: vm.modelUID.sealDate,
        spq: vm.modelUID.spq,
        cpn: vm.modelUID.cpn,
        RefCPNMFGPNID: vm.modelUID.RefCPNMFGPNID,
        mfgAvailabel: vm.modelUID.mfgAvailabel,
        assyID: vm.modelUID.uidAssyID,
        stockInventoryType: vm.modelUID.stockInventoryType,
        receiveMaterialType: vm.modelUID.receiveMaterialType,
        uom: vm.modelUID.uom,
        packaging: vm.modelUID.packaging,
        refSupplierPartId: vm.modelUID.refSupplierPartId,
        binID: vm.modelUID.binID,
        fromBin: vm.modelUID.fromBin,
        orgRecBin: vm.modelUID.orgRecBin,
        customerConsign: vm.modelUID.customerConsign,
        specialNote: vm.modelUID.specialNote,
        fromWarehouse: vm.modelUID.fromWarehouse,
        fromDepartment: vm.modelUID.fromDepartment,
        orgRecWarehouse: vm.modelUID.orgRecWarehouse,
        orgRecDepartment: vm.modelUID.orgRecDepartment,
        mfrDateCodeFormatID: vm.modelUID.mfrDateCodeFormatID,
        mfrDateCode: vm.modelUID.mfrDateCode,
        rohsStatusID: vm.modelUID.uidRohsStatusID,
        woID: vm.modelUID.woID,
        woNumber: vm.modelUID.woNumber,
        selfLifeDays: vm.modelUID.selfLifeDays,
        shelfLifeAcceptanceDays: vm.modelUID.shelfLifeAcceptanceDays,
        maxShelfLifeAcceptanceDays: vm.modelUID.maxShelfLifeAcceptanceDays,
        isReservedStock: vm.modelUID.isReservedStock,
        mfgCodeName: vm.modelUID.mfgCodeName,
        mfgPN: vm.modelUID.mfgPN,
        partRohsIcon: vm.modelUID.rohsIcon,
        partRohsName: vm.modelUID.rohsName,
        isCustom: vm.modelUID.isCustom,
        binName: vm.modelUID.toBinName,
        fromBinName: vm.modelUID.fromBinName,
        finalMfgPn: `${redirectToManufacturerDetail(vm.modelUID.mfgcodeID, vm.modelUID.mfgName)}${redirectToPartDetail(vm.modelUID.refcompid, vm.modelUID.mfgType, vm.modelUID.PIDCode)}`,
        warehouseName: vm.modelUID.warehouseName,
        parentWHName: vm.modelUID.parentWHName,
        packagingName: vm.modelUID.packagingName,
        unitName: vm.modelUID.unitName,
        uomClassID: vm.modelUID.uomClassID,
        printFormateName: vm.modelUID.printFormateName,
        printerName: vm.modelUID.printerName,
        noprint: vm.modelUID.noprint,
        uidQty: vm.modelUID.uidQty,
        packingSlipDetailId: vm.modelUID.packingSlipDetID,
        receiveMaterialTypeName: vm.modelUID.receiveMaterialTypeName,
        kitAllocation: {},
        delimiterDetails: [],
        approvalReasonList: [],
        packingSlipNumber: vm.modelUID.packingSlipNumber,
        mfgPNDescription: vm.modelUID.mfgPNDescription,
        custAssyPN: vm.modelUID.custAssyPN
      };

      vm.cgBusyLoading = ReceivingMaterialFactory.manageIdenticalUMID().query({
        componentSidStk: componentSidStockDetails
      }).$promise.then((res) => {
        vm.isUIDDisable = vm.uidId ? true : false;
        vm.saveBtnDisableFlag = false;
        if (res.data && res.data.generatedUMIDList && res.data.generatedUMIDList.length > 0) {
          vm.generatedUMIDList.push(...res.data.generatedUMIDList);
          $scope.$broadcast('updateGeneratedUMIDList', res.data.generatedUMIDList);
          vm.isCallGeneratedUMIDDirective = true;
          vm.reset();
          if (res.data.printList && res.data.printList.length > 0) {
            ReceivingMaterialFactory.getDataForPrintLabelTemplate().query({
              printList: res.data.printList
            }).$promise.then(() => {
            }).catch((error) => BaseService.getErrorLog(error));
          }
          $timeout(() => {
            vm.formIdenticalUMID.$setPristine();
            vm.formIdenticalUMID.$setUntouched();
          });
        }
        if (res.data && res.data.messageTypeCode) {
          if (res.data.messageTypeCode === 'STOCK_NOT_EXISTS') {
            const messageContentData = angular.copy(res.data.messageContent);
            messageContentData.message = stringFormat(messageContentData.message, redirectToPackingSlipDetail(vm.modelUID.packingSlipID, vm.modelUID.packingSlipNumber));
            const obj = {
              messageContent: messageContentData,
              btnText: CORE.MESSAGE_CONSTANT.GO_TO_PENDING_STOCK,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_FOR_CANCEL
            };
            return DialogFactory.messageConfirmDialog(obj).then((item) => {
              if (item) {
                setFocus('uidQty');
                const keywords = stringFormat('{0}{1}{2}{3}{4}{5}{6}', vm.modelUID.PIDCode, _groupConcatSeparatorValue, vm.modelUID.packingSlipNumber, _groupConcatSeparatorValue, vm.modelUID.mfgCodeName, _groupConcatSeparatorValue, vm.modelUID.mfgCodeID);
                BaseService.goToNonUMIDStockList(row.warehouseID, row.binID, keywords);
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          } else if (res.data.messageTypeCode === 'PS_POSTING_STATUS_NOT_ALLOW' || res.data.messageTypeCode === 'PS_RECEIVED_STATUS_NOT_ALLOW_UMID' || res.data.messageTypeCode === 'BIN_NOT_HAVE_STOCK') {
            const messageContentData = angular.copy(res.data.messageContent);
            const model = {
              messageContent: messageContentData,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                setFocus('uidQty');
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          } else if (res.data.messageTypeCode === 'SPLIT_UID_NOT_ALLOW') {
            const messageContentData = angular.copy(res.data.messageContent);
            messageContentData.message = stringFormat(messageContentData.message, redirectToUMIDDetail(vm.modelUID.uidId, vm.modelUID.uid));
            const model = {
              messageContent: messageContentData,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                setFocus('uidQty');
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.validationForSaveUMID = () => {
      vm.saveBtnDisableFlag = true;
      if (BaseService.focusRequiredField(vm.formIdenticalUMID)) {
        vm.saveBtnDisableFlag = false;
        return;
      }
      if (!vm.modelUID.orgRecBin && !vm.modelUID.orgRecWarehouse && !vm.modelUID.orgRecDepartment) {
        vm.saveBtnDisableFlag = false;
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RE_ENTER_BIN);
        messageContent.message = stringFormat(messageContent.message, 'To Location/Bin', 'To Location/Bin');
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        return DialogFactory.messageAlertDialog(model).then((yes) => {
          if (yes) {
            setFocus('toBinName');
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      if (manageUMIDCreationValidation(vm.modelUID, false)) {
        vm.saveBtnDisableFlag = false;
        return;
      }
      if (checkBinValidation) {
        vm.SaveUMID();
      } else {
        vm.saveBtnDisableFlag = false;
        return;
      }
    };

    vm.addNew = () => {
      const isdirty = vm.checkFormDirty(vm.formIdenticalUMID);
      if (isdirty) {
        const data = {
          form: vm.formIdenticalUMID
        };
        const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_RESET_BODY_MESSAGE);
        const obj = {
          messageContent: messgaeContent,
          btnText: CORE.MESSAGE_CONSTANT.RESET_POPUP_BUTTON,
          canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
        };
        DialogFactory.messageConfirmDialog(obj).then(() => {
          if (data) {
            vm.pageInit();
            vm.formIdenticalUMID.$setPristine();
          }
        }, () => {
        }, (error) => BaseService.getErrorLog(error));
      } else {
        vm.pageInit();
        vm.formIdenticalUMID.$setPristine();
      }
    };

    vm.reset = () => {
      vm.pageInit();
    };

    /** Redirect to umid list page */
    vm.goToUMIDList = () => {
      BaseService.goToUMIDList();
    };

    /** Redirect to manage umid page */
    vm.goToUMIDDetail = () => BaseService.goToUMIDDetail(vm.uidId);

    vm.goToPrinterList = () => {
      BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_PRINTER_TYPE_STATE, {});
    };

    vm.goToPrinterLabelList = () => {
      BaseService.openInNew(USER.ADMIN_LABELTEMPLATE_PRINTER_FORMAT_STATE, {});
    };

    vm.goToPartList = () => {
      BaseService.goToPartList();
    };
    vm.goToCostCategoryList = () => {
      BaseService.openInNew(USER.ADMIN_COST_CATEGORY_STATE, {});
    };

    vm.goToLocationList = () => {
      BaseService.openInNew(vm.TransactionData.TRANSACTION_BIN_STATE, {});
    };

    vm.goToCustomerList = () => {
      BaseService.goToCustomerList();
    };

    vm.goToPackaging = () => {
      BaseService.goToPackaging();
    };

    vm.goToUOMList = () => {
      BaseService.openInNew(USER.ADMIN_UNIT_STATE, {});
    };

    vm.goToMFGList = () => {
      BaseService.goToManufacturerList();
    };

    vm.goToManufacturerDetail = (id) => {
      BaseService.goToManufacturer(id);
    };

    vm.goToRoHSStatusList = () => {
      BaseService.openInNew(USER.ADMIN_ROHS_STATE, {});
    };

    vm.goToCofC = () => {
      BaseService.goToCofC(vm.modelUID.uidId);
    };

    vm.goToWHList = () => {
      BaseService.goToWHList();
    };

    // go to part master detail tab
    vm.goToComponentDetailTab = (mfgType, refcompid) => {
      const partID = refcompid ? refcompid : vm.modelUID.refcompid;
      const type = mfgType ? mfgType.toLowerCase() : vm.modelUID.mfgType;
      BaseService.goToComponentDetailTab(type, partID, USER.PartMasterTabs.Detail.Name);
    };

    const redirectToPackingSlipDetail = (pId, pPackingSlipNumber) => {
      const redirectToPartUrl = BaseService.generatePackingSlipRedirectURL(TRANSACTION.PackingSlipTabType.PackingSlip, pId);
      return BaseService.getHyperlinkHtml(redirectToPartUrl, pPackingSlipNumber);
    };

    const redirectToPartDetail = (pId, mfgType, mfrPN) => {
      const type = mfgType ? mfgType.toLowerCase() : CORE.MFG_TYPE.MFG;
      const redirectToPartUrl = BaseService.generateComponentRedirectURL(pId, type);
      return BaseService.getHyperlinkHtml(redirectToPartUrl, mfrPN);
    };

    const redirectToManufacturerDetail = (mfgCodeID, mfrPN) => {
      const redirectToPartUrl = BaseService.generateManufacturerDetailRedirectURL(CORE.CUSTOMER_TYPE.MANUFACTURER, mfgCodeID);
      return BaseService.getHyperlinkHtml(redirectToPartUrl, mfrPN);
    };

    const redirectToUMIDDetail = (id, uid) => {
      const redirectUrl = BaseService.generateUMIDRedirectURL(id);
      return BaseService.getHyperlinkHtml(redirectUrl, uid);
    };

    const redirectToSettingDataKey = (value) => {
      const redirectUrl = BaseService.generateDataKeyRedirectURL();
      return BaseService.getHyperlinkHtml(redirectUrl, value);
    };

    vm.cancel = () => {
      vm.formIdenticalUMID.$setPristine();
      BaseService.currentPagePopupForm = [];
      $mdDialog.cancel(vm.generatedUMIDList && vm.generatedUMIDList.length > 0 ? true : false);
    };

    //on load submit form
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.formIdenticalUMID);
    });
  }
})();
