(function () {
  'use strict';

  angular
    .module('app.admin.assemblyStock')
    .controller('AssemblyStockAddUpdatePopupController', AssemblyStockAddUpdatePopupController);

  /** @ngInject */
  function AssemblyStockAddUpdatePopupController($scope, $q, $timeout, $mdDialog, AssemblyStockFactory, data, CORE, DialogFactory, BaseService, USER, ComponentFactory, ReceivingMaterialFactory, StockAdjustmentFactory, TRANSACTION, SalesOrderFactory) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.WONumberPattern = CORE.WONumberPattern;
    vm.popupParamData = data ? angular.copy(data) : null;
    vm.invalidDate = false;
    vm.RequiredDate = false;
    vm.isSubmit = false;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.placeHolderFormat = angular.copy(vm.DefaultDateFormat).toUpperCase();
    vm.headerdata = [];
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.INITIAL_STOCK_ASSEMBLY;
    vm.debounceTimeIntervalConst = CORE.DEBOUNCE_TIME_INTERVAL;
    vm.rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.InitialStockPOTypeText = CORE.InitialStockPOTypeText;
    let oldWONumber = null;

    vm.AssemblyStockModel = {
      shipQty: 0,
      totalUMIDCountAfterShipped: 0,
      isPOAdded: true,
      openingdate: new Date()
    };
    vm.AssemblyStockModelCopy = angular.copy(vm.AssemblyStockModel);
    vm.PartCategory = CORE.PartCategory;
    vm.todayDate = new Date();
    vm.initialStockNotesConst = USER.InitialStockNotes;
    vm.dateCodeFormats = CORE.AssyDateCodeFormats;
    vm.summStockModel = {};
    vm.assyStockSameWOAllEntryList = [];
    vm.BUTTON_TYPE = CORE.POPUP_FOOTER_BUTTON;
    vm.InitialStockPOType = angular.copy(CORE.InitialStockPOType);

    if (data) {
      vm.stockId = data.id ? data.id : null;
      vm.assyId = data.assyId ? data.assyId : null;
    }
    vm.isPODetailAlreadyAdded = false;
    function getAssemblyStockDetail() {
      vm.cgBusyLoading = AssemblyStockFactory.assemblyStock().query({ id: vm.stockId }).$promise.then((stock) => {
        if (stock && stock.data && stock.data.length > 0) {
          vm.AssemblyStockModel = stock.data[0];
          vm.AssemblyStockModel.openingStockCopy = angular.copy(vm.AssemblyStockModel.openingStock) || 0;
          vm.AssemblyStockModel.workorderNumber = vm.AssemblyStockModel.woNumber;
          oldWONumber = vm.AssemblyStockModel.woNumber;
          vm.AssemblyStockModel.openingdate = vm.AssemblyStockModel.openingdate ? BaseService.getUIFormatedDate(vm.AssemblyStockModel.openingdate, vm.DefaultDateFormat) : null;
          vm.AssemblyStockModel.shipQty = vm.AssemblyStockModel.shipQty ? vm.AssemblyStockModel.shipQty : 0;
          vm.AssemblyStockModel.totalUMIDCountAfterShipped = 0;
          if (vm.AssemblyStockModel && vm.AssemblyStockModel.partID) {
            getPartSearch({ id: vm.AssemblyStockModel.partID });
          }
          if (vm.AssemblyStockModel.refSalesOrderDetID) {
            getSalesOrderDetailByPartId({ partID: vm.assyId || vm.AssemblyStockModel.partID, refSalesOrderDetID: vm.AssemblyStockModel.refSalesOrderDetID, includeCompleted: 1 });
          }
          vm.autoCompletePO.searchText = vm.AssemblyStockModel.poNumber;
          if ((vm.AssemblyStockModel.poNumber || vm.AssemblyStockModel.soNumber || vm.AssemblyStockModel.poQty) && !vm.AssemblyStockModel.refSalesOrderDetID) {
            vm.AssemblyStockModel.poType = vm.InitialStockPOType.MiscPO;
            vm.isPODetailAlreadyAdded = true;
            vm.isAllowChangePO = true;
          } else if (vm.AssemblyStockModel.refSalesOrderDetID) {
            vm.AssemblyStockModel.poType = vm.AssemblyStockModel.isLegacyPO ? vm.InitialStockPOType.LegacyPO : vm.InitialStockPOType.SystemPO;
            vm.isPODetailAlreadyAdded = true;
            vm.isAllowChangePO = false;
          } else {
            vm.AssemblyStockModel.poType = null;
            vm.isPODetailAlreadyAdded = false;
            vm.isAllowChangePO = true;
          }
          vm.AssemblyStockModel.isPOAdded = (vm.AssemblyStockModel.isPOAdded === 1 ? true : false);
          vm.headerdata.push({
            value: vm.AssemblyStockModel.shipQty,
            label: vm.LabelConstant.Shipped.ShippedQty,
            displayOrder: 3
          });
          vm.getExistingAssemblyWorkorderDetailForQty();
          getAssyWOWiseAvailableQty();
          getSameAssyStockWOEntryDet(false);
          vm.AssemblyStockModelCopy = angular.copy(vm.AssemblyStockModel);
        }
      }).catch((error) => BaseService.getErrorLog(error));
    }


    vm.openingDateOptions = {
      appendToBody: true,
      maxDate: vm.todayDate
    };

    /* for down arrow key open date picker */
    vm.DATE_PICKER = CORE.DATE_PICKER;
    vm.IsPickerOpen = {};
    vm.IsPickerOpen[vm.DATE_PICKER.openingdate] = false;

    /* get total UMID stock */
    vm.getExistingAssemblyWorkorderDetailForQty = () => {
      if (vm.AssemblyStockModel.woNumber) {
        ReceivingMaterialFactory.getExistingAssemblyWorkorderDetail().query({ workorderNumber: vm.AssemblyStockModel.woNumber }).$promise.then((response) => {
          if (response && response.data && response.data[0] && response.data[0].totalUMIDCountAfterShipped && response.data[0].partID === (vm.assyId ? parseInt(vm.assyId) : vm.autoCompleteAssy.keyColumnId)) {
            vm.AssemblyStockModel.totalUMIDCountAfterShipped = response.data[0].totalUMIDCountAfterShipped;
          } else {
            vm.AssemblyStockModel.totalUMIDCountAfterShipped = 0;
          }
          const umidStockHeaderDet = _.find(vm.headerdata, (item) => item.label === 'UMID Stock');
          if (umidStockHeaderDet) {
            umidStockHeaderDet.value = vm.AssemblyStockModel.totalUMIDCountAfterShipped;
          } else {
            vm.headerdata.push({
              value: vm.AssemblyStockModel.totalUMIDCountAfterShipped,
              label: 'UMID Stock',
              displayOrder: 4
            });
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    const openingStockMinQtyRequiredMessage = (openingStockRequiredMinQty) => {
      const messageContent = angular.copy(vm.CORE_MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INITIAL_STOCK_USED_NOT_ALLOW_TO_CHANGE_LESS);
      messageContent.message = stringFormat(messageContent.message, openingStockRequiredMinQty);
      const model = {
        messageContent: messageContent,
        multiple: true
      };
      return DialogFactory.messageAlertDialog(model).then(() => {
        setFocus('openingStock');
      }, () => { // empty
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // get all assembly list
    const getPartSearch = (searchObj) => ComponentFactory.getAllAssemblyBySearch().save({
      listObj: searchObj
    }).$promise.then((partList) => {
      if (partList && partList.data && partList.data.data) {
        vm.assyList = partList.data.data;
        if (searchObj.id) {
          const partDetails = partList.data.data[0];
          $timeout(() => {
            if (vm.autoCompleteAssy && vm.autoCompleteAssy.inputName) {
              $scope.$broadcast(vm.autoCompleteAssy.inputName, partDetails);
            }
          });
        }
      }
      else {
        vm.assyList = [];
      }
      return vm.assyList;
    }).catch((error) => BaseService.getErrorLog(error));

    if (vm.popupParamData && vm.popupParamData.isAddDataFromCustomerPackingSlipPage && vm.popupParamData.customerPackingSlipDet) {
      vm.isDisableToAccess = true;
      vm.assyId = vm.popupParamData.customerPackingSlipDet.partID;
      getPartSearch({ id: vm.assyId });
    }

    // get all PO List
    const getSalesOrderDetailByPartId = (searchObj) => {
      if (searchObj.partID) {
        return SalesOrderFactory.getSalesOrderDetailByPartId().query(searchObj).$promise.then((response) => {
          if (response && response.data) {
            if (vm.stockId) {
              vm.poList = response.data;
            } else {
              vm.poList = _.filter(response.data, (det) => det.salesOrderDetStatus === 1 || det.usedInWO === 0 || (!det.usedInWO));
            }
            if (searchObj.refSalesOrderDetID) {
              $timeout(() => {
                if (vm.autoCompletePO && vm.autoCompletePO.inputName) {
                  $scope.$broadcast(vm.autoCompletePO.inputName, response.data[0]);
                  vm.AssemblyStockModel.originalPOQty = response.data[0].originalPOQty;
                }
              });
            }
            if (response && response.data.length === 0 && (!vm.isPODetailAlreadyAdded || vm.AssemblyStockModel.poType === vm.InitialStockPOType.MiscPO)) {
              clearSearchTextForPO();
            }
          }
          else {
            vm.poList = [];
          }
          return vm.poList;
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    const clearSearchTextForPO = () => {
      vm.isAllowChangePO = true;
      vm.AssemblyStockModel.poNumber = angular.copy(vm.autoCompletePO.searchText);
      if (vm.AssemblyStockModel.poNumber || vm.AssemblyStockModel.soNumber || vm.AssemblyStockModel.poQty) {
        vm.AssemblyStockModel.poType = vm.InitialStockPOType.MiscPO;
      } else {
        vm.AssemblyStockModel.poType = null;
      }
      vm.AssemblyStockModel.refSalesOrderDetID = null;
      vm.AssemblyStockModel.refSalesOrderID = null;
      vm.AssemblyStockModel.originalPOQty = null;
    };

    const setSelectedPODetail = (item) => {
      if (item) {
        vm.isAllowChangePO = false;
        vm.AssemblyStockModel.poType = item.isLegacyPO ? vm.InitialStockPOType.LegacyPO : vm.InitialStockPOType.SystemPO;
        vm.AssemblyStockModel.poNumber = item.poNumber;
        vm.AssemblyStockModel.soNumber = item.soNumber;
        vm.AssemblyStockModel.poQty = item.POQty;
        vm.AssemblyStockModel.isLegacyPO = item.isLegacyPO;
        vm.AssemblyStockModel.refSalesOrderDetID = item.salesOrderDetID;
        vm.AssemblyStockModel.refSalesOrderID = item.salesOrderID;
        vm.AssemblyStockModel.originalPOQty = item.originalPOQty;
        vm.AssemblyStockModel.poRevision = item.poRevision;
      } else {
        vm.isAllowChangePO = true;
        // vm.AssemblyStockModel.isLegacyPO = false;
        vm.AssemblyStockModel.poNumber = vm.autoCompletePO.searchText;
        vm.AssemblyStockModel.soNumber = null;
        vm.AssemblyStockModel.poQty = null;
        if (vm.AssemblyStockModel.poNumber || vm.AssemblyStockModel.soNumber || vm.AssemblyStockModel.poQty) {
          vm.AssemblyStockModel.poType = vm.InitialStockPOType.MiscPO;
        } else {
          vm.AssemblyStockModel.poType = null;
        }
        vm.AssemblyStockModel.refSalesOrderDetID = null;
        vm.AssemblyStockModel.refSalesOrderID = null;
        vm.AssemblyStockModel.originalPOQty = null;
        vm.AssemblyStockModel.poRevision = null;
      }
    };

    const initAutoCompleteAssy = () => {
      vm.autoCompleteAssy = {
        columnName: 'SearchPIDMfgPN', // 'PIDCode',
        keyColumnName: 'id',
        controllerName: CORE.MANAGE_COMPONENT_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_COMPONENT_MODAL_VIEW,
        keyColumnId: (vm.AssemblyStockModel && vm.AssemblyStockModel.partID) ? vm.AssemblyStockModel.partID : null,
        inputName: 'SearchPart',
        placeholderName: 'Type here to search assembly',
        isRequired: true,
        isAddnew: true,
        callbackFn: () => { //empty
        },
        addData: {
          mfgType: CORE.MFG_TYPE.MFG,
          category: vm.PartCategory.SubAssembly,
          popupAccessRoutingState: [USER.ADMIN_MANAGECOMPONENT_DETAIL_STATE],
          pageNameAccessLabel: CORE.LabelConstant.PART_MASTER.PageName
        },
        onSelectCallbackFn: function (item) {
          let vIndex = vm.headerdata.findIndex((det) => det.isPartData);
          if (!item) {
            vm.AssemblyStockModel.partID = null;
            vm.AssemblyStockModel.woNumber = null;
            vm.binName = null;
            vm.departmentName = null;
            vm.warehouse = null;
            vm.AssemblyStockModel.binID = null;
            vm.AssemblyStockModel.whID = null;
            vm.AssemblyStockModel.nickName = null;
            vm.AssemblyStockModel.PIDCode = null;
            vm.AssemblyStockModel.mfgPN = null;
            vm.AssemblyStockModel.openingStock = null;
            vm.AssemblyStockModel.mfgCodeFormated = null;
            vm.autoCompletePO.searchText = null;
            vm.AssemblyStockModel.poNumber = null;
            vm.AssemblyStockModel.soNumber = null;
            vm.AssemblyStockModel.poQty = null;
            vm.AssemblyStockModel.poType = null;
            vm.AssemblyStockModel.refSalesOrderDetID = null;
            vm.AssemblyStockModel.refSalesOrderID = null;
            vm.AssemblyStockModel.originalPOQty = null;
            vIndex = vm.headerdata.findIndex((det) => det.isPartData);
            vm.headerdata.splice(vIndex, 1);
          }
          else {
            vm.AssemblyStockModel.partID = item.id;
            vm.AssemblyStockModel.nickName = item.nickName;
            vm.AssemblyStockModel.rohsIcon = item.rohsIcon;
            vm.AssemblyStockModel.rohsName = item.name;
            vm.AssemblyStockModel.mfgPN = item.mfgPN;
            vm.AssemblyStockModel.PIDCode = item.PIDCode;
            vm.AssemblyStockModel.mfgCodeID = item.mfgCodeID;
            vm.AssemblyStockModel.mfgCodeFormated = item.mfgCodeFormated;
            if (vIndex < 0) {
              vm.headerdata.push({
                label: vm.LabelConstant.Assembly.PIDCode,
                value: item.PIDCode,
                displayOrder: 1,
                isCopy: true,
                isAssy: true,
                labelLinkFn: vm.goToAssemblyList,
                valueLinkFn: vm.goToAssemblyDetails,
                imgParms: {
                  imgPath: vm.rohsImagePath + item.rohsIcon,
                  imgDetail: item.name
                },
                isPartData: true
              });
            }
            getWarehouseDetail(item.PIDCode);
            //// get max wo number (max from initial stock + production work order)
            //if (!vm.AssemblyStockModel.id) {
            //  getWOMaxNumber();
            //}
          }
        },
        onSearchFn: (query) => {
          const searchObj = {
            query: query
          };
          return getPartSearch(searchObj);
        }
      };
      vm.autoCompletePO = {
        columnName: 'SOPONumber',
        keyColumnName: 'salesOrderDetID',
        keyColumnId: (vm.AssemblyStockModel && vm.AssemblyStockModel.refSalesOrderDetID) ? vm.AssemblyStockModel.refSalesOrderDetID : null,
        inputName: 'SearchPO',
        placeholderName: 'Type here to search PO#/SO#',
        isRequired: false,
        isAddnew: false,
        isUppercaseSearchText: true,
        searchText: '',
        onSelectCallbackFn: setSelectedPODetail,
        onSearchFn: (query) => {
          const searchObj = {
            partID: vm.AssemblyStockModel.partID,
            searchPO: query
          };
          return getSalesOrderDetailByPartId(searchObj);
        },
        callbackFnForClearSearchText: clearSearchTextForPO
      };
    };

    const init = () => {
      const autocompletePromise = [initAutoCompleteAssy()];
      vm.cgBusyLoading = $q.all(autocompletePromise).then(() => {
        if (vm.stockId) {
          getAssemblyStockDetail();
        } else if (vm.assyId) {
          getPartSearch({ id: vm.assyId });
        } else if (!vm.assyId) {
          if (vm.autoCompleteAssy && vm.autoCompleteAssy.inputName) {
            $scope.$broadcast(vm.autoCompleteAssy.inputName + 'searchText', null);
            vm.autoCompleteAssy.keyColumnId = null;
          }
        }
        if (!vm.stockId) {
          vm.isAllowChangePO = true;
        } else if (vm.AssemblyStockModel.poType === vm.InitialStockPOType.MiscPO) { //&& vm.AssemblyStockModel.isPOAdded
          vm.isAllowChangePO = true;
        } else {
          vm.isAllowChangePO = false;
        }
        // if update legacy PO stock  than  not allow to  change to MISC PO type
        if (vm.stockId && (vm.AssemblyStockModel.poType === vm.InitialStockPOType.LegacyPO || vm.AssemblyStockModel.poType === vm.InitialStockPOType.SystemPO)) {
          vm.disablePoType = true;
        } else {
          vm.disablePoType = false;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    init();

    //get warehouse details for selected assy
    const getWarehouseDetail = (name) => {
      const obj = {
        name: name
      };
      vm.cgBusyLoading = ReceivingMaterialFactory.match_Warehouse_Bin().query(obj).$promise.then((res) => {
        if (res && res.data) {
          const warehouseDet = res.data;
          vm.binName = warehouseDet.Name;
          vm.departmentName = warehouseDet.warehousemst && warehouseDet.warehousemst.parentWarehouseMst ? warehouseDet.warehousemst.parentWarehouseMst.Name : '';
          vm.warehouse = warehouseDet.warehousemst ? warehouseDet.warehousemst.Name : '';
          vm.AssemblyStockModel.binID = warehouseDet.id;
          vm.AssemblyStockModel.whID = warehouseDet.WarehouseID;
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    /*Used to Save records*/
    vm.addUpdateAssemblystock = (buttonCategory) => {
      vm.isSubmit = false;
      if (BaseService.focusRequiredField(vm.AssemblyStockForm)) {
        vm.isSubmit = true;
        if (vm.AssemblyStockModel.id && !vm.checkFormDirty(vm.AssemblyStockForm) && buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
          BaseService.currentPagePopupForm.pop();
          $mdDialog.cancel(vm.AssemblyStockModel);
        }
        return;
      }

      if (CORE.ProdWONumPatternNotAllowedForOtherTypeWONum.test(vm.AssemblyStockModel.woNumber.toUpperCase())) {
        const model = {
          messageContent: angular.copy(vm.CORE_MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.PROD_WO_PATTERN_NOT_ALLOWED_FOR_OTHER_WO_NUM)
        };
        return DialogFactory.messageAlertDialog(model).then(() => {
          setFocus('woNumber');
        }, () => { // empty
        }).catch((error) => BaseService.getErrorLog(error));
      }

      if (vm.AssemblyStockModel.openingStock < 0 || vm.summStockModel.nonUMIDStockForCurrWOQtyAfrUpdate < 0 || (vm.AssemblyStockModel.openingStock < (vm.AssemblyStockModel.openingStockRequiredMinQty || 0))) {
        setFocus('openingStock');
        return;
      }

      let firstWOEntryWithDateCode = null;
      let firstWOEntryWithPONumber = null;
      let existingASDet = null;
      if (vm.AssemblyStockModel.id) {
        firstWOEntryWithDateCode = _.find(vm.assyStockSameWOAllEntryList, (asItem) => asItem.dateCode && asItem.ID !== vm.AssemblyStockModel.id);
        firstWOEntryWithPONumber = _.find(vm.assyStockSameWOAllEntryList, (asItem) => asItem.poNumber && asItem.ID !== vm.AssemblyStockModel.id);
        existingASDet = _.find(vm.assyStockSameWOAllEntryList, (asItem) => asItem.ID === vm.AssemblyStockModel.id);
      } else {
        firstWOEntryWithDateCode = _.find(vm.assyStockSameWOAllEntryList, (asItem) => asItem.dateCode);
        firstWOEntryWithPONumber = _.find(vm.assyStockSameWOAllEntryList, (asItem) => asItem.poNumber);
      }

      let isDateCodePORequiredToCheckForChange = true;
      if (existingASDet && vm.AssemblyStockModel.dateCodeFormat === existingASDet.dateCodeFormat && vm.AssemblyStockModel.dateCode === existingASDet.dateCode && vm.AssemblyStockModel.poNumber === existingASDet.poNumber) {
        isDateCodePORequiredToCheckForChange = false;
      };

      let isDateCodeDiffFromFirstEntry = false;
      let isPONumberDiffFromFirstEntry = false;
      if (isDateCodePORequiredToCheckForChange) {
        if (firstWOEntryWithDateCode && ((firstWOEntryWithDateCode.dateCodeFormat !== vm.AssemblyStockModel.dateCodeFormat) || (firstWOEntryWithDateCode.dateCode !== vm.AssemblyStockModel.dateCode))) {
          isDateCodeDiffFromFirstEntry = true;
        }
        if (!isDateCodeDiffFromFirstEntry && firstWOEntryWithPONumber && firstWOEntryWithPONumber.poNumber !== vm.AssemblyStockModel.poNumber) {
          isPONumberDiffFromFirstEntry = true;
        }
      }

      // if date code or poNumber not match with first old entry then take confirmation
      if (isDateCodeDiffFromFirstEntry || isPONumberDiffFromFirstEntry) {
        const obj = {
          messageContent: angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.INITIAL_STOCK_WO_DATECODE_PO_CONFM),
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_OK_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        DialogFactory.messageConfirmDialog(obj).then((resp) => {
          if (resp) {
            manageAssemblystockEntry(buttonCategory);
          }
        }, () => {
          if (isDateCodeDiffFromFirstEntry) {
            setFocus('dateCode');
          } else if (isPONumberDiffFromFirstEntry) {
            setFocus('poNumber');
          }
        }).catch((error) => BaseService.getErrorLog(error));
      } else {
        manageAssemblystockEntry(buttonCategory);
      }
    };

    // manage assemblt stock add/update entry
    const manageAssemblystockEntry = (buttonCategory) => {
      vm.AssemblyStockModel.isPOAdded = (vm.AssemblyStockModel.poNumber || vm.AssemblyStockModel.soNumber || vm.AssemblyStockModel.poQty) ? true : false;
      const AssemblyStockInfo = {
        partID: vm.AssemblyStockModel.partID,
        openingStock: vm.AssemblyStockModel.openingStock,
        woNumber: vm.AssemblyStockModel.woNumber,
        serialNo: vm.AssemblyStockModel.serialNo,
        // converted date to datetime format like with 06/15/19 12:00:00 if 06/15/19 00:00:00 then in api give one date less
        //opening date: $filter('date')(vm.AssemblyStockModel.openingdate, vm.DefaultDateFormat) + " " + "12:00:00"
        openingdate: BaseService.getAPIFormatedDate(vm.AssemblyStockModel.openingdate),
        type: CORE.ASSY_STOCK_TYPE.OpeningStock,
        binID: vm.AssemblyStockModel.binID,
        whID: vm.AssemblyStockModel.whID,
        dateCode: vm.AssemblyStockModel.dateCode,
        poNumber: vm.AssemblyStockModel.poNumber,
        dateCodeFormat: vm.AssemblyStockModel.dateCodeFormat,
        poQty: vm.AssemblyStockModel.poQty,
        soNumber: vm.AssemblyStockModel.soNumber,
        refSalesOrderDetID: vm.AssemblyStockModel.refSalesOrderDetID,
        refSalesOrderID: vm.AssemblyStockModel.refSalesOrderID,
        isPOAdded: vm.AssemblyStockModel.isPOAdded
      };

      if ((data && data.id) || vm.AssemblyStockModel.id) {
        AssemblyStockInfo.workorderNumber = vm.AssemblyStockModel.woNumber;
        vm.cgBusyLoading = AssemblyStockFactory.assemblyStock().update({
          id: data.id || vm.AssemblyStockModel.id
        }, AssemblyStockInfo).$promise.then((response) => {
          if (response && response.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            //BaseService.currentPagePopupForm.pop();
            //$mdDialog.hide();
            vm.saveAndProceed(buttonCategory, response.data);
          } else if (response && response.status === CORE.ApiResponseTypeStatus.EMPTY && response.errors && response.errors.data && response.errors.data.openingStockMinQtyRequiredValidation) {
            openingStockMinQtyRequiredMessage(response.errors.data.openingStockRequiredMinQty);
          }
          else {
            /*Set focus on first enabled field after user click Ok button*/
            if (checkResponseHasCallBackFunctionPromise(response)) {
              response.alretCallbackFn.then(() => {
                BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.AssemblyStockForm);
              });
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        vm.cgBusyLoading = AssemblyStockFactory.assemblyStock().save(AssemblyStockInfo).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            vm.AssemblyStockModel.id = res.data.ID;
            vm.stockId = res.data.ID;
            vm.saveAndProceed(buttonCategory, res.data);
            //BaseService.currentPagePopupForm.pop();
            //$mdDialog.hide();
          }
          else {
            /*Set focus on first enabled field after user click Ok button*/
            if (checkResponseHasCallBackFunctionPromise(res)) {
              res.alretCallbackFn.then(() => {
                BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.AssemblyStockForm);
              });
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // open work order number build history pop up
    vm.viewWONumberBuildHistory = (event) => {
      const data = {
        partID: vm.AssemblyStockModel.partID || null,
        assyNickName: vm.AssemblyStockModel.nickName || null
      };
      DialogFactory.dialogService(
        CORE.WO_BUILD_HISTORY_COMP_NICKNAME_POPUP_CONTROLLER,
        CORE.WO_BUILD_HISTORY_COMP_NICKNAME_POPUP_VIEW,
        event,
        data).then(() => { // Success Section
        }, () => { // Cancel Section
        }, (err) => BaseService.getErrorLog(err));
    };

    // called when work order number changed
    vm.woNumberChanged = () => {
      if (vm.autoCompleteAssy.keyColumnId && oldWONumber !== vm.AssemblyStockModel.woNumber && vm.AssemblyStockForm && vm.AssemblyStockForm.woNumber.$dirty && vm.AssemblyStockModel.woNumber) {
        getSameAssyStockWOEntryDet(true);
        const umidStockPromise = [vm.getExistingAssemblyWorkorderDetailForQty()];
        vm.cgBusyLoading = $q.all(umidStockPromise).then(() => {
          getAssyWOWiseAvailableQty();
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    // get details if exists same work order
    const getSameAssyStockWOEntryDet = (isSetDetails) => {
      vm.cgBusyLoading = AssemblyStockFactory.getSameAssyStockWOEntryData().save({
        assyID: vm.autoCompleteAssy.keyColumnId || vm.AssemblyStockModel.partID,
        woNumber: vm.AssemblyStockModel.woNumber
      }).$promise.then((res) => {
        oldWONumber = angular.copy(vm.AssemblyStockModel.woNumber);
        vm.assyStockSameWOAllEntryList = [];
        if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS && res.data && res.data.length > 0) {
          vm.assyStockSameWOAllEntryList = _.orderBy(res.data, ['ID'], ['asc']);
          if (isSetDetails) {
            const firstWOEntryWithDateCode = _.find(vm.assyStockSameWOAllEntryList, (asItem) => asItem.dateCode);
            if (firstWOEntryWithDateCode) {
              vm.AssemblyStockModel.dateCodeFormat = firstWOEntryWithDateCode.dateCodeFormat || vm.AssemblyStockModel.dateCodeFormat;
              vm.AssemblyStockModel.dateCode = firstWOEntryWithDateCode.dateCode || vm.AssemblyStockModel.dateCode;
            }
            const assyStockSameWOAllListByCreatedAt = _.orderBy(res.data, ['createdAt'], ['desc']);
            const firstWOEntryWithPONumber = _.find(assyStockSameWOAllListByCreatedAt, (asItem) => asItem.poNumber);
            if (firstWOEntryWithPONumber) {
              vm.AssemblyStockModel.poNumber = firstWOEntryWithPONumber.poNumber || vm.AssemblyStockModel.poNumber;
              $scope.$broadcast(vm.autoCompletePO.inputName + 'searchText', firstWOEntryWithPONumber.poNumber);
              vm.autoCompletePO.keyColumnId = firstWOEntryWithPONumber.refSalesOrderDetID;
              vm.AssemblyStockModel.poNumber = firstWOEntryWithPONumber.poNumber;
              vm.AssemblyStockModel.soNumber = firstWOEntryWithPONumber.soNumber;
              vm.AssemblyStockModel.poQty = firstWOEntryWithPONumber.poQty;
              vm.AssemblyStockModel.refSalesOrderDetID = firstWOEntryWithPONumber.refSalesOrderDetID;
              vm.AssemblyStockModel.refSalesOrderID = firstWOEntryWithPONumber.refSalesOrderID;
              vm.AssemblyStockModel.isPOAdded = firstWOEntryWithPONumber.isPOAdded;
              if (firstWOEntryWithPONumber.refSalesOrderDetID) {
                vm.AssemblyStockModel.poType = firstWOEntryWithPONumber.assemblySalesOrderMst && firstWOEntryWithPONumber.assemblySalesOrderMst.isLegacyPO ? vm.InitialStockPOType.LegacyPO : vm.InitialStockPOType.SystemPO;
                vm.isAllowChangePO = false;
              } else if (firstWOEntryWithPONumber.poNumber) {
                vm.AssemblyStockModel.poType = vm.InitialStockPOType.MiscPO;
                vm.isAllowChangePO = true;
              }
              vm.AssemblyStockModel.originalPOQty = firstWOEntryWithPONumber && firstWOEntryWithPONumber.assemblySalesOrderDet ? firstWOEntryWithPONumber.assemblySalesOrderDet.originalPOQty : null;
              vm.AssemblyStockModel.poRevision = firstWOEntryWithPONumber && firstWOEntryWithPONumber.assemblySalesOrderMst ? firstWOEntryWithPONumber.assemblySalesOrderMst.poRevision : null;
            } else if (vm.AssemblyStockModel.poNumber || vm.AssemblyStockModel.soNumber || vm.AssemblyStockModel.poQty) {
              vm.AssemblyStockModel.poType = vm.InitialStockPOType.MiscPO;
            } else {
              vm.AssemblyStockModel.poType = null;
            }
          }
        } else {
          if (checkResponseHasCallBackFunctionPromise(res)) {
            res.alretCallbackFn.then(() => {
              vm.AssemblyStockModel.woNumber = null;
              oldWONumber = null;
              setFocus('woNumber');
            });
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // get details of assembly/work order stock
    const getAssyWOWiseAvailableQty = () => {
      const obj = {
        partID: vm.autoCompleteAssy.keyColumnId || vm.AssemblyStockModel.partID,
        woNumber: vm.AssemblyStockModel.woNumber
      };
      StockAdjustmentFactory.getAvailableQty().query(obj).$promise.then((response) => {
        if (response && response.data.availableStock && response.data.availableStock.length > 0) {
          const stockValue = response.data.availableStock[0];
          const cumulativeAssyStock = (stockValue.cumulativeAssyStock || 0);
          vm.summStockModel.currWOQtyBfrUpdate = stockValue.availableQty || 0;
          vm.summStockModel.currOtherWOQty = cumulativeAssyStock - (stockValue.availableQty || 0);
          vm.summStockModel.currCumuAssyQtyBfrUpdate = vm.summStockModel.currWOQtyBfrUpdate + vm.summStockModel.currOtherWOQty;

          // UMID stock before update
          vm.summStockModel.UMIDStockForOtherWOQty = stockValue.UMIDStockOfOtherThanCurrWO || 0;
          vm.summStockModel.UMIDStockForCumuAssyQty = (vm.AssemblyStockModel.totalUMIDCountAfterShipped || 0) + (vm.summStockModel.UMIDStockForOtherWOQty || 0);

          // Non-UMID stock stock before update
          vm.summStockModel.nonUMIDStockForCurrWOQty = stockValue.actualAvalilableQty || 0;
          vm.summStockModel.nonUMIDStockForOtherWOQty = ((vm.summStockModel.currOtherWOQty || 0) - (vm.summStockModel.UMIDStockForOtherWOQty || 0));
          vm.summStockModel.nonUMIDStockForCumuAssyQty = (vm.summStockModel.nonUMIDStockForCurrWOQty || 0) + (vm.summStockModel.nonUMIDStockForOtherWOQty || 0);

          vm.openingStockChanged();

          //// Non-UMID Stock After Update
          //vm.summStockModel.nonUMIDStockForCurrWOQtyAfrUpdate = (vm.summStockModel.nonUMIDStockForCurrWOQty || 0) + (vm.AssemblyStockModel.ISCurrAdjustmentQty || 0);
          //vm.summStockModel.nonUMIDStockForCumuAssyQtyAfrUpdate = (vm.summStockModel.nonUMIDStockForCurrWOQtyAfrUpdate || 0) + (vm.summStockModel.nonUMIDStockForOtherWOQty || 0);

          // validation to set required min qty
          const currWOQtyExcludeUMIDQty = ((stockValue.actualAvalilableQty || 0) - (vm.AssemblyStockModel.openingStock || 0));
          if (currWOQtyExcludeUMIDQty >= 0) {
            vm.AssemblyStockModel.openingStockRequiredMinQty = 0;
          } else {
            vm.AssemblyStockModel.openingStockRequiredMinQty = Math.abs(currWOQtyExcludeUMIDQty);
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    vm.openingStockChanged = () => {
      if (vm.AssemblyStockModel.id) { // update case
        vm.AssemblyStockModel.ISCurrAdjustmentQty = (parseInt(vm.AssemblyStockForm.openingStock.$viewValue || 0) - vm.AssemblyStockModel.openingStockCopy);
        vm.isISCurrAdjustmentQtyHaveValue = (vm.AssemblyStockModel.ISCurrAdjustmentQty >= 0 || vm.AssemblyStockModel.ISCurrAdjustmentQty < 0);

        vm.summStockModel.totCumuAssyQty = (vm.summStockModel.currCumuAssyQtyBfrUpdate || 0) + (vm.AssemblyStockModel.ISCurrAdjustmentQty || 0);
        vm.summStockModel.totOfCurrWOQty = (vm.summStockModel.currWOQtyBfrUpdate || 0) + (vm.AssemblyStockModel.ISCurrAdjustmentQty || 0);

        // Non-UMID Stock After Update
        vm.summStockModel.nonUMIDStockForCurrWOQtyAfrUpdate = ((vm.summStockModel.currWOQtyBfrUpdate || 0) + (vm.AssemblyStockModel.ISCurrAdjustmentQty || 0)) - (vm.AssemblyStockModel.totalUMIDCountAfterShipped || 0);
      } else { // add case
        vm.summStockModel.totCumuAssyQty = (vm.summStockModel.currCumuAssyQtyBfrUpdate || 0) + parseInt(vm.AssemblyStockForm.openingStock.$viewValue || 0);
        vm.summStockModel.totOfCurrWOQty = (vm.summStockModel.currWOQtyBfrUpdate || 0) + parseInt(vm.AssemblyStockForm.openingStock.$viewValue || 0);

        // Non-UMID Stock After Update
        vm.summStockModel.nonUMIDStockForCurrWOQtyAfrUpdate = ((vm.summStockModel.currWOQtyBfrUpdate || 0) + parseInt(vm.AssemblyStockForm.openingStock.$viewValue || 0)) - (vm.AssemblyStockModel.totalUMIDCountAfterShipped || 0);
      }

      // Non-UMID Stock After Update
      vm.summStockModel.nonUMIDStockForCumuAssyQtyAfrUpdate = (vm.summStockModel.nonUMIDStockForCurrWOQtyAfrUpdate || 0) + (vm.summStockModel.nonUMIDStockForOtherWOQty || 0);
    };

    vm.cancel = () => {
      const isDirty = vm.checkFormDirty(vm.AssemblyStockForm);
      if (isDirty) {
        const data = {
          form: vm.AssemblyStockForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    /* view assembly stock details */
    vm.ViewAssemblyStockStatus = () => {
      const data = {
        partID: vm.AssemblyStockModel.partID,
        rohsIcon: vm.rohsImagePath + vm.AssemblyStockModel.rohsIcon,
        rohsName: vm.AssemblyStockModel.rohsName,
        mfgPN: vm.AssemblyStockModel.mfgPN,
        PIDCode: vm.AssemblyStockModel.PIDCode
      };
      DialogFactory.dialogService(
        CORE.ASSEMBLY_STOCK_STATUS_MODAL_CONTROLLER,
        CORE.ASSEMBLY_STOCK_STATUS_MODAL_VIEW,
        null,
        data).then(() => { // empty
        }, () => { // empty
        }, (err) => BaseService.getErrorLog(err));
    };

    vm.checkFormDirty = (form, columnName) => {
      const checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };

    // called when date code format drop down changed
    vm.dateCodeFormatChanged = () => {
      vm.AssemblyStockModel.dateCode = vm.AssemblyStockModel.dateCodeFormat ? vm.AssemblyStockModel.dateCode : null;
    };

    // check added valid date code
    vm.checkAssyDateCode = () => {
      vm.isInValidDatecode = BaseService.validateDateCode(vm.AssemblyStockModel.dateCodeFormat, vm.AssemblyStockModel.dateCode);
      vm.AssemblyStockForm.dateCode.$setValidity('isInValidDatecode', !vm.isInValidDatecode);
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);

    /* called for max date validation */
    vm.getMaxDateValidation = (FromDateLabel, ToDateLabel) => BaseService.getMaxDateValidation(FromDateLabel, ToDateLabel);

    /* called for min date validation */
    vm.getMinDateValidation = (FromDateLabel, ToDateLabel) => BaseService.getMinDateValidation(FromDateLabel, ToDateLabel);

    //hyperlink go for list page
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };

    //on load submit form
    angular.element(() => {
      //check load
      BaseService.currentPagePopupForm.push(vm.AssemblyStockForm);
    });

    // After save action as per button pressed
    vm.saveAndProceed = (buttonCategory, data) => {
      //if (data) {
      //  vm.data = data;
      //}
      if (buttonCategory === vm.BUTTON_TYPE.SAVE) {
        init();
        vm.AssemblyStockForm.$setPristine();
        vm.AssemblyStockForm.dirty = false;
        // vm.pageSet();
      } else if (buttonCategory === vm.BUTTON_TYPE.ADDNEW) {
        const isdirty = vm.checkFormDirty(vm.AssemblyStockForm);
        if (isdirty) {
          //const data = {
          //  form: vm.AssemblyStockForm
          //};
          const messgaeContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.WITHOUT_SAVING_RESET_BODY_MESSAGE);
          const obj = {
            messageContent: messgaeContent,
            btnText: CORE.MESSAGE_CONSTANT.RESET_POPUP_BUTTON,
            canbtnText: CORE.MESSAGE_CONSTANT.STAY_ON_BUTTON
          };
          DialogFactory.messageConfirmDialog(obj).then(() => {
            vm.AssemblyStockModel = {
              shipQty: 0,
              totalUMIDCountAfterShipped: 0,
              isPOAdded: true,
              openingdate: new Date(),
              poType: null
            };
            vm.stockId = null;
            if (vm.autoCompletePO && vm.autoCompletePO.keyColumnId) {
              $scope.$broadcast(vm.autoCompletePO.inputName + 'searchText', null);
              vm.autoCompletePO.keyColumnId = null;
            }
            vm.isAllowChangePO = null;
            vm.isPODetailAlreadyAdded = null;
            vm.summStockModel = {};
            vm.assyStockSameWOAllEntryList = [];
            oldWONumber = null;
            vm.headerdata = [];
            init();
            setFocus('openingdate');
            vm.AssemblyStockForm.$setPristine();
            vm.AssemblyStockForm.dirty = false;
          }, () => { // Emoty Block
          }, (error) => BaseService.getErrorLog(error));
        } else {
          vm.AssemblyStockModel = {
            shipQty: 0,
            totalUMIDCountAfterShipped: 0,
            isPOAdded: true,
            openingdate: new Date()
          };
          vm.stockId = null;
          if (vm.autoCompletePO && vm.autoCompletePO.keyColumnId) {
            $scope.$broadcast(vm.autoCompletePO.inputName + 'searchText', null);
            vm.autoCompletePO.keyColumnId = null;
          }
          vm.isAllowChangePO = null;
          vm.isPODetailAlreadyAdded = null;
          vm.summStockModel = {};
          vm.assyStockSameWOAllEntryList = [];
          oldWONumber = null;
          vm.headerdata = [];
          init();
          setFocus('openingdate');
          vm.AssemblyStockForm.$setPristine();
          vm.AssemblyStockForm.dirty = false;
        }
      } else if (buttonCategory === vm.BUTTON_TYPE.SAVEANDEXIT) {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel(data);
      }
    };

    // Go to Assembly List
    vm.goToAssemblyList = () => {
      BaseService.goToPartList(null);
      return false;
    };
    // Go to assembly detail page
    vm.goToAssemblyDetails = () => {
      BaseService.goToComponentDetailTab('MFG', vm.AssemblyStockModel.partID);
      return false;
    };
    // Go To Manage Sales Order detail tab
    vm.goToManageSalesOrder = () => {
      BaseService.goToManageSalesOrder(vm.AssemblyStockModel.refSalesOrderID, null);
    };
    //Go to MFR Detail
    vm.goToManufacturerDetail = () => {
      BaseService.goToManufacturer(vm.AssemblyStockModel.mfgCodeID);
    };
    //Go to MFR List
    vm.goToManufacturerList = () => {
      BaseService.goToManufacturerList();
    };
  }
})();
