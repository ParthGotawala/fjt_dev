(function () {
  'use strict';

  angular
    .module('app.transaction.purchaseorder')
    .controller('ManagePurchaseOrderMainController', ManagePurchaseOrderMainController);

  /** @ngInject */
  function ManagePurchaseOrderMainController($filter, $state, TRANSACTION, BaseService, CORE, PurchaseOrderFactory, DialogFactory, $scope, $timeout, CONFIGURATION, MasterFactory, PackingSlipFactory, $mdMenu) {
    const vm = this;
    vm.isSaveDisabled = false;
    vm.poId = parseInt($state.params.id) || null;
    vm.purchaseOrderStatus = _.filter(CORE.WoStatus, (item) => item.ID === 0 || item.ID === 1);
    vm.label = CORE.OPSTATUSLABLEPUBLISH;
    vm.documentstate = TRANSACTION.TRANSACTION_PURCHASE_ORDER_DOCUMENT_STATE;
    vm.isHistoryPopupOpen = vm.isPrintDisable = false;
    vm.isDownloadDisabled = false;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.isDisabledCancelPO = false;
    vm.LabelConstant = CORE.LabelConstant;
    vm.isAllowToCancelPO = BaseService.checkFeatureRights(CORE.FEATURE_NAME.AllowToCancelPO);
    vm.cancelPOBtnTooltip = stringFormat('Cancel PO{0}', vm.isAllowToCancelPO ? '' : vm.LabelConstant.ConditionalFeatureEnableToolTip);
    vm.undoPOBtnTooltip = stringFormat('Undo Cancellation{0}', vm.isAllowToCancelPO ? '' : vm.LabelConstant.ConditionalFeatureEnableToolTip);
    vm.PurchaseOrderLockStatus = TRANSACTION.PurchaseOrderLockStatus;
    vm.POWorkingStatusConstant = CORE.PO_Working_Status;
    vm.poHistoryTitle = CORE.PURCHASE_ORDER_CHANGE_HISTORY_POPUP_TITLE;
    vm.termsAndCondition = null;
    active();

    function active() {
      tablist();
      const item = $filter('filter')(vm.tabList, { state: $state.current.name }, true);

      if (item[0]) {
        vm.activeTab = item[0].id;
        vm.title = item[0].title;
      }
      else {
        vm.activeTab = 0;
        vm.title = vm.tabList[0].title;
        $state.go(TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAIL_STATE, { id: vm.poId });
      }
    }
    function tablist() {
      vm.tabList = [
        { id: 0, title: TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAIL_LABEL, state: TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAIL_STATE, src: TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAIL_STATE, viewsrc: 'details', isDisabled: false },
        { id: 1, title: TRANSACTION.TRANSACTION_PURCHASE_ORDER_DOCUMENT_LABEL, state: TRANSACTION.TRANSACTION_PURCHASE_ORDER_DOCUMENT_STATE, src: TRANSACTION.TRANSACTION_PURCHASE_ORDER_DOCUMENT_STATE, viewsrc: 'documents', isDisabled: vm.poId ? false : true },
        { id: 2, title: TRANSACTION.TRANSACTION_PURCHASE_ORDER_MISC_LABEL, state: TRANSACTION.TRANSACTION_PURCHASE_ORDER_MISC_STATE, src: TRANSACTION.TRANSACTION_PURCHASE_ORDER_MISC_STATE, viewsrc: 'misc', isDisabled: vm.poId ? false : true }
      ];
    };

    vm.onTabChanges = (item) => {
      if (item.isDisabled || !vm.checkDisable(item.state)) {
        return;
      }
      BaseService.currentPageForms = [vm.frmPurchaseOrder, vm.PODetForm];
      const Params = { id: vm.poId };
      vm.title = item.title;
      $state.go(item.src, Params);
    };

    //go back to list page
    vm.goBack = () => {
      BaseService.setLatestLoginUserLocalStorageDet();

      if ((vm.frmPurchaseOrder && (vm.frmPurchaseOrder.$dirty && vm.frmPurchaseOrder.$invalid))) {
        vm.isChanged = true;
      }
      if (BaseService.checkFormDirty(vm.frmPurchaseOrder) || vm.isChanged) {
        showWithoutSavingAlertforGoback();
      }
      else {
        $state.go(TRANSACTION.TRANSACTION_PURCHASE_ORDER_STATE);
      }
    };

    vm.openMenu = ($mdMenu, ev) => $mdMenu.open(ev);

    //get purchase order status class
    vm.getPONumberStatusClassName = (statusID) => BaseService.getWoStatusClassName(statusID);
    //get purchase order status
    vm.getPOStatus = (statusID) => BaseService.getWoStatus(statusID);

    //get all purchase order number details
    const getPurchaseOrderNumberDetails = (query) => PurchaseOrderFactory.getPurchaseOrderDetails().query({ poNumber: query }).$promise.then((res) => {
      if (res && res.data) {
        _.each(res.data, (po) =>
          po.autoCompleteList = `${po.poNumber} | ` + (po.soNumber ? `${po.soNumber} | ${po.suppliers.mfgCodeName}` : po.suppliers.mfgCodeName)
        );
        vm.purchaseOrderList = res.data;
        if (!vm.autoCompletePurchaseOrder) { initAutocomplete(); }
        return vm.purchaseOrderList;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    if (vm.activeTab === vm.tabList[0].id) {
      getPurchaseOrderNumberDetails();
    }

    const initAutocomplete = () => {
      vm.autoCompletePurchaseOrder = {
        columnName: 'autoCompleteList',
        keyColumnName: 'id',
        keyColumnId: vm.poId ? vm.poId : null,
        inputName: 'PO#',
        placeholderName: 'PO#',
        isRequired: false,
        isAddnew: false,
        callbackFn: getPurchaseOrderNumberDetails,
        onSelectCallbackFn: selectPurchaseOrder,
        onSearchFn: (query) => getPurchaseOrderNumberDetails(query)
      };
    };
    const selectPurchaseOrder = (item) => {
      if (item) {
        if (item.id !== vm.poId) {
          if ((vm.frmPurchaseOrder && (vm.frmPurchaseOrder.$dirty && vm.frmPurchaseOrder.$invalid))) {
            showWithoutSavingAlertforGoback(item);
          } else {
            vm.poId = item.id;
            $state.go(TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAIL_STATE, { id: item.id }, {}, { reload: true });
          }
        }
        $timeout(() => $scope.$broadcast(vm.autoCompletePurchaseOrder.inputName, null), true);
      }
    };

    /*
    * Author : Champak
    * Purpose :Show save alert popup on go back
    */
    function showWithoutSavingAlertforGoback(item) {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          if (vm.frmPurchaseOrder) {
            vm.frmPurchaseOrder.$setPristine();
          }
          BaseService.currentPageForms = [];
          BaseService.currentPageFlagForm = [];
          if (!item) {
            $state.go(TRANSACTION.TRANSACTION_PURCHASE_ORDER_STATE);
          }
          else {
            vm.poId = item.id;
            $state.go(TRANSACTION.TRANSACTION_PURCHASE_ORDER_DETAIL_STATE, { id: vm.poId }, {}, { reload: true });
          }
        }
      }, () => {
        if (item && vm.poId === 0) { vm.autoCompletePurchaseOrder.keyColumnId = null; }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    /* fun to check form dirty on tab change */
    vm.isStepValid = function () {
      if ((vm.PODetForm && vm.PODetForm.$dirty) || (vm.frmPurchaseOrder && vm.frmPurchaseOrder.$dirty)) {
        return showWithoutSavingAlertforTabChange();
      } else {
        return true;
      }
    };

    /* Show save alert popup when performing tab change*/
    function showWithoutSavingAlertforTabChange() {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      return DialogFactory.messageConfirmDialog(obj).then(() => {
        if (vm.frmPurchaseOrder) {
          vm.frmPurchaseOrder.$setPristine();
        }
        if (vm.PODetForm) {
          vm.PODetForm.$setPristine();
        }
        return true;
      }, () => 1).catch((error) => BaseService.getErrorLog(error));
    }

    //print purchase order report
    vm.printRecord = (isDownload) => {
      if (vm.frmPurchaseOrder.$dirty || vm.PODetForm.$dirty) {
        return;
      }

      if (isDownload) {
        vm.isDownloadDisabled = true;
      } else {
        vm.isPrintDisable = true;
      }

      if (vm.termsAndCondition) {
        vm.printReport(isDownload);
      } else {
        // Get Term and Condition from Data key
        MasterFactory.getSelectedGlobalSettingKeyValues().query({ allKeys: CONFIGURATION.SETTING.TermsAndCondition }).$promise.then((dataKeyResponse) => {
          if (dataKeyResponse && dataKeyResponse.data && dataKeyResponse.data.length > 0) {
            vm.termsAndCondition = dataKeyResponse.data[0].values;
            vm.printReport(isDownload);
          } else {
            if (isDownload) {
              vm.isDownloadDisabled = false;
            } else {
              vm.isPrintDisable = false;
            }
          }
        }).catch((error) => {
          if (isDownload) {
            vm.isDownloadDisabled = false;
          } else {
            vm.isPrintDisable = false;
          }
          BaseService.getErrorLog(error);
        });
      }
    };

    vm.printReport = (isDownload) => {
      PurchaseOrderFactory.getPurchaseOrderReport({
        id: vm.poId,
        termsAndCondition: vm.termsAndCondition,
        POData: {
          poNumber: vm.poNumber,
          poRevision: vm.poRevision,
          mfgName: vm.mfgName,
          statusName: parseInt(vm.status) === CORE.DisplayStatus.Draft.ID ? `-${vm.getPOStatus(vm.status).toUpperCase()}` : ''
        }
      }).then((response) => {
        const POData = response.config.data.POData;
        if (isDownload) {
          vm.isDownloadDisabled = false;
        } else {
          vm.isPrintDisable = false;
        }
        BaseService.downloadReport(response, stringFormat('{0}-{1}-{2}-{3}{4}', CORE.REPORT_SUFFIX.PURCHASE_ORDER, POData.poNumber, POData.poRevision, POData.mfgName, POData.statusName), isDownload, true);
      }).catch((error) => {
        if (isDownload) {
          vm.isDownloadDisabled = false;
        } else {
          vm.isPrintDisable = false;
        }
        BaseService.getErrorLog(error);
      });
    };

    //check disable
    vm.checkDisable = (state) => {
      if (BaseService.loginUserPageList && BaseService.loginUserPageList.length > 0) {
        const tab = _.filter(BaseService.loginUserPageList, (a) => a.PageDetails && a.PageDetails.pageRoute === state);
        if (tab && tab.length > 0 && tab[0].isActive) {
          return true;
        } else { return false; }
      } else { return true; }
    };

    const bindAutoComplete = $scope.$on('PurchaseOrderAutocomplete', () => {
      getPurchaseOrderNumberDetails();
    });
    const checkPackingSlipExists = $scope.$on('isPackingSlipExists', () => vm.isDisabledCancelPO = true);

    $scope.$on('$destroy', () => {
      bindAutoComplete();
      bindDocuments();
      checkPackingSlipExists();
    });
    //on for document
    const bindDocuments = $scope.$on('documentCount', () => {
      getPurchaseOrderDocumentCount();
    });
    const getPurchaseOrderDocumentCount = () => {
      if (vm.poId) {
        vm.cgBusyLoading = PackingSlipFactory.getPackingSlipDocumentCount().query({
          id: vm.poId,
          type: CORE.AllEntityIDS.Purchase_Order.Name
        }).$promise.then((response) => {
          vm.documentCount = response.data;
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        vm.documentCount = 0;
      }
    };
    getPurchaseOrderDocumentCount();

    // open popup for duplicate purchase order
    vm.createDuplicatePO = (event) => {
      if (vm.frmPurchaseOrder.$dirty || vm.PODetForm.$dirty || vm.isReadOnly) {
        return;
      }

      vm.isDuplicatePObtnDisabled = true;
      vm.checkPartStatusOfPurchaseOrder().then((response) => {
        if (response && response.mfgParts && response.mfgParts.partStatus === CORE.PartStatusList.InActiveInternal) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PO_CONTAINST_INACTIVE_PART);
          messageContent.message = stringFormat(messageContent.message, vm.redirectToPOAnchorTag(vm.poId, vm.poNumber));
          const obj = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          DialogFactory.messageConfirmDialog(obj).then((yes) => {
            if (yes) {
              vm.openDuplicatePOpopup(event, true);
            }
          }, () => vm.isDuplicatePObtnDisabled = false)
            .catch((error) => BaseService.getErrorLog(error));
        } else {
          vm.openDuplicatePOpopup(event);
        }
      });
    };

    vm.isCancleReason = ($event) => {
      if (!vm.isAllowToCancelPO || vm.isReadOnly) {
        return;
      }

      if (vm.status === vm.purchaseOrderStatus[1].ID) {
        vm.getPurchaseOrderMstDetailByID(vm.poId).then((response) => {
          if (response) {
            if (vm.poWorkingStatus === vm.POWorkingStatusConstant.InProgress.id) {
              //for cancellation process

              if (vm.isDisabledCancelPO) {
                return;
              }

              if (response.poWorkingStatus === vm.POWorkingStatusConstant.Canceled.id) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PO_IS_ALREADY_CANCELED);
                messageContent.message = stringFormat(messageContent.message, vm.redirectToPOAnchorTag(vm.poId, vm.poNumber), '');
                const model = {
                  messageContent: messageContent,
                  multiple: false
                };
                return DialogFactory.messageAlertDialog(model).then(() => vm.updatePurchaseOrderDetails()).catch((error) => BaseService.getErrorLog(error));
              } else {
                vm.checkPurchaseOrderMFR().then((isPackingSlipCreated) => {
                  if (!isPackingSlipCreated) {
                    const data = {
                      isPurchaseOrder: true,
                      type: 'C' //for cancellation po
                    };
                    openCancellationReasonPopup(data, $event);
                  }
                });
              }
            }
            if (vm.poWorkingStatus === vm.POWorkingStatusConstant.Canceled.id) {
              //for Undo process
              if (response.poWorkingStatus === vm.POWorkingStatusConstant.InProgress.id) {
                const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PO_ALREADY_REVERTED);
                messageContent.message = stringFormat(messageContent.message, vm.redirectToPOAnchorTag(vm.poId, vm.poNumber), '');
                const model = {
                  messageContent: messageContent,
                  multiple: false
                };
                return DialogFactory.messageAlertDialog(model).then(() => vm.updatePurchaseOrderDetails()).catch((error) => BaseService.getErrorLog(error));
              } else {
                if (!vm.CancellationConfirmed) {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.UNDO_CANCELLATION_CONFIRMATION);
                  messageContent.message = stringFormat(messageContent.message, vm.redirectToPOAnchorTag(vm.poId, vm.poNumber));
                  const obj = {
                    messageContent: messageContent,
                    btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                    canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                  };
                  DialogFactory.messageConfirmDialog(obj).then((yes) => {
                    if (yes) {
                      const data = {
                        title: vm.LabelConstant.PURCHASE_ORDER.POUndoReason,
                        isPurchaseOrder: true,
                        type: 'R' //for Undo cancellation po
                      };
                      openCancellationReasonPopup(data, $event);
                    }
                  }, () => {
                  }).catch((error) => BaseService.getErrorLog(error));
                } else {
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.UNCHECK_CANCELLATION_CONFIRMED_BY_SUPPLIER);
                  const model = {
                    messageContent: messageContent,
                    multiple: false
                  };
                  return DialogFactory.messageAlertDialog(model).then(() => {
                  }).catch((error) => BaseService.getErrorLog(error));
                }
              }
            }
          }
        });
      } else {
        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.CHANGE_PO_PUBLISHED_FOR_CANCEL_PO);
        messageContent.message = stringFormat(messageContent.message, vm.redirectToPOAnchorTag(vm.poId, vm.poNumber));
        const model = {
          messageContent: messageContent,
          multiple: false
        };
        return DialogFactory.messageAlertDialog(model).then(() => {
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    const openCancellationReasonPopup = (data, $event) => {
      data.poNumber = vm.poNumber;
      data.poID = vm.poId;
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_CANCLE_REASON_CONTROLLER,
        TRANSACTION.TRANSACTION_CANCLE_REASON_VIEW,
        $event,
        data).then((response) => {
          if (response) {
            const formField = {
              id: vm.poId,
              cancleReason: response.cancleReason,
              poCompleteType: CORE.POCompleteType.MANUAL,
              type: response.type,
              CancellationConfirmed: response.CancellationConfirmed
            };
            vm.cgBusyLoading = PurchaseOrderFactory.updatePurchaseOrderStatus().query(formField).$promise.then((res) => {
              if (res && res.data) { vm.updatePurchaseOrderDetails(); }
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }, () => {
        }, (error) => BaseService.getErrorLog(error));
    };

    vm.openDuplicatePOpopup = (event, IsUserAwareOfPartStatus) => {
      const data = {
        purchaseID: vm.poId,
        status: vm.status ? CORE.PO_WORKING_STATUS.PUBLISH : CORE.PO_WORKING_STATUS.DRAFT,
        IsUserAwareOfPartStatus: IsUserAwareOfPartStatus,
        poNumber: vm.poNumber
      };
      DialogFactory.dialogService(
        TRANSACTION.DUPLICATE_PO_POPUP_CONTROLLER,
        TRANSACTION.DUPLICATE_PO_POPUP_VIEW,
        event,
        data).then(() => {
        }, (res) => {
          vm.isDuplicatePObtnDisabled = false;
          if (res) {
            vm.poId = res.id;
            vm.isDisabledCancelPO = false;
            vm.goToPurchaseOrderDetail(vm.poId);
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.openPurchaseOrderHistory = (ev) => {
      vm.isHistoryPopupOpen = true;
      const data = {
        purchaseOrderID: vm.poId,
        poNumber: vm.poNumber,
        poRevision: vm.poRevision,
        supplier: vm.supplierName,
        supplierID: vm.mfgCodeID
      };
      DialogFactory.dialogService(
        CORE.PURCHASE_ORDER_CHANGE_HISTORY_CONTROLLER,
        CORE.PURCHASE_ORDER_CHANGE_HISTORY_POPUP_VIEW,
        ev,
        data).then(() => vm.isHistoryPopupOpen = false, () => vm.isHistoryPopupOpen = false);
    };

    // get purchase order details
    vm.getPurchaseOrderMstDetailByID = (id) => PurchaseOrderFactory.getPurchaseOrderMstDetailByID().query({ id: id }).$promise.then((res) => {
      if (res && res.data && res.data[0]) {
        return res.data[0];
      }
    }).catch((error) => BaseService.getErrorLog(error));

    // delete purchase order
    vm.deleteRecord = () => {
      vm.isDisabledDelete = true;
      if (vm.isReadOnly) {
        return;
      }
      $mdMenu.hide();
      const selectedIDs = [vm.poId];
      vm.cgBusyLoading = PurchaseOrderFactory.checkPOConsistLine().query({
        ids: selectedIDs
      }).$promise.then((poLinesResponse) => {
        if (poLinesResponse && poLinesResponse.status === CORE.ApiResponseTypeStatus.SUCCESS) {
          if (poLinesResponse.data && poLinesResponse.data.length > 0) {
            vm.isDisabledDelete = false;
            const messageContent = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_ALLOWED_TO_DELETE_PO_WITH_LINES;
            return DialogFactory.messageAlertDialog({ messageContent });
          } else {
            vm.cgBusyLoading = PurchaseOrderFactory.checkPOWorkingStatus().query({
              ids: selectedIDs
            }).$promise.then((publishedPOResponse) => {
              if (publishedPOResponse && publishedPOResponse.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                if (publishedPOResponse.data && publishedPOResponse.data.length > 0) {
                    vm.isDisabledDelete = false;
                  const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_ALLOWED_TO_DELETE_PUBLISHED_PO);
                  return DialogFactory.messageAlertDialog({ messageContent });
                } else {
                  vm.cgBusyLoading = PurchaseOrderFactory.checkPOLineIsClosed().query({
                    refPurchaseOrderID: selectedIDs
                  }).$promise.then((closedPOLineResponse) => {
                    if (closedPOLineResponse && closedPOLineResponse.status === CORE.ApiResponseTypeStatus.SUCCESS) {
                      if (closedPOLineResponse.data) {
                          vm.isDisabledDelete = false;
                        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.NOT_ALLOWED_TO_DELETE_CLOSED_PO);
                        DialogFactory.messageAlertDialog({ messageContent });
                      } else {
                        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
                        messageContent.message = stringFormat(messageContent.message, 'Purchase Order', selectedIDs.length);
                        const obj = {
                          messageContent: messageContent,
                          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
                          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
                        };
                        const objIDs = {
                          id: selectedIDs,
                          CountList: false
                        };
                        DialogFactory.messageConfirmDialog(obj).then(() => {
                            vm.cgBusyLoading = PurchaseOrderFactory.removePurchaseOrder().query({
                              objIDs
                            }).$promise.then((response) => {
                                vm.isDisabledDelete = false;
                              if (response && response.data && (response.data.length > 0 || response.data.transactionDetails)) {
                                const data = {
                                  TotalCount: response.data.transactionDetails[0].TotalCount,
                                  pageName: vm.currentPageName
                                };
                                BaseService.deleteAlertMessageWithHistory(data, (ev) => {
                                  const IDs = {
                                    id: selectedIDs,
                                    CountList: true
                                  };
                                  return PurchaseOrderFactory.removePurchaseOrder().query({
                                    objIDs: IDs
                                  }).$promise.then((res) => {
                                    let data = {};
                                    data = res.data;
                                    data.pageTitle = purchaseOrder ? purchaseOrder.poNumber : null;
                                    data.PageName = vm.currentPageName;
                                    data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' Selected');
                                    if (res.data) {
                                      DialogFactory.dialogService(
                                        USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                                        USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                                        ev,
                                        data).then(() => { }, () => { });
                                    }
                                  }).catch((error) => BaseService.getErrorLog(error));
                                });
                              } else {
                                $state.go(TRANSACTION.TRANSACTION_PURCHASE_ORDER_STATE);
                              }
                            }).catch((error) => {
                                vm.isDisabledDelete = false;
                              BaseService.getErrorLog(error);
                            });
                        }, () => vm.isDisabledDelete = false);
                      }
                    } else {
                        vm.isDisabledDelete = false;
                    }
                  }).catch((error) => {
                      vm.isDisabledDelete = false;
                    BaseService.getErrorLog(error);
                  });
                }
              } else {
                  vm.isDisabledDelete = false;
              }
            }).catch((error) => {
                vm.isDisabledDelete = false;
              BaseService.getErrorLog(error);
            });
          }
        } else {
            vm.isDisabledDelete = false;
        }
      }).catch((error) => {
        vm.isDisabledDelete = false;
        BaseService.getErrorLog(error);
      });
    };

    // go to supplier detail list
    vm.goToSupplierDetail = () => BaseService.goToSupplierDetail(vm.mfgCodeID);
    vm.goToPurchaseOrderDetail = (id, openInSameTab) => {
      if (vm.isReadOnly) {
        return;
      }
      return BaseService.goToPurchaseOrderDetail(id, { openInSameTab });
    };
  }
})();
