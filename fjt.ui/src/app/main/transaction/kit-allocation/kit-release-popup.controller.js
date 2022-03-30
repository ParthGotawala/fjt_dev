(function () {
  'use strict';

  angular
    .module('app.transaction.kitAllocation')
    .controller('KitReleasePopUpController', KitReleasePopUpController);

  /** @ngInject */
  function KitReleasePopUpController($scope, $state, $timeout, $q, $mdDialog, $filter, BaseService, DialogFactory, USER, CORE, data, KitAllocationFactory, TRANSACTION, RFQTRANSACTION, socketConnectionService) {
    const vm = this;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.kitDetail = data;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.Kit_Release_Status = TRANSACTION.KIT_RELEASE_STATUS;
    vm.KIT_RETURN_STATUS = TRANSACTION.KIT_RETURN_STATUS;
    vm.LabelConstant = CORE.LabelConstant;
    vm.haltResumePopUp = CORE.HaltResumePopUp;
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.KITRELEASE;
    vm.ErrorCode = TRANSACTION.STOCKALLOCATIONERRORCODE;
    vm.noPlanFound = false;
    vm.isReturnKit = {
      isDisable: false,
      isHidden: false
    };
    vm.isInitiateReturn = {
      isDisable: false,
      isHidden: false
    };
    vm.WOSTATUS = CORE.WOSTATUS;
    vm.currentState = $state.current.name;
    vm.releaseImagePath = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, 'release.png');
    vm.returnKitImagePath = stringFormat(CORE.IMAGE_ICON_PATH, WebsiteBaseUrl, 'return-kit.png');
    vm.KitReleaseDetail = {
      refSalesOrderDetID: vm.kitDetail.salesOrderDetail.SalesOrderDetailId,
      mainAssyID: vm.kitDetail && vm.kitDetail.salesOrderDetail ? vm.kitDetail.salesOrderDetail.partId : null,
      assyID: vm.kitDetail.assyID,
      selectedAssy: null
    };
    vm.isPOHalt = false;
    vm.isKAHalt = false;
    vm.isKRHalt = false;
    vm.kitReleasePlanList = [];
    vm.headerdata = [];
    vm.kitPlanTotal = {
      poQty: 0,
      kitReleaseQty: 0,
      buildFeasibility: 0,
      shortage: 0
    };
    vm.isShowMismatchCountMessage = false;
    vm.releaseKitInformationMessage = TRANSACTION.RELEASE_KIT_INFORMATION_MESSAGE;

    vm.goToSalesOrderList = () => {
      BaseService.goToSalesOrderList();
      return false;
    };

    vm.goToManageSalesOrder = () => {
      BaseService.goToManageSalesOrder(vm.kitDetail.salesOrderDetail.soId);
      return false;
    };

    vm.goToAssyMaster = () => {
      BaseService.goToComponentDetailTab(null, vm.KitReleaseDetail.assyID);
      return false;
    };

    vm.goToAssy = () => {
      BaseService.goToPartList();
      return false;
    };

    vm.updatekitmrpqty = () => {
      if (vm.KitReleaseDetail && (vm.KitReleaseDetail.refSalesOrderDetID && vm.KitReleaseDetail.mainAssyID)) {
        const obj = {
          salesOrderDetail: vm.KitReleaseDetail.refSalesOrderDetID,
          mainAssyId: null,
          subAssyId: vm.KitReleaseDetail.mainAssyID
        };
        DialogFactory.dialogService(
          TRANSACTION.UPDATE_KIT_MRP_QTY_POPUP_CONTROLLER,
          TRANSACTION.UPDATE_KIT_MRP_QTY_POPUP_VIEW,
          null,
          obj).then(() => {
          }, (data) => {
            if (data && (vm.currentState !== TRANSACTION.TRANSACTION_KIT_PREPARATION_STATE && vm.currentState !== TRANSACTION.TRANSACTION_KIT_ALLOCATION_STATE)) {
              $mdDialog.cancel(data);
            }
          }, (err) => BaseService.getErrorLog(err));
      }
    };

    vm.getAllocatedUMIDCount = () => {
      vm.allocatedUMIDCount = 0;
      getAllocatedUMIDCount().then((response) => {
        if (response && response.data) {
          vm.allocatedUMIDCount = response.data.UMIDCount;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    vm.getHoldResumeStatus = (responseData) => {
      if (responseData.salesOrderDetailId === vm.KitReleaseDetail.refSalesOrderDetID) {
        vm.refType = [vm.haltResumePopUp.refTypePO, vm.haltResumePopUp.refTypeKA, vm.haltResumePopUp.refTypeKR];
        vm.cgBusyLoading = KitAllocationFactory.getHoldResumeStatus().query({
          salesOrderDetId: responseData.salesOrderDetailId,
          refType: vm.refType
        }).$promise.then((response) => {
          if (response) {
            vm.poHalt = _.find(response.data, (item) => item.refType === vm.haltResumePopUp.refTypePO);
            vm.kaHalt = _.find(response.data, (item) => item.refType === vm.haltResumePopUp.refTypeKA);
            vm.krHalt = _.find(response.data, (item) => item.refType === vm.haltResumePopUp.refTypeKR);
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
            if (vm.krHalt) {
              vm.isKRHalt = true;
            } else {
              vm.isKRHalt = false;
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    vm.getHoldResumeStatus({ salesOrderDetailId: vm.KitReleaseDetail.refSalesOrderDetID });

    // get total po qty to plan release
    vm.totalPOQty = () => (_.sumBy(vm.kitReleasePlanList, (o) => parseInt(o.poQty ? o.poQty : 0)));

    // get total kit qty to plan release
    vm.totalKitQty = () => (_.sumBy(vm.kitReleasePlanList, (o) => parseInt(o.kitReleaseQty ? o.kitReleaseQty : 0)));

    // get remain po qty to plan release
    vm.getRemainPOQty = () => ((vm.kitDetail.salesOrderDetail.SubPOQty ? vm.kitDetail.salesOrderDetail.SubPOQty : vm.kitDetail.salesOrderDetail.poQty) - (vm.totalPOQty()));

    // get remain kit qty to plan release
    vm.getRemainkitQty = () => ((vm.kitDetail.salesOrderDetail.SubKitQty ? vm.kitDetail.salesOrderDetail.SubKitQty : vm.kitDetail.salesOrderDetail.kitQty) - (vm.totalKitQty()));

    const bindHeaderDetail = () => {
      vm.headerdata = [
        {
          label: vm.LabelConstant.SalesOrder.PO,
          value: vm.kitDetail.salesOrderDetail.poNumber,
          displayOrder: 1,
          labelLinkFn: vm.goToSalesOrderList,
          valueLinkFn: vm.goToManageSalesOrder,
          isCopy: true
        },
        {
          label: vm.LabelConstant.SalesOrder.SO,
          value: vm.kitDetail.salesOrderDetail.soNumber,
          displayOrder: 2,
          labelLinkFn: vm.goToSalesOrderList,
          valueLinkFn: vm.goToManageSalesOrder,
          isCopy: true
        },
        {
          label: vm.LabelConstant.Assembly.PIDCode,
          value: vm.kitDetail.salesOrderDetail.assyPIDCode,
          displayOrder: 3,
          labelLinkFn: vm.goToAssy,
          valueLinkFn: vm.goToAssyMaster,
          isCopy: true,
          isCopyAheadLabel: true,
          isAssy: true,
          imgParms: {
            imgPath: vm.rohsImagePath + vm.kitDetail.salesOrderDetail.rohsIcon,
            imgDetail: vm.kitDetail.salesOrderDetail.rohs
          },
          isCopyAheadOtherThanValue: true,
          copyAheadLabel: vm.LabelConstant.Assembly.MFGPN,
          copyAheadValue: vm.kitDetail.salesOrderDetail.assyName
        },
        {
          label: 'PO Qty',
          value: $filter('numberWithoutDecimal')(vm.kitDetail.salesOrderDetail.poQty),
          displayOrder: 4
        },
        {
          label: 'Kit Qty',
          value: $filter('numberWithoutDecimal')(vm.kitDetail.salesOrderDetail.kitQty),
          displayOrder: 5
        }];

      if (vm.kitDetail.salesOrderDetail.SubPOQty && vm.kitDetail.salesOrderDetail.SubKitQty) {
        vm.headerdata.push({
          label: 'Sub Assy Req Qty for PO ',
          value: $filter('numberWithoutDecimal')(vm.kitDetail.salesOrderDetail.SubPOQty),
          displayOrder: 6
        }, {
          label: 'Sub Assy Kit Qty',
          value: $filter('numberWithoutDecimal')(vm.kitDetail.salesOrderDetail.SubKitQty),
          displayOrder: 7
        }, {
          label: vm.LabelConstant.Assembly.SubPIDCode,
          value: vm.kitDetail.salesOrderDetail.SubAssyPIDCode,
          displayOrder: 4,
          labelLinkFn: vm.goToAssy,
          valueLinkFn: vm.goToAssyMaster,
          isCopy: true,
          isCopyAheadLabel: true,
          isAssy: true,
          imgParms: {
            imgPath: vm.rohsImagePath + vm.kitDetail.salesOrderDetail.SubAssyRohsIcon,
            imgDetail: vm.kitDetail.salesOrderDetail.SubAssyRohs
          },
          isCopyAheadOtherThanValue: true,
          copyAheadLabel: vm.LabelConstant.Assembly.MFGPN,
          copyAheadValue: vm.kitDetail.salesOrderDetail.SubAssy
        });
      }
    };

    vm.getKitReleasePlanDetail = () => {
      vm.noPlanFound = false;
      vm.cgBusyLoading = KitAllocationFactory.getKitReleasePlanDetail().query({ refSalesOrderDetID: vm.KitReleaseDetail.refSalesOrderDetID, assyID: vm.KitReleaseDetail.mainAssyID, subAssyID: (vm.KitReleaseDetail.assyID !== vm.KitReleaseDetail.mainAssyID) ? vm.KitReleaseDetail.assyID : null }).$promise.then((response) => {
        if (response && response.data) {
          vm.kitReleasePlanList = response.data.planDetails || [];
          vm.releasePlan = _.find(vm.kitReleasePlanList, (item) => ((item.kitStatus === vm.Kit_Release_Status.P.value && item.kitReturnStatus === vm.KIT_RETURN_STATUS.NA.value) || (item.kitStatus === vm.Kit_Release_Status.R.value && item.kitReturnStatus === vm.KIT_RETURN_STATUS.RS.value)) && !item.woID);

          _.map(vm.kitReleasePlanList, (data) => {
            data.poDueDate = data.poDueDate ? BaseService.getUIFormatedDate(data.poDueDate, vm.DefaultDateFormat) : null;
            data.kitReleaseDate = data.kitReleaseDate ? BaseService.getUIFormatedDate(data.kitReleaseDate, vm.DefaultDateFormat) : null;
            data.materialDockDate = data.materialDockDate ? BaseService.getUIFormatedDate(data.materialDockDate, vm.DefaultDateFormat) : null;
            data.actualKitReleaseDate = data.actualKitReleaseDate ? BaseService.getUIFormatedDate(data.actualKitReleaseDate, vm.DefaultDateFormat) : null;
            data.kitReturnDate = data.kitReturnDate ? BaseService.getUIFormatedDate(data.kitReturnDate, vm.DefaultDateFormat) : null;
            data.isRelease = vm.releasePlan.id === data.id && data.actualKitReleaseDate === null ? true : false;;
          });

          vm.kitPlanTotal = {
            poQty: _.sumBy(vm.kitReleasePlanList, 'poQty'),
            kitReleaseQty: _.sumBy(vm.kitReleasePlanList, 'kitReleaseQty'),
            buildFeasibility: _.sumBy(vm.kitReleasePlanList, 'buildFeasibility'),
            shortage: _.sumBy(vm.kitReleasePlanList, 'Shortage')
          };

          if (vm.KitReleaseDetail.assyID !== vm.KitReleaseDetail.mainAssyID) {
            vm.kitDetail.salesOrderDetail.SubPOQty = vm.kitPlanTotal.poQty;
            vm.kitDetail.salesOrderDetail.SubKitQty = vm.kitPlanTotal.kitReleaseQty;
            vm.kitDetail.salesOrderDetail.SubAssyPIDCode = vm.KitReleaseDetail.selectedAssy.assyName;
            vm.kitDetail.salesOrderDetail.SubAssy = vm.KitReleaseDetail.selectedAssy.assyMfgPn;
            vm.kitDetail.salesOrderDetail.SubAssyRohsIcon = vm.KitReleaseDetail.selectedAssy.assyRohsIcon;
            vm.kitDetail.salesOrderDetail.SubAssyRohs = vm.KitReleaseDetail.selectedAssy.assyRohsName;
          } else {
            vm.kitDetail.salesOrderDetail.SubPOQty = vm.kitDetail.salesOrderDetail.SubKitQty = vm.kitDetail.salesOrderDetail.SubAssyPIDCode = vm.kitDetail.salesOrderDetail.SubAssy = vm.kitDetail.salesOrderDetail.SubAssyRohsIcon = vm.kitDetail.salesOrderDetail.SubAssyRohs = null;
          }

          const sumOfMismatch = _.sumBy(vm.kitReleasePlanList, (data) => {
            if (data.isRelease) {
              return data.mismatchItem;
            } else {
              return 0;
            }
          });

          if (sumOfMismatch) {
            vm.isShowMismatchCountMessage = true;
          }

          const returnList = _.filter(vm.kitReleasePlanList, (item) => item.kitReturnStatus === vm.KIT_RETURN_STATUS.FR.value);
          const returnWithShortageList = _.filter(vm.kitReleasePlanList, (item) => item.kitReturnStatus === vm.KIT_RETURN_STATUS.RS.value);
          const withoutReleaseList = _.filter(vm.kitReleasePlanList, (data) => data.kitStatus !== vm.Kit_Release_Status.R.value);
          if (withoutReleaseList && withoutReleaseList.length === 0) {
            if (_.some(vm.kitReleasePlanList, { 'kitReturnStatus': vm.KIT_RETURN_STATUS.NR.value })) {
              vm.isInitiateReturn.isHidden = false;
              vm.isInitiateReturn.isDisable = false;
              vm.isReturnKit.isHidden = true;
            }
            if (vm.getRemainkitQty() > 0 || vm.getRemainPOQty() > 0) {
              vm.isInitiateReturn.isHidden = false;
              vm.isInitiateReturn.isDisable = true;
              vm.isReturnKit.isHidden = true;
            }
          }
          if (withoutReleaseList && withoutReleaseList.length > 0) {
            vm.isInitiateReturn.isHidden = false;
            vm.isInitiateReturn.isDisable = true;
            vm.isReturnKit.isHidden = true;
          }
          else {
            vm.isInitiateReturn.isHidden = false;
            vm.isReturnKit.isHidden = true;

            if (returnList && returnList.length === vm.kitReleasePlanList.length) { //In case of kit return is done
              vm.isInitiateReturn.isDisable = true;
              vm.isReturnKit.isHidden = true;
              vm.isInitiateReturn.isHidden = false;
            } else if (returnWithShortageList && returnWithShortageList.length === vm.kitReleasePlanList.length) {
              vm.isInitiateReturn.isDisable = true;
              vm.isReturnKit.isHidden = false;
              vm.isReturnKit.isDisable = false;
              vm.isInitiateReturn.isHidden = true;
            } else {
              const anyReadyToReturn = _.find(vm.kitReleasePlanList, (item) => item.kitReturnStatus === vm.KIT_RETURN_STATUS.RR.value);
              if (anyReadyToReturn) {
                vm.isReturnKit.isDisable = false;
                vm.isReturnKit.isHidden = false;
                vm.isInitiateReturn.isHidden = true;
              }
            }
          }
          if (vm.kitReleasePlanList.length === 0) {
            vm.isReturnKit.isHidden = vm.isInitiateReturn.isHidden = true;
            vm.noPlanFound = true;
          }
          bindHeaderDetail();
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const getAssemblyList = () => KitAllocationFactory.kitAllocationAssyList().query({ id: vm.KitReleaseDetail.refSalesOrderDetID }).$promise.then((response) => {
      vm.assyList = response ? _.filter(_.map(response.data, (item) => {
        if (item && item.kit_allocation_component) {
          const assyDet = Object.assign(angular.copy(item),
            {
              assyID: item.kit_allocation_component.id,
              assyName: item.kit_allocation_component.PIDCode,
              assyMfgPn: item.kit_allocation_component.mfgPN,
              assyRohsName: item.kit_allocation_component.rfq_rohsmst ? item.kit_allocation_component.rfq_rohsmst.name : null,
              assyRohsIcon: item.kit_allocation_component.rfq_rohsmst ? item.kit_allocation_component.rfq_rohsmst.rohsIcon : null
            });
          delete assyDet.kit_allocation_component;
          return assyDet;
        }
      }), (assyDet) => assyDet) : [];
      return vm.assyList;
    }).catch((error) => BaseService.getErrorLog(error));

    const getAutoCompleteData = () => {
      const autocompletePromise = [getAssemblyList()];
      //vm.cgBusyLoading =
      $q.all(autocompletePromise).then(() => {
        initAutoComplete();
      }).catch((error) => BaseService.getErrorLog(error));
    };

    getAutoCompleteData();

    vm.cancel = () => {
      $mdDialog.cancel(true);
    };

    function initAutoComplete() {
      vm.autoCompleteAssembly = {
        columnName: 'assyName',
        keyColumnName: 'assyID',
        keyColumnId: vm.KitReleaseDetail ? vm.KitReleaseDetail.assyID : null,
        inputName: 'assyID',
        placeholderName: CORE.LabelConstant.Assembly.ID,
        isRequired: true,
        isAddnew: false,
        callbackFn: getAssemblyList,
        isDisable: vm.kitDetail.isForViewOnly ? true : (vm.kitDetail.isConsolidated ? false : true),
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.KitReleaseDetail.selectedAssy = item;
            vm.KitReleaseDetail.assyID = item.assyID;
            $timeout(() => {
              vm.getKitReleasePlanDetail();
              vm.getAllocatedUMIDCount();
            });
          }
        }
      };
    }

    vm.kitReleaseMismatchDetail = (item) => {
      var releaseDetail = {
        kitDetail: vm.kitDetail,
        releasePlan: item,
        kitAssyDetail: vm.KitReleaseDetail,
        isMismatchItems: true
      };
      if (item.isRelease) {
        DialogFactory.dialogService(
          TRANSACTION.KIT_RELEASE_MISMATCH_INVENTORY_POPUP_CONTROLLER,
          TRANSACTION.KIT_RELEASE_MISMATCH_INVENTORY_POPUP_VIEW,
          event,
          releaseDetail).then(() => {
            vm.getKitReleasePlanDetail();
            vm.getAllocatedUMIDCount();
            BaseService.currentPagePopupForm = [];
          }, () => {
            vm.getKitReleasePlanDetail();
            vm.getAllocatedUMIDCount();
            BaseService.currentPagePopupForm = [];
          }, (err) => {
            BaseService.currentPagePopupForm = [];
            return BaseService.getErrorLog(err);
          });
      }
    };

    vm.checkPOKITQtyAndStartRelease = (item) => {
      let messageContent = null;

      if (vm.getRemainPOQty() < 0 || vm.getRemainkitQty() < 0 || (vm.getRemainkitQty() === 0 && vm.getRemainPOQty() !== 0) || (vm.getRemainkitQty() !== 0 && vm.getRemainPOQty() === 0)) {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.TBD_POKITQTY_VALIDATION);
        const model = {
          messageContent: messageContent,
          multiple: true
        };
        return DialogFactory.messageAlertDialog(model);
      } else {
        vm.startRelease(item, false);
      }
    };

    vm.startRelease = (item, isUpdate) => {
      item.isUpdate = isUpdate;
      const releaseDetail = {
        kitDetail: vm.kitDetail,
        releasePlan: item,
        kitAssyDetail: vm.KitReleaseDetail,
        isMismatchItems: false,
        plans: vm.kitReleasePlanList,
        isReRelease: isUpdate ? false : (!item.woID && item.kitStatus === vm.Kit_Release_Status.R.value ? true : false)
      };
      if (item.isSubAssembly || item.isUpdate) {
        releaseKit(releaseDetail);
      } else if (item.isRelease && item.kitStatus === vm.Kit_Release_Status.R.value) {
        reReleaseKit(releaseDetail);
      } else {
        releaseKit(releaseDetail);
      }
    };

    // manage re-release Plan functionality
    function reReleaseKit(releaseDetail) {
      DialogFactory.dialogService(
        TRANSACTION.RE_RELEASE_POPUP_CONTROLLER,
        TRANSACTION.RE_RELEASE_POPUP_VIEW,
        null,
        releaseDetail).then((resData) => {
          if (resData && resData.isMaintainKit) {
            releaseKit(resData);   // if Maintain kit planning is selected then go for release kit plan
          } else if (resData && resData.isChangeKit) {
            // if Change in kit planning is selected then only have to change records
            const KitReleaseDetail = {
              refSalesOrderDetID: resData.kitAssyDetail.refSalesOrderDetID,
              assyID: resData.kitAssyDetail.mainAssyID,
              subAssyID: (resData.kitAssyDetail.mainAssyID !== resData.kitAssyDetail.assyID) ? resData.kitAssyDetail.assyID : null,
              planDetID: resData.releasePlan.id,
              woID: resData.releasePlan.woID,
              isReRelease: resData.isReRelease,
              isMaintainKit: resData.isMaintainKit,
              isChangeKit: resData.isChangeKit,
              planKitNumber: resData.releasePlan.plannKitNumber
            };
            vm.cgBusyLoading = KitAllocationFactory.kitRelease().query(KitReleaseDetail).$promise.then(() => {
              vm.getKitReleasePlanDetail();
              vm.getAllocatedUMIDCount();
              BaseService.currentPagePopupForm = [];
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
          BaseService.currentPagePopupForm = [];
        }, (err) => BaseService.getErrorLog(err));
    }

    // manage release plan functionality
    function releaseKit(releaseDetail) {
      DialogFactory.dialogService(
        TRANSACTION.KIT_RELEASE_MISMATCH_INVENTORY_POPUP_CONTROLLER,
        TRANSACTION.KIT_RELEASE_MISMATCH_INVENTORY_POPUP_VIEW,
        event,
        releaseDetail).then((res) => {
          if (res) {
            vm.getKitReleasePlanDetail();
            vm.getAllocatedUMIDCount();
          }
          BaseService.currentPagePopupForm = [];
        }, () => {
          BaseService.currentPagePopupForm = [];
        }, (err) => {
          BaseService.currentPagePopupForm = [];
          return BaseService.getErrorLog(err);
        });
    }
    /**Open feasibility pop-up when click on check feasibility */
    vm.checkFeasibility = (inputQty) => {
      const salesOrderDetail = angular.copy(vm.kitDetail.salesOrderDetail);
      salesOrderDetail.SubAssy = vm.KitReleaseDetail.selectedAssy.assyName;
      const feasibilityDetail = { refSalesOrderDetID: vm.KitReleaseDetail.refSalesOrderDetID, assyID: vm.KitReleaseDetail.assyID, inputQty: inputQty || 0, salesOrderDetail: salesOrderDetail };

      DialogFactory.dialogService(
        TRANSACTION.KIT_FEASIBILITY_POPUP_CONTROLLER,
        TRANSACTION.KIT_FEASIBILITY_POPUP_VIEW,
        event,
        feasibilityDetail).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    /**
     * Display release notes for released kit
     * @param {any} item
     * @param {any} ev
     */
    vm.showReasonForTransaction = (item, ev) => {
      const data = {
        title: vm.LabelConstant.SalesOrder.ReleasedComment,
        description: item.releasedNote,
        name: item.plannKitNumber,
        label: vm.LabelConstant.SalesOrder.PlannKit
      };
      DialogFactory.dialogService(
        CORE.DESCRIPTION_MODAL_CONTROLLER,
        CORE.DESCRIPTION_MODAL_VIEW,
        ev,
        data
      ).then(() => {
      }, (err) => BaseService.getErrorLog(err));
    };

    vm.addRecord = ($event) => {
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_PLANN_PURCHASE_CONTROLLER,
        TRANSACTION.TRANSACTION_PLANN_PURCHASE_VIEW,
        $event,
        {
          soId: vm.kitDetail.salesOrderDetail.soId,
          salesOrderDetailId: vm.KitReleaseDetail.refSalesOrderDetID,
          qty: vm.kitDetail.salesOrderDetail.poQty,
          partID: vm.KitReleaseDetail.mainAssyID,
          poNumber: vm.kitDetail.salesOrderDetail.poNumber,
          salesOrderNumber: vm.kitDetail.salesOrderDetail.soNumber,
          rohsIcon: stringFormat('{0}{1}', vm.rohsImagePath, vm.kitDetail.salesOrderDetail.rohsIcon),
          rohsComplientConvertedValue: vm.kitDetail.salesOrderDetail.rohs,
          mfgPN: vm.kitDetail.salesOrderDetail.assyName,
          PIDCode: vm.kitDetail.salesOrderDetail.assyPIDCode,
          PODate: BaseService.getUIFormatedDate(vm.kitDetail.salesOrderDetail.poDate, vm.DefaultDateFormat),
          kitQty: vm.kitDetail.salesOrderDetail.kitQty,
          subKitQty: vm.kitDetail.salesOrderDetail.SubKitQty,
          subPOQty: vm.kitDetail.salesOrderDetail.SubPOQty
        }).then(() => {
        }, (data) => {
          if (data) {
            if (data.changeQty && (vm.currentState !== TRANSACTION.TRANSACTION_KIT_PREPARATION_STATE && vm.currentState !== TRANSACTION.TRANSACTION_KIT_ALLOCATION_STATE)) {
              $mdDialog.cancel(data);
            }
            vm.getKitReleasePlanDetail();
            vm.getAllocatedUMIDCount();
          }
        }, (error) => BaseService.getErrorLog(error));
    };

    vm.AssyAtGlance = () => {
      const obj = {
        partID: (vm.kitDetail.assyID || vm.kitDetail.salesOrderDetail.partId)
      };
      DialogFactory.dialogService(
        RFQTRANSACTION.ASSEMBLY_AT_GLANCE_CONTROLLER,
        RFQTRANSACTION.ASSEMBLY_AT_GLANCE_VIEW,
        null,
        obj).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };
    vm.viewAssemblyStockStatus = () => {
      const dataObj = {
        rohsIcon: CORE.WEB_URL + USER.ROHS_BASE_PATH + vm.kitDetail.salesOrderDetail.rohsIcon,
        rohsName: vm.kitDetail.salesOrderDetail.rohs,
        mfgPN: vm.kitDetail.salesOrderDetail.assyName,
        partID: vm.kitDetail.salesOrderDetail.partId,
        PIDCode: vm.kitDetail.salesOrderDetail.assyPIDCode
      };
      DialogFactory.dialogService(
        CORE.ASSEMBLY_STOCK_STATUS_MODAL_CONTROLLER,
        CORE.ASSEMBLY_STOCK_STATUS_MODAL_VIEW,
        event,
        dataObj).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };
    vm.changePlan = ($event) => {
      vm.addRecord(null, $event);
    };
    vm.initiateKitReturn = () => {
      const forceReturn = [];
      const salesOrderDetPlanIds = [];
      let messageContent;
      let obj;
      const WOCheck = _.uniq(_.compact(_.map(vm.kitReleasePlanList, (item) => {
        if (item.woID && item.kitReturnStatus === vm.KIT_RETURN_STATUS.NR.value && (item.woSubStatusID === vm.WOSTATUS.DRAFT || item.woSubStatusID === vm.WOSTATUS.PUBLISHED || item.woSubStatusID === vm.WOSTATUS.DRAFTREVIEW || item.woSubStatusID === vm.WOSTATUS.UNDER_TERMINATION || item.woSubStatusID === vm.WOSTATUS.PUBLISHED_DRAFT)) {
          return item.workorderNumber;
        }
      })));
      if (WOCheck.length > 0) {
        messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.KIT_RETURN_WO_STATUS_CHANGE);
        messageContent.message = stringFormat(messageContent.message, WOCheck.join(',').toString(), 'initiate');
        obj = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(obj);
      }
      else {
        _.each(vm.kitReleasePlanList, (item, index) => {
          if (!item.woID && item.kitReturnStatus === vm.KIT_RETURN_STATUS.NR.value) {
            forceReturn.push(index + 1);
          }

          if (item.kitReturnStatus === vm.KIT_RETURN_STATUS.NR.value) {
            salesOrderDetPlanIds.push(item.id);
          }
          if (item.kitReturnStatus === vm.KIT_RETURN_STATUS.NA.value) {
            salesOrderDetPlanIds.push(item.id);
          }
        });
        if (forceReturn.length > 0) {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.FORCE_RETURN);
          messageContent.message = stringFormat(messageContent.message, forceReturn.join(', ').toString());
          obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT,
            multiple: true
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              initiatekitRet(salesOrderDetPlanIds);
            }
          }).catch((error) => BaseService.getErrorLog(error));
        } else {
          initiateKitConfirmation(salesOrderDetPlanIds);
        }
      }
    };

    const initiateKitConfirmation = (salesOrderDetPlanIds) => {
      const obj = {
        messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.INITIATE_KIT_RETURN_CONFIRMATION,
        btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
        canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT,
        multiple: true
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          initiatekitRet(salesOrderDetPlanIds);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    const initiatekitRet = (salesOrderDetPlanIds) => {
      if (salesOrderDetPlanIds) {
        const initiateKitReturn = {
          id: salesOrderDetPlanIds
        };
        vm.cgBusyLoading = KitAllocationFactory.initiateKitReturn().query(initiateKitReturn).$promise.then((response) => {
          if (response && response.data) {
            if (response.data.ErrorCode === vm.ErrorCode.FULLY_KIT_RETUNRED) {
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.FULLY_KIT_RETUNRED);
              messageContent.message = stringFormat(messageContent.message, 'perform initiate kit return');
              const model = {
                messageContent: messageContent,
                multiple: true
              };
              DialogFactory.messageAlertDialog(model);
            } else {
              vm.getKitReleasePlanDetail();
              vm.getAllocatedUMIDCount();
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    vm.returnKitConfirmation = () => {
      const WOCheck = _.uniq(_.compact(_.map(vm.kitReleasePlanList, (item) => {
        if (item.woID && item.kitReturnStatus === vm.KIT_RETURN_STATUS.RR.value && (item.woSubStatusID === vm.WOSTATUS.DRAFT || item.woSubStatusID === vm.WOSTATUS.PUBLISHED || item.woSubStatusID === vm.WOSTATUS.DRAFTREVIEW || item.woSubStatusID === vm.WOSTATUS.UNDER_TERMINATION || item.woSubStatusID === vm.WOSTATUS.PUBLISHED_DRAFT)) {
          return item.workorderNumber;
        }
      })));
      if (WOCheck.length > 0) {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.KIT_RETURN_WO_STATUS_CHANGE);
        messageContent.message = stringFormat(messageContent.message, WOCheck.join(',').toString());
        const obj = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(obj);
      } else {
        // Check validation if UMID allocated to kit
        vm.cgBusyLoading = getAllocatedUMIDCount().then((response) => {
          //If UMID not allocated to kit then allow to return else restrict user to return kit
          if (response && response.data && response.data.UMIDCount === 0) {
            vm.returnKit();
          } else {
            if (response.data.UMIDS) {
              const UMIDS = _.map(response.data.UMIDS, 'uid').join(', ').toString();
              const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_ALLOW_RETURN_KIT_FOR_ALLOCATED_UMID);
              messageContent.message = stringFormat(messageContent.message, UMIDS);
              const alertModel = {
                messageContent: messageContent,
                btnText: CORE.LabelConstant.KitAllocation.GotoAllocatedUMIDs,
                canbtnText: CORE.LabelConstant.KitAllocation.DeallocateCancel,
                multiple: true
              };
              DialogFactory.messageConfirmDialog(alertModel).then((yes) => {
                if (yes) {
                  BaseService.goToKitPreparation(vm.KitReleaseDetail.refSalesOrderDetID);
                }
              }).catch((error) => BaseService.getErrorLog(error));
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };
    vm.returnKit = () => {
      // based on decision of kit return status
      const objData = {
        kitReleasePlanList: vm.kitReleasePlanList
      };
      DialogFactory.dialogService(
        TRANSACTION.RETURN_KIT_POPUP_CONTROLLER,
        TRANSACTION.RETURN_KIT_POPUP_VIEW,
        null,
        objData).then(() => {
          vm.getKitReleasePlanDetail();
          vm.getAllocatedUMIDCount();
        }, () => {
          BaseService.currentPagePopupForm = [];
        }, (err) => BaseService.getErrorLog(err));
    };

    //Catch socket calls
    function connectSocket() {
      socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.PO_START, vm.getHoldResumeStatus);
      socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.PO_STOP, vm.getHoldResumeStatus);
      socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.KIT_ALLOCATION_START, vm.getHoldResumeStatus);
      socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.KIT_ALLOCATION_STOP, vm.getHoldResumeStatus);
      socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.KIT_RELEASE_START, vm.getHoldResumeStatus);
      socketConnectionService.on(CORE.Socket_IO_Events.HoldResumeTrans.KIT_RELEASE_STOP, vm.getHoldResumeStatus);
    }
    connectSocket();

    socketConnectionService.on('reconnect', () => {
      connectSocket();
    });
    function removeSocketListener() {
      socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.PO_START);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.PO_STOP);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.KIT_ALLOCATION_START);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.KIT_ALLOCATION_STOP);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.KIT_RELEASE_START);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.KIT_RELEASE_STOP);
    }

    // open deallocated material popup
    vm.deallocatedUMID = () => {
      const dataObj = {
        rohsIcon: vm.kitDetail.salesOrderDetail.rohsIcon,
        rohsName: vm.kitDetail.salesOrderDetail.rohs,
        mfgPN: vm.kitDetail.salesOrderDetail.assyName,
        assyID: (vm.kitDetail.assyID || vm.kitDetail.salesOrderDetail.partId),
        PIDCode: vm.kitDetail.salesOrderDetail.assyPIDCode,
        refSalesOrderDetID: vm.kitDetail.refSalesOrderDetID,
        kitNumber: vm.kitDetail.salesOrderDetail.kitNumber
      };
      DialogFactory.dialogService(
        TRANSACTION.DEALLOCATED_UID_POPUP_CONTROLLER,
        TRANSACTION.DEALLOCATED_UID_POPUP_VIEW,
        null,
        dataObj).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };

    // open kit Release Return History
    vm.releaseReturnHistory = () => {
      const dataObj = {
        rohsIcon: vm.kitDetail.salesOrderDetail.rohsIcon,
        rohsName: vm.kitDetail.salesOrderDetail.rohs,
        mfgPN: vm.kitDetail.salesOrderDetail.assyName,
        assyID: (vm.kitDetail.assyID || vm.kitDetail.salesOrderDetail.partId),
        PIDCode: vm.kitDetail.salesOrderDetail.assyPIDCode,
        salesOrderDetialId: vm.kitDetail.refSalesOrderDetID,
        kitNumber: vm.kitDetail.salesOrderDetail.kitNumber
      };
      DialogFactory.dialogService(
        TRANSACTION.RELEASE_RETURN_HISTORY_POPUP_CONTROLLER,
        TRANSACTION.RELEASE_RETURN_HISTORY_POPUP_VIEW,
        null,
        dataObj).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };

    // on destroy socket
    $scope.$on('$destroy', () => {
      // Remove socket listeners
      removeSocketListener();
    });

    // on disconnect socket
    socketConnectionService.on('disconnect', () => {
      // Remove socket listeners
      removeSocketListener();
    });

    /** Get list of parent warehouse for 'Transfer From' section */
    const getAllocatedUMIDCount = () => KitAllocationFactory.getAllocatedUMIDCount().query({
      refSalesOrderDetID: vm.KitReleaseDetail.refSalesOrderDetID,
      assyID: vm.KitReleaseDetail.assyID
    }).$promise.then((response) => $q.resolve(response)).catch((error) => BaseService.getErrorLog(error));
  }
})();
