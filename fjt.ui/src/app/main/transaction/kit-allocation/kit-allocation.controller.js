
(function () {
  'use strict';

  angular.module('app.transaction.kitAllocation')
    .controller('KitAllocationController', KitAllocationController);

  /** @ngInject */
  function KitAllocationController($scope, $state, $stateParams, $timeout, $filter, BaseService, MasterFactory, DialogFactory, USER, CORE, TRANSACTION, ReceivingMaterialFactory, KitAllocationFactory, socketConnectionService, $mdDialog, RFQTRANSACTION, ManufacturerFactory, CompanyProfileFactory) {
    const vm = this;
    vm.CoreLabelConstant = CORE.LabelConstant;
    vm.Kit_Release_Status = CORE.Kit_Release_Status;
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.KIT_ALLOCATION;
    let salesOrderDetailId = $stateParams.id ? parseInt($stateParams.id) : null;
    vm.partId = parseInt($stateParams.partId || 0);
    vm.mountingTypeId = $stateParams.mountingTypeId ? $stateParams.mountingTypeId : null;
    vm.salesOrderDetail = {};
    vm.isSelectSO = false;
    vm.isDeAllocateDisable = true;
    let lastSelect = {};
    vm.haltResumePopUp = CORE.HaltResumePopUp;
    vm.isPOHalt = false;
    vm.isKAHalt = false;
    vm.isKRHalt = false;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.isSelectSONotFound = true;
    vm.isNoDataFound = false;
    vm.isReCalculate = false;
    vm.shortageLines = false;
    vm.subAssemblyList = [];
    vm.TRANSACTION = TRANSACTION;
    vm.KIT_RETURN_STATUS = vm.TRANSACTION.KIT_RETURN_STATUS;
    vm.activityTransactionType = TRANSACTION.StartStopActivityTransactionType;
    vm.transactionType = TRANSACTION.StartStopActivityTransactionType;
    vm.SOWorkingStatus = CORE.SOWorkingStatus;
    vm.currentState = $state.current.name;
    vm.isReCalculateDisable = true;
    vm.packagingAlias = true;
    vm.goToSalesOrderList = () => {
      BaseService.goToSalesOrderList();
      return false;
    };

    vm.goToManageSalesOrder = () => {
      BaseService.goToManageSalesOrder(vm.salesOrderDetail.soId);
      return false;
    };

    vm.goBack = () => {
      $state.go(TRANSACTION.KIT_LIST_STATE);
    };

    //show color legend on click of pallet icon
    vm.showColorLengend = (ev) => {
      const data = {
        pageName: vm.CoreLabelConstant.KitAllocation.PageName,
        legendList: CORE.LegendList.KitAllocation,
        isFilterList: true
      };
      DialogFactory.dialogService(
        CORE.LEGEND_MODAL_CONTROLLER,
        CORE.LEGEND_MODAL_VIEW,
        ev,
        data).then(() => {
          //sucess section
        },
          (error) => BaseService.getErrorLog(error));
    };

    const getSalesOrderList = (query) => {
      query.excludeCanceled = true;
      return ReceivingMaterialFactory.get_PO_SO_Assembly_List().query(query).$promise.then((response) => {
        vm.SalesOrderNumberList = response.data;
        _.map(vm.SalesOrderNumberList, (item) => {
          if (query.salesOrderDetailID) {
            item.isCallFromReload = true;
          }
        });
        if (query.salesOrderDetailID && vm.SalesOrderNumberList && vm.SalesOrderNumberList.length > 0) {
          $timeout(() => {
            $scope.$broadcast(vm.autoCompleteSO.inputName, vm.SalesOrderNumberList[0]);
          }, true);
        } else {
          salesOrderDetailId = null;
          vm.partId = null;
          vm.mountingTypeId = null;
        }
        return vm.SalesOrderNumberList;
      }).catch((error) => BaseService.getErrorLog(error));
    };

    const initAutoComplete = () => {
      vm.autoCompleteSO = {
        columnName: 'salescolumn',
        keyColumnName: 'SalesOrderDetailId',
        keyColumnId: salesOrderDetailId,
        inputName: 'SO#',
        placeholderName: 'SO#',
        isRequired: false,
        isAddnew: false,
        callbackFn: (query) => {
          const search = {
            salesOrderDetailID: salesOrderDetailId ? salesOrderDetailId : null,
            search: query
          };
          return getSalesOrderList(search);
        },
        onSelectCallbackFn: selectSONumber,
        onSearchFn: (query) => {
          const search = {
            salesOrderDetailID: salesOrderDetailId ? salesOrderDetailId : null,
            search: query
          };
          return getSalesOrderList(search);
        }
      };
    };

    const internalVersionChangePopUp = (kitAllocationInternalVersion, kitAllocationKitQty, kitAllocationMrpQty, currentInternalVersion) => {
      if ((kitAllocationKitQty !== vm.salesOrderDetail.kitQty) || (kitAllocationMrpQty !== vm.salesOrderDetail.soQty) || (kitAllocationInternalVersion !== currentInternalVersion) && vm.salesOrderDetail.salesOrderDetailStatus === CORE.SalesOrderCompleteStatusGridHeaderDropdown[1].value) {
        let messageContent = null;

        if (kitAllocationInternalVersion !== currentInternalVersion) {
          if (kitAllocationInternalVersion) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RE_CALCULATE_INTERNALVERSIO);
            messageContent.message = stringFormat(messageContent.message, currentInternalVersion, kitAllocationInternalVersion);
          } else {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RECALCULATE_BOM_VERSION_GENERATED_AND_KIT_NOT_GENEARTED);
            messageContent.message = stringFormat(messageContent.message, currentInternalVersion);
          }
        } else {
          messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RE_CALCULATE_KITQTY);
          messageContent.message = stringFormat(messageContent.message, vm.salesOrderDetail.soNumber);
        }

        showPopUpOfSocketIO(messageContent);
      }
    };

    const showPopUpOfSocketIO = (messageContent) => {
      vm.isReCalculateDisable = false;
      $mdDialog.cancel(true);
      $timeout(() => {
        const model = {
          messageContent: messageContent,
          multiple: false
        };
        return DialogFactory.messageAlertDialog(model).then((yes) => {
          if (yes) {
            vm.isNoDataFound = false;
            vm.isSelectSONotFound = false;
            vm.isReCalculate = true;
          }
        }).catch(() => {

        });
      });
    };

    const showInformationPopUpOfSocketIO = (messageContent, obj) => {
      $mdDialog.cancel(true);
      $timeout(() => {
        const model = {
          messageContent: messageContent,
          multiple: false
        };
        DialogFactory.messageAlertDialog(model).then((yes) => {
          if (yes) {
            if (obj.isSkipKitCreation) {
              $stateParams = {};
              $state.transitionTo($state.$current, {}, { location: true, inherit: false, notify: true, reload: true });
            } else {
              $state.go(TRANSACTION.TRANSACTION_KIT_ALLOCATION_STATE, { id: vm.salesOrderDetail.SalesOrderDetailId, partId: vm.partId ? obj.partID : 0 }, { reload: true });
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      });
    };

    const kitAllocationAssyList = (objDetail) => {
      vm.cgBusyLoading = KitAllocationFactory.checkBOMAndGetKitAllocationList().query({
        salesOrderDetailId: objDetail.SalesOrderDetailId,
        partId: objDetail.componentID,
        kitQty: objDetail.kitQty,
        mrpQty: objDetail.soQty
      }).$promise.then((response) => {
        if (response && response.data && response.data.calculated && response.data.calculated.IsSuccess === 0) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BOM_INTERNAL_VERSION_NOT_SET);
          const model = {
            messageContent: messageContent,
            multiple: false
          };
          return DialogFactory.messageAlertDialog(model);
        } else {
          vm.assyList = response.data;
          const objFirst = _.first(vm.assyList);
          const objLast = _.last(vm.assyList);
          vm.salesOrderDetail.kitAllocationInternalVersion = objFirst ? objFirst.bomInternalVersionString : null;
          vm.salesOrderDetail.kitAllocationKitQty = objFirst ? objFirst.kitQty : 0;
          vm.salesOrderDetail.kitAllocationMrpQty = objFirst ? objFirst.mrpQty : 0;
          vm.salesOrderDetail.currentInternalVersion = objLast ? objLast.liveVersion : null;

          if (!vm.salesOrderDetail.kitAllocationInternalVersion && !vm.salesOrderDetail.currentInternalVersion) {
            vm.isReCalculateDisable = false;
          }

          if (vm.assyList && vm.assyList.length > 0) {
            internalVersionChangePopUp(vm.salesOrderDetail.kitAllocationInternalVersion, vm.salesOrderDetail.kitAllocationKitQty, vm.salesOrderDetail.kitAllocationMrpQty, vm.salesOrderDetail.currentInternalVersion);
            vm.isSelectSONotFound = false;
            vm.isNoDataFound = false;
            vm.selectedTabIndex1 = null;
            const kitParam = `({id: ${objDetail.SalesOrderDetailId}, partId: 0, mountingTypeId: ""})`;
            const subAssembly = {
              id: 0,
              partId: 0,
              src: TRANSACTION.TRANSACTION_KIT_ALLOCATION_STATE + kitParam,
              pIDCode: 'Consolidated (View Only)',
              tabIndex: 0,
              isActiveTab: !vm.partId || vm.partId === 0 ? true : false
            };

            vm.subAssemblyList.push(subAssembly);
            _.each(vm.assyList, (obj, index) => {
              if (vm.assyList.length !== index + 1) {
                const kitParam = `({id: ${objDetail.SalesOrderDetailId}, partId: ${obj.partId}, mountingTypeId: "" })`;
                if (obj.partId === vm.partId) {
                  vm.selectedTabIndex1 = index + 1;
                }
                const subAssembly = {
                  id: index + 1,
                  partId: obj.partId,
                  src: TRANSACTION.TRANSACTION_KIT_ALLOCATION_STATE + kitParam,
                  level: obj.bomAssyLevel,
                  pIDCode: obj.kit_allocation_component.PIDCode,
                  mfgPN: obj.kit_allocation_component.mfgPN,
                  mfgPNwithOutSpacialChar: obj.kit_allocation_component.mfgPNwithOutSpacialChar,
                  pidCodewithOutSpacialChar: obj.kit_allocation_component.pidCodewithOutSpacialChar,
                  tabIndex: index + 1,
                  isActiveTab: obj.partId === vm.partId ? true : false,
                  kitQty: obj.totalAssyBuildQty,
                  mrpQty: obj.totalAssyMrpQty,
                  perAssyBuildQty: obj.perAssyBuildQty,
                  kitRohsId: obj.kit_allocation_component.rfq_rohsmst.id,
                  kitRohsIcon: stringFormat(CORE.RoHSImageFormat, CORE.WEB_URL, USER.ROHS_BASE_PATH, obj.kit_allocation_component.rfq_rohsmst.rohsIcon),
                  kitRohsName: obj.kit_allocation_component.rfq_rohsmst.name,
                  mfgPNDescription: obj.kit_allocation_component.mfgPNDescription || null,
                  specialNote: obj.kit_allocation_component.specialNote || null
                };

                vm.subAssemblyList.push(subAssembly);
              }
            });
            const preparationIndex = vm.subAssemblyList.length + 1;
            const preparationTab = {
              id: 0,
              partId: 0,
              src: TRANSACTION.TRANSACTION_KIT_PREPARATION_STATE + kitParam,
              pIDCode: vm.CoreLabelConstant.KitAllocation.KitPreparationTab,
              tabIndex: preparationIndex ? preparationIndex : 0,
              isActiveTab: (vm.currentState === vm.TRANSACTION.TRANSACTION_KIT_PREPARATION_STATE) ? true : false
            };
            vm.partIds = _.map(vm.subAssemblyList, 'partId').join(',').toString();
            vm.subAssemblyList.push(preparationTab);
            $timeout(() => {
              if (vm.currentState === vm.TRANSACTION.TRANSACTION_KIT_PREPARATION_STATE) {
                vm.selectedTabIndex = preparationIndex ? preparationIndex : 0;
              } else {
                vm.selectedTabIndex = vm.selectedTabIndex1 ? vm.selectedTabIndex1 : 0;
              }
            });
          } else {
            vm.isSelectSONotFound = false;
            vm.isNoDataFound = true;
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));

      vm.getKitReleaseSummaryAndStatus();
    };

    vm.onTabChanges = (item) => {
      vm.selectedTabIndex = item.tabIndex;
    };

    const selectSONumber = (item) => {
      if (item && lastSelect && item['PartID'] === lastSelect['PartID']) {
        return;
      }

      if (item && item.isSkipKitCreation) {
        $stateParams = {};
        $state.transitionTo($state.$current, {}, { location: true, inherit: false, notify: true, reload: true });
      }
      else if (item) {
        vm.salesOrderDetail.poNumber = item['Po Number'];
        vm.salesOrderDetail.poNumwithoutSpecialChar = item['poNumwithoutSpecialChar'];
        vm.salesOrderDetail.poDate = item['poDate'];
        vm.salesOrderDetail.soNumber = item['Sales Order'];
        vm.salesOrderDetail.soId = item['Sales Order ID'];
        vm.salesOrderDetail.assyPIDCode = item['Assy ID'];
        vm.salesOrderDetail.AssyIDwithoutSpecialChar = item['AssyIDwithoutSpecialChar'];
        vm.salesOrderDetail.assyName = item['Assy Name'];
        vm.salesOrderDetail.AssyNamewithoutSpecialChar = item['AssyNamewithoutSpecialChar'];
        vm.salesOrderDetail.nickName = item['NickName'];
        vm.salesOrderDetail.poQty = item['PO Qty'];
        vm.salesOrderDetail.soQty = item['mrpQty'];
        vm.salesOrderDetail.kitQty = item['kitQty'];
        vm.salesOrderDetail.partId = item['PartID'];
        vm.salesOrderDetail.salesOrderDetailStatus = item['Status'];
        vm.salesOrderDetail.rohs = item['RoHSName'];
        vm.salesOrderDetail.rohsIcon = item['RohsIcon'];
        vm.salesOrderDetail.componentID = item['PartID'];
        vm.salesOrderDetail.RoHSStatusIcon = stringFormat(CORE.RoHSImageFormat, CORE.WEB_URL, USER.ROHS_BASE_PATH, vm.salesOrderDetail.rohsIcon);
        vm.salesOrderDetail.materialDueDate = item['materialDueDate'];
        vm.salesOrderDetail.shippingDate = item['shippingDate'];
        vm.salesOrderDetail.customerID = item['Customer ID'];
        vm.salesOrderDetail.companyCode = item['Company Code'];
        vm.salesOrderDetail.companyName = item['companyName'];
        vm.isSelectSO = true;
        vm.salesOrderDetail.SalesOrderDetailId = item['SalesOrderDetailId'];
        vm.salesOrderDetail.poDate = item['Po Date'];
        vm.autoCompleteSO.keyColumnId = item['SalesOrderDetailId'];
        vm.salesOrderDetail.kitNumber = item['kitNumber'];
        vm.salesOrderDetail.kitNumberwithoutSpecialChar = item['kitNumberwithoutSpecialChar'];
        vm.salesOrderDetail.status = item['Status'];
        vm.salesOrderDetail.assyDescription = item['AssyDescr'];
        vm.salesOrderDetail.assySpecialNote = item['AssySpecialNote'];
        kitAllocationAssyList(vm.salesOrderDetail);

        if (!item.isCallFromReload) {
          vm.partId = vm.salesOrderDetail.partId;
        }

        $state.transitionTo($state.$current, { id: item['SalesOrderDetailId'], partId: vm.partId ? vm.partId : 0, mountingTypeId: vm.mountingTypeId }, { location: true, inherit: false, notify: true });
        //$state.transitionTo($state.$current, { id: item['SalesOrderDetailId'], partId: vm.salesOrderDetail.partId, mountingTypeId: vm.mountingTypeId }, { location: true, inherit: false, notify: false });
      }
      else {
        vm.isSelectSO = false;
        vm.isSelectSONotFound = true;
        vm.isNoDataFound = false;
        vm.isReCalculate = false;
        vm.salesOrderDetail = {};
        vm.isReCalculateDisable = true;
        vm.subAssemblyList = vm.assyList = [];
        $state.transitionTo($state.$current, {}, { location: true, inherit: false, notify: true });
      }
      lastSelect = item;
    };

    if (salesOrderDetailId) {
      initAutoComplete();
      const query = {
        salesOrderDetailID: salesOrderDetailId
      };
      getSalesOrderList(query);
    } else {
      initAutoComplete();
    }


    vm.goToAssyMaster = () => {
      BaseService.goToComponentDetailTab(null, vm.salesOrderDetail.partId);
      return false;
    };

    vm.goToSOList = () => {
      BaseService.openInNew(TRANSACTION.TRANSACTION_SALESORDER_STATE, {});
    };

    vm.goToAssy = () => {
      BaseService.goToPartList();
      return false;
    };

    // Redirect to BOM tab of part master
    vm.uploadBom = () => {
      BaseService.goToComponentBOMWithSubAssy(vm.salesOrderDetail.partId, vm.partId && vm.partId !== 0 ? vm.partId : vm.salesOrderDetail.partId);
    };

    vm.confirmationForMismatchItems = () => {
      const assyID = parseInt(vm.partId || 0);
      const kitDetail = {
        refSalesOrderDetID: vm.salesOrderDetail.SalesOrderDetailId,
        assyID: assyID || vm.salesOrderDetail.partId,
        isConsolidated: assyID ? false : true,
        poNumber: vm.salesOrderDetail.poNumber,
        soNumber: vm.salesOrderDetail.soNumbe,
        rohsIcon: vm.salesOrderDetail.SubAssyRohsIcon ? vm.salesOrderDetail.SubAssyRohsIcon : vm.salesOrderDetail.rohsIcon,
        rohsName: vm.salesOrderDetail.SubAssyRohs ? vm.salesOrderDetail.SubAssyRohs : vm.salesOrderDetail.rohs,
        assyPIDCode: vm.salesOrderDetail.SubAssyId ? vm.salesOrderDetail.SubAssyPIDCode : vm.salesOrderDetail.assyPIDCode,
        assyName: vm.salesOrderDetail.SubAssyId ? vm.salesOrderDetail.SubAssy : vm.salesOrderDetail.assyName
      };
      if (kitDetail.isConsolidated) {
        vm.reCalculateKitAllocation(false);
      } else {
        vm.cgBusyLoading = KitAllocationFactory.getCustConsignMismatchKitAllocationDetails().query(kitDetail).$promise.then((response) => {
          if (response.data && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            if (response.data.KitLineDetail && response.data.KitLineDetail.length > 0) {
              const KitLineDetail = {
                kitAllocationList: response.data.KitLineDetail,
                salesOrderDetail: vm.salesOrderDetail
              };
              DialogFactory.dialogService(
                TRANSACTION.KIT_CUSTCONSIGN_MISMATCH_POPUP_CONTROLLER,
                TRANSACTION.KIT_CUSTCONSIGN_MISMATCH_POPUP_VIEW,
                event,
                KitLineDetail).then(() => {
                }, (data) => {
                  if (data) {
                    vm.reCalculateKitAllocation(true);
                  }
                }).catch((error) => BaseService.getErrorLog(error));
            } else {
              vm.reCalculateKitAllocation(false);
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.reCalculateKitAllocation = (isPurchaseChange) => {
      vm.cgBusyLoading = KitAllocationFactory.reCalculateKitAllocation().query({ partId: vm.salesOrderDetail.partId, sodid: vm.salesOrderDetail.SalesOrderDetailId, kitQty: vm.salesOrderDetail.kitQty, mrpQty: vm.salesOrderDetail.soQty, isPurchaseChange: isPurchaseChange }).$promise.then((response) => {
        if (response.data && response.data.calculated && response.data.calculated.IsSuccess && response.data.calculated.IsSuccess === 0) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.BOM_INTERNAL_VERSION_NOT_SET);
          const model = {
            messageContent: messageContent,
            multiple: false
          };
          return DialogFactory.messageAlertDialog(model);
        } else {
          $state.go(TRANSACTION.TRANSACTION_KIT_ALLOCATION_STATE, { id: vm.salesOrderDetail.SalesOrderDetailId, partId: vm.partId ? vm.partId : 0 }, { reload: true });
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.changeShortageLines = () => {
      $scope.$broadcast('KitAllocationShortageLines', vm.shortageLines);
    };

    vm.changePackagingAlias = () => {
      $scope.$broadcast('KitAllocationPackagingAlias', vm.packagingAlias);
    };

    /** Open feasibility pop-up when click on check feasibility */
    vm.checkFeasibility = () => {
      const assyID = parseInt(vm.partId || 0);
      const feasibilityDetail = { refSalesOrderDetID: vm.salesOrderDetail.SalesOrderDetailId, assyID: (assyID || vm.salesOrderDetail.partId), isConsolidated: assyID ? false : true, inputQty: 0, salesOrderDetail: vm.salesOrderDetail };

      DialogFactory.dialogService(
        TRANSACTION.KIT_FEASIBILITY_POPUP_CONTROLLER,
        TRANSACTION.KIT_FEASIBILITY_POPUP_VIEW,
        null,
        feasibilityDetail).then(() => {
        }, () => {

        }, (err) => BaseService.getErrorLog(err));
    };

    /** Open kit release pop-up to release stock */
    vm.kitRelease = (isForViewOnly) => {
      if (vm.salesOrderDetail && !vm.salesOrderDetail.SubAssy) {
        vm.salesOrderDetail.SubAssy = (_.find(vm.subAssemblyList, (item) => item.level === 0) || {}).pIDCode;
      }
      const assyID = parseInt(vm.partId || 0);
      const kitDetail = {
        salesOrderDetail: vm.salesOrderDetail,
        refSalesOrderDetID: vm.salesOrderDetail.SalesOrderDetailId,
        assyID: (assyID || vm.salesOrderDetail.partId),
        isConsolidated: assyID ? false : true,
        isForViewOnly: isForViewOnly
      };

      DialogFactory.dialogService(
        TRANSACTION.KIT_RELEASE_POPUP_CONTROLLER,
        TRANSACTION.KIT_RELEASE_POPUP_VIEW,
        null,
        kitDetail).then(() => {
          vm.getKitReleaseSummaryAndStatus();
          vm.changePackagingAlias();
        }, () => {
          vm.getKitReleaseSummaryAndStatus();
          vm.changePackagingAlias();
        }, (err) => BaseService.getErrorLog(err));
    };

    // open deallocated material popup
    vm.deallocatedUMID = (row) => {
      const dataObj = {
        rohsIcon: vm.salesOrderDetail.rohsIcon,
        rohsName: vm.salesOrderDetail.rohs,
        mfgPN: vm.salesOrderDetail.SubAssy ? vm.salesOrderDetail.SubAssy : vm.salesOrderDetail.assyName,
        assyID: vm.salesOrderDetail.SubAssyId ? vm.salesOrderDetail.SubAssyId : vm.salesOrderDetail.partId,
        PIDCode: vm.salesOrderDetail.SubAssyPIDCode ? vm.salesOrderDetail.SubAssyPIDCode : vm.salesOrderDetail.assyPIDCode,
        refSalesOrderDetID: vm.salesOrderDetail.SalesOrderDetailId,
        partId: row && row.mfgPNIdsWithPackaging ? row.mfgPNIdsWithPackaging : null,
        kitNumber: vm.salesOrderDetail.kitNumber
      };
      DialogFactory.dialogService(
        TRANSACTION.DEALLOCATED_UID_POPUP_CONTROLLER,
        TRANSACTION.DEALLOCATED_UID_POPUP_VIEW,
        event,
        dataObj).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.getHoldResumeStatus = (responseData) => {
      if (responseData.salesOrderDetailId === salesOrderDetailId) {
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

    if (salesOrderDetailId) {
      vm.getHoldResumeStatus({ salesOrderDetailId: salesOrderDetailId });
    }

    // Add Kit Manual Activity
    vm.addManualKitEntry = () => {
      BaseService.openInNew(TRANSACTION.MANAGE_MANUAL_ENTRY_STATE, { transType: vm.activityTransactionType[2].id, refTransId: salesOrderDetailId });
    };

    // Add Kit Manual Activity history
    vm.KitActivityHistory = () => {
      var data = {
        refTransID: salesOrderDetailId,
        transactionType: vm.transactionType[2].id
      };
      DialogFactory.dialogService(
        RFQTRANSACTION.BOM_ACTIVITY_HISTORY_POPUP_CONTROLLER,
        RFQTRANSACTION.BOM_ACTIVITY_HISTORY_POPUP_VIEW,
        null,
        data).then(() => {
          //success
        }, (err) => BaseService.getErrorLog(err));
    };

    function UpdateBOMInternalVersionListener(data) {
      let partID;

      if (data.notifyFrom === 'CPN') {
        const result = _.filter(vm.assyList, (partIDs) => _.filter(data.data, (item) => {
          if (item.partId === partIDs.partId) {
            return partIDs;
          }
        }));
        if (result.length > 0) {
          partID = vm.salesOrderDetail ? vm.salesOrderDetail.partId : '';
        }
      } else if (data.notifyFrom === 'BOM') {
        partID = data.data.partID;
      }
      else if (data.notifyFrom === 'PartMaster') {
        partID = (_.find(data.data, { id: vm.salesOrderDetail.partId }) || {}).id || null;
      }

      const findAssy = _.find(vm.assyList, (data) => data.partId === partID);
      if (findAssy || vm.partId === partID) {
        return MasterFactory.getComponentInternalVersion().query({ id: vm.salesOrderDetail.partId }).$promise.then((requirement) => {
          if (requirement && requirement.data && requirement.data.liveVersion) {
            vm.currentVersion = requirement.data.liveVersion;
            internalVersionChangePopUp(vm.salesOrderDetail.kitAllocationInternalVersion, vm.salesOrderDetail.kitAllocationKitQty, vm.salesOrderDetail.kitAllocationMrpQty, vm.currentVersion);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    }

    function SalesOrderKitMRPQtyChangeListener(data) {
      if (data && data.data) {
        const findAssy = _.find(vm.assyList, (item) => item.partId === data.data.partID);

        if (data.notifyFrom === 'kit-mrp-qty-popup') {
          vm.salesOrderDetail.kitQty = data.data.kitQty;
          vm.salesOrderDetail.soQty = data.data.mrpQty;
          internalVersionChangePopUp(vm.salesOrderDetail.kitAllocationInternalVersion, vm.salesOrderDetail.kitAllocationKitQty, vm.salesOrderDetail.kitAllocationMrpQty, vm.salesOrderDetail.currentInternalVersion);
        }

        if (data.notifyFrom === 'update-sales-order-detail') {
          let messageContent = null;
          if (findAssy && (data.data.isDeleted || data.data.isSkipKitCreation)) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RE_CALCULATE_DELETE_ASSY);
            messageContent.message = stringFormat(messageContent.message, vm.salesOrderDetail.kitNumber, data.data.userInitialName, vm.salesOrderDetail.soNumber);
          }
          else if (findAssy) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RE_CALCULATE_CHANGE_SALESORDER);
            messageContent.message = stringFormat(messageContent.message, data.data.userInitialName, vm.salesOrderDetail.soNumber);
          }
          else if (!findAssy && data.data.isAssyChange && vm.salesOrderDetail && vm.salesOrderDetail.soNumber) {
            messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RE_CALCULATE_CHANGE_SALESORDER);
            messageContent.message = stringFormat(messageContent.message, data.data.userInitialName, vm.salesOrderDetail.soNumber);
          }

          if (messageContent) {
            showInformationPopUpOfSocketIO(messageContent, data.data);
          } else if (!vm.autoCompleteSO.keyColumnId && data.data.isSkipKitCreation) {
            getSalesOrderList({});
          }
        }
      }
    }

    // Catch socket calls
    function connectSocket() {
      socketConnectionService.on(CORE.Socket_IO_Events.BOMChange.updateBOMInternalVersion, UpdateBOMInternalVersionListener);
      socketConnectionService.on(CORE.Socket_IO_Events.SalesOrderChange.sendSalesOrderKitMRPQtyChanged, SalesOrderKitMRPQtyChangeListener);
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
      socketConnectionService.removeListener(CORE.Socket_IO_Events.BOMChange.updateBOMInternalVersion);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.SalesOrderChange.sendSalesOrderKitMRPQtyChanged);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.PO_START);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.PO_STOP);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.KIT_ALLOCATION_START);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.KIT_ALLOCATION_STOP);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.KIT_RELEASE_START);
      socketConnectionService.removeListener(CORE.Socket_IO_Events.HoldResumeTrans.KIT_RELEASE_STOP);
    }


    $scope.$on('$destroy', () => {
      removeSocketListener();
    });

    // on disconnect socket
    socketConnectionService.on('disconnect', () => {
      removeSocketListener();
    });

    /** Get release detail to show release information on page header */
    vm.getKitReleaseSummaryAndStatus = () => {
      var assyID = vm.partId ? parseInt(vm.partId) : null;
      var kitDetail = { refSalesOrderDetID: vm.salesOrderDetail.SalesOrderDetailId, assyID: (assyID || vm.salesOrderDetail.partId), mainAssyId: vm.salesOrderDetail.partId, isConsolidated: assyID ? false : true };

      KitAllocationFactory.getKitReleaseSummaryAndStatus(kitDetail).query().$promise.then((res) => {
        vm.kitReleaseStatusSummary = _.first(res.data);
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.AssyAtGlance = () => {
      const assyID = parseInt(vm.partId || 0);
      const obj = {
        partID: (assyID || vm.salesOrderDetail.partId)
      };
      DialogFactory.dialogService(
        RFQTRANSACTION.ASSEMBLY_AT_GLANCE_CONTROLLER,
        RFQTRANSACTION.ASSEMBLY_AT_GLANCE_VIEW,
        null,
        obj).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.updatekitmrpqty = () => {
      if (vm.salesOrderDetail && (vm.salesOrderDetail.partId && salesOrderDetailId)) {
        const assyID = parseInt(vm.partId || 0);
        const obj = {
          salesOrderDetail: salesOrderDetailId,
          mainAssyId: vm.salesOrderDetail.partId,
          subAssyId: (assyID || vm.salesOrderDetail.partId)
        };
        DialogFactory.dialogService(
          TRANSACTION.UPDATE_KIT_MRP_QTY_POPUP_CONTROLLER,
          TRANSACTION.UPDATE_KIT_MRP_QTY_POPUP_VIEW,
          null,
          obj).then(() => {
          }, (data) => {
            if (data) {
              // vm.salesOrderDetail.kitQty = data.kitQty;
              // vm.salesOrderDetail.soQty = data.mrpQty;
              // internalVersionChangePopUp(vm.salesOrderDetail.kitAllocationInternalVersion, vm.salesOrderDetail.kitAllocationKitQty, vm.salesOrderDetail.kitAllocationMrpQty, vm.salesOrderDetail.currentInternalVersion);
            }
          }, (err) => BaseService.getErrorLog(err));
      }
    };

    vm.uidTranfer = (event, data) => {
      data.uid = vm.UMID;
      data.transactionID = vm.transactionID;
      $scope.$broadcast('updatetransferopenflag', true);
      DialogFactory.dialogService(
        TRANSACTION.UID_TRANSFER_CONTROLLER,
        TRANSACTION.UID_TRANSFER_VIEW,
        event,
        data).then((response) => {
          $scope.$broadcast('updatetransferopenflag', false);
          if (response) {
            if (vm.currentState === vm.TRANSACTION.TRANSACTION_KIT_PREPARATION_STATE) {
              $scope.$broadcast('RefreshUMIDGrid');
            }
          }
        }, (transfer) => {
          $scope.$broadcast('updatetransferopenflag', false);
          if (transfer) {
            if (vm.currentState === vm.TRANSACTION.TRANSACTION_KIT_PREPARATION_STATE) {
              $scope.$broadcast('RefreshUMIDGrid');
            }
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.goToTransferMaterial = () => {
      BaseService.goToTransferMaterial();
    };

    $scope.$on('selectReceivingRow', (event, data) => {
      if (data) {
        vm.selectedRowsItem = data;
        if (vm.selectedRowsItem.length === 0) {
          vm.isDeAllocateDisable = true;
        }
        else {
          vm.isDeAllocateDisable = false;
        }
      }
    });
    vm.deAllocateUMID = () => {
      let allowAccess = false;
      const loginUser = BaseService.loginUser;
      vm.cgBusyLoading = ManufacturerFactory.getAcessLeval().query({ access: CORE.ROLE_ACCESS.VERIFICATION_ROLE_ACCESS }).$promise.then((response) => {
        if (response && response.data) {
          _.each(loginUser.roles, (item) => {
            if (item.accessLevel <= response.data.accessLevel) {
              allowAccess = true;
            }
          });
          if (allowAccess) {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.DEALLOCATE_CONFIRMATION);
            const obj = {
              messageContent: messageContent,
              btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
              canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT,
              multiple: true
            };
            DialogFactory.messageConfirmDialog(obj).then((yes) => {
              if (yes) {
                deAllocateInventory();
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          } else {
            const obj = {
              messageContent: CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.UNAUTHORIZE_USER,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(obj);
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    const deAllocateInventory = () => {
      DialogFactory.dialogService(
        CORE.MANAGE_PASSWORD_POPUP_CONTROLLER,
        CORE.MANAGE_PASSWORD_POPUP_VIEW,
        null, {
        isValidate: true
      }).then((data) => {
        if (data) {
          if (salesOrderDetailId) {
            let umidIds = [];
            umidIds = _.map(vm.selectedRowsItem, 'id');
            const objData = {
              umidID: umidIds,
              fromScreen: CORE.LabelConstant.KitAllocation.KitPreparationTab,
              refSalesOrderDetID: salesOrderDetailId
            };
            vm.cgBusyLoading = KitAllocationFactory.deallocateUMIDFromKit().query(objData).$promise.then((response) => {
              if (response.data) {
                $scope.$broadcast('RefreshUMIDGrid');
              }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }
      }, (err) => BaseService.getErrorLog(err));
    };
    vm.binTransfer = () => {
      DialogFactory.dialogService(
        TRANSACTION.BIN_TRANSFER_POPUP_CONTROLLER,
        TRANSACTION.BIN_TRANSFER_POPUP_VIEW,
        null,
        null).then(() => {
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    const getCompanyInfo = () => CompanyProfileFactory.getCompanyDetail().query().$promise.then((company) => {
      if (company && company.data) {
        vm.companyProfile = angular.copy(company.data);
        vm.companyCode = vm.companyProfile.MfgCodeMst.mfgCode;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    vm.sourceHeader = [
      {
        field: '_lineID',
        header: 'Item(Line#)',
        hidden: true
      },
      {
        field: 'cust_lineID',
        header: 'Cust BOM Line#',
        hidden: true
      },
      {
        field: 'custPN',
        header: 'CPN',
        hidden: true
      },
      {
        field: 'customerRev',
        header: 'CPN Rev',
        hidden: true
      }, {
        field: 'customerDescription',
        header: 'Customer Comment',
        hidden: true
      },
      {
        field: 'qpa',
        header: 'QPA',
        hidden: true
      }, {
        field: 'purchaseQty',
        header: 'Purchase Qty',
        hidden: true
      },
      {
        field: 'dnpQPA',
        header: 'DNP QPA',
        hidden: true
      },
      {
        field: 'refDesig',
        header: vm.CoreLabelConstant.BOM.REF_DES,
        hidden: true
      }, {
        field: 'partTypeName',
        header: 'Functional Type',
        hidden: true
      }, {
        field: 'mountingTypeName',
        header: 'Mounting Type',
        hidden: true
      },
      {
        field: 'uom',
        header: 'UOM',
        hidden: true
      },
      {
        field: 'isInstall',
        header: 'Buy',
        hidden: true
      },
      {
        field: 'isPurchase',
        header: 'Populate',
        hidden: true
      },
      {
        field: 'numOfRows',
        header: 'No. of Rows',
        hidden: true
      },
      {
        field: 'numOfPosition',
        header: 'Pin Per RefDes on PCB',
        hidden: true
      },
      {
        field: 'dnpQty',
        header: 'DNP Qty',
        hidden: true
      },
      {
        field: 'dnpDesig',
        header: vm.CoreLabelConstant.BOM.DNP_REF_DES,
        hidden: true
      },
      {
        field: 'isBuyDNPQty',
        header: 'Buy DNP Qty',
        hidden: true
      },
      {
        field: 'programingStatus',
        header: 'Requires Programming',
        hidden: true
      }, {
        field: 'customerPartDesc',
        header: 'Description',
        hidden: true
      },
      {
        field: 'substitutesAllow',
        header: 'Subs Allowed',
        hidden: true
      }, {
        field: 'kitQty',
        header: 'Kit Qty',
        hidden: true
      }, {
        field: 'poQty',
        header: 'PO Qty',
        hidden: true
      }, {
        field: 'mrpQty',
        header: 'MRP Qty',
        hidden: true
      }, {
        field: 'qpaMultiplier',
        header: 'QPA Multiplier',
        hidden: true
      }, {
        field: 'requiredKitQty',
        header: 'Required Unit as per Kit Qty',
        hidden: true
      }, {
        field: 'requiredMrpQty',
        header: 'Required Unit as per MRP Qty',
        hidden: true
      }, {
        field: 'requirePinsKitQty',
        header: 'Required Pins as per Kit Qty',
        hidden: true
      }, {
        field: 'requirePinsMrpQty',
        header: 'Required Pins as per MRP Qty',
        hidden: true
      }, {
        field: 'allocatedQty',
        header: 'Allocated Qty/ Count',
        hidden: true
      }, {
        field: 'allocatedUnit',
        header: 'Allocated Units',
        hidden: true
      }, {

        field: 'allocatedPins',
        header: 'Allocated Pins',
        hidden: true
      }, {
        field: 'scrapedPins',
        header: 'Scrapped Pins',
        hidden: true
      }, {
        field: 'consumeQty',
        header: 'Consumed Qty/Count',
        hidden: true
      }, {
        field: 'consumeUnits',
        header: 'Consumed Units',
        hidden: true
      }, {
        field: 'shortagePerKitQty',
        header: 'Shortage as per Kit Qty',
        hidden: true
      }, {
        field: 'shortageMrpQty',
        header: 'Shortage as per MRP Qty',
        hidden: true
      }, {
        field: 'availabelStock',
        header: 'Internal Stock',
        hidden: true
      }, {
        field: 'availabelStockCustomerConsign',
        header: 'Customer Stock',
        hidden: true
      }, {
        field: 'customerApprovalComment',
        header: 'Approval Comments',
        hidden: true
      }, {
        field: 'notRequiredKitAllocationReason',
        header: vm.CoreLabelConstant.KitAllocation.NonKittingItemReason,
        hidden: true
      }, {
        field: 'isNotRequiredKitAllocationValue',
        header: vm.CoreLabelConstant.KitAllocation.NonKittingItem,
        hidden: true
      },
      {
        field: 'mfgName',
        header: 'MFR',
        hidden: true
      }, {
        field: 'mfgPN',
        header: 'MFR PN',
        hidden: true
      }, {
        field: 'PIDCode',
        header: 'PID',
        hidden: true
      },
      {
        field: 'productionPN',
        header: 'Production PN',
        hidden: true
      }, {
        field: 'serialNumber',
        header: 'SystemID',
        hidden: true
      },
      {
        field: 'partPackage',
        header: 'Package/Case(Shape) Type',
        hidden: true
      }, {
        field: 'deviceMarking',
        header: 'Device Marking',
        hidden: true
      }];
    getCompanyInfo();

    vm.exportKitList = (ev, format) => {
      let filename;
      if (format === 1) {
        filename = stringFormat(CORE.KitPurchaseDeptExportFormat, vm.salesOrderDetail.SubAssypidCodewithOutSpacialChar ? vm.salesOrderDetail.SubAssypidCodewithOutSpacialChar : vm.salesOrderDetail.AssyIDwithoutSpecialChar, vm.salesOrderDetail.currentInternalVersion, vm.salesOrderDetail.poNumwithoutSpecialChar, vm.salesOrderDetail.poQty, vm.salesOrderDetail.kitNumberwithoutSpecialChar, vm.companyCode, $filter('date')(new Date(), CORE.ExportDateFormat));
      } else if (format === 2) {
        filename = stringFormat(CORE.KitProductionDeptExportFormat, vm.salesOrderDetail.SubAssypidCodewithOutSpacialChar ? vm.salesOrderDetail.SubAssypidCodewithOutSpacialChar : vm.salesOrderDetail.AssyIDwithoutSpecialChar, vm.salesOrderDetail.currentInternalVersion, vm.salesOrderDetail.AssyNamewithoutSpecialChar, vm.companyCode, $filter('date')(new Date(), CORE.ExportDateFormat));
      }
      if (vm.selectedTabIndex === 0) {
        filename = stringFormat('{0}-{1}', CORE.KitAllocationConsolidatedExportName, filename);
      }
      const paramObj = {
        refSalesOrderDetID: salesOrderDetailId,
        partID: vm.partId,
        isConsolidatedTab: vm.selectedTabIndex === 0 ? true : false,
        customerId: vm.salesOrderDetail.customerID,
        data: [],
        header: vm.sourceHeader,
        filename: filename,
        format: format,
        isSubAssemblyTab: vm.selectedTabIndex === 2 ? true : false
      };
      vm.cgBusyLoading = KitAllocationFactory.getKitAllocationExportFile(paramObj).then((response) => {
        if (response.data) {
          exportFileDetail(response, filename);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    //export template details
    function exportFileDetail(res, name) {
      const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
      if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, name);
      } else {
        const link = document.createElement('a');
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', name);
          link.style = 'visibility:hidden';
          document.body.appendChild(link);
          $timeout(() => {
            link.click();
            document.body.removeChild(link);
          });
        }
      }
    };

    $scope.$on('transferMaterial', (event, transactionID) => {
      vm.transactionID = transactionID;
    });

    //close popup on page destroy
    $scope.$on('$destroy', () => {
      $mdDialog.hide(false, { closeAll: true });
    });
  }
})();
