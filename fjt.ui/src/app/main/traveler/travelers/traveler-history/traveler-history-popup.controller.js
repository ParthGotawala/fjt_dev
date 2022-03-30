(function () {
  'use strict';

  angular
    .module('app.admin')
    .controller('TravelerHistoryPopupController', TravelerHistoryPopupController);

  /** @ngInject */
  function TravelerHistoryPopupController($mdDialog, $filter, data, WorkorderTransFactory, CORE, DialogFactory, TRAVELER, BaseService) {
    const vm = this;
    var detailOfOperation = angular.copy(data);
    vm.data = detailOfOperation;
    vm.data.opData.opName = operationDisplayFormat(CORE.MESSAGE_CONSTANT.OPERATION_DISPlAY_FORMAT, vm.data.opData.opName, vm.data.opData.opNumber);
    vm.EmptyMesssageStock = TRAVELER.TRAVELER_EMPTYSTATE.ASSEMBLY_STOCK;
    vm.EmptyMesssageInOut = TRAVELER.TRAVELER_EMPTYSTATE.INOUT;
    vm.DateTimeFormat = _dateTimeDisplayFormat;
    vm.debounceConstant = CORE.Debounce;
    vm.themeClass = CORE.THEME;
    vm.LOOP_OPERATION_PASS_QTY_INFORMATION = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MFG.LOOP_OPERATION_PASS_QTY_INFORMATION;
    /* hyperlink go for part list page */
    vm.goToPartList = () => {
      BaseService.goToPartList();
    };

    /* go to particular assy */
    vm.goToPartDetails = () => {
        BaseService.goToComponentDetailTab(null, data.partID);
      return false;
    };
    //redirect to work order list
    vm.goToWorkorderList = () => {
      BaseService.goToWorkorderList();
      return false;
    }

    vm.goToWorkorderDetails = (woData) => {
      BaseService.goToWorkorderDetails(woData.woID);
      return false;
    }

    //Set md-data table configuration
    vm.selectedItems = [];
    vm.query = {
      order: '',
      search: '',
      stock_search: '',
    };
    vm.emptySearch = CORE.EMPTYSTATE.EMPTY_SEARCH;
    vm.LabelConstant = angular.copy(CORE.LabelConstant);
    vm.headerdata = [];

    vm.cancel = (data) => {
      $mdDialog.cancel(data);
    };

    vm.enableChangeTravelerHistory = BaseService.checkFeatureRights(CORE.FEATURE_NAME.ChangeTravelerHistory);

    //Get Start/Stop Employee History Data Transactiowise.
    vm.getOperationHistory = () => {
      vm.headerdata = [];
      vm.ChildEmployeeData = [];
      let objs = {
        woOPID: vm.data.opData.woOPID,
        employeeID: vm.data.employeeID,
      }
      vm.cgBusyLoading = WorkorderTransFactory.retrieveWorkorderTransDetails().query({ operationObj: objs }).$promise.then((inoutDetails) => {
        vm.TravelerData = (inoutDetails.data ? inoutDetails.data : []);
        let ChildEmployeeData = vm.TravelerData.woTransEmpInoutDetails;
        vm.TravelerData.totalTimeInSec = 0;
        vm.TravelerData.totalProductionTimeInSec = 0;
        _.each(ChildEmployeeData, (item) => {
          item.checkinTime = $filter('date')(item.checkinTime, vm.DateTimeFormat);
          item.checkoutTime = $filter('date')(item.checkoutTime, vm.DateTimeFormat);
          if (!item.isSetup) {
            vm.TravelerData.totalProductionTimeInSec += item.productionTime ? item.productionTime : 0;
          }
          vm.TravelerData.totalTimeInSec += item.totalTime ? item.totalTime : 0;
          item.totalTime = vm.secondsToTime(item.totalTime);
          item.productionTime = item.isSetup ? "-" : vm.secondsToTime(item.productionTime);
          item.activityType = item.isSetup ? vm.LabelConstant.Traveler.SetupLabel : vm.LabelConstant.Traveler.ProductionLabel;
          _.each(item.workorderTransEmpinoutAll, (data) => {
            data.checkinTime = $filter('date')(data.checkinTime, vm.DateTimeFormat);
            data.checkoutTime = $filter('date')(data.checkoutTime, vm.DateTimeFormat);
            data.productionTime = item.isSetup ? "-" : vm.secondsToTime(data.productionTime);
            data.totalTime = vm.secondsToTime(data.totalTime);
          });
        });
        vm.ChildEmployeeData = angular.copy(ChildEmployeeData);
        if (vm.TravelerData) {
          vm.headerdata.push({ label: vm.LabelConstant.Traveler.Totaltime, value: vm.secondsToTime(vm.TravelerData.totalTimeInSec), displayOrder: (vm.headerdata.length + 1) });
          vm.headerdata.push({ label: vm.LabelConstant.Traveler.Productiontime, value: vm.secondsToTime(vm.TravelerData.totalProductionTimeInSec), displayOrder: (vm.headerdata.length + 1) });
          vm.headerdata.push({ label: vm.LabelConstant.Traveler.IssueQty, value: vm.TravelerData.totalIssueQty, displayOrder: (vm.headerdata.length + 1) });
        }
        vm.headerdata.push({
          value: data.opData.PIDCode,
          label: CORE.LabelConstant.Assembly.ID,
          displayOrder: (vm.headerdata.length + 1),
          labelLinkFn: vm.goToPartList,
          valueLinkFn: vm.goToPartDetails,
          isCopy: true,
          imgParms: {
            imgPath: data.rohsIcon,
            imgDetail: data.rohsName
          }
        });
        vm.headerdata.push({
          label: vm.LabelConstant.Workorder.WO, value: vm.data.woNumber, displayOrder: (vm.headerdata.length + 1), labelLinkFn: vm.goToWorkorderList,
          valueLinkFn: vm.goToWorkorderDetails,
          valueLinkFnParams: { woID: data.woID }
        });
        vm.headerdata.push({ label: vm.LabelConstant.Workorder.Version, value: vm.data.woVersion, displayOrder: (vm.headerdata.length + 1) });
      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }

    //Get Stock History Data Transactionwise.
    vm.getStockHistory = () => {
      let objs = {
        woOPID: vm.data.opData.woOPID
      }
      vm.cgBusyLoading = WorkorderTransFactory.retrieveWorkorderOperationStockDetails().query({ operationObj: objs }).$promise.then((production) => {
        let stockdata = [];
        vm.ProductionStockData = (production.data ? production.data : []);
        if (vm.ProductionStockData && vm.ProductionStockData.woTransProductionDetails && vm.ProductionStockData.woTransProductionDetails.length > 0) {
          vm.stockData = _.groupBy(vm.ProductionStockData.woTransProductionDetails, 'woTransID');
        }
        if (vm.stockData) {
          _.each(vm.stockData, (item) => {
            item.TotalQtywoTransIdwise = _.sumBy(item, function (o) {
              return (o.totalQty);
            });
            item.TotalPassQtywoTransIdwise = _.sumBy(item, function (o) {
              return (o.passQty);
            });
            item.TotalReprocessQtywoTransIdwise = _.sumBy(item, function (o) {
              return (o.reprocessQty);
            });
            item.TotalReworkQtywoTransIdwise = _.sumBy(item, function (o) {
              return (o.reworkQty);
            });
            item.TotalObservedQtywoTransIdwise = _.sumBy(item, function (o) {
              return (o.observedQty);
            });
            item.TotalScrapQtywoTransIdwise = _.sumBy(item, function (o) {
              return (o.scrapQty);
            });
            item.TotalBoardWithMissingPartsQtywoTransIdwise = _.sumBy(item, function (o) {
              return (o.boardWithMissingPartsQty);
            });
            item.TotalBypassQtywoTransIdwise = _.sumBy(item, function (o) {
              return (o.bypassQty);
            });
            let innerdata = [];
            _.each(item, (itemData) => {
              if (itemData.workorderTrans) {
                if (itemData.workorderTrans.checkInEmployee) {
                  item.CheckInemployeeName = itemData.workorderTrans.checkInEmployee.initialName;
                }
                if (itemData.workorderTrans.checkOutEmployee) {
                  item.CheckOutemployeeName = itemData.workorderTrans.checkOutEmployee.initialName;
                }
                item.issueQty = itemData.workorderTrans.issueQty;
              }
              //store inner object in array due to occurs issue on search
              innerdata.push(itemData);
            });

            item.data = innerdata;
            //store item in temporary variable due to convert object into array
            stockdata.push(Object.assign({}, item));

          });
          vm.stockData = stockdata
        }


      }).catch((error) => {
        return BaseService.getErrorLog(error);
      });
    }
    vm.getOperationHistory();

    vm.addEditHistory = (item, ev) => {
      let obj = {
        woNumber: vm.data.woNumber,
        opName: vm.data.opData.opName,
        totalQty: item.totalQty,
        passQty: item.passQty,
        observedQty: item.observedQty,
        reworkQty: item.reworkQty,
        scrapQty: item.scrapQty,
        reprocessQty: item.reprocessQty,
        boardWithMissingPartsQty: item.boardWithMissingPartsQty,
        bypassQty: item.bypassQty,
        isEdit: true,
        isViewHistory: true
      }
      let data = obj;
      DialogFactory.dialogService(
        TRAVELER.ADD_PRODUCTION_STOCK_MODAL_CONTROLLER,
        TRAVELER.ADD_PRODUCTION_STOCK_MODAL_VIEW,
        ev,
        data).then(() => {
        }, () => {
        }, (err) => {
          return BaseService.getErrorLog(err);
        });
    }

    vm.checkItemQty = (Qty) => {
      if (Qty == 0) {
        return Qty;
      } else {
        return Qty ? Qty : CORE.DefaultNotApplicable;
      }
    }

    vm.secondsToTime = (time) => {
      if (time == 0) {
        return secondsToTime(time, true);
      } else {
        return time ? secondsToTime(time, true) : CORE.DefaultNotApplicable;
      }
    }
  }
})();
