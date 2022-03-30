(function () {
  'use strict';

  angular.module('app.transaction.purchase')
    .controller('PurchaseController', PurchaseController);

  /** @ngInject */
  function PurchaseController($scope, $state, $stateParams, $timeout, $q, BaseService, DialogFactory, USER, CORE, TRANSACTION, ReceivingMaterialFactory, PurchaseFactory, KitAllocationFactory, RFQTRANSACTION, PRICING, PartCostingFactory, NotificationFactory) {
    const vm = this;
    vm.LabelConstant = CORE.LabelConstant;
    vm.EmptyMesssage = TRANSACTION.TRANSACTION_EMPTYSTATE.PURCHASE_CONSOLIDATED;
    vm.path = stringFormat("{0}{1}", WebsiteBaseUrl, RFQTRANSACTION.PRICING_UPDATE_STOCK);
    let salesOrderDetailId = $stateParams.id;
    let pPartId = $stateParams.partId;
    vm.PRICING_STATUS = PRICING.PRICING_STATUS;
    vm.salesOrderDetail = {};
    vm.isSelectSO = false;
    vm.click = 1;
    let lastSelect = {};
    vm.DefaultDateFormat = _dateDisplayFormat;
    vm.isSelectSONotFound = true;
    vm.isNoDataFound = false;
    vm.isReCalculate = false;
    vm.subAssemblyList = [];
    vm.isReCalculateDisable = true;
    vm.packagingAlias = true;
    let splitterSize = {
      pageHeight: 100,
      pageDefaultHeight: 100,
      pageHeightStep: 10,
      consolidateSplitter: 100,
      pageHeaderSize: 275
    };
    vm.goToSalesOrderList = () => {
      BaseService.goToSalesOrderList();
      return false;
    }
    $scope.splitPaneProperties = {};
    $scope.splitSubPaneProperties = {};
    $scope.splitPanePurchaseProperties = {};
    vm.goToManageSalesOrder = () => {
      BaseService.goToManageSalesOrder(vm.salesOrderDetail.soId);
      return false;
    }

    let getSalesOrderList = () => {
      return ReceivingMaterialFactory.get_PO_SO_Assembly_List().query().$promise.then((response) => {
        vm.SalesOrderNumberList = response.data;
        return vm.SalesOrderNumberList;
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    let autocompletePromise = [getSalesOrderList()];
    vm.cgBusyLoading = $q.all(autocompletePromise).then((responses) => {
      initAutoComplete();
      if (salesOrderDetailId) {
        let salesOrder = _.find(vm.SalesOrderNumberList, (data) => { return data.SalesOrderDetailId == salesOrderDetailId });
        selectSONumber(salesOrder);
      }
    }).catch((error) => {
      return BaseService.getErrorLog(error);
    });

    let initAutoComplete = () => {
      vm.autoCompleteSO = {
        columnName: 'salescolumn',
        keyColumnName: 'SalesOrderDetailId',
        keyColumnId: null,
        inputName: 'SO#',
        placeholderName: 'SO#',
        isRequired: false,
        isAddnew: false,
        callbackFn: getSalesOrderList,
        onSelectCallbackFn: selectSONumber
      }
    }

    let kitAllocationAssyList = (salesOrderDetailId) => {
      vm.cgBusyLoading = PurchaseFactory.kitAllocationAssyList().query({ id: salesOrderDetailId }).$promise.then((response) => {
        vm.assyList = response.data;
        let objFirst = _.first(vm.assyList);
        let objLast = _.last(vm.assyList);
        vm.salesOrderDetail.kitAllocationInternalVersion = objFirst ? objFirst.bomInternalVersionString : null;
        vm.salesOrderDetail.kitAllocationKitQty = objFirst ? objFirst.kitQty : 0;
        vm.salesOrderDetail.kitAllocationMrpQty = objFirst ? objFirst.mrpQty : 0;
        vm.salesOrderDetail.currentInternalVersion = objLast ? objLast.liveVersion : null;

        if (!vm.salesOrderDetail.kitAllocationInternalVersion && !vm.salesOrderDetail.currentInternalVersion) {
          vm.isReCalculateDisable = false;
        }

        if (vm.assyList.length > 0) {
          if ((vm.salesOrderDetail.kitAllocationKitQty != vm.salesOrderDetail.kitQty) || (vm.salesOrderDetail.kitAllocationMrpQty != vm.salesOrderDetail.soQty) || (vm.salesOrderDetail.kitAllocationInternalVersion != vm.salesOrderDetail.currentInternalVersion) && vm.salesOrderDetail.salesOrderDetailStatus == CORE.SalesOrderCompleteStatusGridHeaderDropdown[1].value) {
            vm.isReCalculateDisable = false;
            var messageContent = '';

            if (vm.salesOrderDetail.kitAllocationInternalVersion != vm.salesOrderDetail.currentInternalVersion) {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RE_CALCULATE_INTERNALVERSIO);
              messageContent.message = stringFormat(messageContent.message, vm.salesOrderDetail.currentInternalVersion, vm.salesOrderDetail.kitAllocationInternalVersion);
            } else {
              messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.RECEIVING.RE_CALCULATE_KITQTY);
              messageContent.message = stringFormat(messageContent.message, vm.salesOrderDetail.soNumber);
            }

            var model = {
              messageContent: messageContent,
              multiple: true
            };
            DialogFactory.messageAlertDialog(model);
            vm.isSelectSONotFound = false;
            vm.isReCalculate = true;
            return;
          }

          vm.isSelectSONotFound = false;
          vm.isNoDataFound = false;
          vm.tabIndexToNavigate = null;
          var kitParam = '({id: ' + salesOrderDetailId + ', partId: 0})';
          var subAssembly = {
            id: 0,
            partId: 0,
            src: TRANSACTION.TRANSACTION_PURCHASE_STATE + kitParam,
            pIDCode: 'Consolidated',
            tabIndex: 0,
            isActiveTab: !pPartId || pPartId == 0 ? true : false
          };
          vm.subAssemblyList.push(subAssembly);

          _.each(vm.assyList, function (obj, index) {
            if (vm.assyList.length != index + 1) {
              var kitParam = '({id: ' + salesOrderDetailId + ', partId: ' + obj.partId + '})';
              if (obj.partId == pPartId)
                vm.tabIndexToNavigate = index + 1;
              var subAssembly = {
                id: index + 1,
                partId: obj.partId,
                src: TRANSACTION.TRANSACTION_PURCHASE_STATE + kitParam,
                level: obj.bomAssyLevel,
                pIDCode: obj.kit_allocation_component.PIDCode,
                tabIndex: index + 1,
                isActiveTab: obj.partId == pPartId ? true : false,
                kitQty: obj.totalAssyBuildQty,
                subAssyMrpQty: obj.totalAssyMrpQty,
                kitRohsIcon: stringFormat(CORE.RoHSImageFormat, CORE.WEB_URL, USER.ROHS_BASE_PATH, obj.kit_allocation_component.rfq_rohsmst.rohsIcon),
                kitRohsName: obj.kit_allocation_component.rfq_rohsmst.name
              };
              vm.subAssemblyList.push(subAssembly);
            }
          })
          $timeout(function () {
            vm.selectedTabIndex = vm.tabIndexToNavigate ? vm.tabIndexToNavigate : 0;
          });
        } else {
          vm.isSelectSONotFound = false;
          vm.isNoDataFound = true;
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    vm.onTabChanges = (item) => {
      vm.selectedTabIndex = item.tabIndex;
    }

    let selectSONumber = (item) => {
      if (item && lastSelect && item['PartID'] == lastSelect['PartID']) {
        return;
      }

      if (item) {
        vm.salesOrderDetail.poNumber = item['Po Number'];
        vm.salesOrderDetail.soNumber = item['Sales Order'];
        vm.salesOrderDetail.soId = item['Sales Order ID'];
        vm.salesOrderDetail.assyName = item['Assy Name'];
        vm.salesOrderDetail.nickName = item['NickName'];
        vm.salesOrderDetail.poQty = item['PO Qty'];
        vm.salesOrderDetail.soQty = item['mrpQty'];
        vm.salesOrderDetail.mrpQty = item['mrpQty'];
        vm.salesOrderDetail.kitQty = item['kitQty'];
        vm.salesOrderDetail.partId = item['PartID'];
        vm.salesOrderDetail.salesOrderDetailStatus = item['Status'];
        vm.salesOrderDetail.rohs = item['RoHSName'];
        vm.salesOrderDetail.rohsIcon = item['RohsIcon'];
        vm.salesOrderDetail.componentID = item['PartID'];
        vm.salesOrderDetail.RoHSStatusIcon = stringFormat(CORE.RoHSImageFormat, CORE.WEB_URL, USER.ROHS_BASE_PATH, vm.salesOrderDetail.rohsIcon);
        vm.salesOrderDetail.materialDueDate = item['materialDueDate'];
        vm.salesOrderDetail.shippingDate = item['shippingDate'];
        vm.salesOrderDetail.assyID = item['Assy ID'];
        vm.salesOrderDetail.PoDate = item['Po Date'];
        vm.salesOrderDetail.customerID = item['Customer ID'];
        vm.isSelectSO = true;
        vm.salesOrderDetail.SalesOrderDetailId = item['SalesOrderDetailId'];
        vm.autoCompleteSO.keyColumnId = item['SalesOrderDetailId'];
        kitAllocationAssyList(item['SalesOrderDetailId']);

        $state.transitionTo($state.$current, { id: item['SalesOrderDetailId'], partId: pPartId ? pPartId : 0 }, { location: true, inherit: false, notify: false });
        setInitialPageHeight();
      } else {
        vm.isSelectSO = false;
        vm.isSelectSONotFound = true;
        vm.isNoDataFound = false;
        vm.isReCalculate = false;
        vm.salesOrderDetail = {};
        vm.isReCalculateDisable = true;
        vm.subAssemblyList = [];
        $state.transitionTo($state.$current, {}, { location: true, inherit: false, notify: true });
      }
      lastSelect = item;
    }

    vm.goToAssyMaster = () => {
      BaseService.goToComponentDetailTab(null, vm.salesOrderDetail.partId);
      return false;
    }

    vm.goToSOList = () => {
      BaseService.openInNew(TRANSACTION.TRANSACTION_SALESORDER_STATE, {});
    }

    vm.goToAssy = () => {
      BaseService.goToPartList();
      return false;
    }

    vm.uploadBom = () => {
      BaseService.goToComponentBOM(vm.salesOrderDetail.partId);
    }

    vm.reCalculateKitAllocation = () => {
      vm.cgBusyLoading = KitAllocationFactory.reCalculateKitAllocation().query({ partId: vm.salesOrderDetail.partId, sodid: vm.salesOrderDetail.SalesOrderDetailId, kitQty: vm.salesOrderDetail.kitQty, mrpQty: vm.salesOrderDetail.soQty }).$promise.then((response) => {
        if (response.data) {
          $state.go(TRANSACTION.TRANSACTION_PURCHASE_STATE, { id: vm.salesOrderDetail.SalesOrderDetailId, partId: pPartId ? pPartId : 0 }, { reload: true });
        }
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    vm.changePackagingAlias = () => {
      $scope.$broadcast('PurchasePackagingAlias', vm.packagingAlias);
    }

    // Update all purchase linitem pricing
    vm.UpdateAllPricing = (ev) => {
      $scope.$broadcast(TRANSACTION.EventName.UpdateAllPurchasePricing, ev);
    }
    //get stock externally
    vm.stockUpdate = (ev) => {
      $scope.$broadcast(TRANSACTION.EventName.PurchaseStockUpdate, ev);
    }
    let selection = $scope.$on("selectionChange", function (name, data) {
      if (data) {
        vm.kitLineiTemID = data.rfqLineItemsId;
        vm.refMongoTransId = data.refMongoTrnsID;
        vm.click = vm.click + 1;
        vm.refSalesOrderDetID = data.refSalesOrderDetId;
      }
    });

    // method to update pricing status loader
    let updateStatus = $scope.$on(TRANSACTION.EventName.UpdatePurchaseStatus, function (name, data) {
      if (data) {
        if (data.status != vm.PRICING_STATUS.SendRequest) {
          vm.purchaseLoading = false;
        } else {
          vm.purchaseLoading = true;
        }
      }
    });


    // stop all pricing request
    vm.StopAllPricing = (ev) => {
      vm.cgBusyLoading = PartCostingFactory.stopPricingRequests().query({
        pricingApiObj: {
          rfqAssyID: salesOrderDetailId,
          isPurchaseApi: true
        }
      }).$promise.then((res) => {
        vm.purchaseLoading = false;
        if (res && res.data && res.data.msg) {
          NotificationFactory.somethingWrong(res.data.msg);
        }
        $scope.$broadcast('refeshPurchaseGrid');
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    //dynamic height increase for purchase detail and selected part detail grid
    //$scope.$watch('splitPaneProperties.firstComponentSize', function (newValue) {
    //  //for purchase grid
    //  var gridclientHeight = getGridDetail(TRANSACTION.Purchase_Split_UI.PurchaseGridUI);
    //  var clientHeight = $scope.splitPaneProperties.firstComponentSize - 51;
    //  setGridHeight(gridclientHeight, clientHeight);

    //  //for selected part grid
    //  var gridchildclientHeight = getGridDetail(TRANSACTION.Purchase_Split_UI.SelectedPartGridUI);
    //  var clientHeightChild = $scope.splitPaneProperties.lastComponentSize + 13;
    //  setGridHeight(gridchildclientHeight, clientHeightChild);
    //});
    //dynamic height increase for selected price and pricing portion
    //$scope.$watch('splitSubPaneProperties.firstComponentSize', function (newValue) {
    //  //for selected part grid
    //  var gridclientHeight = getGridDetail(TRANSACTION.Purchase_Split_UI.SelectedPartGridUI);
    //  var clientHeight = $scope.splitSubPaneProperties.firstComponentSize - 57;
    //  setGridHeight(gridclientHeight, clientHeight);
    //  //for purchase pricing history grid
    //  var gridchildclientHeight = getGridDetail(TRANSACTION.Purchase_Split_UI.PricingGridUI);
    //  var clientHeightChild = $scope.splitSubPaneProperties.lastComponentSize - 60;
    //  setGridHeight(gridchildclientHeight, clientHeightChild);
    //});
    //grid detail from class name
    function getGridDetail(GridClass) {
      return document.getElementsByClassName(GridClass);
    }
    //grid height can be used with function
    function setGridHeight(gridchildclientHeight, clientHeightChild) {
      if (gridchildclientHeight && gridchildclientHeight.length > 0)
        gridchildclientHeight[0].setAttribute("style", "height:" + clientHeightChild + "px !important;");
    }
    // on move to other controller destory all event
    $scope.$on('$destroy', function () {
      updateStatus();
      selection();
    });
    function setInitialPageHeight() {
      $timeout(function () {
        var body = document.body,
          html = document.documentElement;
        var pageTotalHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

        splitterSize.pageHeight = (1000 - splitterSize.pageHeaderSize);
        splitterSize.pageDefaultHeight = splitterSize.pageHeight;

        $("#splitterDiv").css({ height: splitterSize.pageHeight + 'px' });
      }, _configTimeout);
    }
    angular.element(() => {
      setInitialPageHeight();
    });
    vm.increasePageSize = () => {
      splitterSize.pageHeight += splitterSize.pageHeightStep;
      $("#splitterDiv").css({ height: splitterSize.pageHeight + 'px' });
      $scope.splitPaneProperties.firstComponentSize += splitterSize.pageHeightStep;
      $scope.splitPaneProperties.lastComponentSize -= splitterSize.pageHeightStep;
    }
    vm.decreasePageSize = () => {
      if (splitterSize.pageHeight > splitterSize.pageDefaultHeight) {
        splitterSize.pageHeight -= splitterSize.pageHeightStep;
        $("#splitterDiv").css({ height: splitterSize.pageHeight + 'px' });
        $scope.splitPaneProperties.firstComponentSize -= splitterSize.pageHeightStep;
        $scope.splitPaneProperties.lastComponentSize += splitterSize.pageHeightStep;
      }
    }
    //vm.setDefaultSize = () => {
    //  splitterSize.pageHeight = splitterSize.pageDefaultHeight;
    //  $("#splitterDiv").css({ height: splitterSize.pageHeight + 'px' });
    //  //set default height for purchase main screen
    //  var gridclientHeight = getGridDetail(TRANSACTION.Purchase_Split_UI.PurchaseGridUI);
    //  setGridHeight(gridclientHeight, "calc(100vh - 540px) !important");
    //  //set default height for price select part
    //  var gridclientHeight = getGridDetail(TRANSACTION.Purchase_Split_UI.SelectedPartGridUI);
    //  setGridHeight(gridclientHeight, "calc(100vh - 822px) !important");
    //  // set default height for price grid
    //  var gridclientHeight = getGridDetail(TRANSACTION.Purchase_Split_UI.PricingGridUI);
    //  setGridHeight(gridclientHeight, "calc(100vh - 887px) !important");
    //  //set default spliter 1st splitter height
    //  $scope.splitPaneProperties = {
    //    firstComponentSize: 106,
    //    lastComponentSize: 100
    //  };
    //  //set default 2nd splitter height
    //  $scope.splitPaneProperties = {
    //    firstComponentSize: 487,
    //    lastComponentSize: 100
    //  };
    //}


    //open ship plan detail popup
    vm.shipPlanDetail = () => {
      if (vm.autoCompleteSO.keyColumnId) {
        var data = {
          salesOrderDetailId: vm.autoCompleteSO.keyColumnId,
          qty: vm.salesOrderDetail.poQty,
          partID: vm.salesOrderDetail.componentID,
          poNumber: vm.salesOrderDetail.poNumber,
          salesOrderNumber: vm.salesOrderDetail.soNumber,
          rohsIcon: vm.salesOrderDetail.RoHSStatusIcon,
          rohsComplientConvertedValue: vm.salesOrderDetail.rohs,
          mfgPN: vm.salesOrderDetail.assyName,
          PIDCode: vm.salesOrderDetail.assyID,
          PODate: BaseService.getUIFormatedDate(vm.salesOrderDetail.PoDate, vm.DefaultDateFormat)
        }
        DialogFactory.dialogService(
          TRANSACTION.TRANSACTION_PLANN_PURCHASE_CONTROLLER,
          TRANSACTION.TRANSACTION_PLANN_PURCHASE_VIEW,
          event,
          data).then(() => {
          }, (data) => {
          }, (error) => {
            return BaseService.getErrorLog(error);
          });
      }
    }
  }
})();
