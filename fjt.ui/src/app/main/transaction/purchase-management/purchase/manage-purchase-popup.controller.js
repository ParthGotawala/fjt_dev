(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('ManagePurchasePopupController', ManagePurchasePopupController);

  /** @ngInject */
  function ManagePurchasePopupController($q, $scope, $filter, $timeout, data, CORE, TRANSACTION, USER, DialogFactory, BaseService, PurchaseFactory, ManageMFGCodePopupFactory) {
    var vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.LabelConstant = CORE.LabelConstant;
    vm.refAssyId = (data && data.refAssyId) ? data.refAssyId : null;
    vm.rfqLineitemId = (data && data.refRfqLineitem) ? data.refRfqLineitem : null;
    vm.isPackagingAlias = (data && data.isPackagingAlias) ? data.isPackagingAlias : false;
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.PURCHASE_PARTS_DETAILS;
    vm.PIDCodeList = [];
    vm.isUpdatable = true;
    vm.minDate = new Date();
    
    vm.poDateOptions = {
      poDateOpenFlag: false,
      minDate: vm.minDate,
      isTodayDate: true,
      appendToBody: true
    };
    vm.purchase = {
      refComponentId: null,
      poDate: (new Date())
    };

    let initPageInfo = () => {
      vm.pagingInfo = {
        Page: CORE.UIGrid.Page(),
        SortColumns: [['id', 'DESC']],
        SearchColumns: []
      };
    };
    initPageInfo();
    vm.gridOptions = {
      showColumnFooter: false,
      enableRowHeaderSelection: false,
      enableFullRowSelection: false,
      enableRowSelection: false,
      multiSelect: false,
      filterOptions: vm.pagingInfo.SearchColumns,
      exporterMenuCsv: true,
      exporterCsvFilename: 'Purchase list Parts Details.csv',
      hideMultiDeleteButton: true
    };
    function getPurchasePIDcodeList() {
      let searchObj = {
        rfqLineitemId: vm.rfqLineitemId,
        isPackagingAlias: vm.isPackagingAlias
      }
      return PurchaseFactory.getPurchasePIDcodeSearch().query({ listObj: searchObj }).$promise.then((component) => {
        if (component && component.data) {
          vm.PIDCodeList = component.data.data;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    // serach and get data for mfgcode
    function getMfgSearch(searchObj) {
      return ManageMFGCodePopupFactory.getMfgcodeList().query(searchObj).$promise.then((mfgcodes) => {
        _.each(mfgcodes.data, function (item) {
          item.mfg = item.mfgCode;
          item.mfgCode = stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, item.mfgCode, item.mfgName);
        });
        if (searchObj && searchObj.mfgcodeID != null) {
          vm.component.selectedMFGCodeTxt = mfgcodes.data[0] ? mfgcodes.data[0].mfgCode : "";
          vm.component.mfgcodeID = mfgcodes.data[0] ? mfgcodes.data[0].id : "";
          selectedMfgCode = mfgcodes.data[0];
          $timeout(function () {
            if (vm.autoCompletemfgCode && vm.autoCompletemfgCode.inputName) {
              $scope.$broadcast(vm.autoCompletemfgCode.inputName, selectedMfgCode);
            }
          });
        }
        vm.mfgCodeDetail = mfgcodes.data;
        return mfgcodes.data;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    function getSelectedPIDCode(obj) {
      if (obj) {
        vm.cgBusyLoading = PurchaseFactory.getComponnetMfgDescription().query({ id: obj.id }).$promise.then((response) => {
          if (response && response.data) {
            vm.selectedComponentMfgDescription = response.data.mfgPNDescription;
          }
          else {
            vm.selectedComponentMfgDescription = null;
          }
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      else
        vm.selectedComponentMfgDescription = null;
    }
    function getPONumberSearch(searchObj) {
      return PurchaseFactory.getPONumberSearch().query({ listObj: searchObj }).$promise.then((response) => {     
        if (response && response.data) {
          if (searchObj.id) {
            $timeout(function () {
              if (vm.autoCompletePONumber) 
                $scope.$broadcast(vm.autoCompletePONumber.inputName, response.data.data[0]);
            });
          }
          else {
            return response.data.data;
          }
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    let initAutoComplete = () => {
      vm.autoCompletePID = {
        columnName: 'PIDCode',
        keyColumnName: 'id',
        keyColumnId: vm.purchase ? vm.purchase.refComponentId : null,
        inputName: 'PIDCode',
        placeholderName: vm.LabelConstant.MFG.PID,
        isRequired: true,
        isAddnew: false,
        onSelectCallbackFn: getSelectedPIDCode
      }
      vm.autoCompletemfgCode = {
        columnName: 'mfgCode',
        parentColumnName: 'mfgCodeAlias',
        controllerName: CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
        viewTemplateURL: CORE.MANAGE_MFGCODE_MODAL_VIEW,
        keyColumnName: 'id',
        keyColumnId: vm.purchase ? vm.purchase.distMfgCodeID : null,
        inputName: 'mfgCode',
        placeholderName: "Search Supplier code and add",
        isRequired: true,
        isUppercaseSearchText: true,
        addData: {
          mfgType: CORE.MFG_TYPE.DIST
        },
        isAddnew: BaseService.loginUser ? (BaseService.loginUser.isUserManager || BaseService.loginUser.isUserAdmin || BaseService.loginUser.isUserSuperAdmin) : false,
        callbackFn: function (obj) {
          let searchObj = {
            mfgcodeID: obj.id
          }
          return getMfgSearch(searchObj);
        },
        onSelectCallbackFn: null,
        onSearchFn: function (query) {
          let searchObj = {
            searchQuery: query,
            inputName: vm.autoCompletemfgCode.inputName,
            type: CORE.MFG_TYPE.DIST
          }
          return getMfgSearch(searchObj);
        }
      }
      vm.autoCompletePONumber = {
        columnName: 'poNumber',
        parentColumnName: 'mfgCodeAlias',
        keyColumnName: 'poNumber',
        keyColumnId: data ? data.id : null,
        inputName: 'PONumber',
        placeholderName: 'Search PO# and Add',
        isRequired: true,
        isAddnew: false,
        isUppercaseSearchText: true,
        addData: {},
        matchRequired: false,
        callbackFn: function (obj) {
          let searchObj = {
            mfgcodeID: vm.autoCompletemfgCode.keyColumnId,
            searchQuery: obj
          }
          return getPONumberSearch(searchObj);
        },
        onSelectCallbackFn: function (item) {
          if (item) {
            vm.purchase.poDate = item.poDate;
          }
        },
        onSearchFn: function (query) {
          let searchObj = {
            searchQuery: query,
            mfgcodeID: vm.autoCompletemfgCode.keyColumnId
          }
          return getPONumberSearch(searchObj);
        }
      }
    };

    //initAutoComplete();

    vm.cgBusyLoading = $q.all([getPurchasePIDcodeList()]).then((responses) => {
      vm.cgBusyLoading = $q.all([initAutoComplete()]).then((res) => {
        $timeout(function () {
          
          if (vm.PIDCodeList && vm.PIDCodeList.length == 1) {
            if (vm.autoCompletePID && vm.autoCompletePID.inputName) {
              vm.purchase.refComponentId = vm.PIDCodeList[0].id;
              vm.autoCompletePID.keyColumnId = vm.PIDCodeList[0].id;
            }
          }
        });
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }).catch((error) => {
      return BaseService.getErrorLog(error);
    });

    vm.getExtendedPrice = () => {
      vm.purchase.poExtendedPrice = vm.purchase.poQty * vm.purchase.poPricePerUnit;
    }

    vm.resetPurchaseDetail = () => {
      vm.purchase = {
        id: null,
        poNumber: null,
        poDate: (new Date()),
        //SelectedPoDate: null,
        poQty: null,
        poPricePerUnit: null,
        poExtendedPrice: null
      }
      $scope.$broadcast(vm.autoCompletePID.inputName, null);
      $scope.$broadcast(vm.autoCompletemfgCode.inputName, null);
      $scope.$broadcast(vm.autoCompletePONumber.inputName, null);
      if (vm.ManagePurchaseForm) {
        vm.ManagePurchaseForm.$setPristine();
        vm.ManagePurchaseForm.$setUntouched();
      }
    }
    vm.editManufacturer = (mfgType, mfgcodeID) => {
      if (!mfgcodeID || mfgcodeID <= 0) {
        return;
      }
      var data = {
        id: mfgcodeID,
        mfgType: mfgType
      };
      if (data) {
        data.masterPage = true;
        data.isUpdatable = true;
      }
      else {
        data = {
          mfgType: vm.IsManfucaturer ? CORE.MFG_TYPE.MFG : CORE.MFG_TYPE.DIST,
          masterPage: true
        };
      }
      DialogFactory.dialogService(
        CORE.MANAGE_MFGCODE_MODAL_CONTROLLER,
        CORE.MANAGE_MFGCODE_MODAL_VIEW,
        null,
        data).then(() => {
        }, (data) => {

        },
          (err) => {
            return BaseService.getErrorLog(err);
          });
    };

    vm.savePurchasePartsDetails = () => {
      if (vm.ManagePurchaseForm.$valid && vm.ManagePurchaseForm.$dirty) {
        if (!vm.autoCompletePONumber.searchText && !vm.autoCompletePONumber.keyColumnId)
          return;
        const purchaseObj = {
          id: vm.purchase.id,
          refAssyId: vm.refAssyId,
          refBOMLineID: vm.rfqLineitemId,
          refComponentId: vm.autoCompletePID.keyColumnId,
          distMfgCodeID: vm.autoCompletemfgCode.keyColumnId,
          poNumber: vm.autoCompletePONumber.keyColumnId ? vm.autoCompletePONumber.keyColumnId : vm.autoCompletePONumber.searchText,
          poDate: vm.purchase.poDate,
          poQty: vm.purchase.poQty,
          poPricePerUnit: vm.purchase.poPricePerUnit,
          soNumber: vm.purchase.soNumber
        };
        if (!vm.purchase.id) {
          vm.cgBusyLoading = PurchaseFactory.createPurchaseParts().query({ purchaseObj: purchaseObj }).$promise.then((res) => {
            if (res && res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
              vm.resetPurchaseDetail();
              BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            }
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        }
        else {
          vm.cgBusyLoading = PurchaseFactory.updatePurchasePartsDetails().update({
            id: vm.purchase.id,
          }, purchaseObj).$promise.then((res) => {
            if (res && res.status == CORE.ApiResponseTypeStatus.SUCCESS) {
              vm.resetPurchaseDetail();
              BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
            }
          }).catch((error) => {
            return BaseService.getErrorLog(error);
          });
        }
      }
    }
    /* delete purchase parts details */
    vm.deleteRecord = (purchaseParts) => {
      let selectedIDs = [];
      if (purchaseParts) {
        selectedIDs.push(purchaseParts.id);
      } else {
        vm.selectedRows = vm.selectedRowsList;
        if (vm.selectedRows.length > 0) {
          selectedIDs = vm.selectedRows.map((item) => item.id);
        }
      }
      if (selectedIDs) {
        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.DELETE_CONFIRM_MESSAGE);
        messageContent.message = stringFormat(messageContent.message, "Purchase list parts detail", selectedIDs.length);
        let obj = {
          messageContent: messageContent,
          btnText: CORE.MESSAGE_CONSTANT.BUTTON_DELETE_TEXT,
          canbtnText: CORE.MESSAGE_CONSTANT.BUTTON_CANCEL_TEXT
        };
        let objIDs = {
          id: selectedIDs,
          CountList: false
        }
        DialogFactory.messageConfirmDialog(obj).then((yes) => {
          if (yes) {
            vm.cgBusyLoading = PurchaseFactory.deletePurchasePartsDetails().query({ objIDs: objIDs }).$promise.then((data) => {
              if (data && data.data && (data.data.length > 0 || data.data.transactionDetails)) {
                var data = {
                  TotalCount: data.data.transactionDetails[0].TotalCount,
                  pageName: CORE.PageName.component
                }
                BaseService.deleteAlertMessageWithHistory(data, function (ev) {
                  let IDs = {
                    id: selectedIDs,
                    CountList: true,
                  };
                  return ComponentFactory.deleteComponent().query({
                    objIDs: IDs,
                  }).$promise.then((res) => {
                    let data = {};
                    data = (res && res.data) ? res.data : [];

                    data.pageTitle = component ? component.name : null;
                    data.PageName = CORE.PageName.component;
                    data.selectedIDs = stringFormat('{0}{1}', selectedIDs.length, ' Selected');
                    if (res.data) {
                      DialogFactory.dialogService(
                        USER.ADMIN_SHOW_TRANSACTION_DETAILS_CONTROLLER,
                        USER.ADMIN_SHOW_TRANSACTION_DETAILS_VIEW,
                        ev,
                        data).then((res) => {
                        }, () => {
                        });
                    }
                  }).catch((error) => {
                    return BaseService.getErrorLog(error);
                  });
                });
              }
              else {
                BaseService.reloadUIGrid(vm.gridOptions, vm.pagingInfo, initPageInfo, vm.loadData);
                vm.gridOptions.clearSelectedRows();
              }

            }).catch((error) => {
              return BaseService.getErrorLog(error);
            });
          }

        }, (cancel) => {
        }).catch((error) => {
          return BaseService.getErrorLog(error);
        });
      }
      else {
        //show validation message no data selected
        let messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.SELECT_ONE);
        messageContent.message = stringFormat(messageContent.message, "part");
        let alertModel = {
          messageContent: messageContent,
          multiple: true
        };
        DialogFactory.messageAlertDialog(alertModel);
      }
    };
    vm.sourceHeader = [
      {
        field: 'Action',
        cellClass: 'layout-align-center-center',
        displayName: 'Action',
        width: 100,
        cellTemplate: `<grid-action-view grid="grid" row="row"></grid-action-view>`,
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
      },
      {
        field: '#',
        width: 60,
        cellTemplate: '<div class="ui-grid-cell-contents"><span><b>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</b></span></div>',
        enableFiltering: false,
        enableSorting: false,
        enableCellEdit: false,
        allowCellFocus: false,
      },
      {
        field: 'imageURL',
        width: 70,
        displayName: 'Image',
        cellTemplate: '<div class="ui-grid-cell-contents">'
          + '<img class="cm-grid-images" ng-src="{{COL_FIELD}}"></img>'
          + '</div>',
        enableFiltering: false,
        enableSorting: false,
        exporterSuppressExport: true,
        allowCellFocus: false,
      },
      {
        field: 'PIDCode',
        displayName: vm.LabelConstant.MFG.PID,
        cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link component-id="row.entity.refComponentId"\
                                             label="grid.appScope.$parent.vm.LabelConstant.MFG.PID"\
                                             value="COL_FIELD"\
                                             is-copy="true"\>\
                      </common-pid-code-label-link></div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.PID,
        enableCellEdit: false,
        enableFiltering: true,
        enableSorting: true,
        allowCellFocus: false
      },
      {
        field: 'supplierMfgCode',
        displayName: 'Supplier Code',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                            <a class="cm-text-decoration underline" ng-if="row.entity.distMfgCodeID > 0"\
                                ng-click="grid.appScope.$parent.vm.editManufacturer(row.entity.supplierMfgType,row.entity.distMfgCodeID);"\
                                tabindex="-1">{{COL_FIELD}}</a>\
                            <span ng-if="row.entity.distMfgCodeID <= 0">{{COL_FIELD}}</span>\
                        </div>',
        width: 100,
        enableCellEdit: false,
        enableFiltering: true,
        enableSorting: true,
        allowCellFocus: false
      },
      {
        field: 'mfgCode',
        displayName: vm.LabelConstant.MFG.MFG,
        width: 120,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">\
                          <a class="cm-text-decoration underline" ng-if="row.entity.mfgcodeID > 0"\
                              ng-click="grid.appScope.$parent.vm.editManufacturer(row.entity.mfgType,row.entity.mfgcodeID);"\
                              tabindex="-1">{{COL_FIELD}}</a>\
                          <span ng-if="row.entity.mfgcodeID <= 0">{{COL_FIELD}}</span>\
                      </div>',
        allowCellFocus: false
      },
      {
        field: 'mfgPN',
        width: CORE.UI_GRID_COLUMN_WIDTH.MFG_PN,
        displayName: vm.LabelConstant.MFG.MFGPN,
        cellTemplate: '<div class="ui-grid-cell-contents"><common-pid-code-label-link component-id="row.entity.refComponentId"\
                                label="grid.appScope.$parent.vm.LabelConstant.MFG.MFGPN"\
                                value="COL_FIELD"\
                                is-copy="true"\
                                rohs-icon="grid.appScope.$parent.vm.rohsImagePath+row.entity.rohsIcon"\
                                rohs-status="row.entity.rohsComplientConvertedValue"\
                                is-search-digi-key="true"\
                                is-supplier="false">\
                      </common-pid-code-label-link></div>',
        allowCellFocus: false,
      },
      {
        field: 'mfgPNDescription',
        width: 250,
        //displayName: vm.LabelConstant.MFG.MFGPNDescription,
        displayName: 'Part Description',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
      },
      {
        field: 'poNumber',
        displayName: vm.LabelConstant.Purchase.PO,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: 110,
        enableCellEdit: false,
        enableFiltering: true,
        enableSorting: true,
        allowCellFocus: false
      },
      {
        field: 'poDate',
        displayName: vm.LabelConstant.Purchase.PODate,
        type: 'date',
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD | date:grid.appScope.$parent.vm.DefaultDateFormat}}</div>',
        width: CORE.UI_GRID_COLUMN_WIDTH.ONLY_DATE_COLUMN,
        enableCellEdit: false,
        enableFiltering: true,
        enableSorting: true,
        allowCellFocus: false
      },
      {
        field: 'soNumber',
        displayName: vm.LabelConstant.Purchase.SO,
        cellTemplate: '<div class="ui-grid-cell-contents text-left">{{COL_FIELD}}</div>',
        width: 110,
        enableCellEdit: false,
        enableFiltering: true,
        enableSorting: true,
        allowCellFocus: false
      },
      {
        field: 'poQty',
        displayName: vm.LabelConstant.Purchase.PurchasedQty,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | numberWithoutDecimal}}</div>',
        width: 100,
        enableCellEdit: false,
        enableFiltering: true,
        enableSorting: true,
        allowCellFocus: false
      },
      {
        field: 'poPricePerUnit',
        displayName: vm.LabelConstant.Purchase.PricePerUnit,
        type: 'number',
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
        width: 90,
        enableCellEdit: false,
        enableFiltering: true,
        enableSorting: true,
        allowCellFocus: false
      },
      {
        field: 'poExtendedPrice',
        displayName: vm.LabelConstant.Purchase.ExtendedPrice,
        cellTemplate: '<div class="ui-grid-cell-contents grid-cell-text-right">{{COL_FIELD | amount}}</div>',
        width: 100,
        enableCellEdit: false,
        enableFiltering: true,
        enableSorting: true,
        allowCellFocus: false
      },
    ];

    vm.loadData = () => {
      if (vm.pagingInfo.SortColumns.length == 0)
        vm.pagingInfo.SortColumns = [['id', 'DESC']];
      vm.pagingInfo.refAssyId = vm.refAssyId;
      vm.pagingInfo.refBOMLineID = vm.rfqLineitemId;

      vm.cgBusyLoading = PurchaseFactory.getPurchasePartsDetailList().query(vm.pagingInfo).$promise.then((response) => {
        if (vm.gridOptions)
          vm.gridOptions.hideMultiDeleteButton = !vm.enableDeleteOperation;
        if (response && response.data) {
          vm.sourceData = response.data.purchasePartsDetail;
          vm.totalSourceDataCount = response.data.Count;
          if (vm.sourceData && vm.sourceData.length > 0) {
            _.each(vm.sourceData, function (obj) {
              if (obj.imageURL == "" || obj.imageURL == null) {
                obj.imageURL = CORE.NO_IMAGE_COMPONENT;
              }
              else if (!obj.imageURL.startsWith("http://") && !obj.imageURL.startsWith("https://")) {
                obj.imageURL = BaseService.getPartMasterImageURL(obj.documentPath, obj.imageURL);
              }
            });
          }
          if (!vm.gridOptions.enablePaging) {
            vm.currentdata = vm.sourceData.length;
            vm.gridOptions.gridApi.infiniteScroll.resetScroll();
          }
          vm.gridOptions.clearSelectedRows();
          if (vm.totalSourceDataCount == 0) {
            if (vm.pagingInfo.SearchColumns.length > 0) {
              vm.isNoDataFound = false;
              vm.emptyState = 0;
            }
            else {
              vm.isNoDataFound = true;
              vm.emptyState = 0;
            }
          }
          else {
            vm.isNoDataFound = false;
            vm.emptyState = null;
          }
          $timeout(() => {
            vm.resetSourceGrid();
            if (!vm.gridOptions.enablePaging && vm.totalSourceDataCount == vm.currentdata) {
              return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, false);
            }
          });
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    // on scroll down get data 
    vm.getDataDown = () => {
      vm.pagingInfo.Page = vm.pagingInfo.Page + 1;
      vm.cgBusyLoading = PurchaseFactory.getPurchasePartsDetailList().query(vm.pagingInfo).$promise.then((response) => {
        if (response && response.data && response.data.purchasePartsDetail) {
          vm.sourceData = vm.sourceData.concat(response.data.purchasePartsDetail);
        }
        vm.currentdata = vm.sourceData.length;
        if (vm.sourceData && vm.sourceData.length > 0) {
          _.each(vm.sourceData, function (obj) {
            if (obj.imageURL == "" || obj.imageURL == null) {
              obj.imageURL = CORE.NO_IMAGE_COMPONENT;
            }
            else if (!obj.imageURL.startsWith("http://") && !obj.imageURL.startsWith("https://")) {
              obj.imageURL = BaseService.getPartMasterImageURL(obj.documentPath, obj.imageURL);
            }
          });
        }
        vm.gridOptions.gridApi.infiniteScroll.saveScrollPercentage();
        $timeout(() => {
          vm.resetSourceGrid();
          return vm.gridOptions.gridApi.infiniteScroll.dataLoaded(false, vm.totalSourceDataCount != vm.currentdata ? true : false);
        });
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    };

    vm.updateRecord = (row, ev) => {
      if (vm.ManagePurchaseForm) {
        vm.ManagePurchaseForm.$setPristine();
        vm.ManagePurchaseForm.$setUntouched();
      }
      vm.purchase = angular.copy(row.entity);
      vm.minDate = vm.purchase.poDate;
      vm.poDateOptions.minDate = vm.minDate;
      //vm.purchase.SelectedPoDate = vm.purchase.poDate;
      vm.autoCompletePID.keyColumnId = vm.purchase.refComponentId;
      vm.autoCompletemfgCode.keyColumnId = vm.purchase.distMfgCodeID;
      var obj = {
        PIDCode: vm.purchase.PIDCode,
        id: vm.purchase.refComponentId
      };
      $scope.$broadcast(vm.autoCompletePID.inputName, obj);
      var obj = {
        mfgCode: stringFormat(CORE.MESSAGE_CONSTANT.CODE_DISPlAY_FORMAT, vm.purchase.supplierMfgCode, vm.purchase.supplierMfgName),
        id: vm.purchase.distMfgCodeID
      }
      $scope.$broadcast(vm.autoCompletemfgCode.inputName, obj);

      var obj = {
        poNumber: vm.purchase.poNumber,
        poDate: vm.purchase.poDate
      }
      $scope.$broadcast(vm.autoCompletePONumber.inputName, obj);
    }

    vm.checkFormDirty = (form, columnName) => {
      let checkDirty = BaseService.checkFormDirty(form, columnName);
      return checkDirty;
    };
    vm.cancel = () => {
      let isdirty = vm.checkFormDirty(vm.AddMfgCodeForm);
      if (isdirty) {
        BaseService.showWithoutSavingAlertForPopUp();
      } else {
        DialogFactory.closeDialogPopup();
      }
    };

    vm.getMaxLengthValidation = (maxLength, enterTextLength) => {
      return BaseService.getMaxLengthValidation(maxLength, enterTextLength);
    }
    vm.getMinNumberValueValidation = (minValue) => {
      return BaseService.getMinNumberValueValidation(minValue);
    }
    //hyperlink go for list page
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };
    vm.goToManufacturerList = () => {
      BaseService.goToManufacturerList();
    };
  }
})();
