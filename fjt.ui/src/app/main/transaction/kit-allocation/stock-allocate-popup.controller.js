(function () {
  'use strict';

  angular
    .module('app.transaction.kitAllocation')
    .controller('StockAllocatePopUpController', StockAllocatePopUpController);

  /** @ngInject */
  function StockAllocatePopUpController($q, $scope, $mdDialog, $filter, BaseService, DialogFactory, USER, CORE, data, TRANSACTION,
    KitAllocationFactory, ReceivingMaterialFactory, WarehouseBinFactory, socketConnectionService, NotificationFactory,
    $rootScope, PRICING, $timeout) {
    const vm = this;
    vm.CORE = CORE;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.transaction = TRANSACTION;
    vm.lineDetail = data.partDetail;
    vm.salesOrderDetail = data.salesOrderDetail;
    vm.rowField = data.rowField;
    vm.stockType = data.stockType;
    vm.assemblyDetail = data.assemblyDetail;
    vm.isShowNextPrevious = data.isShowNextPrevious;
    vm.isConsolidatedTab = data.isConsolidatedTab;
    vm.stockList = [];
    vm.haltResumePopUp = CORE.HaltResumePopUp;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.LabelConstant = CORE.LabelConstant;
    vm.CartShowGrayImagePath = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, 'show-gray.png');
    vm.CartShowGreenImagePath = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, 'show-green.png');
    vm.warehouseType = TRANSACTION.warehouseType;
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.STOCK_ALLOCATION;
    vm.MEASUREMENT_TYPES_COUNT = CORE.MEASUREMENT_TYPES.COUNT;
    vm.ErrorCode = TRANSACTION.STOCKALLOCATIONERRORCODE;

    // to set empty state message based on rowfield
    if (vm.rowField === 'AllocatedStock') {
      vm.EmptyMesssage.MESSAGE = vm.EmptyMesssage.ALLOCATE_STOCK_MESSAGE;
    } else if (vm.rowField === 'AvailableStock' && vm.stockType === 'IS') {
      vm.EmptyMesssage.MESSAGE = vm.EmptyMesssage.INTERNAL_STOCK_MESSAGE;
    } else if (vm.rowField === 'AvailableStock' && vm.stockType === 'CS') {
      vm.EmptyMesssage.MESSAGE = vm.EmptyMesssage.CUSTOMER_STOCK_MESSAGE;
    } else if (vm.rowField === 'ConsumedStock') {
      vm.EmptyMesssage.MESSAGE = vm.EmptyMesssage.CONSUMED_STOCK_MESSAGE;
    }

    const loginUser = BaseService.loginUser;
    let objApproval = null;
    let rohsStatusDetail = null;
    let buyAndStockMismatchDetail = null;

    vm.goToAssemblyList = () => {
      BaseService.goToPartList();
      return false;
    };

    vm.goToAssemblyDetails = (data) => {
      BaseService.goToComponentDetailTab(null, data.id);
      return false;
    };

    vm.goToCustomerList = () => {
      BaseService.goToCustomerList();
      return false;
    };

    vm.goToCustomer = (data) => {
      BaseService.goToCustomer(data.id);
      return false;
    };

    vm.getHoldResumeStatus = (responseData) => {
      if (responseData.salesOrderDetailId === vm.salesOrderDetail.SalesOrderDetailId) {
        vm.refType = [vm.haltResumePopUp.refTypePO, vm.haltResumePopUp.refTypeKA];
        vm.cgBusyLoading = KitAllocationFactory.getHoldResumeStatus().query({
          salesOrderDetId: responseData.salesOrderDetailId,
          refType: vm.refType
        }).$promise.then((response) => {
          if (response) {
            vm.poHalt = _.find(response.data, (item) => item.refType === vm.haltResumePopUp.refTypePO);
            vm.kaHalt = _.find(response.data, (item) => item.refType === vm.haltResumePopUp.refTypeKA);
            if (vm.poHalt) {
              vm.isPOHalt = true;
            } else {
              vm.isPOHalt = false;
            }
            if (vm.kaHalt) {
              vm.isKAHalt = true;
            } else {
              vm.isKAHalt = false;
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    const getStockAllocateList = () => {
      if (vm.lineDetail) {
        const partId = vm.lineDetail.mfgPart;
        vm.cgBusyLoading = KitAllocationFactory.getStockAllocateList().query({
          refSalesOrderDetId: vm.salesOrderDetail.SalesOrderDetailId,
          assyId: vm.assemblyDetail && vm.assemblyDetail.partId ? vm.assemblyDetail.partId : 0,
          partIds: partId,
          toUom: vm.lineDetail.uomID,
          rfqLineItemIds: vm.assemblyDetail && vm.lineDetail.refRfqLineitem ? vm.lineDetail.refRfqLineitem.toString() : vm.lineDetail.ConsolidatedLineItemIDs,
          customerId: vm.stockType === 'CS' ? vm.salesOrderDetail.customerID : null,
          rowField: vm.rowField,
          stockType: vm.stockType
        }).$promise.then((response) => {
          let sortedList;
          if (response.data && response.data.stockList) {
            if (vm.assemblyDetail) {
              const sameRohsStatus = _.filter(response.data.stockList, (item) => item.UMIDRohsStatusID === vm.assemblyDetail.kitRohsId);
              const differentRohsStatus = _.filter(response.data.stockList, (item) => item.UMIDRohsStatusID !== vm.assemblyDetail.kitRohsId);
              vm.anyNotAvailableMpn = _.filter(response.data.stockList, (item) => item.refcompid === CORE.NOTAVAILABLEMFRPNID);
              vm.isCPNPartHavingNotavailableMPN = vm.lineDetail.cpnMfgPNIdsWithPackaging ? vm.lineDetail.cpnMfgPNIdsWithPackaging.contains(CORE.NOTAVAILABLEMFRPNID) : false;
              if (sameRohsStatus.length > 0) {
                sortedList = [...sameRohsStatus, ...differentRohsStatus];
              }
              else {
                sortedList = [...differentRohsStatus, ...sameRohsStatus];
              }
            }
            else {
              sortedList = response.data.stockList;
            }
            vm.stockList = sortedList;
            _.map(vm.stockList, (data) => {
              data.isSelect = false;
              data.uomID = vm.lineDetail.uomID;
              data.uomClassID = vm.lineDetail.uomClassID;
              data.convertedUnitName = vm.lineDetail.unitName;
              data.FreeToShare = data.FreeToShare ? convertNumberWithDecimalPlace(data.FreeToShare, _unitFilterDecimal) : 0;
              data.allocationUnits = 0;
              data.allocationPins = 0;
              data.scrapPins = 0;
              data.inValidAllocationUnit = false;
              data.pendingUMIDQty = vm.rowField === 'AvailableStock' ? data.pendingUMIDQty : 0;
              data.pendingUMIDUnits = vm.rowField === 'AvailableStock' ? convertNumberWithDecimalPlace(parseFloat(data.pendingUMIDQty ? data.pendingUMIDQty : 0) * parseFloat(data.unit ? data.unit : 0), _unitFilterDecimal) : 0;
              data.disableShowLight = vm.rowField === 'AllocatedStock' ? ((data.warehouseType !== vm.transaction.warehouseType.SmartCart.key) || (data.isTransit === 'Yes')) : true;
            });

            vm.isMountingTypeMismatch = vm.stockList.find((item) => item.mountingTypeID === -1) ? true : false;
            vm.isFunctionalTypeMismatch = vm.stockList.find((item) => item.partType === -1) ? true : false;

            if (!vm.isCPNPartHavingNotavailableMPN || (vm.anyNotAvailableMpn && vm.anyNotAvailableMpn.length > 0)) {
              if (vm.rowField === 'AvailableStock') {
                if (vm.isMountingTypeMismatch) {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MISMATCH_DATA_KITALLOCATION);
                  messageContent.message = stringFormat(messageContent.message, 'Mounting Type', vm.lineDetail && vm.lineDetail.lineID ? vm.lineDetail.lineID : null);
                  vm.mountingTypeMismatchMesaage = messageContent.message;
                }

                if (vm.isFunctionalTypeMismatch) {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MISMATCH_DATA_KITALLOCATION);
                  messageContent.message = stringFormat(messageContent.message, 'Functional Type', vm.lineDetail && vm.lineDetail.lineID ? vm.lineDetail.lineID : null);
                  vm.functionalTypeMismatchMesaage = messageContent.message;
                }
              }
            }
            vm.getFooterAllocationTotal();
            vm.getFooterFreeUnitsTotal();
            vm.getFooterAllocatedUnitTotal();
            vm.getFooterPendingUMIDTotal();
            if (!vm.isFunctionalTypeMismatch && !vm.isMountingTypeMismatch) {
              if (vm.rowField === 'AvailableStock') {
                autoSelectUMIDStock();
              }
            }
          }
          if (vm.stockList && vm.stockList.length > 0) {
            vm.isAllSelect = _.sumBy(vm.stockList, (item) => item.isSelect === true);
            vm.isNoDataFound = false;
          } else {
            vm.isNoDataFound = true;
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.isNoDataFound = true;
      }
    };

    // to select all umid stock for allocation
    vm.selectAllUMID = () => {
      if (vm.isAllSelect) {
        _.map(vm.stockList, (data) => {
          if (data.id && !data.isUMIDRestrict) {
            data.isSelect = true;
            vm.anyItemSelect = true;
            data.allocationUnits = data.FreeToShare;
            data.remaingUnit = data.allocationUnits - data.FreeToShare;
            if (vm.lineDetail.connecterTypeID === vm.CORE.ConnectorType.HEADERBREAKAWAY.ID) {
              const modOfPin = (data.noOfPosition || 0) % (vm.lineDetail.numOfPosition || 0);
              const calculatedPin = CalcSumofArrayElement([(data.noOfPosition || 0), ((modOfPin || 0) * -1)], _amountFilterDecimal);
              data.allocationPins = multipleUnitValue((data.allocationUnits || 0), (calculatedPin || 0));
              data.scrapPins = multipleUnitValue((data.allocationUnits || 0), (modOfPin || 0));
            }
          }
        });
      } else {
        _.map(vm.stockList, (data) => {
          data.isSelect = false;
          data.allocationUnits = 0;
          data.remaingUnit = data.allocationUnits - data.FreeToShare;
          data.allocationPins = 0;
          data.scrapPins = 0;
        });
        vm.anyItemSelect = false;
      }
      vm.getFooterAllocationTotal();
    };

    // while stock allocation popup is open then it will set free to allocate stock
    const autoSelectUMIDStock = () => {
      let freeToallocate = vm.remainingAllocation;
      _.map(vm.stockList, (data) => {
        if (data.id && !data.isUMIDRestrict && freeToallocate) {
          data.isSelect = true;
          vm.anyItemSelect = true;
          data.allocationUnits = data.FreeToShare < freeToallocate ? data.FreeToShare : freeToallocate;
          data.remaingUnit = data.FreeToShare - data.allocationUnits;
          freeToallocate = freeToallocate - data.allocationUnits;
          if (vm.lineDetail.connecterTypeID === vm.CORE.ConnectorType.HEADERBREAKAWAY.ID) {
            const modOfPin = (data.noOfPosition || 0) % (vm.lineDetail.numOfPosition || 0);
            const calculatedPin = CalcSumofArrayElement([(data.noOfPosition || 0), ((modOfPin || 0) * -1)], _amountFilterDecimal);
            data.allocationPins = multipleUnitValue((data.allocationUnits || 0), (calculatedPin || 0));
            data.scrapPins = multipleUnitValue((data.allocationUnits || 0), (modOfPin || 0));
          }
        }
      });
      vm.getFooterAllocationTotal();
    };

    // on check/uncheck manage UMID stock allocation
    vm.selectUMID = (item) => {
      if (item.isSelect) {
        const checkAnyDeSelect = _.some(vm.stockList, (data) => data.isSelect === false && data.id);
        if (checkAnyDeSelect) {
          vm.isAllSelect = false;
        } else {
          vm.isAllSelect = true;
        }
        item.allocationUnits = item.FreeToShare;
        item.remaingUnit = item.FreeToShare - item.allocationUnits;

        if (vm.lineDetail.connecterTypeID === vm.CORE.ConnectorType.HEADERBREAKAWAY.ID) {
          const modOfPin = item.noOfPosition % (vm.lineDetail.numOfPosition || 0);
          const calculatedPin = CalcSumofArrayElement([item.noOfPosition, ((modOfPin || 0) * -1)], _amountFilterDecimal);
          item.allocationPins = multipleUnitValue(item.allocationUnits, calculatedPin);
          item.scrapPins = multipleUnitValue(item.allocationUnits, modOfPin);
        }
      } else {
        vm.isAllSelect = false;
        item.allocationUnits = 0;
        item.remaingUnit = item.FreeToShare - item.allocationUnits;
        item.allocationPins = 0;
        item.scrapPins = 0;
      }
      vm.anyItemSelect = _.some(vm.stockList, (data) => data.isSelect === true);
      vm.getFooterAllocationTotal(item);
    };

    vm.checkReserveStock = (isExit) => {
      let messageContent = null;
      if (vm.isMountingTypeMismatch) {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MISMATCH_DATA_KITALLOCATION);
        messageContent.message = stringFormat(messageContent.message, 'Mounting Type', vm.lineDetail && vm.lineDetail.lineID ? vm.lineDetail.lineID : null);
      } else if (vm.isFunctionalTypeMismatch) {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MISMATCH_DATA_KITALLOCATION);
        messageContent.message = stringFormat(messageContent.message, 'Functional Type', vm.lineDetail && vm.lineDetail.lineID ? vm.lineDetail.lineID : null);
      } else if (vm.isKAHalt || vm.isPOHalt) {
        let label = vm.isPOHalt ? vm.haltResumePopUp.POHaltLabel : vm.haltResumePopUp.KitAllocationHaltLabel;
        label = stringFormat('{0}:{1}', label, vm.isPOHalt ? vm.poHalt.reason : vm.kaHalt.reason);
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.KIT_ALLOCATION_PO_HALT_ERROR);
        messageContent.message = stringFormat(messageContent.message, label, vm.isPOHalt ? vm.poHalt.empInitialName : vm.kaHalt.empInitialName, vm.isPOHalt ? vm.poHalt.startDate : vm.kaHalt.startDate);
      } else {
        const checkReserveCustomer = _.filter(vm.stockList, (data) => {
          if (data.isSelect && data.isReservedStock === true && vm.salesOrderDetail.customerID !== data.customerID) {
            return data;
          }
        });

        if (checkReserveCustomer.length > 0) {
          const umidString = _.map(checkReserveCustomer, 'uid').join(',');
          const cutomerString = _.map(_.uniqBy(checkReserveCustomer, 'customerID'), 'customer').join(',');
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RESERVE_FOR_CUSTOMER);
          messageContent.message = stringFormat(messageContent.message, umidString, cutomerString, vm.salesOrderDetail.companyName);
        } else {
          const checkReserveAssy = _.filter(vm.stockList, (data) => {
            if (data.isSelect && data.isReservedStock === true && data.assyID && data.assyID !== vm.assemblyDetail.partId) {
              return data;
            }
          });

          if (checkReserveAssy.length > 0) {
            const umidString = _.map(checkReserveAssy, 'uid').join(',');
            const assyString = _.map(_.uniqBy(checkReserveAssy, 'assyID'), 'assembly').join(',');
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RESERVE_FOR_ASSY);
            messageContent.message = stringFormat(messageContent.message, umidString, assyString, vm.assemblyDetail.pIDCode);
          } else {
            vm.checkRestrictPart(isExit);
          }
        }
      }

      if (messageContent) {
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        return false;
      }
    };

    vm.checkRestrictPart = (isExit) => {
      let messageContent = null;
      if (!vm.lineDetail.isInstall && !vm.lineDetail.isPurchase && vm.lineDetail.isBuyDNPQty === CORE.BuyDNPQTYDropdown[0].value) {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PART_NOT_POPULATE);
      } else {
        const notCleanPID = _.map(_.uniqBy(_.filter(vm.stockList, (data) => data.isSelect && !data.lineCleanStatus), 'PIDCode'), 'PIDCode').join(', ');
        if (notCleanPID) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BOM_LINE_NOT_CLEAN);
          messageContent.message = stringFormat(messageContent.message, vm.assemblyDetail ? vm.assemblyDetail.pIDCode : null, vm.lineDetail ? vm.lineDetail.lineID : null, notCleanPID);
        }
      }

      if (messageContent) {
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        return false;
      }

      const checkBadPart = _.uniqBy(_.filter(vm.stockList, (data) => data.isGoodPart !== CORE.PartCorrectList.CorrectPart && data.isSelect), 'PIDCode');

      const checkRestrictPartPermently = _.uniqBy(_.filter(vm.stockList, (data) => data.restrictUsePermanently && !vm.lineDetail.custPNID && data.isSelect), 'PIDCode');
      const checkRestrictPartWithPermission = _.uniqBy(_.filter(vm.stockList, (data) => data.restrictUSEwithpermission && !vm.lineDetail.custPNID && data.customerApproveStatus !== CORE.CustomerApprovalStatus.Approve && data.isSelect), 'PIDCode');
      const checkRestrictPackagingPermently = _.uniqBy(_.filter(vm.stockList, (data) => data.restrictPackagingUsePermanently && !vm.lineDetail.custPNID && data.isSelect), 'PIDCode');
      const checkRestrictPackagingPermission = _.uniqBy(_.filter(vm.stockList, (data) => data.restrictPackagingUseWithpermission && !vm.lineDetail.custPNID && data.customerApproveStatus !== CORE.CustomerApprovalStatus.Approve && data.isSelect), 'PIDCode');

      const checkRestrictCPNPackagingPermently = _.uniqBy(_.filter(vm.stockList, (data) => data.restrictPackagingUsePermanently && vm.lineDetail.custPNID && data.isSelect), 'PIDCode');
      const checkRestrictCPNPackagingPermission = _.uniqBy(_.filter(vm.stockList, (data) => data.restrictPackagingUseWithpermission && vm.lineDetail.custPNID && data.customerApproveStatusCPN !== CORE.CustomerApprovalStatus.Approve && data.isSelect), 'PIDCode');

      const checkRestrictPartPermentlyOnBOM = _.uniqBy(_.filter(vm.stockList, (data) => data.restrictUseInBOM && data.isSelect), 'PIDCode');
      const checkRestrictPartPermissionOnBOM = _.uniqBy(_.filter(vm.stockList, (data) => data.restrictUseInBOMWithPermission && data.isSelect), 'PIDCode');
      const checkRestrictPartPermentlyPackaginOnBOM = _.uniqBy(_.filter(vm.stockList, (data) => data.restrictUseInBOMExcluding && data.isSelect), 'PIDCode');
      const checkRestrictPartPermissionPackaginOnBOM = _.uniqBy(_.filter(vm.stockList, (data) => data.restrictUseInBOMExcludingAliasWithPermission && data.isSelect), 'PIDCode');

      const checkRestrictCPNPartPermentlyOnBOM = _.uniqBy(_.filter(vm.stockList, (data) => data.restrictUseCPNInBOM && data.isSelect), 'PIDCode');

      if (checkBadPart.length > 0) {
        const pidString = _.map(checkBadPart, 'PIDCode').join(',');
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INCORRECT_PID);
        messageContent.message = stringFormat(messageContent.message, pidString);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
      } else if (checkRestrictPartPermently.length > 0 || checkRestrictPackagingPermently.length > 0 || checkRestrictCPNPackagingPermently.length > 0) { // || checkRestrictPartOnBOM.length > 0
        let messageContent = null;
        if (checkRestrictPartPermently.length > 0) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MFR_RESTRICTED_PART);
          messageContent.message = stringFormat(messageContent.message, _.map(checkRestrictPartPermently, 'PIDCode').join(','), CORE.RestrictWithPermissionLabel.RestrictUSEWithPermanently);
        } else if (checkRestrictPackagingPermently.length > 0) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MFR_RESTRICTED_PACKAGING_PART);
          messageContent.message = stringFormat(messageContent.message, _.map(checkRestrictPackagingPermently, 'PIDCode').join(','), CORE.RestrictWithPermissionLabel.RestrictPackagingUSEWithPermanently);
        } else {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CPN_PERMISSION_PART_NOT_CUSTOMER_APPROVE);
          messageContent.message = stringFormat(messageContent.message, _.map(checkRestrictCPNPackagingPermently, 'PIDCode').join(','), CORE.RestrictWithPermissionLabel.RestrictPackagingUSEWithPermanently);
        }

        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
      } else if (checkRestrictPartPermentlyOnBOM.length > 0 || checkRestrictPartPermentlyPackaginOnBOM.length > 0 || checkRestrictCPNPartPermentlyOnBOM.length > 0) {
        let messageContent = null;
        if (checkRestrictPartPermentlyOnBOM.length > 0) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PART_RESTRICT_IN_BOM);
          messageContent.message = stringFormat(messageContent.message, stringFormat(TRANSACTION.PART_RESTRICT_IN_BOM, _.map(checkRestrictPartPermentlyOnBOM, 'PIDCode').join(',')));
        } else if (checkRestrictPartPermentlyPackaginOnBOM.length > 0) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PART_RESTRICT_PACKAGING_IN_BOM);
          messageContent.message = stringFormat(messageContent.message, _.map(checkRestrictPartPermentlyPackaginOnBOM, 'PIDCode').join(','));
        } else {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CPN_PART_RESTRICT_IN_BOM);
          messageContent.message = stringFormat(messageContent.message, _.map(checkRestrictCPNPartPermentlyOnBOM, 'PIDCode').join(','));
        }

        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
      } else if (checkRestrictPartWithPermission.length > 0 || checkRestrictPackagingPermission.length > 0 || checkRestrictCPNPackagingPermission.length > 0) {
        let messageContent = null;
        if (checkRestrictPartWithPermission.length > 0) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PERMISSION_PART_NOT_CUSTOMER_APPROVE);
          messageContent.message = stringFormat(messageContent.message, _.map(checkRestrictPartWithPermission, 'PIDCode').join(','), CORE.RestrictWithPermissionLabel.RestrictUSEWithPermission);
        } else if (checkRestrictPackagingPermission.length > 0) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PERMISSION_PART_NOT_CUSTOMER_APPROVE);
          messageContent.message = stringFormat(messageContent.message, _.map(checkRestrictPackagingPermission, 'PIDCode').join(','), CORE.RestrictWithPermissionLabel.RestrictPackagingUSEWithPermission);
        } else {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CPN_PERMISSION_PART_NOT_CUSTOMER_APPROVE);
          messageContent.message = stringFormat(messageContent.message, _.map(checkRestrictCPNPackagingPermently, 'PIDCode').join(','), CORE.RestrictWithPermissionLabel.RestrictPackagingUSEWithPermission);
        }
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
      } else if (checkRestrictPartPermissionOnBOM.length > 0) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PART_RESTRICT_WITH_PERMISSION_IN_BOM);
        messageContent.message = stringFormat(messageContent.message, _.map(checkRestrictPartPermissionOnBOM, 'PIDCode').join(','));
        const messageContentFillDetail = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.FILL_DETAIL_FOR_KIT_ALLOCATION);
        getAuthenticationOfApprovalPart(stringFormat('{0} {1}', messageContent.message, messageContentFillDetail.message));
      } else if (checkRestrictPartPermissionPackaginOnBOM.length > 0) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PART_RESTRICT_PACKAGING_IN_BOM_PERMISSION);
        messageContent.message = stringFormat(messageContent.message, _.map(checkRestrictPartPermissionPackaginOnBOM, 'PIDCode').join(','));
        const messageContentFillDetail = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.FILL_DETAIL_FOR_KIT_ALLOCATION);
        getAuthenticationOfApprovalPart(stringFormat('{0} {1}', messageContent.message, messageContentFillDetail.message));
      } else {
        vm.checkAllocationUnit(isExit);
      }
    };

    vm.checkAllocationUnit = (isExit) => {
      if ((vm.lineDetail && vm.lineDetail.numOfPosition !== 0) && (!_.some(vm.stockList, (data) => !data.noOfPosition || data.noOfPosition === 0))) {
        if (parseFloat(vm.sumOfAllocationPins) > parseFloat(vm.lineDetail.shortagePerBuild)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CONFIRMATION_FOR_STOCK_ALLOCATION);
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.checkUserAthenticationPermisionValidation(isExit);
            }
          }, () => { }).catch((error) => BaseService.getErrorLog(error));
        } else {
          vm.checkUserAthenticationPermisionValidation(isExit);
        }
      } else if (parseFloat(vm.sumOfAllocationUnit) > parseFloat(vm.lineDetail.shortagePerBuild)) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CONFIRMATION_FOR_STOCK_ALLOCATION);
        const obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.checkUserAthenticationPermisionValidation(isExit);
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.checkUserAthenticationPermisionValidation(isExit);
      }
    };

    vm.checkUserAthenticationPermisionValidation = (isExit) => {
      let notRohsMismatch = false;
      let notBuyAndStockTypeMismatch = false;

      if (!rohsStatusDetail) {
        const umidData = [];
        const pidData = [];
        const mismatchData = {};
        _.each(vm.stockList, (data) => {
          if (data.isSelect && data.UMIDRohsStatusID && data.rohsID !== data.UMIDRohsStatusID) {
            data.isRohsMismatch = true;
            umidData.push(data.uid);
            pidData.push(data.PIDCode);
          }
        });
        if (umidData && umidData.length > 0) {
          mismatchData.umidData = umidData.join(', ').toString();
          mismatchData.PIDCode = pidData.join(', ').toString();
          return getRoHsStatusMismatchApproval(mismatchData, isExit);
        } else {
          notRohsMismatch = true;
        }
      } else {
        notRohsMismatch = true;
      }

      if (!buyAndStockMismatchDetail) {
        const umidData = [];
        const pidData = [];
        const mismatchData = {};
        _.each(vm.stockList, (data) => {
          if (data.isSelect && vm.stockType === 'IS' && !data.isPurchase) {
            umidData.push(data.uid);
            pidData.push(data.PIDCode);
          } else if (data.isSelect && vm.stockType === 'CS' && data.isPurchase) {
            umidData.push(data.uid);
            pidData.push(data.PIDCode);
          }
        });
        if (umidData && umidData.length > 0) {
          mismatchData.umidData = umidData.join(', ').toString();
          mismatchData.PIDCode = pidData.join(', ').toString();
          return getApprovalForBuyAndStockMismatch(mismatchData, isExit);
        } else {
          notBuyAndStockTypeMismatch = true;
        }
      } else {
        notBuyAndStockTypeMismatch = true;
      }

      if (notRohsMismatch && notBuyAndStockTypeMismatch) {
        vm.saveKitAllocate(isExit);
      }
    };

    vm.saveKitAllocate = (isExit) => {
      const stockAllocateList = _.map(_.filter(vm.stockList, {
        isSelect: true
      }), (data) => ({
        refSalesOrderDetID: vm.salesOrderDetail.SalesOrderDetailId,
        assyID: vm.assemblyDetail.partId,
        uid: data.uid,
        refBOMLineID: vm.lineDetail.refRfqLineitem,
        status: CORE.KitAllocationType.Allocated,
        refUIDId: data.id,
        partId: data.refcompid,
        allocatedQty: multipleUnitValue(data.pkgQty, data.allocationUnits) / convertNumberWithDecimalPlace(data.convertedUnit, _unitFilterDecimal),
        allocatedUnit: data.allocationUnits,
        allocatedUOM: vm.lineDetail.uomID,
        umidUnits: data.convertedUnit,
        kitAllocationId: data.kitAllocationId ? data.kitAllocationId : 0,
        restrictPackagingUseWithpermission: data.restrictPackagingUseWithpermission,
        restrictUSEwithpermission: data.restrictUSEwithpermission,
        restrictUseInBOMWithPermission: data.restrictUseInBOMWithPermission,
        restrictUseInBOMExcludingAliasWithPermission: data.restrictUseInBOMExcludingAliasWithPermission,
        PIDCode: data.PIDCode,
        roHSApprovalReason: data.isRohsMismatch && rohsStatusDetail && rohsStatusDetail.reason ? rohsStatusDetail.reason : '',
        allocationRemark: buyAndStockMismatchDetail && buyAndStockMismatchDetail.reason ? buyAndStockMismatchDetail.reason : ''
      }));

      if (objApproval) {
        _.map(stockAllocateList, (data) => {
          if (data.restrictPackagingUseWithpermission) {
            data.restricType = vm.CORE.RestrictWithPermissionLabel.RestrictPackagingUSEWithPermission;
          } else if (data.restrictUSEwithpermission) {
            data.restricType = vm.CORE.RestrictWithPermissionLabel.RestrictUSEWithPermission;
          } else if (data.restrictUseInBOMWithPermission) {
            data.restricType = vm.CORE.RestrictWithPermissionLabel.RestrictUSEInBOMWithPermission;
          } else if (data.restrictUseInBOMExcludingAliasWithPermission) {
            data.restricType = vm.CORE.RestrictWithPermissionLabel.RestrictUseInBOMExcludingAliasWithPermission;
          }

          if (data.restricType) {
            data.transactionType = stringFormat(CORE.MESSAGE_CONSTANT.GENERIC_AUTHENTICATION_REASON.PERMISSION_WITH_PACKAGING_ALIAS, data.PIDCode, data.restricType, objApproval.approveFromPage, objApproval.username);
            data.refTableName = objApproval.refTableName;
            data.approveFromPage = objApproval.approveFromPage;
            data.approvedBy = objApproval.approvedBy;
            data.approvalReason = objApproval.approvalReason;
            data.confirmationType = CORE.Generic_Confirmation_Type.PERMISSION_WITH_PACKAGING_ALIAS;
          }
        });
      }

      const stockAllocation = {
        jsonStockAllocateList: JSON.stringify(stockAllocateList),
        refSalesOrderDetID: vm.salesOrderDetail.SalesOrderDetailId,
        assyID: vm.salesOrderDetail.partId,
        subAssyID: vm.salesOrderDetail.SubAssyId,
        partIds: _.map(stockAllocateList, 'partId').join(','),
        umIds: _.map(stockAllocateList, 'refUIDId').join(','),
        checkForSameUmid: vm.checkForSameUmid,
        uomID: vm.lineDetail.uomID,
        unitFilterDecimal: _unitFilterDecimal
      };

      vm.cgBusyLoading = KitAllocationFactory.saveStockAllocateList().query({
        stockObj: stockAllocation
      }).$promise.then((res) => {
        if (res && res.data) {
          rohsStatusDetail = null;
          buyAndStockMismatchDetail = null;
          if (res.data.IsSuccess) {
            objApproval = null;
            vm.pagingInfo.lineId = vm.lineDetail ? vm.lineDetail.lineID : 0;
            if (isExit) {
              // Allocate & Exit
              $mdDialog.cancel(vm.pagingInfo);
            } else {
              // Allocate
              vm.isAllSelect = false;
              vm.formKitAllocate.$setUntouched();
              vm.formKitAllocate.$setPristine();
              BaseService.currentPagePopupForm = [];
              getAllLineData(null, true);
            }
          } else {
            vm.cgBusyLoading = false;
            if (res.data.ErrorCode === vm.ErrorCode.SOME_UMID_ALLOCATED || res.data.ErrorCode === vm.ErrorCode.RESERVED_RESTRICTED_UMID || res.data.ErrorCode === vm.ErrorCode.FULLY_KIT_RETUNRED || res.data.ErrorCode === vm.ErrorCode.PO_HALT_ERROR || res.data.ErrorCode === vm.ErrorCode.KIT_ALLOCATION_HALT_ERROR || res.data.ErrorCode === vm.ErrorCode.MOUNTING_TYPE_MISMATCHED || res.data.ErrorCode === vm.ErrorCode.FUNCTIONAL_TYPE_MISMATCHED) {
              let messageContent;
              if (res.data.ErrorCode === vm.ErrorCode.SOME_UMID_ALLOCATED) {
                messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SOME_UMID_ALLOCATED);
              } else if (res.data.ErrorCode === vm.ErrorCode.RESERVED_RESTRICTED_UMID) {
                messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RESERVED_RESTRICTED_UMID);
              } else if (res.data.ErrorCode === vm.ErrorCode.FULLY_KIT_RETUNRED) {
                messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.FULLY_KIT_RETUNRED_NOT_ALLOW_ALLOCATION);
                messageContent.message = stringFormat(messageContent.message, 'allocate any UMID(s)');
              } else if (res.data.ErrorCode === vm.ErrorCode.MOUNTING_TYPE_MISMATCHED || res.data.ErrorCode === vm.ErrorCode.FUNCTIONAL_TYPE_MISMATCHED) {
                const Label = (res.data.ErrorCode === vm.ErrorCode.MOUNTING_TYPE_MISMATCHED) ? 'Mounting Type' : 'Functional Type';
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.MISMATCH_DATA_KITALLOCATION);
                messageContent.message = stringFormat(messageContent.message, Label, vm.lineDetail && vm.lineDetail.lineID ? vm.lineDetail.lineID : null);
              } else if (res.data.ErrorCode === vm.ErrorCode.PO_HALT_ERROR || res.data.ErrorCode === vm.ErrorCode.KIT_ALLOCATION_HALT_ERROR) {
                messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.KIT_ALLOCATION_PO_HALT_ERROR);
                const label = stringFormat('{0}:{1}', (vm.ErrorCode.PO_HALT_ERROR ? vm.haltResumePopUp.POHaltLabel : vm.haltResumePopUp.KitAllocationHaltLabel), res.data.Reason);
                messageContent.message = stringFormat(messageContent.message, label, res.data.TransName, res.data.StartDate);
              }
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              return DialogFactory.messageAlertDialog(model).then((yes) => {
                if (yes) {
                  vm.isAllSelect = false;
                  getStockAllocateList();
                }
              }, () => {
              }).catch((error) => BaseService.getErrorLog(error));
            } else if (res.data.ErrorCode === vm.ErrorCode.SAME_UMID_ALLOCATED) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SAME_UMID_ALLOCATED);
              messageContent.message = stringFormat(messageContent.message, res.data.UMIDString);
              const obj = {
                messageContent: messageContent,
                btnText: CORE.MESSAGE_CONSTANT.BUTTON_CONFIRM_TEXT,
                canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
              };
              return DialogFactory.messageConfirmDialog(obj).then((yes) => {
                if (yes) {
                  vm.checkForSameUmid = false;
                  vm.saveKitAllocate(isExit);
                }
              }, () => {
              }).catch((error) => BaseService.getErrorLog(error));
            } else {
              objApproval = null;
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.STOCK_NOT_ALLOCATED);
              messageContent.message = stringFormat(messageContent.message, res.data.UMIDString, res.data.TransName);
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              return DialogFactory.messageAlertDialog(model).then((yes) => {
                if (yes) {
                  vm.isAllSelect = false;
                  getStockAllocateList();
                }
              }, () => {
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.getFooterAllocationTotal = (item) => {
      let arrayOfSum = [];
      let arrayOfPinSum = [];
      let arrayOfScapPinSum = [];
      if (vm.rowField === 'AllocatedStock') {
        arrayOfSum = _.map(vm.stockList, (data) => {
          if (data.convertedUnit) {
            return data.convertedUnit;
          }
          else {
            return 0;
          }
        });
      }
      else if (vm.rowField === 'AvailableStock') {
        if (item) {
          if (item.isSelect) {
            if (!item.allocationUnits || (item.allocationUnits > (CalcSumofArrayElement([item.convertedUnit, (item.allocatedUnit * -1)], _unitFilterDecimal)))) {
              item.inValidAllocationUnit = true;
              vm.inValidAllocationUnit = true;
            }
            else {
              if (item.uomClassID === vm.MEASUREMENT_TYPES_COUNT.ID && (item.allocationUnits % 1 !== 0)) {
                item.inValidAllocationUnit = true;
                vm.inValidAllocationUnit = true;
              } else {
                item.inValidAllocationUnit = false;
                vm.inValidAllocationUnit = false;
              }
            }
            item.remaingUnit = item.FreeToShare - (item.allocationUnits || 0);
            if (vm.lineDetail.connecterTypeID === vm.CORE.ConnectorType.HEADERBREAKAWAY.ID) {
              const modOfPin = (item.noOfPosition || 0) % (vm.lineDetail.numOfPosition || 0);
              const calculatedPin = CalcSumofArrayElement([item.noOfPosition, (modOfPin * -1)], _amountFilterDecimal);
              item.allocationPins = multipleUnitValue(item.allocationUnits, calculatedPin);
              item.scrapPins = multipleUnitValue(item.allocationUnits, modOfPin);
            }
          }
          else {
            item.inValidAllocationUnit = false;
            vm.inValidAllocationUnit = false;
          }
        }

        arrayOfSum = _.map(vm.stockList, (data) => {
          if (data.allocationUnits && data.isSelect) {
            return data.allocationUnits;
          }
          else {
            return 0;
          }
        });
        arrayOfPinSum = _.map(vm.stockList, (data) => {
          if (data.allocationPins && data.isSelect) {
            return data.allocationPins;
          }
          else {
            return 0;
          }
        });
        arrayOfScapPinSum = _.map(vm.stockList, (data) => {
          if (data.scrapPins && data.isSelect) {
            return data.scrapPins;
          }
          else {
            return 0;
          }
        });
      }
      else if (vm.rowField === 'ConsumedStock') {
        arrayOfSum = _.map(vm.stockList, (data) => {
          if (data.convertedUnit) {
            return data.convertedUnit;
          }
          else {
            return 0;
          }
        });
      }

      vm.sumOfAllocationUnit = CalcSumofArrayElement(arrayOfSum, _unitFilterDecimal);
      vm.sumOfAllocationPins = CalcSumofArrayElement(arrayOfPinSum, 0);
      vm.sumOfScapPins = CalcSumofArrayElement(arrayOfScapPinSum, 0);

      if (vm.lineDetail.connecterTypeID === vm.CORE.ConnectorType.HEADERBREAKAWAY.ID) {
        vm.allocatingStock = convertNumberWithDecimalPlace(vm.sumOfAllocationPins, _unitFilterDecimal);
        vm.consumedStock = angular.copy(vm.headerDetail.consumePin) || 0;
        vm.totalAllocatedStock = CalcSumofArrayElement([(vm.consumedStock || 0), (vm.headerDetail.allocatedPins || 0)], _unitFilterDecimal);
        vm.remainingAllocation = ((vm.headerDetail.requirePinsBuild || 0) - (vm.totalAllocatedStock + vm.allocatingStock)) > 0 ? ((vm.headerDetail.requirePinsBuild || 0) - (vm.totalAllocatedStock + vm.allocatingStock)) : 0;
      } else {
        vm.allocatingStock = convertNumberWithDecimalPlace(vm.sumOfAllocationUnit, _unitFilterDecimal);
        vm.consumedStock = angular.copy(vm.headerDetail.consumeUnits) || 0;
        vm.totalAllocatedStock = CalcSumofArrayElement([(vm.consumedStock || 0), (vm.headerDetail.allocatedUnit || 0)], _unitFilterDecimal);
        vm.remainingAllocation = ((vm.headerDetail.requiredQtyBuild || 0) - (vm.totalAllocatedStock + vm.allocatingStock)) > 0 ? ((vm.headerDetail.requiredQtyBuild || 0) - (vm.totalAllocatedStock + vm.allocatingStock)) : 0;
      }
    };

    vm.getFooterAllocatedUnitTotal = () => {
      let arrayOfSum = [];
      let arrayOfSumOfQty = [];
      let arrayOfSumOfPins = [];
      let arrayOfSumOfScrapedPins = [];

      if (vm.rowField === 'AvailableStock') {
        arrayOfSumOfQty = _.map(vm.stockList, (data) => {
          if (data.allocatedQty) {
            return data.allocatedQty;
          } else {
            return 0;
          }
        });
        arrayOfSum = _.map(vm.stockList, (data) => {
          if (data.allocatedUnit) {
            return data.allocatedUnit;
          } else {
            return 0;
          }
        });
        arrayOfSumOfPins = _.map(vm.stockList, (data) => {
          if (data.allocatedPins) {
            return data.allocatedPins;
          } else {
            return 0;
          }
        });
      }
      else if (vm.rowField === 'AllocatedStock') {
        arrayOfSumOfQty = _.map(vm.stockList, (data) => {
          if (data.allocatedQty) {
            return data.allocatedQty;
          } else {
            return 0;
          }
        });
        arrayOfSum = _.map(vm.stockList, (data) => {
          if (data.allocatedUnit) {
            return data.allocatedUnit;
          } else {
            return 0;
          }
        });
        arrayOfSumOfPins = _.map(vm.stockList, (data) => {
          if (data.allocatedPins) {
            return data.allocatedPins;
          } else {
            return 0;
          }
        });
      }
      else if (vm.rowField === 'ConsumedStock') {
        arrayOfSumOfQty = _.map(vm.stockList, (data) => {
          if (data.consumeQty) {
            return data.consumeQty;
          } else {
            return 0;
          }
        });
        arrayOfSum = _.map(vm.stockList, (data) => {
          if (data.consumeUnit) {
            return data.consumeUnit;
          } else {
            return 0;
          }
        });
        arrayOfSumOfPins = _.map(vm.stockList, (data) => {
          if (data.consumePins) {
            return data.consumePins;
          } else {
            return 0;
          }
        });
      }

      arrayOfSumOfScrapedPins = _.map(vm.stockList, (data) => {
        if (data.scrapedPins) {
          return data.scrapedPins;
        } else {
          return 0;
        }
      });

      vm.sumOfAllocatedQty = CalcSumofArrayElement(arrayOfSumOfQty, 0);
      vm.sumOfAllocatedUnit = CalcSumofArrayElement(arrayOfSum, _unitFilterDecimal);
      vm.sumOfPins = CalcSumofArrayElement(arrayOfSumOfPins, 0);
      vm.sumOfScrapedPins = CalcSumofArrayElement(arrayOfSumOfScrapedPins, 0);
      vm.shortagePerBuild = 0;

      if (vm.lineDetail.connecterTypeID === vm.CORE.ConnectorType.HEADERBREAKAWAY.ID) {
        vm.allocatingStock = angular.copy(vm.headerDetail.allocatedPins);
        vm.consumedStock = angular.copy(vm.headerDetail.consumePin) || 0;
        vm.totalAllocatedStock = CalcSumofArrayElement([(vm.consumedStock || 0), (vm.headerDetail.allocatedPins || 0)], _unitFilterDecimal);
        vm.remainingAllocation = ((vm.headerDetail.requirePinsBuild || 0) - (vm.totalAllocatedStock + vm.allocatingStock)) > 0 ? ((vm.headerDetail.requirePinsBuild || 0) - (vm.totalAllocatedStock + vm.allocatingStock)) : 0;
      } else {
        vm.allocatingStock = angular.copy(vm.headerDetail.allocatedUnit);
        vm.consumedStock = angular.copy(vm.headerDetail.consumeUnits) || 0;
        vm.totalAllocatedStock = CalcSumofArrayElement([(vm.consumedStock || 0), (vm.headerDetail.allocatedUnit || 0)], _unitFilterDecimal);
        vm.remainingAllocation = ((vm.headerDetail.requiredQtyBuild || 0) - (vm.totalAllocatedStock + vm.allocatingStock)) > 0 ? ((vm.headerDetail.requiredQtyBuild || 0) - (vm.totalAllocatedStock + vm.allocatingStock)) : 0;
      }
    };

    vm.getFooterFreeUnitsTotal = () => {
      const sum = _.map(vm.stockList, (data) => {
        if (data.FreeToShare) {
          return data.FreeToShare;
        } else if (data.pendingUMIDUnits) {
          return data.pendingUMIDUnits;
        } else {
          return 0;
        }
      });
      vm.sumOfFreeUnit = CalcSumofArrayElement(sum, _unitFilterDecimal);
    };

    vm.getFooterPendingUMIDTotal = () => {
      const sum = _.map(vm.stockList, (data) => {
        if (data.pendingUMIDQty) {
          return data.pendingUMIDQty;
        } else {
          return 0;
        }
      });
      vm.sumOfPendingUMIDQty = CalcSumofArrayElement(sum, 0);
    };

    vm.allocatedKit = (rowData) => {
      const data = rowData;
      data.refUMIDId = data.id;
      DialogFactory.dialogService(
        TRANSACTION.ALLOCATED_KIT_CONTROLLER,
        TRANSACTION.ALLOCATED_KIT_VIEW,
        event,
        data).then(() => { }, (data) => {
          if (data) {
            vm.refreshStockGrid();
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    // get selected line get datails
    const getKitallocationLineDetails = (isFromAllocate) => {
      vm.cgBusyLoading = KitAllocationFactory.getKitallocationLineDetails().query({
        refSalesOrderDetID: vm.salesOrderDetail.SalesOrderDetailId,
        assyId: vm.assemblyDetail && vm.assemblyDetail.partId ? vm.assemblyDetail.partId : 0,
        kitAllocationLineItemId: vm.lineDetail.id,
        isConsolidatedTab: vm.isConsolidatedTab
      }).$promise.then((response) => {
        if (response.data && response.data.KitAllocationLineDetail && response.data.KitAllocationLineDetail.length > 0) {
          vm.headerDetail = response.data.KitAllocationLineDetail[0];
          if (isFromAllocate) {
            data.updateLineDetail(vm.headerDetail);
          }
          setHeaderData();
          setInitalData();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const setInitalData = () => {
      vm.isAllSelect = false;
      vm.anyItemSelect = false;
      vm.inValidAllocationUnit = false;
      vm.isPOHalt = false;
      vm.isKAHalt = false;
      vm.checkForSameUmid = true;

      vm.pagingInfo = {
        Page: 0,
        pageSize: CORE.UIGrid.ItemsPerPage(),
        SortColumns: [
          ['lineID', 'ASC']
        ],
        SearchColumns: []
      };
      vm.clickButton = false;
      vm.query = {
        order: ''
      };
      vm.bomUOMCleanMesaage = null;

      vm.isMountingTypeMismatch = false;
      vm.mountingTypeMismatchMesaage = null;

      vm.isFunctionalTypeMismatch = false;
      vm.functionalTypeMismatchMesaage = null;

      const stockPromise = [getStockAllocateList(), vm.getHoldResumeStatus({ salesOrderDetailId: vm.salesOrderDetail.SalesOrderDetailId })];

      $q.all(stockPromise).then(() => {
        $timeout(() => {
          const stockHeaderHeight = $('#stockHeader').height();
          const tableBodyHeight = 595 - (stockHeaderHeight || 0);
          const tbodyElement = document.querySelector('.cm-table-available .cm-scroll-table tbody');
          if (tbodyElement) {
            tbodyElement.setAttribute('style', `max-height: ${tableBodyHeight}px !important;`);
          }
        }, _configPageTitleTimeout);
      }).catch((error) => BaseService.getErrorLog(error));
    };
    getKitallocationLineDetails();

    // bind header data on Next/Previous and Allocation
    const setHeaderData = () => {
      if (vm.headerDetail) {
        vm.headerdata = [{
          label: 'Line#',
          value: vm.headerDetail.lineID,
          displayOrder: 1
        },
        {
          label: 'UOM',
          value: vm.headerDetail.unitName,
          displayOrder: 2
        },
        {
          label: 'Required Units',
          value: vm.headerDetail.requiredQtyBuild ? vm.headerDetail.requiredQtyBuild : 0,
          displayOrder: 3
        },
        {
          label: 'Required Pins',
          value: vm.headerDetail.requirePinsBuild ? $filter('numberWithoutDecimal')(vm.headerDetail.requirePinsBuild) : 0,
          displayOrder: 4
        },
        {
          label: 'Allocated Qty/Count',
          value: vm.headerDetail.allocatedQty ? vm.headerDetail.allocatedQty : 0,
          displayOrder: 5
        },
        {
          label: 'Allocated Units',
          value: vm.headerDetail.allocatedUnit ? vm.headerDetail.allocatedUnit : 0,
          displayOrder: 6
        },
        {
          label: 'Allocated Pins',
          value: vm.headerDetail.allocatedPins ? vm.headerDetail.allocatedPins : 0,
          displayOrder: 7
        },
        {
          label: vm.CORE.LabelConstant.Customer.Customer,
          value: vm.headerDetail.companyName,
          displayOrder: 8,
          labelLinkFn: vm.goToCustomerList,
          valueLinkFn: vm.goToCustomer,
          valueLinkFnParams: { id: vm.salesOrderDetail.customerID }
        },
        {
          label: vm.CORE.LabelConstant.Assembly.PIDCode,
          value: vm.headerDetail.PIDCode,
          displayOrder: 9,
          labelLinkFn: vm.goToAssemblyList,
          valueLinkFn: vm.goToAssemblyDetails,
          valueLinkFnParams: { id: vm.headerDetail.partID },
          isCopy: true,
          isCopyAheadLabel: false,
          isAssy: true,
          imgParms: {
            imgPath: vm.headerDetail.rohsIcon !== null ? stringFormat(CORE.RoHSImageFormat, CORE.WEB_URL, USER.ROHS_BASE_PATH, vm.headerDetail.rohsIcon) : null,
            imgDetail: vm.headerDetail.rohsName
          }
        },
        {
          label: vm.LabelConstant.KitAllocation.ShortagePerBuildUnits,
          value: vm.headerDetail.shortagePerBuildQty ? $filter('numberWithoutDecimal')(vm.headerDetail.shortagePerBuildQty) : 0,
          displayOrder: 7
        },
        {
          label: vm.LabelConstant.KitAllocation.ShortagePerBuildPins,
          value: vm.headerDetail.shortagePerQtyBuildPins ? $filter('numberWithoutDecimal')(vm.headerDetail.shortagePerQtyBuildPins) : 0,
          displayOrder: 7
        }];
      }
    };

    vm.cancel = () => {
      const isdirty = vm.formKitAllocate.$dirty;
      if (isdirty) {
        const data = {
          form: vm.formKitAllocate
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        // Pass the selected line data for fetching upadated record
        vm.pagingInfo.lineId = vm.lineDetail ? vm.lineDetail.lineID : 0;
        $mdDialog.cancel(vm.pagingInfo);
      }
    };

    vm.showKitAllocationLight = () => {
      const alertModel = {
        title: CORE.MESSAGE_CONSTANT.ALERT_HEADER,
        textContent: 'Comming Soon',
        multiple: true
      };
      DialogFactory.alertDialog(alertModel);
    };

    vm.transferMaterial = (item) => {
      openTransferMaterialPopup({
        uid: item.uid,
        updateStock: false
      });
    };

    vm.manualTransferMaterial = () => {
      openTransferMaterialPopup({
        updateStock: false
      });
    };

    vm.returnUMID = (item) => {
      openTransferMaterialPopup({
        uid: item.uid,
        updateStock: true
      });
    };

    function openTransferMaterialPopup(data) {
      data.transactionID = vm.transactionID;
      DialogFactory.dialogService(
        TRANSACTION.UID_TRANSFER_CONTROLLER,
        TRANSACTION.UID_TRANSFER_VIEW,
        event,
        data).then(() => {
          getStockAllocateList();
        }, () => {
          getStockAllocateList();
        }, (err) => BaseService.getErrorLog(err));
    }

    vm.deallocateFromKit = (item) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CONFIRMATION_DEALLOCATE_MULTIPLE_UMID);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_CONFIRM_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          let kitAllocationIds = [];
          let umidIds = [];

          if (item) {
            kitAllocationIds.push(item.kitAllocationId);
            umidIds.push(item.id);
          } else {
            kitAllocationIds = _.map(_.filter(vm.stockList, (data) => data.isSelect), 'kitAllocationId');
            umidIds = _.map(_.filter(vm.stockList, (data) => data.isSelect), 'id');
          }
          const objData = {
            id: kitAllocationIds,
            umidID: umidIds,
            fromScreen: TRANSACTION.STOCK_ALLOCATION_POPUP.AllocatedUnit
          };
          vm.cgBusyLoading = KitAllocationFactory.deallocateUMIDFromKit().query(objData).$promise.then((response) => {
            if (response.data) {
              vm.isAllSelect = false;
              _.map(vm.stockList, (item) => {
                item.isSelect = false;
              });
              getKitallocationLineDetails();
              vm.formKitAllocate.$setUntouched();
              vm.formKitAllocate.$setPristine();
              BaseService.currentPagePopupForm = [];
            }
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }, () => {
        vm.isAllSelect = false;
        _.map(vm.stockList, (item) => {
          item.isSelect = false;
        });
        vm.anyItemSelect = false;
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.goToUMIDManagement = (item) => BaseService.goToUMIDDetail(item.id);

    // Go to UMID Management screen
    vm.redirectOnUMIDManagement = (row) => {
      if (row) {
        removeLocalStorageValue('FromBinForUMID');
        const objBin = {
          id: row.fromBin,
          Name: row.fromBinName,
          WarehouseID: row.fromWarehouse,
          WarehouseName: row.fromWarehouseName,
          parentWHID: row.fromDepartment,
          parentWHName: row.fromDepartmentName
        };
        setLocalStorageValue('PendingUMIDMFRPN', {
          mfrpn: row.mfgPN,
          FromBinForUMID: objBin
        });
      }
      BaseService.goToUMIDDetail();
    };

    const getRoHsStatusMismatchApproval = (mismatchData, isExit) => {
      const Obj = {
        PIDCode: mismatchData.PIDCode,
        UMID: mismatchData.umidData,
        isUMID: false
      };
      DialogFactory.dialogService(
        CORE.ROHS_STATUS_MISMATCH_CONFIRMATION_CONTROLLER,
        CORE.ROHS_STATUS_MISMATCH_CONFIRMATION_VIEW,
        null,
        Obj).then(() => { }, (data) => {
          if (data) {
            rohsStatusDetail = data;
            vm.checkUserAthenticationPermisionValidation(isExit);
          } else {
            rohsStatusDetail = null;
          }
        }, (error) => BaseService.getErrorLog(error));
    };

    const getApprovalForBuyAndStockMismatch = (mismatchData, isExit) => {
      const Obj = {
        popUpHeaderName: CORE.BuyAndStockTypeMismatchConfirmationPopup.HeaderLabel,
        displayMessage: vm.stockType === 'IS' ? stringFormat(CORE.BuyAndStockTypeMismatchConfirmationPopup.DisplayNoteForInternalStockForKit, mismatchData.PIDCode, mismatchData.umidData) : stringFormat(CORE.BuyAndStockTypeMismatchConfirmationPopup.DisplayNoteForCustomerStockForKit, mismatchData.PIDCode, mismatchData.umidData),
        roleAccess: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS,
        reasonTextBoxLength: 1000,
        CancelButton: CORE.BuyAndStockTypeMismatchConfirmationPopup.CancelButton,
        ConfirmButton: CORE.BuyAndStockTypeMismatchConfirmationPopup.ConfirmButton
      };
      DialogFactory.dialogService(
        CORE.COMMON_USERNAME_PASSWORD_CONFIRMATION_POPUP_CONTROLLER,
        CORE.COMMON_USERNAME_PASSWORD_CONFIRMATION_POPUP_VIEW,
        null,
        Obj).then(() => { }, (data) => {
          if (data) {
            buyAndStockMismatchDetail = data;
            vm.checkUserAthenticationPermisionValidation(isExit);
          } else {
            buyAndStockMismatchDetail = null;
          }
        }, (error) => BaseService.getErrorLog(error));
    };

    const getAuthenticationOfApprovalPart = (informationMsg) => {
      const objPartDetail = {
        AccessRole: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS,
        refTableName: CORE.TABLE_NAME.KIT_ALLOCATION,
        isAllowSaveDirect: false,
        approveFromPage: CORE.PAGENAME_CONSTANT[25].PageName,
        confirmationType: CORE.Generic_Confirmation_Type.PERMISSION_WITH_PACKAGING_ALIAS,
        createdBy: loginUser.userid,
        updatedBy: loginUser.userid,
        informationMsg: informationMsg
      };
      DialogFactory.dialogService(
        CORE.GENERIC_CONFIRMATION_MODAL_CONTROLLER,
        CORE.GENERIC_CONFIRMATION_MODAL_VIEW,
        null,
        objPartDetail).then((data) => {
          if (data) {
            objApproval = data;
            vm.checkAllocationUnit();
          }
        }, () => { }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.restrictUMID = (row) => {
      const obj = {
        id: row.id,
        isUMIDRestrict: row.isUMIDRestrict
      };
      DialogFactory.dialogService(
        TRANSACTION.RESTRICT_UMID_POPUP_CONTROLLER,
        TRANSACTION.RESTRICT_UMID_POPUP_VIEW,
        event,
        obj).then(() => { }, (restrictUMID) => {
          if (restrictUMID) {
            getStockAllocateList();
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.refreshStockGrid = () => {
      vm.isAllSelect = false;
      vm.anyItemSelect = false;
      getKitallocationLineDetails();
    };

    // Inoauto Search Functionality Start
    // search by umid api call from here on changeof checkbox
    vm.searchbyUMID = (ev) => {
      vm.event = ev;
      const dept = getLocalStorageValue(loginUser.employee.id);
      vm.selectedList = _.filter(vm.stockList, (fltr) => fltr.isSelect);
      if (_.find(vm.selectedList, (selectDept) => selectDept.departmentName !== dept.department.Name) && !vm.isComapnyLevel) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INOAUTO_DEPARTMENT_VALIDATION);
        messageContent.message = stringFormat(messageContent.message, dept.department.Name);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        vm.showStatus = false;
        vm.transactionID = null;
        vm.clickButton = false;
        return;
      } else {
        checkColorAvailibility(vm.isComapnyLevel ? 0 : dept.department.ID);
      }
    };

    // check color availability to prompt in cart
    function checkColorAvailibility(departmentID) {
      ReceivingMaterialFactory.getPromptIndicatorColor().query({
        pcartMfr: CORE.InoautoCart,
        prefDepartmentID: departmentID
      }).$promise.then((res) => {
        if (res && res.data) {
          vm.promptColorDetails = res.data.promptColors[0];
          vm.TimeOut = res.data.defaultTimeout && res.data.defaultTimeout.length > 1 && res.data.defaultTimeout[0].values ? res.data.defaultTimeout[0].values : CORE.CANCEL_REQUSET_TIMEOUT;
          funSearchByUMID(departmentID);
        } else {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PROMPT_ALREADY_USE);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          vm.clickButton = false;
          return DialogFactory.messageAlertDialog(model);
          // color is not available message prompt
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    // umid search
    function funSearchByUMID(departmentID) {
      vm.transactionID = getGUID();
      const objSearchPartUMID = {
        UIDs: _.map(vm.selectedList, 'uid'),
        PromptIndicator: vm.promptColorDetails.ledColorValue,
        ledColorID: vm.promptColorDetails.id,
        Priority: 0,
        TimeOut: vm.TimeOut,
        UserName: loginUser.username,
        InquiryOnly: 0,
        departmentID: departmentID ? departmentID : null,
        TransactionID: vm.transactionID,
        Department: departmentID ? vm.selectedList[0].departmentName : '*',
        ReelBarCode: null
      };
      WarehouseBinFactory.sendRequestToSearchPartByUMID().query(objSearchPartUMID).$promise.then((response) => {
        if (response.status === 'FAILED') {
          vm.showStatus = false;
          vm.transactionID = null;
          vm.clickButton = false;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    function connectSocket() {
      socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.PO_START, vm.getHoldResumeStatus);
      socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.PO_STOP, vm.getHoldResumeStatus);
      socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.KIT_ALLOCATION_START, vm.getHoldResumeStatus);
      socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.KIT_ALLOCATION_STOP, vm.getHoldResumeStatus);
      socketConnectionService.on(CORE.Socket_IO_Events.InoAuto.updateUMIDRequest, updateUMIDRequest);
      socketConnectionService.on(CORE.Socket_IO_Events.InoAuto.updateCancelRequest, updateCancelRequestStatus);
      socketConnectionService.on(CORE.Socket_IO_Events.InoAuto.updateForceDeliverRequest, updateForceDeliverRequest);
    }
    connectSocket();

    socketConnectionService.on('reconnect', () => {
      connectSocket();
    });

    function removeSocketListener() {
      socketConnectionService.removeListener(CORE.Socket_IO_Events.InoAuto.updateUMIDRequest, updateUMIDRequest);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.InoAuto.updateCancelRequest, updateCancelRequestStatus);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.InoAuto.updateForceDeliverRequest, updateForceDeliverRequest);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.PO_START);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.PO_STOP);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.KIT_ALLOCATION_START);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.KIT_ALLOCATION_STOP);
    }

    const getAllLineData = (isPrevious, isFromAllocate) => {
      if (vm.lineDetail) {
        if (isFromAllocate) {
          getKitallocationLineDetails(isFromAllocate);
        } else {
          $q.all([data.getLineDetail(vm.lineDetail, isPrevious)]).then((response) => {
            if (response && response[0]) {
              vm.lineDetail = response[0] || null;
              if (vm.lineDetail) {
                getKitallocationLineDetails();
              }
            }
          });
        }
      }
    };

    // confimartion on Next/Previous dirty state
    vm.confirmationBeforeChangeLineDatil = (isPrevious) => {
      const isdirty = vm.formKitAllocate.$dirty;
      if (isdirty) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
        const model = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        return DialogFactory.messageConfirmDialog(model).then((yes) => {
          if (yes) {
            vm.formKitAllocate.$setUntouched();
            vm.formKitAllocate.$setPristine();
            BaseService.currentPagePopupForm = [];
            getAllLineData(isPrevious);
          }
        }, () => {
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        getAllLineData(isPrevious);
      }
    };

    $scope.$on('$destroy', () => {
      cancelRequest();
      removeUMIDStatus();
      removeSocketListener();
    });
    // on disconnect socket
    socketConnectionService.on('disconnect', () => {
      // Remove socket listeners
      removeSocketListener();
    });

    // umid pick request
    function updateForceDeliverRequest(request) {
      if (request.OriginalTransactionID === vm.transactionID) {
        const objUMID = _.find(vm.stockList, (umid) => umid.uid === request.UID);
        if (objUMID) {
          objUMID.ledColorCssClass = null;
          objUMID.ledColorName = null;
          objUMID.inovexStatus = CORE.InoAuto_Search_Status.InTransit;
          objUMID.isTransit = 'Yes';
        }
      }
    }

    // once umid pick will update umid
    function updateUMIDRequest(response) {
      if (vm.transactionID === response.response.TransactionID && !vm.showStatus) {
        const selectedPkg = response.response.ChosenPackages;
        const notFoundedPkg = response.response.UIDNotFound;
        const notAvailablePkg = response.response.UnavailablePackages;
        // add color for selected pkg Department
        _.each(selectedPkg, (item) => {
          var objUMID = _.find(vm.stockList, (umid) => umid.uid === item.UID);
          if (objUMID) {
            objUMID.ledColorCssClass = vm.promptColorDetails.ledColorCssClass;
            objUMID.ledColorName = vm.promptColorDetails.ledColorName;
          }
        });
        _.map(selectedPkg, funChoosen);
        _.map(notFoundedPkg, funNotFound);
        _.map(notAvailablePkg, funNotAvailable);
        vm.showStatus = true;
        if (selectedPkg.length === 0) {
          let messageContent = null;
          if (notAvailablePkg.length === 0) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INOAUTO_UIDNOTFOUND);
          } else {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INOAUTO_NOTAVAILABLE);
          }
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          return DialogFactory.messageAlertDialog(model, commonCancelFunction);
        }
      }
    }

    // update status chhosen for all choose umid
    function funChoosen(row) {
      var Chosen = _.find(vm.stockList, (Chosen) => Chosen.uid === row.UID);
      if (Chosen) {
        Chosen.inovexStatus = CORE.InoAuto_Search_Status.Chosen;
      }
    }
    // update status NotFound for all umid which are not in inovaxe
    function funNotFound(row) {
      var notFound = _.find(vm.stockList, (notFound) => notFound.uid === row);
      if (notFound) {
        notFound.inovexStatus = CORE.InoAuto_Search_Status.NotFound;
      }
    }
    // update status NotAvailable for all umid which are already in use
    function funNotAvailable(row) {
      var notAvailable = _.find(vm.stockList, (notAvailable) => notAvailable.uid === row.UID);
      if (notAvailable) {
        notAvailable.inovexStatus = CORE.InoAuto_Search_Status.NotAvailable;
      }
    }
    // cancel request for search part
    function cancelRequest(isManualCancel) {
      if (vm.transactionID) {
        const objTrans = {
          TransactionID: vm.transactionID,
          ReasonCode: CORE.InoAuto_Error_ReasonCode.CancelTask.Code,
          ReasonMessage: CORE.InoAuto_Error_ReasonCode.CancelTask.Message
        };
        if (isManualCancel) {
          objTrans.isManualCancel = true;
        }
        WarehouseBinFactory.sendRequestToCancelCartRequest().query(objTrans).$promise.then(() => {
          if (isManualCancel) {
            commonCancelFunction();
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        commonCancelFunction();
      }
    }
    // cancel Request for search by umid
    vm.cancelSearch = () => {
      cancelRequest();
    };
    // received details for cancel request
    function updateCancelRequestStatus(req) {
      if (req.transactionID === vm.transactionID && !vm.open) {
        cancelRequestAlert(req);
      }
    }
    // cancel request
    function cancelRequestAlert(req) {
      commonCancelFunction();
      vm.open = true;
      let messageContent = null;
      if (req.code === CORE.INO_AUTO_RESPONSE.SUCCESS) {
        NotificationFactory.success(req.message);
        callbackCancel();
        return;
      } else if (req.code === CORE.INO_AUTO_RESPONSE.CANCEL) {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SEARCH_CANCEL_MANUALLY);
      } else {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SEARCH_CANCEL_TIMEOUT);
      }
      const model = {
        messageContent: messageContent,
        multiple: true
      };
      return DialogFactory.messageAlertDialog(model, callbackCancel);
    }
    // common function to clear
    function commonCancelFunction() {
      _.map(vm.stockList, funUMIDList);
      vm.showStatus = false;
      vm.transactionID = null;
      vm.clickButton = false;
    }

    function callbackCancel() {
      vm.open = false;
    }
    // remove assign color from umid list
    function funUMIDList(row) {
      row.inovexStatus = null;
      row.ledColorCssClass = null;
      row.ledColorName = null;
    }

    // update umid record
    const removeUMIDStatus = $rootScope.$on(PRICING.EventName.RemoveUMIDFrmList, (name, data) => {
      const umidStatus = _.find(vm.stockList, (item) => item.uid === data.UID);
      if (umidStatus) {
        umidStatus.binName = data.tolocation;
        umidStatus.warehouseName = data.towarehouse;
        umidStatus.departmentName = data.toparentWarehouse;
        funUMIDList(umidStatus);
      }
    });

    // Proceed for show light if click on Light icon from action column
    vm.showLightForUMID = (row, ev) => {
      if (!vm.clickButton) {
        row.isSelect = true;
        $timeout(() => {
          // If flag is true than can not click on light icon
          vm.clickButton = true;
          vm.changeEvent(true, ev);
        });
      }
    };

    // Inoauto Search Functionality End
    vm.changeEvent = (button, ev) => {
      const notInSmartCartUMIDList = _.filter(vm.stockList, (data) => data.warehouseType !== vm.warehouseType.SmartCart.key && data.isSelect);
      if (notInSmartCartUMIDList.length > 0) {
        const umidString = _.map(notInSmartCartUMIDList, 'uid').join(', ');
        vm.clickButton = false;
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.UMID_NOT_IN_SMART_CART_FOR_SHOW_LIGHT);
        messageContent.message = stringFormat(messageContent.message, umidString);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(model);
        return;
      } else {
        if (button) {
          vm.searchbyUMID(ev);
        } else {
          vm.cancelSearch(ev);
        }
      }
    };

    // check parts are selected or not and if selected than its smart cart or not
    vm.checkPartForSearch = () => {
      var iswh = _.find(vm.stockList, (wh) => wh.isSelect === true);
      if (iswh) {
        return false;
      } else {
        return true;
      }
    };

    // Set as current form when page loaded
    angular.element(() => {
      BaseService.currentPagePopupForm = [vm.formKitAllocate];
    });
  }
})();
