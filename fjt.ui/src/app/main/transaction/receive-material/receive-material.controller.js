
(function () {
  'use strict';

  angular
    .module('app.transaction.receivingmaterial')
    .controller('ReceiveMaterialListController', ReceiveMaterialListController);

  /** @ngInject */
  function ReceiveMaterialListController($rootScope, $scope, $state, $stateParams, DialogFactory, BaseService, PRICING, USER, LabelTemplatesFactory, CORE, $timeout, TRANSACTION, socketConnectionService, WarehouseBinFactory, ReceivingMaterialFactory) {
    const vm = this;
    vm.CORE = CORE;
    vm.TRANSACTION = TRANSACTION;
    vm.LabelConstant = CORE.LabelConstant;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.umidId = $stateParams.id;
    vm.loginUser = BaseService.loginUser;
    vm.ReceivingMatirialTab = CORE.ReceivingMatirialTab;
    vm.selectedRowsItem = [];
    vm.isReserveStockDisable = true;
    vm.checkScanLabel = false;
    vm.isEdit = false;
    vm.isExpire = false;
    vm.checkForm;
    vm.selectUid;
    vm.isUMIDDataCount = 0;
    vm.documentCount = 0;
    vm.documentCofCCount = 0;
    vm.refUMIDId = null;
    vm.isReservedStock = false;
    vm.customerConsign = false;
    vm.isListScreen = false;
    vm.isReadOnly = false;
    vm.nonUMIDCount = 0;
    vm.currentWarehouseType = null;
    vm.currentDepartmentName = null;
    vm.warehouseType = TRANSACTION.warehouseType;
    vm.innoAutoLightStatus = {};
    vm.currentState = $state.current.name;
    const CategoryTypeObjList = angular.copy(CORE.CategoryType);
    const PrinterStorageValue = getLocalStorageValue('Printer');
    const PrintFormateStorageValue = getLocalStorageValue('PrintFormateOfUMID');
    const UIDVerificationDet = localStorage.getItem('UnlockVerificationDetail');
    let reTryCount = 0;

    switch (vm.currentState) {
      case TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_LIST_STATE:
        vm.selectedNavItem = vm.ReceivingMatirialTab.List.Name;
        break;
      case TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_STATE:
        break;
    }

    if (vm.currentState === TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_LIST_STATE ||
      vm.currentState === TRANSACTION.TRANSACTION_NONUMIDSTOCK_STATE ||
      vm.currentState === TRANSACTION.TRANSACTION_COUNTAPPROVAL_STATE ||
      (!vm.umidId && vm.currentState === TRANSACTION.TRANSACTION_VERIFICATIONHISTORY_STATE)) {
      vm.isListScreen = true;
      vm.tabList = [
        { name: vm.ReceivingMatirialTab.List.Name, tab_id: vm.ReceivingMatirialTab.List.id, title: vm.ReceivingMatirialTab.List.title, src: TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_LIST_STATE, isDisabled: vm.ReceivingMatirialTab.List.IsDisable, displayOrder: vm.ReceivingMatirialTab.List.DisplayOrder },
        { name: vm.ReceivingMatirialTab.VerificationHistory.Name, tab_id: vm.ReceivingMatirialTab.VerificationHistory.id, title: vm.ReceivingMatirialTab.VerificationHistory.title, src: TRANSACTION.TRANSACTION_VERIFICATIONHISTORY_STATE, isDisabled: vm.ReceivingMatirialTab.VerificationHistory.IsDisable, displayOrder: vm.ReceivingMatirialTab.VerificationHistory.DisplayOrder },
        { name: vm.ReceivingMatirialTab.NonUMIDStockList.Name, tab_id: vm.ReceivingMatirialTab.NonUMIDStockList.id, title: vm.ReceivingMatirialTab.NonUMIDStockList.title, src: TRANSACTION.TRANSACTION_NONUMIDSTOCK_STATE, isDisabled: vm.ReceivingMatirialTab.NonUMIDStockList.IsDisable, displayOrder: vm.ReceivingMatirialTab.NonUMIDStockList.DisplayOrder },
        { name: vm.ReceivingMatirialTab.CountApprovalHistoryList.Name, tab_id: vm.ReceivingMatirialTab.CountApprovalHistoryList.id, title: vm.ReceivingMatirialTab.CountApprovalHistoryList.title, src: TRANSACTION.TRANSACTION_COUNTAPPROVAL_STATE, isDisabled: vm.ReceivingMatirialTab.CountApprovalHistoryList.IsDisable, displayOrder: vm.ReceivingMatirialTab.CountApprovalHistoryList.DisplayOrder }
      ];
    } else if (vm.currentState === TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_STATE ||
      (vm.umidId && vm.currentState === TRANSACTION.TRANSACTION_VERIFICATIONHISTORY_STATE) ||
      vm.currentState === TRANSACTION.TRANSACTION_UMID_DOCUMENT_STATE ||
      vm.currentState === TRANSACTION.TRANSACTION_COFC_DOCUMENT_STATE ||
      vm.currentState === TRANSACTION.TRANSACTION_SPLIT_UID_STATE ||
      vm.currentState === TRANSACTION.TRANSACTION_PARENT_UMID_DOCUMENT_STATE) {
      vm.isListScreen = false;
      vm.tabList = [
        { name: vm.ReceivingMatirialTab.UIDManagement.Name, tab_id: vm.ReceivingMatirialTab.UIDManagement.id, title: vm.ReceivingMatirialTab.UIDManagement.title, src: TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_STATE, isDisabled: vm.ReceivingMatirialTab.UIDManagement.IsDisable, displayOrder: vm.ReceivingMatirialTab.UIDManagement.DisplayOrder },
        { name: vm.ReceivingMatirialTab.UMIDDocument.Name, tab_id: vm.ReceivingMatirialTab.UMIDDocument.id, title: vm.ReceivingMatirialTab.UMIDDocument.title, src: TRANSACTION.TRANSACTION_UMID_DOCUMENT_STATE, isDisabled: vm.umidId ? false : true, displayOrder: vm.ReceivingMatirialTab.UMIDDocument.DisplayOrder },
        { name: vm.ReceivingMatirialTab.COFCDocument.Name, tab_id: vm.ReceivingMatirialTab.COFCDocument.id, title: vm.ReceivingMatirialTab.COFCDocument.title, src: TRANSACTION.TRANSACTION_COFC_DOCUMENT_STATE, isDisabled: vm.umidId ? false : true, displayOrder: vm.ReceivingMatirialTab.COFCDocument.DisplayOrder },
        { name: vm.ReceivingMatirialTab.VerificationHistory.Name, tab_id: vm.ReceivingMatirialTab.VerificationHistory.id, title: vm.ReceivingMatirialTab.VerificationHistory.title, src: TRANSACTION.TRANSACTION_VERIFICATIONHISTORY_STATE, isDisabled: vm.umidId || vm.refUMIDId ? false : true, displayOrder: vm.ReceivingMatirialTab.VerificationHistory.DisplayOrder },
        { name: vm.ReceivingMatirialTab.SplitUMIDList.Name, tab_id: vm.ReceivingMatirialTab.SplitUMIDList.id, title: vm.ReceivingMatirialTab.SplitUMIDList.title, src: TRANSACTION.TRANSACTION_SPLIT_UID_STATE, isDisabled: vm.umidId || vm.refUMIDId ? false : true, displayOrder: vm.ReceivingMatirialTab.SplitUMIDList.DisplayOrder }
      ];
    }

    vm.tabList = _.orderBy(vm.tabList, ['displayOrder'], ['asc']);

    //get printer format and printer detail
    const getAutoCompleteData = () => {
      LabelTemplatesFactory.getPrinterAndLabelTemplateData().query().$promise.then((autoCompleteData) => {
        vm.PrinterList = autoCompleteData.data.printer;
        vm.LabelTemplateList = autoCompleteData.data.labeltemplate;
        InitAutoComplete();
        if (PrinterStorageValue && PrinterStorageValue.Printer) {
          vm.autoCompletePrinter.keyColumnId = PrinterStorageValue.Printer.gencCategoryID;
        }
        if (PrintFormateStorageValue && PrintFormateStorageValue.PrintFormate) {
          vm.autoCompleteLabelTemplate.keyColumnId = PrintFormateStorageValue.PrintFormate.id;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };
    // init auto complete
    const InitAutoComplete = () => {
      vm.autoCompletePrinter = {
        columnName: 'gencCategoryName',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'gencCategoryID',
        keyColumnId: vm.loginUser ? vm.loginUser.printerID : null,
        inputName: CategoryTypeObjList.Printer.Name,
        placeholderName: CategoryTypeObjList.Printer.Title,
        addData: {
          headerTitle: CORE.CategoryType.Printer.Title,
          popupAccessRoutingState: [USER.ADMIN_PRINTER_TYPE_MANAGEGENERICCATEGORY_STATE],
          pageNameAccessLabel: CORE.PageName.printer
        },
        isRequired: false,
        isAddnew: true,
        callbackFn: getAutoCompleteData,
        onSelectCallbackFn: selectPrinter
      };
      vm.autoCompleteLabelTemplate = {
        columnName: 'Name',
        controllerName: USER.ADMIN_GENERIC_CATEGORY_MODAL_CONTROLLER,
        viewTemplateURL: USER.ADMIN_GENERIC_CATEGORY_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: vm.LabelConstant.LabelTemplate.Name,
        placeholderName: vm.LabelConstant.LabelTemplate.Title,
        isRequired: false,
        isAddnew: false,
        callbackFn: getAutoCompleteData,
        onSelectCallbackFn: selectPrintFormate
      };
    };
    // getAllGenericCategoryByCategoryType();
    getAutoCompleteData();


    //show color legend on click of pallet icon
    vm.showColorLengend = (ev) => {
      const data = {
        pageName: CORE.LabelConstant.UMIDManagement.ListPageName,
        legendList: CORE.LegendList.UMIDList,
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

    if (!vm.isListScreen && vm.currentState !== TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_STATE) {
      vm.cgBusyLoading = ReceivingMaterialFactory.getUMIDByID().query({ id: vm.umidId }).$promise.then((receivingmaterialdetail) => {
        if (receivingmaterialdetail.data) {
          const component = receivingmaterialdetail.data.component;
          component.uid = receivingmaterialdetail.data.uid;
          vm.initLabel(component);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    vm.initLabel = (data) => {
      if (data) {
        vm.uidCode = data.uid;
        vm.component = data;
        vm.pid = data.PIDCode;
        vm.mfgpn = data.mfgPN;
        vm.isCustom = data.isCustom;
        vm.mfgId = data.id ? data.id : data.refcompid;
        if (data.mfgCodemst) {
          vm.mfgName = data.mfgCodemst.mfgName;
          vm.mfgCode = data.mfgCodemst.mfgCode;
          vm.mfg = BaseService.getMfgCodeNameFormat(vm.mfgCode, vm.mfgName);
          vm.mfgCodeId = data.mfgCodemst.id;
        }
        if (data.rfq_rohsmst) {
          vm.rohsIcon = stringFormat(CORE.RoHSImageFormat, _configWebUrl, USER.ROHS_BASE_PATH, data.rfq_rohsmst.rohsIcon);
          vm.rohsName = data.rfq_rohsmst.name;
        } else if (data.rohsIcon && data.rohsName) {
          vm.rohsIcon = stringFormat(CORE.RoHSImageFormat, _configWebUrl, USER.ROHS_BASE_PATH, data.rohsIcon);
          vm.rohsName = data.rohsName;
        } else {
          vm.rohsIcon = null;
          vm.rohsName = null;
        }
      }
    };

    function setTabWisePageRights(pageList) {
      if (pageList && pageList.length > 0) {
        const tab = pageList.find((a) => a.PageDetails && a.PageDetails.pageRoute === TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_STATE);
        if (tab) {
          vm.isReadOnly = tab.RO ? true : false;
        }
      }
    }

    $timeout(() => {
      $scope.$on(USER.LoginUserPageListBroadcast, (event, data) => {
        var menudata = data;
        setTabWisePageRights(menudata);
        $scope.$applyAsync();
      });
    });

    if (BaseService.loginUserPageList && BaseService.loginUserPageList.length > 0) {
      setTabWisePageRights(BaseService.loginUserPageList);
    }

    $scope.$on('sendComponent', (event, data) => {
      if (data) {
        vm.initLabel(data);
      } else {
        vm.component = null;
      }
    });

    vm.checkSaveChanges = (item) => {
      vm.isReserveStockDisable = true;
      if (vm.checkForm && vm.checkForm.$dirty && (item !== TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_STATE && $state.current.name === TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_STATE)) {
        return showWithoutSavingAlertTab(item);
      } else {
        vm.rohsName = null;
        if (item === TRANSACTION.TRANSACTION_VERIFICATIONHISTORY_STATE ||
          item === TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_STATE ||
          item === TRANSACTION.TRANSACTION_UMID_DOCUMENT_STATE ||
          item === TRANSACTION.TRANSACTION_COFC_DOCUMENT_STATE ||
          item === TRANSACTION.TRANSACTION_PARENT_UMID_DOCUMENT_STATE ||
          item === TRANSACTION.TRANSACTION_SPLIT_UID_STATE) {
          $state.go(item, { id: vm.umidId });
        } else {
          $state.go(item);
        }
      }
    };

    vm.goBack = () => {
      vm.checkSaveChanges(TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_LIST_STATE);
    };

    // Function of confirmation alert of change tab
    const showWithoutSavingAlertTab = (item) => {
      const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_ALERT_BODY_MESSAGE);
      const obj = {
        messageContent: messageContent,
        btnText: CORE.MESSAGE_CONSTANT.LEAVE_ON_BUTTON,
        canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
      };
      return DialogFactory.messageConfirmDialog(obj).then((yes) => {
        if (yes) {
          vm.rohsName = null;
          vm.checkForm.$dirty = false;
          if (item === TRANSACTION.TRANSACTION_VERIFICATIONHISTORY_STATE ||
            item === TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_STATE ||
            item === TRANSACTION.TRANSACTION_UMID_DOCUMENT_STATE ||
            item === TRANSACTION.TRANSACTION_PARENT_UMID_DOCUMENT_STATE ||
            item === TRANSACTION.TRANSACTION_COFC_DOCUMENT_STATE ||
            item === TRANSACTION.TRANSACTION_SPLIT_UID_STATE) {
            $state.go(item, { id: vm.umidId });
          } else {
            $state.go(item);
          }
        }
      }, () => {
        if ($state.current.name === TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_STATE) {
          vm.selectedNavItem = CORE.ReceivingMatirialTab.UIDManagement.Name;
        }
      }, (err) => BaseService.getErrorLog(err));
    };


    if (UIDVerificationDet) {
      vm.UIDVerificationDet = JSON.parse(UIDVerificationDet);
      if (_.isEmpty(vm.UIDVerificationDet)) {
        vm.UIDVerificationDet = null;
        localStorage.removeItem('UnlockVerificationDetail');
      } else {
        DialogFactory.dialogService(
          CORE.UID_VERIFICATION_FAILED_MODAL_CONTROLLER,
          CORE.UID_VERIFICATION_FAILED_MODAL_VIEW,
          event,
          vm.UIDVerificationDet).then((verificationDet) => {
            if (verificationDet) {
              vm.UIDVerificationDet = null;
              localStorage.removeItem('UnlockVerificationDetail');
            }
          }, (err) => BaseService.getErrorLog(err));
      }
    }

    const updateLabelTemplate = (item) => {
      if (item) {
        const templateObj = _.find(CORE.LABELTEMPLATE_DEFAULTLABELTYPE, { name: 'UMID' });
        const updateLabelObject = {
          id: item.id,
          Name: item.Name,
          defaultLabelTemplate: templateObj && templateObj.ID ? templateObj.ID : null,
          isActive: item.isActive,
          isVerified: item.isVerified,
          isListPage: false,
          notShowNotifyMessage: true
        };

        LabelTemplatesFactory.updateLabelTemplate().query({
          listObj: updateLabelObject
        }).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            BaseService.setPrintStorage('PrintFormateOfUMID', updateLabelObject);
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    const selectPrinter = (item) => {
      if (item && item.gencCategoryName) {
        BaseService.setPrintStorage('Printer', item);
      }
    };

    const selectPrintFormate = (item) => {
      if (item && item.Name) {
        updateLabelTemplate(item);
      }
    };


    $scope.$on('changePrinter', (event, data) => {
      if (data) {
        vm.autoCompletePrinter.keyColumnId = data.gencCategoryID;
      } else {
        vm.autoCompletePrinter.keyColumnId = null;
      }
    });

    $scope.$on('changePrinterFormateOfUMID', (event, data) => {
      if (data) {
        vm.autoCompleteLabelTemplate.keyColumnId = data.id;
      } else {
        vm.autoCompleteLabelTemplate.keyColumnId = null;
      }
    });

    $scope.$on('selectReceivingRow', (event, data) => {
      if (data) {
        vm.selectedRowsItem = data;
        if (vm.selectedRowsItem.length === 0) { vm.isReserveStockDisable = true; } else { vm.isReserveStockDisable = false; }
      }
    });

    $scope.$on('UMIDCount', (event, data) => {
      if (data || data === 0) {
        vm.isUMIDDataCount = data;
      }
    });

    // verify UMID and scan label
    vm.verifyBarcodeLabel = (event, data) => {
      DialogFactory.dialogService(
        CORE.CAMERA_ZOOM_INOUT_MODAL_CONTROLLER,
        CORE.CAMERA_ZOOM_INOUT_MODAL_VIEW,
        event,
        data).then(() => {
        }, () => {
          if (vm.currentState === TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_STATE) {
            vm.getUmidTabCount();
            setFocus('btnFooterAddUMID');
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    const getNonUMIDCount = () => ReceivingMaterialFactory.getNonUMIDCount().query().$promise.then((response) => {
      if (response && response.data && response.data[0] && response.data[0].CountNonUMID) {
        vm.nonUMIDCount = response.data[0].CountNonUMID;
      }
    }).catch((error) => BaseService.getErrorLog(error));

    if (vm.isListScreen) {
      getNonUMIDCount();
    }

    const selectUID = (item) => {
      if (item) {
        $state.go(TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_STATE, { id: item.id });
      }
      vm.searchUMID = null;
    };

    vm.scanUMID = (e) => {
      $timeout(() => {
        scanUMID(e);
      }, true);
      /** Prevent enter key submit event */
      preventInputEnterKeyEvent(e);
    };

    function scanUMID(e) {
      // if ((e.keyCode === 48 && !form.$touched) || (e.keyCode === 13)) {
      if ((e.keyCode === 13)) {
        if (!vm.searchUMID) {
          return;
        }
        getUMIDDetailByUMID();
      }
    }

    const getUMIDDetailByUMID = () => {
      if (vm.searchUMID) {
        vm.cgBusyLoading = ReceivingMaterialFactory.getUMIDDetailByUMID().query({ UMID: vm.searchUMID }).$promise.then((response) => {
          if (response && response.data) {
            selectUID(response.data);
          } else {
            const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.SCAN_UID_NOT_FOUND);
            messageContent.message = stringFormat(messageContent.message, vm.searchUMID);
            const model = {
              messageContent: messageContent,
              multiple: true
            };
            return DialogFactory.messageAlertDialog(model).then((yes) => {
              if (yes) {
                vm.searchUMID = null;
                setFocus('searchScanUMID');
              }
            }, () => {
            }).catch((error) => BaseService.getErrorLog(error));
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.getUmidTabCount = () => {
      if (vm.umidId) {
        vm.cgBusyLoading = ReceivingMaterialFactory.getUmidTabCount().query({ id: vm.umidId }).$promise.then((response) => {
          vm.documentCount = response.data.documentCount || 0;
          vm.documentCofCCount = response.data.documentCofCCount || 0;
          vm.parentDocumentCount = response.data.parentDocumentCount || 0;
          vm.splitUIDCount = response.data.splitUIDCount || 0;
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    vm.getUMIDDetailsById = () => {
      if (vm.umidId) {
        vm.cgBusyLoading = ReceivingMaterialFactory.getUMIDDetailsById().query({ id: vm.umidId, uid: null }).$promise.then((response) => {
          if (response && response.data && response.data.umidDetail) {
            vm.fromUIDId = response.data.umidDetail.fromUIDId;
            vm.fromUID = response.data.umidDetail.fromUID;
            vm.parentUIDId = response.data.umidDetail.parentUIDId;
            vm.parentUID = response.data.umidDetail.parentUID;
            if (vm.parentUIDId) {
              vm.isSplitUID = true;

              vm.tabList.push({ name: vm.ReceivingMatirialTab.ParentUMIDDocument.Name, tab_id: vm.ReceivingMatirialTab.ParentUMIDDocument.id, title: vm.ReceivingMatirialTab.ParentUMIDDocument.title, src: TRANSACTION.TRANSACTION_PARENT_UMID_DOCUMENT_STATE, isDisabled: vm.parentUIDId ? false : true, displayOrder: vm.ReceivingMatirialTab.ParentUMIDDocument.DisplayOrder });
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    if (vm.umidId && !vm.isListScreen) {
      vm.getUmidTabCount();
      vm.getUMIDDetailsById();
    }

    vm.PrintDocument = () => {
      $scope.$broadcast('PrintDocument', vm.selectedRowsItem);
    };

    vm.addInReserve = () => {
      if (!vm.isListScreen && vm.currentState === TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_STATE) {
        $scope.$broadcast('CallAddInReserveFromEdit', null);
      } else {
        $scope.$broadcast('CallAddInReserve', vm.selectedRowsItem);
      }
    };

    vm.removeFromReserve = () => {
      if (!vm.isListScreen && vm.currentState === TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_STATE) {
        $scope.$broadcast('CallRemoveFromReserveFromEdit', null);
      } else {
        $scope.$broadcast('CallRemoveFromReserve', vm.selectedRowsItem);
      }
    };

    vm.addRecord = (isInNewTab) => {
      $scope.$emit('changeTab');
      if (isInNewTab) {
        BaseService.goToUMIDDetail();
      } else {
        $state.go(TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_STATE, { id: null });
      }
    };

    vm.goToUIDList = () => {
      BaseService.goToUMIDList();
    };

    vm.goToUIDManage = (id) => BaseService.goToUMIDDetail(id);

    vm.goToPrinterList = () => {
      BaseService.openInNew(USER.ADMIN_GENERICCATEGORY_PRINTER_TYPE_STATE, {});
    };

    vm.goToPrinterLabelList = () => {
      BaseService.openInNew(USER.ADMIN_LABELTEMPLATE_PRINTER_FORMAT_STATE, {});
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
            if (vm.currentState === vm.TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_STATE) {
              $scope.$broadcast('RefrestUMIDDetail');
            } else if (vm.currentState === vm.TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_LIST_STATE) {
              $scope.$broadcast('RefreshUMIDGrid');
            } else {
              $scope.$broadcast('RefreshBinWH', transfer);
            }
          }
        }, (transfer) => {
          $scope.$broadcast('updatetransferopenflag', false);
          if (transfer) {
            if (vm.currentState === vm.TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_LIST_STATE) {
              $scope.$broadcast('RefreshUMIDGrid');
            } else if (vm.currentState === vm.TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_STATE) {
              $scope.$broadcast('RefrestUMIDDetail');
            } else {
              $scope.$broadcast('RefreshBinWH', transfer);
            }
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.verification = {
      showVideoURL: false
    };

    vm.configureLiveStreamURL = () => {
      vm.verification.showVideoURL = true;
    };

    vm.changeInitialQty = (event) => {
      const dataObj = {
        uid: vm.UMID,
        currentState: vm.currentState
      };
      DialogFactory.dialogService(
        CORE.CHANGE_UMID_INITIAL_COUNT_MODAL_CONTROLLER,
        CORE.CHANGE_UMID_INITIAL_COUNT_MODAL_VIEW,
        event,
        dataObj).then((response) => {
          if (response) {
            if (vm.currentState === vm.TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_STATE) {
              $scope.$broadcast('RefrestUMIDDetail');
            } else if (vm.currentState === vm.TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_LIST_STATE) {
              $scope.$broadcast('RefreshUMIDGrid');
            }
          }
        }, (response) => {
          if (response) {
            if (vm.currentState === vm.TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_LIST_STATE) {
              $scope.$broadcast('RefreshUMIDGrid');
            }
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    const getAllRights = () => {
      vm.enableChangeInitialQty = BaseService.checkFeatureRights(CORE.FEATURE_NAME.ChangeInitialQuantity);
      if ((vm.enableChangeInitialQty === null || vm.enableChangeInitialQty === undefined) && (reTryCount < _configGetFeaturesRetryCount)) {
        getAllRights(); // put for hard reload option as it will not get data from feature rights
        reTryCount++;
      }
    };

    vm.restrictUMID = (event) => {
      const data = {
        id: _.isNaN(parseInt(vm.refUMIDId)) ? null : parseInt(vm.refUMIDId)
      };
      DialogFactory.dialogService(
        TRANSACTION.RESTRICT_UMID_POPUP_CONTROLLER,
        TRANSACTION.RESTRICT_UMID_POPUP_VIEW,
        event,
        data.id ? data : null).then(() => {
        }, (restrictUMID) => {
          if (restrictUMID) {
            if (vm.currentState === vm.TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_STATE) {
              $scope.$broadcast('RefrestUMIDDetail');
            } else if (vm.currentState === vm.TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_LIST_STATE) {
              $scope.$broadcast('RefreshUMIDGrid');
            }
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    $scope.$on('$viewContentLoaded', () => {
      $timeout(() => {
        getAllRights();
      }, _configTimeout);
    });

    vm.umidHistory = (event) => {
      const umidDet = { id: vm.refUMIDId ? parseInt(vm.refUMIDId) : null };
      DialogFactory.dialogService(
        TRANSACTION.TRANSACTION_TRANSFER_STOCK_HISTORY_CONTROLLER,
        TRANSACTION.TRANSACTION_TRANSFER_STOCK_HISTORY_VIEW,
        event,
        umidDet).then(() => {
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.binTransfer = () => {
      DialogFactory.dialogService(
        TRANSACTION.BIN_TRANSFER_POPUP_CONTROLLER,
        TRANSACTION.BIN_TRANSFER_POPUP_VIEW,
        null,
        null).then(() => {
        }, () => {
          $scope.$broadcast('RefreshUMIDGrid');
        }, (err) => BaseService.getErrorLog(err));
    };

    // create uid with identical details popup
    vm.CreateIdenticalDetailUID = () => {
      const uidData = {
        uid: vm.uidCode,
        uidId: vm.umidId
      };
      DialogFactory.dialogService(
        TRANSACTION.IDENTICAL_UMID_POPUP_CONTROLLER,
        TRANSACTION.IDENTICAL_UMID_POPUP_VIEW,
        null,
        uidData).then((umidDetail) => {
          if (umidDetail && vm.currentState === vm.TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_STATE) {
            $scope.$broadcast('RefrestUMIDDetail');
          } else if (umidDetail && vm.currentState === vm.TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_LIST_STATE) {
            $scope.$broadcast('RefreshUMIDGrid');
          }
        }, (umidDetail) => {
          if (umidDetail && vm.currentState === vm.TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_STATE) {
            $scope.$broadcast('RefrestUMIDDetail');
          } else if (umidDetail && vm.currentState === vm.TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_LIST_STATE) {
            $scope.$broadcast('RefreshUMIDGrid');
          }
        }, (err) => BaseService.getErrorLog(err));
    };

    // Split UMID popup
    vm.SplitUID = () => {
      let uidData = {};
      if (vm.isEdit) {
        uidData = {
          id: vm.umidId,
          uid: vm.uidCode,
          mfgPN: vm.mfgpn,
          mfgPNId: vm.mfgId,
          mfg: vm.mfg,
          mfgCodeId: vm.mfgCodeId,
          rohsIcon: vm.rohsIcon,
          rohsName: vm.rohsName
        };
      }
      DialogFactory.dialogService(
        TRANSACTION.SPLIT_UID_POPUP_CONTROLLER,
        TRANSACTION.SPLIT_UID_POPUP_VIEW,
        null,
        uidData).then((umidDetail) => {
          if (vm.currentState === vm.TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_STATE) {
            $scope.$broadcast('RefrestUMIDDetail');
          } else if (vm.currentState === vm.TRANSACTION.TRANSACTION_RECEIVINGMATERIAL_LIST_STATE) {
            $scope.$broadcast('RefreshUMIDGrid');
          }
          BaseService.openInNew(TRANSACTION.TRANSACTION_MANAGERECEIVINGMATERIAL_STATE, { id: umidDetail ? umidDetail.id : null });
        }, () => {
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.goToTransferMaterial = () => {
      BaseService.goToTransferMaterial();
    };

    vm.exportTemplate = () => {
      $scope.$broadcast('exportTemplate');
    };

    vm.importUMIDData = () => {
      $scope.$broadcast('importUMIDData');
    };

    $scope.$on('documentCount', () => {
      vm.getUmidTabCount();
    });

    $scope.$on('transferMaterial', (event, transactionID) => {
      vm.transactionID = transactionID;
      vm.open = true;
    });

    // Check warehouse is smart cart or not
    vm.checkPartForSearch = () => {
      if (vm.currentWarehouseType === vm.warehouseType.SmartCart.key) {
        return false;
      } else {
        return true;
      }
    };

    vm.changeEvent = (button, ev) => {
      if (button) {
        vm.searchbyUMID(ev);
      } else {
        vm.cancelSearch(ev);
      }
    };

    // Inoauto Search Functionality Start
    // search by umid api call from here on change of checkbox
    vm.searchbyUMID = (ev) => {
      vm.event = ev;
      const dept = getLocalStorageValue(vm.loginUser.employee.id);
      if (vm.currentDepartmentName !== dept.department.Name && !vm.isComapnyLevel) {
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
          vm.TimeOut = res.data.defaultTimeout && res.data.defaultTimeout[0].values ? res.data.defaultTimeout[0].values : CORE.CANCEL_REQUSET_TIMEOUT;
          funSearchByUMID(departmentID);
        } else {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.PROMPT_ALREADY_USE);
          const model = {
            messageContent: messageContent,
            multiple: true
          };
          DialogFactory.messageAlertDialog(model);
          vm.showStatus = false;
          vm.transactionID = null;
          vm.clickButton = false;
          vm.open = false;
          return;
          // color is not available message prompt
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    // UMID search
    function funSearchByUMID(departmentID) {
      vm.transactionID = getGUID();
      const objSearchPartUMID = {
        UIDs: [vm.uidCode],
        PromptIndicator: vm.promptColorDetails.ledColorValue,
        ledColorID: vm.promptColorDetails.id,
        Priority: 0,
        TimeOut: vm.TimeOut,
        UserName: vm.loginUser.username,
        InquiryOnly: 0,
        departmentID: departmentID ? departmentID : null,
        TransactionID: vm.transactionID,
        Department: departmentID ? vm.currentDepartmentName : '*',
        ReelBarCode: null
      };
      WarehouseBinFactory.sendRequestToSearchPartByUMID().query(objSearchPartUMID).$promise.then((response) => {
        if (response.status === CORE.ApiResponseTypeStatus.FAILED) {
          vm.showStatus = false;
          vm.transactionID = null;
          vm.clickButton = false;
          vm.open = false;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }

    // Connect to Socket
    function connectSocket() {
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
    }

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
        if (vm.uidCode === request.UID) {
          vm.innoAutoLightStatus.ledColorCssClass = null;
          vm.innoAutoLightStatus.ledColorName = null;
          vm.innoAutoLightStatus.inovexStatus = CORE.InoAuto_Search_Status.InTransit;
          vm.innoAutoLightStatus.isTransit = 'Yes';
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
          if (vm.uidCode === item.UID) {
            vm.innoAutoLightStatus.ledColorCssClass = vm.promptColorDetails.ledColorCssClass;
            vm.innoAutoLightStatus.ledColorName = vm.promptColorDetails.ledColorName;
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
          DialogFactory.messageAlertDialog(model, commonCancelFunction);
          return;
        }
      }
    }

    // update status chhosen for all choose umid
    function funChoosen(row) {
      if (vm.uidCode === row.UID) {
        vm.innoAutoLightStatus.inovexStatus = CORE.InoAuto_Search_Status.Chosen;
      }
    }

    // update status NotFound for all umid which are not in inovaxe
    function funNotFound(row) {
      if (vm.uidCode === row) {
        vm.innoAutoLightStatus.inovexStatus = CORE.InoAuto_Search_Status.NotFound;
      }
    }

    // update status NotAvailable for all umid which are already in use
    function funNotAvailable(row) {
      if (vm.uidCode === row.UID) {
        vm.innoAutoLightStatus.inovexStatus = CORE.InoAuto_Search_Status.NotAvailable;
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
      DialogFactory.messageAlertDialog(model, callbackCancel);
      return;
    }

    // common function to clear
    function commonCancelFunction() {
      funUMIDList();
      vm.showStatus = false;
      vm.transactionID = null;
      vm.clickButton = false;
      vm.open = false;
    }

    function callbackCancel() {
      vm.open = false;
    }

    // remove assign color from umid list
    function funUMIDList() {
      vm.innoAutoLightStatus.inovexStatus = null;
      vm.innoAutoLightStatus.ledColorCssClass = null;
      vm.innoAutoLightStatus.ledColorName = null;
    }

    // update umid record
    const removeUMIDStatus = $rootScope.$on(PRICING.EventName.RemoveUMIDFrmList, (name, data) => {
      if (vm.uidCode === data.UID) {
        vm.innoAutoLightStatus.binName = data.tolocation;
        vm.innoAutoLightStatus.warehouseName = data.towarehouse;
        vm.innoAutoLightStatus.departmentName = data.toparentWarehouse;
        funUMIDList();
      }
    });
  }
})();
