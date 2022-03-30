(function () {
  'use strict';

  angular
    .module('app.transaction.stockadjustment')
    .controller('ManageStockAdjustmentController', ManageStockAdjustmentController);

  /** @ngInject */
  function ManageStockAdjustmentController(data, $timeout, $scope, $mdDialog, CORE, USER, StockAdjustmentFactory, BaseService, DialogFactory, ReceivingMaterialFactory, TRANSACTION) {
    const vm = this;
    const rohsImagePath = CORE.WEB_URL + USER.ROHS_BASE_PATH;
    vm.isViewOnly = (data && data.isViewOnly) ? data.isViewOnly : false;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.CUSTOMER_PACKING_SLIP;
    vm.todayDate = new Date();
    vm.popupParamData = data ? angular.copy(data) : null;
    vm.getMaxLengthValidation = (maxLength, enterTextLength) => BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    vm.headerdata = [];
    vm.stockAdjustmentModel = {
      ID: (data && data.ID) ? data.ID : null,
      partID: null,
      woNumber: null,
      serialNo: null,
      openingdate: null,
      type: null,
      availableQty: 0,
      cumulativeAssyStock: 0,
      mfgPN: null,
      nickname: null,
      mfgPNDescription: null
    };

    // to retrieve stock adjustment data by id (in case of update)
    const getStockAdjustmentDetail = () => {
      vm.cgBusyLoading = StockAdjustmentFactory.StockAdjustment().query({ id: data.id }).$promise.then((stockAdjustment) => {
        if (stockAdjustment && stockAdjustment.data) {
          vm.stockAdjustmentModel = stockAdjustment.data;
          if (vm.stockAdjustmentModel && vm.stockAdjustmentModel.partID) {
            getPartSearch({ query: vm.stockAdjustmentModel.componentAssembly.PIDCode }, true);
            getAssyWOList({ query: vm.stockAdjustmentModel.woNumber, partID: vm.stockAdjustmentModel.partID }, true);
          }
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // get all assembly list
    const getPartSearch = (searchObj, id) =>
      StockAdjustmentFactory.getAllAssemblyBySearch().query({ listObj: searchObj }).$promise
        .then((assyIDList) => {
          if (assyIDList && assyIDList.data) {
            vm.assyList = assyIDList.data;
            if (id) {
              $timeout(() => {
                if (vm.autoCompleteAssy && vm.autoCompleteAssy.inputName) {
                  $scope.$broadcast(vm.autoCompleteAssy.inputName, assyIDList.data[0]);
                }
              });
            }
          }
          else {
            vm.assyList = [];
          }
          return vm.assyList;
        }).catch((error) => BaseService.getErrorLog(error));

    // get all WO list
    const getAssyWOList = (searchObj, id) =>
      StockAdjustmentFactory.getAllWOorkOrderBySearch().query({ listObj: searchObj }).$promise
        .then((WOList) => {
          if (WOList && WOList.data.length > 0) {
            vm.assyWOList = WOList.data;
            if (id) {
              $timeout(() => {
                vm.autoCompleteWO.keyColumnId = WOList.data[0].woNumber;
              });
            }
          }
          else {
            vm.assyWOList = [];
          }
          return vm.assyWOList;
        }).catch((error) => BaseService.getErrorLog(error));


    const initAutoComplete = () => {
      // for assyID (partID)
      vm.autoCompleteAssy = {
        columnName: 'PIDCode',
        keyColumnName: 'id',
        keyColumnId: (vm.stockAdjustmentModel && vm.stockAdjustmentModel.partID) ? vm.stockAdjustmentModel.partID : null,
        inputName: 'SearchAssy',
        placeholderName: 'Type here to search assembly',
        isRequired: true,
        onSelectCallbackFn: (item) => {
          if (item) {
            vm.stockAdjustmentModel.partID = item.id;
            vm.stockAdjustmentModel.PIDCode = item.PIDCode;
            vm.stockAdjustmentModel.nickname = item.nickname;
            vm.stockAdjustmentModel.mfgPN = item.mfgPN;
            vm.stockAdjustmentModel.mfgPNDescription = item.mfgPNDescription;
            vm.stockAdjustmentModel.rohsIcon = stringFormat('{0}{1}', rohsImagePath, item.rohsIcon);
            vm.stockAdjustmentModel.rohsName = item.rohsName;
            vm.headerdata.push({
              value: vm.stockAdjustmentModel.PIDCode,
              label: vm.LabelConstant.Assembly.ID,
              displayOrder: 1,
              labelLinkFn: vm.goToPartList,
              valueLinkFn: vm.goToPartDetails,
              isCopy: true,
              imgParms: {
                imgPath: vm.stockAdjustmentModel.rohsIcon,
                imgDetail: vm.stockAdjustmentModel.rohsName
              }
            });
          } else {
            vm.stockAdjustmentModel.partID = null;
            vm.stockAdjustmentModel.PIDCode = null;
            vm.stockAdjustmentModel.nickname = null;
            vm.stockAdjustmentModel.mfgPN = null;
            vm.stockAdjustmentModel.mfgPNDescription = null;
            vm.headerdata = [];
            vm.autoCompleteWO.keyColumnId = null;
          }
          getAssyWOList({ partID: vm.stockAdjustmentModel.partID }, false);
        },
        onSearchFn: (query) => {
          const searchObj = {
            query: query
          };
          return getPartSearch(searchObj, false);
        }
      };

      // for woNumber
      vm.autoCompleteWO = {
        columnName: 'woNumber',
        keyColumnName: 'woNumber',
        keyColumnId: (vm.stockAdjustmentModel && vm.stockAdjustmentModel.woNumber) ? vm.stockAdjustmentModel.woNumber : null,
        inputName: 'SearchWO',
        placeholderName: 'Type here to search WO#',
        isRequired: true,
        onSelectCallbackFn: (item) => {
          if (item) {
            // set available stock on wo# selection
            const obj = {
              partID: vm.stockAdjustmentModel.partID,
              woNumber: item.woNumber
            };
            StockAdjustmentFactory.getAvailableQty().query(obj).$promise
              .then((response) => {
                if (response && response.data.availableStock && response.data.availableStock.length > 0) {
                  const stockValue = response.data.availableStock[0];
                  vm.stockAdjustmentModel.cumulativeAssyStock = stockValue.cumulativeAssyStock ? stockValue.cumulativeAssyStock : 0;
                  vm.stockAdjustmentModel.availableQty = stockValue.availableQty ? stockValue.availableQty : 0;
                  vm.stockAdjustmentModel.actualAvalilableQty = stockValue.actualAvalilableQty ? stockValue.actualAvalilableQty : 0; // this is after UMID substract
                }
                vm.headerdata.push(vm.isViewOnly ? null : {
                  value: vm.stockAdjustmentModel.availableQty,
                  label: vm.LabelConstant.StockAdjustment.AvailableStock,
                  displayOrder: 3
                });
                vm.setCummulativeQty();
              }).catch((error) => BaseService.getErrorLog(error));

            vm.stockAdjustmentModel.woNumber = item.woNumber;
            vm.stockAdjustmentModel.woID = item.workorder ? item.workorder.woID : null;
            vm.getExistingAssyWOUMIDStoclDet();
            vm.headerdata.push({
              value: vm.stockAdjustmentModel.woNumber,
              label: vm.LabelConstant.Workorder.WO,
              displayOrder: 2,
              labelLinkFn: vm.goToWorkorderList,
              valueLinkFn: vm.stockAdjustmentModel.woID ? vm.goToWorkorderDetails : null
            });
          }
          else {
            vm.stockAdjustmentModel.woNumber = null;
            vm.stockAdjustmentModel.woID = null;
            vm.stockAdjustmentModel.availableQty = 0;
            vm.stockAdjustmentModel.cumulativeAssyStock = 0;
            vm.setCummulativeQty();
            vm.headerdata = _.filter(vm.headerdata, (item) => item.label === (vm.LabelConstant.Assembly.ID || vm.LabelConstant.StockAdjustment.AvailableStock));
          }
        }
      };
    };

    /* get total UMID stock */
    vm.getExistingAssyWOUMIDStoclDet = () => {
      if (vm.stockAdjustmentModel.woNumber) {
        ReceivingMaterialFactory.getExistingAssemblyWorkorderDetail().query({ workorderNumber: vm.stockAdjustmentModel.woNumber }).$promise.then((response) => {
          if (response && response.data && response.data[0] && response.data[0].totalUMIDCountAfterShipped) {
            vm.stockAdjustmentModel.totalUMIDCountAfterShipped = response.data[0].totalUMIDCountAfterShipped;
          } else {
            vm.stockAdjustmentModel.totalUMIDCountAfterShipped = 0;
          }
          vm.headerdata.push({
            value: vm.stockAdjustmentModel.totalUMIDCountAfterShipped || 0,
            label: 'UMID Stock',
            displayOrder: 4
          });
        }).catch((error) => BaseService.getErrorLog(error));
      }
    };

    initAutoComplete();
    if (data && data.id) {
      getStockAdjustmentDetail();
    };

    // when pop up open from customer packing slip page then disable assembly/work order auto complete
    if (vm.popupParamData && vm.popupParamData.isAddDataFromCustomerPackingSlipPage && vm.popupParamData.customerPackingSlipDet) {
      vm.isDisableToAccess = true;
      vm.isDisableWO = vm.popupParamData && vm.popupParamData.woNumber ? true : false;
      vm.stockAdjustmentModel.partID = vm.popupParamData.customerPackingSlipDet.partID;
      vm.stockAdjustmentModel.woNumber = vm.popupParamData.customerPackingSlipDet.woNumber;
      getPartSearch({ query: vm.popupParamData.customerPackingSlipDet.PIDCode }, true);
      getAssyWOList({ query: vm.stockAdjustmentModel.woNumber, partID: vm.stockAdjustmentModel.partID }, true);
    }

    /*Used to Save records*/
    vm.addUpdateStockAdjustment = () => {
      vm.isSubmit = true;
      if (BaseService.focusRequiredField(vm.stockAdjustmentForm)) {
        vm.isSubmit = false;
        return;
      }

      //if (vm.stockAdjustmentModel.openingStock < ((vm.stockAdjustmentModel.actualAvalilableQty || 0) * -1)) {
      //  return;
      //}

      const stockAdjustmentInfo = {
        partID: vm.stockAdjustmentModel.partID,
        woNumber: vm.stockAdjustmentModel.woNumber,
        woID: vm.stockAdjustmentModel.woID,
        serialNo: vm.stockAdjustmentModel.serialNo,
        openingStock: vm.stockAdjustmentModel.openingStock,
        type: CORE.ASSY_STOCK_TYPE.AdjustmentStock,
        openingdate: BaseService.getAPIFormatedDate(vm.stockAdjustmentModel.openingdate ? vm.stockAdjustmentModel.openingdate : vm.todayDate),
        PIDCode: vm.stockAdjustmentModel.PIDCode,
        cumulativeAssyQty: vm.cumulativeAssyStock
      };

      if (data && data.id) {
        // code to update
        vm.cgBusyLoading = StockAdjustmentFactory.StockAdjustment().update({
          id: data.id
        }, stockAdjustmentInfo).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            BaseService.currentPagePopupForm.pop();
            $mdDialog.hide(res.data);
          }
          else {
            /*Set focus on first enabled field after user click Ok button*/
            if (checkResponseHasCallBackFunctionPromise(res)) {
              res.alretCallbackFn.then(() => {
                BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.stockAdjustmentForm);
              });
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      else {
        // code to add
        vm.cgBusyLoading = StockAdjustmentFactory.StockAdjustment().save(stockAdjustmentInfo).$promise.then((res) => {
          if (res && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
            BaseService.currentPagePopupForm.pop();
            $mdDialog.hide(res.data);
          }
          else {
            /*Set focus on first enabled field after user click Ok button*/
            if (checkResponseHasCallBackFunctionPromise(res)) {
              res.alretCallbackFn.then(() => {
                BaseService.focusOnFirstEnabledFieldOnDirtyStateOrApiResponse(vm.stockAdjustmentForm);
              });
            }
          }
        }).catch((error) => BaseService.getErrorLog(error));
      }
      vm.isSubmit = false;
    };


    /* hyperlink for part list page */
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };

    /* go to part details */
    vm.goToPartDetails = () => {
      BaseService.goToComponentDetailTab(null, vm.stockAdjustmentModel.partID);
      return false;
    };

    /* go to workorder list */
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    };
    /* go to workorder detail page */
    vm.goToWorkorderDetails = () => {
      BaseService.goToWorkorderDetails(vm.stockAdjustmentModel.woID);
      return false;
    };

    vm.cancel = () => {
      const isDirty = vm.checkFormDirty(vm.stockAdjustmentForm);
      if (isDirty) {
        const data = {
          form: vm.stockAdjustmentForm
        };
        BaseService.showWithoutSavingAlertForPopUp(data);
      } else {
        BaseService.currentPagePopupForm.pop();
        $mdDialog.cancel();
      }
    };

    /* set cummulative qty of Assy on adjustment qty change */
    vm.setCummulativeQty = () => {
      if (!vm.stockAdjustmentModel.woID) {
        vm.cumulativeAssyStock = parseInt(vm.stockAdjustmentModel.cumulativeAssyStock) + parseInt(vm.stockAdjustmentModel.openingStock ? vm.stockAdjustmentModel.openingStock : 0);
        vm.aftAdjustOtherWOQty = parseInt(vm.cumulativeAssyStock) - (parseInt(vm.stockAdjustmentModel.availableQty) + parseInt(vm.stockAdjustmentModel.openingStock ? vm.stockAdjustmentModel.openingStock : 0));
      }
      else {
        if (vm.stockAdjustmentModel.openingStock && (vm.stockAdjustmentModel.openingStock > vm.stockAdjustmentModel.actualAvalilableQty || vm.stockAdjustmentModel.openingStock < (-1) * vm.stockAdjustmentModel.actualAvalilableQty)) {
          const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.STOCK_ADJUSTMENT_NOT_MORE_THAN_AVAILABLE_QTY);
          messageContent.message = stringFormat(messageContent.message, vm.stockAdjustmentModel.woNumber);
          const model = {
            messageContent: messageContent,
            btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
            canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
          };
          return DialogFactory.messageConfirmDialog(model).then((yes) => {
            if (yes) {
              vm.cumulativeAssyStock = parseInt(vm.stockAdjustmentModel.cumulativeAssyStock) + parseInt(vm.stockAdjustmentModel.openingStock ? vm.stockAdjustmentModel.openingStock : 0);
              vm.aftAdjustOtherWOQty = parseInt(vm.cumulativeAssyStock) - (parseInt(vm.stockAdjustmentModel.availableQty) + parseInt(vm.stockAdjustmentModel.openingStock ? vm.stockAdjustmentModel.openingStock : 0));
              setFocus('stockAdjustmentNotes');
            }
          }, () => {
            vm.stockAdjustmentModel.openingStock = null;
            setFocus('adjustmentQty');
          }).catch((error) => BaseService.getErrorLog(error));
        }
      }
    };

    /* view assembly stock details */
    vm.ViewAssemblyStockStatus = () => {
      const data = {
        partID: vm.stockAdjustmentModel.partID,
        rohsIcon: vm.stockAdjustmentModel.rohsIcon,
        rohsName: vm.stockAdjustmentModel.rohsName,
        mfgPN: vm.stockAdjustmentModel.mfgPN,
        PIDCode: vm.stockAdjustmentModel.PIDCode
      };
      DialogFactory.dialogService(
        CORE.ASSEMBLY_STOCK_STATUS_MODAL_CONTROLLER,
        CORE.ASSEMBLY_STOCK_STATUS_MODAL_VIEW,
        null,
        data).then(() => { // empty
        }, () => { // empty
        }, (err) => BaseService.getErrorLog(err));
    };

    // check for dirty form
    vm.checkFormDirty = (form, columnName) => BaseService.checkFormDirty(form, columnName);

    // on load submit form
    angular.element(() => {
      BaseService.currentPagePopupForm.push(vm.stockAdjustmentForm);
    });

    // close popup on page destroy
    $scope.$on('$destroy', () => {
      // commented as it close all other existing opened popup
      //$mdDialog.hide(false, { closeAll: true });
    });
  }
})();
