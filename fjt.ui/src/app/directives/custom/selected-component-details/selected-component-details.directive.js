(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('selectedComponentDetails', selectedComponentDetails);

  /** @ngInject */
  function selectedComponentDetails(BaseService, PRICING, RFQTRANSACTION, CORE) {
    let directive = {
      restrict: 'E',
      replace: true,
      scope: {
        rowData: '=',
        qtyDetailsList: "=",
        requestQty: "=",
        selectPrice: "&",
        selectedPageName: "=",
        isShow: "=",
        totalAssyPrice: "=",
        selectedFilter: "=",
        totalLineItems: "=",
        consolidatedQty: "=?",
        priceGroupId: "=?",
      },
      templateUrl: 'app/directives/custom/selected-component-details/selected-component-details.html',
      controller: selectedComponentDetailsCtrl,
      controllerAs: 'vm',
      link: function (scope, element, attrs) {
        scope.$watch('rowData', function (newValue) {

          scope.rowData = newValue;
          // get no of times value avaiable in stock
          let calucalateNoTimes = (required, available) => {
            // e.g required: 4, available:1000 => noOfTimes = (available/required)
            return (available / required).toFixed(1) + 'x';
          }

          // get string if value is zero
          let checkZeroValue = (numOfPosition) => {
            return numOfPosition ? (numOfPosition) : (numOfPosition == 0 ? numOfPosition : "");
          }
          scope.supplierAuthorize = CORE.SUPPLIER_AUTHORIZE_TYPE;
          let findQtyObjData = _.find(scope.qtyDetailsList, { 'consolidateID': scope.rowData.id, 'requestQty': scope.requestQty, 'rfqPriceGroupId': scope.priceGroupId});
          if (!findQtyObjData && scope.priceGroupId != null) {
            findQtyObjData = _.find(scope.qtyDetailsList, { 'consolidateID': scope.rowData.id, 'rfqPriceGroupId': scope.priceGroupId });
          }
          if (findQtyObjData) {
            let requestQty = findQtyObjData.requestQty;

            let numOfPosition = scope.rowData.numOfPosition;
            numOfPosition = checkZeroValue(numOfPosition)
            scope.ApiNoOfPosition = checkZeroValue(findQtyObjData.ApiNoOfPosition);
            scope.unitName = findQtyObjData.abbreviation;
            let qpa = scope.rowData.qpa;
            scope.min = findQtyObjData.min;
            scope.mult = findQtyObjData.mult;
            scope.unitPrice = findQtyObjData.unitPrice ? findQtyObjData.unitPrice.toFixed(_unitFilterDecimal) : findQtyObjData.unitPrice;
            scope.currentStock = scope.rowData.uomID > 0 ? parseFloat(findQtyObjData.currentStock ? findQtyObjData.currentStock.toFixed(_amountFilterDecimal) : findQtyObjData.currentStock) : findQtyObjData.currentStock;
            scope.supplierStock = findQtyObjData.supplierStock ? scope.rowData.uomID > 0 ? parseFloat(findQtyObjData.supplierStock.toFixed(_amountFilterDecimal)) : findQtyObjData.supplierStock : 0;
            scope.grossStock = findQtyObjData.grossStock ? scope.rowData.uomID > 0 ? parseFloat(findQtyObjData.grossStock.toFixed(_amountFilterDecimal)) : findQtyObjData.grossStock : 0;
            scope.selectedPIDCode = findQtyObjData.selectedPIDCode;
            scope.selectionMode = findQtyObjData.selectionMode;
            scope.supplier = findQtyObjData.supplier;
            scope.leadTime = findQtyObjData.leadTime;
            scope.pricingSuppliers = findQtyObjData.pricingSuppliers;
            scope.ReviewPricingTabs = PRICING.REVIEW_PRICING_TABS;
            scope.SelectedTabName = scope.selectedPageName;
            scope.quoteQty = findQtyObjData.quoteQty;
            scope.isanyUpdate = findQtyObjData.isBomUpdate;
            scope.authorizeType = findQtyObjData.authorizeType;
            scope.connectorTypeID = findQtyObjData.connecterTypeID;
            scope.unitEachPrice = findQtyObjData.unitEachPrice;
            scope.quoteQtyEach = findQtyObjData.quoteQtyEach;
            scope.supplierEachStcok = findQtyObjData.supplierEachStcok;
            scope.componentID = findQtyObjData.componentid;
            // total quantity required for request assembly 
            // (RequestedQty * Quantity Per Assembly)
            scope.totalRequiredQty = Math.round((requestQty * qpa)*10)/10;
            scope.reqQty = Math.round((requestQty * qpa)*10)/10;
            if (findQtyObjData.rfqPriceGroupId != null) {
              scope.totalRequiredQty = (requestQty);
              scope.reqQty = Math.round((scope.consolidatedQty * qpa)*10)/10;
            }
            //vm.totalRequiredQty = (qpa ? qpa : 0) * (requestQty);
            //// if no position is available than multiply with total quantity
            if (Number.isInteger(scope.ApiNoOfPosition) && findQtyObjData.connecterTypeID == CORE.ConnectorType.HEADERBREAKAWAY.ID) {
              scope.quoteQty = scope.quoteQty;
              //numOfPosition = numOfPosition ? numOfPosition : (findQtyObjData.noOfRows ? findQtyObjData.noOfRows : 1);
              //scope.totalRequiredQty = (scope.totalRequiredQty * (numOfPosition / (findQtyObjData.noOfRows ? findQtyObjData.noOfRows : 1)));
            }
            // Check Quantity is sufficient or not.
            scope.isSufficientQty = (scope.currentStock) >= (scope.totalRequiredQty);
            scope.isSufficientCumulativeQty = (scope.grossStock) >= (scope.totalRequiredQty);
            scope.actualReqQtyPrice = Math.round((scope.reqQty * scope.unitEachPrice)*10)/10;
            scope.assyPrice = (qpa * scope.unitEachPrice);

            // total difference between current stock available and requested required quantity 
            // (CurrentStock - (RequestedQty * Quantity Per Assembly))


            // toal final price after calculation of min and mult for requested qty


            // total qty whose price detail avaiblable
            // (Total Price/Unit Price for selected part)
            scope.totalQty = scope.quoteQty;

            //total excess quantity  is we have to buy extra quantity
            if (Number.isInteger(scope.ApiNoOfPosition) && findQtyObjData.connecterTypeID == CORE.ConnectorType.HEADERBREAKAWAY.ID) {
              numOfPosition = numOfPosition ? numOfPosition : 1;
              scope.excessQty = (scope.totalQty) - (scope.totalRequiredQty * numOfPosition);
              scope.totalCostQty = findQtyObjData.finalPrice ? (Math.abs(((scope.totalQty * findQtyObjData.unitPrice) * 1) / 1)).toFixed(_amountFilterDecimal) : findQtyObjData.finalPrice;
              scope.totalPrice = (Math.abs(((qpa * numOfPosition * findQtyObjData.unitPrice) * 1) / 1)).toFixed(_unitFilterDecimal);//findQtyObjData.finalPrice ? findQtyObjData.finalPrice.toFixed(6) : findQtyObjData.finalPrice;
              scope.actualPrice = scope.totalRequiredQty * numOfPosition * findQtyObjData.unitPrice;
              scope.actualPrice = scope.actualPrice ? (Math.abs((scope.actualPrice * 1) / 1)).toFixed(_amountFilterDecimal) : scope.actualPrice;
              if (scope.selectedFilter.ID == RFQTRANSACTION.PRICE_FILTER.GetRFQCustomRulesLineItems.ID) {
                let QtyObjData = _.find(scope.totalAssyPrice, { 'requestQty': scope.requestQty });
                scope.weightage = ((((Math.abs(((qpa * numOfPosition * parseFloat(findQtyObjData.unitPrice)) * 1) / 1)) * 100) / QtyObjData.TotalExtendedPrice)).toFixed(_amountFilterDecimal);
              }
              else {
                scope.weightage = null;
              }
              let difference = ((scope.currentStock) - (scope.totalRequiredQty * numOfPosition));
              scope.isSufficientQty = (scope.supplierEachStcok) >= (scope.totalRequiredQty);
              scope.isSufficientCumulativeQty = (scope.grossStock) >= (scope.totalRequiredQty * numOfPosition);
              scope.differenceQty = (difference > 0) ? difference : '(' + (Math.abs(difference)).toFixed(_amountFilterDecimal) + ')';
              scope.noOfTimes = scope.isSufficientQty ? calucalateNoTimes(scope.totalRequiredQty * numOfPosition, scope.currentStock) : "0x";

            }
            else {
              let difference = ((scope.currentStock) - (scope.totalRequiredQty));
              scope.differenceQty = (difference > 0) ? difference : '(' + (Math.abs(difference)).toFixed(_amountFilterDecimal) + ')';
              scope.excessQty = (scope.totalQty - scope.totalRequiredQty) > 0 ? (scope.totalQty - scope.totalRequiredQty) : 0;
              scope.totalCostQty = findQtyObjData.finalPrice ? (Math.abs(((scope.quoteQty * findQtyObjData.unitPrice) * 1) / 1)).toFixed(_amountFilterDecimal) : findQtyObjData.finalPrice;
              scope.totalPrice = (Math.abs(((qpa * findQtyObjData.unitPrice) * 1) / 1)).toFixed(_unitFilterDecimal);//findQtyObjData.finalPrice ? findQtyObjData.finalPrice.toFixed(6) : findQtyObjData.finalPrice;
              scope.actualPrice = scope.totalRequiredQty * findQtyObjData.unitPrice;
              scope.actualPrice = scope.actualPrice ? (Math.abs((scope.actualPrice * 1) / 1)).toFixed(_amountFilterDecimal) : scope.actualPrice;
              if (scope.selectedFilter.ID == RFQTRANSACTION.PRICE_FILTER.GetRFQCustomRulesLineItems.ID) {
                let QtyObjData = _.find(scope.totalAssyPrice, { 'requestQty': scope.requestQty });
                scope.weightage = ((((Math.abs(((qpa * parseFloat(findQtyObjData.unitPrice)) * 1) / 1)) * 100) / QtyObjData.TotalExtendedPrice)).toFixed(_amountFilterDecimal);
              }
              else {
                scope.weightage = null;
              }
              scope.noOfTimes = scope.isSufficientQty ? calucalateNoTimes(scope.totalRequiredQty, scope.currentStock) : "0x";
            }

            // Actual Assembly price should be for assembly request quantity
            // (Quantity Per Assembly * Unit Price for selected part)
            //let actualPrice = qpa * unitPrice;


            // total excess price is difference between total final price for requested quantity and actual price for requested quantity
            // excessprice = totalPrice - actualPrice
            scope.excessPrice = scope.excessQty * findQtyObjData.unitPrice;
            scope.excessPrice = scope.excessPrice ? scope.excessPrice.toFixed(_unitFilterDecimal) : scope.excessPrice;

            scope.gotoPartMatster = () => {
                BaseService.goToComponentDetailTab(null, scope.componentID);
            }
          }

        })

      }
    };
    return directive;


    /** @ngInject */
    /**
    * Controller for view data of selected component details
    *
    * @param
    */
    function selectedComponentDetailsCtrl($scope, $element, $attrs, $filter) {
      let vm = this;
      vm.isShow = $scope.isShow;
      $scope.$watch('isShow', function (newValue) {
        vm.isShow = $scope.isShow;
      });
      // check null value
      vm.checkNull = (value, type) => {
        if (value == "null" || value == null) {
          return '-';
        } else {
          if (type == 'weeks') {
            value = value + ' Weeks';
          }
        }
        return value;
      }

      vm.getPricing = (rowData, requestQty, event) => {
        if (rowData.mfgPN)
          $scope.selectPrice({ rowData: rowData, requestQty: requestQty, event: event });
      }
    }
  }
})();
